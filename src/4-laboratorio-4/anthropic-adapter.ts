import Anthropic from "@anthropic-ai/sdk";
import { getEnvironmentTimeout } from "./adapter-utils.ts";
import type {
  Adapter,
  CompletionRequest,
  DestinationConfig,
  UnifiedResponse,
} from "./types.ts";

export function createAnthropicAdapter(config: DestinationConfig): Adapter {
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

      const client = new Anthropic({
        apiKey,
        baseURL,
        maxRetries: 0,
        timeout: getEnvironmentTimeout(destination, "anthropic"),
      });
      const response = await client.messages.create({
        model,
        max_tokens: request.maxTokens,
        ...(request.system ? { system: request.system } : {}),
        messages: [{ role: "user", content: request.text }],
      });

      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");
      return {
        text,
        finishReason: response.stop_reason ?? "unknown",
        usage: {
          input: response.usage?.input_tokens ?? null,
          output: response.usage?.output_tokens ?? null,
          total:
            response.usage?.input_tokens != null && response.usage?.output_tokens != null
              ? response.usage.input_tokens + response.usage.output_tokens
              : null,
        },
        model: response.model ?? model,
        destination,
      };
    },
  };
}
