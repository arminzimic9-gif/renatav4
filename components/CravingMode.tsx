import React, { useState, useEffect, useRef } from 'react';
import { X, Wind, Zap, Eye, Check, Wallet, Leaf, Hourglass, TrendingUp, Flame } from 'lucide-react';

type TaskType = 'physical' | 'breathing' | 'mental';

interface Task {
  id: number;
  type: TaskType;
  text: string;
  subtext?: string;
}

const TASKS: Task[] = [
  { id: 1, type: 'physical', text: 'Uradi 15 čučnjeva.', subtext: 'Fokusiraj se na svaki pokret. Osjeti mišiće.' },
  { id: 2, type: 'physical', text: 'Popij veliku čašu hladne vode.', subtext: 'Polako. Osjeti hladnoću u grlu.' },
  { id: 3, type: 'breathing', text: 'Tehnika 4-7-8', subtext: 'Udahni (4s) - Zadrži (7s) - Izdahni (8s)' },
  { id: 4, type: 'mental', text: 'Pronađi 5 plavih predmeta.', subtext: 'Pogledaj oko sebe. Imenuj ih naglas.' },
  { id: 5, type: 'mental', text: 'Broji unazad od 100.', subtext: 'Oduzimaj po 7 (100, 93, 86...)' },
  { id: 6, type: 'physical', text: 'Istezanje vrata.', subtext: 'Polako nagni glavu lijevo, pa desno. Zadrži.' },
];

// Constants for calculations (approximate values)
const SAVINGS_PER_CIG_BAM = 0.30; // Based on ~6KM pack
const CO2_SAVED_GRAMS = 14;
const LIFE_GAINED_MINS = 11;

export const CravingMode: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load streak from local storage
    const saved = localStorage.getItem('habitplus_craving_streak');
    if (saved) setStreak(parseInt(saved));
  }, []);

  const startSession = () => {
    const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    setActiveTask(randomTask);
    setTimeLeft(300);
    setIsFinished(false);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('habitplus_craving_streak', newStreak.toString());
  };

  const closeSession = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* TRIGGER BUTTON (Sticky Bottom Left) */}
      <button
        onClick={startSession}
        className={`
          fixed bottom-6 left-6 z-50 
          bg-brand-blueDark text-white 
          font-bold text-xs tracking-widest uppercase
          px-4 py-2.5 rounded-full 
          shadow-lg shadow-brand-blue/50
          hover:scale-105 active:scale-95
          hover:shadow-[0_0_25px_rgba(43,112,228,0.6)]
          transition-all duration-300
          flex items-center gap-2
          group
        `}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        Puši mi se
      </button>

      {/* FULLSCREEN OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center p-6 animate-fade-in-up">
          {/* Close Button */}
          <button
            onClick={closeSession}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors p-2 z-50"
          >
            <X size={32} />
          </button>

          <div className="max-w-lg w-full text-center relative">

            {!isFinished ? (
              <>
                {/* HEADER */}
                <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase mb-12 animate-pulse">
                  Nalet Žudnje
                </p>

                {/* TIMER */}
                <div className="mb-16 relative">
                  <h1 className="text-[6rem] leading-none font-serif font-medium text-white tabular-nums tracking-tighter">
                    {formatTime(timeLeft)}
                  </h1>
                  <p className="text-white/30 text-sm mt-2">minuta do prolaska</p>
                </div>

                {/* TASK CARD */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm animate-float">
                  <div className="flex justify-center mb-6 text-brand-teal">
                    {activeTask?.type === 'breathing' && <Wind size={40} className="animate-pulse-slow" />}
                    {activeTask?.type === 'physical' && <Zap size={40} />}
                    {activeTask?.type === 'mental' && <Eye size={40} />}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {activeTask?.text}
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {activeTask?.subtext}
                  </p>

                  {/* Breathing Visualizer (Only if type is breathing) */}
                  {activeTask?.type === 'breathing' && (
                    <div className="mt-8 flex justify-center">
                      <div className="w-24 h-24 rounded-full border-4 border-brand-teal/30 flex items-center justify-center relative">
                        <div className="w-full h-full bg-brand-teal/20 rounded-full animate-[ping_4s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER MESSAGE */}
                <div className="mt-12 text-white/30 text-sm">
                  Ovo je samo osjećaj. Proći će.
                </div>

                <button
                  onClick={finishSession}
                  className="mt-8 text-white/50 underline text-xs hover:text-white transition-colors"
                >
                  Prošlo me je, izađi ranije
                </button>
              </>
            ) : (
              /* SUCCESS STATE - GAMIFIED */
              <div className="animate-fade-in-up w-full">

                {/* Hero Success Icon */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-brand-dark">
                    <Check size={48} className="text-white" />
                  </div>
                  {/* Confetti particles could go here */}
                </div>

                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">Pobjeda!</h2>
                <p className="text-white/60 text-lg mb-10">Preuzeo/la si kontrolu. Ponosi se sobom.</p>

                {/* Main Streak Counter */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame size={80} className="text-orange-500" />
                  </div>
                  <div className="text-left relative z-10">
                    <p className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-2">
                      <Flame size={14} /> Tvoj Pobjednički Niz
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white tracking-tighter">{streak}</span>
                      <span className="text-white/40 font-medium">izbjegnutih cigareta</span>
                    </div>
                  </div>
                </div>

                {/* Impact Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-10">
                  {/* Money Saved */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                      <Wallet size={16} />
                    </div>
                    <span className="text-lg font-bold text-white">{(streak * SAVINGS_PER_CIG_BAM).toFixed(2)} <span className="text-xs font-normal text-white/50">KM</span></span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wide mt-1">Ušteđeno</span>
                  </div>

                  {/* Life Gained */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-2">
                      <Hourglass size={16} />
                    </div>
                    <span className="text-lg font-bold text-white">{(streak * LIFE_GAINED_MINS)} <span className="text-xs font-normal text-white/50">min</span></span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wide mt-1">Dobijeno</span>
                  </div>

                  {/* CO2 Reduced */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                      <Leaf size={16} />
                    </div>
                    <span className="text-lg font-bold text-white">{(streak * CO2_SAVED_GRAMS)} <span className="text-xs font-normal text-white/50">g</span></span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wide mt-1">Manje CO2</span>
                  </div>
                </div>

                {/* Motivational Banner */}
                <div className="bg-gradient-to-r from-brand-blue to-brand-teal p-1 rounded-2xl mb-8">
                  <div className="bg-brand-dark/40 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-white font-medium">
                      <TrendingUp size={18} className="text-green-400" />
                      <span>Svako "NE" cigareti je "DA" životu.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={closeSession}
                    className="w-full bg-white text-brand-dark px-8 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] hover:bg-gray-100 transition-all shadow-xl shadow-white/10"
                  >
                    Nastavi dalje, šefe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};