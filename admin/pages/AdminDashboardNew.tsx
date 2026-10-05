import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Globe, BookOpen, Clock,
  ArrowRight, PenSquare, Languages, Settings,
  TrendingUp, CheckCircle, Edit3, Image,
} from 'lucide-react';
import { useAdminPanel } from '../context/AdminPanelContext';
import { popupService } from '../services/firestoreService';
import { PopupDocument } from '../types';
import { LegacyLocalDataBanner } from '../components/LegacyLocalDataBanner';

const ACCENT = '#5392ce';

const SECTIONS = [
  { key: 'header', label: 'Header', desc: 'Navigacija i CTA gumbi' },
  { key: 'home', label: 'Home', desc: 'Naslovna stranica' },
  { key: 'isThisForYou', label: 'Da li je ovo za vas?', desc: 'Persone i filteri' },
  { key: 'corporate', label: 'Korporativno', desc: 'B2B sekcija i programi' },
  { key: 'services', label: 'Usluge', desc: 'Usluge za pojedince' },
  { key: 'about', label: 'O nama', desc: 'O Renati i iskustvo' },
  { key: 'footer', label: 'Footer', desc: 'Kontakt i linkovi' },
  { key: 'cravingMode', label: 'Craving Mode', desc: 'Interaktivne igre' },
  { key: 'savingsCalculator', label: 'Kalkulator', desc: 'Kalkulator uštede' },
  { key: 'privacyPolicy', label: 'Privatnost', desc: 'Politika privatnosti' },
  { key: 'podaciFirme', label: 'Podaci o firmi', desc: 'Adresa, banka, itd.' },
];

const card = (style?: React.CSSProperties): React.CSSProperties => ({
  background: '#141414',
  border: '1px solid #1e1e1e',
  borderRadius: '14px',
  padding: '20px',
  transition: 'all 0.2s',
  ...style,
});

export const AdminDashboardNew: React.FC = () => {
  const navigate = useNavigate();
  const { blogs, lastSaved, loadBlogs, contentData } = useAdminPanel();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [popups, setPopups] = useState<PopupDocument[]>([]);

  useEffect(() => {
    loadBlogs();
    popupService.getAll().then(setPopups).catch(() => {});
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const publishedBlogs = blogs.filter((b) => b.status === 'published').length;
  const draftBlogs = blogs.filter((b) => b.status === 'draft').length;
  const totalSections = SECTIONS.length;

  const formatLastSaved = () => {
    if (!lastSaved) return 'Još nije spašeno u ovoj sesiji';
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Upravo sačuvano';
    if (diff < 3600) return `Prije ${Math.floor(diff / 60)} minuta`;
    return lastSaved.toLocaleTimeString('bs', { hour: '2-digit', minute: '2-digit' });
  };

  const statCards = [
    {
      icon: <Globe size={20} style={{ color: ACCENT }} />,
      label: 'Jezici',
      value: '2',
      sub: 'BHS + EN',
      color: ACCENT,
    },
    {
      icon: <FileText size={20} style={{ color: '#22c55e' }} />,
      label: 'Sekcije',
      value: `${totalSections}`,
      sub: 'editabilnih sekcija',
      color: '#22c55e',
    },
    {
      icon: <BookOpen size={20} style={{ color: '#a78bfa' }} />,
      label: 'Blog postovi',
      value: `${blogs.length}`,
      sub: `${publishedBlogs} objavljeno · ${draftBlogs} draft`,
      color: '#a78bfa',
    },
    {
      icon: <Image size={20} style={{ color: '#f97316' }} />,
      label: 'Popup banneri',
      value: `${popups.filter(p => p.active).length}`,
      sub: `${popups.length} ukupno`,
      color: '#f97316',
    },
    {
      icon: <Clock size={20} style={{ color: '#f59e0b' }} />,
      label: 'Zadnji save',
      value: formatLastSaved(),
      sub: 'Firebase Firestore',
      color: '#f59e0b',
      small: true,
    },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <LegacyLocalDataBanner />

      {/* Page title and Clock */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{
            color: '#f5f5f5', fontSize: '28px', fontWeight: 700,
            fontFamily: 'DM Sans, sans-serif', margin: 0, letterSpacing: '-0.02em',
          }}>
            Dashboard
          </h1>
          <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', marginTop: '6px' }}>
            Dobrodošli u HabitPlus Admin Panel. Upravljajte sadržajem, blogom i postavkama.
          </p>
        </div>
        <div style={{
          background: '#141414', border: '1px solid #1e1e1e', borderRadius: '12px',
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <Clock size={18} style={{ color: ACCENT }} />
          <div>
            <div style={{ color: '#f5f5f5', fontWeight: 700, fontSize: '16px', fontFamily: 'DM Sans, sans-serif' }}>
              {currentTime.toLocaleTimeString('bs')}
            </div>
            <div style={{ color: '#888', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
              {currentTime.toLocaleDateString('bs')}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={card()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.icon}
              </div>
            </div>
            <div style={{
              color: '#f5f5f5', fontSize: s.small ? '16px' : '28px', fontWeight: 700,
              fontFamily: 'DM Sans, sans-serif', lineHeight: 1.1,
            }}>
              {s.value}
            </div>
            <div style={{ color: '#888', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
              {s.sub}
            </div>
            <div style={{ color: '#444', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/admin/blog/new')}
          style={{
            ...card({ cursor: 'pointer', textAlign: 'left' }),
            display: 'flex', alignItems: 'center', gap: '14px', border: '1px dashed #2a2a2a',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: 'rgba(83,146,206,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PenSquare size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}>
              Novi blog post
            </div>
            <div style={{ color: '#555', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
              Kreirajte novi članak (BHS + EN)
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#444', marginLeft: 'auto' }} />
        </button>

        <button
          onClick={() => navigate('/admin/popups/new')}
          style={{
            ...card({ cursor: 'pointer', textAlign: 'left' }),
            display: 'flex', alignItems: 'center', gap: '14px', border: '1px dashed #2a2a2a',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: 'rgba(249,115,22,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Image size={20} style={{ color: '#f97316' }} />
          </div>
          <div>
            <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}>
              Novi popup
            </div>
            <div style={{ color: '#555', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
              Kreirajte novi event popup banner
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#444', marginLeft: 'auto' }} />
        </button>

        <button
          onClick={() => navigate('/admin/settings')}
          style={{
            ...card({ cursor: 'pointer', textAlign: 'left' }),
            display: 'flex', alignItems: 'center', gap: '14px', border: '1px dashed #2a2a2a',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#f59e0b')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: 'rgba(245,158,11,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Settings size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}>
              Postavke & Export
            </div>
            <div style={{ color: '#555', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
              Export JSON, reset, info o panelu
            </div>
          </div>
          <ArrowRight size={16} style={{ color: '#444', marginLeft: 'auto' }} />
        </button>
      </div>

      {/* Section quick links */}
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#f5f5f5', fontSize: '18px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          Brzi pristup sekcijama
        </h2>
        <span style={{ color: '#444', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
          {SECTIONS.length} sekcija · 2 jezika
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
        {SECTIONS.map((s) => (
          <div key={s.key} style={{ display: 'flex', gap: '8px' }}>
            {/* BHS */}
            <button
              onClick={() => navigate(`/admin/content/BHS/${s.key}`)}
              style={{
                ...card({ cursor: 'pointer', flex: 1, textAlign: 'left', padding: '14px 16px' }),
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = '#1a1a1a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.background = '#141414'; }}
            >
              <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={18} style={{ color: ACCENT, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '13px', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.label}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                    <span style={{ color: '#444', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', background: '#1e1e1e', padding: '1px 6px', borderRadius: '4px' }}>BHS</span>
                  </div>
                </div>
              </div>
              <Edit3 size={13} style={{ color: '#333', marginLeft: 'auto', flexShrink: 0 }} />
            </button>

            {/* EN */}
            <button
              onClick={() => navigate(`/admin/content/EN/${s.key}`)}
              style={{
                ...card({ cursor: 'pointer', padding: '14px 12px' }),
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6BA3FF'; e.currentTarget.style.background = '#1a1a1a'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.background = '#141414'; }}
              title={`Edit ${s.label} (EN)`}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>EN</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
