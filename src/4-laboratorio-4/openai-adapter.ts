import OpenAI from "openai";
import { getEnvironmentTimeout } from "./adapter-utils.ts";
import type {
  Adapter,
  CompletionRequest,
  DestinationConfig,
  UnifiedResponse,
} from "./types.ts";

export function createOpenAIAdapter(config: DestinationConfig): Adapter {
  return {
    async complete(
      request: CompletionRequest,
      model: string,
      destination: string,
    ): Promise<UnifiedResponse> {
      const apiKey = process.env[config.api_key_env];
      const baseURL = process.env[config.base_url_env];
      if (!apiKey) {
        throw new Error(`Missing environment variable ${config.api_key_env}.`);
      }
      if (!baseURL) {
        throw new Error(`Missing environment variable ${config.base_url_env}.`);
      }

      const client = new OpenAI({
        apiKey,
        baseURL,
        maxRetries: 0,
        timeout: getEnvironmentTimeout(destination, "openai"),
      });
      const response = await client.chat.completions.create({
        model,
        max_completion_tokens: request.maxTokens,
        messages: [
          ...(request.system ? [{ role: "system" as const, content: request.system }] : []),
          { role: "user" as const, content: request.text },
        ],
      });

      const choice = response.choices[0];
      return {
        text: choice?.message.content ?? "",
        finishReason: choice?.finish_reason ?? "unknown",
        usage: {
          input: response.usage?.prompt_tokens ?? null,
          output: response.usage?.completion_tokens ?? null,
          total: response.usage?.total_tokens ?? null,
        },
        model: response.model ?? model,
        destination,
      };
    },
  };
}
