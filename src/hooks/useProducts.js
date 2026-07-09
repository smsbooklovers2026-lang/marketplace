import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { products as mockProducts } from '../data/products';

// Falls back to mock data if Supabase is not configured
const isConfigured = () =>
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured()) {
      setProducts(mockProducts);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sold', { ascending: false });

      if (error) {
        console.error('Supabase error, falling back to mock:', error.message);
        setProducts(mockProducts);
      } else {
        // Normalize DB snake_case to camelCase to match existing components
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          category: p.category,
          stock: p.stock,
          sold: p.sold,
          rating: p.rating,
          reviews: p.reviews,
          discount: p.discount,
          isFlashDeal: p.is_flash_deal,
          seller: p.seller_name,
          location: p.location,
        })));
      }
      setLoading(false);
    };

    fetch();

    // Real-time subscription — updates UI when DB changes
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetch)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { products, loading, error };
}
