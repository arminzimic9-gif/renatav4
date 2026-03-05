import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Layers, CheckCircle, Clock, Calendar, Shield, Users, ArrowRight, Heart, Briefcase, Zap, Star, Sparkles, UserPlus } from 'lucide-react';
import { Page } from '../App';

interface ServicesProps {
   onNavigate: (page: Page) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
   return (
      <div className="min-h-screen flex-1 flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">
         <div className="flex-1 flex flex-col opacity-100">

            {/* 1. SERVICES HERO */}
            <section className="bg-brand-stone/30 pt-40 pb-20 md:pb-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent opacity-70"></div>
               <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 text-center">
                  <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white border border-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider shadow-sm">
                     Tvoj put do promjene
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-serif font-bold leading-[1.05] tracking-tight mb-8 text-brand-dark">
                     Odaberite svoj <br /> <span className="font-serif text-brand-teal tracking-tight font-bold">put.</span>
                  </h1>
                  <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                     Programi dizajnirani da se prilagode vašem tempu, potrebama i ciljevima. Bez pritiska, samo podrška.
                  </p>
               </div>
            </section>

            {/* 2. INTENSIVE PROGRAM - BROKEN GRID LAYOUT */}
            <section className="py-12 md:py-24 relative">
               {/* Background Decor */}
               <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

               <div className="max-w-7xl mx-auto px-6 md:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                     {/* LEFT COLUMN - STICKY INFO */}
                     <div className="lg:col-span-5 sticky top-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-dark text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-xl shadow-brand-dark/20">
                           <Sparkles size={12} fill="currentColor" className="text-brand-teal" />
                           Najtraženije
                        </div>

                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-6 leading-tight">
                           Intenzivni <br /> <span className="font-serif text-brand-blue tracking-tight font-bold">Program</span>
                        </h2>

                        <p className="text-lg text-gray-500 mb-8 leading-relaxed font-light">
                           Brz, fokusiran i snažan početak. Idealno za one koji su donijeli čvrstu odluku i trebaju konkretne alate odmah, bez dugotrajnih procesa.
                        </p>

                        {/* Key Stats - Minimalist */}
                        <div className="flex flex-col gap-6 mb-10 border-l-2 border-brand-blue/20 pl-6">
                           <div className="flex items-start gap-4">
                              <div className="mt-1 text-brand-blue"><Clock size={20} /></div>
                              <div>
                                 <h4 className="font-bold text-brand-dark">Format</h4>
                                 <p className="text-sm text-gray-500">2 fokusirane radionice + podrška</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-4">
                              <div className="mt-1 text-brand-teal"><Zap size={20} /></div>
                              <div>
                                 <h4 className="font-bold text-brand-dark">Dodatna Vrijednost</h4>
                                 <p className="text-sm text-gray-500">Uključena 1:1 sesija (60 min)</p>
                              </div>
                           </div>
                        </div>

                        <Button variant="primary" size="lg" withArrow onClick={() => window.open('mailto:info@habitplus.ba')}>
                           Prijavi se odmah
                        </Button>
                     </div>

                     {/* RIGHT COLUMN - SCROLLABLE CARDS */}
                     <div className="lg:col-span-7 space-y-8">

                        {/* Card 1 */}
                        <div className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500">
                           <div className="flex justify-between items-start mb-6">
                              <h3 className="text-2xl font-serif font-bold text-brand-dark">1. Razumijevanje i Priprema</h3>
                              <div className="w-10 h-10 rounded-full bg-brand-stone text-brand-dark flex items-center justify-center font-bold text-sm">01</div>
                           </div>
                           <p className="text-gray-500 mb-6 text-sm">Postavljanje temelja za uspjeh kroz analizu i psihološku pripremu.</p>
                           <ul className="space-y-4">
                              {[
                                 "Analiza ličnih okidača i rutina",
                                 "Psihologija navike: Zašto zapravo pušimo?",
                                 "Priprema okruženja za dan prestanka",
                                 "Izrada personaliziranog plana akcije"
                              ].map((item, i) => (
                                 <li key={i} className="flex items-start gap-3 text-brand-text">
                                    <div className="mt-1 bg-brand-teal/10 p-1 rounded-full"><CheckCircle size={14} className="text-brand-teal" /></div>
                                    <span>{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500">
                           <div className="flex justify-between items-start mb-6">
                              <h3 className="text-2xl font-serif font-bold text-brand-dark">2. Izazovi i Stabilnost</h3>
                              <div className="w-10 h-10 rounded-full bg-brand-stone text-brand-dark flex items-center justify-center font-bold text-sm">02</div>
                           </div>
                           <p className="text-gray-500 mb-6 text-sm">Konkretni alati za upravljanje kriznim situacijama i emocijama.</p>
                           <ul className="space-y-4">
                              {[
                                 "Alati za upravljanje žudnjom (Crisis Management)",
                                 "Strategije za prve kritične sedmice",
                                 "Jačanje samopouzdanja u društvenim situacijama",
                                 "Dugoročna prevencija povratka navici"
                              ].map((item, i) => (
                                 <li key={i} className="flex items-start gap-3 text-brand-text">
                                    <div className="mt-1 bg-brand-teal/10 p-1 rounded-full"><CheckCircle size={14} className="text-brand-teal" /></div>
                                    <span>{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Bonus Card - Different Style */}
                        <div className="bg-brand-blueDark rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                           <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                           <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-4 text-brand-tealLight">
                                 <Heart size={24} fill="currentColor" className="opacity-50" />
                                 <span className="text-xs font-bold uppercase tracking-widest">Ekskluzivni Bonus</span>
                              </div>
                              <h3 className="text-3xl font-serif mb-4">1:1 Mentorska Podrška</h3>
                              <p className="text-brand-tealLight/80 leading-relaxed mb-8 max-w-md">
                                 Uključuje 60 minuta individualnog rada fokusiranog na vaše specifične izazove koji se jave nakon radionica. Jer prava podrška je najvažnija kad postane teško.
                              </p>
                              <Button variant="white" size="sm" onClick={() => window.open('mailto:info@habitplus.ba')}>
                                 Saznaj više
                              </Button>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </section>

            {/* 3. PROGRAM NOVI POCETAK */}
            <section className="py-24 bg-white border-t border-gray-100">
               <div className="max-w-7xl mx-auto px-6 md:px-8">
                  <div className="max-w-3xl mx-auto text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Program "Novi Početak"</h2>
                     <p className="text-lg text-gray-500 leading-relaxed mb-8">
                        Stručno vođena podrška kroz prestanak pušenja i transformaciju u nepušača.
                     </p>
                     <div className="flex justify-center gap-4">
                        <span className="px-4 py-2 bg-brand-stone rounded-full text-sm font-bold text-brand-dark">8 Sesija</span>
                        <span className="px-4 py-2 bg-brand-stone rounded-full text-sm font-bold text-brand-dark">Grupno / Individualno</span>
                        <span className="px-4 py-2 bg-brand-stone rounded-full text-sm font-bold text-brand-dark">Uživo / online</span>
                     </div>
                  </div>

                  {/* Sessions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                     {[
                        { title: "Razumijevanje pušenja i prestanka", desc: "Zašto pušimo, kako nastaje navika i šta se zaista dešava kada prestajemo" },
                        { title: "Planiranje i priprema", desc: "Postavljanje realnog cilja, izbor datuma prestanka i priprema okruženja" },
                        { title: "Zdravstvene posljedice i metode", desc: "Šta se dešava s tijelom kada prestanemo i pregled dostupnih metoda podrške" },
                        { title: "Snalaženje, fizički aspekt", desc: "Apstnencijska kriza, nikotinska ovisnost i kako upravljati simptomima" },
                        { title: "Snalaženje, emocionalni aspekt", desc: "Stres, emocije i identitet" },
                        { title: "Ostati nepušač kratkoročno", desc: "Prvi dani i sedmice bez cigareta, strategije stabilizacije" },
                        { title: "Ostati nepušač dugoročno", desc: "Prevencija povratka pušenju, društvene situacije, izazovi i rješenja" },
                        { title: "Uživanje u životu nepušača", desc: "Novi identitet, rutine i dugoročna sloboda od pušenja" },
                     ].map((session, i) => (
                        <div key={i} className="bg-brand-stone/30 p-8 rounded-[2rem] border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-lg transition-all group cursor-default">
                           <div className="w-10 h-10 rounded-xl bg-white text-brand-dark font-bold flex items-center justify-center text-sm mb-4 shadow-sm group-hover:bg-brand-teal group-hover:text-white transition-colors">
                              {i + 1}
                           </div>
                           <h4 className="font-bold text-lg text-brand-dark mb-2">{session.title}</h4>
                           <p className="text-sm text-gray-500 leading-relaxed">{session.desc}</p>
                        </div>
                     ))}
                  </div>

                  <div className="text-center">
                     <Button variant="outline" size="lg" withArrow onClick={() => window.location.href = 'mailto:info@habitplus.ba'}>
                        Saznaj više o programu
                     </Button>
                  </div>
               </div>
            </section>

            {/* 4. USLUGE / PODRŠKA */}
            <section className="py-24 bg-brand-stone/30 border-t border-gray-100">
               <div className="max-w-7xl mx-auto px-6 md:px-8">
                  <div className="max-w-3xl mx-auto text-center mb-20">
                     <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white border border-brand-teal/20 text-brand-teal text-sm font-bold uppercase tracking-wider shadow-sm">
                        Usluge / Podrška
                     </div>
                     <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">USLUGE ZA POJEDINCE</h2>
                     <p className="text-lg text-gray-600 leading-relaxed">
                        Pronađi program koji ti odgovara. Bilo da želiš grupnu podršku ili individualni pristup, nudimo rješenja prilagođena tvojim potrebama, ciljevima i načinu života.
                     </p>
                  </div>

                  <div className="space-y-8">
                     {/* Individualna Podrška */}
                     <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                           <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mb-8">
                              <UserPlus size={32} />
                           </div>
                           <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4">Individualna podrška</h3>
                           <p className="text-gray-600 mb-6 text-lg">Diskretna 1:1 podrška uz potpunu privatnost.</p>
                           <div className="inline-block px-4 py-2 bg-brand-stone text-brand-dark rounded-full font-bold mb-8">
                              Trajanje: 1h
                           </div>
                           <Button variant="primary" size="lg" withArrow onClick={() => window.open('https://calendly.com', '_blank')}>
                              Rezerviši termin
                           </Button>
                        </div>
                        <div className="md:w-1/2 bg-brand-stone/30 rounded-3xl p-8 w-full">
                           <h4 className="font-bold text-brand-dark mb-6 text-xl">Šta dobijate:</h4>
                           <ul className="space-y-4">
                              {[
                                 "Individualni plan prestanka pušenja",
                                 "Dugoročna podrška i praćenje",
                                 "Fleksibilno zakazivanje",
                                 "Sesije uživo ili online"
                              ].map((item, i) => (
                                 <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-white p-1 rounded-full shadow-sm"><CheckCircle size={16} className="text-brand-teal" /></div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     {/* Intenzivni Program */}
                     <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-brand-blue/20 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-bl-[100px] -z-10"></div>
                        <div className="md:w-1/2">
                           <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-8">
                              <Zap size={32} />
                           </div>
                           <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4">Intenzivni Program</h3>
                           <p className="text-gray-600 mb-6 text-lg">Dvije radionice koje nude metodičnu podršku u kraćem vremenskom okviru. Fokus je na strategijama za prevazilaženje kriza i izradu plana prestanka pušenja.</p>
                           <div className="inline-block px-4 py-2 bg-brand-stone text-brand-dark rounded-full font-bold mb-8">
                              Trajanje: 2 x 3h – uživo ili online
                           </div>
                           <div className="flex flex-col sm:flex-row gap-4">
                              <Button variant="secondary" size="lg" withArrow onClick={() => window.location.href = 'mailto:info@habitplus.ba'}>
                                 Prijavi interesovanje
                              </Button>
                              <span className="text-sm text-gray-500 max-w-xs self-center">Ostavi e-mail i obavijestit ćemo te o sljedećem terminu.</span>
                           </div>
                        </div>
                        <div className="md:w-1/2 bg-brand-blue/5 border border-brand-blue/10 rounded-3xl p-8 w-full">
                           <h4 className="font-bold text-brand-blue mb-6 text-xl">Šta dobijaš:</h4>
                           <ul className="space-y-4">
                              {[
                                 "Grupne radionice s psihološkim pristupom ovisnosti",
                                 "Jasni i primjenjivi alati za prevazilaženje žudnje",
                                 "Praktične vježbe i simulacije realnih situacija",
                                 "Razmjena iskustava i grupna podrška",
                                 "Digitalni materijali i resursi"
                              ].map((item, i) => (
                                 <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-white p-1 rounded-full shadow-sm"><CheckCircle size={16} className="text-brand-blue" /></div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     {/* Program Novi Početak - Screenshot Style */}
                     <div className="bg-[#0f172a] text-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-start border border-[#1e293b]">
                        <div className="md:w-1/2 relative z-10 w-full">
                           <div className="w-14 h-14 rounded-xl bg-[#1e293b] text-gray-300 flex items-center justify-center mb-8 border border-white/5">
                              <Star size={24} strokeWidth={1.5} />
                           </div>
                           <h3 className="text-3xl sm:text-4xl font-sans font-bold mb-4 tracking-tight">Program "Novi Početak"</h3>
                           <p className="text-gray-400 mb-8 text-sm leading-relaxed max-w-md text-justify">Najdetaljniji program sa kontinuiranom, stručno vođenom podrškom kroz cijeli proces prestanka pušenja i rada na identitetu nepušača. Kombinacija individualnog plana i grupne motivacije za trajne rezultate.</p>

                           <div className="inline-block px-4 py-2.5 bg-[#1e293b] border border-white/5 rounded-[12px] text-xs font-medium text-gray-300 mb-10 w-full sm:w-auto">
                              Trajanje: 8 × 1h (2x sedmično ili po dogovoru) – uživo ili online
                           </div>

                           <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                              <button
                                 className="bg-white text-[#0f172a] hover:bg-gray-100 font-medium px-8 py-3.5 rounded-[12px] transition-colors flex items-center gap-4 text-sm whitespace-nowrap"
                                 onClick={() => window.location.href = 'mailto:info@habitplus.ba'}
                              >
                                 Prijavi interesovanje
                                 <ArrowRight size={16} />
                              </button>
                              <span className="text-[13px] text-gray-500 max-w-[200px] leading-snug">Ostavi e-mail i obavijestit ćemo te o sljedećem terminu.</span>
                           </div>

                           <div className="mt-14 max-w-md w-full">
                              <h4 className="font-bold text-white mb-6 text-xl">Struktura programa:</h4>
                              <div className="space-y-4">
                                 {[
                                    { t: "1. Razumijevanje pušenja i prestanka:", d: "Zašto pušimo, kako nastaje navika i šta se zaista dešava kada prestajemo" },
                                    { t: "2. Planiranje i/ili priprema za budući prestanak:", d: "Postavljanje realnog cilja, izbor datuma prestanka i priprema okruženja" },
                                    { t: "3. Zdravstvene posljedice i metode prestanka:", d: "Šta se dešava s tijelom kada prestanemo i pregled dostupnih metoda podrške" },
                                    { t: "4. Snalaženje bez cigareta, fizički aspekt:", d: "Apstinencijska kriza, nikotinska ovisnost i kako upravljati simptomima" },
                                    { t: "5. Snalaženje bez cigareta, emocionalni aspekt:", d: "Stres, emocije i identitet" },
                                    { t: "6. Ostati nepušač kratkoročno:", d: "Prvi dani i sedmice bez cigareta, strategije stabilizacije" },
                                    { t: "7. Ostati nepušač dugoročno:", d: "Prevencija povratka pušenju, društvene situacije, izazovi i rješenja" },
                                    { t: "8. Uživanje u životu nepušača, zauvijek:", d: "Novi identitet, rutine i dugoročna sloboda od pušenja" },
                                 ].map((str, i) => (
                                    <div key={i} className="mb-4">
                                       <span className="text-gray-300 font-bold text-[14px]">{str.t}</span>{' '}
                                       <span className="text-gray-400 text-[14px] leading-snug">{str.d}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Right Column - Checklist */}
                        <div className="md:w-1/2 relative z-10 bg-[#1e293b]/50 border border-white/5 rounded-[1.5rem] p-8 md:p-10 w-full backdrop-blur-sm self-start sticky top-32">
                           <h4 className="font-bold text-white mb-6 md:mb-8 text-lg">Šta dobijaš:</h4>
                           <ul className="space-y-4 md:space-y-5">
                              {[
                                 "Edukacija o zdravim navikama i promjeni ponašanja",
                                 "Alati za prevenciju relapsa i upravljanje stresom",
                                 "Digitalni resursi za kontinuiranu podršku",
                                 "Grupna motivacija i osjećaj pripadnosti",
                                 "Individualni plan prestanka pušenja",
                                 "Izgradnja identiteta nepušača"
                              ].map((item, i) => (
                                 <li key={i} className="flex items-start gap-3.5">
                                    <div className="mt-0.5 opacity-60"><CheckCircle size={18} strokeWidth={2} /></div>
                                    <span className="text-gray-300 text-[14.5px] font-medium leading-relaxed">{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

         </div>
         <Footer />
      </div>
   );
};