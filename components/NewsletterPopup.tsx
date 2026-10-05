import React, { useState, useEffect } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DISMISS_KEY = 'habitplus_newsletter_dismissed';
const SUBSCRIBED_KEY = 'habitplus_newsletter_subscribed';
const DELAY_MS = 60_000; // 1 minuta

export const NewsletterPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { lang, dict } = useLanguage();
  const t = dict[lang].footer.newsletter;
  const tp = dict[lang].newsletterPopup;

  useEffect(() => {
    // Ne prikazuj ako je već odbio ili pretplaćen
    if (localStorage.getItem(DISMISS_KEY) || localStorage.getItem(SUBSCRIBED_KEY)) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await addDoc(collection(db, 'newsletter'), {
        email: email.trim(),
        lang,
        source: 'popup',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      localStorage.setItem(SUBSCRIBED_KEY, '1');
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-2 right-2 p-2.5 text-gray-400 md:top-4 md:right-4 md:p-1 md:text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6">
          <Mail size={28} className="text-brand-blue" />
        </div>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">
              {tp.successTitle}
            </h3>
            <p className="text-gray-500 text-sm">
              {tp.successText}
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2 leading-tight">
              {t.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tp.emailPlaceholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-blue text-white rounded-xl px-6 py-3 font-bold text-sm hover:bg-brand-blue/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send size={16} />
                {status === 'loading'
                  ? tp.sending
                  : t.button}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-xs text-center">
                  {tp.error}
                </p>
              )}
            </form>

            <button
              onClick={dismiss}
              className="w-full mt-1 py-3 text-sm md:mt-3 md:py-0 md:text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {tp.dismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
