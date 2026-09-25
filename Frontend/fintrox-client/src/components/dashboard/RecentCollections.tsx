import React from 'react';

interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
}

interface RecentCollectionsProps {
  collections: RecentActivity[];
}

const RecentCollections: React.FC<RecentCollectionsProps> = ({ collections }) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f]">
          Recent Collections
        </h3>

        <button className="text-[#0f5238] text-[12px] leading-[16px] font-medium tracking-[0.02em] hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#bfc9c1]">
              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase">
                Type
              </th>

              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase">
                Collection
              </th>

              <th className="py-3 text-[11px] leading-[16px] tracking-[0.05em] font-bold text-[#404943] uppercase text-right">
                Time
              </th>
            </tr>
          </thead>

          <tbody>
            {collections.map((activity, index) => (
              <tr
                key={`${activity.timestamp}-${index}`}
                className="border-b border-[#bfc9c1]/30 hover:bg-[#eef5f7] transition-colors"
              >
                <td className="py-3 text-[14px] leading-[20px] text-[#161d1f]">
                  <span className="px-2 py-1 rounded-full bg-[#e8eff1] text-xs font-medium text-[#404943]">
                    {activity.type}
                  </span>
                </td>

                <td className="py-3 text-[14px] leading-[20px] text-[#161d1f] font-medium">
                  {activity.message}
                </td>

                <td className="py-3 text-[14px] leading-[20px] text-[#404943] text-right">
                  {new Date(activity.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCollections;