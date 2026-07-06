/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  instrumentationHook: true,
  serverExternalPackages: ["@xenova/transformers"],
  outputFileTracingIncludes: {
    "/api/ai-search/**": [
      "./node_modules/@xenova/transformers/**",
      "./node_modules/onnxruntime-web/**",
      "./node_modules/onnxruntime-node/**",
    ],
  },
};

export default nextConfig;
