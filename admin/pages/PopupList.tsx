import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Image, Globe, Loader2 } from 'lucide-react';
import { popupService } from '../services/firestoreService';
import { PopupDocument } from '../types';
import { useAdminPanel } from '../context/AdminPanelContext';

const ACCENT = '#5392ce';

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: '#141414',
  border: '1px solid #1e1e1e',
  borderRadius: '14px',
  padding: '20px',
  transition: 'all 0.2s',
  ...extra,
});

const LANG_LABEL: Record<string, string> = {
  bhs: 'BHS',
  en: 'EN',
  both: 'BHS + EN',
};

const LANG_COLOR: Record<string, string> = {
  bhs: '#5392ce',
  en: '#22c55e',
  both: '#a78bfa',
};

export const PopupList: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useAdminPanel();
  const [popups, setPopups] = useState<PopupDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await popupService.getAll();
      setPopups(data);
    } catch {
      addToast('Greška pri učitavanju popupa.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (popup: PopupDocument) => {
    setToggling(popup.id);
    try {
      await popupService.toggleActive(popup.id, popup.active);
      setPopups(prev => prev.map(p => p.id === popup.id ? { ...p, active: !p.active } : p));
      addToast(popup.active ? 'Popup deaktiviran.' : 'Popup aktiviran!', 'success');
    } catch {
      addToast('Greška pri promjeni statusa.', 'error');
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (popup: PopupDocument) => {
    if (!window.confirm(`Obrisati popup "${popup.title_bhs}"? Ova akcija je nepovratna.`)) return;
    setDeleting(popup.id);
    try {
      await popupService.delete(popup.id);
      setPopups(prev => prev.filter(p => p.id !== popup.id));
      addToast('Popup obrisan.', 'success');
    } catch {
      addToast('Greška pri brisanju popupa.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    if (ts.toDate) return ts.toDate().toLocaleDateString('bs');
    if (typeof ts === 'string') return new Date(ts).toLocaleDateString('bs');
    return '—';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ color: '#f5f5f5', fontSize: '26px', fontWeight: 700, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
            Popupi
          </h1>
          <p style={{ color: '#555', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', marginTop: '4px' }}>
            Upravljajte event popup bannerima koji se prikazuju posjetiteljima.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/popups/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px',
            background: ACCENT, border: 'none',
            borderRadius: '10px', color: '#fff',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          Novi popup
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={28} style={{ color: ACCENT }} className="animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && popups.length === 0 && (
        <div style={{ ...card(), textAlign: 'center', padding: '60px 20px' }}>
          <Image size={40} style={{ color: '#333', margin: '0 auto 16px' }} />
          <p style={{ color: '#555', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', margin: 0 }}>
            Nema kreiranih popupa. Kreirajte prvi!
          </p>
          <button
            onClick={() => navigate('/admin/popups/new')}
            style={{
              marginTop: '20px', padding: '10px 20px',
              background: ACCENT, border: 'none',
              borderRadius: '10px', color: '#fff',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Novi popup
          </button>
        </div>
      )}

      {/* Popup list */}
      {!loading && popups.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 110px 120px 130px',
            gap: '12px',
            padding: '10px 16px',
            color: '#444', fontSize: '12px', fontWeight: 600,
            letterSpacing: '0.06em', fontFamily: 'DM Sans, sans-serif',
          }}>
            <span>NASLOV (BHS)</span>
            <span>JEZIK</span>
            <span>STATUS</span>
            <span>DATUM</span>
            <span style={{ textAlign: 'right' }}>AKCIJE</span>
          </div>

          {popups.map(popup => (
            <div key={popup.id} style={{
              ...card({ padding: '14px 16px' }),
              display: 'grid',
              gridTemplateColumns: '1fr 100px 110px 120px 130px',
              gap: '12px',
              alignItems: 'center',
            }}>
              {/* Naslov */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {/* Thumbnail */}
                <div style={{
                  width: '48px', height: '36px', borderRadius: '6px',
                  background: '#1e1e1e', flexShrink: 0, overflow: 'hidden',
                }}>
                  {(popup.image_landscape || popup.image_portrait) ? (
                    <img
                      src={popup.image_landscape || popup.image_portrait}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image size={16} style={{ color: '#333' }} />
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    color: '#f5f5f5', fontSize: '14px', fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {popup.title_bhs || '—'}
                  </div>
                  {popup.title_en && (
                    <div style={{ color: '#555', fontSize: '12px', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
                      EN: {popup.title_en}
                    </div>
                  )}
                </div>
              </div>

              {/* Jezik */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px', borderRadius: '20px',
                  background: `${LANG_COLOR[popup.lang] || ACCENT}18`,
                  color: LANG_COLOR[popup.lang] || ACCENT,
                  fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                }}>
                  {LANG_LABEL[popup.lang] || popup.lang}
                </span>
              </div>

              {/* Status */}
              <div>
                <button
                  onClick={() => handleToggle(popup)}
                  disabled={toggling === popup.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px',
                    background: popup.active ? 'rgba(34,197,94,0.12)' : '#1e1e1e',
                    color: popup.active ? '#22c55e' : '#555',
                    border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s',
                  }}
                >
                  {toggling === popup.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : popup.active ? (
                    <ToggleRight size={15} />
                  ) : (
                    <ToggleLeft size={15} />
                  )}
                  {popup.active ? 'Aktivan' : 'Neaktivan'}
                </button>
              </div>

              {/* Datum */}
              <div style={{ color: '#555', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                {formatDate(popup.created_at)}
              </div>

              {/* Akcije */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => navigate(`/admin/popups/${popup.id}`)}
                  style={{
                    width: '34px', height: '34px',
                    background: '#1e1e1e', border: 'none',
                    borderRadius: '8px', color: '#888',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT + '22'; e.currentTarget.style.color = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#888'; }}
                  title="Uredi"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(popup)}
                  disabled={deleting === popup.id}
                  style={{
                    width: '34px', height: '34px',
                    background: '#1e1e1e', border: 'none',
                    borderRadius: '8px', color: '#888',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = '#888'; }}
                  title="Obriši"
                >
                  {deleting === popup.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
