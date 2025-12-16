"use client";

import { fetchEcho } from "@/api/phpClient";
import { SessionStatus } from "@/components/SessionStatus";
import { usePhpSession } from "@/hooks/usePhpSession";
import { useEffect, useState } from "react";

export default function GameMoneyPage() {
  const [echoData, setEchoData] = useState<unknown>(null);
  const [echoError, setEchoError] = useState<string | null>(null);
  const [echoLoading, setEchoLoading] = useState<boolean>(true);

  const { session, loading, error, logout, logoutPending } = usePhpSession();

  const loadEcho = async () => {
    setEchoLoading(true);
    setEchoError(null);
    try {
      const res = await fetchEcho();
      setEchoData(res);
    } catch (err) {
      setEchoError(err instanceof Error ? err.message : "API 요청에 실패했습니다.");
    } finally {
      setEchoLoading(false);
    }
  };

  useEffect(() => {
    void loadEcho();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">AION2 게임머니</h1>
        <SessionStatus
          session={session}
          loading={loading}
          error={error}
          onLogout={logout}
          logoutPending={logoutPending}
          redirectHref="/index.php"
        />
      </div>

      <p className="text-sm text-gray-600">PHP API 응답 예시 (public_html/api/echo.php)</p>
      <pre className="rounded bg-gray-100 p-4 text-sm" suppressHydrationWarning>
        {echoLoading
          ? "불러오는 중..."
          : echoError
          ? `에러: ${echoError}`
          : JSON.stringify(echoData, null, 2)}
      </pre>
    </main>
  );
}
