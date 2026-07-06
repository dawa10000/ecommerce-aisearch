/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  instrumentationHook: true,
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
