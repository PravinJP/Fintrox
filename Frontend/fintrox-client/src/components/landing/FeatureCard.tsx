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
      <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-2">
        <span className="material-symbols-outlined text-on-primary-fixed icon-fill-1">
          {icon}
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant">{description}</p>
      {features && (
        <ul className="flex flex-col gap-3 mt-4 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
              <span className="font-body-md text-body-md text-on-surface-variant">{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imageElement = (
    <div className="w-full lg:w-1/2 relative group z-10">
      <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant overflow-hidden group-hover:shadow-level-2 transition-shadow duration-300">
        <img alt={title} className="w-full h-auto object-cover" src={image} />
      </div>
    </div>
  );

  return (
    <section className="px-gutter max-w-7xl mx-auto py-xl flex flex-col lg:flex-row items-center gap-16 md:gap-24">
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