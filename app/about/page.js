'use client';

import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">About</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Your intelligent marketplace for Kathmandu</h1>
          <p className="mt-5 text-lg text-slate-600">
            AI Ecommerce App helps local sellers and buyers discover quality products with smart search,
            effortless browsing, and a smooth checkout experience tailored to the Kathmandu market.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smart Discovery",
              text: "Find products quickly with AI-powered recommendations and search.",
            },
            {
              title: "Local Focus",
              text: "Support trusted sellers in Kathmandu with a fast, modern buying experience.",
            },
            {
              title: "Secure Checkout",
              text: "Complete purchases with a streamlined flow designed for convenience.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
