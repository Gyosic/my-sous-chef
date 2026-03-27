/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactCompiler: true,
};

export default nextConfig;
