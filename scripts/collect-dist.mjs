import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, lstatSync, readlinkSync } from "fs";
import { resolve, join } from "path";
import { execSync } from "child_process";

/** pnpm node_modules의 symlink를 flat 구조로 변환 */
function flattenPnpmModules(nmDir) {
  if (!existsSync(nmDir)) return;
  const pnpmDir = join(nmDir, ".pnpm");
  if (!existsSync(pnpmDir)) return;

  // .pnpm/*/node_modules/ 안의 패키지를 최상위로 복사
  for (const pkg of readdirSync(pnpmDir)) {
    const innerNm = join(pnpmDir, pkg, "node_modules");
    if (!existsSync(innerNm) || !lstatSync(innerNm).isDirectory()) continue;
    for (const mod of readdirSync(innerNm)) {
      const src = join(innerNm, mod);
      const dest = join(nmDir, mod);
      if (existsSync(dest) || mod === ".pnpm") continue;
      if (lstatSync(src).isSymbolicLink()) continue;
      cpSync(src, dest, { recursive: true });
    }
  }

  // 남은 깨진 symlink 제거
  for (const entry of readdirSync(nmDir)) {
    const p = join(nmDir, entry);
    if (lstatSync(p).isSymbolicLink()) rmSync(p, { force: true });
  }

  // .pnpm 제거 (이미 flat 복사됨)
  rmSync(pnpmDir, { recursive: true, force: true });
}

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

// 기존 dist 정리
if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist);

// ── 개별 빌드 ──
execSync("pnpm build", { cwd: resolve(root, "apps/web"), stdio: "inherit" });
execSync("pnpm build", { cwd: resolve(root, "apps/api"), stdio: "inherit" });

// ── Web (Next.js standalone) ──
const webStandalone = resolve(root, "apps/web/.next/standalone");
const webStatic = resolve(root, "apps/web/.next/static");
const webPublic = resolve(root, "apps/web/public");
const webDist = resolve(dist, "web");

// 그대로 복사 후 pnpm symlink를 flat 구조로 변환
cpSync(webStandalone, webDist, { recursive: true });
flattenPnpmModules(resolve(webDist, "node_modules"));
flattenPnpmModules(resolve(webDist, "apps/web/node_modules"));

const webAppDir = resolve(webDist, "apps/web");
if (existsSync(webStatic)) {
  cpSync(webStatic, resolve(webAppDir, ".next/static"), { recursive: true });
}
if (existsSync(webPublic)) {
  cpSync(webPublic, resolve(webAppDir, "public"), { recursive: true });
}
// .env 파일 제거
for (const f of readdirSync(webAppDir)) {
  if (f.startsWith(".env")) rmSync(resolve(webAppDir, f));
}

// ── API (NestJS webpack bundle) ──
cpSync(resolve(root, "apps/api/dist/main.js"), resolve(dist, "api/main.js"));

console.log("✓ dist/web — node dist/web/apps/web/server.js");
console.log("✓ dist/api — node dist/api/main.js");
