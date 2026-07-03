import connectDB from "../../../lib/db.js";
import Product from "../../../models/Product.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getAIKeywords(query) {
  if (!process.env.GROQ_API_KEY) return [];

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
            content: `You are an ecommerce search assistant.
Generate exactly 10 relevant product keywords based on the query.
Include synonyms, categories, and related items.
Return ONLY comma separated words, nothing else.

Query: ${query}`,
          },
        ],
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";

    return text
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 2);
  } catch {
    return [];
  }
}

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== "string") {
      return Response.json([], { status: 200 });
    }

    const normalizedQuery = query.trim().toLowerCase();
    const aiKeywords = await getAIKeywords(normalizedQuery);

    const keywords = [...new Set(
      [...aiKeywords, ...normalizedQuery.split(" ")]
        .flatMap((k) => k.split(/\s+/))
        .filter((k) => k.length > 2)
    )];

    if (keywords.length === 0) {
      return Response.json([], { status: 200 });
    }

    const pattern = keywords.map((k) => `\\b${escapeRegex(k)}\\b`).join("|");

    await connectDB();

    const products = await Product.find({
      $or: [
        { title: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
        { category: { $regex: pattern, $options: "i" } },
      ],
    }).limit(20);

    return Response.json(products);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json([], { status: 200 });
  }
}