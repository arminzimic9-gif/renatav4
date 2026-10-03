import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnsavedWarningProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const UnsavedWarning: React.FC<UnsavedWarningProps> = ({ isOpen, onSave, onDiscard, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: '#1c1c1c',
          border: '1px solid #2a2a2a',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(245,158,11,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
          </div>
          <h3 style={{ color: '#f5f5f5', fontSize: '18px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            Nesačuvane izmjene
          </h3>
        </div>
        <p style={{ color: '#888', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', marginBottom: '24px', lineHeight: 1.6 }}>
          Imate nesačuvane izmjene. Šta želite učiniti?
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onSave}
            style={{
              flex: 1, padding: '10px 16px',
              background: '#5392ce', color: '#fff', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            }}
          >
            Spremi i nastavi
          </button>
          <button
            onClick={onDiscard}
            style={{
              flex: 1, padding: '10px 16px',
              background: 'rgba(239,68,68,0.15)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            }}
          >
            Odbaci izmjene
          </button>
          <button
            onClick={onCancel}
            style={{
              width: '100%', padding: '10px 16px',
              background: 'transparent', color: '#888',
              border: '1px solid #2a2a2a',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            }}
          >
            Otkaži
          </button>
        </div>
      </div>
    </div>
  );
};
