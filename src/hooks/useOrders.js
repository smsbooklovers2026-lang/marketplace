import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const isConfigured = () =>
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!isConfigured() || !user) return;
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Place order — called from CartPage on checkout
  const placeOrder = async (cartItems, paymentMethod, address) => {
    if (!isConfigured()) return { error: null }; // mock mode — just succeed

    const inserts = cartItems.map(item => ({
      user_id: user?.id ?? null,
      customer_name: user?.user_metadata?.name ?? 'Guest',
      customer_email: user?.email ?? '',
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      total: item.price * item.quantity,
      status: 'processing',
      payment_method: paymentMethod,
      address,
    }));

    const { error } = await supabase.from('orders').insert(inserts);
    if (!error) fetchOrders();
    return { error };
  };

  return { orders, loading, placeOrder };
}
