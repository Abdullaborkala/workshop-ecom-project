import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Send, ShoppingCart, X } from 'lucide-react';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GREETING = "Hi! I'm the Store2 assistant. Tell me what you are looking for and I'll find it for you.";
const SUGGESTIONS = ['Gifts under Rs. 1000', 'Something for running', 'What do you have for my desk?'];

function Bubble({ role, children }) {
  const mine = role === 'user';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 ${
          mine ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ProductRow({ product, onView }) {
  const { addToCart } = useCart();
  const outOfStock = product.countInStock === 0;

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
      <img src={product.image} alt={product.name} className="size-12 rounded-md object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          Rs. {product.price}
          {outOfStock && ' - Out of stock'}
        </p>
      </div>
      <Button size="xs" variant="outline" asChild>
        <Link to={`/product/${product._id}`} onClick={onView}>View</Link>
      </Button>
      <Button size="icon-xs" disabled={outOfStock} onClick={() => addToCart(product)} aria-label="Add to cart">
        <ShoppingCart />
      </Button>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (text) => {
    text = text.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const history = next.filter((m) => !m.error).map(({ role, text }) => ({ role, text }));
      const { data } = await api.post('/chat', { messages: history });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply, products: data.products }]);
    } catch (err) {
      const text = err.response?.data?.message || 'Could not reach the assistant.';
      setMessages((prev) => [...prev, { role: 'assistant', text, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="h-[32rem] w-80 gap-0 py-0 shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5" /> Shopping assistant
            </CardTitle>
            <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close chat">
              <X />
            </Button>
          </div>

          <CardContent className="flex-1 space-y-3 overflow-y-auto py-3">
            <Bubble role="assistant">{GREETING}</Bubble>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} size="xs" variant="outline" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className="space-y-2">
                <Bubble role={m.role}>
                  <span className={m.error ? 'text-destructive' : undefined}>{m.text}</span>
                </Bubble>
                {m.products?.map((p) => (
                  <ProductRow key={p._id} product={p} onView={() => setOpen(false)} />
                ))}
              </div>
            ))}

            {loading && <Bubble role="assistant"><span className="animate-pulse">Thinking...</span></Bubble>}
            <div ref={bottomRef} />
          </CardContent>

          <CardFooter className="p-3">
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a product..."
                autoFocus
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
                <Send />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        size="icon-lg"
        className="size-14 rounded-full shadow-lg"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </Button>
    </div>
  );
}
