import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

const commit = createOpenAICompatible({
  name: 'commit',
  baseURL: 'https://ai.commitacademy.io/v1',
  apiKey: process.env.COMMIT_AI_KEY ?? '',
});

const { text, finishReason } = await generateText({
  model: commit('fast'),
  prompt: 'Resume en una frase qué es un agente.',
});
console.log(text);
console.log(finishReason);