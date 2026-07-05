'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const shipping = 8;
  const total = subtotal + shipping;
  const isCartEmpty = useMemo(() => cartItems.length === 0, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isCartEmpty) return;

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map((item) => ({
            title: item.title,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal,
          shipping,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to place order');
      }

      setSubmitted(true);
      setToast('Thank you! Your order was placed successfully.');
      clearCart();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      {toast ? (
        <div className="fixed left-1/2 top-4 z-100 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg">
          {toast}
        </div>
      ) : null}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Secure checkout</h1>
          <p className="mt-3 text-slate-600">Enter your delivery details and complete your Kathmandu order.</p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">
              <h2 className="text-xl font-semibold">Thank you for your order!</h2>
              <p className="mt-2">Your order has been placed successfully and is being prepared for delivery.</p>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="firstName" value={formData.firstName} onChange={handleChange} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="First name" required />
                <input name="lastName" value={formData.lastName} onChange={handleChange} className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Last name" required />
              </div>
              <input name="email" value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email address" required type="email" />
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone number" required />
              <input name="address" value={formData.address} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Delivery address" required />
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Delivery notes" />
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button
                type="submit"
                disabled={isCartEmpty || isSaving}
                className="w-full rounded-full bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSaving ? 'Placing order...' : isCartEmpty ? 'Your cart is empty' : 'Place order'}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Accepted payments</p>
            <p className="mt-2 text-sm text-slate-600">Cash on delivery, eSewa, and card payments available.</p>
          </div>

          <Link href="/cart" className="mt-6 inline-flex text-sm font-semibold text-amber-600">
            Back to cart
          </Link>
        </div>
      </section>
    </main>
  );
}
