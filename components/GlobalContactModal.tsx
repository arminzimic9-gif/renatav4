import React, { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const GlobalContactModal: React.FC = () => {
  const { isContactModalOpen, closeContactModal, contactModalProgram } = useUI();
  const { lang, dict } = useLanguage();
  const t = dict[lang].home;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: 'individualna',
    message: ''
  });

  // Sync program from context when modal opens
  React.useEffect(() => {
    if (isContactModalOpen) {
      setFormData(prev => ({ ...prev, program: contactModalProgram }));
    }
  }, [isContactModalOpen, contactModalProgram]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isContactModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isContactModalOpen]);

  if (!isContactModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Add a 10-second timeout to the Firestore write
      const writePromise = addDoc(collection(db, 'submissions'), {
        ...formData,
        lang,
        timestamp: serverTimestamp()
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 10000)
      );

      await Promise.race([writePromise, timeoutPromise]);
      
      setIsSuccess(true);
      setTimeout(() => {
        closeContactModal();
        setIsSuccess(false);
        setFormData({ name: '', email: '', program: 'individualna', message: '' });
      }, 3000);
    } catch (err: any) {
      console.error('Error adding document: ', err);
      if (err.message === 'TIMEOUT') {
        setError(lang === 'BHS' ? 'Sporo povezivanje. Molimo pokušajte ponovo.' : 'Connection timeout. Please try again.');
      } else {
        setError(lang === 'BHS' ? 'Došlo je do greške. Molimo pokušajte ponovo.' : 'An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" 
      onClick={closeContactModal}
    >
      <div 
        className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 relative animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={closeContactModal} 
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-12 space-y-4 animate-fade-in">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-dark">
              {lang === 'BHS' ? 'Poruka poslana!' : 'Message Sent!'}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {lang === 'BHS' 
                ? 'Hvala Vam. Javit ćemo Vam se u najkraćem mogućem roku.' 
                : 'Thank you. We will get back to you as soon as possible.'}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-serif font-bold text-brand-dark/80 mb-2">{t.contactModalTitle}</h3>
              <p className="text-brand-dark/50">{t.contactModalSubtitle}</p>
            </div>

            <div className="space-y-4">
              <Button 
                fullWidth 
                size="lg"  
                onClick={() => {
                  window.open('https://calendly.com/contact-habitplus/15min', '_blank');
                  closeContactModal();
                }}
              >
                {t.contactModalBtnCalendly}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase text-gray-400 font-bold bg-white px-4 tracking-widest">
                  {t.contactModalOr}
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    name="name"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.contactModalNamePlaceholder} 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
                  />
                  <input 
                    name="email"
                    type="email" 
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.contactModalEmailPlaceholder} 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
                  />
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest px-2">
                      {t.contactModalProgramTitle}
                    </p>
                    <select 
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all text-brand-dark/70 appearance-none cursor-pointer font-medium"
                    >
                      {t.contactModalPrograms.map((p: any) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <textarea 
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.contactModalMessagePlaceholder}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none font-medium"
                  ></textarea>
                </div>
                
                {error && <p className="text-red-500 text-sm font-medium px-2">{error}</p>}

                <Button 
                  variant="outline" 
                  fullWidth 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      {lang === 'BHS' ? 'Slanje...' : 'Sending...'}
                    </span>
                  ) : t.contactModalSubmitBtn}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
