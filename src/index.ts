import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { AI21ModelRequest, AI21ModelResponse } from "./types";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const invokeModel = async <Request, Response>(
  modelId: "ai21.j2-ultra-v1",
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

Question: 
`;

const fn = async () => {
  const modelRequest: AI21ModelRequest = {
    prompt:
      PROMPT.replace("{character}", "Alice").replace(
        "{book}",
        "Alice in Wonderland"
      ) + "Why did you follow the white rabbit?",
    maxTokens: 200,
    temperature: 0.7,
    topP: 1.0,
    stopSequences: [],
    countPenalty: { scale: 0 },
    presencePenalty: { scale: 0 },
    frequencyPenalty: { scale: 0 },
  };

  const modelResponse: AI21ModelResponse = await invokeModel<
    AI21ModelRequest,
    AI21ModelResponse
  >("ai21.j2-ultra-v1", modelRequest);

  console.log(JSON.stringify(modelResponse.completions[0].data.text, null, 2));
};

fn();
