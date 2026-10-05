import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { RemoveScroll } from 'react-remove-scroll';
import { Button } from './Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Page, ROUTES, resolveRoute, getAlternateRoute } from '../routes';
import { Language } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

interface HeaderProps {
  onNavigate: (page: Page, lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { lang, dict } = useLanguage();
  const t = dict[lang].header;
  const navigate = useNavigate();
  const location = useLocation();
  const { isContactModalOpen, isCravingModeOpen, isMobileMenuOpen, setMobileMenuOpen: setIsMobileMenuOpen, isLocalPopupOpen } = useUI();
  const isAnyModalOpen = isContactModalOpen || isCravingModeOpen || isLocalPopupOpen;

  // Resolve current page from URL
  const resolved = resolveRoute(location.pathname);
  const activePage: Page = resolved ? resolved.page : 'home';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent, page: Page, hash?: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (hash) {
      // Navigate to the page first, then scroll to hash
      const route = ROUTES[lang][page];
      navigate(route);
      // Longer timeout to ensure page has rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 900);
    } else {
      onNavigate(page, lang);
    }
  };

  const handleLanguageSwitch = () => {
    const otherLang: Language = lang === 'BHS' ? 'EN' : 'BHS';
    const alternateRoute = getAlternateRoute(activePage, lang);
    navigate(alternateRoute);
  };

  const navItems = [
    { label: t.nav.home, page: 'home' as Page, hash: '' },
    { label: t.nav.isThisForYou, page: 'is-this-for-you' as Page, hash: '' },
    { label: t.nav.services, page: 'services' as Page, hash: '' },
    { label: t.nav.corporate, page: 'corporate' as Page, hash: '' },
    { label: t.nav.about, page: 'about-renata' as Page, hash: '' },
    { label: t.nav.blog, page: 'home' as Page, hash: 'blog' },
    { label: t.nav.faq, page: 'home' as Page, hash: 'faq' },
  ];

  return (
    <>
      {/* 
        FLOATING LIQUID GLASS CONTAINER 
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-500 pointer-events-none ${isVisible && !isAnyModalOpen ? 'translate-y-0' : '-translate-y-[150%]'}`}
      >
        <div className={`
            pointer-events-auto
            flex items-center justify-between
            w-full
            px-6 py-4 md:px-12 md:py-5
            transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
            
            /* SOLID WHITE BACKGROUND */
            bg-white
            shadow-sm border-b border-gray-100
        `}>
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, 'home')}
              className="group relative z-10 flex items-center gap-0.5"
            >
              <img src="/logo.svg" alt="HabitPlus Logo" className="h-12 md:h-16 w-auto transition-transform duration-500 group-hover:scale-105" />
            </a>
          </div>

          {/* Desktop Nav - Clean Text Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activePage === item.page && !item.hash;
              return (
                <a
                  key={item.label}
                  href={ROUTES[lang][item.page] + (item.hash ? `#${item.hash}` : '')}
                  onClick={(e) => handleNavClick(e, item.page, item.hash)}
                  className={`
                      text-[15px] font-bold transition-all duration-300 relative py-1
                      ${isActive
                      ? 'text-brand-blue after:content-[""] after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[3px] after:bg-brand-blue after:rounded-t-md'
                      : 'text-brand-dark hover:text-brand-blue'}
                    `}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher - Flags */}
            <button
              onClick={handleLanguageSwitch}
              className="flex items-center gap-3 transition-transform hover:scale-105"
              title={t.languageSwitchTitle}
            >
               <img 
                 src="https://flagcdn.com/w80/ba.png" 
                 alt="BHS" 
                 className={`w-9 object-cover shadow-sm transition-all rounded-sm ${lang === 'BHS' ? 'opacity-100 scale-110 ring-2 ring-brand-blue/40' : 'opacity-50 hover:opacity-80 grayscale-[30%]'}`} 
               />
               <img 
                 src="https://flagcdn.com/w80/gb.png" 
                 alt="EN" 
                 className={`w-9 object-cover shadow-sm transition-all rounded-sm ${lang === 'EN' ? 'opacity-100 scale-110 ring-2 ring-brand-blue/40' : 'opacity-50 hover:opacity-80 grayscale-[30%]'}`} 
               />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 text-brand-dark hover:bg-black/5 rounded-full transition-colors relative z-50 mr-1"
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Frosted Glass */}
      <RemoveScroll enabled={isMobileMenuOpen} className="pointer-events-none">
        <div
          className={`fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden flex flex-col px-8 pt-24 pb-8 overflow-y-auto
          ${isMobileMenuOpen
              ? 'opacity-100 pointer-events-auto backdrop-blur-3xl bg-white/60'
              : 'opacity-0 pointer-events-none backdrop-blur-none bg-transparent'}`}
        >
          <div className="my-auto w-full flex flex-col items-center">
            <div className="flex flex-col gap-6 items-center text-center">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={ROUTES[lang][item.page] + (item.hash ? `#${item.hash}` : '')}
                  onClick={(e) => handleNavClick(e, item.page, item.hash)}
                  className="text-2xl font-medium text-brand-dark hover:text-brand-blue transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-6 max-w-xs mx-auto w-full">
              <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200/50">
                <span className="text-gray-500 font-medium text-sm">{t.mobileJezik}</span>
                <button onClick={handleLanguageSwitch} className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full shadow-sm">
                   <img 
                     src="https://flagcdn.com/w80/ba.png" 
                     alt="BHS" 
                     className={`w-10 object-cover shadow-sm transition-all rounded-sm ${lang === 'BHS' ? 'opacity-100 scale-110 ring-2 ring-brand-blue/40' : 'opacity-50 grayscale-[30%]'}`} 
                   />
                   <img 
                     src="https://flagcdn.com/w80/gb.png" 
                     alt="EN" 
                     className={`w-10 object-cover shadow-sm transition-all rounded-sm ${lang === 'EN' ? 'opacity-100 scale-110 ring-2 ring-brand-blue/40' : 'opacity-50 grayscale-[30%]'}`} 
                   />
                </button>
              </div>
            </div>
          </div>
        </div>
      </RemoveScroll>
    </>
  );
};