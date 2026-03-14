import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { createAiGateway } from "ai-gateway-provider";
import { createUnified } from "ai-gateway-provider/providers/unified";

function cleanWikiText(text: string) {
  return (
    text
      // 1. Remove image tags ![]()
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      // 2. Recover material name from URL for empty links (e.g. [](/wiki/items/3-graphite) -> Graphite)
      .replace(
        /\[\s*\]\([^)]*\/[0-9]+-([a-zA-Z0-9-]+)\/?\)/g,
        (_match, itemName) =>
          itemName.charAt(0).toUpperCase() +
          itemName.slice(1).replace(/-/g, " ")
      )
      // 3. Keep the text of links that contain characters, remove the URL
      .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
      // 4. Remove "Skip to content" text
      .replace(/Skip to content/gi, "")
      // 5. Remove redundant menu entries
      .replace(
        /^\s*\*\s*(Modding Classes|Blocks|Items|Liquids|Logic|Modding|Planets|Statuses|Units|Servers|Data Patches|Frequently Asked Questions|Glossary|Writing and Editing Code|Variables and Constants|Plugins & JVM Mods|Scripting|Spriting|Markup|Types|[0-9]\.0 Migration Guide).*$/gm,
        ""
      )
      // 6. Remove extra whitespace and blank lines
      .replace(/[ \t]+$/gm, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function buildContextChunks(
  chunks: Array<{ text: string; item: { key: string } }>
) {
  return chunks
    .map(
      (item) =>
        `<file name="${item.item.key}">\n${cleanWikiText(item.text)}\n</file>`
    )
    .join("\n\n");
}

export async function POST(req: Request) {
  const { env } = getCloudflareContext();
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastMessage = messages.at(-1);
  const lastMessageText =
    lastMessage?.parts?.find((part) => part.type === "text")?.text ?? "";

  const searchResult = await env.AI.aiSearch()
    .get("fancy-brook-3022")
    .search({
      messages: lastMessage
        ? [
            {
              role: lastMessage.role,
              content: lastMessageText,
            },
          ]
        : [],
    });

  const chunks = buildContextChunks(searchResult.chunks);

  const aigateway = createAiGateway({
    accountId: env.ACCOUNT_ID,
    gateway: env.GATEWAY,
    apiKey: env.APIKEY,
  });

  const unified = createUnified();

  if (searchResult.chunks.length === 0) {
    const result = streamText({
      model: aigateway(unified("workers-ai/@cf/openai/gpt-oss-20b")),
      system: `
      You are a helpful assistant. Explain clearly to the user that no relevant data was found in the current knowledge base for their query, and suggest that they try rephrasing or asking a different question.
      `,
      prompt: `No data found for query: "${lastMessageText}". Please let the user know there is currently no matching information in the knowledge base for this query.`,
      maxOutputTokens: 4096,
      experimental_transform: smoothStream(),
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });
  }

  const result = streamText({
    model: aigateway(unified("workers-ai/@cf/openai/gpt-oss-20b")),
    system: `
    IDENTITY
    You are a professional chatbot specialized in the factory simulation game Mindustry.

    GUIDELINES
    1. ACCURACY OVER SPEED: Prioritize factual correctness. You MUST treat the content in <context> as your primary source of truth.
    2. USE CONTEXT WELL: If the <context> contains any information that is related to the question—even partially—synthesize and combine it into a clear answer. Only say "I do not have enough verified data" when the context has nothing relevant at all.
    3. NO HALLUCINATIONS: Do not invent facts. Stick to what is stated or clearly implied in the context. For details not in the context, you may say you don't have that specific detail while still answering from what is available.
    4. SCOPE LIMIT: Only answer questions related to the Mindustry game (mechanics, blocks, units, logic, strategies, maps, etc.). For anything outside Mindustry, respond with "This assistant only answers questions about the game Mindustry."
    Use the following information to answer the question:
    <context>
    ${chunks}
    </context>
    <question>
    ${lastMessageText}
    </question>
  `,
    messages: await convertToModelMessages(lastMessage ? [lastMessage] : []),
    maxOutputTokens: 4096,
    experimental_transform: smoothStream(),
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
