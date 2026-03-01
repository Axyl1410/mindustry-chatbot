import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";
import z from "zod";

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
    stopWhen: stepCountIs(5),
    tools: {
      getTime: tool({
        description: "Get the current time in a specific timezone",
        inputSchema: z.object({
          timezone: z
            .string()
            .describe("A valid IANA timezone, e.g. 'Europe/Paris'"),
        }),
        execute: ({ timezone }) => {
          try {
            const now = new Date();
            const time = now.toLocaleString("en-US", {
              timeZone: timezone,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            });

            return { time, timezone };
          } catch {
            return { error: "Invalid timezone format." };
          }
        },
      }),
      getCurrentDate: tool({
        description: "Get the current date and time with timezone information",
        inputSchema: z.object({}),
        execute: () => {
          const now = new Date();
          return {
            timestamp: now.getTime(),
            iso: now.toISOString(),
            local: now.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            utc: now.toUTCString(),
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
