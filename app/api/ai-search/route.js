import { pipeline } from "@xenova/transformers";
import connectDB from "../../../lib/db.js";
import Product from "../../../models/Product.js";


const MAX_QUERY_LENGTH = 200;
const GROQ_TIMEOUT_MS = 2500;
const MIN_SCORE = 0.65;
const RESULT_LIMIT = 20;
const NUM_CANDIDATES = 200;
const QUERY_CACHE_TTL_MS = 10 * 60 * 1000;
const QUERY_CACHE_MAX_ENTRIES = 500;


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


const queryCache = new Map();

function getCached(key) {
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    queryCache.delete(key);
    return null;
  }
  return entry.results;
}

function setCached(key, results) {
  if (queryCache.size >= QUERY_CACHE_MAX_ENTRIES) {
    const oldestKey = queryCache.keys().next().value;
    queryCache.delete(oldestKey);
  }
  queryCache.set(key, { results, expiresAt: Date.now() + QUERY_CACHE_TTL_MS });
}


async function expandQuery(query) {
  if (!process.env.GROQ_API_KEY) return query;
  if (query.split(/\s+/).length > 4) return query;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

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
        max_tokens: 40,
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
      signal: controller.signal,
    });

    if (!res.ok) return query;

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || query;
  } catch (err) {

    console.warn("expandQuery fallback:", err.message);
    return query;
  } finally {
    clearTimeout(timeout);
  }
}

function validateQuery(query) {
  if (!query || typeof query !== "string") return null;
  const trimmed = query.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_QUERY_LENGTH);
}


function buildFilter({ category, minPrice, maxPrice }) {
  const filter = {};
  if (category) filter.category = category;
  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null) filter.price.$gte = Number(minPrice);
    if (maxPrice != null) filter.price.$lte = Number(maxPrice);
  }
  return filter;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = validateQuery(body?.query);

    if (!query) {
      return Response.json([], { status: 200 });
    }


    const filter = buildFilter(body);
    const cacheKey = JSON.stringify({ q: query.toLowerCase(), filter });

    const cached = getCached(cacheKey);
    if (cached) {
      return Response.json(cached);
    }


    const expandedQuery = await expandQuery(query);
    const queryVector = await generateVector(expandedQuery);

    await connectDB();

    const pipeline_ = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: NUM_CANDIDATES,
          limit: RESULT_LIMIT,
          ...(Object.keys(filter).length ? { filter } : {}),
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
      { $match: { score: { $gte: MIN_SCORE } } },
    ];

    const startTime = Date.now();
    const products = await Product.aggregate(pipeline_);

    setCached(cacheKey, products);
    const endTime = Date.now();
    console.log(`Query executed in ${endTime - startTime} ms`)
    return Response.json(products);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json([], { status: 200 });
  }
}