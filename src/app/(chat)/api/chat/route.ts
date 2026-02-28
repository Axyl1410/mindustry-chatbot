import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  type UIMessage,
} from "ai";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastMessage = messages.at(-1);

  console.log(lastMessage?.parts?.find((part) => part.type === "text")?.text);

  const aigateway = createAiGateway({
    accountId: env.ACCOUNT_ID,
    gateway: env.GATEWAY,
    apiKey: env.APIKEY,
  });

  const unified = createUnified();

  const result = streamText({
    model: aigateway(
      unified("workers-ai/@cf/meta/llama-4-scout-17b-16e-instruct")
    ),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 2048,
    experimental_transform: smoothStream(),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
