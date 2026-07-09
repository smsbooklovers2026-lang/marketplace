import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Heart, Share2, ShieldCheck, Truck, RefreshCw, ChevronRight, Minus, Plus } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl text-gray-400 mb-4">Product not found</p>
        <Link to="/" className="text-green-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 6);
  const savings = product.originalPrice - product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <ChevronRight size={14} />
        <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-green-600">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Image */}
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails placeholder */}
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 rounded border-2 border-green-500 overflow-hidden bg-gray-100 cursor-pointer">
                  <img src={product.image} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {product.isFlashDeal && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded mb-2">
                <Zap size={12} /> Flash Deal
              </span>
            )}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 text-sm mb-3">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="text-gray-600 ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.reviews.toLocaleString()} Reviews</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{product.sold.toLocaleString()} Sold</span>
            </div>

            {/* Price */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">₱{product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through text-lg">₱{product.originalPrice.toFixed(2)}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 mt-1">You save ₱{savings.toFixed(2)}</p>
              )}
            </div>

            {/* Shipping */}
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Truck size={16} className="text-green-600 flex-shrink-0" />
                <span>Free shipping · Estimated delivery 3-5 days</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                <span>Buyer Protection · Money back guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={16} className="text-green-600 flex-shrink-0" />
                <span>Easy 30-day returns</span>
              </div>
            </div>

            {/* Seller */}
            <div className="border rounded-lg p-3 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">{product.seller}</p>
                <p className="text-xs text-gray-500">{product.location}</p>
              </div>
              <Link to="/" className="text-green-600 text-sm border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition-colors">
                Visit Store
              </Link>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-gray-600 font-medium">Quantity</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-sm text-gray-400">{product.stock} available</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all border-2 ${
                  added
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                <ShoppingCart size={18} />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-colors"
              >
                Buy Now
              </button>
              <button className="p-3 border rounded-lg text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors">
                <Heart size={18} />
              </button>
              <button className="p-3 border rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="flex border-b">
          {['description', 'reviews', 'shipping'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${product.reviews})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'description' && (
            <div className="text-gray-700 text-sm leading-relaxed space-y-3">
              <p>{product.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  ['Category', product.category],
                  ['Seller', product.seller],
                  ['Rating', `${product.rating} / 5.0`],
                  ['Reviews', product.reviews.toLocaleString()],
                  ['Stock', `${product.stock} units`],
                  ['Location', product.location],
                ].map(([key, val]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="text-gray-500 w-24 flex-shrink-0">{key}:</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <p className="text-4xl font-black text-green-600">{product.rating}</p>
                  <div className="flex justify-center gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{product.reviews.toLocaleString()} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right">{star}</span>
                      <Star size={10} className="fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full"
                          style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample reviews */}
              {[
                { user: 'JohnD***', rating: 5, comment: 'Excellent product! Exactly as described. Fast shipping too.', date: '2 days ago' },
                { user: 'MariaS***', rating: 4, comment: 'Good quality for the price. Would recommend to friends.', date: '1 week ago' },
                { user: 'CarloR***', rating: 5, comment: 'Amazing! Super fast delivery and product quality is top-notch.', date: '2 weeks ago' },
              ].map((review, i) => (
                <div key={i} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                      {review.user[0]}
                    </div>
                    <span className="text-sm font-medium">{review.user}</span>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={11} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-9">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-sm text-gray-700">
              {[
                ['Standard Delivery', '3-5 business days', 'Free for orders ₱500+, otherwise ₱60'],
                ['Express Delivery', '1-2 business days', '₱120'],
                ['Same Day Delivery', 'Metro Manila only', '₱180'],
              ].map(([title, time, fee]) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{title}</p>
                    <p className="text-gray-500 text-xs">{time} · {fee}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">More from {product.category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
