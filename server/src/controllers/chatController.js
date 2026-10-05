import Product from '../models/Product.js';
import { askAI, getProvider, missingKey } from '../services/ai.js';

const MAX_HISTORY = 10;

const buildInstruction = (products) => {
  const catalog = products
    .map((p) => `- id: ${p._id} | ${p.name} | Rs. ${p.price} | stock: ${p.countInStock} | ${p.description}`)
    .join('\n');

  return `You are the friendly shopping assistant of "Store2", a small online shop.
Help the customer find products. Only recommend products from this catalog:
${catalog}

Rules:
- Recommend at most 3 products. Put their ids in "productIds".
- If the customer asks about a product with stock 0, say it is out of stock. Do not mention unrelated products.
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

  const missing = missingKey();
  if (missing) {
    return res.status(503).json({ message: `The AI assistant is not set up yet. Add ${missing} to server/.env.` });
  }

  const products = await Product.find();

  let reply, productIds;
  try {
    ({ reply, productIds = [] } = await askAI({
      instruction: buildInstruction(products),
      messages: messages.slice(-MAX_HISTORY),
    }));
  } catch (err) {
    console.error(`AI error (${getProvider()}):`, err.message);
    return res.status(502).json({ message: 'The AI assistant is not available right now. Please try again.' });
  }

  const picked = products.filter((p) => productIds.includes(String(p._id)));
  res.json({ reply, products: picked });
};
