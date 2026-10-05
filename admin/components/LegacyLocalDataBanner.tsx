import React, { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CloudUpload, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { DEFAULT_BLOGS, translationsService } from '../services/firestoreService';
import { useAdminPanel } from '../context/AdminPanelContext';

// Stara prečica "admin/admin" spremala je tekstove i blogove samo u preglednik.
// Ovaj baner pronalazi takve podatke i nudi da se prebace na server.

const CONTENT_KEY = 'local_content';
const BLOGS_KEY = 'local_blogs';

// JSON bez obzira na redoslijed polja (Firestore ne čuva redoslijed).
const stable = (v: any): string =>
  Array.isArray(v) ? `[${v.map(stable).join(',')}]`
  : v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`
  : JSON.stringify(v);

const readJson = (key: string): any => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const archiveKey = (key: string) => {
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    localStorage.setItem(`${key}_prenijeto_na_server`, raw);
    localStorage.removeItem(key);
  }
};

// Blogovi koji nisu samo neizmijenjene ugrađene objave.
const changedLocalBlogs = (): any[] => {
  const blogs = readJson(BLOGS_KEY);
  if (!Array.isArray(blogs)) return [];
  const defaults = new Map(DEFAULT_BLOGS.map((b) => [b.id, stable(b)]));
  return blogs.filter((b) => b && b.id && defaults.get(b.id) !== stable(b));
};

export const LegacyLocalDataBanner: React.FC = () => {
  const { addToast, loadBlogs } = useAdminPanel();
  const [hasContent, setHasContent] = useState(() => !!readJson(CONTENT_KEY));
  const [blogs, setBlogs] = useState(changedLocalBlogs);
  const [busy, setBusy] = useState(false);

  if (!hasContent && blogs.length === 0) return null;

  const migrate = async () => {
    if (hasContent && !window.confirm(
      'Tekstovi stranice iz ovog preglednika zamijenit će tekstove koji su trenutno na serveru. Nastaviti?'
    )) return;

    setBusy(true);
    try {
      if (hasContent) {
        await translationsService.save(readJson(CONTENT_KEY));
        archiveKey(CONTENT_KEY);
        setHasContent(false);
      }
      let copied = 0;
      let skipped = 0;
      const defaults = new Map(DEFAULT_BLOGS.map(({ id, ...rest }) => [id, stable(rest)]));
      for (const blog of blogs) {
        const { id, ...data } = blog;
        const existing = await getDoc(doc(db, 'blogs', id));
        // Prepiši samo ako na serveru nema objave ili je tamo još neizmijenjena ugrađena verzija.
        const serverIsUntouchedDefault = existing.exists() && defaults.get(id) === stable(existing.data());
        if (!existing.exists() || serverIsUntouchedDefault) {
          await setDoc(doc(db, 'blogs', id), JSON.parse(JSON.stringify(data)));
          copied++;
        } else {
          skipped++;
        }
      }
      archiveKey(BLOGS_KEY);
      setBlogs([]);
      localStorage.removeItem('isAdmin');
      await loadBlogs();
      addToast(`Prebačeno na server. Blogova: ${copied}${skipped ? `, preskočeno ${skipped} jer na serveru već postoji novija verzija` : ''}.`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast(`Prijenos nije uspio: ${err?.message || 'nepoznata greška'}. Ništa nije obrisano.`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
      background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)',
      borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', color: '#fcd34d',
      fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
    }}>
      <CloudUpload size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: '240px' }}>
        U ovom pregledniku postoje izmjene koje nisu na serveru
        {hasContent ? ': tekstovi stranice' : ''}
        {hasContent && blogs.length ? ' i' : blogs.length ? ':' : ''}
        {blogs.length ? ` ${blogs.length} blog objava` : ''}.
        Posjetitelji ih ne vide dok se ne prebace.
      </div>
      <button
        onClick={migrate}
        disabled={busy}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: '#d97706', color: '#fff',
          border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: busy ? 'default' : 'pointer',
          fontWeight: 600, opacity: busy ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <CloudUpload size={16} />}
        Prebaci na server
      </button>
    </div>
  );
};
