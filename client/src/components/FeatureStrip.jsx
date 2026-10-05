import { RotateCcw, Truck, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Truck, title: 'Free delivery', text: 'On every order, anywhere in India.' },
  { icon: Wallet, title: 'Cash on Delivery', text: 'Pay when your order arrives.' },
  { icon: RotateCcw, title: 'Easy returns', text: 'Not happy? Return within 7 days.' },
];

export default function FeatureStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {features.map(({ icon: Icon, title, text }) => (
        <Card key={title}>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-3">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-muted-foreground">{text}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
