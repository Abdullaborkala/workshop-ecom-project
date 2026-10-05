import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.countInStock === 0;
  const lowStock = !outOfStock && product.countInStock <= 5;

  return (
    <Card className="group pt-0">
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && <Badge variant="destructive" className="absolute top-3 left-3 bg-white">Out of stock</Badge>}
        {lowStock && <Badge className="absolute top-3 left-3">Only {product.countInStock} left</Badge>}
      </Link>
      <CardContent className="flex-1">
        <Link to={`/product/${product._id}`} className="font-semibold hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-lg font-bold">Rs. {product.price}</span>
        <Button size="sm" disabled={outOfStock} onClick={() => addToCart(product)}>
          <ShoppingCart /> Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
