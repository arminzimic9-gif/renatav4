import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, Globe, CheckCircle } from 'lucide-react';
import { SmartField } from '../components/SmartField';
import { useAdminPanel } from '../context/AdminPanelContext';

const ACCENT = '#5392ce';

const SECTION_LABELS: Record<string, string> = {
  header: 'Header',
  home: 'Home',
  isThisForYou: 'Da li je ovo za vas?',
  corporate: 'Korporativno',
  services: 'Usluge za pojedince',
  about: 'O nama',
  footer: 'Footer',
  cravingMode: 'Craving Mode',
  savingsCalculator: 'Kalkulator uštede',
  privacyPolicy: 'Politika privatnosti',
  podaciFirme: 'Podaci o firmi',
};

export const ContentEditor: React.FC = () => {
  const { lang, section } = useParams<{ lang: string; section: string }>();
  const navigate = useNavigate();
  const { contentData, updateContent, saveContent, resetContent, isDirty } = useAdminPanel();
  const [saving, setSaving] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  const sectionData = contentData?.[lang!]?.[section!];
  const sectionLabel = SECTION_LABELS[section!] || section;
  const langLabel = lang === 'BHS' ? 'BHS' : 'EN';
  const otherLang = lang === 'BHS' ? 'EN' : 'BHS';

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent();
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  if (!sectionData) {
    return (
      <div style={{ padding: '40px', color: '#888', fontFamily: 'DM Sans, sans-serif' }}>
        <p>Sekcija <code style={{ color: ACCENT }}>"{section}"</code> za jezik <code style={{ color: ACCENT }}>"{lang}"</code> nije pronađena.</p>
        <button onClick={() => navigate('/admin/dashboard')} style={{ marginTop: '16px', color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          ← Nazad na Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '28px', flexWrap: 'wrap',
      }}>
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#666', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <ArrowLeft size={16} /> Nazad
        </button>

        <div style={{ width: '1px', height: '20px', background: '#2a2a2a' }} />

        <h1 style={{
          color: '#f5f5f5', fontSize: '20px', fontWeight: 700,
          fontFamily: 'DM Sans, sans-serif', margin: 0,
        }}>
          {sectionLabel}
        </h1>

        <div style={{
          padding: '4px 12px', borderRadius: '20px',
          background: 'rgba(83,146,206,0.12)',
          color: ACCENT, fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
        }}>
          {langLabel}
        </div>

        {isDirty && (
          <div style={{ color: '#f59e0b', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ● Nesačuvano
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            to={`/admin/content/${otherLang}/${section}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: '#141414', border: '1px solid #2a2a2a',
              borderRadius: '8px', color: '#888',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
            }}
          >
            <Globe size={14} />
            {otherLang}
          </Link>

          <button
            onClick={resetContent}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: 'transparent', border: '1px solid #2a2a2a',
              borderRadius: '8px', color: '#666',
              fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
          >
            <RotateCcw size={14} /> Resetuj
          </button>

          <button
            onClick={handleSave}
            disabled={saving || justSaved}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 16px',
              background: justSaved ? '#22c55e' : ACCENT, border: 'none',
              borderRadius: '8px', color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
              cursor: (saving || justSaved) ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
            }}
          >
            {justSaved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saving ? 'Sprema...' : justSaved ? 'Sačuvano!' : 'Spremi'}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div style={{
        background: '#141414',
        border: '1px solid #1e1e1e',
        borderRadius: '14px',
        padding: '24px',
      }}>
        {Object.keys(sectionData).map((key) => (
          <SmartField
            key={key}
            fieldKey={key}
            value={sectionData[key]}
            path={[lang!, section!, key]}
            onUpdate={updateContent}
          />
        ))}
      </div>

      {/* Bottom save bar */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={resetContent}
          style={{
            padding: '10px 20px',
            background: 'transparent', border: '1px solid #2a2a2a',
            borderRadius: '8px', color: '#666',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer',
          }}
        >
          Resetuj na originalne vrijednosti
        </button>
        <button
          onClick={handleSave}
          disabled={saving || justSaved}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 24px',
            background: justSaved ? '#22c55e' : ACCENT, border: 'none',
            borderRadius: '8px', color: '#fff',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
            cursor: (saving || justSaved) ? 'default' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
          }}
        >
          {justSaved ? <CheckCircle size={15} /> : null}
          {saving ? 'Sprema...' : justSaved ? '✓ Sačuvano!' : '💾 Spremi promjene'}
        </button>
      </div>
    </div>
  );
};
