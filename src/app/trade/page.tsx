"use client";

import Link from "next/link";

export default function TradeIndexPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">거래</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link className="text-blue-600 underline" href="/trade/aion2">
            AION2
          </Link>
        </li>
      </ul>
    </main>
  );
}
