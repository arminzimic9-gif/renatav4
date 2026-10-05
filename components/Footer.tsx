import React from 'react';
import { Button } from './Button';
import { Linkedin, Instagram, Facebook, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import { Page, ROUTES } from '../routes';
import { useNavigate } from 'react-router-dom';

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

interface FooterProps {
   onNavigate?: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = () => {
   const navigate = useNavigate();
   const { lang, dict } = useLanguage();
   const { openContactModal } = useUI();
   const t = dict[lang].footer;
   const links = dict.BHS.links;
   const firma = dict[lang].podaciFirme;
   const [email, setEmail] = React.useState('');
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

   const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setStatus('idle');
      try {
         // Add a 10-second timeout to the Firestore write
         const writePromise = addDoc(collection(db, 'newsletter'), {
            email,
            lang,
            timestamp: serverTimestamp()
         });

         const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('TIMEOUT')), 10000)
         );

         await Promise.race([writePromise, timeoutPromise]);
         
         setStatus('success');
         setEmail('');
         setTimeout(() => setStatus('idle'), 5000);
      } catch (error: any) {
         console.error('Newsletter error:', error);
         setStatus('error');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleProgramClick = (index: number) => {
      const mappings: { page: Page; hash?: string }[] = [
         { page: 'services', hash: 'individualna-podrska' },
         { page: 'services', hash: 'intenzivni-program' },
         { page: 'services', hash: 'novi-pocetak' },
         { page: 'corporate' }
      ];

      const target = mappings[index];
      if (target) {
         navigate(ROUTES[lang][target.page] + (target.hash ? `#${target.hash}` : ''));
         if (!target.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
         } else {
            setTimeout(() => {
               const el = document.getElementById(target.hash as string);
               if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
         }
      }
   };

   const handleCompanyClick = (index: number) => {
      const mappings: { page: Page; hash?: string }[] = [
         { page: 'about-renata' },
         { page: 'home', hash: 'faq' },
         { page: 'privacy-policy' }
      ];

      const target = mappings[index];
      if (target) {
         navigate(ROUTES[lang][target.page] + (target.hash ? `#${target.hash}` : ''));
         if (!target.hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
         } else {
            setTimeout(() => {
               const el = document.getElementById(target.hash as string);
               if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
         }
      }
   };

   return (
      <footer className="bg-white pt-12 md:pt-20 pb-24 md:pb-10 border-t border-gray-100" id="kontakt">
         <div className="max-w-7xl mx-auto px-6 md:px-8">
            
            {/* Newsletter Subscription Section */}
            <div className="mb-12 md:mb-20 bg-[#F8FAFC] rounded-4xl p-6 md:p-12 border border-gray-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-blue/10 transition-colors duration-700"></div>
               <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                  <div className="max-w-xl">
                     <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4 leading-tight">{t.newsletter.title}</h3>
                     <p className="text-gray-500 text-lg leading-relaxed">{t.newsletter.subtitle}</p>
                  </div>
                  <div className="w-full xl:max-w-md">
                     <form onSubmit={handleNewsletterSubmit} className="relative group/form">
                        <div className="flex flex-col sm:flex-row gap-3">
                           <div className="relative flex-1">
                              <input
                                 type="email"
                                 required
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 placeholder={t.newsletter.placeholder}
                                 className="w-full h-16 px-6 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-brand-dark shadow-sm"
                              />
                              {status === 'success' && (
                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-2 font-bold text-sm animate-fade-in">
                                    <CheckCircle2 size={18} />
                                 </div>
                              )}
                           </div>
                           <Button 
                              type="submit" 
                              disabled={isSubmitting || status === 'success'}
                              className={`h-16 px-8 rounded-2xl font-bold min-w-[160px] shadow-lg shadow-brand-blue/10 hover:shadow-brand-blue/20 transition-all ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                           >
                              {isSubmitting ? (
                                 <Loader2 className="animate-spin" size={20} />
                              ) : status === 'success' ? (
                                 t.newsletter.success
                              ) : (
                                 <span className="flex items-center gap-2">
                                    {t.newsletter.button}
                                    <Send size={18} className="opacity-50" />
                                 </span>
                              )}
                           </Button>
                        </div>
                        {status === 'error' && (
                           <p className="absolute -bottom-6 left-2 text-xs font-bold text-red-500 animate-fade-in">{t.newsletter.error}</p>
                        )}
                     </form>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 md:gap-12 lg:gap-16 mb-16">
                <div className="md:col-span-1 flex flex-col items-start text-left">
                    <button onClick={() => navigate(ROUTES[lang]['home'])} className="inline-block mb-6 group">
                       <img src="/logo.svg" alt="HabitPlus Logo" className="h-20 md:h-24 w-auto transition-transform duration-500 group-hover:scale-105" />
                    </button>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                     {t.tagline}
                  </p>
                  <div className="mb-6">
                     <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest text-[#6B7280] md:text-[#B4B4B4]">{t.socialHabitplusTitle}</h4>
                     <div className="flex gap-4 md:gap-3 items-center">
                        <a href={links.habitplusLinkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                           <Linkedin size={16} />
                        </a>
                        <a href={links.habitplusInstagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                           <Instagram size={16} />
                        </a>
                        <a href={links.habitplusFacebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                           <Facebook size={16} />
                        </a>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest text-[#6B7280] md:text-[#B4B4B4]">{t.socialRenataTitle}</h4>
                     <div className="flex gap-4 md:gap-3 items-center">
                        <a href={links.renataLinkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                           <Linkedin size={16} />
                        </a>
                        <a href={links.renataInstagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                           <Instagram size={16} />
                        </a>
                        <a href={links.renataFacebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                           <Facebook size={16} />
                        </a>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">{t.programsTitle}</h4>
                  <ul className="space-y-4 text-sm text-gray-500 mb-8">
                     {t.programs.map((p, i) => (
                        <li key={i}>
                           <button 
                              onClick={() => handleProgramClick(i)} 
                              className="inline-block py-1.5 md:py-0 hover:text-brand-blue transition-colors hover:pl-1 text-left"
                           >
                              {p}
                           </button>
                        </li>
                     ))}
                  </ul>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest pt-2">{t.companyTitle}</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                     {t.company.map((c, i) => (
                        <li key={i}>
                           <button 
                              onClick={() => handleCompanyClick(i)} 
                              className="inline-block py-1.5 md:py-0 hover:text-brand-blue transition-colors hover:pl-1 text-left"
                           >
                              {c}
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">{t.contactTitle}</h4>
                  <ul className="space-y-5 text-sm text-gray-500">
                     <li className="font-medium text-brand-blue text-lg hover:underline cursor-pointer">
                        <button onClick={openContactModal} className="text-left">{firma.email}</button>
                     </li>
                     <li><strong className="text-gray-900">{t.contactPerson}</strong><br /><span className="text-gray-500 leading-relaxed inline-block mt-1">{firma.contactPerson}</span></li>
                     <li><strong className="text-gray-900">{t.address}</strong><br /><span className="text-gray-500 leading-relaxed inline-block mt-1 whitespace-pre-line">{firma.address}</span></li>
                  </ul>
               </div>

               <div className="md:col-span-2 xl:col-span-1">
                   <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">{t.paymentTitle}</h4>
                   <div className="space-y-4 text-sm text-gray-500">
                     <p><strong className="text-gray-900">{t.companyId}</strong><br />{firma.companyId}</p>
                     <p><strong className="text-gray-900">{t.bank}</strong><br />{firma.bank}</p>
                     <p><strong className="text-gray-900">{t.trBihLabel}</strong><br />{firma.trBih}</p>
                     <div className="pt-3 border-t border-gray-200">
                         <p className="text-sm leading-relaxed"><strong className="text-gray-900">{t.ibanUsdLabel}</strong><br />{firma.ibanUsd}<br />{t.swiftLabel} {firma.swiftUsd}</p>
                     </div>
                     <div className="pt-3 border-t border-gray-200">
                         <p className="text-sm leading-relaxed"><strong className="text-gray-900">{t.ibanEurLabel}</strong><br />{firma.ibanEur}<br />{t.swiftLabel} {firma.swiftEur}</p>
                     </div>
                  </div>
               </div>
            </div>

             <div className="flex justify-center items-center pt-8 border-t border-gray-100 text-xs text-gray-500 md:text-gray-400 font-medium">
                <div className="text-center flex flex-col items-center gap-1 md:gap-1.5 md:opacity-80 hover:opacity-100 transition-opacity">
                   <span className="block">{t.copyright.split('Powered')[0].trim()}</span>
                   <div className="flex flex-col md:flex-row items-center gap-1 md:gap-1.5">
                      <span>Powered{t.copyright.split('Powered')[1]?.split('Via Creativa')[0]}</span>
                      <div className="flex items-center gap-1.5">
                         <a 
                            href="https://www.viacreativa.ba" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:underline font-bold"
                         >
                            Via Creativa
                         </a>
                         <Heart size={10} className="text-brand-blue fill-brand-blue animate-pulse" />
                      </div>
                   </div>
                </div>
             </div>
         </div>
      </footer>
   );
};