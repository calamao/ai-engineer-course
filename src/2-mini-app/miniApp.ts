import "dotenv/config";
import OpenAI from "openai";
import {
  getSystemPrompt,
  parseCliArgs,
  printUsage,
  readInputText,
  type CliOptions,
} from "./lib/cli.ts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

function printSummary(options: CliOptions, text: string): void {
  console.log("=== Mini App: AI task runner ===");
  console.log(`Task: ${options.task}`);
  console.log(`Model: ${options.model}`);
  console.log(`Temperature: ${options.temperature}`);
  console.log(`Max completion tokens: ${options.maxTokens}`);
  console.log(`Input bytes: ${new TextEncoder().encode(text).length}`);
  console.log(`Input preview: ${text.slice(0, 120).replace(/\s+/g, " ").trim()}${text.length > 120 ? "..." : ""}`);
  console.log("----------------------------------------");
}

async function main(): Promise<void> {
  try {
    const options = parseCliArgs(process.argv.slice(2));

    if (options.showHelp) {
      printUsage();
      return;
    }

    const text = (await readInputText(options)).trim();

    if (!text) {
      console.error(
        'Error: no input text was provided. Example: npm run practice-2 -- --task classifier "The user cannot access their account."',
      );
      console.error("No model request was made.");
      printUsage();
      process.exitCode = 1;
      return;
    }

    printSummary(options, text);

    const startedAt = Date.now();
    const response = await client.chat.completions.create({
      model: options.model,
      temperature: options.temperature,
      max_completion_tokens: options.maxTokens,
      messages: [
        { role: "system", content: getSystemPrompt(options.task) },
        { role: "user", content: text },
      ],
    });
    const elapsedMs = Date.now() - startedAt;

    const choice = response.choices[0];
    const result = choice?.message.content ?? "(empty response)";
    const finishReason = choice?.finish_reason ?? "unknown";

    console.log("\nResult:\n" + result);
    console.log("\n----------------------------------------");
    console.log(`Finish reason: ${finishReason}`);
    if (finishReason === "length") {
      console.warn("Warning: the response was truncated because it reached the max token limit.");
    }
    console.log(
      `[tokens] prompt=${response.usage?.prompt_tokens ?? "n/a"} completion=${response.usage?.completion_tokens ?? "n/a"} total=${response.usage?.total_tokens ?? "n/a"}`,
    );
    console.log(`[time] ${elapsedMs} ms`);
  } catch (error) {
    console.error("Error while running the AI task.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

await main();
