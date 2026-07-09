import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name, form.phone);
    setLoading(false);
    if (error) { setErrors({ email: error.message }); return; }
    setSuccessMsg('Account created! Check your email to confirm, then sign in.');
  };

  const passwordStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3;

  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-800 flex-col items-center justify-center text-white p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white rounded-xl p-2.5">
            <span className="text-green-600 font-black text-3xl leading-none">M</span>
          </div>
          <span className="font-black text-4xl">MarketHub</span>
        </div>
        <p className="text-lg text-green-100 text-center mb-8">Join millions of happy shoppers today!</p>
        <div className="space-y-3 w-full max-w-xs">
          {[
            '✓ Free shipping on first order',
            '✓ Exclusive member discounts',
            '✓ Easy 30-day returns',
            '✓ 24/7 customer support',
            '✓ Secure & safe payments',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 text-sm">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="bg-green-600 rounded-lg p-1.5">
              <span className="text-white font-black text-xl leading-none">M</span>
            </div>
            <span className="text-green-700 font-bold text-2xl">MarketHub</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
            <p className="text-gray-500 text-sm mb-5">Sign up to start shopping</p>

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-3 rounded-lg mb-4 flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Juan dela Cruz"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-100 ${errors.name ? 'border-red-400 focus:border-red-400' : 'focus:border-green-500'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-100 ${errors.email ? 'border-red-400 focus:border-red-400' : 'focus:border-green-500'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="+63 9XX XXX XXXX"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-100 ${errors.phone ? 'border-red-400 focus:border-red-400' : 'focus:border-green-500'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-100 pr-10 ${errors.password ? 'border-red-400 focus:border-red-400' : 'focus:border-green-500'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className={`text-xs mt-0.5 ${passwordStrength === 1 ? 'text-red-500' : passwordStrength === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={handleChange('confirm')}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-green-100 ${errors.confirm ? 'border-red-400 focus:border-red-400' : 'focus:border-green-500'}`}
                  />
                  {form.confirm && form.confirm === form.password && (
                    <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>

              <p className="text-xs text-gray-500">
                By registering, you agree to our{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
