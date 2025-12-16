"use client";

import {
  getPhpSession,
  loginPhpSession,
  logoutPhpSession,
  type SessionResponse,
} from "@/api/phpClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("test");
  const [formError, setFormError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

  const loadSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPhpSession();
      setSession(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "세션 정보를 불러오지 못했습니다.");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSession();
  }, []);

  const handleLogin = async () => {
    setBusy(true);
    setFormError(null);
    try {
      await loginPhpSession(username, password);
      await loadSession();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logoutPhpSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그아웃에 실패했습니다.");
    } finally {
      setBusy(false);
      await loadSession();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>PHP 세션 로그인</CardTitle>
          <CardDescription>테스트 계정: 아이디 test / 비밀번호 test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div>세션 확인 중...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : session?.authenticated ? (
            <div className="space-y-3 text-center">
              <div className="text-lg font-semibold">{session.user} 님 로그인됨</div>
              {session.session_id && (
                <div className="text-xs text-slate-500">세션 ID: {session.session_id}</div>
              )}
              <Button variant="outline" onClick={handleLogout} disabled={busy}>
                {busy ? "로그아웃 중..." : "로그아웃"}
              </Button>
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void handleLogin();
              }}
            >
              <div className="space-y-1">
                <label className="block text-sm font-medium" htmlFor="username">
                  아이디
                </label>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium" htmlFor="password">
                  비밀번호
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {formError && <div className="text-sm text-red-600">{formError}</div>}
              <Button className="w-full" type="submit" disabled={busy}>
                {busy ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
