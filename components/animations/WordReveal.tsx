import React, { useRef, useEffect, useState } from 'react';

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  center?: boolean;
  noWrap?: boolean;
}

export const WordReveal: React.FC<WordRevealProps> = ({ text, className = "", delay = 0, center = false, noWrap = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = text.split('\n');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col ${center ? 'items-center' : 'items-start'} ${className}`}
    >
      {lines.map((line, li) => {
        const words = line.split(' ');
        // Calculate the previous words count to offset the delay
        const previousWordsCount = lines.slice(0, li).reduce((acc, l) => acc + l.split(' ').length, 0);
        
        return (
          <div 
            key={li} 
            className={`flex ${noWrap ? 'flex-nowrap' : 'flex-wrap'} gap-x-[0.25em] gap-y-[0.1em] ${center ? 'justify-center' : 'justify-start'}`}
          >
            {words.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block py-[0.3em] px-[0.05em] -my-[0.3em] -mx-[0.05em]">
                <span
                  className={`inline-block transition-transform duration-[0.8s] cubic-bezier(0.2, 0.8, 0.2, 1) ${
                    isVisible ? 'translate-y-0' : 'translate-y-full'
                  }`}
                  style={{ transitionDelay: `${(previousWordsCount + i) * 0.1}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
