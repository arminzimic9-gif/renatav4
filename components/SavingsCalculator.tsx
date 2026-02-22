import React, { useState } from 'react';
import { Calculator, DollarSign, Clock, RefreshCw } from 'lucide-react';

export const SavingsCalculator: React.FC = () => {
  const [cigsPerDay, setCigsPerDay] = useState<number>(20);
  const [pricePerPack, setPricePerPack] = useState<number>(6); // BAM default approx
  const [years, setYears] = useState<number>(1);

  const calculateSavings = () => {
    const packsPerDay = cigsPerDay / 20;
    const costPerDay = packsPerDay * pricePerPack;
    const total = costPerDay * 365 * years;
    return total.toLocaleString('bs-BA', { style: 'currency', currency: 'BAM' });
  };

  const calculateTimeGained = () => {
    // Approx 11 mins life lost per cigarette
    const minsLost = cigsPerDay * 11 * 365 * years;
    const daysGained = Math.round(minsLost / (60 * 24));
    return daysGained;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-premium p-8 md:p-10 border border-brand-blue/10 max-w-3xl mx-auto relative overflow-hidden">
       {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-4 bg-brand-blue/10 rounded-2xl text-brand-blue">
          <Calculator size={32} />
        </div>
        <div>
           <h3 className="text-2xl font-bold text-brand-dark font-serif">Kalkulator Uštede</h3>
           <p className="text-gray-500">Investiraj u sebe, ne u dim.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Cigareta dnevno</label>
          <div className="relative">
             <input 
               type="number" 
               value={cigsPerDay}
               onChange={(e) => setCigsPerDay(Number(e.target.value))}
               className="w-full px-5 py-4 rounded-xl bg-brand-stone border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all font-semibold text-brand-dark"
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kom</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Cijena kutije (KM)</label>
          <div className="relative">
             <input 
               type="number" 
               value={pricePerPack}
               onChange={(e) => setPricePerPack(Number(e.target.value))}
               className="w-full px-5 py-4 rounded-xl bg-brand-stone border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all font-semibold text-brand-dark"
             />
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">BAM</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between mb-3">
             <label className="block text-sm font-bold text-gray-700">Vremenski period</label>
             <span className="text-sm font-bold text-brand-blue">{years} godina/e</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue hover:accent-brand-teal transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        <div className="bg-brand-blue text-white rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-2 opacity-90">
             <DollarSign size={20} />
             <span className="text-sm font-medium uppercase tracking-wider">Finansijska ušteda</span>
          </div>
          <p className="text-3xl font-serif font-bold">{calculateSavings()}</p>
        </div>

        <div className="bg-brand-teal text-white rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-2 opacity-90">
             <Clock size={20} />
             <span className="text-sm font-medium uppercase tracking-wider">Dobijeno vrijeme</span>
          </div>
          <p className="text-3xl font-serif font-bold">+{calculateTimeGained()} dana</p>
        </div>
      </div>
    </div>
  );
};