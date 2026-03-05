import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { SavingsCalculator } from '../components/SavingsCalculator';
import { ArrowRight, Play, Check, Star, Menu, X, ChevronDown, Clock, Shield, Users, Trophy, Target, ArrowUpRight, BookOpen, Quote, User, Crown, Building2, LifeBuoy, Sparkles, Award, TrendingUp, Sunrise, Heart, CheckCircle, Briefcase, MessageCircle, Loader2, Send, XCircle, CheckCircle2, Globe, ShieldCheck, Brain, Scale } from 'lucide-react';
import { Page } from '../App';

interface HomeProps {
   onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
   const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
   const [isContactOpen, setIsContactOpen] = useState(false);
   const [isMailingListOpen, setIsMailingListOpen] = useState(false);
   const [activeFaq, setActiveFaq] = useState<'individual' | 'corporate' | null>(null);

   // Show popup after a short delay
   useEffect(() => {
      const timer = setTimeout(() => setIsMailingListOpen(true), 500);
      return () => clearTimeout(timer);
   }, []);



   return (
      <div className="min-h-screen flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">

         {/* 1. HERO SECTION - Full Width Photo with Quote - EDGE TO EDGE */}
         <section className="relative h-screen min-h-[600px] overflow-hidden -mx-6 md:-mx-8 w-screen">
            {/* Full Width Photo with Fade to White */}
            <div className="absolute inset-0">
               {/* Image on left side */}
               <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat hue-rotate-0 contrast-[1.05] brightness-[1.02] saturate-[1.05]"
                  style={{
                     backgroundImage: 'url(/renata-hero.png)',
                     backgroundPosition: 'left center'
                  }}
               />

               {/* Gradient fade from image to white (left to right) */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-white" />
            </div>

            {/* Right Half - Quote Overlay */}
            <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 flex flex-col justify-end pb-32 md:pb-0 md:justify-center items-center px-6 md:px-12 pointer-events-none">
               <div className="max-w-md text-center space-y-6 animate-fade-in-up pointer-events-auto">
                  <blockquote className="space-y-6">
                     <p className="text-xl md:text-2xl font-bold leading-tight text-black tracking-tight min-h-[120px] flex items-center justify-center transition-opacity duration-500">
                        {(() => {
                           const quotes = [
                              "Promjena navike počinje razumijevanjem sebe. Moj pristup je empatičan, stručan i bez osuđivanja.",
                              "Vjerujem da niko nije izgubljen slučaj. Uz pravu podršku, počinje prava promjena.",
                              "Svaki dan bez cigarete je pobjeda. Zajedno gradimo tvoju slobodu i novi identitet.",
                              "Prestanak pušenja nema veze s jačinom volje. Ono se vježba, korak po korak. Tu sam da ti pokažem kako i da budem uz tebe sve do kraja."
                           ];

                           const [currentQuote, setCurrentQuote] = React.useState(0);

                           React.useEffect(() => {
                              const interval = setInterval(() => {
                                 setCurrentQuote((prev) => (prev + 1) % quotes.length);
                              }, 5000); // Change every 5 seconds

                              return () => clearInterval(interval);
                           }, []);

                           return `"${quotes[currentQuote]}"`;
                        })()}
                     </p>

                     <footer className="pt-2">
                        <div className="w-16 h-px bg-brand-blue mx-auto mb-3"></div>
                        <cite className="not-italic">
                           <p className="font-bold text-brand-dark text-base">Renata Lačević</p>
                           <p className="text-sm text-gray-500 mt-1">Stručnjakinja za promjenu navika</p>
                        </cite>
                     </footer>
                  </blockquote>
               </div>
            </div>

            {/* Bottom Right Circular CTA */}
            <div className="absolute bottom-12 right-6 md:bottom-16 md:right-16 z-20 animate-fade-in-up delay-1000">
               <button
                  onClick={() => setIsContactOpen(true)}
                  className="w-24 h-24 rounded-full bg-brand-blue text-white font-bold text-sm shadow-xl hover:scale-105 hover:shadow-2xl hover:bg-brand-blueDark transition-all duration-300 flex flex-col items-center justify-center gap-1 group"
               >
                  <span>Novi</span>
                  <span>ovdje?</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </section>

         {/* HERO HOOK - Full Width Bridge Section */}
         <section className="relative z-30 bg-brand-blue text-white py-16 shadow-xl shadow-brand-blue/10">
            <div className="max-w-4xl mx-auto px-6 md:px-8 flex flex-col items-center text-center relative gap-6">
               {/* Decorative Pattern - lighter/subtler for full width */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

               <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Uz pravu podršku, počinje prava promjena.</h2>
                  <p className="text-brand-blueLight text-lg opacity-90 mx-auto max-w-xl">Bez osude. Bez pritiska. Samo konkretni koraci.</p>
               </div>

               <div className="relative z-10 shrink-0">
                  <Button
                     variant="white"
                     size="lg"
                     withArrow
                     className="shadow-lg shadow-brand-dark/10 border-0"
                     onClick={() => window.open('https://calendly.com', '_blank')}
                  >
                     Zakaži Termin
                  </Button>
               </div>
            </div>
         </section>

         {/* 3. UPOZNAJ OSNIVAČICU - Clean Unified Layout bg-white */}
         <section className="bg-white py-24" id="o-nama">
            <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               {/* Left Side - Text */}
               <div className="flex flex-col justify-center">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-800 mb-6 leading-tight">
                     <span className="font-medium text-slate-700">Upoznaj osnivačicu:</span><br /><span className="font-bold text-brand-blue">Renata Lačević.</span>
                  </h2>
                  <p className="text-gray-600 text-[1.15rem] font-medium leading-[1.8] mb-10 max-w-md">
                     18+ godina iskustva u javnom zdravstvu Australije. Stručnjakinja za prevenciju raka i psihologiju ovisnosti.
                  </p>

                  <div className="flex">
                     <Button
                        variant="primary"
                        size="lg"
                        withArrow
                        className="shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-brand-blue/20 hover:shadow-brand-blue/40 border border-white/10 relative overflow-hidden group"
                        onClick={() => onNavigate('about-renata')}
                     >
                        <span className="relative z-10 font-bold tracking-wide">Pročitaj moju priču</span>
                     </Button>
                  </div>
               </div>

               {/* Right Side - Icons */}
               <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full relative z-10">
                     {/* Card 1 */}
                     <div className="group flex flex-col bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                           <Globe size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 text-[18px] mb-3 leading-tight group-hover:text-brand-blue transition-colors">18+ Godina Iskustva</h3>
                           <p className="text-gray-500 text-[15px] leading-[1.6]">U javnom zdravstvu Australije, vođenje edukacija, programa i podrške u prevenciji raka.</p>
                        </div>
                     </div>

                     {/* Card 2 */}
                     <div className="group flex flex-col bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                           <ShieldCheck size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 text-[18px] mb-3 leading-tight group-hover:text-brand-blue transition-colors">Prevencija Raka</h3>
                           <p className="text-gray-500 text-[15px] leading-[1.6]">Dugogodišnja stručnost u prevenciji i ranom otkrivanju raka.</p>
                        </div>
                     </div>

                     {/* Card 3 */}
                     <div className="group flex flex-col bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                           <Brain size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 text-[18px] mb-3 leading-tight group-hover:text-brand-blue transition-colors">Psihologija Ovisnosti</h3>
                           <p className="text-gray-500 text-[15px] leading-[1.6]">Razumijevanje obrazaca ponašanja i oslobađanja od štetnih navika.</p>
                        </div>
                     </div>

                     {/* Card 4 */}
                     <div className="group flex flex-col bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.12)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center text-brand-blue mb-6 shadow-sm group-hover:bg-brand-blue group-hover:text-white group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                           <Scale size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 text-[18px] mb-3 leading-tight group-hover:text-brand-blue transition-colors">Holistički Pristup</h3>
                           <p className="text-gray-500 text-[15px] leading-[1.6]">Fokus na cjelokupno zdravlje tijela i uma te trajnu promjenu.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 4. DA LI JE OVO ZA TEBE - Simplified */}
         <section id="za-koga" className="py-24 relative overflow-hidden scroll-mt-24">
            {/* Background photo */}
            <div
               className="absolute inset-0 bg-cover bg-no-repeat"
               style={{ backgroundImage: 'url(/za-koga-bg.jpg)', backgroundPosition: 'center 30%' }}
            />
            {/* Blue overlay at 90% opacity */}
            <div className="absolute inset-0 bg-brand-blue opacity-90" />
            <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                  Prepoznaješ sebe u ovome?
               </h2>
               <p className="text-white/80 text-lg mx-auto mb-10">
                  Za koga je HabitPlus? Voljela bih da radimo zajedno i da ti pružim podršku.
               </p>

               <button
                  onClick={() => onNavigate('is-this-for-you')}
                  className="bg-white hover:bg-gray-50 text-brand-blue px-8 py-3.5 rounded-full font-medium flex items-center gap-2 transition-colors text-[15px]"
               >
                  Saznaj više <ArrowRight size={18} />
               </button>
            </div>
         </section>

         {/* 5. PROGRAMS - Cards with Hover Effects */}
         <section className="py-24 bg-white" id="programi">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">Pronađi program koji ti odgovara.</h2>
                  <p className="text-gray-500 text-lg">Bilo da želiš grupnu podršku ili individualni pristup, nudimo rješenja prilagođena tvojim potrebama.</p>
               </div>

               <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {["Individualna podrška", "Intenzivni Program", "Program \"Novi Početak\""].map((title, i) => (
                     <div key={i} className="bg-brand-stone/50 px-8 py-4 rounded-full border border-gray-100 shadow-sm text-brand-dark font-bold text-lg hover:bg-white hover:shadow-md transition-all cursor-default flex items-center gap-2">
                        <CheckCircle size={20} className="text-brand-blue" />
                        {title}
                     </div>
                  ))}
               </div>

               <div className="flex justify-center">
                  <Button
                     variant="primary"
                     size="lg"
                     withArrow
                     onClick={() => onNavigate('services')}
                  >
                     Pogledaj detalje programa
                  </Button>
               </div>
            </div>
         </section>

         {/* NEW: Za Organizacije - Full Width Hook */}
         <section id="corporate" className="py-24 bg-brand-blue relative overflow-hidden -mx-6 md:-mx-8 w-screen scroll-mt-24">
            <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
               <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                  Zdrav tim je produktivan tim.
               </h2>
               <p className="text-white/80 text-lg mx-auto mb-10 max-w-2xl">
                  Programi zdravlja uposlenika nisu trošak, već investicija sa mjerljivim povratom.
               </p>

               <button
                  className="bg-white hover:bg-gray-50 text-brand-blue px-8 py-3.5 rounded-full font-medium inline-flex items-center gap-2 transition-colors text-[15px] shadow-lg shadow-black/5"
                  onClick={() => onNavigate('corporate')}
               >
                  Rješenja za kompanije <ArrowRight size={18} />
               </button>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
               <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-3xl translate-y-1/2"></div>
            </div>
         </section>

         {/* 8. FAQs - Two Boxes */}
         <div id="faq" className="pt-24 pb-12 bg-white scroll-mt-24">
            <div className="max-w-4xl mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-4">Često Postavljena Pitanja</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">Ovdje ćete naći odgovore na najčešća pitanja o HabitPlus programima. Bilo da tražite podršku za sebe ili za vaš tim, ove informacije će vam pomoći da napravite pravi korak.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fizička Lica Box */}
                  <div
                     onClick={() => setActiveFaq('individual')}
                     className="bg-brand-stone/30 rounded-3xl p-10 cursor-pointer border border-transparent hover:border-brand-teal/20 hover:shadow-lg transition-all group group-hover:bg-brand-stone/50 flex flex-col items-center text-center"
                  >
                     <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-teal mb-6 group-hover:scale-110 transition-transform">
                        <User size={40} strokeWidth={1.5} />
                     </div>
                     <h3 className="text-2xl font-bold text-brand-dark mb-4">Za fizička lica</h3>
                     <p className="text-gray-500 mb-8">Pitanja o individualnim programima, radionicama uživo i online podršci za prestanak pušenja.</p>
                     <button className="text-brand-teal font-bold flex items-center gap-2 mt-auto">
                        Prikaži pitanja <ArrowRight size={16} />
                     </button>
                  </div>

                  {/* Organizacije Box */}
                  <div
                     onClick={() => setActiveFaq('corporate')}
                     className="bg-brand-blue/5 rounded-3xl p-10 cursor-pointer border border-transparent hover:border-brand-blue/20 hover:shadow-lg transition-all group group-hover:bg-brand-blue/10 flex flex-col items-center text-center"
                  >
                     <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                        <Building2 size={40} strokeWidth={1.5} />
                     </div>
                     <h3 className="text-2xl font-bold text-brand-dark mb-4">Za organizacije</h3>
                     <p className="text-gray-500 mb-8">Informacije o korporativnim paketima, benefitima za timove i uslugama za zaposlenike.</p>
                     <button className="text-brand-blue font-bold flex items-center gap-2 mt-auto">
                        Prikaži pitanja <ArrowRight size={16} />
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
                  className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-up relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Modal Header */}
                  <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                     <div className="flex items-center gap-3">
                        {activeFaq === 'individual' ? (
                           <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal"><User size={20} /></div>
                        ) : (
                           <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue"><Building2 size={20} /></div>
                        )}
                        <h3 className="text-2xl font-serif font-bold text-brand-dark">
                           {activeFaq === 'individual' ? 'Za Fizička Lica' : 'Za Organizacije i Kompanije'}
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
                  <div className="p-8 overflow-y-auto custom-scrollbar">
                     <div className="space-y-4">
                        {(activeFaq === 'individual' ? [
                           {
                              q: "1. Zašto bih trebao/la prestati pušiti upravo sada?",
                              a: "Vaše tijelo počinje da se oporavlja već 20 minuta nakon posljednje cigarete. Svaki dan bez cigarete znači manje oštećenja pluća, srca i krvnih sudova, imaćete više energije, kondicije, bolje ćete disati i imati više novca u džepu. Ne postoji savršen trenutak. Postoji samo odluka."
                           },
                           {
                              q: "2. Koji program je pravi za mene?",
                              a: (
                                 <>
                                    HabitPlus nudi tri opcije prilagođene različitim potrebama i životnim stilovima:
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                       <li><strong>Individualna podrška</strong> – Diskretna 1:1 podrška s individualnim planom prestanka pušenja, fleksibilnim zakazivanjem i dugoročnim praćenjem. Sesije traju 60 minuta, uživo ili online.</li>
                                       <li><strong>Intenzivni program</strong> – Dvije radionice po 3 sata s fokusom na strategije za prevazilaženje kriza i izradu plana prestanka. Uživo ili online.</li>
                                       <li><strong>Program "Novi Početak"</strong> – Najsveobuhvatniji program: 8 strukturiranih sesija (2x sedmično ili po dogovoru), kroz koje prolazite cijeli proces, od razumijevanja navike do izgradnje identiteta nepušača. Uživo ili online.</li>
                                    </ul>
                                    <div className="mt-4">
                                       <button onClick={() => window.open('https://calendly.com', '_blank')} className="font-bold text-brand-blue hover:underline">→ Rezerviši termin</button>
                                    </div>
                                 </>
                              )
                           },
                           {
                              q: "3. Da li program radi i online?",
                              a: "Da, sve sesije i radionice su dostupne uživo i online, s jednakom efikasnošću. Online format je posebno praktičan za zaposlene, roditelje i sve koji imaju dinamičan raspored. Sesije se odvijaju putem Zoom ili Google Meet platformi."
                           },
                           {
                              q: "4. Šta ako sam već pokušao/la više puta?",
                              a: (
                                 <>
                                    To zapravo govori o vašoj motivaciji, ne o neuspjehu. Istraživanja pokazuju da većina ljudi koji trajno prestanu pušiti prethodno pokušaju više puta.
                                    <br /><br />
                                    Razlika u HabitPlus pristupu je u tome što analiziramo vaše prethodne pokušaje, razumijemo šta je nedostajalo i gradimo strategiju prilagođenu upravo vama, uključujući rad na emocijama, navikama i novom identitetu, ne samo na snazi volje.
                                    <div className="mt-4">
                                       <button onClick={() => window.open('https://calendly.com', '_blank')} className="font-bold text-brand-blue hover:underline">→ Rezerviši termin</button>
                                    </div>
                                 </>
                              )
                           },
                           {
                              q: "5. Kako da se nosim sa željom za cigaretom?",
                              a: "Žudnja za cigaretom traje svega 3–5 minuta i prolazi sama, bez obzira da li zapalite cigaretu ili ne. Jedna od tehnika koja funkcioniše je tzv. \"4D\" pristup: odgodite, dišite duboko, popijte čašu vode i zaokupirajte ruke nečim drugim. U programu razvijamo individualne strategije za vaše konkretne situacije i okidače."
                           },
                           {
                              q: "6. Da li radite i s korisnicima vape uređaja, e-cigareta i nesagorijevajućeg duhana?",
                              a: "Da. HabitPlus programi su namijenjeni svim korisnicima nikotinskih proizvoda, klasičnih cigareta, vape uređaja, e-cigareta i nesagorijevajućeg duhana (HTPs), kao i kombinacija.\n\nVažno je znati: ovi proizvodi nisu bezopasna alternativa. Nikotinska ovisnost ostaje jednaka ili jača, a zbog dostupnosti i diskretnosti u upotrebi, mnogi ih konzumiraju mnogo češće."
                           },
                           {
                              q: "7. Koliko košta program?",
                              a: (
                                 <>
                                    Cijena ovisi o vrsti podrške koju odaberete. Za detalje o cijenama i dostupnim terminima, slobodno nas kontaktirajte.
                                    <div className="mt-4">
                                       <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveFaq(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} className="font-bold text-brand-blue hover:underline">→ Kontaktirajte nas</a>
                                    </div>
                                 </>
                              )
                           }
                        ] : [
                           {
                              q: "8. Zašto bi moja kompanija trebala investirati u program prestanka pušenja?",
                              a: "Pušenje zaposlenika direktno utiče na produktivnost i troškove. Pušači provedu i do 2–3 sedmice godišnje na pauzama za cigarete, češće su odsutni zbog bolesti, a zdravstveni rizici rastu s godinama. Programi zdravlja nisu trošak, oni su investicija s mjerljivim povratom: manje bolovanja, veći fokus na poslu i jača lojalnost. Pozicionira vas kao poslodavca koji brine o ljudima."
                           },
                           {
                              q: "9. Koje opcije nudite za organizacije?",
                              a: (
                                 <>
                                    Organizacijama nudimo prilagođene programe u tri formata:
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                       <li><strong>Edukativni seminar</strong> – Jednokratna interaktivna radionica (1,5h, uživo ili online) o rizicima pušenja, fazama odvikavanja i prvim koracima. Idealan uvod za timove.</li>
                                       <li><strong>Intenzivni program</strong> – Dvije radionice (2 x 3h) s psihološkim pristupom ovisnosti, praktičnim alatima i grupnom podrškom.</li>
                                       <li><strong>Program "Novi Početak"</strong> – Najdetaljniji program (8 x 1h) s individualnim planovima, prevencijom relapsa, upravljanjem stresom i izgradnjom identiteta nepušača.</li>
                                       <li><strong>Individualna podrška za zaposlenike</strong> – Diskretne 1:1 sesije za zaposlenike koji žele privatnu podršku.</li>
                                    </ul>
                                    <div className="mt-4">
                                       <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveFaq(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} className="font-bold text-brand-blue hover:underline">→ Zatražite ponudu</a>
                                    </div>
                                 </>
                              )
                           },
                           {
                              q: "10. Kako izgleda proces saradnje?",
                              a: (
                                 <>
                                    Saradnja počinje inicijalnim razgovorom u kojem zajedno procjenjujemo potrebe vašeg tima. Nakon toga kreiramo prilagođen program, dogovaramo termine i format (uživo, online ili kombinovano), a tokom i nakon programa pratimo napredak i pružamo kontinuiranu podršku.
                                    <div className="mt-4">
                                       <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveFaq(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} className="font-bold text-brand-blue hover:underline">→ Dogovorite inicijalni razgovor</a>
                                    </div>
                                 </>
                              )
                           },
                           {
                              q: "11. Da li pružate izvještaj o rezultatima?",
                              a: "Da. Transparentnost je dio naše usluge. Na kraju programa dobijate finalni izvještaj s pregledom napretka učesnika, a dodatna evaluacija se radi nakon 3 i 6 mjeseci. Svi podaci su povjerljivi."
                           },
                           {
                              q: "12. Šta ako samo nekoliko zaposlenika želi učestvovati?",
                              a: "Nema prepreke. Rad s manjom grupom ili pojedinačnim učesnicima je jednako efikasan. Nudimo individualne sesije u okviru korporativnog paketa, male grupne radionice i kombinovane formate. Iskustvo pokazuje da uspjeh prvih učesnika često motiviše i kolege da se pridruže."
                           },
                           {
                              q: "13. Kako motivisati zaposlenike da učestvuju?",
                              a: (
                                 <>
                                    Pristup je ključan: program predstavite kao beneficiju, a ne obavezu. Naglasak na zdravstvenim koristima, podrška menadžmenta i garantovana diskrecija značajno povećavaju odaziv. Mogu vam pomoći i u pripremi interne komunikacije za predstavljanje programa.
                                    <div className="mt-4">
                                       <a href="#contact" onClick={(e) => { e.preventDefault(); setActiveFaq(null); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} className="font-bold text-brand-blue hover:underline">→ Kontaktirajte nas</a>
                                    </div>
                                 </>
                              )
                           }
                        ]).map((faq, i) => (
                           <details key={i} className={`group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${activeFaq === 'individual' ? 'open:bg-brand-stone/10' : 'open:bg-brand-blue/5'}`}>
                              <summary className="font-bold text-brand-dark flex justify-between items-center outline-none">
                                 <span className="pr-4">{faq.q}</span>
                                 <ChevronDown size={20} className={`${activeFaq === 'individual' ? 'text-brand-teal' : 'text-brand-blue'} group-open:rotate-180 transition-transform shrink-0`} />
                              </summary>
                              <div className="mt-4 text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">
                                 {faq.a}
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


         {/* 8. NEWSLETTER */}
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
               <div className="bg-[#0a1128] rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                  <div className="relative z-10 max-w-xl mx-auto">
                     <h3 className="text-3xl md:text-[40px] font-sans font-bold mb-4 tracking-tight">Znanje je prvi korak.</h3>
                     <p className="text-gray-400 mb-10 text-[15px]">Prijavi se za besplatne savjete o zdravlju, navikama i psihologiji promjene.</p>

                     <div className="flex flex-col sm:flex-row gap-3 max-w-[460px] mx-auto items-stretch">
                        <input
                           type="email"
                           placeholder="Tvoja email adresa"
                           className="flex-1 px-6 py-3.5 rounded-full bg-[#1e293b]/60 border border-white/5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/20 transition-all"
                        />
                        <button className="bg-white text-brand-blue hover:bg-gray-50 font-medium text-sm px-8 py-3.5 rounded-full transition-colors whitespace-nowrap">
                           Prijavi se
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 9. BOTTOM CTA - Minimalist */}
         <section className="py-24 bg-brand-cream border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6 text-center">
               <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-8">
                  Spremni za promjenu?
               </h2>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button size="lg" variant="primary" withArrow onClick={() => window.open('https://calendly.com', '_blank')}>
                     Zakaži Besplatan Termin
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => window.location.href = 'mailto:info@habitplus.ba'}>
                     Pošalji Email
                  </Button>
               </div>
            </div>
         </section >

         <Footer />

         {/* Contact Modal */}
         {
            isContactOpen && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsContactOpen(false)}>
                  <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
                     <button onClick={() => setIsContactOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>

                     <h3 className="text-3xl font-serif text-brand-dark mb-2">Novi ovdje?</h3>
                     <p className="text-gray-500 mb-8">Zakažite besplatne konsultacije ili nam pošaljite poruku.</p>

                     <div className="space-y-4">
                        <Button fullWidth size="lg" withArrow onClick={() => window.open('https://calendly.com', '_blank')}>
                           Zakaži Besplatan Termin
                        </Button>

                        <div className="relative">
                           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                           <div className="relative flex justify-center text-xs uppercase text-gray-400 font-bold bg-white px-4">ili nam pišite</div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = 'mailto:info@habitplus.ba'; }}>
                           <div>
                              <input type="text" placeholder="Ime i prezime" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                           </div>
                           <div>
                              <input type="email" placeholder="Email adresa" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/20" />
                           </div>
                           <Button variant="outline" fullWidth>Pošalji Poruku</Button>
                        </form>
                     </div>
                  </div>
               </div>
            )
         }

         {/* Mailing List Modal */}
         {
            isMailingListOpen && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsMailingListOpen(false)}>
                  <div className="bg-brand-blue text-white rounded-[2.5rem] max-w-lg w-full p-10 md:p-12 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                     <button onClick={() => setIsMailingListOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"><X size={20} /></button>

                     <div className="relative z-10 text-center">
                        <h3 className="text-3xl font-serif mb-4">Prijavi se na našu mailing listu</h3>
                        <p className="text-white/80 mb-8">Ne propusti savjete o zdravlju, navikama i najnovijim programima iz HabitPlus centra.</p>

                        <form className="space-y-4 flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); setIsMailingListOpen(false); }}>
                           <input type="email" placeholder="Tvoja e-mail adresa" required className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 text-center" />
                           <Button variant="white" size="lg" className="w-full mt-2 font-bold !text-brand-blue" fullWidth>Prijavi me</Button>
                        </form>
                        <p className="text-xs text-white/50 mt-6">Vaši podaci su sigurni. Nema spama, obećavamo.</p>
                     </div>
                  </div>
               </div>
            )
         }
      </div >
   );
};