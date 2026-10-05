import { db } from '../../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { Blog, PopupDocument } from '../types';
import { translations as defaultTranslations } from '../../translations';

// Utility for deep merging so that new sections in defaultTranslations are not lost
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;
  if (Array.isArray(target) && Array.isArray(source)) return source;
  
  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  });
  return output;
}

const BLOGS_COLLECTION = 'blogs';
const POPUPS_COLLECTION = 'popups';

export const DEFAULT_BLOGS: Blog[] = [
  {
    id: "default-blog-1",
    slug: "zasto-neko-pusi",
    status: "published",
    publishedAt: "2026-03-23T12:00:00.000Z",
    author: "Renata Lačević",
    category: "Ovisnost",
    coverImage: "/SL__8066.jpg",
    bhs: {
      title: "Zašto neko puši?",
      excerpt: "Ljudi puše i koriste vape iz mnogo različitih razloga. Važno je da ih razumijemo, a ne da ih osuđujemo.",
      content: `<p class="text-lg font-medium text-brand-dark">Ljudi puše i koriste vape iz mnogo različitih razloga i važno je da ih razumijemo, a ne da ih osuđujemo.</p>

<div class="space-y-4 my-6">
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">1</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Navika</h4>
      <p class="text-sm">Neki puše svakodnevno, u istim situacijama, gotovo automatski. Cigareta postaje dio njihove rutine.</p>
    </div>
  </div>
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">2</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Ovisnost</h4>
      <p class="text-sm">Neki imaju osjećaj da moraju zapaliti da bi normalno funkcionisali. To je jasan znak ovisnosti o nikotinu.</p>
    </div>
  </div>
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">3</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Emocije</h4>
      <p class="text-sm">Drugi puše da potisnu ili ublaže emocije: stres, tugu, nervozu, anksioznost. A nekad zapale i da podijele emocije: radost, veselje, uzbuđenje.</p>
    </div>
  </div>
</div>

<p class="italic bg-brand-cream/50 p-4 rounded-xl border-l-4 border-brand-blue my-6">
  U tim trenucima cigareta postaje emocionalni „štit“, ali i način povezivanja s drugima.
</p>

<div class="pt-4">
  <h3 class="text-xl font-bold text-brand-dark mb-3">A gdje je tu ćejf?</h3>
  <p class="mb-4">Da li svaka cigareta zaista pruža ćejf ili je to rijetkost, rezervisana samo za posebne trenutke?</p>
  <p>Istina je da je pušenje često mnogo više povezano sa stresom, rutinom i emocijama nego samo s nikotinom.</p>
</div>

<div class="pt-6 border-t border-gray-100 my-6">
  <p class="text-brand-blue font-bold text-center text-lg">
    Prepoznati ZAŠTO i KADA posežemo za cigaretom ili vape-om je prvi korak ka promjeni.
  </p>
  <p class="text-center text-sm text-gray-400 mt-2 italic font-medium">Zato ne postoji jedno rješenje za sve, jer ne postoji samo jedan tip pušača.</p>
</div>`
    },
    en: {
      title: "Why does someone smoke?",
      excerpt: "People smoke and vape for many different reasons. It’s important that we understand them rather than judge them.",
      content: `<p class="text-lg font-medium text-brand-dark">People smoke and vape for many different reasons. It’s important that we understand them rather than judge them.</p>

<div class="space-y-4 my-6">
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">1</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Habit</h4>
      <p class="text-sm">Some people smoke every day, in the same situations, almost automatically. The cigarette becomes part of their routine.</p>
    </div>
  </div>
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">2</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Dependence</h4>
      <p class="text-sm">Some feel they have to light a cigarette just to function normally. This is a clear sign of nicotine dependence.</p>
    </div>
  </div>
  <div class="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">3</div>
    <div>
      <h4 class="font-bold text-brand-dark mb-1">Emotions</h4>
      <p class="text-sm">Others smoke to suppress or soften emotions: stress, sadness, nervousness, anxiety. And sometimes they smoke to share emotions: joy, excitement, celebration.</p>
    </div>
  </div>
</div>

<p class="italic bg-brand-cream/50 p-4 rounded-xl border-l-4 border-brand-blue my-6">
  In those moments, a cigarette becomes an emotional “shield” or "smokescreen" and sometimes a way to connect with others.
</p>

<div class="pt-4">
  <h3 class="text-xl font-bold text-brand-dark mb-3">And what about pleasure?</h3>
  <p class="mb-4">Does every cigarette truly bring pleasure or is that actually rare and reserved for special moments?</p>
  <p>The truth is that smoking is often far more connected to stress, routine and emotions than to nicotine alone.</p>
</div>

<div class="pt-6 border-t border-gray-100 my-6">
  <p class="text-brand-blue font-bold text-center text-lg">
    Recognizing WHY and WHEN you reach for a cigarette and vape is the first step towards change.
  </p>
  <p class="text-center text-sm text-gray-400 mt-2 italic font-medium">That’s why there is no single solution for everyone, because there is no single type of smoker.</p>
</div>`
    },
    seo: {
      bhs: {
        metaTitle: "Zašto neko puši? - HabitPlus Blog",
        metaDescription: "Ljudi puše i koriste vape iz mnogo različitih razloga. Važno je da ih razumijemo, a ne da ih osuđujemo."
      },
      en: {
        metaTitle: "Why does someone smoke? - HabitPlus Blog",
        metaDescription: "People smoke and vape for many different reasons. It’s important that we understand them rather than judge them."
      }
    }
  },
  {
    id: "default-blog-2",
    slug: "prvi-korak-je-najvazniji",
    status: "published",
    publishedAt: "2026-03-24T12:00:00.000Z",
    author: "Renata Lačević",
    category: "Savjeti",
    coverImage: "/za-koga-bg.jpg",
    bhs: {
      title: "Prvi korak je najvažniji",
      excerpt: "Pokušali ste prestati pušiti, ali imate osjećaj da ne uspijevate? Niste jedini. Nemojte čekati “savršen trenutak” da napravite promjenu.",
      content: `<p class="font-bold text-brand-dark text-lg">
  Pokušali ste prestati pušiti, ali imate osjećaj da ne uspijevate?<br />
  Niste jedini.
</p>

<p class="my-4">
  Nemojte čekati “savršen trenutak” da napravite promjenu.
</p>

<p class="my-4">
  Olakšajte sebi proces.<br />
  Pristupite odvikavanju s malo radoznalosti i pozitivnog stava.
</p>

<div class="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 my-6">
  <h3 class="text-brand-dark font-bold mb-4">Možete početi već danas s malim koracima:</h3>
  <ul class="space-y-4 list-none pl-0">
    <li class="flex items-start gap-3">
      <span class="text-brand-blue">✔️</span> 
      <span>Odgodite: sačekajte još 30 minuta prije prve cigarete</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue">✔️</span> 
      <span>Smanjite: zapalite manje nego jučer</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue">✔️</span> 
      <span>Odlučite: ako ste spremni, jednostavno ih ostavite</span>
    </li>
  </ul>
</div>

<p class="font-bold text-brand-dark mt-6 mb-2">
  Vaše tijelo prolazi kroz promjenu, zato mu pomozite:
</p>

<ul class="space-y-3 mb-6 list-none pl-0">
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Pijte više vode</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Potražite podršku</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Dozvolite sebi više odmora i sna</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Birajte hranu koja vam daje energiju</li>
</ul>

<div class="pt-6 border-t border-gray-100 my-6">
  <p class="text-center font-bold text-brand-dark mb-4 text-lg">
    Ne morate prolaziti kroz ovaj proces sami.
  </p>
  <p class="text-center italic pb-4">
    Ako razmišljate o prestanku pušenja, pošaljite mi poruku.<br />
    <strong>Tu sam da vas podržim.</strong>
  </p>
</div>`
    },
    en: {
      title: "The hardest step is the first step",
      excerpt: "The hardest step in quitting smoking and vaping isn't the quit date. It's taking the first step.",
      content: `<p class="font-bold text-brand-dark text-lg italic text-center">
  The hardest step in quitting smoking and vaping isn't the quit date. It's taking the first step.
</p>

<p class="my-4">All it takes is just a message. A phone call. <br /><span class="italic text-brand-blue font-medium text-center block">"I'm willing to try."</span></p>

<p class="my-4">From there, we explore and we start where <strong>YOU</strong> are, not where anyone else thinks you should be.</p>

<div class="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 my-6">
  <h3 class="text-brand-dark font-bold mb-4 text-center">The journey looks different for everyone:</h3>
  <ul class="space-y-4 list-none pl-0">
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> It's simply understanding your habits, triggers, reasons, lifestyle
    </li>
    <li class="flex items-start gap-3 text-xs text-gray-400 font-bold ml-6 uppercase underline decoration-brand-blue/20 underline-offset-4 tracking-wider">or</li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> It's cutting back by just 1 or 2 cigarettes and vapes a day
    </li>
    <li class="flex items-start gap-3 text-xs text-gray-400 font-bold ml-6 uppercase underline decoration-brand-blue/20 underline-offset-4 tracking-wider">or</li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> It's going all in and quitting
    </li>
  </ul>
</div>

<p class="font-medium text-brand-dark text-center italic my-6">There's no "right" answer. No judgment. No pressure. Because this isn't my journey, it's YOURS.</p>

<p class="text-center my-4">Only you know where you truly are right now. Not your family. Not your friends. Not anyone on the outside looking in. <strong>YOU.</strong></p>

<div class="pt-6 border-t border-gray-100 font-bold text-brand-blue text-center text-lg my-6">
  And once you take that first step, the second step happens organically and on your terms.
</div>

<p class="text-center italic pb-4">
  You don't need to have it all figured out. You just need to take that first step. <br />
  <strong>I'm here when you're ready.</strong>
</p>`
    },
    seo: {
      bhs: {
        metaTitle: "Prvi korak je najvažniji - HabitPlus Blog",
        metaDescription: "Pokušali ste prestati pušiti, ali imate osjećaj da ne uspijevate? Niste jedini. Nemojte čekati savršen trenutak."
      },
      en: {
        metaTitle: "The hardest step is the first step - HabitPlus Blog",
        metaDescription: "Quitting smoking is more than a single decision. Learn how an identity shift guarantees long-term success."
      }
    }
  },
  {
    id: "default-blog-3",
    slug: "zdravi-zaposlenici-snaznije-poslovanje",
    status: "published",
    publishedAt: "2026-03-25T12:00:00.000Z",
    author: "Renata Lačević",
    category: "Poslovanje",
    coverImage: "/hero-1.jpg",
    bhs: {
      title: "Zdravi zaposlenici, snažnije poslovanje: zašto se ulaganje isplati",
      excerpt: "Kompanije koje ulažu u zdravlje svojih uposlenika vide konkretne rezultate u poslovanju: veća produktivnost, manje izostanaka s posla...",
      content: `<p class="font-bold text-brand-dark text-lg">
  Kompanije koje ulažu u zdravlje svojih uposlenika vide konkretne rezultate u poslovanju:
</p>

<ul class="space-y-3 mb-6 list-none pl-0 my-4">
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> veća produktivnost</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> manje izostanaka s posla</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> reputacija koja privlači kvalitetne kadrove</li>
  <li class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> radna kultura u kojoj ljudi zaista žele biti dio tima</li>
</ul>

<div class="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 my-6">
  <h3 class="text-brand-dark font-bold mb-4">Evo odakle možete početi:</h3>
  <ul class="space-y-4 list-none pl-0">
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> 
      <span>osigurajte radno okruženje bez duhanskog dima</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> 
      <span>uvedite jasnu politiku o pušenju na radnom mjestu</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> 
      <span>sarađujte sa stručnjakom koji može voditi vaš tim kroz ovaj proces</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> 
      <span>započnite razgovor i stvorite prostor u kojem je sigurno zatražiti pomoć</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="text-brand-blue font-bold">→</span> 
      <span>omogućite zaposlenima koji puše pristup programima za prestanak pušenja</span>
    </li>
  </ul>
</div>

<div class="pt-6 border-t border-gray-100 my-6">
  <p class="italic text-brand-dark text-lg">
    Kreiranjem radnog okruženja koje aktivno podržava prestanak pušenja, šaljete jasnu poruku: zdravlje vaših ljudi je važno. Upravo takva okruženja grade povjerenje, lojalnost i dugoročnu stabilnost tima.
  </p>
</div>`
    },
    en: {
      title: "Get addicted to water",
      excerpt: "Why I recommend water to every client: it replaces the ritual, hijacks triggers and helps you heal.",
      content: `<p class="font-bold text-brand-dark text-lg italic text-center">
  Here's why I recommend it to every client trying to quit:
</p>

<div class="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 my-6">
  <h3 class="text-brand-dark font-bold mb-4">It replaces the ritual</h3>
  <p class="mb-2">Smoking is behavioural. The hand to mouth motion. The pause button on stress.</p>
  <p>Water gives you the same ritual <strong>without the harm.</strong></p>
</div>

<div class="space-y-4 my-6">
  <div class="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex gap-4">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">1</div>
    <div>
      <h4 class="font-bold text-brand-dark">It hijacks your triggers: coffee, stress, boredom</h4>
      <p class="text-sm">Instead of fighting these cravings, redirect them. Every trigger is your reminder to hydrate.</p>
    </div>
  </div>

  <div class="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex gap-4">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">2</div>
    <div>
      <h4 class="font-bold text-brand-dark">It addresses what your body actually needs</h4>
      <p class="text-sm">Dehydration symptoms mirror nicotine withdrawal: headaches, irritability, fatigue...</p>
    </div>
  </div>

  <div class="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex gap-4">
    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">3</div>
    <div>
      <h4 class="font-bold text-brand-dark">It actively heals</h4>
      <p class="text-sm">While cigarettes deplete your body, water flushes toxins, carries nutrients and supports recovery.</p>
    </div>
  </div>
</div>

<p class="font-medium text-brand-dark text-center italic border-t border-gray-100 pt-6 my-6 text-lg">
  You're not just quitting something, you're actively rebuilding.
</p>

<p class="text-center my-4">
  Make water your new obsession. Non-negotiable. <br />
  <strong>Behaviour change isn't about willpower. It's about rewiring.</strong>
</p>`
    },
    seo: {
      bhs: {
        metaTitle: "Zdravi zaposlenici, snažnije poslovanje - HabitPlus Blog",
        metaDescription: "Kompanije koje ulažu u zdravlje svojih zaposlenika bilježe manji izostanak s posla i veću produktivnost."
      },
      en: {
        metaTitle: "Get addicted to water - HabitPlus Blog",
        metaDescription: "Why water is recommended to every client trying to quit smoking: ritual replacement and detox."
      }
    }
  }
];

// Blogovi: ugrađene objave (DEFAULT_BLOGS) se pri prvoj prijavi admina upišu u bazu,
// pa se odatle uređuju kao i sve ostale. Oznaka "blogs_meta" pamti da je to urađeno,
// da obrisane objave ne bi ponovo iskočile kad se obriše i zadnja.
const BLOGS_META = doc(db, 'website_content', 'blogs_meta');

export const blogService = {
  async getAll(): Promise<Blog[]> {
    try {
      const q = query(collection(db, BLOGS_COLLECTION), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q).catch(() => getDocs(collection(db, BLOGS_COLLECTION)));
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Blog));
      if (docs.length > 0) return docs;
      const meta = await getDoc(BLOGS_META).catch(() => null);
      return meta && meta.exists() && meta.data().seeded ? [] : DEFAULT_BLOGS;
    } catch (e) {
      console.error("Firebase failed, using fallback blogs", e);
      return DEFAULT_BLOGS;
    }
  },

  /** Samo za admina: upiše ugrađene objave u bazu ako to još nije urađeno. */
  async seedDefaultsIfNeeded(): Promise<void> {
    const meta = await getDoc(BLOGS_META);
    if (meta.exists() && meta.data().seeded) return;
    const existing = await getDocs(collection(db, BLOGS_COLLECTION));
    const batch = writeBatch(db);
    if (existing.empty) {
      DEFAULT_BLOGS.forEach(({ id, ...data }) => batch.set(doc(db, BLOGS_COLLECTION, id), JSON.parse(JSON.stringify(data))));
    }
    batch.set(BLOGS_META, { seeded: true, seededAt: serverTimestamp() });
    await batch.commit();
  },

  async getById(id: string): Promise<Blog | null> {
    try {
      const snap = await getDoc(doc(db, BLOGS_COLLECTION, id));
      if (!snap.exists()) {
        return DEFAULT_BLOGS.find(b => b.id === id) || null;
      }
      return { id: snap.id, ...snap.data() } as Blog;
    } catch (e) {
      return DEFAULT_BLOGS.find(b => b.id === id) || null;
    }
  },

  async create(blog: Omit<Blog, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, BLOGS_COLLECTION), blog);
    return ref.id;
  },

  async update(id: string, data: Partial<Blog>): Promise<void> {
    // setDoc s merge radi i kad dokument još ne postoji u bazi.
    const { id: _id, ...rest } = data as any;
    await setDoc(doc(db, BLOGS_COLLECTION, id), JSON.parse(JSON.stringify(rest)), { merge: true });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, BLOGS_COLLECTION, id));
  },
};

export const translationsService = {
  async get(): Promise<any> {
    const snap = await getDoc(doc(db, 'website_content', 'translations'));
    if (snap.exists()) return deepMerge(defaultTranslations, snap.data());
    return defaultTranslations;
  },

  async save(data: any): Promise<void> {
    await setDoc(doc(db, 'website_content', 'translations'), data);
  },
};

// ─── Popup Service ───────────────────────────────────────────────────────────

export const popupService = {
  /** Dohvati sve popupe (za admin listu) */
  async getAll(): Promise<PopupDocument[]> {
    try {
      const q = query(collection(db, POPUPS_COLLECTION), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q).catch(() => getDocs(collection(db, POPUPS_COLLECTION)));
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PopupDocument));
    } catch (e) {
      console.error('popupService.getAll failed:', e);
      return [];
    }
  },

  /** Dohvati aktivan popup za zadani jezik (za frontend EventPopup komponentu) */
  async getActive(lang: 'BHS' | 'EN'): Promise<PopupDocument | null> {
    try {
      const langLower = lang.toLowerCase() as 'bhs' | 'en';
      const snapshot = await getDocs(collection(db, POPUPS_COLLECTION));
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PopupDocument));
      const active = docs.find(
        p => p.active && (p.lang === langLower || p.lang === 'both')
      );
      return active || null;
    } catch (e) {
      console.error('popupService.getActive failed:', e);
      return null;
    }
  },

  /** Kreiraj novi popup */
  async create(data: Omit<PopupDocument, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const ref = await addDoc(collection(db, POPUPS_COLLECTION), {
        ...data,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return ref.id;
    } catch (e) {
      console.error('popupService.create failed:', e);
      throw e;
    }
  },

  /** Ažuriraj postojeći popup */
  async update(id: string, data: Partial<Omit<PopupDocument, 'id' | 'created_at'>>): Promise<void> {
    try {
      await updateDoc(doc(db, POPUPS_COLLECTION, id), {
        ...data,
        updated_at: serverTimestamp(),
      } as any);
    } catch (e) {
      console.error('popupService.update failed:', e);
      throw e;
    }
  },

  /** Obriši popup */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, POPUPS_COLLECTION, id));
    } catch (e) {
      console.error('popupService.delete failed:', e);
      throw e;
    }
  },

  /** Toggle active status (inline, bez reload) */
  async toggleActive(id: string, currentActive: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, POPUPS_COLLECTION, id), {
        active: !currentActive,
        updated_at: serverTimestamp(),
      } as any);
    } catch (e) {
      console.error('popupService.toggleActive failed:', e);
      throw e;
    }
  },
};
