import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SkeletonProductCard from '@/components/SkeletonProductCard';

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async (pageNum: number, search: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((pageNum - 1) * ITEMS_PER_PAGE, pageNum * ITEMS_PER_PAGE - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      if (pageNum === 1) {
        setProducts(data || []);
      } else {
        setProducts(prev => [...prev, ...(data || [])]);
      }

      setHasMore(data && data.length === ITEMS_PER_PAGE && (count || 0) > pageNum * ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1, searchQuery);
    setPage(1);
  }, [searchQuery, fetchProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, searchQuery);
    }
  }, [page, searchQuery, fetchProducts]);

  return (
    <div className="min-h-screen bg-[image:var(--gradient-premium)] dark:bg-[image:var(--gradient-premium-dark)]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <img
            src="/images/echodeals.png" 
            alt="Echo Deals Logo"
            className="mx-auto h-24 sm:h-32 lg:h-40"
          />
        
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card text-card-foreground"
              />
            </div>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="px-2 sm:px-6 lg:px-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="mb-4 text-xl text-muted-foreground">No products available yet</p>
            <p className="text-sm text-muted-foreground">Check back soon for exciting new products!</p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-12 lg:px-18">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    imageUrl={product.image_url}
                    externalLink={product.external_link}
                  />
                ))}
              </div>
            </div>

            {hasMore && (
              <div ref={observerTarget} className="flex items-center justify-center py-8">
                {loading && (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                )}
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                No more products to load
              </p>
            )}
          </>
        )}
        {loading && page > 1 && (
          <div className="px-2 sm:px-6 lg:px-16 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;
