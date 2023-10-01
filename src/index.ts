import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  AI21ModelRequest,
  AI21ModelResponse,
  AnthropicModelRequest,
  AnthropicModelResponse,
  BedrockModelID,
  CohereModelRequest,
  CohereModelResponse,
} from "./types";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const invokeModel = async <Request, Response>(
  modelId: BedrockModelID,
  modelRequest: Request
): Promise<Response> => {
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "*/*",
    body: JSON.stringify(modelRequest),
  });

  const output = await client.send(command);
  const modelResponse: Response = JSON.parse(
    Buffer.from(output.body).toString()
  );

  return modelResponse;
};

const PROMPT = `
System: You are a chatbot designed to give users the ability to talk to characters in any book. Play the role of {character} in the {book}.  
Don't break out of character. Please give chapter and verse numbers that validate your answers where possible. Don't refer to yourself in the third person.
Respond in less than 500 words and avoid repetition. Only answer questions that you are asked.

Human: 
`;

const fn = async () => {
  const prompt =
    PROMPT.replace("{character}", "Violet Baudelaire").replace(
      "{book}",
      "A Series of Unfortunate Events"
    ) + "Who are your siblings and what are they good at?";

  const ai21ModelRequest: AI21ModelRequest = {
    prompt,
    maxTokens: 200,
    temperature: 0.7,
    topP: 1.0,
    stopSequences: [],
    countPenalty: { scale: 0 },
    presencePenalty: { scale: 0 },
    frequencyPenalty: { scale: 0 },
  };

  const ai21ModelResponse: AI21ModelResponse = await invokeModel<
    AI21ModelRequest,
    AI21ModelResponse
  >("ai21.j2-ultra-v1", ai21ModelRequest);

  console.log(
    "AI21 (Jurassic-2 Ultra): " + ai21ModelResponse.completions[0].data.text
  );

  const anthropicModelRequest: AnthropicModelRequest = {
    prompt: prompt + "\n\nAssistant:",
    max_tokens_to_sample: 200,
    temperature: 0.7,
    top_k: 200,
    top_p: 1.0,
    stop_sequences: ["Human:"],
  };

  const anthropicModelResponse: AnthropicModelResponse = await invokeModel<
    AnthropicModelRequest,
    AnthropicModelResponse
  >("anthropic.claude-v2", anthropicModelRequest);

  console.log("Anthropic (Claude v2)");
  console.log(anthropicModelResponse.completion);

  const cohereModelRequest: CohereModelRequest = {
    prompt,
    max_tokens: 200,
    temperature: 0.7,
  };

  const cohereModelResponse = await invokeModel<
    CohereModelRequest,
    CohereModelResponse
  >("cohere.command-text-v14", cohereModelRequest);

  console.log("Cohere (Command)");
  console.log(cohereModelResponse.generations[0].text);
};

fn();
