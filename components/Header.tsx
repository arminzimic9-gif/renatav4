import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './Button';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  activePage?: Page;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage = 'home' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'BHS' | 'EN'>('BHS');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine direction and visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down & past threshold
      } else {
        setIsVisible(true); // Scrolling up or at top
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent, page: Page, hash?: string) => {
    e.preventDefault();
    onNavigate(page);
    setIsMobileMenuOpen(false);

    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'BHS' ? 'EN' : 'BHS');
  };

  return (
    <>
      {/* 
        FLOATING LIQUID GLASS CONTAINER 
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-500 pointer-events-none ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'}`}
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
              href="#"
              onClick={(e) => handleNavClick(e, 'home')}
              className="group relative z-10 flex items-center gap-0.5"
            >
              <span className="text-2xl md:text-3xl tracking-tight" style={{ fontFamily: '"Fredoka One", cursive' }}>
                <span style={{ color: '#0097b2' }}>Habit</span>
                <span style={{ color: '#5392ce' }}>Plus</span>
              </span>
            </a>
          </div>

          {/* Desktop Nav - Clean Text Links */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'Početna', page: 'home', hash: '' },
              { label: 'Da li je ovo za tebe?', page: 'is-this-for-you', hash: '' },
              { label: 'Za Organizacije', page: 'corporate', hash: '' },
              { label: 'Usluge/Podrška', page: 'services', hash: '' },
              { label: 'O Nama', page: 'about-renata', hash: '' },
              { label: 'FAQs', page: 'home', hash: 'faq' },
            ].map((item) => {
              const isActive = activePage === item.page && !item.hash;
              return (
                <a
                  key={item.label}
                  href={`#${item.hash || item.page}`}
                  onClick={(e) => handleNavClick(e, item.page as Page, item.hash)}
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
            {/* Language Switcher - Text only */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors"
            >
              <Globe size={16} />
              <span className={lang === 'BHS' ? 'text-brand-blue' : ''}>BHS</span> / <span className={lang === 'EN' ? 'text-brand-blue' : ''}>EN</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brand-dark hover:bg-black/5 rounded-full transition-colors relative z-50 mr-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Frosted Glass */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden flex flex-col justify-center px-8 
        ${isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-3xl bg-white/60'
            : 'opacity-0 pointer-events-none backdrop-blur-none bg-transparent'}`}
      >
        <div className="flex flex-col gap-8 items-center text-center">
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">Početna</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'is-this-for-you')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">Da li je ovo za tebe?</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'corporate')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">Za Organizacije</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'services')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">Usluge/Podrška</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'about-renata')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">O Nama</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'home', 'faq')} className="text-3xl font-medium text-brand-dark hover:text-brand-blue transition-colors">FAQs</a>
        </div>

        <div className="mt-12 space-y-6 max-w-xs mx-auto w-full">
          <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200/50">
            <span className="text-gray-500 font-medium text-sm">Jezik:</span>
            <button onClick={toggleLang} className="text-lg font-bold text-brand-blue flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1 rounded-full shadow-sm">
              <Globe size={18} /> {lang}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};