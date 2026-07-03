export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { setServers } = await import("node:dns/promises");
    setServers(["1.1.1.1", "8.8.8.8"]);
  }
}
