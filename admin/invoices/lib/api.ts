import { getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
// Osigurava da je Firebase aplikacija inicijalizirana prije poziva funkcija.
import '../../../firebase';

const callFunction = async <Req, Res>(name: string, payload: Req): Promise<Res> => {
  try {
    const fn = httpsCallable<Req, Res>(getFunctions(getApp()), name);
    const result = await fn(payload);
    return result.data;
  } catch (error: any) {
    if (error?.code === 'functions/unauthenticated') {
      throw new Error('Ova opcija traži prijavu pravim Firebase računom. Odjavite se i prijavite e-mailom i lozinkom (ne prečicom "admin").');
    }
    if (error?.code === 'functions/resource-exhausted') {
      throw new Error(error.message || 'Dnevni limit AI-ja je potrošen. Pokušajte sutra ili napravite fakturu ručno.');
    }
    if (error?.code === 'functions/permission-denied') {
      throw new Error('Vaš račun nema dozvolu za ovu opciju.');
    }
    if (error?.code === 'functions/not-found' || (error?.code === 'functions/internal' && error?.message === 'internal')) {
      throw new Error('Serverska funkcija nije dostupna. Provjerite da su Cloud Functions objavljene (firebase deploy --only functions).');
    }
    throw new Error(error?.message || 'Greška pri komunikaciji sa serverom.');
  }
};

type AiContext = {
  clients: Array<{ name: string; address: string; clientId: string; email?: string }>;
  articles: Array<{ description: string; price: number }>;
  today: string;
};

// Šalje opis + sačuvane klijente i artikle, da AI popuni tačne podatke i cijene.
export const generateInvoiceFromPrompt = (prompt: string, context: AiContext) =>
  callFunction<{ prompt: string } & AiContext, any>('generateInvoice', {
    prompt,
    clients: context.clients.map(({ name, address, clientId, email }) => ({ name, address, clientId, email: email || '' })),
    articles: context.articles.map(({ description, price }) => ({ description, price })),
    today: context.today,
  });

export const sendInvoiceEmail = (payload: {
  to: string;
  subject: string;
  body: string;
  filename: string;
  pdfBase64: string;
}) => callFunction<typeof payload, { success: boolean }>('sendInvoiceEmail', payload);
