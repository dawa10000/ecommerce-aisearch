'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const match = data.find((item) => item._id === productId);
        setProduct(match || null);
      } catch (error) {
        console.error('Failed to load product', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">Loading product...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-amber-500 px-5 py-3 font-semibold text-white">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={product.image}
            alt={product.title}
            width={800}
            height={600}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-6">
            <div>
              <p className="text-sm text-slate-500">Price</p>
              <p className="text-3xl font-semibold text-slate-900">${product.price}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
