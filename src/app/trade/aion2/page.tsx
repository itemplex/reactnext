"use client";

import Link from "next/link";

export default function Aion2IndexPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AION2</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link className="text-blue-600 underline" href="/trade/aion2/game-money">
            게임머니
          </Link>
        </li>
      </ul>
    </main>
  );
}
