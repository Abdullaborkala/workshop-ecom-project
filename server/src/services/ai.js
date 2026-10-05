import { GoogleGenAI, Type } from '@google/genai';

const KEY_NAMES = { gemini: 'GEMINI_API_KEY', openrouter: 'OPENROUTER_API_KEY' };

export const getProvider = () => (process.env.AI_PROVIDER || 'openrouter').toLowerCase();

// Name of the env variable the current provider needs, or null if it is already set.
export const missingKey = () => {
  const name = KEY_NAMES[getProvider()];
  if (!name) return 'AI_PROVIDER (use "gemini" or "openrouter")';
  return process.env[name] ? null : name;
};

// Gemini: official SDK, systemInstruction, roles "user" / "model".
async function askGemini({ instruction, messages }) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const result = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
    config: {
      systemInstruction: instruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: { type: Type.STRING },
          productIds: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['reply', 'productIds'],
      },
    },
  });
  return JSON.parse(result.text);
}

// OpenRouter: OpenAI-style REST API with plain fetch, a "system" message, roles "user" / "assistant".
async function askOpenRouter({ instruction, messages }) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'X-Title': 'Store2',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o',
      max_tokens: 500,
      messages: [
        { role: 'system', content: instruction },
        ...messages.map((m) => ({ role: m.role, content: m.text })),
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'shop_reply',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              reply: { type: 'string' },
              productIds: { type: 'array', items: { type: 'string' } },
            },
            required: ['reply', 'productIds'],
            additionalProperties: false,
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// messages: [{ role: 'user' | 'assistant', text }]  ->  { reply, productIds }
export const askAI = ({ instruction, messages }) =>
  getProvider() === 'gemini' ? askGemini({ instruction, messages }) : askOpenRouter({ instruction, messages });
