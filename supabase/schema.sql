-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES (extends Supabase auth.users) ───────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  phone text,
  location text,
  role text default 'buyer' check (role in ('buyer','seller','admin')),
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────
create table public.products (
  id serial primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  image text,
  category text,
  stock integer default 0,
  sold integer default 0,
  rating numeric(3,1) default 0,
  reviews integer default 0,
  discount integer default 0,
  is_flash_deal boolean default false,
  seller_name text,
  location text,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Anyone can view products" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text,
  customer_email text,
  product_id integer references public.products(id),
  product_name text,
  quantity integer default 1,
  total numeric(10,2),
  status text default 'processing' check (status in ('processing','shipped','delivered','cancelled')),
  payment_method text,
  address text,
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── EVENTS ───────────────────────────────────────────────────────────────
create table public.events (
  id serial primary key,
  name text not null,
  description text,
  type text default 'sale' check (type in ('sale','flash','campaign','promo')),
  status text default 'upcoming' check (status in ('upcoming','active','ended')),
  discount_label text,
  start_date date,
  end_date date,
  participants integer default 0,
  created_at timestamptz default now()
);
alter table public.events enable row level security;
create policy "Anyone can view events" on public.events for select using (true);
create policy "Admins can manage events" on public.events for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── SEED PRODUCTS ────────────────────────────────────────────────────────
insert into public.products (name, description, price, original_price, image, category, stock, sold, rating, reviews, discount, is_flash_deal, seller_name, location) values
('Wireless Bluetooth Earbuds Pro', 'Premium wireless earbuds with active noise cancellation, 30-hour battery life, and IPX5 water resistance.', 29.99, 59.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', 'Electronics', 150, 15200, 4.8, 2341, 50, true, 'TechZone Official', 'Manila'),
('Men''s Slim Fit Polo Shirt', 'Classic slim fit polo shirt made from breathable cotton blend. Available in multiple colors.', 12.50, 25.00, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80', 'Fashion', 300, 4300, 4.5, 892, 50, true, 'StyleHub PH', 'Cebu'),
('Smart LED Desk Lamp', 'Touch-sensitive LED desk lamp with 5 color modes, USB charging port, and memory function.', 18.99, 34.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80', 'Home & Living', 200, 8900, 4.6, 1203, 46, true, 'HomePlus Store', 'Davao'),
('Running Shoes Ultra Boost', 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', 45.00, 90.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', 'Sports', 80, 22000, 4.9, 3102, 50, false, 'SportsPro PH', 'Manila'),
('Vitamin C Serum 20%', 'Brightening vitamin C serum that reduces dark spots and boosts collagen production.', 8.99, 15.99, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', 'Beauty', 500, 31000, 4.7, 5421, 44, false, 'GlowSkin Beauty', 'Quezon City'),
('Mechanical Gaming Keyboard RGB', 'Full-size mechanical gaming keyboard with RGB backlight and anti-ghosting technology.', 39.99, 79.99, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80', 'Electronics', 120, 9800, 4.8, 1876, 50, false, 'GamingGear PH', 'Manila'),
('Women''s Floral Summer Dress', 'Elegant floral print summer dress with adjustable straps. Lightweight and perfect for warm weather.', 15.99, 29.99, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', 'Fashion', 250, 3200, 4.4, 672, 47, false, 'LadyFashion PH', 'Cebu'),
('Non-Stick Cookware Set 5pcs', 'Premium non-stick cookware set including frying pan, saucepan, and wok. Oven-safe up to 450°F.', 35.00, 65.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', 'Home & Living', 90, 12400, 4.6, 2109, 46, false, 'KitchenMaster', 'Makati'),
('Yoga Mat Anti-Slip 6mm', 'Extra thick 6mm yoga mat with non-slip surface, carrying strap, and eco-friendly material.', 11.50, 22.00, 'https://images.unsplash.com/photo-1601925228518-f63f3e2e4c84?w=400&q=80', 'Sports', 180, 6700, 4.5, 934, 48, false, 'FitLife Store', 'Pasig'),
('Portable Power Bank 20000mAh', '20000mAh high-capacity power bank with dual USB-A and USB-C ports and fast charging.', 22.99, 44.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80', 'Electronics', 220, 28000, 4.7, 4521, 49, false, 'PowerTech PH', 'Taguig'),
('Face Wash Foaming Cleanser', 'Gentle foaming cleanser that removes dirt, oil, and makeup without stripping skin moisture.', 6.99, 12.99, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80', 'Beauty', 400, 18500, 4.3, 3210, 46, false, 'SkinCare Hub', 'Manila'),
('Kids LEGO Building Set 500pcs', 'Creative building set with 500 colorful bricks. Enhances creativity and motor skills for kids aged 6+.', 24.99, 49.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', 'Toys', 110, 7800, 4.9, 1456, 50, false, 'ToyWorld PH', 'Quezon City');

-- ─── SEED EVENTS ──────────────────────────────────────────────────────────
insert into public.events (name, description, type, status, discount_label, start_date, end_date, participants) values
('Mid-Year Mega Sale', 'Biggest sale of the year with up to 70% off on all categories.', 'sale', 'upcoming', '70%', '2024-07-10', '2024-07-12', 120),
('Flash Deal Friday', 'Weekly flash deals every Friday from 12PM to 6PM.', 'flash', 'active', '50%', '2024-07-05', '2024-07-05', 45),
('Back to School', 'Special discounts on school supplies, gadgets, and fashion.', 'campaign', 'ended', '30%', '2024-06-15', '2024-07-01', 88),
('Free Shipping Day', 'All orders ship free regardless of amount for one day only.', 'promo', 'upcoming', 'Free Ship', '2024-07-08', '2024-07-08', 200),
('Beauty Week', 'Dedicated week for beauty and skincare products with exclusive bundles.', 'campaign', 'upcoming', '40%', '2024-07-15', '2024-07-21', 33),
('Tech Fest', 'Annual technology festival featuring the best deals on gadgets.', 'sale', 'ended', '60%', '2024-06-01', '2024-06-07', 77);
