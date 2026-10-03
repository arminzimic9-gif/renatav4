import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { resolveRoute } from '../routes';
import { popupService } from '../admin/services/firestoreService';
import { PopupDocument } from '../admin/types';

// Koristi URL za detekciju jezika — ne importuje useLanguage (HMR safe)
function getLangFromPath(pathname: string): 'BHS' | 'EN' {
  const resolved = resolveRoute(pathname);
  return resolved ? resolved.lang : 'BHS';
}

const SESSION_KEY = (lang: string) => `habitplus_popup_shown_${lang.toLowerCase()}`;

const EventPopup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState<PopupDocument | null>(null);
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const isClosingRef = React.useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Ne prikazuj na admin stranicama
    if (location.pathname.startsWith('/admin')) return;

    const lang = getLangFromPath(location.pathname);
    const sessionKey = SESSION_KEY(lang);

    // Ako je već prikazan (ili se upravo zatvara) za ovaj jezik, preskoči
    if (sessionStorage.getItem(sessionKey) || isClosingRef.current) return;

    let cancelled = false;

    const fetchPopup = async () => {
      try {
        const activePopup = await popupService.getActive(lang);
        if (cancelled || !activePopup || sessionStorage.getItem(sessionKey)) return;

        setPopup(activePopup);
        setTimeout(() => {
          if (cancelled) return;
          setVisible(true);
          setTimeout(() => { if (!cancelled) setAnimIn(true); }, 10);
        }, 800);
      } catch (err) {
        // Tiha greška — popup nije kritičan
      }
    };

    fetchPopup();
    return () => { cancelled = true; };
  }, [location.pathname]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setAnimIn(false);
    const lang = getLangFromPath(location.pathname);
    sessionStorage.setItem(SESSION_KEY(lang), 'true');
    setTimeout(() => {
      setVisible(false);
      setPopup(null);
      isClosingRef.current = false;
    }, 300);
  }, [location.pathname]);

  const handleCta = useCallback(() => {
    if (!popup) return;
    handleClose();
    setTimeout(() => {
      const url = popup.cta_url;
      if (url.startsWith('http') || url.startsWith('//')) {
        window.open(url, '_blank', 'noopener noreferrer');
      } else {
        navigate(url);
      }
    }, 320);
  }, [popup, navigate, handleClose]);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, handleClose]);

  if (!visible || !popup) return null;

  const lang = getLangFromPath(location.pathname);
  const imageUrl = isMobile
    ? (popup.image_portrait || popup.image_landscape)
    : (popup.image_landscape || popup.image_portrait);
  const ctaLabel = lang === 'BHS' ? popup.cta_label_bhs : popup.cta_label_en;
  const title = lang === 'BHS' ? popup.title_bhs : popup.title_en;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        transition: 'opacity 0.3s ease',
        opacity: animIn ? 1 : 0,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '400px' : '680px',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: animIn ? 'scale(1)' : 'scale(0.93)',
          opacity: animIn ? 1 : 0,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Karta */}
        <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', background: '#1a1a1a', boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>

          {/* X dugme */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: '14px', right: '14px', zIndex: 20,
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: 'none',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(4px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
            aria-label="Zatvori"
          >
            <X size={16} />
          </button>

          {/* Slika */}
          {imageUrl ? (
            <div style={{
              width: '100%',
              aspectRatio: isMobile ? '9/16' : '16/9',
              maxHeight: isMobile ? '80vh' : '70vh',
              overflow: 'hidden',
            }}>
              <img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : (
            <div style={{ padding: '60px 32px', textAlign: 'center' }}>
              <p style={{ color: '#f5f5f5', fontSize: '22px', fontWeight: 700, margin: 0 }}>{title}</p>
            </div>
          )}

          {/* Overlay s CTA */}
          <div style={{
            position: 'absolute', inset: '0 0 0 0',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: '32px', paddingTop: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}>
            {title && (
              <p style={{
                color: '#fff', fontSize: '18px', fontWeight: 700,
                marginBottom: '16px', padding: '0 24px', textAlign: 'center',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}>
                {title}
              </p>
            )}

            {ctaLabel && (
              <button
                onClick={handleCta}
                style={{
                  padding: '12px 32px', borderRadius: '50px',
                  fontWeight: 700, fontSize: '15px',
                  color: '#1e40af', background: '#fff',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                  transition: 'all 0.25s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1e40af'; }}
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>

        {/* Zatvori link ispod */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <button
            onClick={handleClose}
            style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '13px',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            {lang === 'BHS' ? 'Zatvori' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
