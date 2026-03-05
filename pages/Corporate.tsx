import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Briefcase, TrendingUp, Users, CheckCircle, ArrowRight, BookOpen, UserPlus, Star, Target } from 'lucide-react';
import { Page } from '../App';

export const Corporate: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
   const timelineRef = useRef<HTMLDivElement>(null);
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      const handleScroll = () => {
         if (!timelineRef.current) return;

         const rect = timelineRef.current.getBoundingClientRect();
         const windowHeight = window.innerHeight;

         // Calculate how much of the timeline is visible
         // Start filling when the top of the timeline is in the middle of the screen
         // Finish filling when the bottom of the timeline is in the middle of the screen
         const start = rect.top - windowHeight / 2;
         const end = rect.height;

         let currentProgress = (0 - start) / end;
         currentProgress = Math.max(0, Math.min(1, currentProgress)); // Clamp between 0 and 1

         setProgress(currentProgress * 100);
      };

      window.addEventListener('scroll', handleScroll);
      // Trigger once on mount
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const steps = [
      { num: '01', text: 'Inicijalni razgovor i procjena potreba tima' },
      { num: '02', text: 'Prilagođen program za vaš tim' },
      { num: '03', text: 'Radionice i sesije, uživo ili online' },
      { num: '04', text: 'Kontinuirana podrška i praćenje rezultata' }
   ];

   return (
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white">
         <Header onNavigate={onNavigate} />

         {/* 1. CORPORATE HERO */}
         <section className="relative min-h-[70vh] flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-[url('/SL__8066.jpg')] bg-cover bg-center" style={{ backgroundPosition: 'center 30%' }} />
            </div>

            {/* Blue overlay at 90% opacity */}
            <div className="absolute inset-0 bg-brand-blue opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center" style={{ transform: 'translateY(20%)' }}>
               <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-6 text-white">
                  Zdrav tim je produktivan tim.
               </h1>
               <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                  Podržite uposlenike u prestanku pušenja i izgradnji zdravih navika.
                  Smanjite bolovanja, povećajte produktivnost i izgradite kulturu u kojoj zdravlje nije opcija, već prioritet.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                     variant="white"
                     size="lg"
                     withArrow
                     onClick={() => window.location.href = 'mailto:info@habitplus.ba?subject=Upit za korporativnu saradnju'}
                  >
                     Zakaži Sastanak
                  </Button>
               </div>
            </div>
         </section>

         {/* 2. BENEFITS GRID */}
         <section className="py-16 bg-white relative z-20">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16 sm:mb-20 pt-8">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-brand-blue mb-6 leading-tight tracking-tight">Zašto investirati u HabitPlus?</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed">Programi zdravlja uposlenika nisu trošak, već investicija sa mjerljivim povratom.</p>
               </div>

               <style>{`
                  .corp-flip-card { perspective: 1000px; }
                  .corp-flip-card-inner {
                     position: relative; width: 100%; height: 100%;
                     transition: transform 0.7s cubic-bezier(0.4,0.2,0.2,1);
                     transform-style: preserve-3d;
                  }
                  .corp-flip-card:hover .corp-flip-card-inner { transform: rotateY(180deg); }
                  .corp-flip-card-front, .corp-flip-card-back {
                     position: absolute; width: 100%; height: 100%;
                     backface-visibility: hidden; -webkit-backface-visibility: hidden;
                     border-radius: 1.5rem;
                  }
                  .corp-flip-card-back { transform: rotateY(180deg); }
                  @keyframes corpFillBar { from { width: 0%; } to { width: var(--bar-width); } }
                  .corp-flip-card:hover .corp-bar-fill { animation: corpFillBar 1s ease-out 0.3s forwards; }
                  .corp-bar-fill { width: 0%; }
               `}</style>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" style={{ gridAutoRows: '280px' }}>

                  {/* Veća produktivnost */}
                  <div className="corp-flip-card h-full">
                     <div className="corp-flip-card-inner">
                        <div className="corp-flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                           <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                              <TrendingUp size={24} strokeWidth={1.5} />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-dark mb-4">Veća produktivnost</h3>
                           <p className="text-gray-600 leading-relaxed text-sm flex-1">Pušači provode 2–3 sedmice godišnje na pauzama za cigarete. Vratite taj fokus na posao i rezultate.</p>
                           <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                        </div>
                        <div className="corp-flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                           <div>
                              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Statistike produktivnosti</p>
                              <h3 className="text-white text-2xl font-bold mb-6">Veća produktivnost</h3>
                              <div className="space-y-4">
                                 {[{ label: 'Porast fokusa na poslu', val: 82 }, { label: 'Manje pauza za cigarete', val: 91 }, { label: 'Povećanje učinkovitosti', val: 74 }].map((s, i) => (
                                    <div key={i}>
                                       <div className="flex justify-between text-white/80 text-xs mb-1"><span>{s.label}</span><span>{s.val}%</span></div>
                                       <div className="w-full bg-white/10 rounded-full h-2">
                                          <div className="corp-bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <p className="text-white/50 text-xs mt-4">Prosječni rezultati organizacijskih programa</p>
                        </div>
                     </div>
                  </div>

                  {/* Manje bolovanja */}
                  <div className="corp-flip-card h-full">
                     <div className="corp-flip-card-inner">
                        <div className="corp-flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                           <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                              <Users size={24} strokeWidth={1.5} />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-dark mb-4">Manje bolovanja</h3>
                           <p className="text-gray-600 leading-relaxed text-sm flex-1">Uposlenici koji ne puše imaju manje zdravstvenih problema i manje odsustva s posla.</p>
                           <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                        </div>
                        <div className="corp-flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                           <div>
                              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Zdravstveni benefiti</p>
                              <h3 className="text-white text-2xl font-bold mb-6">Manje bolovanja</h3>
                              <div className="space-y-4">
                                 {[{ label: 'Smanjenje bolovanja', val: 68 }, { label: 'Manje zdravstvenih troškova', val: 55 }, { label: 'Bolje opće zdravlje tima', val: 79 }].map((s, i) => (
                                    <div key={i}>
                                       <div className="flex justify-between text-white/80 text-xs mb-1"><span>{s.label}</span><span>{s.val}%</span></div>
                                       <div className="w-full bg-white/10 rounded-full h-2">
                                          <div className="corp-bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <p className="text-white/50 text-xs mt-4">Na osnovu kliničkih istraživanja WHO</p>
                        </div>
                     </div>
                  </div>

                  {/* Jača reputacija */}
                  <div className="corp-flip-card h-full">
                     <div className="corp-flip-card-inner">
                        <div className="corp-flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                           <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                              <Briefcase size={24} strokeWidth={1.5} />
                           </div>
                           <h3 className="text-2xl font-bold text-brand-dark mb-4">Jača reputacija poslodavca</h3>
                           <p className="text-gray-600 leading-relaxed text-sm flex-1">Briga o zdravlju uposlenika privlači talente, gradi povjerenje i dugoročnu lojalnost.</p>
                           <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                        </div>
                        <div className="corp-flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                           <div>
                              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Employer branding</p>
                              <h3 className="text-white text-2xl font-bold mb-6">Jača reputacija</h3>
                              <div className="space-y-4">
                                 {[{ label: 'Privlačenje talenata', val: 85 }, { label: 'Zadržavanje uposlenika', val: 76 }, { label: 'Zadovoljstvo timom', val: 92 }].map((s, i) => (
                                    <div key={i}>
                                       <div className="flex justify-between text-white/80 text-xs mb-1"><span>{s.label}</span><span>{s.val}%</span></div>
                                       <div className="w-full bg-white/10 rounded-full h-2">
                                          <div className="corp-bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <p className="text-white/50 text-xs mt-4">Istraživanje korporativnih zdravstvenih programa</p>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

         {/* 3. SARADNJA - TIMELINE GRID */}
         <section className="py-24 md:py-32 relative overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/SL__8007.jpg')", width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
            <div className="absolute inset-0 bg-brand-blue/90" />
            <div className="w-full max-w-5xl mx-auto px-6 md:px-8 relative z-10">

               <div className="text-center mb-16">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Proces saradnje</p>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold text-white mb-6 leading-tight tracking-tight">
                     Kako izgleda saradnja?
                  </h2>
                  <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                     Jasan, strukturiran put do zdravijeg i produktivnijeg tima.
                  </p>
               </div>

               <div className="w-full bg-white shadow-2xl relative rounded-[2rem] overflow-hidden">
                  <div className="flex flex-col md:flex-row w-full">
                     {[
                        { num: '01', title: 'Inicijalni razgovor i procjena', text: 'Upoznajemo se s vašim timom, identificiramo izazove i definišemo ciljeve saradnje.', icon: <Users size={20} strokeWidth={1.5} /> },
                        { num: '02', title: 'Prilagođen program za tim', text: 'Kreiramo program koji direktno odgovara potrebama, ritmu i kulturi vašeg tima.', icon: <Target size={20} strokeWidth={1.5} /> },
                        { num: '03', title: 'Radionice i sesije', text: 'Provodimo interaktivne sesije uživo ili online — prilagođene vašem rasporedu i lokaciji.', icon: <BookOpen size={20} strokeWidth={1.5} /> },
                        { num: '04', title: 'Praćenje i podrška', text: 'Kontinuirano pratimo napredak, pružamo podršku i mjerimo stvarne rezultate tokom vremena.', icon: <TrendingUp size={20} strokeWidth={1.5} /> }
                     ].map((item, index) => (
                        <div key={item.num} className={`relative flex-1 p-8 md:p-12 flex flex-col items-start ${index !== 3 ? 'border-b md:border-b-0 md:border-r border-gray-200' : ''}`}>

                           {/* Decorative orange dot on the left border (hidden on the first item) */}
                           {index !== 0 && (
                              <div className="hidden md:block absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f97316] z-10" />
                           )}

                           {/* Number */}
                           <div className="text-[#64748b] font-bold text-xs tracking-widest mb-8 flex items-center gap-2">
                              {item.num} <span className="w-4 h-[1px] bg-[#cbd5e1]"></span>
                           </div>

                           {/* Icon Box */}
                           <div className="w-14 h-14 border border-gray-200 text-[#334155] flex items-center justify-center mb-10 transition-colors hover:border-brand-blue hover:text-brand-blue">
                              {item.icon}
                           </div>

                           {/* Content */}
                           <h4 className="text-[#0f172a] font-serif font-bold text-2xl leading-tight mb-4">{item.title}</h4>
                           <p className="text-[#64748b] leading-relaxed text-[15px]">{item.text}</p>

                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* PROGRAMI */}
         <section className="py-24 bg-brand-stone relative">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="space-y-8">
                  <h3 className="text-3xl font-serif text-brand-dark text-center mb-12">Naši Programi</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* EDUKATIVNI SEMINARI */}
                     <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all line-height-relaxed">
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center">
                              <BookOpen size={28} />
                           </div>
                           <div className="text-right">
                              <span className="inline-block px-3 py-1 bg-brand-stone text-brand-dark rounded-full text-sm font-bold">1,5h</span>
                              <div className="text-gray-400 text-sm mt-1">uživo ili online</div>
                           </div>
                        </div>
                        <h4 className="text-2xl font-bold text-brand-dark mb-4">Edukativni Seminari</h4>
                        <p className="text-gray-600 mb-6 border-b border-gray-100 pb-6">Jednokratni uvodni seminar koji nudi informacije vezane za rizike pušenja, faze odvikavanja i praktične korake ka prestanku. Fokus na osvještavanju i motivaciji kroz interaktivno predavanje i grupni rad.</p>
                        <h5 className="font-bold text-brand-dark mb-4">Šta dobijate:</h5>
                        <ul className="space-y-3">
                           {["Interaktivnu grupnu radionicu", "Praktične vježbe i primjeri iz prakse", "Digitalne materijale", "Osnovno znanje o metodama odvikavanja"].map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                 <CheckCircle size={18} className="text-brand-blue mt-0.5 shrink-0" /> {item}
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* INTENZIVNI PROGRAM */}
                     <div className="bg-white rounded-3xl p-10 border border-brand-teal/20 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-bl-[100px] -z-10"></div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 bg-brand-teal/10 text-brand-teal rounded-2xl flex items-center justify-center">
                              <UserPlus size={28} />
                           </div>
                           <div className="text-right">
                              <span className="inline-block px-3 py-1 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-bold">2 x 3h</span>
                              <div className="text-gray-400 text-sm mt-1">uživo ili online</div>
                           </div>
                        </div>
                        <h4 className="text-2xl font-bold text-brand-dark mb-1">Intenzivni Program</h4>
                        <p className="text-sm font-bold text-brand-teal mb-4 tracking-wider uppercase">Grupni Program</p>
                        <p className="text-gray-600 mb-6 border-b border-gray-100 pb-6">Dvije radionice koje nude metodičnu podršku u kraćem vremenskom okviru. Fokus je na strategijama za prevazilaženje kriza i izradu plana prestanka pušenja.</p>
                        <h5 className="font-bold text-brand-dark mb-4">Šta dobijate:</h5>
                        <ul className="space-y-3">
                           {["Grupne radionice s psihološkim pristupom ovisnosti", "Jasni i primjenjivi alati za prevazilaženje žudnje", "Praktične vježbe i simulacije realnih situacija", "Razmjena iskustava i grupna podrška", "Digitalne materijale"].map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                 <CheckCircle size={18} className="text-brand-teal mt-0.5 shrink-0" /> {item}
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* PROGRAM NOVI POCETAK */}
                     <div className="bg-brand-blue text-white rounded-3xl p-10 shadow-premium hover:-translate-y-1 transition-all md:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-8">
                           <div className="md:w-1/2">
                              <div className="flex justify-between items-start mb-6 w-full">
                                 <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                    <Target size={28} />
                                 </div>
                                 <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold">8 x 1h</span>
                                    <div className="text-white/60 text-sm mt-1">uživo ili online</div>
                                 </div>
                              </div>
                              <h4 className="text-3xl font-serif font-bold mb-1">Program "Novi Početak"</h4>
                              <p className="text-sm font-bold text-brand-tealLight mb-4 tracking-wider uppercase">Grupni Program</p>
                              <p className="text-white/80 text-lg leading-relaxed mb-6">Najdetaljniji program sa kontinuiranom, stručno vođenom podrškom kroz cijeli proces prestanka pušenja i rada na identitetu nepušača. Kombinacija individualnog plana i grupne motivacije za trajne rezultate.</p>
                           </div>
                           <div className="md:w-1/2">
                              <h5 className="font-bold text-white mb-4 text-xl">Šta dobijate:</h5>
                              <ul className="space-y-4">
                                 {["Edukacija o zdravim navikama i promjeni ponašanja", "Alati za prevenciju relapsa i upravljanje stresom", "Digitalni resursi za kontinuiranu podršku", "Grupna motivacija i osjećaj pripadnosti", "Individualni plan prestanka pušenja", "Izgradnja identiteta nepušača"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-white/90">
                                       <CheckCircle size={20} className="text-brand-tealLight shrink-0" />
                                       <span className="font-medium">{item}</span>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>

                     {/* INDIVIDUALNA PODRSKA */}
                     <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-all md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/3 text-center md:text-left">
                           <h4 className="text-2xl font-serif font-bold text-brand-dark mb-4">Individualna podrška za uposlenike</h4>
                           <p className="text-gray-600 mb-6">Diskretna 1:1 podrška za uposlenike koji žele prestati pušiti uz potpunu privatnost.</p>
                           <span className="inline-block px-4 py-2 bg-brand-stone text-brand-dark rounded-full text-sm font-bold">Trajanje: 1h</span>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {["Individualni plan prestanka pušenja", "Dugoročna podrška i praćenje", "Fleksibilno zakazivanje", "Sesije uživo ili online"].map((item, i) => (
                              <div key={i} className="flex gap-3 bg-brand-stone/30 p-4 rounded-2xl">
                                 <CheckCircle size={20} className="text-brand-blue shrink-0" />
                                 <span className="text-gray-700 font-medium">{item}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                  </div>
               </div>

               <div className="mt-20 text-center">
                  <Button
                     variant="primary"
                     size="lg"
                     withArrow
                     onClick={() => window.location.href = 'mailto:info@habitplus.ba?subject=Upit za korporativnu saradnju'}
                  >
                     Kontaktirajte nas
                  </Button>
               </div>
            </div>
         </section >

         <Footer />
      </div >
   );
};