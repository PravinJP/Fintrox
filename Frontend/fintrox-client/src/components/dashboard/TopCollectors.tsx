import React from 'react';

interface TopCollector {
  name?: string;
  amount?: number | null;
  percentage?: number | null;
}

interface TopCollectorsProps {
  data: TopCollector[];
}

const TopCollectors: React.FC<TopCollectorsProps> = ({ data }) => {
  const safeData = Array.isArray(data) ? data : [];

  const formatAmount = (amount?: number | null) => {
    const safeAmount = Number(amount ?? 0);

    return safeAmount.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(45,106,79,0.05)] border border-[#bfc9c1]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-[#161d1f]">
          Top Collectors
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {safeData.map((item, index) => {
          const percentage = Number(item?.percentage ?? 0);

          return (
            <div key={index}>
              <div className="flex justify-between text-[12px] leading-[16px] font-medium tracking-[0.02em] mb-1">
                <span className="text-[#161d1f]">
                  {item?.name || 'Unknown'}
                </span>

                <span className="text-[#404943] font-medium">
                  ₹{formatAmount(item?.amount)}
                </span>
              </div>

              <div className="w-full bg-[#e8eff1] rounded-full h-2">
                <div
                  className="bg-[#2D6A4F] h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}

        {safeData.length === 0 && (
          <div className="py-6 text-center text-sm text-[#404943]">
            No collection data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCollectors;