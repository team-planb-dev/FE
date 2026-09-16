import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/*
 * 개발 서버에서는 백엔드를 프록시합니다.
 *
 * 프론트(localhost:5173)와 백엔드(railway)가 다른 출처라서 생기는 문제가 둘 있습니다.
 *  1. 로그인 유지용 `refreshToken` 은 HttpOnly 쿠키인데, 브라우저의 서드파티 쿠키
 *     차단에 걸려 재발급 요청에 실려가지 않습니다. 새로고침하면 로그아웃됩니다
 *  2. WebSocket(`/ws-stomp`)은 서버가 Origin 을 검사해서 핸드셰이크가 거부됩니다
 *
 * `/backend/...` 로 부르면 브라우저가 보기에 같은 출처가 됩니다. SPA 경로
 * (`/login` 등)와 겹치지 않도록 접두사를 따로 뒀습니다. 운영 환경의 같은
 * 역할은 vercel.json의 외부 rewrite가 담당합니다.
 *
 * 주의: 재발급 API는 회전된 refreshToken을 반드시 Set-Cookie로 다시 내려야
 * 합니다. 프록시는 쿠키를 전달할 뿐, 누락된 Set-Cookie를 만들 수 없습니다.
 */
const PROXY_PREFIX = "/backend";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_BASE_URL ?? "";

  return {
    plugins: [react()],
    server: target
      ? {
          proxy: {
            [PROXY_PREFIX]: {
              target,
              changeOrigin: true,
              ws: true,
              // 서버가 Origin 을 검사하므로 서버 자신의 주소로 보냅니다
              headers: { Origin: target },
              // Domain 속성을 떼야 localhost 가 쿠키를 받아줍니다
              cookieDomainRewrite: "",
              // 프록시 접두사와 무관하게 모든 백엔드 요청에 쿠키를 보냅니다
              cookiePathRewrite: "/",
              rewrite: (path) => path.replace(/^\/backend/, ""),
            },
          },
        }
      : undefined,
  };
});
