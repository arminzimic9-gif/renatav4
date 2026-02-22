import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Briefcase, TrendingUp, Users, CheckCircle, ArrowRight, BookOpen, UserPlus, Star, Target } from 'lucide-react';
import { Page } from '../App';

export const Corporate: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
   return (
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white">

         {/* 1. CORPORATE HERO */}
         <section className="bg-brand-dark text-white pt-40 pb-24 md:pb-32 rounded-b-[4rem] lg:rounded-b-[5rem] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
               <div className="lg:w-2/3">
                  <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold uppercase tracking-wider mb-8 text-brand-teal">
                     Za Organizacije
                  </div>
                  <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-serif font-bold leading-[1.05] tracking-tight mb-8">
                     Zdrav tim je <br />
                     <span className="font-serif text-brand-blue tracking-tight">produktivan</span> tim.
                  </h1>
                  <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed font-light mb-12">
                     Podržite uposlenike u prestanku pušenja i izgradnji zdravih navika. Smanjite bolovanja,
                     povećajte produktivnost i izgradite kulturu u kojoj zdravlje nije opcija, već prioritet.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <Button variant="secondary" size="lg" withArrow onClick={() => window.open('https://calendly.com', '_blank')}>Zakaži Sastanak</Button>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. BENEFITS GRID */}
         <section className="py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Zašto investirati u HabitPlus?</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">Programi zdravlja uposlenika nisu trošak, već investicija sa mjerljivim povratom.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-brand-stone p-8 rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all">
                     <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6">
                        <TrendingUp size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-brand-dark">Veća Produktivnost</h3>
                     <p className="text-gray-500 leading-relaxed">Pušači provode 2–3 sedmice godišnje na pauzama za cigarete. Vratite taj fokus na posao i rezultate.</p>
                  </div>
                  <div className="bg-brand-stone p-8 rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all">
                     <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                        <Users size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-brand-dark">Manje bolovanja</h3>
                     <p className="text-gray-500 leading-relaxed">Uposlenici koji ne puše imaju manje zdravstvenih problema i manje odsustva s posla.</p>
                  </div>
                  <div className="bg-brand-stone p-8 rounded-[2rem] border border-gray-100 hover:shadow-lg transition-all">
                     <div className="w-12 h-12 bg-brand-wine/10 text-brand-wine rounded-2xl flex items-center justify-center mb-6">
                        <Briefcase size={24} />
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-brand-dark">Jača reputacija poslodavca</h3>
                     <p className="text-gray-500 leading-relaxed">Briga o zdravlju uposlenika privlači talente, gradi povjerenje i dugoročnu lojalnost, i pozicionira vas kao poslodavca koji vodi računa o ljudima.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* 3. SARADNJA */}
         <section className="py-24 bg-brand-stone relative">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
                  <div className="md:w-1/2">
                     <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Kako izgleda saradnja?</h2>
                     <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Organizacijama nudimo edukativne seminare i grupne programe prilagođene vašim potrebama:
                     </p>
                     <ul className="space-y-4">
                        {[
                           "Inicijalni razgovor i procjena potreba tima",
                           "Prilagođen program za vaš tim",
                           "Radionice i sesije, uživo ili online",
                           "Kontinuirana podrška i praćenje rezultata"
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-3">
                              <CheckCircle size={20} className="text-brand-blue shrink-0 mt-1" />
                              <span className="text-gray-700 font-medium text-lg">{item}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="md:w-1/2 relative">
                     <div className="aspect-square bg-white rounded-full p-8 shadow-xl absolute -right-10 opacity-10 animate-[spin_60s_linear_infinite]">
                        <Star size={400} />
                     </div>
                  </div>
               </div>

               {/* PROGRAMI */}
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
         </section>

         <Footer />
      </div>
   );
};