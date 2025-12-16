"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SessionResponse } from "@/api/phpClient";

type Props = {
  session: SessionResponse | null;
  loading: boolean;
  error: string | null;
  onLogout: () => void;
  logoutPending: boolean;
  redirectHref?: string;
};

export function SessionStatus({
  session,
  loading,
  error,
  onLogout,
  logoutPending,
  redirectHref = "/index.php",
}: Props) {
  return (
    <div className="text-sm text-slate-700">
      {loading ? (
        "로그인 상태 확인 중..."
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : session?.authenticated ? (
        <div className="flex items-center gap-2">
          <span>로그인: {session.user}</span>
          <Button size="sm" variant="outline" onClick={onLogout} disabled={logoutPending}>
            {logoutPending ? "로그아웃 중..." : "로그아웃"}
          </Button>
        </div>
      ) : (
        <Link className="text-blue-600 underline" href={redirectHref}>
          로그인하러 가기
        </Link>
      )}
    </div>
  );
}
