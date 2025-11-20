"use client";

import Link from "next/link";
import { Mail, Instagram, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f7] text-[#1d1d1f] border-t border-black/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-5 gap-10">

        {/* Newsletter */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
          <p className="text-sm text-black/60 mb-4">
            Get the latest promotions & product updates.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-black/20 outline-none"
            />
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80">
              <Mail size={18} />
            </button>
          </div>

          <div className="flex gap-4 mt-5">
            <Instagram className="hover:opacity-60 cursor-pointer" />
            <Youtube className="hover:opacity-60 cursor-pointer" />
            <Facebook className="hover:opacity-60 cursor-pointer" />
          </div>
        </div>

        {/* Section Links */}
        <FooterSection
          title="Shop"
          items={["New Arrivals", "Best Sellers", "Categories", "Gift Cards"]}
        />
        <FooterSection
          title="Help"
          items={["FAQs", "Shipping Info", "Returns & Refunds", "Track Order"]}
        />
        <FooterSection
          title="Company"
          items={["About Us", "Careers", "Contact", "Store Locator"]}
        />
      </div>

      {/* Copyright */}
      <div className="border-t border-black/10 py-4 text-center text-sm text-black/60">
        © 2025 Smoethie Vibe. All rights reserved.
      </div>
    </footer>
  );
}

function FooterSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-sm text-black/70">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="hover:text-black">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
