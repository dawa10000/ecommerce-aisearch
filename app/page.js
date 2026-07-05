'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { useCart } from './context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();

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
    const res = await fetch('api/ai-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setProducts(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">AI Marketplace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Discover curated products from Kathmandu
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse local favorites, search smarter, and shop with confidence from your favorite marketplace.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500"
            />
            <button
              className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-48 bg-slate-100">
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
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium uppercase tracking-wide text-amber-600">
                    {product.category}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{product.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">${product.price}</span>
                    <div className="flex gap-2">
                      <Link href={`/product/${product._id}`} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="rounded-full bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                      >
                        Add
                      </button>
                    </div>
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
