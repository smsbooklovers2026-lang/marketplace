import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'top_sales', label: 'Top Sales' },
  { value: 'rating', label: 'Top Rated' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const { products } = useProducts();

  const [sort, setSort] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (priceMin) result = result.filter(p => p.price >= Number(priceMin));
    if (priceMax) result = result.filter(p => p.price <= Number(priceMax));
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);

    switch (sort) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'top_sales': result.sort((a, b) => b.sold - a.sold); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [query, selectedCategory, priceMin, priceMax, minRating, sort]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setMinRating(0);
    setSort('relevance');
  };

  const hasFilters = selectedCategory || priceMin || priceMax || minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="mb-4">
        {query ? (
          <p className="text-gray-700">
            Search results for <span className="font-bold text-green-600">"{query}"</span>
            <span className="text-gray-400 text-sm ml-2">({filtered.length} items)</span>
          </p>
        ) : selectedCategory ? (
          <p className="text-gray-700 font-bold text-lg">{selectedCategory}</p>
        ) : (
          <p className="text-gray-700 font-bold text-lg">All Products</p>
        )}
      </div>

      <div className="flex gap-4">
        {/* Sidebar filters - desktop */}
        <aside className="hidden md:block w-52 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear all</button>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-green-50 hover:text-green-600 transition-colors ${!selectedCategory ? 'text-green-600 font-medium bg-green-50' : 'text-gray-600'}`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-green-50 hover:text-green-600 transition-colors ${selectedCategory === cat.name ? 'text-green-600 font-medium bg-green-50' : 'text-gray-600'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Price Range (₱)</p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={e => setPriceMin(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-green-500"
                />
                <span className="text-gray-400 text-sm">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Minimum Rating</p>
              <div className="space-y-1">
                {[4, 3, 2, 0].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-green-50 transition-colors flex items-center gap-1.5 ${minRating === r ? 'text-green-600 bg-green-50 font-medium' : 'text-gray-600'}`}
                  >
                    {r === 0 ? (
                      <span>All Ratings</span>
                    ) : (
                      <>
                        {[...Array(r)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                        <span className="text-xs">& up</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + Filter bar */}
          <div className="bg-white rounded-xl shadow-sm px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="flex gap-2 flex-wrap flex-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`text-sm px-3 py-1.5 rounded transition-colors ${
                    sort === opt.value
                      ? 'bg-green-600 text-white'
                      : 'border text-gray-600 hover:border-green-500 hover:text-green-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-1 text-sm border px-3 py-1.5 rounded hover:border-green-500 hover:text-green-600 transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <span className="text-sm text-gray-400 ml-auto hidden md:block">{filtered.length} results</span>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Filters</h3>
                <div className="flex gap-3">
                  {hasFilters && <button onClick={clearFilters} className="text-xs text-red-500">Clear all</button>}
                  <button onClick={() => setShowFilters(false)}><X size={16} /></button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`text-sm px-3 py-1.5 rounded border transition-colors ${!selectedCategory ? 'bg-green-600 text-white border-green-600' : 'hover:border-green-500'}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`text-sm px-3 py-1.5 rounded border transition-colors ${selectedCategory === cat.name ? 'bg-green-600 text-white border-green-600' : 'hover:border-green-500'}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500">Price:</span>
                <input type="number" placeholder="Min ₱" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="w-24 border rounded px-2 py-1 text-sm outline-none focus:border-green-500" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max ₱" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="w-24 border rounded px-2 py-1 text-sm outline-none focus:border-green-500" />
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex gap-2 flex-wrap mb-3">
              {selectedCategory && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}><X size={10} /></button>
                </span>
              )}
              {(priceMin || priceMax) && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  ₱{priceMin || '0'} - ₱{priceMax || '∞'}
                  <button onClick={() => { setPriceMin(''); setPriceMax(''); }}><X size={10} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  {minRating}★ & up
                  <button onClick={() => setMinRating(0)}><X size={10} /></button>
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm py-20 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or remove filters</p>
              <button onClick={clearFilters} className="mt-4 text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-50">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
