import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { BlogSection } from '../components/BlogSection';
import { ArrowRight, Play, Check, Star, Menu, X, ChevronDown, Clock, Shield, Users, Trophy, Target, ArrowUpRight, BookOpen, Quote, User, Crown, Building2, LifeBuoy, Sparkles, Award, TrendingUp, Sunrise, Heart, CheckCircle, Briefcase, MessageCircle, Loader2, Send, XCircle, CheckCircle2, Globe, ShieldCheck, Brain, Scale, Zap, CigaretteOff } from 'lucide-react';
import { Page, ROUTES } from '../routes';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import { useReveal } from '../hooks/useReveal';
import { WordReveal } from '../components/animations/WordReveal';
import { useNavigate } from 'react-router-dom';
import { GoogleReviews } from '../components/GoogleReviews';
import { useSiteImage, useSiteImageList, bgStyle, posVars } from '../context/SiteImagesContext';

interface HomeProps {
   onNavigate: (page: Page, lang: Language) => void;
}


export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
   const { isAppLoading } = useUI();
   // Hero slike dolaze iz admina (Admin → Slike); prva je ona koju posjetitelj prvo vidi.
   const HERO_IMAGES = useSiteImageList('homeHero');
   const forWhomBg = useSiteImage('homeForWhom');
   const corporateBg = useSiteImage('homeCorporate');
   const [heroIdx, setHeroIdx] = useState(0);
   // Rotacija kreće tek kad se stranica pojavi (nakon izbora jezika), da prva slika uvijek bude SANA0684.
   useEffect(() => {
      if (isAppLoading) { setHeroIdx(0); return; }
      const timer = setInterval(() => setHeroIdx(prev => (prev + 1) % Math.max(HERO_IMAGES.length, 1)), 6000);
      return () => clearInterval(timer);
   }, [isAppLoading, HERO_IMAGES.length]);
   const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
   const [activeFaq, setActiveFaq] = useState<'individual' | 'corporate' | null>(null);
   const [selectedTestimonial, setSelectedTestimonial] = useState<{text: string, author: string} | null>(null);
   const { lang, dict } = useLanguage();
   const { openContactModal, setLocalPopupOpen } = useUI();
   const navigate = useNavigate();
   const t = dict[lang].home;
 
   const handleProgramClick = (page: Page, hash?: string) => {
      navigate(ROUTES[lang][page]);
      if (hash) {
         setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
               element.scrollIntoView({ behavior: 'smooth' });
            }
         }, 100);
      }
   };

   // Reveal Refs
   const [hookRef, hookVisible] = useReveal();
   const [aboutRef, aboutVisible] = useReveal();
   const [zaKogaRef, zaKogaVisible] = useReveal();
   const [programiRef, programiVisible] = useReveal();
   const [corporateRef, corporateVisible] = useReveal();
   const [testimonialsRef, testimonialsVisible] = useReveal();
   const [calculatorRef, calculatorVisible] = useReveal();
   const [faqRef, faqVisible] = useReveal();

   const testimonials = t.testimonials;

   // Parallax Mouse Effect
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
   const handleMouseMove = (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
   };

   // Mobile scroll parallax + craving banner reveal
   const [scrollY, setScrollY] = useState(0);
   const [cravingBannerVisible, setCravingBannerVisible] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const y = window.scrollY;
         setScrollY(y);
         if (y > 30) {
            setCravingBannerVisible(true);
         }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // Prevent body scroll when modal is open
   useEffect(() => {
      const isModalOpen = !!(activeFaq || selectedTestimonial);
      if (isModalOpen) {
         document.body.style.overflow = 'hidden';
         setLocalPopupOpen(true);
      } else {
         document.body.style.overflow = 'unset';
         setLocalPopupOpen(false);
      }
      return () => {
         document.body.style.overflow = 'unset';
         setLocalPopupOpen(false);
      };
   }, [activeFaq, selectedTestimonial, setLocalPopupOpen]);




   return (
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">

         {/* 1. HERO SECTION - Clean Full Width Layout */}
         <section 
            onMouseMove={handleMouseMove}
            className="relative overflow-hidden bg-brand-cream lg:min-h-screen lg:flex lg:items-center w-full pb-0 lg:pb-0"
         >
            {/* MOBILE ONLY HERO - fotografija preko cijelog ekrana, plavi prelaz odozdo */}
            <div className="block lg:hidden w-full relative h-[calc(100svh-80px)] mt-[80px] overflow-hidden bg-brand-blue">
               {HERO_IMAGES.map((img, idx) => (
                  <img
                     key={`${img.url}-${idx}`}
                     src={img.url}
                     alt={img.alt || 'HabitPlus'}
                     fetchPriority={idx === 0 ? 'high' : 'auto'}
                     loading={idx === 0 ? 'eager' : 'lazy'}
                     className={`hp-pos absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${idx === heroIdx % HERO_IMAGES.length ? 'opacity-100' : 'opacity-0'}`}
                     style={posVars(img)}
                  />
               ))}

               {/* Plavi prelaz odozdo */}
               <div
                  className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(58,120,182,0.97) 0%, rgba(70,133,195,0.85) 30%, rgba(83,146,206,0.45) 62%, rgba(83,146,206,0) 100%)' }}
               />

               {/* Tekst */}
               <div className="absolute inset-x-0 bottom-0 z-10 px-7 pb-20 text-white">
                  <h1 className="text-[46px] font-extrabold tracking-tight leading-none">{t.heroTitle}</h1>
                  <p className="mt-3 text-lg font-medium leading-snug text-white/95 max-w-[300px]">
                     {String(t.heroMobileSubtitle || '').split('\n')[0]}
                  </p>
                  {/* Slajdovi */}
                  <div className="flex gap-1.5 mt-5" aria-hidden="true">
                     {HERO_IMAGES.map((img, idx) => (
                        <span key={`${img.url}-${idx}`} className={`h-1 rounded-full transition-all duration-500 ${idx === heroIdx % HERO_IMAGES.length ? 'w-7 bg-white' : 'w-2 bg-white/50'}`} />
                     ))}
                  </div>
               </div>

               {/* Strelica prema sadržaju */}
               <button
                  type="button"
                  aria-label="Dalje"
                  onClick={() => window.scrollTo({ top: window.innerHeight - 40, behavior: 'smooth' })}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-11 h-11 flex items-center justify-center text-white/90 animate-bounce"
               >
                  <ChevronDown size={26} />
               </button>
            </div>

            {/* Desktop Background Carousel */}
            <div className="absolute inset-0 z-0 hidden lg:block overflow-hidden">
               {/* Portretne fotografije: plava pozadina lijevo (tekst), portret desno */}
               <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-brand-teal"></div>
               <div className="absolute inset-y-0 right-0 w-[58%]">
                  {HERO_IMAGES.map((img, idx) => (
                     <img
                        key={`${img.url}-${idx}`}
                        src={img.url}
                        alt=""
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        className={`hp-pos absolute inset-0 w-full h-full object-cover transition-opacity duration-[2500ms] ease-in-out ${idx === heroIdx % HERO_IMAGES.length ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                           ...posVars(img),
                           WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                           maskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                        }}
                     />
                  ))}
               </div>

               {/* Desktop Ornaments Removed */}
                </div>

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none lg:hidden"></div>
            
            {/* Desktop Only Content */}
            <div className="max-w-7xl mx-auto relative z-10 px-8 w-full py-12 lg:py-0 hidden lg:block">
               <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-8 lg:gap-x-16 items-center lg:items-center">
                  
                  {/* Title */}
                  <div className="w-full lg:col-span-12 animate-fade-in-up text-center lg:text-left order-1">
                     <WordReveal 
                        text={t.heroTitle} 
                        className="text-5xl md:text-8xl lg:text-8xl font-serif font-bold text-brand-blue lg:text-white tracking-tight justify-center lg:justify-start"
                     />
                              </div>

                  {/* Quotes & CTAs */}
                  <div className="w-full lg:col-span-10 xl:col-span-8 space-y-8 lg:space-y-10 animate-fade-in-up text-center lg:text-left items-center lg:items-start flex flex-col order-3" style={{ animationDelay: '0.1s' }}>
                     <div className="space-y-6 w-full max-w-xl lg:max-w-2xl">
                        <p className="text-xl md:text-2xl lg:text-2xl font-medium leading-relaxed text-slate-700 lg:text-white/95 transition-opacity duration-500 flex items-center justify-center lg:justify-start">
                           {(() => {
                              const quotes = t.quotes;
                              const [currentQuote, setCurrentQuote] = React.useState(0);
                              React.useEffect(() => {
                                 const interval = setInterval(() => setCurrentQuote((prev) => (prev + 1) % quotes.length), 5500);
                                 return () => clearInterval(interval);
                              }, [quotes.length]);
                              return `"${t.quotes[currentQuote]}"`;
                           })()}
                        </p>

                        <footer className="flex flex-col items-center lg:items-start">
                           <div className="w-12 h-px bg-brand-blue lg:bg-white/50 mb-3"></div>
                           <cite className="not-italic">
                              <p className="font-bold text-brand-dark lg:text-white text-lg md:text-xl tracking-wide">{t.heroAuthor}</p>
                              <p className="text-sm md:text-lg text-slate-500 lg:text-white/70">{t.heroAuthorTitle}</p>
                           </cite>
                        </footer>
                                 </div>

                     {/* CTAs */}
                     <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                         <Button
                            onClick={openContactModal}
                            variant="white"
                            className="w-full max-w-[280px] sm:max-w-none sm:w-fit"
                         >
                            {t.heroCtaNew}
                         </Button>
                              </div>
                                  </div>
                       </div>
                </div>

            {/* Scroll for More indicator */}
            <div className="absolute bottom-10 inset-x-0 mx-auto w-fit hidden lg:flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-default z-10">
               <ChevronDown size={20} className="text-white" />
                </div>
         </section>

          {/* HERO HOOK - Full Width Bridge Section */}
          <section ref={hookRef} className={`relative z-30 bg-white overflow-hidden lg:overflow-visible reveal-hidden ${hookVisible ? 'reveal-visible' : ''}`}>

             {/* CRAVING MODE INLINE BANNER - slides in as user starts scrolling on mobile */}
             <div
                className={`block lg:hidden overflow-hidden transition-all duration-700 ease-out ${
                   cravingBannerVisible
                      ? 'max-h-24 opacity-100'
                      : 'max-h-0 opacity-0'
                }`}
             >
                <button
                   onClick={() => window.dispatchEvent(new CustomEvent('open-craving-mode'))}
                   className="w-full bg-white flex items-center gap-4 px-6 py-5 border-b border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] active:bg-gray-50 transition-colors"
                >
                   <div className="w-11 h-11 bg-red-50 border border-red-100 rounded-full flex items-center justify-center shrink-0">
                      <CigaretteOff size={20} className="text-red-500" strokeWidth={2.5} />
                   </div>
                   <span className="text-brand-blue font-semibold text-[13px] text-left leading-snug">
                      {dict[lang].cravingMode.triggerLabel}
                   </span>
                   <ArrowRight size={16} className="text-brand-blue/40 ml-auto shrink-0" />
                </button>
             </div>

             <div className="max-w-4xl mx-auto px-6 md:px-8 flex flex-col items-center text-center relative gap-6 pt-14 pb-14 md:pt-32 md:pb-20">
                {/* Decorative Pattern - blueish for white background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none animate-breath"></div>

                <div className="relative z-10">
                   <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-brand-blue">{t.hookTitle}</h2>
                   <p className="text-brand-blue/80 text-lg mx-auto max-w-xl font-medium">{t.hookSubtitle}</p>
                        </div>

                <div className="relative z-10 shrink-0">
                   <Button
                      variant="primary"
                      size="lg"
                      className="shadow-xl shadow-brand-blue/20"
                      onClick={() => window.open(dict.BHS.links.calendlyUrl, '_blank')}
                   >
                      {t.hookCta}
                   </Button>
                        </div>
                 </div>
          </section>

         {/* 3. UPOZNAJ OSNIVAČICU - Clean Unified Layout bg-white */}
         <section ref={aboutRef} className={`bg-white py-16 md:py-24 reveal-hidden ${aboutVisible ? 'reveal-visible' : ''}`} id="o-nama">
            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               {/* Left Side - Text */}
               <div className="flex flex-col justify-center text-center lg:text-left">                   <WordReveal 
                    text={t.aboutFounderTitle}
                    className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-800 mb-6 leading-tight justify-center lg:justify-start"
                  />
                  <p className="text-gray-600 text-[1.15rem] font-medium leading-[1.8] mb-10 max-w-md mx-auto lg:mx-0">
                     {t.aboutFounderSubtitle}
                  </p>

                  <div className="flex justify-center lg:justify-start">
                     <Button
                        variant="primary"
                        size="lg"
                        className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-brand-blue/20 hover:shadow-brand-blue/40 border border-white/10 relative overflow-hidden group"
                        onClick={() => onNavigate('about-renata', lang)}
                     >
                        <span className="relative z-10 font-bold tracking-wide">{t.aboutFounderCta}</span>
                     </Button>
                              </div>
                       </div>

               {/* Right Side - Icons */}
               <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full relative z-10">
                     {t.expertCards.map((card, i) => {
                        const Icons = [Globe, ShieldCheck, Brain, Scale];
                        const Icon = Icons[i];
                        return (
                          <div key={i} className="group flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300">
                             <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-4 sm:mb-6 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                                <Icon size={24} strokeWidth={1.5} />
                                         </div>
                             <div>
                                <h3 className="font-bold text-slate-800 text-[18px] mb-3 leading-tight group-hover:text-brand-blue transition-colors">{card.title}</h3>
                                <p className="text-gray-500 text-[15px] leading-[1.6]">{card.desc}</p>
                                         </div>
                                      </div>
                        );
                      })}
                              </div>
                       </div>
                </div>
         </section>

         {/* 4. DA LI JE OVO ZA TEBE - Simplified */}
         <section ref={zaKogaRef} id="za-koga" className={`py-20 md:py-48 relative overflow-hidden scroll-mt-24 reveal-hidden ${zaKogaVisible ? 'reveal-visible' : ''}`}>
            {/* Background photo */}
            <div
               className="hp-pos absolute inset-0 bg-cover bg-no-repeat"
               style={bgStyle(forWhomBg)}
            />
            {/* Blue overlay at 90% opacity */}
            <div className="absolute inset-0 bg-brand-blue opacity-90" />
            <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
               <WordReveal 
                 text={t.prepoznajSebeTitle}
                 center
                 className="text-4xl md:text-5xl lg:text-5xl/6xl font-serif font-bold text-white mb-8"
               />
               <p className="text-white/90 text-lg md:text-2xl mx-auto mb-8 md:mb-12 max-w-2xl leading-relaxed">
                  {t.prepoznajSebeSubtitle}
               </p>

               <Button
                  onClick={() => window.open(dict.BHS.links.calendlyUrl, '_blank')}
                  variant="white"
                  size="lg"
                  withArrow
               >
                  {t.prepoznajSebeBtn}
               </Button>
                </div>
         </section>

         {/* 5. PROGRAMS - Cards with Hover Effects */}
         <section ref={programiRef} className={`py-16 md:py-24 bg-white reveal-hidden overflow-hidden ${programiVisible ? 'reveal-visible' : ''}`} id="programi">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                  <WordReveal 
                    text={t.findProgramTitle}
                    center
                    className="text-3xl md:text-4xl font-serif font-bold text-brand-blue mb-4"
                  />
                  <p className="text-gray-500 text-lg">{t.findProgramSubtitle}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.findPrograms.map((program, i) => {
                     const IconMap: { [key: string]: any } = {
                        User, Sparkles, Sunrise, Target, Zap
                     };
                     const Icon = IconMap[program.icon] || Target;

                     return (
                        <div key={i} className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center">
                           <div className="w-16 h-16 bg-brand-stone/50 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                              <Icon size={32} strokeWidth={1.5} />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-dark mb-4">{program.title}</h3>
                           <p className="text-gray-500 leading-relaxed mb-8 flex-1">{program.desc}</p>
                           <button 
                              onClick={() => handleProgramClick('services', program.hash)}
                              className="flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all group/link"
                           >
                              {t.saznajVise}
                              <ArrowRight size={20} />
                           </button>
                        </div>
                     );
                  })}
               </div>
            </div>
         </section>

         {/* NEW: Za Organizacije - Full Width Hook */}
         <section ref={corporateRef} id="corporate" className={`py-20 md:py-40 relative overflow-hidden w-full scroll-mt-24 md:min-h-[60vh] flex items-center reveal-hidden ${corporateVisible ? 'reveal-visible' : ''}`}>
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
               <div className="hp-pos absolute inset-0 bg-cover" style={bgStyle(corporateBg)} />
               <div className="absolute inset-0 bg-brand-blue opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>

            {/* Decorative Ornaments */}
            <div className="absolute inset-0 pointer-events-none z-10">
               <div 
                  className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-3xl rotate-12 transition-transform duration-500 ease-out"
                  style={{ transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)` }}
               ></div>
               <div 
                  className="absolute bottom-10 left-10 w-14 h-14 bg-white/10 rounded-2xl -rotate-12 transition-transform duration-300 ease-out"
                  style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
               ></div>
                </div>

            <div className="max-w-6xl mx-auto px-6 relative z-20 flex flex-col items-center text-center">
               <WordReveal 
                 text={t.corpBannerTitle}
                 center
                 className="text-4xl md:text-5xl lg:text-5xl/6xl font-serif font-extrabold text-white mb-8 leading-[1.1] w-full"
               />
               <p className="text-white/90 text-lg md:text-2xl mx-auto mb-8 md:mb-12 max-w-3xl leading-relaxed font-medium">
                  {t.corpBannerSubtitle}
               </p>

               <Button
                  variant="white"
                  size="lg"
                  withArrow
                  onClick={() => onNavigate('corporate', lang)}
                  className="shadow-xl shadow-brand-dark/20"
               >
                  {t.corpBannerBtn}
               </Button>
                </div>
         </section>

         {/* 7.5. TESTIMONIALS */}
         <section ref={testimonialsRef} className={`py-16 md:py-24 bg-brand-cream border-t border-gray-100 relative overflow-hidden reveal-hidden ${testimonialsVisible ? 'reveal-visible' : ''}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="text-center mb-10 md:mb-16">
                  <WordReveal 
                    text={t.testimonialsTitle}
                    center
                    className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-4 w-full"
                  />
                  <p className="text-gray-500 max-w-2xl mx-auto">{t.testimonialsSubtitle}</p>

                  {/* Google Reviews Button */}
                  <div className="mt-8 flex justify-center">
                      <a
                         href={dict.BHS.links.googleReviewUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="group inline-flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:-translate-y-1 hover:bg-gray-50 transition-all duration-300"
                      >
                        {/* Google G logo */}
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                           <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                           </svg>
                        </div>
                        <div className="flex flex-col items-start">
                           <span className="text-sm font-bold text-brand-dark leading-tight">
                              {t.leaveGoogleReview}
                           </span>
                           <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                 <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5 text-[#FBBC05] fill-current"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                              ))}
                              <span className="text-xs text-gray-400 ml-1 font-medium">{t.googleLabel}</span>
                           </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-stone flex items-center justify-center ml-2 group-hover:bg-brand-blue/10 transition-colors">
                           <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                     </a>
                  </div>
               </div>
                </div>
            
            {/* Mobile: native swipeable horizontal scroll, list rendered once */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory w-full" style={{ scrollbarWidth: 'none' }}>
               <div className="flex gap-4 px-6 w-max">
                  {testimonials.map((t, idx) => (
                      <div 
                         key={idx} 
                         className="snap-center shrink-0 w-[85vw] max-w-[320px] bg-white rounded-3xl p-6 border border-gray-100 flex flex-col transition-all duration-300 group cursor-default hover:bg-gray-50/50"
                      >
                        <div className="flex justify-between items-start mb-6">
                           <Quote size={32} className="text-brand-blue/20 shrink-0 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                           <div className="flex gap-0.5 text-brand-blue">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                              ))}
                                       </div>
                                    </div>
                        <div className="flex-1 relative">
                           <p className="text-gray-600 relative z-10 text-[15px] leading-relaxed line-clamp-5 italic">
                              "{t.text}"
                           </p>
                           {t.text.length > 120 && (
                              <button 
                                 onClick={() => setSelectedTestimonial(t)} 
                                 className="text-brand-blue font-bold text-sm mt-4 hover:underline flex items-center gap-1 group/btn"
                              >
                                 {dict[lang].home.testimonialReadMore}
                                 <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                           )}
                                    </div>
                        <div className="mt-8 pt-6 border-t border-gray-50 mt-auto">
                           <p className="font-bold text-brand-dark leading-tight">{t.author}</p>
                                    </div>
                                 </div>
                  ))}
               </div>
            </div>

            {/* Desktop: auto-scrolling marquee */}
            <div className="hidden md:block">
            <div className="relative overflow-hidden w-full">
               <div className="animate-marquee flex gap-6 px-4">
                  {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
                      <div 
                         key={idx} 
                         className="shrink-0 w-[300px] md:w-[380px] bg-white rounded-3xl p-8 border border-gray-100 flex flex-col transition-all duration-300 group cursor-default hover:bg-gray-50/50"
                      >
                        <div className="flex justify-between items-start mb-6">
                           <Quote size={32} className="text-brand-blue/20 shrink-0 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                           <div className="flex gap-0.5 text-brand-blue">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                              ))}
                                       </div>
                                    </div>
                        <div className="flex-1 relative">
                           <p className="text-gray-600 relative z-10 text-[15px] leading-relaxed line-clamp-5 italic">
                              "{t.text}"
                           </p>
                           {t.text.length > 120 && (
                              <button 
                                 onClick={() => setSelectedTestimonial(t)} 
                                 className="text-brand-blue font-bold text-sm mt-4 hover:underline flex items-center gap-1 group/btn"
                              >
                                 {dict[lang].home.testimonialReadMore}
                                 <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                              </button>
                           )}
                                    </div>
                        <div className="mt-8 pt-6 border-t border-gray-50 mt-auto">
                           <p className="font-bold text-brand-dark leading-tight">{t.author}</p>
                                    </div>
                                 </div>
                  ))}
                       </div>
                </div>
            </div>
         </section>

         {/* GOOGLE REVIEWS SECTION */}
         <GoogleReviews />

         {/* 9. BOTTOM CTA - Minimalist - Relocated and Restyled */}
         <section className="py-16 md:py-24 bg-brand-blue relative overflow-hidden w-full scroll-mt-24">
            {/* Added Blue/White Ornaments Removed */}
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
               <WordReveal 
                 text={t.ctaBannerTitle}
                 center
                 className="text-3xl md:text-6xl font-serif font-bold text-white mb-8"
               />
               <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-6">
                  <Button 
                    size="lg" 
                    variant="white" 
                    className="w-full sm:w-auto !text-brand-blue sm:!px-8 sm:!py-4 sm:!text-base shadow-xl" 
                    onClick={() => window.open(dict.BHS.links.calendlyUrl, '_blank')}
                  >
                     {t.ctaBannerButton}
                  </Button>
                     <Button 
                        size="lg" 
                        variant="outline" 
                        className="!border-white !text-white hover:!bg-white hover:!text-brand-blue w-full sm:w-auto sm:!px-8 sm:!py-4 sm:!text-base" 
                        onClick={openContactModal}
                      >
                         {t.sendEmailButton}
                      </Button>
                       </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
               <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl translate-y-1/2"></div>
            </div>
         </section>

         {/* SAVINGS CALCULATOR */}
         <section ref={calculatorRef} className={`py-16 md:py-24 bg-brand-cream relative overflow-hidden reveal-hidden ${calculatorVisible ? 'reveal-visible' : ''}`}>
            {/* Subtle background blobs */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl mx-auto px-6 relative z-10">
               <div className="text-center mb-10">

                  <WordReveal 
                    text={dict[lang].savingsCalculator.title}
                    center
                    className="text-3xl md:text-5xl font-serif font-bold text-brand-blue w-full mb-4"
                  />
                  <p className="text-gray-500 max-w-xl mx-auto text-lg">
                    {dict[lang].savingsCalculator.subtitle}
                  </p>
               </div>
               <SavingsCalculator />
            </div>
         </section>

         {/* 7.5 BLOG SECTION - COMING SOON */}
         <BlogSection />

         {/* 8. FAQs - Two Boxes */}
         <div ref={faqRef} id="faq" className={`pt-16 md:pt-24 pb-12 bg-white scroll-mt-24 reveal-hidden ${faqVisible ? 'reveal-visible' : ''}`}>
            <div className="max-w-4xl mx-auto px-6">
               <div className="text-center mb-10 md:mb-16">
                  <WordReveal 
                    text={t.faq.title}
                    center
                    className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-4"
                  />
                  <p className="text-gray-500 max-w-2xl mx-auto">{t.faq.subtitle}</p>
                       </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fizička Lica Box */}
                  <div
                     onClick={() => setActiveFaq('individual')}
                     className="bg-brand-stone/30 rounded-3xl p-6 md:p-10 cursor-pointer border border-transparent hover:border-brand-teal/20 hover:shadow-lg transition-all group group-hover:bg-brand-stone/50 flex flex-col items-center text-center"
                  >
                     <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-teal mb-6 group-hover:scale-110 transition-transform">
                        <User size={40} strokeWidth={1.5} />
                                 </div>
                     <h3 className="text-2xl font-bold text-brand-dark mb-4">{t.faq.individual.boxTitle}</h3>
                     <p className="text-gray-500 mb-8">{t.faq.individual.boxDesc}</p>
                     <button className="text-brand-teal font-bold flex items-center gap-2 mt-auto">
                        {t.faq.individual.boxBtn} <ArrowRight size={16} />
                     </button>
                              </div>

                  {/* Organizacije Box */}
                  <div
                     onClick={() => setActiveFaq('corporate')}
                     className="bg-brand-blue/5 rounded-3xl p-6 md:p-10 cursor-pointer border border-transparent hover:border-brand-blue/20 hover:shadow-lg transition-all group group-hover:bg-brand-blue/10 flex flex-col items-center text-center"
                  >
                     <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                        <Building2 size={40} strokeWidth={1.5} />
                                 </div>
                     <h3 className="text-2xl font-bold text-brand-dark mb-4">{t.faq.corporate.boxTitle}</h3>
                     <p className="text-gray-500 mb-8">{t.faq.corporate.boxDesc}</p>
                     <button className="text-brand-blue font-bold flex items-center gap-2 mt-auto">
                        {t.faq.corporate.boxBtn} <ArrowRight size={16} />
                     </button>
                              </div>
                       </div>
                </div>
         </div>

         {/* FAQ Modal */}
         {activeFaq && (
            <div
               className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-dark/60 backdrop-blur-sm"
               style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            >
               <div
                  className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[85dvh] flex flex-col shadow-2xl animate-fade-in-up relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Modal Header */}
                  <div className="px-5 py-4 sm:px-8 sm:py-6 border-b border-gray-100 flex items-center justify-between gap-3 sticky top-0 bg-white z-10">
                     <div className="flex items-center gap-3">
                        {activeFaq === 'individual' ? (
                           <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal"><User size={20} /></div>
                        ) : (
                           <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue"><Building2 size={20} /></div>
                        )}
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark">
                           {activeFaq === 'individual' ? t.faq.individual.modalTitle : t.faq.corporate.modalTitle}
                        </h3>
                                 </div>
                     <button
                        onClick={() => setActiveFaq(null)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                     >
                        <X size={24} />
                     </button>
                              </div>

                  {/* Modal Body - Scrollable */}
                  <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
                     <div className="space-y-4">
                        {(activeFaq === 'individual' ? t.faq.individual.items : t.faq.corporate.items).map((faq, i) => (
                           <details key={i} className={`group bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${activeFaq === 'individual' ? 'open:bg-brand-stone/10' : 'open:bg-brand-blue/5'}`}>
                              <summary className="font-bold text-brand-dark flex justify-between items-center outline-none">
                                 <span className="pr-4">{faq.q}</span>
                                 <ChevronDown size={20} className={`${activeFaq === 'individual' ? 'text-brand-teal' : 'text-brand-blue'} group-open:rotate-180 transition-transform shrink-0`} />
                              </summary>
                              <div className="mt-4 text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                                 {faq.a}
                                 {faq.list && (
                                   <ul className="list-disc pl-5 mt-2 space-y-1">
                                     {faq.list.map((item, j) => <li key={j}>{item}</li>)}
                                   </ul>
                                 )}
                                 {faq.cta && (
                                   <div className="mt-4">
                                     <button 
                                       onClick={() => faq.cta.type === 'calendly' ? window.open(dict.BHS.links.calendlyUrl, '_blank') : openContactModal()} 
                                       className="font-bold text-brand-blue hover:underline"
                                     >
                                       → {faq.cta.text}
                                     </button>
                                   </div>
                                 )}
                                          </div>
                           </details>
                        ))}
                                 </div>
                              </div>
                       </div>

               {/* Click outside to close (handled by wrapping outer div implicitly by making modal inner content stopPropagation, but doing this explicit click handler layer helps too) */}
               <div className="absolute inset-0 -z-10" onClick={() => setActiveFaq(null)} />
                </div>
         )}




         <Footer />

         {/* Testimonial Modal */}
         {
            selectedTestimonial && (
               <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setSelectedTestimonial(null)}>
                  <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85dvh] overflow-y-auto p-6 sm:p-10 relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100/50 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                     <button onClick={() => setSelectedTestimonial(null)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors z-10"><X size={20} /></button>

                     <Quote size={40} className="text-brand-blue/20 mb-6" />
                     
                     <div className="relative z-10">
                        <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-wrap">"{selectedTestimonial.text}"</p>
                        
                        <div className="pt-6 border-t border-gray-100">
                           <p className="font-bold text-brand-dark text-lg">{selectedTestimonial.author}</p>
                                    </div>
                                  </div>
                               </div>
                        </div>
            )
         }

      </div >
   );
};