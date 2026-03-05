import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(_req: Request) {
  const { env } = getCloudflareContext();
  const result = await env.WORKER_SHIKI.add(1, 2);
  return Response.json(result);
}
