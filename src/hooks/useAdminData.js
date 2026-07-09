import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { users as mockUsers, orders as mockOrders, sellers as mockSellers, events as mockEvents } from '../data/adminData';

const isConfigured = () =>
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url';

export function useAdminData() {
  const [data, setData] = useState({
    users: mockUsers,
    orders: mockOrders,
    sellers: mockSellers,
    events: mockEvents,
    loading: false,
  });

  const fetchAll = async () => {
    if (!isConfigured()) return; // use mock data

    setData(d => ({ ...d, loading: true }));

    const [profilesRes, ordersRes, eventsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('start_date'),
    ]);

    setData({
      users: profilesRes.data?.map(p => ({
        id: p.id,
        name: p.name || 'Unknown',
        email: '',
        phone: p.phone || '—',
        role: p.role || 'buyer',
        status: 'active',
        joined: p.created_at?.slice(0, 10),
        location: p.location || '—',
        avatar: (p.name || 'U')[0].toUpperCase(),
        orders: 0,
        totalSpent: 0,
      })) ?? mockUsers,
      orders: ordersRes.data?.map(o => ({
        id: o.id.slice(0, 9).toUpperCase(),
        customer: o.customer_name,
        product: o.product_name,
        quantity: o.quantity,
        total: o.total,
        status: o.status,
        date: o.created_at?.slice(0, 10),
        payment: o.payment_method || '—',
        address: o.address || '—',
      })) ?? mockOrders,
      sellers: mockSellers, // sellers table not in scope yet
      events: eventsRes.data?.map(e => ({
        id: e.id,
        name: e.name,
        description: e.description,
        type: e.type,
        status: e.status,
        discount: e.discount_label,
        startDate: e.start_date,
        endDate: e.end_date,
        participants: e.participants,
      })) ?? mockEvents,
      loading: false,
    });
  };

  useEffect(() => {
    fetchAll();

    if (!isConfigured()) return;

    // Real-time: re-fetch when orders change
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchAll)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Admin actions
  const updateOrderStatus = async (orderId, status) => {
    if (!isConfigured()) return;
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };

  const deleteEvent = async (eventId) => {
    if (!isConfigured()) return;
    await supabase.from('events').delete().eq('id', eventId);
  };

  const createEvent = async (eventData) => {
    if (!isConfigured()) return;
    await supabase.from('events').insert([eventData]);
  };

  return { ...data, updateOrderStatus, deleteEvent, createEvent, refetch: fetchAll };
}
