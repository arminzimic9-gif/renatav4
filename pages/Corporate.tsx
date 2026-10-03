import React, { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Briefcase, TrendingUp, Users, CheckCircle, BookOpen, UserPlus, Target, ChevronDown, ArrowRight } from 'lucide-react';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';
import { useLanguage } from '../context/LanguageContext';
import { WordReveal } from '../components/animations/WordReveal';
import { useReveal } from '../hooks/useReveal';
import { useUI } from '../context/UIContext';

const BenefitCard: React.FC<{ benefit: any, Icon: any, delay: number }> = ({ benefit, Icon, delay }) => {
   const [ref, isVisible] = useReveal();
   
   return (
      <div 
         ref={ref as any}
         className={`bg-white border border-gray-100 shadow-xl rounded-[1.5rem] p-8 flex flex-col hover:-translate-y-1 hover:shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
         style={{ transitionDelay: `${delay}ms` }}
      >
         <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
            <Icon size={24} strokeWidth={1.5} />
         </div>
         <h3 className="text-2xl font-bold text-brand-dark mb-4">{benefit.title}</h3>
         <p className="text-gray-600 leading-relaxed text-sm">{benefit.desc}</p>
      </div>
   );
};

export const Corporate: React.FC<{ onNavigate: (page: Page, lang: Language) => void }> = ({ onNavigate }) => {
   const timelineRef = useRef<HTMLDivElement>(null);
   const [progress, setProgress] = useState(0);
   const { lang, dict } = useLanguage();
   const { openContactModal } = useUI();
   const t = dict[lang].corporate;

   // Section reveals
   const [heroRef, heroVisible] = useReveal();
   const [whyRef, whyVisible] = useReveal();
   const [collabRef, collabVisible] = useReveal();
   const [programsRef, programsVisible] = useReveal();

   useEffect(() => {
      const handleScroll = () => {
         if (!timelineRef.current) return;

         const rect = timelineRef.current.getBoundingClientRect();
         const windowHeight = window.innerHeight;

         const start = rect.top - windowHeight / 2;
         const end = rect.height;

         let currentProgress = (0 - start) / end;
         currentProgress = Math.max(0, Math.min(1, currentProgress)); // Clamp between 0 and 1

         setProgress(currentProgress * 100);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white">
         {/* 1. CORPORATE HERO */}
         <section className="relative lg:min-h-screen h-[100svh] flex items-center justify-center overflow-hidden w-full" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-[url('/SL__8066.jpg')] bg-cover bg-center" style={{ backgroundPosition: 'center 30%' }} />
            </div>

            <div className="absolute inset-0 bg-brand-blue opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            <div className={`w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center transition-all duration-1000 translate-y-12 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} ref={heroRef}>
               <WordReveal 
                  text={t.heroTitle} 
                  center
                  className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-8 text-white"
               />
               <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                  {t.heroSubtitle}
               </p>
               <Button
                  variant="white"
                  size="lg"
                  withArrow
                  onClick={() => window.open('https://calendly.com/contact-habitplus/15min', '_blank')}
               >
                  {t.heroButton}
               </Button>
            </div>

            {/* Scroll for More indicator */}
            <div className="absolute bottom-10 inset-x-0 mx-auto w-fit hidden lg:flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-default z-10">
               <ChevronDown size={20} className="text-white" />
            </div>
         </section>

         {/* 2. BENEFITS GRID */}
         <section className="py-16 bg-white relative z-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className={`text-center mb-16 sm:mb-20 pt-8 transition-all duration-1000 ${whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={whyRef}>
                  <WordReveal 
                    text={t.whyTitle}
                    center
                    className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-brand-blue mb-6 leading-tight tracking-tight"
                  />
                  <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed">{t.whySubtitle}</p>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                   {t.benefits.map((benefit, idx) => {
                      const icons = [TrendingUp, Users, Briefcase];
                      const Icon = icons[idx] || TrendingUp;

                      return (
                         <BenefitCard 
                            key={idx} 
                            benefit={benefit} 
                            Icon={Icon} 
                            delay={idx * 150} 
                         />
                      );
                   })}
                </div>
            </div>
         </section>

         {/* 3. SARADNJA - TIMELINE GRID */}
         <section className="py-24 md:py-32 relative overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/SL__8066.jpg')", width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
            <div className="absolute inset-0 bg-brand-blue/95" />
            <div className="w-full max-w-5xl mx-auto px-6 md:px-8 relative z-10">
               <div className={`text-center mb-16 transition-all duration-1000 ${collabVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={collabRef}>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">{t.collabTag}</p>
                  <WordReveal 
                    text={t.collabTitle}
                    center
                    className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold text-white mb-6 leading-tight tracking-tight"
                  />
                  <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                     {t.collabSubtitle}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gridAutoRows: '1fr' }}>
                  {t.collabSteps.map((item) => {
                     const IconMap: { [key: string]: any } = {
                        '01': Users,
                        '02': Target,
                        '03': BookOpen,
                        '04': TrendingUp
                     };
                     const Icon = IconMap[item.num] || Users;
                     return (
                        <div key={item.num} className="bg-white border border-gray-100 shadow-xl rounded-[1.5rem] p-6 flex flex-row items-start gap-6 min-h-[110px]">
                           <div className="shrink-0 flex flex-col items-center gap-2 pt-1">
                              <span className="text-[#94a3b8] font-bold text-[10px] tracking-widest">{item.num}</span>
                              <div className="w-14 h-14 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center">
                                 <Icon size={22} strokeWidth={1.5} />
                              </div>
                           </div>
                           <div className="w-px self-stretch bg-gray-100 shrink-0" />
                           <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-bold text-brand-dark mb-1">{item.title}</h4>
                              <p className="text-gray-500 leading-relaxed text-sm">{item.text}</p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </section>

         {/* PROGRAMI */}
         <section className="py-24 bg-brand-stone relative">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="space-y-8">
                  <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={programsRef}>
                     <WordReveal 
                        text={t.programsTitle} 
                        center
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-brand-blue mb-6"
                     />
                     <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                        {t.programsSubtitle}
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {t.programs.map((prog, idx) => {
                        if (idx === 0) { // Edukativni
                           return (
                              <div key={idx} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all line-height-relaxed">
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center">
                                       <BookOpen size={28} />
                                    </div>
                                    <div className="text-right">
                                       <span className="inline-block px-3 py-1 bg-brand-stone text-brand-dark rounded-full text-sm font-bold">{prog.duration}</span>
                                       <div className="text-gray-400 text-sm mt-1">{prog.location}</div>
                                    </div>
                                 </div>
                                 <h4 className="text-2xl font-bold text-brand-dark mb-4">{prog.title}</h4>
                                 <p className="text-gray-600 mb-6 border-b border-gray-100 pb-6">{prog.desc}</p>
                                 <h5 className="font-bold text-brand-dark mb-4">{prog.itemsTitle}</h5>
                                 <ul className="space-y-3">
                                    {prog.items.map((item, i) => (
                                       <li key={i} className="flex items-start gap-3 text-gray-700">
                                          <span className="text-brand-blue font-bold shrink-0 mt-0.5 min-w-[1.5rem]">
                                             {i + 1}.
                                          </span>
                                          <span>{item}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           );
                        } else if (idx === 1) { // Intenzivni
                           return (
                              <div key={idx} className="bg-white rounded-3xl p-10 border border-brand-teal/20 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-bl-[100px] -z-10"></div>
                                 <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center">
                                       <UserPlus size={28} />
                                    </div>
                                    <div className="text-right">
                                       <span className="inline-block px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-bold">{prog.duration}</span>
                                       <div className="text-gray-400 text-sm mt-1">{prog.location}</div>
                                    </div>
                                 </div>
                                 <h4 className="text-2xl font-bold text-brand-dark mb-1">{prog.title}</h4>
                                 <p className="text-sm font-bold text-brand-teal mb-4 tracking-wider uppercase">
                                    {lang === 'EN' ? 'Group program' : 'Grupni program'}
                                 </p>
                                 <p className="text-gray-600 mb-6 border-b border-gray-100 pb-6">{prog.desc}</p>
                                 <h5 className="font-bold text-brand-dark mb-4">{prog.itemsTitle}</h5>
                                 <ul className="space-y-3">
                                    {prog.items.map((item, i) => (
                                       <li key={i} className="flex items-start gap-3 text-gray-700">
                                          <span className="text-brand-teal font-bold shrink-0 mt-0.5 min-w-[1.5rem]">
                                             {i + 1}.
                                          </span>
                                          <span>{item}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           );
                        } else if (idx === 2) { // Novi pocetak
                           return (
                              <div key={idx} className="bg-brand-blue text-white rounded-3xl p-10 shadow-premium hover:-translate-y-1 transition-all md:col-span-2 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                 <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/2">
                                       <div className="flex justify-between items-start mb-6 w-full">
                                          <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                             <Target size={28} />
                                          </div>
                                          <div className="text-right">
                                             <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold">{prog.duration}</span>
                                             <div className="text-white/60 text-sm mt-1">{prog.location}</div>
                                          </div>
                                       </div>
                                       <h4 className="text-3xl font-serif font-bold mb-1">{prog.title}</h4>
                                       <p className="text-sm font-bold text-brand-tealLight mb-4 tracking-wider uppercase">
                                          {lang === 'EN' ? 'Group program' : 'Grupni program'}
                                       </p>
                                       <p className="text-white/80 text-lg leading-relaxed mb-6">{prog.desc}</p>
                                    </div>
                                    <div className="md:w-1/2">
                                       <h5 className="font-bold text-white mb-4 text-xl">{prog.itemsTitle}</h5>
                                       <ul className="space-y-4">
                                          {prog.items.map((item, i) => (
                                             <li key={i} className="flex items-start gap-3 text-white/90">
                                                <span className="text-brand-tealLight font-bold shrink-0 mt-1 min-w-[1.5rem]">
                                                   {i + 1}.
                                                </span>
                                                <span className="font-medium">{item}</span>
                                             </li>
                                          ))}
                                       </ul>
                                    </div>
                                 </div>
                              </div>
                           );
                        } else if (idx === 3) { // Individualna
                           return (
                              <div key={idx} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
                                 <div className="md:w-1/3 text-center md:text-left relative">
                                    <div className="flex justify-start items-start mb-6 md:absolute md:top-0 md:left-0">
                                       <span className="inline-block px-3 py-1 bg-brand-stone text-brand-dark rounded-full text-sm font-bold">
                                          {lang === 'EN' ? 'Duration' : 'Trajanje'} {prog.duration}
                                       </span>
                                    </div>
                                    <h4 className="text-2xl font-serif font-bold text-brand-dark mb-4 mt-12 md:mt-10">{prog.title}</h4>
                                    <p className="text-gray-600 mb-6">{prog.desc}</p>
                                 </div>
                                 <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {prog.items.map((item, i) => (
                                       <div key={i} className="flex gap-3 bg-brand-stone/30 p-4 rounded-2xl items-center">
                                          <span className="text-brand-blue font-bold shrink-0 min-w-[1.2rem]">
                                             {i + 1}.
                                          </span>
                                          <span className="text-gray-700 font-medium">{item}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           );
                        }
                        return null;
                     })}
                  </div>
               </div>

               <div className="mt-20 text-center">
                  <Button
                     variant="primary"
                     size="lg"
                     onClick={openContactModal}
                  >
                     {t.ctaButton}
                  </Button>
               </div>
            </div>
         </section>

         <Footer onNavigate={onNavigate} />
      </div>
   );
};