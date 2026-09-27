import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f4fafd]">
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-[#eef5f7] border-r border-[#dde4e6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 100% 100%, #2d6a4f 0%, transparent 50%)',
          }}
        ></div>
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
              className="w-full h-full object-cover opacity-90"
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 relative">
        <div className="absolute top-4 left-4 lg:hidden flex items-center gap-2">
          <span className="material-symbols-outlined text-[#2d6a4f] text-3xl icon-fill-1">
            account_balance
          </span>
          <span className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em]">
            Fintrox
          </span>
        </div>

        <div className="w-full max-w-[440px] bg-white rounded-[12px] p-8 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
          {success ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c1ecd4] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0e5138] text-3xl">
                  mark_email_read
                </span>
              </div>
              <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] text-center mb-2">
                Check your email
              </h2>
              <p className="text-[14px] leading-[20px] text-[#404943] text-center mb-6">
                We've sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
              </p>
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 rounded-[12px] text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] transition-all"
              >
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-[24px] leading-[32px] font-semibold text-[#161d1f] tracking-[-0.01em] mb-2">
                  Forgot password?
                </h2>
                <p className="text-[14px] leading-[20px] text-[#404943]">
                  Enter your email and we'll send you a reset link.
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
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#bfc9c1] text-[20px]">
                        mail
                      </span>
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-[12px] shadow-sm text-[12px] leading-[16px] font-bold tracking-[0.02em] text-white bg-[#2d6a4f] hover:bg-[#3f6653] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2d6a4f] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
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
    </div>
  );
};

export default ForgotPassword;