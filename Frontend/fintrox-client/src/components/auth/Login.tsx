import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import type { AppDispatch } from '../../store/store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f4fafd]">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[#eef5f7] border-r border-[#dde4e6] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 100%, #2d6a4f 0%, transparent 50%)' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#2d6a4f] text-4xl icon-fill-1">
              account_balance
            </span>
            <h1 className="text-[32px] leading-[40px] font-bold text-[#161d1f] tracking-[-0.02em]">
              Fintrox
            </h1>
          </div>
          <p className="text-[16px] leading-[24px] text-[#404943] max-w-md">
            Finance Management Platform
          </p>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md aspect-square rounded-2xl bg-[#e8eff1] flex items-center justify-center overflow-hidden border border-[#bfc9c1] shadow-sm relative">
            <img 
              className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbhQlW-3-9pJjlWett2sAR59nq03CVBVOlwI4z_mtDaPwimxka6720PCtuiKER_FgAZXv9LetYucDmtkkQLstMec7Aezu0gVF7StdX-qXprO05og_Uicox5yHKkQr84IcpUdux0o8teWCuzdXeBpFVYwOz2UUP0eGMuAsxa9pf07w_8BEli7F8A8ixHURVecJ76UkyMjcTiQH6WYUnCOEWCzakkQinapOAUGm_juisdcpI61Xcp4y8"
              alt="Financial growth illustration"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#eef5f7] via-transparent to-transparent opacity-50"></div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[14px] leading-[20px] text-[#404943] max-w-sm">
            Secure, precise, and professional tools to manage your assets with absolute clarity.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 relative">
        {/* Mobile Brand */}
        <div className="absolute top-4 left-4 lg:hidden flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2d6a4f] text-3xl icon-fill-1">
            account_balance
          </span>
          <span className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em]">
            Fintrox
          </span>
        </div>

        <div className="w-full max-w-[440px] bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
          <div className="mb-8">
            <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em] mb-2">
              Sign In
            </h2>
            <p className="text-[14px] leading-[20px] text-[#404943]">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#bfc9c1] text-[20px]">mail</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full h-[48px] pl-10 pr-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943]">
                  Password
                </label>
                <a className="text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#2d6a4f] hover:text-[#0f5238] transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[#bfc9c1] text-[20px]">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full h-[48px] pl-10 pr-10 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#707973] hover:text-[#161d1f] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#bfc9c1] text-[#2d6a4f] focus:ring-[#2d6a4f] bg-[#f4fafd]"
                id="remember-me"
              />
              <label className="ml-2 block text-[14px] leading-[20px] text-[#404943]" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[12px] shadow-sm text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d6a4f] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[14px] leading-[20px] text-[#404943]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[12px] leading-[16px] font-semibold tracking-[0.02em] text-[#2d6a4f] hover:text-[#0f5238] transition-colors underline decoration-[#2d6a4f]/30 underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;