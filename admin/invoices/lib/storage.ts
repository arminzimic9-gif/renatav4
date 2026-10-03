import { InvoiceData, UserSettings, Client, Article } from '../types';

const STORAGE_KEY = 'ai_invoices_data';
const SETTINGS_KEY = 'ai_invoices_settings';
const CLIENTS_KEY = 'ai_invoices_clients';
const ARTICLES_KEY = 'ai_invoices_articles';

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

export const getInvoices = (): InvoiceData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from local storage', error);
    return [];
  }
};

export const saveInvoice = (invoice: InvoiceData): void => {
  try {
    const invoices = getInvoices();
    const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Error saving to local storage', error);
  }
};

export const deleteInvoice = (id: string): void => {
  try {
    const invoices = getInvoices();
    const filtered = invoices.filter((inv) => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from local storage', error);
  }
};

export const getUserSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  } catch (error) {
    console.error('Error reading settings', error);
    return defaultSettings;
  }
};

export const saveUserSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings', error);
  }
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
      // Fallback if format is just a number
      const num = parseInt(inv.invoiceNumber, 10);
      if (!isNaN(num) && num > maxNumber && !inv.invoiceNumber.includes('/')) {
        maxNumber = num;
      }
    }
  });
  
  return `${maxNumber + 1}/${currentYear}`;
};

export const getClients = (): Client[] => {
  try {
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading clients', error);
    return [];
  }
};

export const saveClient = (client: Client): void => {
  try {
    const clients = getClients();
    const existingIndex = clients.findIndex((c) => c.id === client.id);
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving client', error);
  }
};

export const deleteClient = (id: string): void => {
  try {
    const clients = getClients();
    const filtered = clients.filter((c) => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting client', error);
  }
};

export const getArticles = (): Article[] => {
  try {
    const data = localStorage.getItem(ARTICLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading articles', error);
    return [];
  }
};

export const saveArticle = (article: Article): void => {
  try {
    const articles = getArticles();
    const existingIndex = articles.findIndex((a) => a.id === article.id);
    if (existingIndex >= 0) {
      articles[existingIndex] = article;
    } else {
      articles.push(article);
    }
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving article', error);
  }
};

export const deleteArticle = (id: string): void => {
  try {
    const articles = getArticles();
    const filtered = articles.filter((a) => a.id !== id);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting article', error);
  }
};

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

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.settings) {
      // Stare sigurnosne kopije mogu sadržavati SMTP lozinku - ne uvozimo je.
      const { smtpHost, smtpPort, smtpUser, smtpPass, ...safeSettings } = data.settings;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(safeSettings));
    }
    if (data.invoices && Array.isArray(data.invoices)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.invoices));
    }
    if (data.clients && Array.isArray(data.clients)) {
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(data.clients));
    }
    if (data.articles && Array.isArray(data.articles)) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(data.articles));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data', error);
    return false;
  }
};
