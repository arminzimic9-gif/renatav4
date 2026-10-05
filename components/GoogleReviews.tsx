import React, { useState, useRef } from 'react';
import { WordReveal } from './animations/WordReveal';
import { useLanguage } from '../context/LanguageContext';
import { Star, X, ExternalLink } from 'lucide-react';

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
  const { lang, dict } = useLanguage();
  const t = dict[lang].googleReviews;
  const links = dict.BHS.links;
  const activeReviews: Review[] = t.reviews;

  // Popup state
  const [selected, setSelected] = useState<Review | null>(null);

  const renderCard = (review: Review, key: React.Key, sizeClass: string) => (
    <button
      key={key}
      onClick={() => setSelected(review)}
      className={`shrink-0 ${sizeClass} bg-white rounded-3xl p-6 border border-gray-200 flex flex-col text-left transition-all duration-200 select-none cursor-pointer hover:bg-gray-50/50`}
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
          {t.readMore}
        </p>
      )}
    </button>
  );

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-gray-50">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10 md:mb-12">
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
            text={t.title}
            center
            className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-4 w-full"
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xl font-bold text-gray-800">{t.rating}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FBBC05" color="#FBBC05" />
              ))}
            </div>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            {t.basedOnReviews}
          </p>
        </div>
      </div>

      {/* Mobile: native horizontal swipe (single list, no auto-animation) */}
      <div
        className="md:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-6 w-full"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-4 px-6 w-max">
          {activeReviews.map((review, idx) =>
            renderCard(review, `m-${idx}`, 'snap-center w-[85vw] max-w-[320px]')
          )}
        </div>
      </div>

      {/* Desktop: Infinite Marquee Scroll Track */}
      <div className="relative overflow-hidden w-full hidden md:block">
        <div className="animate-marquee flex gap-4 px-4">
          {[...activeReviews, ...activeReviews, ...activeReviews].map((review, idx) =>
            renderCard(review, idx, 'w-[280px] sm:w-[320px]')
          )}
        </div>
      </div>

      {/* Leave review button */}
      <div className="flex justify-center mt-10">
        <a
          href={links.googleReviewUrl}
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
          {t.leaveReview}
        </a>
      </div>

      {/* ── POPUP MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/20 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-6 sm:p-8 max-h-[85dvh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 relative animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Author */}
            <div className="flex items-center gap-4 mb-6 pr-12 sm:pr-10">
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
              href={links.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-blue font-semibold text-sm hover:underline"
            >
              <ExternalLink size={15} />
              {t.viewOnGoogle}
            </a>
          </div>
        </div>
      )}
    </section>
  );
};
