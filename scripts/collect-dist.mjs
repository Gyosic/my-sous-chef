import { cpSync, rmSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

// 기존 dist 정리
if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist);

// Web (Next.js standalone)
const webStandalone = resolve(root, "apps/web/.next/standalone");
const webStatic = resolve(root, "apps/web/.next/static");
const webPublic = resolve(root, "apps/web/public");

cpSync(webStandalone, resolve(dist, "web"), { recursive: true });

// standalone에 복사된 .env 파일 제거
import { readdirSync } from "fs";
const webAppDir = resolve(dist, "web/apps/web");
for (const f of readdirSync(webAppDir)) {
  if (f.startsWith(".env")) rmSync(resolve(webAppDir, f));
}

if (existsSync(webStatic)) {
  cpSync(webStatic, resolve(dist, "web/apps/web/.next/static"), { recursive: true });
}
if (existsSync(webPublic)) {
  cpSync(webPublic, resolve(dist, "web/apps/web/public"), { recursive: true });
}

// API (NestJS)
cpSync(resolve(root, "apps/api/dist"), resolve(dist, "api/dist"), { recursive: true });
cpSync(resolve(root, "apps/api/package.json"), resolve(dist, "api/package.json"));
cpSync(resolve(root, "apps/api/node_modules"), resolve(dist, "api/node_modules"), { recursive: true });

console.log("✓ dist/web  — node dist/web/apps/web/server.js");
console.log("✓ dist/api  — node dist/api/dist/main.js");
