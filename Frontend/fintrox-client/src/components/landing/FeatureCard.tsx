import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  image: string;
  features?: string[];
  reverse?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  image,
  features,
  reverse = false,
}) => {
  const content = (
    <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 z-10">
      <div className="w-12 h-12 bg-[#c1ecd4] rounded-lg flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-[#002114] icon-fill-1">
          {icon}
        </span>
      </div>
      <h2 className="text-[32px] leading-[40px] font-semibold text-[#191c1c]">{title}</h2>
      <p className="text-[18px] leading-[28px] text-[#414844]">{description}</p>
      {features && (
        <ul className="flex flex-col gap-3 mt-4 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#012d1d] mt-1">check_circle</span>
              <span className="text-[16px] leading-[24px] text-[#414844]">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imageElement = (
    <div className="w-full lg:w-1/2 relative z-10">
      <div className="bg-white rounded-xl shadow-sm border border-[#c1c8c2] overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img alt={title} className="w-full h-auto object-cover" src={image} />
      </div>
    </div>
  );

  return (
    <section className="px-6 max-w-7xl mx-auto py-20 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
      {reverse ? (
        <>
          {content}
          {imageElement}
        </>
      ) : (
        <>
          {imageElement}
          {content}
        </>
      )}
    </section>
  );
};

export default FeatureCard;