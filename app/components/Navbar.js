'use client';

import Link from "next/link";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-amber-600">
          AI Ecommerce App
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${link.href === "/cart"
                  ? "text-amber-700 hover:bg-amber-100"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
            >
              {link.label}
              {link.href === "/cart" && itemCount > 0 ? (
                <span className="ml-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
