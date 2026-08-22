import React from 'react';

interface Collection {
  id: number;
  customerName: string;
  initials: string;
  amount: number;
  route: string;
  time: string;
}

interface RecentCollectionsProps {
  collections: Collection[];
}

const RecentCollections: React.FC<RecentCollectionsProps> = ({ collections }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f]">Recent Collections</h3>
        <button className="text-[#0f5238] text-[12px] leading-[16px] font-medium tracking-[0.02em] hover:underline">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#bfc9c1]">
              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase">Customer</th>
              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase">Amount</th>
              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase">Route</th>
              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id} className="border-b border-[#bfc9c1]/30 hover:bg-[#eef5f7] transition-colors">
                <td className="py-3 text-[14px] leading-[20px] text-[#161d1f] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e8eff1] flex items-center justify-center text-xs font-medium text-[#404943]">
                    {col.initials}
                  </div>
                  {col.customerName}
                </td>
                <td className="py-3 text-[14px] leading-[20px] text-[#161d1f] font-medium">
                  ${col.amount.toFixed(2)}
                </td>
                <td className="py-3 text-[14px] leading-[20px] text-[#404943]">{col.route}</td>
                <td className="py-3 text-[14px] leading-[20px] text-[#404943] text-right">{col.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCollections;