import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createAdapter, isRequestError, isTransientError } from "./adapters.ts";
import type { LabConfig, UnifiedResponse } from "./types.ts";

const CONFIG_PATH = path.join(import.meta.dirname, "config.json");
const MAX_TOKENS = Number(process.env.MAX_TOKENS ?? 256);

function loadConfig(): LabConfig {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) as LabConfig;
  if (!config.logical_models || !config.destinations) {
    throw new Error("Invalid config.json: logical_models and destinations are required.");
  }
  return config;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runWithFallback(
  logicalModel: string,
  config: LabConfig,
  text: string,
  systemMessage: string,
): Promise<UnifiedResponse> {
  const destinations = config.logical_models[logicalModel];
  if (!destinations?.length) {
    throw new Error(`Unknown logical model "${logicalModel}".`);
  }

  let lastError: unknown;
  for (const target of destinations) {
    const destination = config.destinations[target.destination];
    if (!destination) {
      lastError = new Error(`Missing destination configuration "${target.destination}".`);
      console.error(`[fallback] ${target.destination}: ${errorMessage(lastError)}`);
      continue;
    }

    try {
      const adapter = createAdapter(destination.format, destination);
      return await adapter.complete(
        { text, system: systemMessage, maxTokens: MAX_TOKENS },
        target.model,
        target.destination,
      );
    } catch (error) {
      lastError = error;
      const message = errorMessage(error);
      console.error(`[fallback] ${target.destination}: ${message}`);

      if (isRequestError(error)) {
        throw new Error(
          `Request failed at destination "${target.destination}": ${message}`,
          { cause: error },
        );
      }
      if (!isTransientError(error)) {
        throw new Error(
          `Request failed at destination "${target.destination}": ${message}`,
          { cause: error },
        );
      }
    }
  }

  throw new Error(
    `All destinations failed; last destination "${destinations.at(-1)?.destination ?? "unknown"}": ${errorMessage(lastError)}`,
    { cause: lastError },
  );
}

async function main(): Promise<void> {
  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const systemMessage = "Resume un texto en 3 puntos.";
  const logicalModel = process.argv[2] ?? process.env.MODELO ?? "rapido";

  try {
    const config = loadConfig();
    const result = await runWithFallback(logicalModel, config, text, systemMessage);

    console.log("\nResult:\n" + result.text);
    console.log("\n----------------------------------------");
    console.log(`Finish reason: ${result.finishReason}`);
    console.log(
      `[tokens] input=${result.usage.input ?? "n/a"} output=${result.usage.output ?? "n/a"} total=${result.usage.total ?? "n/a"}`,
    );
    console.log(`[model] ${result.model}`);
    console.log(`[destination] ${result.destination}`);
  } catch (error) {
    console.error("Error while running the AI task.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

await main();
