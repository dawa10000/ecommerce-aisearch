import connectDB from "../../../lib/db.js";
import Product from "../../../models/Product.js";

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return Response.json(products);
}