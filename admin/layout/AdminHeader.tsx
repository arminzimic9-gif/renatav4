import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Menu, Circle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAdminPanel } from '../context/AdminPanelContext';

const ACCENT = '#5392ce';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { logout } = useAdmin();
  const { isDirty, lastSaved, saveContent } = useAdminPanel();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent();
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Nikad';
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Upravo';
    if (diff < 3600) return `Prije ${Math.floor(diff / 60)} min`;
    return lastSaved.toLocaleTimeString('bs', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header
      style={{
        height: '58px',
        background: '#0f0f0f',
        borderBottom: '1px solid #1e1e1e',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '16px',
        position: 'sticky', top: 0, zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Unsaved indicator */}
      {isDirty && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#f59e0b', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
        }}>
          <Circle size={8} fill="#f59e0b" />
          Nesačuvane izmjene
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Last saved */}
      <span style={{ color: '#444', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
        Zadnji save: {formatLastSaved()}
      </span>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !isDirty}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '7px 16px',
          background: isDirty ? ACCENT : '#1e1e1e',
          color: isDirty ? '#fff' : '#555',
          border: 'none', borderRadius: '8px',
          fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px',
          cursor: isDirty ? 'pointer' : 'default',
          transition: 'all 0.2s',
          opacity: saving ? 0.7 : 1,
        }}
      >
        <Save size={15} />
        {saving ? 'Spašava...' : 'Spremi'}
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '7px 14px',
          background: 'transparent',
          color: '#666',
          border: '1px solid #2a2a2a', borderRadius: '8px',
          fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
        onMouseLeave={e => (e.currentTarget.style.color = '#666')}
      >
        <LogOut size={15} />
        Odjava
      </button>
    </header>
  );
};
