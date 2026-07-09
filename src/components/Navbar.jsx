import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, ChevronDown, MapPin, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-green-700 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin size={12} /> Deliver to Philippines</span>
            <span>Free shipping on orders over ₱500</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-green-200 transition-colors">Sign In</Link>
            <span>|</span>
            <Link to="/register" className="hover:text-green-200 transition-colors">Register</Link>
            <span>|</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-green-200">
              English <ChevronDown size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-green-600 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1.5">
                <span className="text-green-600 font-black text-lg leading-none">M</span>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">MarketHub</span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, and more..."
                className="flex-1 px-4 py-2.5 text-sm rounded-l-sm outline-none text-gray-800 bg-white"
              />
              <button
                type="submit"
                className="bg-green-400 hover:bg-green-300 px-5 py-2.5 rounded-r-sm text-white transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
            {/* Popular searches */}
            <div className="flex gap-3 mt-1 text-xs text-green-100">
              {['Earbuds', 'Dress', 'Running Shoes', 'Power Bank'].map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => { setSearchQuery(term); navigate(`/search?q=${encodeURIComponent(term)}`); }}
                  className="hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4 text-white flex-shrink-0">
            <Link to="/cart" className="relative flex flex-col items-center hover:text-green-200 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="text-xs mt-0.5">Cart</span>
            </Link>

            {/* User menu */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex flex-col items-center hover:text-green-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-white text-green-700 font-bold text-xs flex items-center justify-center">
                    {(profile?.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-xs mt-0.5 max-w-[60px] truncate">{profile?.name?.split(' ')[0] || 'Account'}</span>
                </button>
              ) : (
                <Link to="/login" className="flex flex-col items-center hover:text-green-200 transition-colors">
                  <User size={24} />
                  <span className="text-xs mt-0.5">Account</span>
                </Link>
              )}

              {userMenuOpen && user && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border z-50 text-gray-700 text-sm overflow-hidden">
                  <div className="px-4 py-3 border-b bg-green-50">
                    <p className="font-semibold text-gray-800 truncate">{profile?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/cart" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <ShoppingCart size={14} /> My Cart
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-green-700 font-medium">
                      🛡 Admin Panel
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-500 transition-colors">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 text-sm text-gray-600 py-2 overflow-x-auto">
            {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Groceries', 'Health'].map(cat => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="whitespace-nowrap hover:text-green-600 transition-colors font-medium"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="bg-white border-b shadow-lg md:hidden">
          <nav className="flex flex-col divide-y text-sm text-gray-700">
            {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Books', 'Toys'].map(cat => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="px-4 py-3 hover:bg-green-50 hover:text-green-600"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
