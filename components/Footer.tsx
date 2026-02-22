import React from 'react';
import { Button } from './Button';
import { Linkedin, Instagram, Facebook, CreditCard, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
   return (
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100" id="kontakt">
         <div className="max-w-7xl mx-auto px-6 md:px-8">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-16 mb-16">
               <div className="md:col-span-1">
                  <a href="#" className="inline-block mb-6 group">
                     <span className="text-2xl font-serif font-bold text-brand-dark tracking-tighter">Habit</span>
                     <span className="text-2xl font-serif font-bold text-brand-blue tracking-tighter">Plus</span>
                     <span className="text-3xl text-brand-teal leading-none">.</span>
                  </a>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                     Stručno vođeni programi prestanka pušenja i promjene navika. Vaš partner u izgradnji zdravijeg života.
                  </p>
                  <div className="mb-6">
                     <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest text-[#B4B4B4]">HabitPlus</h4>
                     <div className="flex gap-3 items-center">
                        <a href="https://www.linkedin.com/company/habitplus/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                           <Linkedin size={16} />
                        </a>
                        <a href="https://www.instagram.com/habitplus.ba/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                           <Instagram size={16} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61584469727312" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                           <Facebook size={16} />
                        </a>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-bold text-brand-dark mb-4 text-xs uppercase tracking-widest text-[#B4B4B4]">Renata Lačević</h4>
                     <div className="flex gap-3 items-center">
                        <a href="https://www.linkedin.com/in/renatalacevic/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                           <Linkedin size={16} />
                        </a>
                        <a href="https://www.instagram.com/renatalacevic/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#E1306C] hover:text-white transition-all duration-300">
                           <Instagram size={16} />
                        </a>
                        <a href="https://www.facebook.com/renata.lacevic/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-brand-stone flex items-center justify-center text-brand-dark hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                           <Facebook size={16} />
                        </a>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">Programi & Linkovi</h4>
                  <ul className="space-y-4 text-sm text-gray-500 mb-8">
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Intenzivni Program</a></li>
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Novi Početak</a></li>
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Individualni Rad</a></li>
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Za Firme</a></li>
                  </ul>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest pt-2">Kompanija</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                     <li><a href="#o-nama" className="hover:text-brand-blue transition-colors hover:pl-1">O Renati</a></li>
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Česta Pitanja</a></li>
                     <li><a href="#" className="hover:text-brand-blue transition-colors hover:pl-1">Politika Privatnosti</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">Kontakt Informacije</h4>
                  <ul className="space-y-5 text-sm text-gray-500">
                     <li className="font-medium text-brand-blue text-lg hover:underline"><a href="mailto:info@habitplus.ba">info@habitplus.ba</a></li>
                     <li><strong className="text-gray-900">Kontakt osoba:</strong><br /><span className="text-gray-500 leading-relaxed inline-block mt-1">Renata Lačević</span></li>
                     <li><strong className="text-gray-900">Adresa:</strong><br /><span className="text-gray-500 leading-relaxed inline-block mt-1">Kemal begova 15<br />71000 Sarajevo, BiH</span></li>
                  </ul>
               </div>

               <div className="md:col-span-2 xl:col-span-1">
                  <h4 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">Informacije za plaćanje</h4>
                  <div className="space-y-3.5 text-[13px] text-gray-500 bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                     <p><strong className="text-gray-900">ID Firme:</strong><br />4304302390006</p>
                     <p><strong className="text-gray-900">Banka:</strong><br />ProCredit Bank, Sarajevo, BiH</p>
                     <p><strong className="text-gray-900">TR BiH:</strong><br />1941411342400148</p>
                     <div className="pt-3 border-t border-gray-200">
                        <p className="font-mono text-xs leading-relaxed"><strong className="text-gray-900 font-sans">IBAN USD:</strong><br />BA391941411342402379<br />SWIFT: MEBBBA22XXX</p>
                     </div>
                     <div className="pt-3 border-t border-gray-200">
                        <p className="font-mono text-xs leading-relaxed"><strong className="text-gray-900 font-sans">IBAN EUR:</strong><br />BA391941411342401215<br />SWIFT: MEBBBA22XXX</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between pt-8 border-t border-gray-100 text-xs text-gray-400 font-medium">
               <div>© 2024 HabitPlus. Sva prava pridržana.</div>
            </div>
         </div>
      </footer>
   );
};