"use client";

import { SessionStatus } from "@/components/SessionStatus";
import { usePhpSession } from "@/hooks/usePhpSession";
import Link from "next/link";

export default function Aion2IndexPage() {
  const { session, loading, error, logout, logoutPending } = usePhpSession();

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">AION2</h1>
        <SessionStatus
          session={session}
          loading={loading}
          error={error}
          onLogout={logout}
          logoutPending={logoutPending}
          redirectHref="/index.php"
          showSessionId
        />
      </div>
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
