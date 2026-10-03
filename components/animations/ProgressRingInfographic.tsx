import React, { useEffect, useState, useRef } from 'react';
import { Users, Calendar, Eraser, TrendingUp, Clock, Heart, LucideIcon } from 'lucide-react';
import { Button } from '../Button';
import { useUI } from '../../context/UIContext';

interface ProgressRingProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  colorClass: 'red' | 'blue';
  delay: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ icon: Icon, title, desc, colorClass, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ringRef.current) observer.observe(ringRef.current);
    return () => observer.disconnect();
  }, [delay]);

  const redStyles = {
    ringBg: 'stroke-red-100',
    ringFill: 'stroke-red-500',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500'
  };

  const blueStyles = {
    ringBg: 'stroke-brand-blue/20',
    ringFill: 'stroke-brand-blue',
    iconBg: 'bg-brand-blue/10',
    iconColor: 'text-brand-blue'
  };

  const styles = colorClass === 'red' ? redStyles : blueStyles;

  return (
    <div 
      ref={ringRef}
      className={`flex flex-col items-center text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle 
            cx="72" cy="72" r="60" 
            className={`fill-none stroke-[8] ${styles.ringBg}`} 
          />
          <circle 
            cx="72" cy="72" r="60" 
            className={`fill-none stroke-[8] stroke-round transition-all duration-[1500ms] ease-out ${styles.ringFill}`}
            style={{ 
              strokeDasharray: 377, 
              strokeDashoffset: isVisible ? 0 : 377 
            }}
          />
        </svg>
        <div className={`relative z-10 w-16 h-16 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center`}>
          <Icon size={32} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-brand-dark/80 mb-2 tracking-tight">{title}</h3>
      <p className="text-[15px] leading-relaxed text-brand-dark/50 max-w-[220px]">{desc}</p>
    </div>
  );
};

interface ProgressRingInfographicProps {
  t: any;
}

export const ProgressRingInfographic: React.FC<ProgressRingInfographicProps> = ({ t }) => {
  const { openContactModal } = useUI();
  const iconMap: { [key: string]: LucideIcon } = { Users, Calendar, Eraser, TrendingUp, Clock, Heart };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
      {/* Negative Section */}
      <div className="w-full mb-20">
        <h2 className="text-3xl font-serif font-bold text-red-500 text-center mb-16">
          {t.prepoznajSebeNegativeTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {t.prepoznajSebeNegativeItems.map((item: any, idx: number) => (
            <ProgressRing 
              key={idx}
              icon={iconMap[item.icon]} 
              title={item.title} 
              desc={item.desc}
              colorClass="red"
              delay={200 + idx * 200}
            />
          ))}
        </div>
      </div>

      {/* Positive Section */}
      <div className="w-full mb-16">
        <h2 className="text-3xl font-serif font-bold text-brand-blue text-center mb-16">
          {t.prepoznajSebePositiveTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {t.prepoznajSebePositiveItems.map((item: any, idx: number) => (
            <ProgressRing 
              key={idx}
              icon={iconMap[item.icon]} 
              title={item.title} 
              desc={item.desc}
              colorClass="blue"
              delay={1200 + idx * 200}
            />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className={`mt-8 transition-all duration-1000 transform opacity-100 translate-y-0`}>
        <Button 
          size="lg" 
          variant="primary" 
          onClick={openContactModal}
          className="shadow-xl shadow-brand-blue/20 px-10 py-5 rounded-full text-lg"
        >
          {t.prepoznajSebeBtn}
        </Button>
      </div>
    </div>
  );
};
