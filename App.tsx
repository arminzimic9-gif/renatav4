import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Corporate } from './pages/Corporate';
import { Services } from './pages/Services';
import { AboutRenata } from './pages/AboutRenata';
import { IsThisForYou } from './pages/IsThisForYou';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { AdminLogin } from './pages/AdminLogin';
import { CravingMode } from './components/CravingMode';
import { NewsletterPopup } from './components/NewsletterPopup';
import { Header } from './components/Header';
import { LanguageProvider } from './context/LanguageContext';
import { UIProvider } from './context/UIContext';
import { AdminProvider } from './context/AdminContext';
import { GlobalContactModal } from './components/GlobalContactModal';
import { LoadingScreen } from './components/LoadingScreen';
import { CookieBanner } from './components/CookieBanner';
import { Page, ROUTES } from './routes';
import { Language } from './context/LanguageContext';
// Admin panel v2
import { AdminShell } from './admin/layout/AdminShell';
import { AdminDashboardNew } from './admin/pages/AdminDashboardNew';
import { ContentEditor } from './admin/pages/ContentEditor';
import { BlogList } from './admin/pages/BlogList';
import { BlogEditor } from './admin/pages/BlogEditor';
import { Settings } from './admin/pages/Settings';
import { PopupList } from './admin/pages/PopupList';
import { PopupEditor } from './admin/pages/PopupEditor';
import { AdminPanelProvider } from './admin/context/AdminPanelContext';
import AdminRoute from './admin/components/AdminRoute';
import EventPopup from './components/EventPopup';
// Fakture učitavamo tek kad se otvori admin/fakture (teški PDF paketi)
const InvoicesApp = React.lazy(() => import('./admin/invoices/InvoicesApp'));

// Inner app that has access to router context
const AppInner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    } else {
      window.scrollTo(0, 0);
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  }, [location.pathname, location.hash, location.key]);

  const handleNavigate = (page: Page, lang: Language) => {
    const route = ROUTES[lang][page];
    navigate(route);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AdminProvider>
      <LanguageProvider>
        <UIProvider isAppLoading={isLoading && !isAdminRoute}>
          {isLoading && !isAdminRoute && <LoadingScreen onComplete={() => setIsLoading(false)} />}
          <div className={`antialiased selection:bg-brand-blue selection:text-white min-h-screen flex flex-col transition-opacity duration-1000 overflow-x-hidden ${isLoading && !isAdminRoute ? 'opacity-0' : 'opacity-100'}`}>
            {/* Global Persistent Header - Hide on Admin */}
            {!isAdminRoute && <Header onNavigate={handleNavigate} />}

            {/* Subpage Wrapper */}
            <main className="flex-1 transition-opacity duration-300 w-full">
              <div key={location.pathname} className="animate-fade-in w-full">
                <Routes>
                  {/* Admin routes */}
                  <Route path="/admin">
                    <Route index element={<AdminLogin />} />
                    <Route
                      element={
                        <AdminPanelProvider>
                          <AdminShell />
                        </AdminPanelProvider>
                      }
                    >
                      <Route path="dashboard" element={<AdminDashboardNew />} />
                      <Route path="content/:lang/:section" element={<ContentEditor />} />
                      <Route path="blog" element={<BlogList />} />
                      <Route path="blog/:id" element={<BlogEditor />} />
                      <Route path="popups" element={<PopupList />} />
                      <Route path="popups/new" element={<PopupEditor />} />
                      <Route path="popups/:id" element={<PopupEditor />} />
                      <Route path="settings" element={<Settings />} />
                      <Route
                        path="fakture"
                        element={
                          <Suspense fallback={<div style={{ color: '#888', padding: 24 }}>Učitavanje...</div>}>
                            <InvoicesApp />
                          </Suspense>
                        }
                      />
                    </Route>
                  </Route>

                  {/* BHS routes */}
                  <Route path="/" element={<Home onNavigate={handleNavigate} />} />
                  <Route path="/da-li-je-ovo-za-vas" element={<IsThisForYou onNavigate={handleNavigate} />} />
                  <Route path="/usluge" element={<Services onNavigate={handleNavigate} />} />
                  <Route path="/za-organizacije" element={<Corporate onNavigate={handleNavigate} />} />
                  <Route path="/onama" element={<AboutRenata onNavigate={handleNavigate} />} />
                  <Route path="/kontakt" element={<Contact onNavigate={handleNavigate} />} />
                  <Route path="/politika-privatnosti" element={<PrivacyPolicy onNavigate={handleNavigate} />} />
                  <Route path="/blog" element={<Blog onNavigate={handleNavigate} />} />
                  <Route path="/blog/:slug" element={<BlogPost onNavigate={handleNavigate} />} />

                  {/* EN routes */}
                  <Route path="/home" element={<Home onNavigate={handleNavigate} />} />
                  <Route path="/is-this-for-you" element={<IsThisForYou onNavigate={handleNavigate} />} />
                  <Route path="/services" element={<Services onNavigate={handleNavigate} />} />
                  <Route path="/for-organisations" element={<Corporate onNavigate={handleNavigate} />} />
                  <Route path="/about-us" element={<AboutRenata onNavigate={handleNavigate} />} />
                  <Route path="/contact" element={<Contact onNavigate={handleNavigate} />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy onNavigate={handleNavigate} />} />
                  <Route path="/en-blog" element={<Blog onNavigate={handleNavigate} />} />
                  <Route path="/en-blog/:slug" element={<BlogPost onNavigate={handleNavigate} />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>

            {!isAdminRoute && (
              <>
                <CravingMode />
                <NewsletterPopup />
                <GlobalContactModal />
                <CookieBanner />
                <EventPopup />
              </>
            )}
          </div>
        </UIProvider>
      </LanguageProvider>
    </AdminProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
};

export default App;