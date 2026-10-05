import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ---------------------------------------------------------------------------
// Slike stranice koje se mijenjaju iz admina (Admin → Slike).
// Svaka slika ima URL i fokus za računar i za mobitel ("x% y%"), pa se
// fotografija bilo kojeg formata pravilno izreže na oba uređaja.
// Ako u bazi nema zapisa, koriste se zadane slike ispod.
// ---------------------------------------------------------------------------

export type SiteImage = {
  url: string;
  posDesktop: string; // npr. "50% 30%"
  posMobile: string;
  alt?: string;
};

export type SlotDef = {
  key: string;
  label: string;
  page: string;
  list?: boolean; // više slika (carousel, galerija)
  hint?: string;
  defaults: SiteImage[];
};

const img = (url: string, posDesktop = '50% 50%', posMobile = posDesktop, alt = ''): SiteImage => ({ url, posDesktop, posMobile, alt });

export const IMAGE_SLOTS: SlotDef[] = [
  {
    key: 'homeHero', page: 'Naslovna', label: 'Glavne fotografije (carousel)', list: true,
    hint: 'Prva slika je ona koju posjetitelj prvo vidi, na računaru i na mobitelu.',
    defaults: [
      img('/hero/sana-0684.jpg', '50% 12%', '50% 10%', 'Renata Lačević'),
      img('/hero/sana-0508.jpg', '50% 12%', '50% 10%', 'Renata Lačević'),
      img('/hero/sana-0322.jpg', '50% 12%', '50% 10%', 'Renata Lačević'),
      img('/hero/sana-0645.jpg', '50% 12%', '50% 10%', 'Renata Lačević'),
      img('/hero/sana-0568.jpg', '50% 12%', '50% 10%', 'Renata Lačević'),
    ],
  },
  { key: 'homeForWhom', page: 'Naslovna', label: 'Pozadina sekcije "Da li je ovo za tebe"', hint: 'Prikazuje se ispod plavog sloja.', defaults: [img('/za-koga-bg.jpg', '50% 30%')] },
  { key: 'homeCorporate', page: 'Naslovna', label: 'Pozadina sekcije za organizacije', hint: 'Prikazuje se ispod plavog sloja.', defaults: [img('/SL__8066.jpg', '50% 40%')] },
  { key: 'isThisForYouHero', page: 'Da li je ovo za vas?', label: 'Pozadina vrha stranice', defaults: [img('/za-koga-bg.jpg', '50% 30%')] },
  { key: 'servicesHero', page: 'Usluge', label: 'Pozadina vrha stranice', defaults: [img('/hero-2.jpg', '50% 30%')] },
  { key: 'aboutHero', page: 'O nama', label: 'Pozadina vrha stranice', defaults: [img('/hero-1.jpg', '50% 30%')] },
  {
    key: 'aboutGallery', page: 'O nama', label: 'Galerija', list: true,
    hint: 'Slike se prikazuju kao kvadrati, po tri u redu.',
    defaults: [
      img('/renata-about-3.jpg', '50% 50%', '50% 50%', 'Renata Lačević'),
      img('/hero-2.jpg', '50% 50%', '50% 50%', 'HabitPlus Sessions'),
      img('/renata-about-1.jpg', '50% 50%', '50% 50%', 'Health Education'),
      img('/hero-1.jpg', '50% 50%', '50% 50%', 'Individual Support'),
      img('/renata-about-2.jpg', '50% 50%', '50% 50%', 'Workshop Facilitation'),
      img('/SL__8066.jpg', '50% 50%', '50% 50%', 'HabitPlus Office'),
    ],
  },
  { key: 'corporateHero', page: 'Za organizacije', label: 'Pozadina vrha stranice', defaults: [img('/SL__8066.jpg', '50% 30%')] },
  { key: 'corporateCollab', page: 'Za organizacije', label: 'Pozadina sekcije "Saradnja"', hint: 'Prikazuje se ispod tamnoplavog sloja.', defaults: [img('/SL__8066.jpg', '50% 50%')] },
  { key: 'blogAuthor', page: 'Blog', label: 'Fotografija autora ispod objave', hint: 'Prikazuje se kao mali krug.', defaults: [img('/renata-about-2.jpg', '50% 50%')] },
];

export const IMAGES_DOC = { collection: 'website_content', id: 'images' };

export type ImagesData = Record<string, SiteImage[]>;

const defaultsMap = (): ImagesData =>
  Object.fromEntries(IMAGE_SLOTS.map((s) => [s.key, s.defaults]));

// Spaja podatke iz baze sa zadanima; neispravni zapisi se ignoriraju.
export const mergeImages = (stored: any): ImagesData => {
  const result = defaultsMap();
  const slots = stored && typeof stored === 'object' ? stored.slots : null;
  if (!slots || typeof slots !== 'object') return result;
  for (const def of IMAGE_SLOTS) {
    const value = slots[def.key];
    if (!Array.isArray(value)) continue;
    const valid = value.filter((v: any) => v && typeof v.url === 'string' && v.url);
    if (valid.length === 0) continue;
    result[def.key] = valid.map((v: any) => img(
      v.url,
      typeof v.posDesktop === 'string' ? v.posDesktop : '50% 50%',
      typeof v.posMobile === 'string' ? v.posMobile : (typeof v.posDesktop === 'string' ? v.posDesktop : '50% 50%'),
      typeof v.alt === 'string' ? v.alt : '',
    ));
    if (!def.list) result[def.key] = result[def.key].slice(0, 1);
  }
  return result;
};

const SiteImagesContext = createContext<ImagesData>(defaultsMap());

const CACHE_KEY = 'hp_site_images_v1';

const readCache = (): ImagesData => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? mergeImages(JSON.parse(raw)) : defaultsMap();
  } catch {
    return defaultsMap();
  }
};

export const SiteImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Zadnje poznate slike iz preglednika, da se pri ponovnoj posjeti ne pojavi stara slika.
  const [images, setImages] = useState<ImagesData>(readCache);

  useEffect(() => {
    getDoc(doc(db, IMAGES_DOC.collection, IMAGES_DOC.id))
      .then((snap) => {
        const data = snap.exists() ? snap.data() : {};
        setImages(mergeImages(data));
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* nije bitno */ }
      })
      .catch((err) => console.error('Slike stranice nisu učitane, koriste se zadane.', err));
  }, []);

  return <SiteImagesContext.Provider value={images}>{children}</SiteImagesContext.Provider>;
};

export const useSiteImageList = (key: string): SiteImage[] => useContext(SiteImagesContext)[key] || [];
export const useSiteImage = (key: string): SiteImage => useSiteImageList(key)[0] || img('');

// Postavlja fokus slike za računar i mobitel. Koristiti s klasom "hp-pos" (index.css).
export const posVars = (image: SiteImage): React.CSSProperties =>
  ({ '--pos-d': image.posDesktop, '--pos-m': image.posMobile } as React.CSSProperties);

export const bgStyle = (image: SiteImage): React.CSSProperties =>
  ({ ...posVars(image), backgroundImage: `url("${image.url}")` });
