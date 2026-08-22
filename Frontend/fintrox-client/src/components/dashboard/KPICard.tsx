import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-[#beead1] rounded-lg text-[#436b58]">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={`bg-[#cee9d3] px-2 py-1 rounded-full text-[11px] leading-[16px] tracking-[0.05em] font-bold flex items-center gap-1 text-[#354c3b]`}>
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[12px] leading-[16px] tracking-[0.02em] font-medium text-[#404943] mb-1">{label}</p>
        <h3 className="text-[24px] leading-[32px] font-bold text-[#161d1f]">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;