/**
 * This file contains types for the AI21 API.
 *
 * https://docs.ai21.com/reference/j2-complete-api-ref#api-parameters
 */

export type AI21ModelRequestPenalty = {
  scale: number;
  applyToNumbers?: boolean;
};

export type AI21ModelRequest = {
  /**
   * This is the starting point for generating responses. The format of the prompt, whether zero-shot, few-shot, or instructional, can influence the shape of the model's responses.
   */
  prompt: string;
  /**
   * The maximum number of tokens to generate for each response.
   */
  maxTokens: number;
  /**
   * A value controlling the "creativity" of the model's responses.
   */
  temperature: number;
  /**
   * A value controlling the diversity of the model's responses.
   */
  topP: number;
  /**
   * A list of sequences that, when generated, will cause the model to stop generating tokens.
   */
  stopSequences: string[];

  /**
   * A penalty applied to tokens based on their frequency in the generated responses.
   */
  countPenalty: AI21ModelRequestPenalty;

  /**
   * A penalty applied to tokens that are frequently generated.
   */
  frequencyPenalty: AI21ModelRequestPenalty;

  /**
   * A penalty applied to tokens that are already present in the prompt.
   */
  presencePenalty: AI21ModelRequestPenalty;
};

export type AI21ModelResponseTopToken = {
  token: string;
  logprob: number;
};

export type AI21ModelResponseTokenData = {
  generatedToken: {
    token: string;
    logprob: number;
    raw_logprob: number;
  };
  topTokens?: AI21ModelResponseTopToken[];
  textRange: {
    start: number;
    end: number;
  };
};

export type AI21ModelResponseCompletion = {
  data: {
    text: string;
    tokens: AI21ModelResponseTokenData[];
  };
  finishReason: {
    reason: "length" | "endoftext" | "stop";
    length?: number;
    sequence?: string;
  };
};

export type AI21ModelResponse = {
  id: string;
  prompt: {
    text: string;
    tokens: AI21ModelResponseTokenData[];
  };
  completions: AI21ModelResponseCompletion[];
};
