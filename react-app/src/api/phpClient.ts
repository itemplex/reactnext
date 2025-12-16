// 기본은 동일 도메인 우선, 필요하면 환경변수로 여러 PHP 엔드포인트를 배열에 추가해 순차 시도.
const phpApiUrls = Array.from(
  new Set([
    "/api/echo.php",
    ...(process.env.NEXT_PUBLIC_PHP_API_URLS
      ? process.env.NEXT_PUBLIC_PHP_API_URLS.split(",").map((u) => u.trim()).filter(Boolean)
      : []),
    ...(process.env.NEXT_PUBLIC_PHP_API_URL ? [process.env.NEXT_PUBLIC_PHP_API_URL] : []),
  ])
);
const phpAuthUrls = phpApiUrls.map((url) => url.replace(/\/[^/]*$/, "/auth.php"));

const shouldAllowInsecure = process.env.ALLOW_INSECURE_SSL === "true";

const toAbsoluteIfNeeded = (url: string) => {
  if (typeof window === "undefined" && url.startsWith("/")) {
    return `http://localhost${url}`;
  }
  return url;
};

const fetchWithTimeout = async (url: string, init?: RequestInit, ms = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const fetchJson = async (url: string, init?: RequestInit) => {
  if (shouldAllowInsecure && typeof window === "undefined") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const res = await fetchWithTimeout(toAbsoluteIfNeeded(url), init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : `API error ${res.status}`;
    throw new Error(message);
  }
  return data;
};

export type SessionResponse = { authenticated: boolean; user?: string; error?: string };

export async function fetchEcho() {
  if (shouldAllowInsecure && typeof window === "undefined") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let lastErr: unknown;
  for (const url of phpApiUrls) {
    try {
      const target = toAbsoluteIfNeeded(url);
      const res = await fetchWithTimeout(target, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr ?? new Error("API error");
}

export async function getPhpSession(): Promise<SessionResponse> {
  let lastErr: unknown;
  for (const url of phpAuthUrls) {
    try {
      return await fetchJson(toAbsoluteIfNeeded(url), {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("API error");
}

export async function loginPhpSession(
  username: string,
  password: string
): Promise<SessionResponse> {
  let lastErr: unknown;
  for (const url of phpAuthUrls) {
    try {
      return await fetchJson(toAbsoluteIfNeeded(url), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("API error");
}

export async function logoutPhpSession(): Promise<SessionResponse> {
  let lastErr: unknown;
  for (const url of phpAuthUrls) {
    try {
      return await fetchJson(toAbsoluteIfNeeded(url), {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("API error");
}
