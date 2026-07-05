import { pipeline } from "@xenova/transformers";
import connectDB from "../../../lib/db.js";
import Product from "../../../models/Product.js";

// Cache the embedding pipeline so it's only loaded once
let embedderPromise;
function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
}

async function generateVector(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // 384-dimensional vector
}

// Optional: use Groq to expand/clarify the query before embedding it.
// This can help short or vague queries (e.g. "shoes") match better semantically.
async function expandQuery(query) {
  if (!process.env.GROQ_API_KEY) return query;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: `Rewrite this ecommerce search query into a short, descriptive phrase
that captures the product type, likely category, and intent.
Return ONLY the rewritten phrase, nothing else.

Query: ${query}`,
          },
        ],
      }),
    });

    if (!res.ok) return query;

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || query;
  } catch {
    return query;
  }
}

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return Response.json([], { status: 200 });
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Optionally expand the query for richer semantic meaning before embedding
    const expandedQuery = await expandQuery(normalizedQuery);

    // Convert the query into a vector using the same model used at seed time
    const queryVector = await generateVector(expandedQuery);

    await connectDB();

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", // must match the name you gave the index in Atlas/Compass
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 200,
          limit: 20,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          category: 1,
          image: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return Response.json(products);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json([], { status: 200 });
  }
}