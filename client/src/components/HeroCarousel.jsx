import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroCarousel({ products }) {
  // useRef keeps the same plugin instance between renders.
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false }));

  if (products.length === 0) return null;

  return (
    <Carousel opts={{ loop: true }} plugins={[autoplay.current]} className="overflow-hidden rounded-2xl">
      <CarouselContent>
        {products.map((p) => (
          <CarouselItem key={p._id}>
            <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex max-w-lg flex-col justify-center gap-3 p-8 text-white sm:p-12">
                <Badge variant="secondary" className="w-fit">Featured</Badge>
                <h2 className="m-0 text-3xl font-bold sm:text-5xl">{p.name}</h2>
                <p className="text-white/80">{p.description}</p>
                <p className="text-2xl font-semibold">Rs. {p.price}</p>
                <Button asChild size="lg" variant="secondary" className="w-fit px-5">
                  <Link to={`/product/${p._id}`}>Shop now</Link>
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
