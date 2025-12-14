"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchEcho } from "@/api/phpClient";

export default function GameMoneyPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["echo"],
    queryFn: fetchEcho,
    staleTime: 30_000,
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AION2 게임머니</h1>
      <p className="text-sm text-gray-600">
        PHP API 응답 예시 (public_html/api/echo.php)
      </p>
      <pre className="rounded bg-gray-100 p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
