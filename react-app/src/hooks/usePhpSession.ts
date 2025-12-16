import {
  getPhpSession,
  logoutPhpSession,
  type SessionResponse,
} from "@/api/phpClient";
import { useCallback, useEffect, useState } from "react";

export function usePhpSession() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutPending, setLogoutPending] = useState<boolean>(false);

  const loadSession = useCallback(async () => {
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
  }, []);

  const logout = useCallback(async () => {
    setLogoutPending(true);
    try {
      await logoutPhpSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그아웃에 실패했습니다.");
    } finally {
      setLogoutPending(false);
      void loadSession();
    }
  }, [loadSession]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  return { session, loading, error, logout, logoutPending, reload: loadSession };
}
