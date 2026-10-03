import React, { useState } from 'react';
import { Download, Upload, RotateCcw, Info, AlertTriangle } from 'lucide-react';
import { useAdminPanel } from '../context/AdminPanelContext';
import { translationsService } from '../services/firestoreService';
import { translations as defaultTranslations } from '../../translations';

const ACCENT = '#5392ce';

const card: React.CSSProperties = {
  background: '#141414',
  border: '1px solid #1e1e1e',
  borderRadius: '14px',
  padding: '24px',
  marginBottom: '16px',
};

export const Settings: React.FC = () => {
  const { contentData, addToast, lastSaved } = useAdminPanel();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleExport = () => {
    const json = JSON.stringify(contentData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitplus-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('JSON fajl je preuzet!', 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await translationsService.save(data);
        addToast('Podaci su uspješno importovani! Osvježite stranicu.', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        addToast('Greška pri importu. Provjerite JSON format.', 'error');
      }
    };
    input.click();
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await translationsService.save(defaultTranslations as any);
      addToast('Podaci su resetovani na originalne vrijednosti! Osvježite stranicu.', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      addToast('Greška pri resetovanju.', 'error');
    } finally {
      setResetting(false);
      setShowResetConfirm(false);
    }
  };

  const dataSize = JSON.stringify(contentData).length;
  const dataSizeKb = (dataSize / 1024).toFixed(1);

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ color: '#f5f5f5', fontSize: '26px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0, letterSpacing: '-0.02em' }}>
          Postavke
        </h1>
        <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', marginTop: '5px', margin: '5px 0 0' }}>
          Export, import i upravljanje podacima panela.
        </p>
      </div>

      {/* Info card */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Info size={16} style={{ color: ACCENT }} />
          <h3 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>Info o panelu</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Verzija panela', value: 'v2.0' },
            { label: 'Zadnji save', value: lastSaved ? lastSaved.toLocaleString('bs') : 'N/A' },
            { label: 'Veličina podataka', value: `${dataSizeKb} KB` },
            { label: 'Data source', value: 'Firebase Firestore' },
            { label: 'Projekt', value: 'habitplus-36217' },
            { label: 'Kolekcija', value: 'website_content/translations' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '12px' }}>
              <div style={{ color: '#555', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ color: '#f5f5f5', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div style={card}>
        <h3 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', margin: '0 0 8px' }}>
          Export podataka
        </h3>
        <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', margin: '0 0 16px', lineHeight: 1.6 }}>
          Preuzmi sve sadržaje kao JSON fajl. Koristite za backup ili migraciju na drugi server.
        </p>
        <button
          onClick={handleExport}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: ACCENT, border: 'none', borderRadius: '8px',
            color: '#fff', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          }}
        >
          <Download size={16} /> Preuzmi JSON ({dataSizeKb} KB)
        </button>
      </div>

      {/* Import */}
      <div style={card}>
        <h3 style={{ color: '#f5f5f5', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', margin: '0 0 8px' }}>
          Import podataka
        </h3>
        <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', margin: '0 0 16px', lineHeight: 1.6 }}>
          Uvezi prethodno exportovani JSON fajl. <strong style={{ color: '#f59e0b' }}>Upozorenje: Ovo će zamijeniti sve trenutne podatke.</strong>
        </p>
        <button
          onClick={handleImport}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: '#1c1c1c', border: '1px solid #2a2a2a', borderRadius: '8px',
            color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          }}
        >
          <Upload size={16} /> Uvezi JSON fajl
        </button>
      </div>

      {/* Reset */}
      <div style={{ ...card, border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          <h3 style={{ color: '#ef4444', fontSize: '16px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            Reset na originalne vrijednosti
          </h3>
        </div>
        <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', margin: '0 0 16px', lineHeight: 1.6 }}>
          Brisanje <strong style={{ color: '#f5f5f5' }}>svih izmjena</strong> i vraćanje na originalne tekstove definirane u kodu (<code style={{ color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>translations.ts</code>). Ova akcija se <strong style={{ color: '#ef4444' }}>ne može poništiti</strong>.
        </p>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px',
              color: '#ef4444', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} /> Resetuj na originale
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleReset}
              disabled={resetting}
              style={{
                padding: '10px 20px',
                background: '#ef4444', border: 'none', borderRadius: '8px',
                color: '#fff', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}
            >
              {resetting ? 'Resetuje se...' : '⚠️ Da, resetuj sve'}
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              style={{
                padding: '10px 20px',
                background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px',
                color: '#666', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer',
              }}
            >
              Otkaži
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
