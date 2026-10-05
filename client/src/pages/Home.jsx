import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import HeroCarousel from '../components/HeroCarousel.jsx';
import FeatureStrip from '../components/FeatureStrip.jsx';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <p className="error">Error: {error}</p>;

  const featured = products.filter((p) => p.countInStock > 0).slice(0, 3);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-10">
      {loading ? <Skeleton className="h-72 rounded-2xl sm:h-96" /> : <HeroCarousel products={featured} />}

      <FeatureStrip />

      <section>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="m-0 text-3xl font-bold">All products</h1>
          <div className="relative sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-4/3 w-full rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            : filtered.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No products found for "{search}".</p>
        )}
      </section>
    </div>
  );
}
