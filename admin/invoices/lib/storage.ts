import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase';
import { InvoiceData, UserSettings, Client, Article } from '../types';

// ---------------------------------------------------------------------------
// Fakture se čuvaju u Firestore bazi (ne više u pregledniku), pa su iste na
// svakom uređaju i ostaju kroz svaki update stranice.
//
// Komponente i dalje koriste sinhrone funkcije (getInvoices, saveClient...).
// Zato podatke jednom učitamo u memoriju (loadInvoiceData), čitamo iz nje,
// a svaku izmjenu odmah upisujemo u bazu u pozadini.
// ---------------------------------------------------------------------------

const INVOICES = 'invoices';
const CLIENTS = 'invoice_clients';
const ARTICLES = 'invoice_articles';
const SETTINGS = 'invoice_settings';
// Slike potpisa i loga čuvamo u zasebnim dokumentima zbog ograničenja veličine dokumenta (1 MB).
const SETTINGS_MAIN = 'main';
const SETTINGS_SIGNATURE = 'signature';
const SETTINGS_LOGO = 'bottomLogo';

// Ključevi iz stare verzije koja je radila samo u pregledniku.
const LEGACY_KEYS = {
  invoices: 'ai_invoices_data',
  settings: 'ai_invoices_settings',
  clients: 'ai_invoices_clients',
  articles: 'ai_invoices_articles',
};

export const defaultSettings: UserSettings = {
  companyName: '',
  ownerName: '',
  address: '',
  idNumber: '',
  phone: '',
  email: '',
  website: '',
  bankAccount: '',
  bankAccountEUR: '',
  bankAccountUSD: '',
  swift: '',
  bankName: '',
  primaryColor: '#004aad',
  fontFamily: 'Arial, Helvetica, sans-serif',
  signatureImage: '',
  template: 'modern'
};

const cache: {
  invoices: InvoiceData[];
  clients: Client[];
  articles: Article[];
  settings: UserSettings;
} = {
  invoices: [],
  clients: [],
  articles: [],
  settings: defaultSettings,
};

// --- Status spremanja (za prikaz "Spremanje..." / greške u aplikaciji) ---

export type SyncStatus = { pending: number; error: string | null };
let syncStatus: SyncStatus = { pending: 0, error: null };
const listeners = new Set<(s: SyncStatus) => void>();

export const subscribeSyncStatus = (fn: (s: SyncStatus) => void) => {
  listeners.add(fn);
  fn(syncStatus);
  return () => { listeners.delete(fn); };
};

const setSyncStatus = (next: SyncStatus) => {
  syncStatus = next;
  listeners.forEach((fn) => fn(syncStatus));
};

const persist = (work: () => Promise<unknown>) => {
  setSyncStatus({ pending: syncStatus.pending + 1, error: null });
  work()
    .then(() => setSyncStatus({ ...syncStatus, pending: syncStatus.pending - 1 }))
    .catch((err) => {
      console.error('Greška pri spremanju u bazu', err);
      setSyncStatus({
        pending: syncStatus.pending - 1,
        error: 'Izmjena NIJE spremljena na server. Provjerite internet vezu i pokušajte ponovo.',
      });
    });
};

// Firestore ne prihvata "undefined" vrijednosti.
const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

// --- Učitavanje ---

export const loadInvoiceData = async (): Promise<void> => {
  const [inv, cli, art, main, sig, logo] = await Promise.all([
    getDocs(collection(db, INVOICES)),
    getDocs(collection(db, CLIENTS)),
    getDocs(collection(db, ARTICLES)),
    getDoc(doc(db, SETTINGS, SETTINGS_MAIN)),
    getDoc(doc(db, SETTINGS, SETTINGS_SIGNATURE)),
    getDoc(doc(db, SETTINGS, SETTINGS_LOGO)),
  ]);
  cache.invoices = inv.docs.map((d) => ({ ...(d.data() as InvoiceData), id: d.id }));
  cache.clients = cli.docs.map((d) => ({ ...(d.data() as Client), id: d.id }));
  cache.articles = art.docs.map((d) => ({ ...(d.data() as Article), id: d.id }));
  cache.settings = {
    ...defaultSettings,
    ...(main.exists() ? (main.data() as UserSettings) : {}),
    signatureImage: sig.exists() ? (sig.data().data as string) || '' : '',
    bottomLogoImage: logo.exists() ? (logo.data().data as string) || '' : '',
  };
};

// --- Fakture ---

export const getInvoices = (): InvoiceData[] => [...cache.invoices];

export const saveInvoice = (invoice: InvoiceData): void => {
  const idx = cache.invoices.findIndex((inv) => inv.id === invoice.id);
  if (idx >= 0) cache.invoices[idx] = invoice;
  else cache.invoices.push(invoice);
  persist(() => setDoc(doc(db, INVOICES, invoice.id), clean(invoice)));
};

export const deleteInvoice = (id: string): void => {
  cache.invoices = cache.invoices.filter((inv) => inv.id !== id);
  persist(() => deleteDoc(doc(db, INVOICES, id)));
};

export const getNextInvoiceNumber = (invoices: InvoiceData[]): string => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  let maxNumber = 0;

  invoices.forEach(inv => {
    const parts = inv.invoiceNumber.split('/');
    if (parts.length === 2 && parts[1] === currentYear) {
      const num = parseInt(parts[0], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    } else {
      const num = parseInt(inv.invoiceNumber, 10);
      if (!isNaN(num) && num > maxNumber && !inv.invoiceNumber.includes('/')) {
        maxNumber = num;
      }
    }
  });

  return `${maxNumber + 1}/${currentYear}`;
};

// --- Postavke ---

export const getUserSettings = (): UserSettings => ({ ...cache.settings });

export const saveUserSettings = (settings: UserSettings): void => {
  const { signatureImage = '', bottomLogoImage = '', ...main } = settings as UserSettings & Record<string, any>;
  // Stare postavke mogu imati SMTP lozinku - nikad je ne spremamo.
  delete (main as any).smtpHost; delete (main as any).smtpPort; delete (main as any).smtpUser; delete (main as any).smtpPass;

  const prev = cache.settings;
  cache.settings = { ...settings };
  persist(async () => {
    await setDoc(doc(db, SETTINGS, SETTINGS_MAIN), clean(main));
    if (signatureImage !== (prev.signatureImage || '')) {
      await setDoc(doc(db, SETTINGS, SETTINGS_SIGNATURE), { data: signatureImage });
    }
    if (bottomLogoImage !== (prev.bottomLogoImage || '')) {
      await setDoc(doc(db, SETTINGS, SETTINGS_LOGO), { data: bottomLogoImage });
    }
  });
};

// --- Klijenti ---

export const getClients = (): Client[] => [...cache.clients];

export const saveClient = (client: Client): void => {
  const idx = cache.clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) cache.clients[idx] = client;
  else cache.clients.push(client);
  persist(() => setDoc(doc(db, CLIENTS, client.id), clean(client)));
};

export const deleteClient = (id: string): void => {
  cache.clients = cache.clients.filter((c) => c.id !== id);
  persist(() => deleteDoc(doc(db, CLIENTS, id)));
};

// --- Artikli ---

export const getArticles = (): Article[] => [...cache.articles];

export const saveArticle = (article: Article): void => {
  const idx = cache.articles.findIndex((a) => a.id === article.id);
  if (idx >= 0) cache.articles[idx] = article;
  else cache.articles.push(article);
  persist(() => setDoc(doc(db, ARTICLES, article.id), clean(article)));
};

export const deleteArticle = (id: string): void => {
  cache.articles = cache.articles.filter((a) => a.id !== id);
  persist(() => deleteDoc(doc(db, ARTICLES, id)));
};

// --- Backup (eksport / import) ---

export const exportData = (): void => {
  try {
    const data = {
      settings: getUserSettings(),
      invoices: getInvoices(),
      clients: getClients(),
      articles: getArticles(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fakture_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data', error);
    alert('Greška pri eksportu podataka.');
  }
};

type BackupData = {
  settings?: UserSettings;
  invoices?: InvoiceData[];
  clients?: Client[];
  articles?: Article[];
};

// Upisuje backup u bazu. Postojeći zapisi s istim ID-om se zamjenjuju, ostali ostaju.
const writeBackup = async (data: BackupData): Promise<void> => {
  const ops: Array<{ col: string; id: string; value: any }> = [];
  (Array.isArray(data.invoices) ? data.invoices : []).forEach((v) => v?.id && ops.push({ col: INVOICES, id: v.id, value: v }));
  (Array.isArray(data.clients) ? data.clients : []).forEach((v) => v?.id && ops.push({ col: CLIENTS, id: v.id, value: v }));
  (Array.isArray(data.articles) ? data.articles : []).forEach((v) => v?.id && ops.push({ col: ARTICLES, id: v.id, value: v }));

  for (let i = 0; i < ops.length; i += 400) {
    const batch = writeBatch(db);
    ops.slice(i, i + 400).forEach((op) => batch.set(doc(db, op.col, op.id), clean(op.value)));
    await batch.commit();
  }

  if (data.settings) {
    const { signatureImage = '', bottomLogoImage = '', smtpHost, smtpPort, smtpUser, smtpPass, ...main } = data.settings as any;
    await setDoc(doc(db, SETTINGS, SETTINGS_MAIN), clean(main));
    await setDoc(doc(db, SETTINGS, SETTINGS_SIGNATURE), { data: signatureImage || '' });
    await setDoc(doc(db, SETTINGS, SETTINGS_LOGO), { data: bottomLogoImage || '' });
  }

  await loadInvoiceData();
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    await writeBackup(JSON.parse(jsonData));
    return true;
  } catch (error) {
    console.error('Error importing data', error);
    return false;
  }
};

// --- Prijenos iz stare verzije (podaci zapisani samo u ovom pregledniku) ---

const readLegacy = (key: string): any => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getLegacyLocalSummary = (): { invoices: number; clients: number; articles: number; hasSettings: boolean } | null => {
  const invoices = readLegacy(LEGACY_KEYS.invoices) || [];
  const clients = readLegacy(LEGACY_KEYS.clients) || [];
  const articles = readLegacy(LEGACY_KEYS.articles) || [];
  const settings = readLegacy(LEGACY_KEYS.settings);
  const hasSettings = !!(settings && settings.companyName);
  if (!invoices.length && !clients.length && !articles.length && !hasSettings) return null;
  return { invoices: invoices.length, clients: clients.length, articles: articles.length, hasSettings };
};

export const migrateLegacyLocalData = async (): Promise<void> => {
  const data: BackupData = {
    invoices: readLegacy(LEGACY_KEYS.invoices) || [],
    clients: readLegacy(LEGACY_KEYS.clients) || [],
    articles: readLegacy(LEGACY_KEYS.articles) || [],
  };
  const settings = readLegacy(LEGACY_KEYS.settings);
  // Postavke s servera ne prepisujemo ako su već popunjene.
  if (settings && settings.companyName && !cache.settings.companyName) data.settings = settings;

  await writeBackup(data);

  // Lokalne kopije ne brišemo, samo ih preimenujemo da se prijenos ne ponavlja.
  Object.values(LEGACY_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      localStorage.setItem(`${key}_prenijeto_na_server`, raw);
      localStorage.removeItem(key);
    }
  });
};
