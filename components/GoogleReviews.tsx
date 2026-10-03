import React, { useState, useRef } from 'react';
import { WordReveal } from './animations/WordReveal';
import { useLanguage } from '../context/LanguageContext';
import { Star, X, ExternalLink } from 'lucide-react';

const reviewsEN = [
  { author: 'Lejla Saric', text: 'A dedicated professional, Renata provides guidance with a remarkably personal and warm touch' },
  { author: 'Irma', text: "Renata's knowledge and experience are a sure way to a positive change in life. Her support and accessibility contribute immensely to this." },
  { author: 'Amra Seta', text: 'Extremely professional. Go ahead!' },
  { author: 'Dženan Mulamuhić', text: 'I had the opportunity to work with Renata on this topic for a period of time and I can say that she left an extremely positive impression on me. Her professionalism, honesty and genuine dedication to her work are clearly visible.' },
  { author: 'Azra H.Osmanović', text: 'It is an honor and pleasure to have had the opportunity to collaborate with the wonderful Renata.' },
  { author: 'Sumeja Pasic', text: "HabitPlus seems simple, clear and really useful for everyday life. Renata's approach is honest, motivating and easy to apply in practice, which makes the whole experience even more valuable." },
  { author: 'Selma Tvrtković-Brulić', text: 'Gentle, nice approach. Detailed explanations and understanding. A sincere recommendation!' },
  { author: 'mirela mirela', text: 'This is something completely new in our region. I hope it will bear fruit and awaken the common sense of many, who are the beneficiaries of various vices.' },
  { author: 'jelena đukic', text: 'When you need support, you give your trust to someone. And that Someone is our Renata, a trustworthy, professional, dedicated person. And the program that works is detailed and provides proven methods.' },
  { author: 'Ajla Kokanović Čekić', text: 'Renata is a wonderful person, full of understanding and compassion. You can feel her love for the work she does and her sincere desire to help. I am glad I met her 😊' },
  { author: 'Irhad Strika', text: 'Working with Renata was an extremely positive and inspiring experience. Her professionalism is at the highest level, and what makes her stand out is her personal and professional dedication that truly motivates everyone around her.' },
  { author: 'Ajna Čolić', text: 'First of all, Renata is a very empathetic person, full of understanding. Her professionalism and experience that she brings to BiH is also something special and new.' },
  { author: 'Amina Kovac', text: 'Renata is a person who lights up a space with her presence, warmth, and eloquence. I am honored to have met her.' },
  { author: 'Irena M', text: 'I highly recommend HabitPlus and the extraordinary Renata Lačević to everyone who is ready to take the first step towards a life without cigarettes.' },
  { author: 'amelaa amela', text: 'A sincere recommendation. A great professional.' },
  { author: 'Amela Čustović', text: 'With sincere congratulations on your achievements so far, I wish you much success, happiness and inspiration in your further work and professional development. All recommendations from the heart.' },
  { author: 'Alma Kustric', text: 'Renata is not only an exceptional expert, she is also a gentle, warm person who is a pleasure to work with. Take the first step towards better health today, choose yourself, call Renata and give up cigarettes 🙏' },
  { author: 'Sanela Ališahović', text: 'The biggest recommendations from ❤️ I had the opportunity of a wonderful collaboration.' }
];

const reviewsBHS = [
  { author: 'Lejla Saric', text: 'Predan profesionalac, Renata pruža smjernice sa izuzetno ličnim i toplim pristupom.' },
  { author: 'Irma', text: 'Znanje i iskustvo Renate su siguran put ka pozitivnoj promjeni u životu. Njena podrška i dostupnost tome neizmjerno doprinose.' },
  { author: 'Amra Seta', text: 'Izuzetno profesionalno. Samo naprijed!' },
  { author: 'Dženan Mulamuhić', text: 'Imao sam priliku u određenom periodu raditi sa Renatom po ovoj temi i mogu reći da je na mene ostavila izuzetno pozitivan utisak. Njena profesionalnost, iskrenost i istinska posvećenost svom poslu su jasno vidljivi.' },
  { author: 'Azra H.Osmanović', text: 'Čast je i zadovoljstvo imati priliku surađivati s divnom Renatom.' },
  { author: 'Sumeja Pasic', text: 'HabitPlus se čini jednostavnim, jasnim i zaista korisnim za svakodnevni život. Renatin pristup je iskren, motivirajući i lak za primjenu u praksi, što cijelo iskustvo čini još vrijednijim.' },
  { author: 'Selma Tvrtković-Brulić', text: 'Nježan, lijep pristup. Detaljna objašnjenja i razumijevanje. Iskrena preporuka!' },
  { author: 'mirela mirela', text: 'Ovo je nešto sasvim novo na našim prostorima. Nadam se da će uroditi plodom i probuditi zdrav razum mnogih, koji su korisnici raznih poroka.' },
  { author: 'jelena đukic', text: 'Kada ti je potrebna podrška povjerenje daješ nekom. A taj Neko je naša Renata, osoba od povjerenja, stručna, posvećena. I program koji radi je detaljan i pruža provjerene metode.' },
  { author: 'Ajla Kokanović Čekić', text: 'Renata je predivna osoba, puna razumijevanja i saosjećanja. Osjeti se njena ljubav prema poslu koji radi i iskrena želja da pomogne. Drago mi je da sam je upoznala 😊' },
  { author: 'Irhad Strika', text: 'Rad sa Renatom bio je izuzetno pozitivno i inspirativno iskustvo. Njena profesionalnost je na najvišem nivou, a ono po čemu se ističe je njena lična i profesionalna posvećenost koja zaista motiviše sve oko nje.' },
  { author: 'Ajna Čolić', text: 'Na prvom mjestu, Renata je jako empatična osoba puna razumijevanja. Njena profesionalnost i iskustvo koje donosi u BiH su također nešto posebno i novo.' },
  { author: 'Amina Kovac', text: 'Renata je osoba koja obasja prostor svojim prisustvom, toplinom i elokvencijom. Čast mi je da sam je upoznala.' },
  { author: 'Irena M', text: 'Toplo preporučujem HabitPlus i izvanrednu Renatu Lačević svima koji su spremni napraviti prvi korak prema životu bez cigareta.' },
  { author: 'amelaa amela', text: 'Iskrena preporuka. Odličan profesionalac.' },
  { author: 'Amela Čustović', text: 'Uz iskrene čestitke na dosadašnjim postignućima, želim mnogo uspjeha, sreće i inspiracije u daljem radu i profesionalnom usavršavanju. Sve preporuke od srca.' },
  { author: 'Alma Kustric', text: 'Renata nije samo izuzetan stručnjak, ona je i nježna, topla osoba sa kojom je zadovoljstvo raditi. Napravite prvi korak prema boljem zdravlju danas, odaberite sebe, nazovite Renatu i ostavite cigarete 🙏' },
  { author: 'Sanela Ališahović', text: 'Najveće preporuke od ❤️ imala sam priliku divne saradnje.' }
];

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/HabitPlus/@43.9159842,17.6762169,8z/data=!3m1!4b1!4m6!3m5!1s0x6ecdc606410a6033:0x92b2f29e639a167b!8m2!3d43.9159842!4d17.6762169!16s%2Fg%2F11z1650pgb?entry=ttu&g_ep=EgoyMDI2MDUxMi4wIKXMDSoASAFQAw%3D%3D';

// Generates a colour from the first letter
const avatarColors: Record<string, string> = {
  A: '#5392ce', B: '#0097B2', C: '#A0233D', D: '#5392ce',
  E: '#0097B2', F: '#A0233D', G: '#5392ce', H: '#0097B2',
  I: '#A0233D', J: '#5392ce', K: '#0097B2', L: '#A0233D',
  M: '#5392ce', N: '#0097B2', O: '#A0233D', P: '#5392ce',
  Q: '#0097B2', R: '#A0233D', S: '#5392ce', T: '#0097B2',
  U: '#A0233D', V: '#5392ce', W: '#0097B2', X: '#A0233D',
  Y: '#5392ce', Z: '#0097B2',
};

function getAvatarColor(name: string) {
  return avatarColors[name.charAt(0).toUpperCase()] ?? '#5392ce';
}

const Stars = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />
    ))}
  </div>
);

interface Review { author: string; text: string; }

export const GoogleReviews: React.FC = () => {
  const { lang } = useLanguage();
  const activeReviews: Review[] = lang === 'BHS' ? reviewsBHS : reviewsEN;

  // Popup state
  const [selected, setSelected] = useState<Review | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-50">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
          </div>
          <WordReveal
            text={lang === 'BHS' ? 'Šta kažu naši klijenti na Google-u' : 'What our clients say on Google'}
            center
            className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-4 w-full"
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl font-bold text-gray-800">5.0</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FBBC05" color="#FBBC05" />
              ))}
            </div>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            {lang === 'BHS'
              ? 'Zasnovano na više od 25 Google recenzija'
              : 'Based on over 25 Google reviews'}
          </p>
        </div>
      </div>

      {/* Infinite Marquee Scroll Track */}
      <div className="relative overflow-hidden w-full">
        <div className="animate-marquee flex gap-4 px-4">
          {[...activeReviews, ...activeReviews, ...activeReviews].map((review, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(review)}
              className="shrink-0 w-[280px] sm:w-[320px] bg-white rounded-3xl p-6 border border-gray-200 flex flex-col text-left transition-all duration-200 select-none cursor-pointer hover:bg-gray-50/50"
              style={{ userSelect: 'none' }}
            >
              {/* Author row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{ backgroundColor: getAvatarColor(review.author) }}
                >
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-brand-dark leading-tight text-sm">{review.author}</p>
                  <Stars />
                </div>
                {/* Google G */}
                <div className="ml-auto shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>

              {/* Preview text (clamped to 3 lines) */}
              <p className="text-gray-600 text-[14px] leading-relaxed line-clamp-3 flex-1">
                "{review.text}"
              </p>

              {/* "Pročitaj više" hint if text is long */}
              {review.text.length > 80 && (
                <p className="text-brand-blue text-xs font-semibold mt-3">
                  {lang === 'BHS' ? 'Pročitaj više →' : 'Read more →'}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Leave review button */}
      <div className="flex justify-center mt-10">
        <a
          href="https://g.page/r/CXsWmmOe8rKSEAI/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl px-6 py-3 hover:bg-gray-50 hover:-translate-y-1 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {lang === 'BHS' ? 'Ostavite recenziju' : 'Leave a review too'}
        </a>
      </div>

      {/* ── POPUP MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/20 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 relative animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Author */}
            <div className="flex items-center gap-4 mb-6 pr-10">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
                style={{ backgroundColor: getAvatarColor(selected.author) }}
              >
                {selected.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-brand-dark text-lg leading-tight">{selected.author}</p>
                <Stars />
              </div>
              <div className="ml-auto">
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
            </div>

            {/* Full text */}
            <p className="text-gray-700 leading-relaxed text-[15px] mb-8">
              "{selected.text}"
            </p>

            {/* Open on Google */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-blue font-semibold text-sm hover:underline"
            >
              <ExternalLink size={15} />
              {lang === 'BHS' ? 'Pogledaj na Google-u' : 'View on Google'}
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
