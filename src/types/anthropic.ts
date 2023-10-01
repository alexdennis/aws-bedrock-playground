export type AnthropicModelID =
  | "anthropic.claude-v1" // Claude v1.3
  | "anthropic.claude-v2" // Claude v2
  | "anthropic.claude-instant-v1"; // Claude Instant v1.2

export type AnthropicModelRequest = {
  prompt: string;
  max_tokens_to_sample: number;
  temperature: number;
  top_k: number;
  top_p: number;
  stop_sequences: string[];
};

export type AnthropicModelResponse = {
  completion: string;
  stop_reason: string;
};
