"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/supabase";

const empty = {
  brand_name: "",
  product_name: "",
  category: CATEGORIES[0] as string,
  image_url: "",
  brand_url: "",
  date_spotted: new Date().toISOString().slice(0, 10),
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit() {
    setStatus("saving");
    setMessage("");
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("ok");
      setMessage(`Added "${form.product_name}" to the feed.`);
      setForm({ ...empty, category: form.category });
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--ink)]";

  return (
    <main className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display font-bold text-2xl tracking-tight mb-1">Spot an ad</h1>
      <p className="text-sm text-[var(--gray)] mb-8">
        Admin only. Use a Meta Ad Library image URL or a product image from the
        brand&apos;s own site.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium mb-1.5">Admin password</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5">Brand name</label>
            <input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} className={inputCls} placeholder="Glossier" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5">Product name</label>
            <input value={form.product_name} onChange={(e) => set("product_name", e.target.value)} className={inputCls} placeholder="Cloud Paint blush" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5">Date spotted</label>
            <input type="date" value={form.date_spotted} onChange={(e) => set("date_spotted", e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium mb-1.5">Image URL</label>
          <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-[13px] font-medium mb-1.5">Brand URL</label>
          <input value={form.brand_url} onChange={(e) => set("brand_url", e.target.value)} className={inputCls} placeholder="https://brand.com/product" />
        </div>

        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.image_url} alt="Preview" className="rounded-lg border border-[#cccccc] max-h-72" />
        )}

        <button
          onClick={submit}
          disabled={status === "saving"}
          className="w-full rounded-full bg-[var(--ink)] text-white py-2.5 text-sm font-semibold hover:opacity-85 disabled:opacity-50"
        >
          {status === "saving" ? "Saving..." : "Add to feed"}
        </button>

        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-700" : "text-green-700"}`}>{message}</p>
        )}
      </div>
    </main>
  );
}
