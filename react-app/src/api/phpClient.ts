const phpApiUrls =
  process.env.NEXT_PUBLIC_PHP_API_URLS?.split(",").map((u) => u.trim()).filter(Boolean) ??
  (process.env.NEXT_PUBLIC_PHP_API_URL
    ? [process.env.NEXT_PUBLIC_PHP_API_URL]
    : ["http://www.reactnext.com/api/echo.php"]);

export async function fetchEcho() {
  // 자체서명 등 TLS 검증 오류를 우회해야 할 때만 사용 (서버 사이드 전용)
  if (process.env.ALLOW_INSECURE_SSL === "true" && typeof window === "undefined") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let lastErr: unknown;
  for (const url of phpApiUrls) {
    try {
      const target =
        typeof window === "undefined" && url.startsWith("/")
          ? `http://localhost${url}`
          : url;
      const res = await fetch(target, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr ?? new Error("API error");
}
