import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

const COOKIE_KEY = 'habitplus_cookies_accepted';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { lang, dict } = useLanguage();
  const t = dict[lang].cookieBanner;
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show again if the user already made a choice
    try {
      if (localStorage.getItem(COOKIE_KEY)) return;
    } catch {
      // localStorage unavailable — fall through and show the banner
    }
    // Small delay so it doesn't flash on first paint
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_KEY, 'essential');
    setVisible(false);
  };

  const openPrivacy = () => {
    navigate(ROUTES[lang]['privacy-policy']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Glassmorphism backdrop strip */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Icon + Text */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="p-2.5 bg-brand-blue/10 rounded-xl text-brand-blue shrink-0 mt-0.5">
              <Cookie size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-brand-dark text-sm mb-0.5">
                {t.title}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.text}
                <button
                  onClick={openPrivacy}
                  className="text-brand-blue hover:underline font-medium transition-colors"
                >
                  {dict[lang].privacyPolicy.title}
                </button>
                .
              </p>
            </div>
          </div>

          {/* Actions — grid ensures all 3 buttons are identical width */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center shrink-0 pl-0 sm:pl-4">
            <button
              onClick={decline}
              className="w-full sm:w-44 px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-bold text-gray-500 border-2 border-gray-200 hover:bg-gray-50 transition-all text-center"
            >
              {t.decline}
            </button>
            <button
              onClick={acceptEssential}
              className="w-full sm:w-44 px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-bold text-gray-700 border-2 border-gray-300 hover:border-brand-blue/40 hover:bg-gray-50 transition-all text-center"
            >
              {t.acceptEssential}
            </button>
            <button
              onClick={accept}
              className="col-span-2 sm:col-span-1 w-full sm:w-44 px-4 py-2.5 sm:py-3 rounded-xl text-[13px] sm:text-sm font-bold bg-brand-blue text-white border-2 border-transparent hover:bg-brand-blue/90 transition-all shadow-md shadow-brand-blue/20 text-center"
            >
              {t.acceptAll}
            </button>
            <button
              onClick={decline}
              className="p-2 text-gray-300 hover:text-gray-500 transition-colors hidden sm:flex"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
