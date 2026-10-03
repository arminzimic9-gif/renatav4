export interface Client {
  id: string;
  name: string;
  address: string;
  clientId: string;
  email?: string;
}

export interface Article {
  id: string;
  description: string;
  price: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress?: string;
  clientId: string;
  clientEmail?: string;
  items: InvoiceItem[];
  totalAmount: number;
  amountInWords: string;
  notes?: string;
  createdAt: number;
  currency?: 'BAM' | 'EUR' | 'USD';
}

export interface UserSettings {
  companyName: string;
  ownerName: string;
  address: string;
  idNumber: string;
  phone: string;
  email: string;
  website?: string;
  bankAccount: string;
  bankAccountEUR?: string;
  bankAccountUSD?: string;
  swift?: string;
  bankName?: string;
  primaryColor: string;
  fontFamily: string;
  signatureImage?: string;
  bottomLogoImage?: string;
  template?: 'modern' | 'classic' | 'minimal';
}
