import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { popupService } from '../services/firestoreService';
import { PopupDocument } from '../types';
import { useAdminPanel } from '../context/AdminPanelContext';

const ACCENT = '#5392ce';

type LangOption = 'bhs' | 'en' | 'both';

const EMPTY_FORM: Omit<PopupDocument, 'id' | 'created_at' | 'updated_at'> = {
  title_bhs: '',
  title_en: '',
  image_portrait: '',
  image_landscape: '',
  cta_label_bhs: 'Prijavi se',
  cta_label_en: 'Register Now',
  cta_url: '/kontakt',
  lang: 'both',
  active: true,
};

// ─── Simple URL field s preview-om ──────────────────────────────────────────

interface ImageFieldProps {
  label: string;
  aspect: string;
  aspectRatio: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

const ImageField: React.FC<ImageFieldProps> = ({ label, aspect, aspectRatio, value, onChange, hint }) => {
  const [error, setError] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ color: '#888', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
          {label} <span style={{ color: '#444', fontWeight: 400 }}>({aspect})</span>
        </label>
      </div>

      {/* URL input */}
      <input
        type="text"
        value={value}
        onChange={e => { onChange(e.target.value); setError(false); }}
        placeholder="https://... ili /putanja/do/slike.jpg"
        style={{
          width: '100%', padding: '10px 14px',
          background: '#0f0f0f', border: '1px solid #2a2a2a',
          borderRadius: '8px', color: '#f5f5f5',
          fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = ACCENT)}
        onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
      />

      {hint && (
        <div style={{ color: '#444', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
          {hint}
        </div>
      )}

      {/* Preview */}
      {value && !error && (
        <div style={{
          position: 'relative',
          marginTop: '10px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #2a2a2a',
          background: '#0a0a0a',
          aspectRatio: aspectRatio,
          maxWidth: aspectRatio === '9/16' ? '130px' : '100%',
        }}>
          <img
            src={value}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setError(true)}
          />
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '22px', height: '22px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)', border: 'none',
              color: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={11} />
          </button>
        </div>
      )}

      {value && error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginTop: '8px', padding: '8px 12px',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '8px', color: '#ef4444',
          fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
        }}>
          <AlertCircle size={12} /> Slika se ne može učitati — provjeri URL
        </div>
      )}
    </div>
  );
};

// ─── Text field helper ───────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}> = ({ label, value, onChange, placeholder, required, error }) => (
  <div>
    <label style={{ display: 'block', color: '#888', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', fontWeight: 500 }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 14px',
        background: '#0f0f0f', border: `1px solid ${error ? '#ef4444' : '#2a2a2a'}`,
        borderRadius: '8px', color: '#f5f5f5',
        fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { e.target.style.borderColor = error ? '#ef4444' : ACCENT; }}
      onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#2a2a2a'; }}
    />
    {error && (
      <div style={{ color: '#ef4444', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
        {error}
      </div>
    )}
  </div>
);

// ─── Main PopupEditor ────────────────────────────────────────────────────────

export const PopupEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { addToast } = useAdminPanel();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const all = await popupService.getAll();
        const found = all.find(p => p.id === id);
        if (found) {
          const { id: _id, created_at, updated_at, ...rest } = found;
          setForm(rest as typeof form);
        } else {
          addToast('Popup nije pronađen.', 'error');
          navigate('/admin/popups');
        }
      } catch {
        addToast('Greška pri učitavanju.', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew, addToast, navigate]);

  const set = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title_bhs.trim()) e.title_bhs = 'Naslov BHS je obavezan.';
    if (!form.title_en.trim()) e.title_en = 'Naslov EN je obavezan.';
    if (!form.image_portrait && !form.image_landscape) e.images = 'Potrebna je barem jedna slika (portrait ili landscape).';
    if (!form.cta_url.trim()) e.cta_url = 'CTA URL je obavezan.';
    else if (!form.cta_url.startsWith('/') && !form.cta_url.startsWith('http')) e.cta_url = 'URL mora počinjati sa "/" ili "http".';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isNew) {
        await popupService.create(form);
        addToast('Popup kreiran!', 'success');
      } else {
        await popupService.update(id!, form);
        addToast('Popup ažuriran!', 'success');
      }
      setSaved(true);
      setTimeout(() => navigate('/admin/popups'), 1200);
    } catch {
      addToast('Greška pri spašavanju.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <Loader2 size={28} style={{ color: ACCENT }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '820px', margin: '0 auto' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/admin/popups')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f5')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <ArrowLeft size={16} /> Nazad
        </button>
        <div style={{ width: '1px', height: '20px', background: '#2a2a2a' }} />
        <h1 style={{ color: '#f5f5f5', fontSize: '20px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          {isNew ? 'Novi popup' : 'Uredi popup'}
        </h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/admin/popups')}
            style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#666', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}
          >
            Otkaži
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px',
              background: saved ? '#22c55e' : ACCENT, border: 'none',
              borderRadius: '8px', color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
              cursor: (saving || saved) ? 'default' : 'pointer',
              opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
            }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" />
              : saved ? <CheckCircle size={15} />
              : <Save size={15} />}
            {saving ? 'Sprema...' : saved ? 'Sačuvano!' : 'Spremi'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Naslovi */}
        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px' }}>
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>NASLOVI</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Naslov BHS" value={form.title_bhs} onChange={v => set('title_bhs', v)} placeholder="npr. Novi program!" required error={errors.title_bhs} />
            <Field label="Naslov EN" value={form.title_en} onChange={v => set('title_en', v)} placeholder="e.g. New program!" required error={errors.title_en} />
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px' }}>
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>CTA DUGME</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Field label="Label BHS" value={form.cta_label_bhs} onChange={v => set('cta_label_bhs', v)} placeholder="Prijavi se" />
            <Field label="Label EN" value={form.cta_label_en} onChange={v => set('cta_label_en', v)} placeholder="Register Now" />
          </div>
          <Field label="CTA URL" value={form.cta_url} onChange={v => set('cta_url', v)} placeholder="/kontakt ili https://..." required error={errors.cta_url} />
        </section>

        {/* Slike — samo URL linkovi */}
        <section style={{ background: '#141414', border: `1px solid ${errors.images ? 'rgba(239,68,68,0.4)' : '#1e1e1e'}`, borderRadius: '14px', padding: '24px' }}>
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px', fontFamily: 'DM Sans, sans-serif' }}>
            SLIKE <span style={{ color: '#ef4444' }}>*</span>
          </div>
          <div style={{ color: '#555', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginBottom: '20px' }}>
            Na mobilnom uređaju se prikazuje Portrait (9:16), na desktopu Landscape (16:9). Dovoljna je jedna slika.
          </div>

          {errors.images && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', color: '#ef4444', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
              <AlertCircle size={14} /> {errors.images}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            <ImageField
              label="Portrait slika"
              aspect="9:16 · mobile"
              aspectRatio="9/16"
              value={form.image_portrait}
              onChange={url => set('image_portrait', url)}
              hint="Preporučeno: 1080×1920px"
            />
            <ImageField
              label="Landscape slika"
              aspect="16:9 · desktop"
              aspectRatio="16/9"
              value={form.image_landscape}
              onChange={url => set('image_landscape', url)}
              hint="Preporučeno: 1920×1080px"
            />
          </div>
        </section>

        {/* Postavke */}
        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '24px' }}>
          <div style={{ color: '#444', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px', fontFamily: 'DM Sans, sans-serif' }}>POSTAVKE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', fontWeight: 500 }}>
                Prikaži za jezik
              </label>
              <select
                value={form.lang}
                onChange={e => set('lang', e.target.value as LangOption)}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: '#0f0f0f', border: '1px solid #2a2a2a',
                  borderRadius: '8px', color: '#f5f5f5',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                  outline: 'none', cursor: 'pointer',
                }}
              >
                <option value="bhs">Samo BHS</option>
                <option value="en">Samo EN</option>
                <option value="both">BHS + EN (oba)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', marginBottom: '6px', fontWeight: 500 }}>
                Status
              </label>
              <button
                onClick={() => set('active', !form.active)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 16px', width: '100%',
                  border: `1px solid ${form.active ? 'rgba(34,197,94,0.3)' : '#2a2a2a'}`,
                  borderRadius: '8px', cursor: 'pointer',
                  background: form.active ? 'rgba(34,197,94,0.08)' : '#0f0f0f',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
                  color: form.active ? '#22c55e' : '#555',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: form.active ? '#22c55e' : '#2a2a2a', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: '2px', left: form.active ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
                {form.active ? 'Aktivan' : 'Neaktivan'}
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Bottom save */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          onClick={() => navigate('/admin/popups')}
          style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#666', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', cursor: 'pointer' }}
        >
          Otkaži
        </button>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 24px',
            background: saved ? '#22c55e' : ACCENT, border: 'none',
            borderRadius: '8px', color: '#fff',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
            cursor: (saving || saved) ? 'default' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
          }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" />
            : saved ? <CheckCircle size={15} />
            : <Save size={15} />}
          {saving ? 'Sprema...' : saved ? '✓ Sačuvano!' : '💾 Spremi popup'}
        </button>
      </div>
    </div>
  );
};
