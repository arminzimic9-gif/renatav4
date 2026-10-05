import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Clock, Minus, Plus, Gamepad2, Check, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type ProductKey = 'cigarettes' | 'snus' | 'vape';

const StepInput: React.FC<{
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit: string;
}> = ({ value, onChange, min = 0, max = 9999, step = 1, unit }) => {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className="flex items-center gap-0 bg-brand-stone border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-brand-blue transition-all">
      <button type="button" onClick={decrement} className="px-4 py-4 text-gray-400 hover:text-brand-blue hover:bg-gray-100 transition-colors shrink-0 active:scale-95">
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <div className="flex-1 flex items-center justify-center gap-2 py-4 min-w-0">
        <span className="font-semibold text-brand-dark text-lg tabular-nums">{value}</span>
        <span className="text-gray-400 text-sm font-medium">{unit}</span>
      </div>
      <button type="button" onClick={increment} className="px-4 py-4 text-gray-400 hover:text-brand-blue hover:bg-gray-100 transition-colors shrink-0 active:scale-95">
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export const SavingsCalculator: React.FC = () => {
  // Multi-select: which products are active
  const [selected, setSelected] = useState<Set<ProductKey>>(new Set(['cigarettes']));

  const { lang, dict } = useLanguage();
  const t = dict[lang].savingsCalculator;
  // Početne vrijednosti dolaze iz admina (Kalkulator uštede); rezervne su stare fiksne vrijednosti.
  const num = (v: unknown, fallback: number) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : fallback);

  // Cigarette inputs
  const [cigsPerDay, setCigsPerDay] = useState<number>(num(t.defaultCigsPerDay, 20));
  const [pricePerPack, setPricePerPack] = useState<number>(num(t.defaultPackPrice, 6));

  // Snus inputs
  const [snusPerDay, setSnusPerDay] = useState<number>(num(t.defaultSnusPerDay, 5));
  const [pricePerSnusCan, setPricePerSnusCan] = useState<number>(num(t.defaultSnusCanPrice, 8));

  // Vape inputs
  const [vapePodPerWeek, setVapePodPerWeek] = useState<number>(num(t.defaultVapePodsPerWeek, 2));
  const [vapePodPrice, setVapePodPrice] = useState<number>(num(t.defaultVapePodPrice, 15));

  // Tekstovi iz baze stižu nakon prvog prikaza: tada preuzmi i nove početne vrijednosti.
  useEffect(() => {
    setCigsPerDay(num(t.defaultCigsPerDay, 20));
    setPricePerPack(num(t.defaultPackPrice, 6));
    setSnusPerDay(num(t.defaultSnusPerDay, 5));
    setPricePerSnusCan(num(t.defaultSnusCanPrice, 8));
    setVapePodPerWeek(num(t.defaultVapePodsPerWeek, 2));
    setVapePodPrice(num(t.defaultVapePodPrice, 15));
  }, [t.defaultCigsPerDay, t.defaultPackPrice, t.defaultSnusPerDay, t.defaultSnusCanPrice, t.defaultVapePodsPerWeek, t.defaultVapePodPrice]);

  const [years, setYears] = useState<number>(1);

  // Na mobitelu kalkulator ide u 4 koraka; na računaru je sve prikazano odjednom.
  const TOTAL_STEPS = 4;
  const [step, setStep] = useState(1);
  const stepTitles = [t.productsLabel, t.stepUsageTitle, t.periodLabel, t.stepResultTitle];
  // Klasa koja na mobitelu prikazuje samo trenutni korak, a na računaru uvijek sve.
  const onlyOnStep = (n: number) => (step === n ? '' : 'hidden md:block');

  const toggleProduct = (key: ProductKey) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Don't allow deselecting the last one
        if (next.size === 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const calculateSavingsRaw = (): number => {
    let total = 0;
    if (selected.has('cigarettes')) {
      const packsPerDay = cigsPerDay / 20;
      total += packsPerDay * pricePerPack * 365 * years;
    }
    if (selected.has('snus')) {
      const cansPerDay = snusPerDay / 20;
      total += cansPerDay * pricePerSnusCan * 365 * years;
    }
    if (selected.has('vape')) {
      total += vapePodPerWeek * vapePodPrice * 52 * years;
    }
    return total;
  };

  const calculateSavings = (): string => {
    const total = calculateSavingsRaw();
    if (lang === 'EN') {
      return total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return total.toLocaleString('bs-BA', { style: 'currency', currency: 'BAM' });
  };

  const calculateTimeGained = () => {
    let totalMinsLost = 0;
    if (selected.has('cigarettes')) totalMinsLost += cigsPerDay * 11 * 365 * years;
    if (selected.has('snus')) totalMinsLost += snusPerDay * 11 * 365 * years;
    // Vape: approx 1 pod/day = 20 min lost per day (each session ~5 min, ~4 sessions/day per pod)
    if (selected.has('vape')) {
      const vapePerDay = vapePodPerWeek / 7;
      totalMinsLost += vapePerDay * 20 * 365 * years;
    }
    return Math.round(totalMinsLost / (60 * 24));
  };

  const openCravingMode = () => {
    window.dispatchEvent(new Event('open-craving-mode'));
  };

  const products: { key: ProductKey; label: string }[] = [
    { key: 'cigarettes', label: t.productCigarettes },
    { key: 'snus',       label: t.productSnus },
    { key: 'vape',       label: t.productVape },
  ];

  return (
    <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.10)] p-5 md:p-10 border border-brand-blue/10 max-w-3xl mx-auto relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="hidden md:flex items-center gap-4 mb-5 md:mb-8 relative z-10">
        <div className="p-3.5 bg-brand-blue/10 rounded-2xl text-brand-blue shrink-0">
          <Calculator size={28} />
        </div>
        <div>
          <h3 className="font-bold text-brand-dark text-lg">{t.title}</h3>
          <p className="text-gray-400 text-sm">{t.subtitle}</p>
        </div>
      </div>

      {/* Mobilni napredak kroz korake */}
      <div className="md:hidden relative z-10 mb-5">
        <div className="flex gap-1.5 mb-3">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? 'bg-brand-blue' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {String(t.stepOf || '').replace('{step}', String(step)).replace('{total}', String(TOTAL_STEPS))}
        </p>
        <p className="text-lg font-bold text-brand-dark mt-1">{stepTitles[step - 1]}</p>
      </div>

      <div className={`space-y-6 relative z-10 md:min-h-0 ${step < TOTAL_STEPS ? 'min-h-[260px]' : ''}`}>

        {/* Korak 1: proizvodi */}
        <div className={onlyOnStep(1)}>
          <label className="hidden md:block text-sm font-bold text-gray-600 mb-3">
            {t.productsLabel}
          </label>
          <div className="flex flex-col md:flex-row gap-2 md:flex-wrap">
            {products.map(({ key, label }) => {
              const isActive = selected.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleProduct(key)}
                  className={`flex items-center gap-3 md:gap-2 flex-1 min-w-[90px] px-4 py-4 md:px-3 md:py-2.5 rounded-xl text-base md:text-sm font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white border-brand-blue md:bg-gray-600 md:border-gray-600 shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${
                    isActive ? 'bg-white border-white' : 'border-gray-300'
                  }`}>
                    {isActive && <Check size={10} className="text-brand-blue md:text-gray-600" strokeWidth={3} />}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Korak 2: potrošnja i cijene */}
        <div className={`space-y-4 md:space-y-6 ${onlyOnStep(2)}`}>
        {/* Cigarettes inputs */}
        {selected.has('cigarettes') && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-3">
              {t.productCigarettes}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.cigsPerDayLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={cigsPerDay} onChange={setCigsPerDay} min={1} max={100} unit={t.cigsUnit} />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.packPriceLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={pricePerPack} onChange={setPricePerPack} min={1} max={50} unit={t.currencyUnit} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Snus inputs */}
        {selected.has('snus') && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-3">
              {t.productSnus}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.snusPerDayLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={snusPerDay} onChange={setSnusPerDay} min={1} max={100} unit={t.cigsUnit} />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.snusCanPriceLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={pricePerSnusCan} onChange={setPricePerSnusCan} min={1} max={50} unit={t.currencyUnit} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vape inputs */}
        {selected.has('vape') && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-3">
              {t.productVape}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.vapePodsPerWeekLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={vapePodPerWeek} onChange={setVapePodPerWeek} min={1} max={30} unit={t.cigsUnit} />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  {t.vapePodPriceLabel}
                </label>
                <div className="mt-auto">
                  <StepInput value={vapePodPrice} onChange={setVapePodPrice} min={1} max={100} unit={t.currencyUnit} />
                </div>
              </div>
            </div>
          </div>
        )}

        </div>

        {/* Korak 3: period */}
        <div className={onlyOnStep(3)}>
          <div className="flex justify-between items-center mb-3">
            <label className="hidden md:block text-sm font-bold text-gray-600">{t.periodLabel}</label>
            <span className="text-2xl md:text-sm font-bold text-brand-blue md:bg-brand-blue/10 md:px-3 md:py-1 rounded-full mx-auto md:mx-0 my-4 md:my-0">
              {years} {t.yearsSuffix}
            </span>
          </div>
          <input
            type="range" min="1" max="20" value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-blue"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
            <span>1</span><span>10</span><span>20</span>
          </div>
        </div>
      </div>

      {/* Korak 4: rezultat */}
      <div className={onlyOnStep(4)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-0 md:mt-8 mb-4 md:mb-6 relative z-10">
        <div className="bg-brand-blue text-white rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full transition-transform group-hover:scale-150 duration-500" />
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <DollarSign size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">{t.financialSavings}</span>
          </div>
          <p className="text-3xl font-serif font-bold leading-tight">{calculateSavings()}</p>
        </div>

        <div className="bg-white border border-gray-100 text-brand-blue rounded-2xl p-6 relative overflow-hidden group shadow-sm">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-blue/5 rounded-full transition-transform group-hover:scale-150 duration-500" />
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-brand-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue opacity-80">{t.timeGained}</span>
          </div>
          <p className="text-2xl md:text-3xl font-serif font-bold leading-tight text-brand-dark">
            +{calculateTimeGained()} {t.daysSuffix}
          </p>
        </div>
      </div>

      {/* CravingMode promo button */}
      <div className="relative z-10 border-t border-gray-100 pt-4 md:pt-6 mt-2">
        <button
          onClick={openCravingMode}
          className="w-full flex items-center justify-between gap-4 bg-brand-blue text-white rounded-2xl px-6 py-4 hover:bg-brand-blue/90 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
              <Gamepad2 size={20} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-white">
                {t.cravingPromoTitle}
              </p>
              <p className="text-white/60 text-xs mt-0.5">
                {t.cravingPromoSubtitle}
              </p>
            </div>
          </div>
          <div className="shrink-0 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"/>
            </svg>
          </div>
        </button>
      </div>
      </div>

      {/* Mobilna navigacija kroz korake */}
      <div className="md:hidden relative z-10 flex gap-3 mt-6">
        {step > 1 && step < TOTAL_STEPS && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold shrink-0"
          >
            <ArrowLeft size={18} /> {t.backButton}
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-brand-blue text-white font-bold whitespace-nowrap active:scale-[0.98] transition-transform"
          >
            {step === TOTAL_STEPS - 1 ? t.showResultButton : t.nextButton} <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-brand-blue/30 text-brand-blue font-bold whitespace-nowrap"
          >
            <RotateCcw size={16} /> {t.restartButton}
          </button>
        )}
      </div>
    </div>
  );
};