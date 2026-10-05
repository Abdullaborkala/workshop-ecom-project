import { GoogleGenAI, Type } from '@google/genai';
import Product from '../models/Product.js';

const MAX_HISTORY = 10;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    productIds: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['reply', 'productIds'],
};

const buildInstruction = (products) => {
  const catalog = products
    .map((p) => `- id: ${p._id} | ${p.name} | Rs. ${p.price} | stock: ${p.countInStock} | ${p.description}`)
    .join('\n');

  return `You are the friendly shopping assistant of "Store2", a small online shop.
Help the customer find products. Only recommend products from this catalog:
${catalog}

Rules:
- Recommend at most 3 products. Put their ids in "productIds".
- If a product has stock 0, say it is out of stock.
- Write prices as "Rs. 999".
- Keep "reply" short (2-4 sentences) and plain text, no markdown.
- If nothing matches, say so politely and return an empty "productIds".`;
};

// POST /api/chat  body: { messages: [{ role: 'user' | 'assistant', text }] }
export const chat = async (req, res) => {
  const { messages } = req.body;
  const valid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every((m) => ['user', 'assistant'].includes(m?.role) && typeof m.text === 'string' && m.text.trim());
  if (!valid) return res.status(400).json({ message: 'messages must be a non-empty list of { role, text }' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: 'The AI assistant is not set up yet. Add GEMINI_API_KEY to server/.env.' });
  }

  const products = await Product.find();

  const contents = messages.slice(-MAX_HISTORY).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let reply, productIds;
  try {
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: buildInstruction(products),
        responseMimeType: 'application/json',
        responseSchema,
      },
    });
    ({ reply, productIds = [] } = JSON.parse(result.text));
  } catch (err) {
    console.error('Gemini error:', err.message);
    return res.status(502).json({ message: 'The AI assistant is not available right now. Please try again.' });
  }

  const picked = products.filter((p) => productIds.includes(String(p._id)));
  res.json({ reply, products: picked });
};
