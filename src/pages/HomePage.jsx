import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Timer, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';

const banners = [
  {
    id: 1,
    title: 'Mega Sale',
    subtitle: 'Up to 70% off on Electronics',
    cta: 'Shop Now',
    bg: 'from-green-600 to-green-800',
    emoji: '📱',
    link: '/search?category=Electronics',
  },
  {
    id: 2,
    title: 'Fashion Week',
    subtitle: 'Trendy styles for every occasion',
    cta: 'Explore',
    bg: 'from-emerald-500 to-teal-700',
    emoji: '👗',
    link: '/search?category=Fashion',
  },
  {
    id: 3,
    title: 'Free Shipping',
    subtitle: 'On all orders above ₱500 today only',
    cta: 'Start Shopping',
    bg: 'from-teal-500 to-green-700',
    emoji: '🚚',
    link: '/',
  },
];

function FlashDealTimer() {
  const [time, setTime] = useState(3 * 3600 + 24 * 60 + 59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = String(Math.floor(time / 3600)).padStart(2, '0');
  const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 text-white">
      <Timer size={16} />
      <span className="text-sm">Ends in</span>
      <div className="flex gap-1">
        {[h, m, s].map((unit, i) => (
          <span key={i} className="bg-gray-900 text-white text-sm font-bold px-1.5 py-0.5 rounded">
            {unit}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const { products, loading } = useProducts();
  const flashDeals = products.filter(p => p.isFlashDeal);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(b => (b + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64">
        {banners.map((banner, i) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-gradient-to-r ${banner.bg} flex items-center px-8 md:px-16 transition-opacity duration-700 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="text-white z-10 flex-1">
              <p className="text-sm font-semibold text-green-200 uppercase tracking-widest mb-1">{banner.subtitle}</p>
              <h2 className="text-3xl md:text-5xl font-black mb-4">{banner.title}</h2>
              <Link
                to={banner.link}
                className="inline-block bg-white text-green-700 font-bold px-6 py-2 rounded-full text-sm hover:bg-green-50 transition-colors shadow"
              >
                {banner.cta} →
              </Link>
            </div>
            <div className="text-8xl md:text-9xl opacity-30 select-none">{banner.emoji}</div>
          </div>
        ))}

        {/* Nav dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentBanner ? 'bg-white w-5' : 'bg-white/50'}`}
            />
          ))}
        </div>

        {/* Arrow controls */}
        <button
          onClick={() => setCurrentBanner(b => (b - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-20 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentBanner(b => (b + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-20 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Truck size={22} />, title: 'Free Shipping', sub: 'On orders ₱500+' },
          { icon: <ShieldCheck size={22} />, title: 'Buyer Protection', sub: '100% safe payments' },
          { icon: <RefreshCw size={22} />, title: 'Easy Returns', sub: '30-day return policy' },
          { icon: <Headphones size={22} />, title: '24/7 Support', sub: 'Always here to help' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
            <div className="text-green-600">{item.icon}</div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Browse Categories</h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`${cat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs text-gray-600 text-center leading-tight group-hover:text-green-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-white font-black text-lg tracking-wide">FLASH DEALS</h2>
            <FlashDealTimer />
          </div>
          <Link to="/search" className="text-white text-sm font-medium hover:underline">See All →</Link>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {flashDeals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recommended For You</h2>
          <Link to="/search" className="text-green-600 text-sm font-medium hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
