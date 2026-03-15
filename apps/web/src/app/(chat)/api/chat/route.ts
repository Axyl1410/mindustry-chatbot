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
import { z } from "zod";

const MAX_CHUNK_CHARS = 6000;
const MAX_CONTEXT_CHARS = 42_000;

const MIGRATION_LINE = /^\d+\.0\s/;

const MENU_PREFIXES = [
  "Modding Classes",
  "Blocks",
  "Items",
  "Liquids",
  "Logic",
  "Modding",
  "Planets",
  "Statuses",
  "Units",
  "Servers",
  "Data Patches",
  "Frequently Asked Questions",
  "Glossary",
  "Writing and Editing Code",
  "Variables and Constants",
  "Plugins & JVM Mods",
  "Scripting",
  "Spriting",
  "Markup",
  "Types",
  "Migration Guide",
];

function cleanWikiText(text: string, maxLen = MAX_CHUNK_CHARS): string {
  const limited = text.length > maxLen ? text.slice(0, maxLen) : text;
  // Remove image tags ![]()
  let out = limited.replace(/!\[[^\]]*\]\([^)]+\)/g, "");
  // Empty links: [](/wiki/items/3-graphite) -> Graphite
  out = out.replace(
    /\[\s*\]\([^)]*\/[0-9]+-([a-zA-Z0-9-]+)\/?\)/g,
    (_, name) => {
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
    }
  );
  // Links with text: keep text only
  out = out.replace(/\[([^\]]*)\]\([^)]+\)/g, "$1");
  out = out.replace(/Skip to content/gi, "");
  // Menu lines: drop lines that are "* MenuTitle" or "* 1.0 Migration..."
  out = out
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t.startsWith("*")) {
        return true;
      }
      const rest = t.slice(1).trim();
      const isMenu = MENU_PREFIXES.some((p) => rest.startsWith(p));
      const isMigration = MIGRATION_LINE.test(rest);
      return !(isMenu || isMigration);
    })
    .join("\n");
  out = out
    .replace(/[ \t]+$/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

function* buildContextChunks(
  chunks: Array<{ text: string; item: { key: string } }>
): Generator<string, void, unknown> {
  let total = 0;
  for (const item of chunks) {
    if (total >= MAX_CONTEXT_CHARS) {
      break;
    }
    const cleaned = cleanWikiText(item.text);
    const block = `<file name="${item.item.key}">\n${cleaned}\n</file>`;
    total += block.length;
    yield block;
  }
}

function buildContextString(
  chunks: Array<{ text: string; item: { key: string } }>
): string {
  return [...buildContextChunks(chunks)].join("\n\n");
}

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  const { messages }: { messages: UIMessage[] } = await req.json();

  const aigateway = createAiGateway({
    accountId: env.ACCOUNT_ID,
    gateway: env.GATEWAY,
    apiKey: env.APIKEY,
  });

  const unified = createUnified();

  const result = streamText({
    model: aigateway(unified("workers-ai/@cf/nvidia/nemotron-3-120b-a12b")),
    system: `
    IDENTITY
    You are a professional chatbot specialized in the factory simulation game Mindustry.

    GUIDELINES
    1. For general greetings, small talk, thanks, or questions outside of Mindustry: respond directly and briefly. DO NOT use the search tool.
    2. For any questions about Mindustry mechanics, blocks, units, strategies, guides, etc.: you MUST use the 'searchMindustryWiki' tool to find verified information before answering.
    3. Base your technical answers ONLY on the context returned by the tool. Do not hallucinate.
    4. If the tool returns "No data found", explicitly tell the user that you don't have that specific information in the knowledge base and suggest rephrasing.
    5. For questions outside Mindustry scope, respond with "This assistant only answers questions about the game Mindustry."
    `,
    messages: await convertToModelMessages(messages),
    tools: {
      searchMindustryWiki: tool({
        description:
          "Search the Mindustry knowledge base for information about blocks, units, mechanics, and guides. Use this whenever the user asks a question about the game.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The search query extracted from the user's message."),
        }),
        execute: async ({ query }: { query: string }) => {
          const searchResult = await env.AI.aiSearch()
            .get("fancy-brook-3022")
            .search({
              messages: [{ role: "user" as const, content: query }],
            });

          if (!searchResult.chunks || searchResult.chunks.length === 0) {
            return "No data found for this query in the knowledge base.";
          }

          return buildContextString(searchResult.chunks);
        },
      }),
    },
    maxOutputTokens: 4096,
    stopWhen: stepCountIs(3),
    experimental_transform: smoothStream(),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
