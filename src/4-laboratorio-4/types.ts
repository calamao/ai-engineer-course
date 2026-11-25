export interface CompletionRequest {
  text: string;
  system?: string;
  maxTokens: number;
}

export interface UnifiedUsage {
  input: number | null;
  output: number | null;
  total: number | null;
}

export interface UnifiedResponse {
  text: string;
  finishReason: string;
  usage: UnifiedUsage;
  model: string;
  destination: string;
}

export interface DestinationConfig {
  format: "openai" | "anthropic";
  base_url_env: string;
  api_key_env: string;
}

export interface LogicalDestination {
  destination: string;
  model: string;
}

export interface LabConfig {
  logical_models: Record<string, LogicalDestination[]>;
  destinations: Record<string, DestinationConfig>;
}

export interface Adapter {
  complete(
    request: CompletionRequest,
    model: string,
    destination: string,
  ): Promise<UnifiedResponse>;
}
