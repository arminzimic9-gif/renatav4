const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineString, defineSecret } = require('firebase-functions/params');

admin.initializeApp();

// SMTP Parameters (set via functions/.env or Cloud CLI)
const smtpUser = defineString('SMTP_USER', { default: 'contact@habitplus.ba' });
const smtpPass = defineString('SMTP_PASS');

let mailTransport = null;

/**
 * Lazy-load the mail transporter
 */
function getMailTransport() {
  if (mailTransport) return mailTransport;

  const email = smtpUser.value();
  const pass = smtpPass.value();

  if (!pass) {
    console.error('SMTP_PASS is not set. Emails will fail to send.');
  }

  mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: email,
      pass: pass,
    },
    connectionTimeout: 10000, 
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
  return mailTransport;
}

const APP_NAME = 'HabitPlus';

// Handle Contact Form Submissions (v2)
exports.handleContactSubmission = onDocumentCreated('submissions/{docId}', async (event) => {
    const submission = event.data.data();
    if (!submission) return null;

    const { name, email, message, lang = 'BHS' } = submission;
    const transport = getMailTransport();
    const fromEmail = smtpUser.value();
    const docId = event.params.docId;

    // 1. Send notification to HabitPlus
    const adminMailOptions = {
      from: `"${APP_NAME}" <${fromEmail}>`,
      to: 'contact@habitplus.ba',
      subject: `Nova poruka s web stranice (${lang}): ${name}`,
      text: `Dobili ste novu poruku.\n\nIme: ${name}\nEmail: ${email}\nJezik: ${lang}\n\nPoruka:\n${message}`,
    };

    // 2. Send auto-responder to the sender
    const responderMailOptions = {
      from: `"${APP_NAME}" <${fromEmail}>`,
      to: email,
    };

    if (lang === 'BHS') {
      responderMailOptions.subject = 'Hvala Vam na kontaktu - HabitPlus';
      responderMailOptions.text = `Poštovani,\n\nhvala Vam što ste nas kontaktirali. Vaša poruka je uspješno zaprimljena.\n\nJavit ćemo Vam se u roku od 48 sati.\n\nU međuvremenu, ukoliko želite, možete već sada zakazati termin putem sljedećeg linka: https://calendly.com/contact-habitplus/15min\n\nSrdačan pozdrav,\nHabitPlus tim`;
    } else {
      responderMailOptions.subject = 'Thank you for reaching out - HabitPlus';
      responderMailOptions.text = `Hello,\n\nThank you for reaching out. Your message has been successfully received.\n\nWe will get back to you within 48 hours.\n\nIn the meantime, if you prefer, you can book a session directly using the following link: https://calendly.com/contact-habitplus/15min\n\nWarm regards,\nHabitPlus Team`;
    }

    try {
      await Promise.all([
        transport.sendMail(adminMailOptions),
        transport.sendMail(responderMailOptions)
      ]);
      console.log(`Emails sent for submission ${docId}`);
    } catch (error) {
      console.error('There was an error while sending the emails:', error);
    }
    return null;
  });

// Handle Newsletter Signups (v2)
exports.handleNewsletterSignup = onDocumentCreated('newsletter/{docId}', async (event) => {
    const signup = event.data.data();
    if (!signup) return null;

    const { email, lang = 'BHS' } = signup;
    const transport = getMailTransport();
    const fromEmail = smtpUser.value();

    const adminMailOptions = {
      from: `"${APP_NAME}" <${fromEmail}>`,
      to: 'contact@habitplus.ba',
      subject: `Novi newsletter upis (${lang}): ${email}`,
      text: `Novi korisnik se prijavio na newsletter.\n\nEmail: ${email}\nJezik: ${lang}`,
    };

    const responderMailOptions = {
      from: `"${APP_NAME}" <${fromEmail}>`,
      to: email,
    };

    if (lang === 'BHS') {
      responderMailOptions.subject = 'Dobrodošli na HabitPlus newsletter';
      responderMailOptions.text = `Poštovani,\n\nhvala Vam što ste se prijavili na naš newsletter. Uspješno ste zapratili naše novosti.\n\nU međuvremenu, ukoliko želite, možete zakazati termin putem sljedećeg linka: https://calendly.com/contact-habitplus/15min\n\nSrdačan pozdrav,\nHabitPlus tim`;
    } else {
      responderMailOptions.subject = 'Welcome to HabitPlus Newsletter';
      responderMailOptions.text = `Hello,\n\nThank you for signing up for our newsletter. You have successfully subscribed to our updates.\n\nIn the meantime, if you prefer, you can book a session directly using the following link: https://calendly.com/contact-habitplus/15min\n\nWarm regards,\nHabitPlus Team`;
    }

    try {
      await Promise.all([
        transport.sendMail(adminMailOptions),
        transport.sendMail(responderMailOptions)
      ]);
      console.log(`Newsletter emails sent for ${email}`);
    } catch (error) {
      console.error('There was an error while sending newsletter emails:', error);
    }
    return null;
  });

// ---------------------------------------------------------------------------
// Admin: fakture (slanje emaila i AI generisanje)
// ---------------------------------------------------------------------------
// Dozvoljeno samo prijavljenim Firebase korisnicima čiji email postoji u kolekciji
// "admins" (isti popis koji koriste Firestore i Storage pravila).
const geminiKey = defineSecret('GEMINI_API_KEY');

async function requireAdmin(request) {
  if (!request.auth || !request.auth.token.email) {
    throw new HttpsError('unauthenticated', 'Potrebna je prijava.');
  }
  const email = String(request.auth.token.email).toLowerCase();
  const snap = await admin.firestore().doc(`admins/${email}`).get();
  if (!snap.exists) {
    throw new HttpsError('permission-denied', 'Nemate dozvolu za ovu radnju.');
  }
}

exports.sendInvoiceEmail = onCall({ timeoutSeconds: 60, maxInstances: 3 }, async (request) => {
  await requireAdmin(request);
  const { to, subject, body, filename, pdfBase64 } = request.data || {};

  if (typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    throw new HttpsError('invalid-argument', 'Neispravna email adresa primaoca.');
  }
  if (typeof pdfBase64 !== 'string' || !pdfBase64 || pdfBase64.length > 9 * 1024 * 1024) {
    throw new HttpsError('invalid-argument', 'PDF nedostaje ili je prevelik.');
  }

  const safeName = String(filename || 'faktura.pdf').replace(/[^\w.\-]+/g, '_').slice(0, 80);
  const fromEmail = smtpUser.value();

  try {
    await getMailTransport().sendMail({
      from: `"${APP_NAME}" <${fromEmail}>`,
      to,
      subject: String(subject || 'Faktura').slice(0, 200),
      text: String(body || 'Poštovani,\n\nU prilogu Vam dostavljamo fakturu.\n\nSrdačan pozdrav.').slice(0, 5000),
      attachments: [{ filename: safeName, content: Buffer.from(pdfBase64, 'base64'), contentType: 'application/pdf' }],
    });
    return { success: true };
  } catch (error) {
    console.error('sendInvoiceEmail failed:', error);
    throw new HttpsError('internal', 'Slanje emaila nije uspjelo. Provjerite SMTP postavke funkcije.');
  }
});

exports.generateInvoice = onCall({ secrets: [geminiKey], timeoutSeconds: 60, maxInstances: 3 }, async (request) => {
  await requireAdmin(request);
  const prompt = request.data && request.data.prompt;
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) {
    throw new HttpsError('invalid-argument', 'Opis fakture nedostaje ili je predug.');
  }

  // Sačuvani klijenti i artikli služe kao kontekst da AI popuni tačne podatke i cijene.
  const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
  const clients = (Array.isArray(request.data.clients) ? request.data.clients : []).slice(0, 300).map((c) => ({
    name: clip(c && c.name, 200), address: clip(c && c.address, 300), clientId: clip(c && c.clientId, 50), email: clip(c && c.email, 200),
  }));
  const articles = (Array.isArray(request.data.articles) ? request.data.articles : []).slice(0, 300).map((a) => ({
    description: clip(a && a.description, 300), price: typeof (a && a.price) === 'number' ? a.price : null,
  }));
  const today = clip(request.data.today, 20);
  const contextBlock = `
      Poznati klijenti (JSON): ${JSON.stringify(clients)}
      Poznati artikli/usluge sa standardnim cijenama (JSON): ${JSON.stringify(articles)}
      Današnji datum: ${today || 'nepoznat'}
`;

  const { GoogleGenAI, Type } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: geminiKey.value() });

  try {
    const response = await ai.models.generateContent({
      // Gemini 3.1 Flash-Lite: brz i jeftin, dovoljan za popunjavanje fakture iz opisa.
      model: 'gemini-3.1-flash-lite',
      contents: `Generiši podatke za fakturu na osnovu sljedećeg opisa.
      Opis: "${prompt}"

${contextBlock}
      Pravila:
      - Ako opis odgovara nekom poznatom klijentu (i približno, npr. skraćeni naziv), preuzmi njegov tačan naziv, adresu, ID broj i email iz popisa.
      - Ako stavka odgovara poznatom artiklu, koristi njegov tačan naziv i standardnu cijenu, osim ako je u opisu navedena druga cijena.
      - Ako klijent ima adresu ili ID broj, uključi ih.
      - Za stavke, pokušaj prepoznati naziv, količinu i cijenu. Ako količina nije navedena, stavi 1.
      - Izračunaj ukupnu cijenu (total) za svaku stavku (količina * cijena).
      - Izračunaj ukupni iznos fakture (totalAmount).
      - Napiši ukupan iznos slovima na bosanskom jeziku (amountInWords), uključujući i naziv valute.
      - Ako postoje neke specifične napomene, dodaj ih u notes. Ako ne, ostavi prazno.
      - Datum stavi u formatu DD.MM.YYYY. Ako nije naveden, koristi današnji datum.
      - Pokušaj prepoznati valutu (BAM, EUR, USD). Ako nije navedena, koristi BAM.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: 'Datum fakture (DD.MM.YYYY)' },
            clientName: { type: Type.STRING, description: 'Naziv klijenta' },
            clientAddress: { type: Type.STRING, description: 'Adresa klijenta' },
            clientId: { type: Type.STRING, description: 'ID broj ili JIB klijenta' },
            clientEmail: { type: Type.STRING, description: 'Email klijenta ako je poznat' },
            currency: { type: Type.STRING, description: 'Valuta fakture (BAM, EUR ili USD)' },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Jedinstveni ID stavke (npr. 1, 2, 3)' },
                  description: { type: Type.STRING, description: 'Opis usluge ili proizvoda' },
                  quantity: { type: Type.NUMBER, description: 'Količina' },
                  price: { type: Type.NUMBER, description: 'Jedinična cijena' },
                  total: { type: Type.NUMBER, description: 'Ukupna cijena za stavku (količina * cijena)' },
                },
                required: ['id', 'description', 'quantity', 'price', 'total'],
              },
            },
            totalAmount: { type: Type.NUMBER, description: 'Ukupni iznos fakture' },
            amountInWords: { type: Type.STRING, description: 'Ukupni iznos napisan slovima na bosanskom jeziku' },
            notes: { type: Type.STRING, description: 'Dodatne napomene (opciono)' },
          },
          required: ['date', 'clientName', 'items', 'totalAmount', 'amountInWords'],
        },
      },
    });
    if (!response.text) throw new Error('Prazan odgovor od AI modela.');
    return JSON.parse(response.text);
  } catch (error) {
    console.error('generateInvoice failed:', error);
    // Besplatni Gemini ključ ima dnevni limit zahtjeva.
    const msg = String((error && (error.message || error.status)) || '');
    if ((error && (error.status === 429 || error.code === 429)) || /RESOURCE_EXHAUSTED|quota|rate limit/i.test(msg)) {
      throw new HttpsError('resource-exhausted', 'Dnevni besplatni limit AI-ja je potrošen. Pokušajte sutra ili napravite fakturu ručno.');
    }
    throw new HttpsError('internal', 'AI generisanje fakture nije uspjelo.');
  }
});
