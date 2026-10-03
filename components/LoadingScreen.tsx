import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Language } from '../context/LanguageContext';
import { RemoveScroll } from 'react-remove-scroll';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageSelect = (lang: Language) => {
    setIsVisible(false);
    
    setTimeout(() => {
        if (location.pathname === '/' || location.pathname === '/home') {
            navigate(lang === 'EN' ? '/home' : '/');
        }
        onComplete();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <RemoveScroll enabled={isVisible}>
      <div className={`fixed inset-0 z-[1000] bg-brand-cream/95 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-500 overflow-hidden`}>
        <div className="max-w-md w-full px-8 flex flex-col items-center relative z-10 animate-fade-in-up">
          {/* Logo */}
          <div className="mb-12">
             <img src="/logo.svg" alt="HabitPlus Logo" className="h-20 md:h-24 w-auto drop-shadow-sm" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8 text-center">
            Odaberite jezik<br/>
            <span className="text-xl font-normal text-slate-500">Choose your language</span>
          </h2>

          {/* Language Options */}
          <div className="flex gap-10 w-full justify-center">
              {/* BHS */}
              <button 
                  onClick={() => handleLanguageSelect('BHS')}
                  className="group flex flex-col items-center gap-3 transition-all cursor-pointer"
              >
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-transparent group-hover:ring-brand-blue/20 transition-all">
                    <img 
                      src="https://flagcdn.com/w320/ba.png" 
                      alt="Bosanski jezik"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <span className="font-bold text-brand-dark group-hover:text-brand-blue transition-colors text-lg">BHS</span>
              </button>

              {/* EN */}
              <button 
                  onClick={() => handleLanguageSelect('EN')}
                  className="group flex flex-col items-center gap-3 transition-all cursor-pointer"
              >
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-4 ring-transparent group-hover:ring-brand-blue/20 transition-all">
                    <img 
                      src="https://flagcdn.com/w320/gb.png" 
                      alt="English language"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <span className="font-bold text-brand-dark group-hover:text-brand-blue transition-colors text-lg">English</span>
              </button>
          </div>

          {/* Mobile Experience Warning */}
          <div className="mt-16 text-center md:hidden text-brand-dark/50 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm font-medium">Za najbolje iskustvo koristite računar</p>
            <p className="text-xs mt-1">For the best experience use desktop</p>
          </div>
        </div>
      </div>
    </RemoveScroll>
  );
};

