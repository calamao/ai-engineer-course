import "dotenv/config";
import OpenAI, { APIConnectionError, APIError } from "openai";
import { retry } from "./retry.ts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  maxRetries: 0,
  timeout: Number(process.env.OPENAI_TIMEOUT ?? 5000),
});
const MODEL = process.env.MODELO ?? "fast";
const MAX_TOKENS = Number(process.env.MAX_TOKENS ?? 256);

async function main(): Promise<void> {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  try {
    const response = await retry(
      () =>
        client.chat.completions.create({
          model: MODEL,
          max_completion_tokens: MAX_TOKENS,
          messages: [
            { role: "system", content: "Resume un texto en 3 puntos." },
            { role: "user", content: text },
          ],
        }),
      {
        maxAttempts: 4,
        initialDelayMs: 1000,
        shouldRetry: (error) =>
          error instanceof APIConnectionError ||
          (error instanceof APIError &&
            (error.status === 429 || // Too Many Requests or quote limit exceeded
              (typeof error.status === "number" && error.status >= 500))),
      },
    );

    const choice = response.choices[0];
    const result = choice?.message.content ?? "(empty response)";
    const finishReason = choice?.finish_reason ?? "unknown";

    console.log("\nResult:\n" + result);
    console.log("\n----------------------------------------");
    console.log(`Finish reason: ${finishReason}`);
    if (finishReason === "length") {
      console.warn(
        "Warning: the response was truncated because it reached the max token limit.",
      );
    }
    console.log(
      `[tokens] prompt=${response.usage?.prompt_tokens ?? "n/a"} completion=${response.usage?.completion_tokens ?? "n/a"} total=${response.usage?.total_tokens ?? "n/a"}`,
    );
  } catch (error) {
    console.error("Error while running the AI task.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

await main();
