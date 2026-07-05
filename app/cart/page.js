'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Cart</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your selected items</h1>
            </div>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                Clear cart
              </button>
            )}
          </div>

          <div className="mt-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg text-slate-600">Your cart is empty.</p>
                <Link href="/" className="mt-6 inline-flex rounded-full bg-amber-500 px-5 py-3 font-semibold text-white">
                  Continue shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="h-9 w-9 rounded-full border border-slate-200 text-lg"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="h-9 w-9 rounded-full border border-slate-200 text-lg"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item._id)} className="text-sm font-semibold text-rose-500">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>$8.00</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>${(subtotal + 8).toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-8 inline-flex w-full justify-center rounded-full bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
          >
            Proceed to checkout
          </Link>
        </div>
      </section>
    </main>
  );
}
