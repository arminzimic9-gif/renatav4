import React from 'react';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Zap, CheckCircle, Star, UserPlus, ChevronDown, X, Brain, Target, Heart, MessageCircle, Clock, ShieldCheck, Crown, ArrowRight } from 'lucide-react';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';
import { useLanguage } from '../context/LanguageContext';
import { WordReveal } from '../components/animations/WordReveal';
import { useReveal } from '../hooks/useReveal';
import { useUI } from '../context/UIContext';

interface ServicesProps {
   onNavigate: (page: Page, lang: Language) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
   const { lang, dict } = useLanguage();
   const { openContactModal } = useUI();
   const t = dict[lang].services;

   // Section reveals
   const [heroRef, heroVisible] = useReveal();
   const [programsRef, programsVisible] = useReveal();
   const [structureRef, structureVisible] = useReveal();

   // State for selected program and modal
   const [selectedProgramIdx, setSelectedProgramIdx] = React.useState<number | null>(null);
   const [isModalOpen, setIsModalOpen] = React.useState(false);

   const openModal = (idx: number) => {
      setSelectedProgramIdx(idx);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden'; // Prevent scroll
   };

   const closeModal = () => {
      setIsModalOpen(false);
      document.body.style.overflow = 'unset'; // Restore scroll
   };
   
   return (
      <div className="min-h-screen flex-1 flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">
         <div className="flex-1 flex flex-col opacity-100">

            {/* 1. SERVICES HERO */}
            <section className="relative lg:min-h-screen h-[100svh] flex items-center justify-center overflow-hidden w-full" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
               {/* Background photo */}
               <div
                  className="absolute inset-0 bg-cover bg-no-repeat"
                  style={{ backgroundImage: 'url(/hero-2.jpg)', backgroundPosition: 'center 30%' }}
               />
               <div className="absolute inset-0 bg-brand-blue opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

               <div className={`w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center transition-all duration-1000 translate-y-12 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} ref={heroRef}>
                  <WordReveal 
                     text={t.heroTitle} 
                     center
                     className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-8 text-white"
                  />
                  <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium whitespace-pre-wrap">
                     {t.heroSubtitle}
                  </p>
                  <Button
                     variant="white"
                     size="lg"
                     withArrow
                     onClick={openContactModal}
                  >
                     {t.heroButton}
                  </Button>
               </div>

               {/* Scroll for More indicator */}
               <div className="absolute bottom-10 inset-x-0 mx-auto w-fit hidden lg:flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-default z-10">
                  <ChevronDown size={20} className="text-white" />
               </div>
            </section>

            {/* 2. PROGRAMS SELECTION (3 CARDS) */}
            <section className="py-24 bg-white overflow-hidden">
               <div className="max-w-7xl mx-auto px-6 md:px-8">
                  <div 
                     className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${programsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                     ref={programsRef}
                  >
                     {t.programs.map((program, idx) => {
                        const isSelected = selectedProgramIdx === idx;
                        const sectionIds = ['individualna-podrska', 'intenzivni-program', 'novi-pocetak'];
                        return (
                           <div 
                              key={idx} 
                              id={sectionIds[idx]}
                              onClick={() => openModal(idx)}
                              className={`group cursor-pointer rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col items-center text-center h-full ${
                                 isSelected 
                                 ? 'bg-brand-blue border-brand-blue text-white shadow-xl scale-[1.02]' 
                                 : 'bg-white border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2'
                              }`}
                           >
                              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
                                 isSelected ? 'bg-white text-brand-blue' : 'bg-brand-stone/30 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'
                              }`}>
                                 {idx === 0 ? <UserPlus size={40} strokeWidth={1.5} /> : idx === 1 ? <Zap size={40} strokeWidth={1.5} /> : <Heart size={40} strokeWidth={1.5} />}
                              </div>
                              
                              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isSelected ? 'text-white' : 'text-brand-dark'}`}>
                                 {program.title}
                              </h3>
                              
                              <p className={`text-lg leading-relaxed flex-1 line-clamp-2 h-[3.5rem] ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                 {program.desc}
                              </p>

                              <div className={`mt-8 flex items-center gap-2 font-bold transition-all ${isSelected ? 'text-white' : 'text-brand-blue'}`}>
                                 {lang === 'EN' ? 'Learn more' : 'Saznaj više'}
                                 <ArrowRight size={20} className={`transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Program Details Modal (Full-screen) */}
                  {isModalOpen && selectedProgramIdx !== null && (
                     <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in zoom-in duration-300">
                        <div className="min-h-screen py-16 px-8 md:px-16 flex flex-col items-center relative">
                           {/* Close button */}
                           <button 
                              onClick={closeModal}
                              className="fixed top-8 right-8 w-12 h-12 rounded-full bg-brand-teal text-white flex items-center justify-center hover:bg-brand-blue transition-all z-[110] shadow-xl"
                           >
                              <X size={24} />
                           </button>

                           <div className="w-full max-w-5xl mx-auto py-12">
                              <div className="flex flex-col items-center text-center mb-20">
                                 <div className="w-32 h-32 rounded-[2.5rem] bg-brand-stone/50 text-brand-teal flex items-center justify-center mb-8 shadow-sm border border-brand-stone/20">
                                    {selectedProgramIdx === 0 ? <UserPlus size={64} strokeWidth={1.2} /> : selectedProgramIdx === 1 ? <Zap size={64} strokeWidth={1.2} /> : <Heart size={64} strokeWidth={1.2} />}
                                 </div>
                                 <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-4 mb-6">
                                       <div className="w-12 h-px bg-brand-teal/30" />
                                       <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-brand-teal">
                                          {t.programs[selectedProgramIdx].duration.replace('Duration: ', '').replace('Trajanje: ', '')}
                                       </span>
                                       <div className="w-12 h-px bg-brand-teal/30" />
                                    </div>
                                    <h2 className="text-5xl md:text-8xl font-serif font-bold text-brand-dark leading-[1.1] mb-8 max-w-4xl">
                                       {t.programs[selectedProgramIdx].title}
                                    </h2>
                                 </div>
                              </div>

                              <div className="w-full h-px bg-gray-100 mb-16" />

                              <p className="text-2xl text-gray-600 font-light leading-relaxed mb-20 max-w-4xl border-l-4 border-brand-teal/10 pl-8">
                                 {t.programs[selectedProgramIdx].desc}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                                 <div className="col-span-1 md:col-span-2">
                                    <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-teal mb-12 border-b border-brand-stone/30 pb-4 inline-block">
                                       {t.programs[selectedProgramIdx].listTitle}
                                    </h4>
                                 </div>
                                 {t.programs[selectedProgramIdx].items.map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 group">
                                       <div className="w-12 h-12 rounded-2xl bg-brand-stone/40 text-brand-teal flex items-center justify-center shrink-0 text-lg font-bold group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 shadow-sm border border-white">
                                          ✓
                                       </div>
                                       <span className="text-gray-700 text-xl font-medium leading-relaxed pt-2">
                                          {item}
                                       </span>
                                    </div>
                                 ))}
                              </div>

                              {/* Universal CTA for non-"New beginning" programs or just a standard bottom placement */}
                              {selectedProgramIdx !== 2 && (
                                 <div className="mt-24 text-center">
                                    <Button 
                                       variant="primary" 
                                       size="lg" 
                                       onClick={() => {
                                          closeModal();
                                          if (selectedProgramIdx === 0) window.open('https://calendly.com/contact-habitplus/15min', '_blank');
                                          else openContactModal();
                                       }}
                                    >
                                       {t.programs[selectedProgramIdx].cta}
                                    </Button>
                                 </div>
                              )}

                              {/* Integrated Program Structure (Only for New Beginning) */}
                              {selectedProgramIdx === 2 && (
                                 <div className="mt-24 pt-24 border-t border-gray-100">
                                    <div className="text-center mb-16">
                                       <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                                          {t.structure.title}
                                       </h3>
                                       <div className="w-24 h-1 bg-brand-teal/20 mx-auto" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                       {t.structure.items.map((fullText, i) => {
                                          const IconMap: { [key: string]: any } = {
                                             Brain, Target, Heart, Zap, MessageCircle, Clock, ShieldCheck, Crown
                                          };
                                          const IconName = t.structure.icons[i];
                                          const Icon = IconMap[IconName] || Target;

                                          const splitIdx = fullText.indexOf(':');
                                          const title = splitIdx !== -1 ? fullText.substring(0, splitIdx) : fullText;
                                          const description = splitIdx !== -1 ? fullText.substring(splitIdx + 1).trim() : '';

                                          return (
                                             <div key={i} className="group bg-brand-stone/10 p-8 rounded-[2.5rem] border border-transparent hover:border-brand-teal/20 transition-all duration-500 flex gap-6">
                                                <div className="shrink-0">
                                                   <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 shadow-sm">
                                                      <Icon size={32} strokeWidth={1.5} />
                                                   </div>
                                                </div>
                                                <div className="flex-1">
                                                   <h5 className="text-xl font-bold text-brand-dark mb-2">
                                                      {title}
                                                   </h5>
                                                   {description && (
                                                      <p className="text-gray-500 leading-relaxed">
                                                         {description}
                                                      </p>
                                                   )}
                                                </div>
                                             </div>
                                          );
                                       })}
                                    </div>

                                    <div className="mt-20 text-center">
                                       <Button 
                                          variant="primary" 
                                          size="lg" 
                                          onClick={() => {
                                             closeModal();
                                             openContactModal();
                                          }}
                                       >
                                          {t.structure.cta}
                                       </Button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </section>


         </div>
         <Footer />
      </div>
   );
};
