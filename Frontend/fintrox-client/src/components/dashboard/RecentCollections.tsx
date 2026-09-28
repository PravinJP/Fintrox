import React from 'react';

interface RecentCollectionsProps {
  collections: Array<{
    type?: string;
    message?: string;
    timestamp?: string;
    customerName?: string;
    amount?: number;
    collectedAt?: string;
    route?: string;
    time?: string;
  }>;
}

const RecentCollections: React.FC<RecentCollectionsProps> = ({ collections }) => {
  const formatTime = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseActivity = (activity: any) => {
    // Owner format: { type, message, timestamp }
    if (activity?.message) {
      const match = activity.message.match(/Collection of ₹([\d.]+) from (.+)/);
      return {
        customer: match ? match[2] : 'Unknown',
        amount: match ? parseFloat(match[1]) : 0,
        time: formatTime(activity.timestamp),
      };
    }

    // Lender/Employee format: { customerName, amount, collectedAt }
    return {
      customer: activity?.customerName || 'Unknown',
      amount: Number(activity?.amount ?? 0),
      time: formatTime(activity?.collectedAt || activity?.time),
    };
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-lg">Recent Collections</h3>
        <button className="text-emerald-700 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!collections || collections.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-slate-400 text-sm">
                  No recent collections
                </td>
              </tr>
            ) : (
              collections.map((activity, index) => {
                const parsed = parseActivity(activity);
                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-3 text-sm text-slate-900 font-medium">
                      {parsed.customer}
                    </td>
                    <td className="py-3 text-sm font-semibold text-emerald-700 text-right">
                      ₹{parsed.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-sm text-slate-500 text-right">
                      {parsed.time}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCollections;