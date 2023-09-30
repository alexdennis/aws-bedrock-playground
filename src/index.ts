import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { AI21ModelRequest, AI21ModelResponse } from "./types";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const PROMPT = `
System: You are a chatbot designed to give users the ability to talk to characters in any book. Play the role of {character} in the {book}.  
Don't break out of character. Please give chapter and verse numbers that validate your answers where possible. Don't refer to yourself in the third person.
Respond in less than 500 words and avoid repetition. Only answer questions that you are asked.

Question: 
`;

const fn = async () => {
  const modelRequest: AI21ModelRequest = {
    prompt:
      PROMPT.replace("{character}", "Violet").replace(
        "{book}",
        "A series of unfortunate events"
      ) + "Who were your siblings and what is special about each of them?",
    maxTokens: 200,
    temperature: 0,
    topP: 1.0,
    stopSequences: [],
    countPenalty: { scale: 0 },
    presencePenalty: { scale: 0 },
    frequencyPenalty: { scale: 0 },
  };

  const command = new InvokeModelCommand({
    modelId: "ai21.j2-ultra-v1",
    contentType: "application/json",
    accept: "*/*",
    body: JSON.stringify(modelRequest),
  });

  const output = await client.send(command);
  const modelResponse: AI21ModelResponse = JSON.parse(
    Buffer.from(output.body).toString()
  );

  console.log(JSON.stringify(modelResponse.completions[0].data.text, null, 2));
};

fn();
