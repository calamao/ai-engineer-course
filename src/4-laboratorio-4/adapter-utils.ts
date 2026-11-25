import {
  APIConnectionError as AnthropicConnectionError,
  APIError as AnthropicAPIError,
} from "@anthropic-ai/sdk";
import {
  APIConnectionError as OpenAIConnectionError,
  APIError as OpenAIAPIError,
} from "openai";

export function getEnvironmentTimeout(
  destination: string,
  format: "openai" | "anthropic",
): number {
  const destinationPrefix = destination.toUpperCase();
  const formatPrefix = format.toUpperCase();
  const value =
    process.env[`${destinationPrefix}_TIMEOUT`] ??
    process.env[`${formatPrefix}_TIMEOUT`] ??
    process.env[format === "openai" ? "OPENAI_TIMEOUT" : "ANTHROPIC_TIMEOUT"] ??
    process.env.AI_TIMEOUT ??
    "5000";
  const timeout = Number(value);
  if (!Number.isFinite(timeout) || timeout <= 0) {
    throw new RangeError(`Invalid timeout for destination "${destination}".`);
  }
  return timeout;
}

export function isTransientError(error: unknown): boolean {
  if (error instanceof OpenAIConnectionError || error instanceof AnthropicConnectionError) {
    return true;
  }

  if (error instanceof OpenAIAPIError || error instanceof AnthropicAPIError) {
    const status = error.status;
    return status === 429 || (typeof status === "number" && status >= 500);
  }

  if (error instanceof Error) {
    return /timeout|timed out|ECONNRESET|ETIMEDOUT/i.test(error.message);
  }

  return false;
}

export function isRequestError(error: unknown): boolean {
  if (error instanceof OpenAIAPIError || error instanceof AnthropicAPIError) {
    return error.status === 400;
  }
  return false;
}
