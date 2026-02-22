import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Corporate } from './pages/Corporate';
import { Services } from './pages/Services';
import { AboutRenata } from './pages/AboutRenata';
import { IsThisForYou } from './pages/IsThisForYou';
import { Contact } from './pages/Contact';
import { CravingMode } from './components/CravingMode';
import { Header } from './components/Header';

export type Page = 'home' | 'is-this-for-you' | 'services' | 'corporate' | 'about-renata' | 'contact';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="antialiased selection:bg-brand-blue selection:text-white min-h-screen flex flex-col">
      {/* Global Persistent Header */}
      <Header onNavigate={setCurrentPage} activePage={currentPage} />

      {/* Subpage Wrapper - fully responsive wide container without artificial scaling */}
      <main className="flex-1 transition-opacity duration-300 w-full">
        <div key={currentPage} className="animate-fade-in-up w-full">
          {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
          {currentPage === 'is-this-for-you' && <IsThisForYou onNavigate={setCurrentPage} />}
          {currentPage === 'corporate' && <Corporate onNavigate={setCurrentPage} />}
          {currentPage === 'services' && <Services onNavigate={setCurrentPage} />}
          {currentPage === 'about-renata' && <AboutRenata onNavigate={setCurrentPage} />}
          {currentPage === 'contact' && <Contact onNavigate={setCurrentPage} />}
        </div>
      </main>

      {/* Global Craving/Panic Button Component - Outside scaled wrapper to stay fixed to viewport */}
      <CravingMode />
    </div>
  );
};

export default App;