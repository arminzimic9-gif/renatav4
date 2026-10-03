import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PenSquare, Settings, ChevronDown,
  ChevronRight, Globe, BookOpen, X, Menu, Image, Receipt,
} from 'lucide-react';

const ACCENT = '#5392ce';

const SECTIONS = [
  { key: 'header', label: 'Header' },
  { key: 'home', label: 'Home' },
  { key: 'isThisForYou', label: 'Da li je ovo za vas?' },
  { key: 'corporate', label: 'Korporativno' },
  { key: 'services', label: 'Usluge' },
  { key: 'about', label: 'O nama' },
  { key: 'footer', label: 'Footer' },
  { key: 'cravingMode', label: 'Craving Mode' },
  { key: 'savingsCalculator', label: 'Kalkulator uštede' },
  { key: 'privacyPolicy', label: 'Politika privatnosti' },
];

const navItemStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '9px 14px', borderRadius: '8px',
  color: isActive ? '#fff' : '#888',
  background: isActive ? ACCENT : 'transparent',
  textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 600 : 400,
  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
  transition: 'all 0.15s',
  border: 'none', width: '100%', textAlign: 'left',
});

const subItemStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center',
  padding: '6px 12px 6px 32px', borderRadius: '6px',
  color: isActive ? ACCENT : '#666',
  background: isActive ? 'rgba(83,146,206,0.12)' : 'transparent',
  textDecoration: 'none', fontSize: '13px', fontWeight: isActive ? 600 : 400,
  fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
  transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
  textOverflow: 'ellipsis', border: 'none', width: '100%', textAlign: 'left',
});

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LangSection: React.FC<{ lang: 'BHS' | 'EN'; flag: string }> = ({ lang, flag }) => {
  const [open, setOpen] = useState(lang === 'BHS');
  const firestoreLang = lang === 'BHS' ? 'BHS' : 'EN';

  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={navItemStyle(false) as any}
      >
        <span style={{ flex: 1, paddingLeft: '4px' }}>{lang}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div style={{ marginLeft: '8px', borderLeft: '1px solid #2a2a2a', paddingLeft: '4px' }}>
          {SECTIONS.map((s) => (
            <NavLink
              key={s.key}
              to={`/admin/content/${firestoreLang}/${s.key}`}
              style={({ isActive }) => subItemStyle(isActive) as any}
            >
              {s.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [contentOpen, setContentOpen] = useState(true);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)',
            display: 'none',
          }}
          className="admin-mobile-overlay"
        />
      )}

      <aside
        style={{
          width: '240px', minWidth: '240px',
          background: '#0f0f0f',
          borderRight: '1px solid #1e1e1e',
          display: 'flex', flexDirection: 'column',
          height: '100vh', position: 'sticky', top: 0,
          overflowY: 'auto', overflowX: 'hidden',
          flexShrink: 0,
          padding: '0 12px 24px',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 8px 16px',
          borderBottom: '1px solid #1e1e1e',
          marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: ACCENT,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: '16px', fontFamily: 'DM Sans, sans-serif',
          }}>H</div>
          <div>
            <div style={{ color: '#f5f5f5', fontWeight: 700, fontSize: '15px', fontFamily: 'DM Sans, sans-serif' }}>HabitPlus</div>
            <div style={{ color: '#555', fontSize: '11px', fontFamily: 'DM Sans, sans-serif' }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Dashboard */}
          <NavLink
            to="/admin/dashboard"
            end
            style={({ isActive }) => navItemStyle(isActive) as any}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e1e1e', margin: '10px 0 6px' }} />
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px 6px', fontFamily: 'DM Sans, sans-serif' }}>SADRŽAJ</div>

          {/* Content accordion */}
          <button
            onClick={() => setContentOpen(!contentOpen)}
            style={navItemStyle(false) as any}
          >
            <Globe size={16} />
            <span style={{ flex: 1 }}>Prijevodi</span>
            {contentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {contentOpen && (
            <div style={{ marginLeft: '8px', paddingLeft: '4px', borderLeft: '1px solid #2a2a2a' }}>
              <LangSection lang="BHS" flag="" />
              <LangSection lang="EN" flag="" />
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e1e1e', margin: '10px 0 6px' }} />
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px 6px', fontFamily: 'DM Sans, sans-serif' }}>BLOG</div>

          <NavLink
            to="/admin/blog"
            style={({ isActive }) => navItemStyle(isActive) as any}
          >
            <BookOpen size={16} />
            Blog postovi
          </NavLink>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e1e1e', margin: '10px 0 6px' }} />
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px 6px', fontFamily: 'DM Sans, sans-serif' }}>POPUPI</div>

          <NavLink
            to="/admin/popups"
            style={({ isActive }) => navItemStyle(isActive) as any}
          >
            <Image size={16} />
            Popup banneri
          </NavLink>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e1e1e', margin: '10px 0 6px' }} />
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', padding: '0 6px 6px', fontFamily: 'DM Sans, sans-serif' }}>FINANSIJE</div>

          <NavLink
            to="/admin/fakture"
            style={({ isActive }) => navItemStyle(isActive) as any}
          >
            <Receipt size={16} />
            Fakture
          </NavLink>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e1e1e', margin: '10px 0 6px' }} />

          <NavLink
            to="/admin/settings"
            style={({ isActive }) => navItemStyle(isActive) as any}
          >
            <Settings size={16} />
            Postavke
          </NavLink>
        </nav>
      </aside>
    </>
  );
};
