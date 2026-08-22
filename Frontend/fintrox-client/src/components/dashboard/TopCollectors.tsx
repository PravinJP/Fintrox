import React from 'react';

interface TopCollectorsProps {
  data: { name: string; amount: number; percentage: number }[];
}

const TopCollectors: React.FC<TopCollectorsProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f]">Top Collectors</h3>
      </div>
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-[12px] leading-[16px] font-medium tracking-[0.02em] mb-1">
              <span className="text-[#161d1f]">{item.name}</span>
              <span className="text-[#404943] font-medium">${item.amount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#e8eff1] rounded-full h-2">
              <div
                className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCollectors;