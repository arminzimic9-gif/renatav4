import React, { useState, useEffect, useRef } from 'react';
import { X, Wind, Zap, Eye, Check, Wallet, Leaf, Hourglass, TrendingUp, Flame, CigaretteOff, RotateCcw, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';

type TaskType = 'physical' | 'breathing' | 'mental';

interface Task {
  id: number;
  type?: TaskType;
  text: string;
  subtext?: string;
  cta?: {
    text: string;
    button: string;
  };
}

// Rezervne vrijednosti ako u prijevodima (admin) nema ispravnog pozitivnog broja.
const DEFAULT_SAVINGS_PER_CIG_BAM = 0.30;
const DEFAULT_CO2_SAVED_GRAMS = 14;
const DEFAULT_LIFE_GAINED_MINS = 11;
const DEFAULT_TIMER_SECONDS = 300;
const positiveNum = (v: unknown, fallback: number) => (typeof v === 'number' && isFinite(v) && v > 0 ? v : fallback);

type Screen = 'closed' | 'onboarding-notice' | 'onboarding-name' | 'game' | 'finished';

export const CravingMode: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('closed');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { lang, dict } = useLanguage();
  const { openContactModal, setCravingModeOpen, isMobileMenuOpen, isContactModalOpen, isLocalPopupOpen } = useUI();
  const tc = dict[lang].cravingMode;
  const SAVINGS_PER_CIG_BAM = positiveNum(tc.savingsPerCigarette, DEFAULT_SAVINGS_PER_CIG_BAM);
  const CO2_SAVED_GRAMS = positiveNum(tc.co2SavedGramsPerCigarette, DEFAULT_CO2_SAVED_GRAMS);
  const LIFE_GAINED_MINS = positiveNum(tc.lifeGainedMinutesPerCigarette, DEFAULT_LIFE_GAINED_MINS);
  const TIMER_SECONDS = Math.round(positiveNum(tc.timerSeconds, DEFAULT_TIMER_SECONDS));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startClickRef = React.useRef<() => void>(() => {});

  useEffect(() => {
    const saved = localStorage.getItem('habitplus_craving_streak');
    if (saved) setStreak(parseInt(saved));
    const savedName = localStorage.getItem('habitplus_user_name');
    if (savedName) setUserName(savedName);

    // Preko ref-a uvijek pozivamo najnoviju verziju (s vrijednostima iz admina, koje stižu kasnije).
    const handleOpen = () => startClickRef.current();
    window.addEventListener('open-craving-mode', handleOpen);
    return () => window.removeEventListener('open-craving-mode', handleOpen);
  }, []);

  const handleStartClick = () => {
    const hasSeenNotice = localStorage.getItem('habitplus_craving_seen');
    const savedName = localStorage.getItem('habitplus_user_name');
    document.body.style.overflow = 'hidden';
    if (!hasSeenNotice) {
      setScreen('onboarding-notice');
    } else if (!savedName) {
      setScreen('onboarding-name');
    } else {
      setUserName(savedName);
      beginGame();
    }
  };
  startClickRef.current = handleStartClick;

  const acceptNotice = () => {
    localStorage.setItem('habitplus_craving_seen', '1');
    setScreen('onboarding-name');
  };

  const submitName = () => {
    const name = nameInput.trim() || tc.anonymousName;
    localStorage.setItem('habitplus_user_name', name);
    setUserName(name);
    beginGame();
  };

  const beginGame = () => {
    const cravingTasks = tc.tasks;
    const randomTask = cravingTasks[Math.floor(Math.random() * cravingTasks.length)];
    setActiveTask(randomTask as Task);
    setTimeLeft(TIMER_SECONDS);
    setScreen('game');

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
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('habitplus_craving_streak', newStreak.toString());
    setScreen('finished');
  };

  const closeSession = () => {
    setScreen('closed');
    document.body.style.overflow = 'auto';
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetAll = () => {
    localStorage.removeItem('habitplus_craving_streak');
    localStorage.removeItem('habitplus_user_name');
    localStorage.removeItem('habitplus_craving_seen');
    setStreak(0);
    setUserName('');
    setNameInput('');
    closeSession();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isOpen = screen !== 'closed';

  useEffect(() => {
    if (setCravingModeOpen) {
      setCravingModeOpen(isOpen);
    }
  }, [isOpen, setCravingModeOpen]);

  return (
    <>
      {/* FLOATING ACTION BUTTON */}
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] flex items-center group transition-opacity duration-300 ${isMobileMenuOpen || isContactModalOpen || isLocalPopupOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="mr-3 bg-white text-brand-blue px-4 py-2 rounded-xl shadow-xl opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-medium text-xs md:text-sm max-w-[180px] md:max-w-[220px] text-right">
          {tc.triggerLabel}
        </div>
        <button
          onClick={handleStartClick}
          className={`w-12 h-12 md:w-16 md:h-16 bg-white text-red-500 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative overflow-hidden ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          aria-label="Craving Mode"
        >
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CigaretteOff size={22} className="md:size-25 text-red-500" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-full border-2 border-red-500/10 animate-ping opacity-30"></div>
        </button>
      </div>

      {/* FULLSCREEN OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center overflow-y-auto overscroll-contain px-6 pt-20 pb-10 sm:p-6 animate-fade-in-up">
          {/* Close + Reset row */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-50">
            <button
              onClick={resetAll}
              title={tc.resetTitle}
              className="flex items-center gap-2 text-white/30 hover:text-red-400 transition-colors text-xs font-medium px-3 py-2 rounded-xl hover:bg-white/5"
            >
              <RotateCcw size={14} />
              {tc.resetLabel}
            </button>
            <button
              onClick={closeSession}
              className="text-white/30 hover:text-white transition-colors p-2"
            >
              <X size={32} />
            </button>
          </div>

          <div className="max-w-lg w-full text-center relative my-auto">

            {/* ── ONBOARDING: NOTICE ── */}
            {screen === 'onboarding-notice' && (
              <div className="animate-fade-in-up space-y-6">
                <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldCheck size={32} className="text-brand-teal" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">
                  {tc.noticeTitle}
                </h2>
                <p className="text-white/60 leading-relaxed text-base max-w-sm mx-auto">
                  {tc.noticeText}
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
                  {(Array.isArray(tc.noticeItems) ? tc.noticeItems : []).map((item: string, i: number) => (
                    <p key={i} className="text-white/50 text-sm">{item}</p>
                  ))}
                </div>
                <button
                  onClick={acceptNotice}
                  className="w-full bg-brand-teal text-brand-dark px-8 py-4 rounded-2xl font-bold text-base hover:scale-[1.02] transition-all"
                >
                  {tc.noticeAccept}
                </button>
              </div>
            )}

            {/* ── ONBOARDING: NAME ── */}
            {screen === 'onboarding-name' && (
              <div className="animate-fade-in-up space-y-6">
                <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto">
                  <User size={32} className="text-brand-teal" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">
                  {tc.nameTitle}
                </h2>
                <p className="text-white/50 text-sm">
                  {tc.nameSubtitle}
                </p>
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitName()}
                  placeholder={tc.namePlaceholder}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-lg placeholder-white/30 focus:outline-none focus:border-brand-teal text-center"
                />
                <button
                  onClick={submitName}
                  className="w-full bg-brand-teal text-brand-dark px-8 py-4 rounded-2xl font-bold text-base hover:scale-[1.02] transition-all"
                >
                  {tc.nameStart}
                </button>
              </div>
            )}

            {/* ── GAME ── */}
            {screen === 'game' && (
              <>
                {/* User greeting */}
                {userName && (
                  <p className="text-white/30 text-xs font-medium tracking-[0.2em] uppercase mb-4">
                    {String(tc.greeting).split('{name}').join(userName)}
                  </p>
                )}
                <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase mb-6 sm:mb-12 animate-pulse">
                  {tc.triggerLabel}
                </p>

                {/* TIMER */}
                <div className="mb-8 sm:mb-16 relative">
                  <h1 className="text-7xl sm:text-[6rem] leading-none font-serif font-medium text-white tabular-nums tracking-tighter">
                    {formatTime(timeLeft)}
                  </h1>
                  <p className="text-white/30 text-sm mt-2">{tc.minutesLeft}</p>
                </div>

                {/* TASK CARD */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm animate-float">
                  <div className="flex justify-center mb-6 text-brand-teal">
                    {activeTask?.type === 'breathing' && <Wind size={40} className="animate-pulse-slow" />}
                    {activeTask?.type === 'physical' && <Zap size={40} />}
                    {activeTask?.type === 'mental' && <Eye size={40} />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{activeTask?.text}</h2>
                  <p className="text-white/60 text-lg leading-relaxed">{activeTask?.subtext}</p>

                  {activeTask?.type === 'breathing' && (
                    <div className="mt-8 flex justify-center">
                      <div className="w-24 h-24 rounded-full border-4 border-brand-teal/30 flex items-center justify-center relative">
                        <div className="w-full h-full bg-brand-teal/20 rounded-full animate-[ping_4s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                  )}

                  {activeTask?.cta && (
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                      <p className="text-white/80 text-sm mb-4 leading-relaxed italic">"{activeTask.cta.text}"</p>
                      <button
                        onClick={() => { closeSession(); openContactModal(); }}
                        className="bg-brand-teal text-brand-dark px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                      >
                        {activeTask.cta.button}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 sm:mt-12 text-white/30 text-sm">{tc.feelingMessage}</div>
                <button
                  onClick={finishSession}
                  className="mt-8 text-white/50 underline text-xs hover:text-white transition-colors"
                >
                  {tc.exitEarly}
                </button>
              </>
            )}

            {/* ── FINISHED ── */}
            {screen === 'finished' && (
              <div className="animate-fade-in-up w-full">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-brand-dark">
                    <Check size={48} className="text-white" />
                  </div>
                </div>

                {userName && (
                  <p className="text-brand-teal font-bold mb-2">{String(tc.victoryGreeting).split('{name}').join(userName)}</p>
                )}
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{tc.victoryTitle}</h2>
                <p className="text-white/60 text-lg mb-8 sm:mb-10">{tc.victorySubtitle}</p>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame size={80} className="text-orange-500" />
                  </div>
                  <div className="text-left relative z-10">
                    <p className="text-orange-400 font-bold uppercase tracking-wider text-xs mb-1 flex items-center gap-2">
                      <Flame size={14} /> {tc.streakLabel}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white tracking-tighter">{streak}</span>
                      <span className="text-white/40 font-medium">{tc.streakSub}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8 sm:mb-10">
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2"><Wallet size={16} /></div>
                    <span className="text-base sm:text-lg font-bold text-white">{(streak * SAVINGS_PER_CIG_BAM).toFixed(2)} <span className="text-xs font-normal text-white/50">{tc.savedUnit}</span></span>
                    <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide mt-1">{tc.stats.saved}</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-2"><Hourglass size={16} /></div>
                    <span className="text-base sm:text-lg font-bold text-white">{streak * LIFE_GAINED_MINS} <span className="text-xs font-normal text-white/50">{tc.gainedUnit}</span></span>
                    <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide mt-1">{tc.stats.gained}</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2"><Leaf size={16} /></div>
                    <span className="text-base sm:text-lg font-bold text-white">{streak * CO2_SAVED_GRAMS} <span className="text-xs font-normal text-white/50">{tc.co2Unit}</span></span>
                    <span className="text-[11px] sm:text-xs text-white/60 uppercase tracking-wide mt-1">{tc.stats.co2}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-brand-blue to-brand-teal p-1 rounded-2xl mb-8">
                  <div className="bg-brand-dark/40 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-white font-medium">
                      <TrendingUp size={18} className="text-green-400" />
                      <span>{tc.affirmation}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeSession}
                  className="w-full bg-white text-brand-dark px-8 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] hover:bg-gray-100 transition-all shadow-xl shadow-white/10"
                >
                  {tc.closeLabel}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};