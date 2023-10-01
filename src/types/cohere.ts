import { type } from "os";

export type CohereModelID = "cohere.command-text-v14";

export type CohereModelRequest = {
  prompt: string;
  max_tokens: number;
  temperature: number;
  return_likelihood?: string;
};

type CohereGeneration = {
  id: string;
  text: string;
};

export type CohereModelResponse = {
  id: string;
  prompt: string;
  generations: CohereGeneration[];
};
