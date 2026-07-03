'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    const res = await fetch("api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setProducts(data)
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Our Products</h1>

          <input onChange={e => setQuery(e.target.value)} value={query} type="text" placeholder='Search products...' className='mt-6 mb-4 w-full rounded-lg border border-slate-300 bg-white text-black p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 \' />
          <button className='rounded-lg bg-gray-500 px-4 py-2 text-white shadow-sm cursor-pointer mb-4 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500' onClick={handleSearch}>Search</button>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-48 bg-gray-100 cursor-pointer">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={240}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">{product.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
