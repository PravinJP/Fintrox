import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const CreateOrganization: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    gst: '',
    businessType: '',
  });

  // ✅ Check if user is Individual Lender
  const isIndividualLender = user?.userType === 'INDIVIDUAL_LENDER';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      
      // ✅ If Individual Lender, remove GST and set business type
      if (isIndividualLender) {
        delete payload.gst;
        payload.businessType = 'INDIVIDUAL';
      }

      const response = await api.post('/organizations', payload);
      toast.success('Organization created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 font-heading text-4xl font-bold text-on-surface tracking-tight">
            Create Your Organization
          </h2>
          <p className="mt-2 text-lg text-on-surface-variant max-w-xl mx-auto">
            {isIndividualLender 
              ? 'Set up your individual lending business to start managing loans and collections.'
              : 'Set up your organization to start managing loans, collections, and employees.'
            }
          </p>
        </div>

        <div className="bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.03)] rounded-xl p-6 md:p-12 border border-[#c1c8c2]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Organization Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface placeholder-[#717973] focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                  placeholder={isIndividualLender ? 'Rajesh Sharma - Individual Lender' : 'ABC Finance Pvt Ltd'}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Address <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface placeholder-[#717973] focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                  placeholder="123, Main Road, Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Phone <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface placeholder-[#717973] focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface placeholder-[#717973] focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                  placeholder="info@abcfinance.com"
                />
              </div>

              {/* ✅ GST - Show only for Finance Company Owners */}
              {!isIndividualLender && (
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1">
                    GST <span className="text-on-surface-variant font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface placeholder-[#717973] focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                    placeholder="27AABCU1234D1ZP"
                  />
                </div>
              )}

              {/* ✅ Business Type - Show only for Finance Company Owners */}
              {!isIndividualLender && (
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1">
                    Business Type <span className="text-on-surface-variant font-normal">(Optional)</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="block w-full rounded-[12px] border-[#c1c8c2] bg-white px-4 py-3 text-on-surface focus:ring-0 focus:border-[#1b4332] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(27,67,50,0.2)] outline-none"
                  >
                    <option value="">Select business type</option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="PVT_LTD">Private Limited</option>
                    <option value="LLP">LLP</option>
                  </select>
                </div>
              )}

              {/* ✅ For Individual Lender - Show simplified message */}
              {isIndividualLender && (
                <div className="sm:col-span-2 mt-2">
                  <div className="bg-[#c1ecd4]/20 p-4 rounded-lg border border-[#c1ecd4]">
                    <p className="text-sm text-[#0e5138]">
                      <span className="font-semibold">💡 Individual Lender:</span> GST and Business Type are not required for individual lenders. Your organization will be set up as "INDIVIDUAL".
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[#c1c8c2] flex flex-col items-center justify-center space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-[12px] shadow-sm font-semibold text-sm text-white bg-[#1b4332] hover:bg-[#2c694e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b4332] transition-colors min-h-[48px] items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-sm text-[#012d1d] hover:text-[#2c694e] transition-colors underline-offset-4 hover:underline"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;