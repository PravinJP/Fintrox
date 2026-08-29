import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('OWNER');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await dispatch(register({
        fullName,
        email,
        phone,
        password,
        userType
      })).unwrap();
      
      console.log('✅ Registration successful:', result);
      toast.success('Account created! Please set up your organization.');
      
      // ✅ Navigate to create organization page
      navigate('/settings/organization');
      
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f4fafd] py-8">
      <div className="w-full flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#2d6a4f] text-3xl icon-fill-1">
              account_balance
            </span>
            <span className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em]">
              Fintrox
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em] mb-2">
              Create Account
            </h2>
            <p className="text-[14px] leading-[20px] text-[#404943]">
              Start your free trial today
            </p>
          </div>
          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full h-[48px] px-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full h-[48px] px-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full h-[48px] px-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Account Type
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="block w-full h-[48px] px-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
              >
                <option value="OWNER">Finance Company Owner</option>
                <option value="INDIVIDUAL_LENDER">Individual Lender</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full h-[48px] px-3 pr-10 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                  placeholder="Create a password"
                  required
                  minLength={6}
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
            <div>
              <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full h-[48px] px-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[12px] shadow-sm text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d6a4f] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[14px] leading-[20px] text-[#404943]">
              Already have an account?{' '}
              <Link to="/login" className="text-[12px] leading-[16px] font-semibold tracking-[0.02em] text-[#2d6a4f] hover:text-[#0f5238] transition-colors underline decoration-[#2d6a4f]/30 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;