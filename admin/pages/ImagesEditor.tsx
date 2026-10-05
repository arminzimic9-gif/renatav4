import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowUp, ArrowDown, Trash2, Upload, Plus, RotateCcw, Save, Loader2, Monitor, Smartphone } from 'lucide-react';
import { db, storage } from '../../firebase';
import { IMAGE_SLOTS, IMAGES_DOC, ImagesData, SiteImage, SlotDef, mergeImages } from '../../context/SiteImagesContext';
import { useAdminPanel } from '../context/AdminPanelContext';

const ACCENT = '#5392ce';
const MAX_SIDE = 2400; // px, duža strana nakon smanjivanja
const font = 'DM Sans, sans-serif';

// Smanjuje fotografiju u pregledniku prije uploada (telefoni prave 10+ MB slike).
async function prepareImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode'));
      el.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.85)
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function uploadImage(slotKey: string, file: File): Promise<string> {
  const blob = await prepareImage(file);
  const path = `site-images/${slotKey}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob, { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' });
  return getDownloadURL(fileRef);
}

const parsePos = (pos: string): [number, number] => {
  const m = pos.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : [50, 50];
};

// --- Jedna slika: izbor fokusa + pregled za računar i mobitel ---

const ImageCard: React.FC<{
  slot: SlotDef;
  image: SiteImage;
  index: number;
  count: number;
  onChange: (next: SiteImage) => void;
  onReplace: (file: File) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  busy: boolean;
}> = ({ slot, image, index, count, onChange, onReplace, onRemove, onMove, busy }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const fileRef = useRef<HTMLInputElement>(null);
  const [dx, dy] = parsePos(image.posDesktop);
  const [mx, my] = parsePos(image.posMobile);
  const [fx, fy] = device === 'desktop' ? [dx, dy] : [mx, my];

  const setFocus = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    const pos = `${x}% ${y}%`;
    onChange(device === 'desktop' ? { ...image, posDesktop: pos } : { ...image, posMobile: pos });
  };

  const iconBtn: React.CSSProperties = {
    background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#ccc', borderRadius: '8px',
    padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: font,
  };

  return (
    <div style={{ background: '#101010', border: '1px solid #222', borderRadius: '12px', padding: '14px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {/* Cijela fotografija: klik postavlja fokus */}
      <div style={{ flex: '1 1 260px', minWidth: '220px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {(['desktop', 'mobile'] as const).map((d) => (
            <button key={d} onClick={() => setDevice(d)} style={{
              ...iconBtn, background: device === d ? ACCENT : '#1e1e1e', color: device === d ? '#fff' : '#aaa',
            }}>
              {d === 'desktop' ? <Monitor size={13} /> : <Smartphone size={13} />}
              Fokus: {d === 'desktop' ? 'računar' : 'mobitel'}
            </button>
          ))}
        </div>
        <div
          onClick={setFocus}
          title="Kliknite na dio slike koji uvijek mora biti vidljiv (npr. lice)"
          style={{ position: 'relative', cursor: 'crosshair', background: '#000', borderRadius: '8px', overflow: 'hidden', lineHeight: 0 }}
        >
          <img src={image.url} alt="" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }} />
          <div style={{
            position: 'absolute', left: `${fx}%`, top: `${fy}%`, width: '22px', height: '22px', marginLeft: '-11px', marginTop: '-11px',
            borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 2px rgba(0,0,0,0.5)', pointerEvents: 'none',
          }} />
        </div>
        <p style={{ color: '#666', fontSize: '12px', margin: '6px 0 0', fontFamily: font }}>
          Kliknite na lice ili dio slike koji uvijek mora ostati vidljiv.
        </p>
      </div>

      {/* Pregled izreza */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#777', fontSize: '11px', marginBottom: '4px', fontFamily: font }}>Računar</div>
          <div style={{ width: '200px', height: '112px', borderRadius: '6px', overflow: 'hidden', border: device === 'desktop' ? `2px solid ${ACCENT}` : '2px solid #222' }}>
            <img src={image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: image.posDesktop }} />
          </div>
        </div>
        <div>
          <div style={{ color: '#777', fontSize: '11px', marginBottom: '4px', fontFamily: font }}>Mobitel</div>
          <div style={{ width: '63px', height: '136px', borderRadius: '6px', overflow: 'hidden', border: device === 'mobile' ? `2px solid ${ACCENT}` : '2px solid #222' }}>
            <img src={image.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: image.posMobile }} />
          </div>
        </div>
      </div>

      {/* Akcije */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
        {slot.list && <div style={{ color: '#888', fontSize: '12px', fontFamily: font }}>Slika {index + 1} od {count}</div>}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onReplace(f); e.target.value = ''; }} />
        <button style={iconBtn} disabled={busy} onClick={() => fileRef.current?.click()}>
          <Upload size={13} /> Zamijeni sliku
        </button>
        {slot.list && (
          <>
            <button style={iconBtn} disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp size={13} /> Pomjeri gore</button>
            <button style={iconBtn} disabled={index === count - 1} onClick={() => onMove(1)}><ArrowDown size={13} /> Pomjeri dole</button>
            <button style={{ ...iconBtn, color: '#f87171' }} disabled={count <= 1} onClick={onRemove}><Trash2 size={13} /> Ukloni</button>
          </>
        )}
        <input
          value={image.alt || ''}
          onChange={(e) => onChange({ ...image, alt: e.target.value })}
          placeholder="Opis slike (za Google)"
          style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#ddd', borderRadius: '8px', padding: '6px 8px', fontSize: '12px', fontFamily: font }}
        />
      </div>
    </div>
  );
};

// --- Stranica ---

export const ImagesEditor: React.FC = () => {
  const { addToast } = useAdminPanel();
  const [data, setData] = useState<ImagesData | null>(null);
  const [saved, setSaved] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const addRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    getDoc(doc(db, IMAGES_DOC.collection, IMAGES_DOC.id))
      .then((snap) => {
        const merged = mergeImages(snap.exists() ? snap.data() : {});
        setData(merged);
        setSaved(JSON.stringify(merged));
      })
      .catch((err) => {
        console.error(err);
        addToast('Slike se nisu mogle učitati sa servera.', 'error');
        setData(mergeImages({}));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = data !== null && JSON.stringify(data) !== saved;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  if (!data) {
    return <div style={{ color: '#888', padding: '32px', fontFamily: font }}><Loader2 className="animate-spin" size={18} /> Učitavanje slika...</div>;
  }

  // Funkcijsko ažuriranje: upload traje, a korisnik u međuvremenu može mijenjati druge slike.
  const updateSlot = (key: string, fn: (images: SiteImage[]) => SiteImage[]) =>
    setData((prev) => (prev ? { ...prev, [key]: fn(prev[key] || []) } : prev));

  const withUpload = async (slot: SlotDef, file: File, apply: (url: string) => void) => {
    setBusySlot(slot.key);
    try {
      const url = await uploadImage(slot.key, file);
      apply(url);
      addToast('Slika je učitana. Kliknite "Sačuvaj" da bude vidljiva na stranici.', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message === 'decode'
        ? 'Ovaj format preglednik ne može otvoriti (npr. HEIC s iPhonea). Sačuvajte sliku kao JPG ili PNG.'
        : 'Upload nije uspio. Provjerite internet vezu i pokušajte ponovo.', 'error');
    } finally {
      setBusySlot(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, IMAGES_DOC.collection, IMAGES_DOC.id), { slots: data, updatedAt: serverTimestamp() });
      setSaved(JSON.stringify(data));
      addToast('Slike su sačuvane i vidljive na stranici.', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(`Greška pri spremanju: ${err?.message || 'nepoznato'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const pages = Array.from(new Set(IMAGE_SLOTS.map((s) => s.page)));
  const btn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px', border: 'none', borderRadius: '8px',
    padding: '9px 16px', cursor: 'pointer', fontWeight: 600, fontFamily: font, fontSize: '14px',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <h1 style={{ color: '#f5f5f5', fontSize: '26px', fontWeight: 700, margin: 0 }}>Slike</h1>
        <button onClick={save} disabled={!dirty || saving} style={{ ...btn, background: dirty ? ACCENT : '#222', color: dirty ? '#fff' : '#666', cursor: dirty ? 'pointer' : 'default' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {dirty ? 'Sačuvaj' : 'Sve je sačuvano'}
        </button>
      </div>
      <p style={{ color: '#777', fontSize: '14px', margin: '0 0 28px', maxWidth: '720px' }}>
        Možete koristiti fotografije bilo kojeg formata, uspravne ili položene. Za svaku sliku kliknite na lice
        ili najvažniji dio, posebno za računar i za mobitel, a stranica će je tako izrezati.
      </p>

      {pages.map((page) => (
        <section key={page} style={{ marginBottom: '36px' }}>
          <h2 style={{ color: '#ccc', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>{page}</h2>
          {IMAGE_SLOTS.filter((s) => s.page === page).map((slot) => {
            const images = data[slot.key] || [];
            const busy = busySlot === slot.key;
            return (
              <div key={slot.key} style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '18px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <div>
                    <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '15px' }}>{slot.label}</div>
                    {slot.hint && <div style={{ color: '#666', fontSize: '12px', marginTop: '2px' }}>{slot.hint}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {busy && <Loader2 size={16} className="animate-spin" color={ACCENT} />}
                    {slot.list && (
                      <>
                        <input ref={(el) => { addRefs.current[slot.key] = el; }} type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = '';
                            if (f) withUpload(slot, f, (url) => updateSlot(slot.key, (imgs) => [...imgs, { url, posDesktop: '50% 30%', posMobile: '50% 30%', alt: '' }]));
                          }} />
                        <button style={{ ...btn, background: '#1e1e1e', color: '#ddd', padding: '7px 12px', fontSize: '13px' }} disabled={busy}
                          onClick={() => addRefs.current[slot.key]?.click()}>
                          <Plus size={14} /> Dodaj sliku
                        </button>
                      </>
                    )}
                    <button style={{ ...btn, background: 'transparent', color: '#777', padding: '7px 10px', fontSize: '13px' }}
                      title="Vrati originalne slike ovog dijela"
                      onClick={() => { if (window.confirm('Vratiti originalne slike za ovaj dio stranice?')) updateSlot(slot.key, () => slot.defaults); }}>
                      <RotateCcw size={14} /> Original
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {images.map((image, idx) => (
                    <ImageCard
                      key={`${image.url}-${idx}`}
                      slot={slot}
                      image={image}
                      index={idx}
                      count={images.length}
                      busy={busy}
                      onChange={(next) => updateSlot(slot.key, (imgs) => imgs.map((im, i) => (i === idx ? next : im)))}
                      onReplace={(file) => withUpload(slot, file, (url) => updateSlot(slot.key, (imgs) => imgs.map((im, i) => (i === idx ? { ...im, url } : im))))}
                      onRemove={() => updateSlot(slot.key, (imgs) => imgs.filter((_, i) => i !== idx))}
                      onMove={(dir) => updateSlot(slot.key, (imgs) => {
                        const next = [...imgs];
                        const target = idx + dir;
                        if (target < 0 || target >= next.length) return imgs;
                        [next[idx], next[target]] = [next[target], next[idx]];
                        return next;
                      })}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};
