import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post(
        `/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`
      );
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f4fafd] p-4">
        <div className="w-full max-w-[440px] bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ffdad6] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#93000a] text-3xl">
              error
            </span>
          </div>
          <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-[14px] leading-[20px] text-[#404943] mb-6">
            This reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="w-full flex justify-center py-3 px-4 rounded-[12px] text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f4fafd] p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
        {success ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c1ecd4] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0e5138] text-3xl">
                check_circle
              </span>
            </div>
            <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] text-center mb-2">
              Password Reset
            </h2>
            <p className="text-[14px] leading-[20px] text-[#404943] text-center">
              Your password has been updated. Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em] mb-2">
                Reset your password
              </h2>
              <p className="text-[14px] leading-[20px] text-[#404943]">
                Choose a new password for your Fintrox account.
              </p>
            </div>

            {error && (
              <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[12px] leading-[16px] font-medium tracking-[0.02em] text-[#404943] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#bfc9c1] text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full h-[48px] pl-10 pr-10 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                    placeholder="Enter new password"
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
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#bfc9c1] text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full h-[48px] pl-10 pr-3 rounded-[12px] border-[#bfc9c1]/60 bg-[#f4fafd] text-[#161d1f] focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] sm:text-sm transition-colors outline-none"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[12px] shadow-sm text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d6a4f] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-[12px] leading-[16px] font-semibold tracking-[0.02em] text-[#2d6a4f] hover:text-[#0f5238] transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;