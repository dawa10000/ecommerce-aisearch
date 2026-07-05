import { pipeline } from "@xenova/transformers";
import connectDB from "../../../lib/db.js";
import Product from "../../../models/Product.js";

// Cache the embedding pipeline so it's only loaded once (not per-request)
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

export async function GET() {
  await connectDB();
  await Product.deleteMany();

  const products = [
    {
      title: "Premium Blue Sneakers for Men - Stylish Comfortable Casual Running Walking Shoes",
      description: "High-quality blue sneakers designed for comfort, durability, and modern style.",
      price: 59.99,
      category: "Footwear",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Wireless Earbuds - Compact Bluetooth Sound with Charging Case",
      description: "True wireless earbuds with crisp audio, touch controls, and a compact charging case. Great for workouts, commuting, and calls on the go.",
      price: 49.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Stainless Steel Insulated Travel Mug - Hot and Cold Coffee Tumbler",
      description: "Double-walled stainless steel mug that keeps drinks hot or cold for hours. Leak-proof lid, ideal for commuting, camping, and office use.",
      price: 18.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Floral Summer Dress - Lightweight Casual Beach Sundress",
      description: "Breathable floral print dress perfect for summer outings, beach trips, and casual daywear. Soft fabric with a relaxed, flattering fit.",
      price: 34.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Mechanical Gaming Keyboard - RGB Backlit Wired Keyboard for PC",
      description: "Durable mechanical keyboard with customizable RGB lighting and responsive keys. Built for gaming, typing, and productivity.",
      price: 54.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Ceramic Non-Stick Frying Pan - Scratch Resistant Kitchen Cookware",
      description: "Non-stick ceramic frying pan with even heat distribution and scratch-resistant coating. Suitable for all stovetops including induction.",
      price: 27.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Waterproof Rain Jacket - Lightweight Hooded Windbreaker",
      description: "Colorful waterproof jacket for kids with adjustable hood and breathable lining. Ideal for rainy days, school, and outdoor play.",
      price: 29.99,
      category: "Kids",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Adjustable Dumbbell Set - Home Gym Strength Training Weights",
      description: "Space-saving adjustable dumbbells with quick-change weight plates. Perfect for home workouts, strength training, and muscle building.",
      price: 89.99,
      category: "Fitness",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Scented Soy Candle - Lavender Vanilla Relaxing Home Fragrance",
      description: "Hand-poured soy candle with a calming lavender vanilla scent. Long burn time, ideal for relaxation, decor, and gifting.",
      price: 16.99,
      category: "Home Decor",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Portable Bluetooth Speaker - Waterproof Outdoor Party Speaker",
      description: "Compact waterproof speaker with rich bass and 12-hour battery life. Great for beach trips, parties, hiking, and outdoor adventures.",
      price: 39.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Running Leggings - High Waist Squat Proof Gym Tights",
      description: "Stretchable high-waist leggings with moisture-wicking fabric. Squat-proof design ideal for yoga, running, and gym workouts.",
      price: 24.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Stainless Steel Chef Knife Set - Professional Kitchen Cutlery",
      description: "Sharp, durable chef knife set with ergonomic handles. Includes storage block, perfect for home cooking and professional kitchens.",
      price: 64.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Building Blocks Set - Educational STEM Construction Toy",
      description: "Colorful building blocks that boost creativity and problem-solving skills. Compatible with major block brands, great for ages 4 and up.",
      price: 32.99,
      category: "Toys",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Formal Blazer - Slim Fit Business Casual Suit Jacket",
      description: "Tailored slim-fit blazer suitable for office wear, interviews, and formal events. Breathable fabric with a modern silhouette.",
      price: 79.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Foldable Laptop Stand - Ergonomic Adjustable Desk Riser",
      description: "Aluminum laptop stand with adjustable height for better posture and airflow. Foldable and portable for home or office use.",
      price: 21.99,
      category: "Accessories",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Resistance Bands Set - Home Workout Exercise Bands with Handles",
      description: "Set of resistance bands with varying tension levels for strength training, physical therapy, and full-body workouts at home.",
      price: 19.99,
      category: "Fitness",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Ceramic Coffee Mug Set - Modern Minimalist Kitchen Mugs",
      description: "Set of matte ceramic mugs with a sleek minimalist design. Microwave and dishwasher safe, perfect for coffee, tea, or gifting.",
      price: 22.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Leather Handbag - Stylish Crossbody Shoulder Bag",
      description: "Elegant leather handbag with adjustable strap and multiple compartments. Perfect for daily use, work, and evening outings.",
      price: 54.99,
      category: "Bags",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Smart LED Light Bulbs - WiFi Color Changing Bulb 4-Pack",
      description: "App-controlled smart bulbs with millions of color options and voice assistant compatibility. Easy setup for smart home lighting.",
      price: 29.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Winter Puffer Jacket - Warm Insulated Outdoor Coat",
      description: "Heavily insulated puffer jacket designed for cold weather. Water-resistant shell with a warm interior lining for winter comfort.",
      price: 74.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Electric Kettle - Fast Boil Stainless Steel Tea Coffee Kettle",
      description: "Rapid-boil electric kettle with auto shut-off and stainless steel body. Ideal for tea, coffee, and instant meals.",
      price: 26.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Plush Teddy Bear - Soft Cuddly Stuffed Animal Toy",
      description: "Extra soft plush teddy bear, perfect for cuddling, gifting, and bedtime comfort. Safe materials suitable for all ages.",
      price: 17.99,
      category: "Toys",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Ankle Boots - Chunky Heel Casual Fall Boots",
      description: "Trendy ankle boots with a comfortable chunky heel. Suitable for fall fashion, casual outings, and everyday wear.",
      price: 49.99,
      category: "Footwear",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Wireless Phone Charger - Fast Charging Pad for Smartphones",
      description: "Sleek wireless charging pad compatible with most smartphones. Fast charging with LED indicator and non-slip base.",
      price: 19.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Slim Fit Chino Pants - Casual Office Everyday Trousers",
      description: "Comfortable slim-fit chinos made from stretch cotton. Versatile for office wear, casual outings, and daily styling.",
      price: 36.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Indoor Plant Pot Set - Modern Ceramic Planters with Drainage",
      description: "Set of minimalist ceramic planters with drainage holes, perfect for succulents, herbs, and indoor decor.",
      price: 24.99,
      category: "Home Decor",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids School Backpack - Lightweight Durable Bag with Compartments",
      description: "Sturdy school backpack with padded straps and multiple compartments for books, lunch, and supplies. Built for daily durability.",
      price: 27.99,
      category: "Bags",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Foam Roller - Deep Tissue Muscle Recovery Massage Roller",
      description: "High-density foam roller for muscle recovery, myofascial release, and pre/post workout stretching.",
      price: 23.99,
      category: "Fitness",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Wool Blend Sweater - Cozy Warm Knit Pullover",
      description: "Soft wool blend sweater ideal for cold weather. Classic knit design suitable for casual and semi-formal wear.",
      price: 42.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Portable Power Bank - 20000mAh Fast Charging Battery Pack",
      description: "High-capacity power bank with fast charging ports for phones, tablets, and other devices. Great for travel and emergencies.",
      price: 34.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Cast Iron Skillet - Pre-Seasoned Durable Cooking Pan",
      description: "Heavy-duty pre-seasoned cast iron skillet suitable for stovetop, oven, and campfire cooking. Retains heat evenly.",
      price: 32.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Athletic Polo Shirt - Moisture Wicking Sports Tee",
      description: "Breathable polo shirt with moisture-wicking fabric, ideal for golf, tennis, and casual athletic wear.",
      price: 24.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Educational Tablet - Learning Toy for Toddlers",
      description: "Interactive learning tablet with games, letters, and numbers designed to support early childhood education.",
      price: 29.99,
      category: "Toys",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Wireless Bra - Seamless Comfortable Everyday Bra",
      description: "Soft, seamless wireless bra designed for all-day comfort. Breathable fabric ideal for daily wear and lounging.",
      price: 21.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Bamboo Cutting Board Set - Eco-Friendly Kitchen Chopping Boards",
      description: "Sustainable bamboo cutting boards in three sizes. Durable, knife-friendly surface ideal for food prep.",
      price: 28.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Waterproof Hiking Boots - Rugged Outdoor Trail Footwear",
      description: "Durable waterproof hiking boots with reinforced soles for grip and stability on rough terrain.",
      price: 84.99,
      category: "Footwear",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Wall Mounted Floating Shelves - Modern Wood Storage Shelves",
      description: "Sleek floating shelves for books, decor, and storage. Easy wall mount installation with a modern wood finish.",
      price: 31.99,
      category: "Home Decor",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Denim Skirt - Casual A-Line Mini Skirt",
      description: "Classic denim mini skirt with an A-line cut. Versatile for casual outings and everyday summer styling.",
      price: 26.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Noise Cancelling Over-Ear Headphones - Studio Quality Sound",
      description: "Premium over-ear headphones with active noise cancellation and deep bass. Ideal for travel, work, and music production.",
      price: 89.99,
      category: "Electronics",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Graphic Print Hoodie - Streetwear Casual Pullover",
      description: "Trendy graphic hoodie made from soft cotton blend. Perfect for casual streetwear and everyday comfort.",
      price: 39.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Air Fryer - Compact Digital Oil-Free Cooking Appliance",
      description: "Digital air fryer with multiple presets for healthier, oil-free cooking. Compact design suitable for small kitchens.",
      price: 69.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Puzzle Set - Wooden Animal Shape Sorting Puzzle",
      description: "Wooden puzzle set featuring animal shapes to help develop fine motor skills and shape recognition in toddlers.",
      price: 15.99,
      category: "Toys",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Yoga Sports Bra - Medium Support Breathable Bra",
      description: "Supportive sports bra with breathable, moisture-wicking fabric. Ideal for yoga, running, and gym sessions.",
      price: 18.99,
      category: "Fitness",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Classic Aviator Sunglasses - UV Protection Eyewear",
      description: "Timeless aviator sunglasses with polarized lenses and full UV protection. Suitable for driving and outdoor activities.",
      price: 22.99,
      category: "Accessories",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Memory Foam Bath Mat - Soft Absorbent Non-Slip Rug",
      description: "Plush memory foam bath mat with a non-slip base. Highly absorbent and quick-drying for bathroom comfort.",
      price: 19.99,
      category: "Home Decor",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Cotton Boxer Briefs 3-Pack - Comfortable Everyday Underwear",
      description: "Breathable cotton boxer briefs with a comfortable fit. Pack of three for everyday reliability and comfort.",
      price: 24.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Kids Balance Bike - No Pedal Training Bike for Toddlers",
      description: "Lightweight balance bike that helps toddlers develop coordination and confidence before switching to a pedal bike.",
      price: 54.99,
      category: "Toys",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Women's Cardigan Sweater - Open Front Knit Layering Piece",
      description: "Lightweight open-front cardigan ideal for layering. Soft knit fabric suitable for fall and spring styling.",
      price: 33.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Digital Kitchen Scale - Precision Food Weighing Scale",
      description: "Compact digital scale with precise gram measurements. Ideal for baking, cooking, and portion control.",
      price: 14.99,
      category: "Home & Kitchen",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
    {
      title: "Men's Waterproof Windbreaker Jacket - Lightweight Outdoor Shell",
      description: "Packable windbreaker jacket with water-resistant coating. Great for hiking, running, and unpredictable weather.",
      price: 44.99,
      category: "Apparel",
      image: `https://picsum.photos/500/300?random=${Math.random()}`,
    },
  ];

  // Generate embeddings sequentially to avoid overloading memory
  // (local model runs on CPU — parallelizing 50 at once can be heavy)
  const productsWithVectors = [];
  for (const product of products) {
    const embedding = await generateVector(
      `${product.title} ${product.description} ${product.category}`
    );
    productsWithVectors.push({ ...product, embedding });
  }

  await Product.insertMany(productsWithVectors);

  return Response.json({ message: "Database seeded successfully" });
}