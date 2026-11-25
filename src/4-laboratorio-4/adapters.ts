import { createAnthropicAdapter } from "./anthropic-adapter.ts";
import { createOpenAIAdapter } from "./openai-adapter.ts";
import type { Adapter, DestinationConfig } from "./types.ts";

export { isRequestError, isTransientError } from "./adapter-utils.ts";

export function createAdapter(
  format: DestinationConfig["format"],
  config: DestinationConfig,
): Adapter {
  if (format === "openai") {
    return createOpenAIAdapter(config);
  }
  return createAnthropicAdapter(config);
}
