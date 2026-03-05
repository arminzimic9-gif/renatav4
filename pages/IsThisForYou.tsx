import React from 'react';
import { Page } from '../App';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { User, Briefcase, TrendingUp, Building2, Shield, Heart, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Props {
    onNavigate: (page: Page) => void;
}

export const IsThisForYou: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white overflow-x-hidden">
            <Header activePage="is-this-for-you" onNavigate={onNavigate} />

            {/* Hero Section */}
            <section className="bg-brand-blue text-white relative overflow-hidden flex items-center justify-center pt-32 pb-48 md:pt-48 md:pb-64" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
                {/* Background photo */}
                <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{ backgroundImage: 'url(/za-koga-bg.jpg)', backgroundPosition: 'center 30%' }}
                />
                {/* Blue overlay at 90% opacity */}
                <div className="absolute inset-0 bg-brand-blue opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-6">
                        Za koga je HabitPlus?
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
                        Naš program je prilagođen specifičnim potrebama različitih profila. Pronađite svoju kategoriju ispod.
                    </p>
                    <button
                        onClick={() => window.open('https://calendly.com', '_blank')}
                        className="bg-white hover:bg-gray-50 text-brand-blue px-8 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 transition-colors text-[15px]"
                    >
                        Zakaži Sastanak <ArrowRight size={18} />
                    </button>
                </div>
            </section>

            {/* Personas Grid - Separate White Section */}
            <section className="py-16 bg-white relative z-20">
                <style>{`
                    .flip-card { perspective: 1000px; }
                    .flip-card-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.7s cubic-bezier(0.4,0.2,0.2,1);
                        transform-style: preserve-3d;
                    }
                    .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
                    .flip-card-front, .flip-card-back {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        backface-visibility: hidden;
                        -webkit-backface-visibility: hidden;
                        border-radius: 1.5rem;
                    }
                    .flip-card-back { transform: rotateY(180deg); }
                    @keyframes fillBar {
                        from { width: 0%; }
                        to { width: var(--bar-width); }
                    }
                    .flip-card:hover .bar-fill {
                        animation: fillBar 1s ease-out 0.3s forwards;
                    }
                    .bar-fill { width: 0%; }
                `}</style>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{ gridAutoRows: '280px' }}>

                        {/* Fizička lica */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <User size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Fizička lica</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Tražiš diskretnu i kvalitetnu podršku od stručnjakinje s 18 godina iskustva u odvikavanju od pušenja i promjeni navika.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Uspješnost programa</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Fizička lica</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Prestanak pušenja', val: 87 }, { label: 'Dugoročna apstinencija', val: 73 }, { label: 'Zadovoljstvo programom', val: 96 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Interno mjerenje zadovoljstva klijenata</p>
                                </div>
                            </div>
                        </div>

                        {/* Stručnjaci */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <Briefcase size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Stručnjaci</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Tražiš fleksibilnu i diskretnu podršku koja se uklapa u tvoj poslovni svijet i dinamičan raspored.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Profil klijenta</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Stručnjaci</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Online sesije', val: 80 }, { label: 'Fleksibilni termini', val: 92 }, { label: 'Uspješan povratak', val: 78 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Podaci na osnovu programa 2024/25</p>
                                </div>
                            </div>
                        </div>

                        {/* Vlasnici */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <TrendingUp size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Vlasnici</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Treba ti pristup koji se uklapa u tvoj tempo rada i razumije stres koji nosiš kao vlasnik firme.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Uticaj na posao</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Vlasnici</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Veći fokus na poslu', val: 84 }, { label: 'Manje stresa', val: 70 }, { label: 'Bolje odlučivanje', val: 76 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Samoprocjena klijenata nakon 3 mjeseca</p>
                                </div>
                            </div>
                        </div>

                        {/* Organizacije */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <Building2 size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Organizacije</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Uposlenicima želiš ponuditi profesionalnu podršku. To je investicija u produktivnost, povjerenje i lojalnost.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">ROI investicije</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Organizacije</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Manje bolovanja', val: 65 }, { label: 'Veća produktivnost', val: 82 }, { label: 'Lojalnost uposlenika', val: 88 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Istraživanje WHO 2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Prestao/la si */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <Shield size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Prestao/la si, ali treba podrška</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Prestao si pušiti, ali borba nije gotova. Vraćaju se stres i stare navike — treba ti struktura.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Prevencija relapsa</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Podrška u apstinenciji</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Bez relapsa (6mj)', val: 79 }, { label: 'Kontrola stresa', val: 85 }, { label: 'Novi identitet nepušača', val: 91 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Praćenje klijenata 6 mjeseci post-program</p>
                                </div>
                            </div>
                        </div>

                        {/* Želiš biti nepušač zauvijek */}
                        <div className="flip-card h-full">
                            <div className="flip-card-inner">
                                <div className="flip-card-front bg-white border border-gray-100 shadow-xl p-8 flex flex-col">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <Heart size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-dark mb-4">Želiš biti nepušač zauvijek</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">Žliš postati osoba koja ne puši. Treba ti podrška u izgradnji novog identiteta i trajne promjene.</p>
                                    <p className="text-xs text-brand-blue font-semibold mt-4 opacity-60">Prijeđi mišem →</p>
                                </div>
                                <div className="flip-card-back bg-brand-blue p-8 flex flex-col justify-between">
                                    <div>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Dugoročni rezultati</p>
                                        <h3 className="text-white text-2xl font-bold mb-6">Trajnij nepušač</h3>
                                        <div className="space-y-4">
                                            {[{ label: 'Trajni prestanak (1g)', val: 82 }, { label: 'Pozitivna slika o sebi', val: 94 }, { label: 'Preporučuju program', val: 98 }].map((s, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-white/80 text-xs mb-1">
                                                        <span>{s.label}</span><span>{s.val}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-2">
                                                        <div className="bar-fill h-2 rounded-full bg-white" style={{ ['--bar-width' as string]: `${s.val}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-white/50 text-xs mt-4">Anketa alumni klijenata 2024</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Hook - Blue Section */}
            <section className="py-24 bg-brand-blue relative overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="w-full max-w-3xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                        Prepoznaješ sebe u ovome?
                    </h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Voljela bih da radimo zajedno i da ti pružim podršku. Prije nego se prijaviš, pročitaj ovo:
                    </p>
                </div>
            </section>

            {/* Uslovi za rad - Comparison */}
            <section className="py-24 bg-white relative">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full mx-auto mb-16">
                        {/* Ne mogu ti pomoći... */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 relative overflow-hidden shadow-sm">
                            <h3 className="text-[22px] font-bold text-slate-800 mb-10 relative z-10">Ne mogu ti pomoći...</h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex gap-4 items-center">
                                    <XCircle className="text-red-400 opacity-80 shrink-0" strokeWidth={1.5} size={20} />
                                    <span className="text-gray-500 text-[15px] font-medium leading-snug">Ako ne učestvuješ aktivno</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <XCircle className="text-red-400 opacity-80 shrink-0" strokeWidth={1.5} size={20} />
                                    <span className="text-gray-500 text-[15px] font-medium leading-snug">Ako ne dolaziš redovno na sesije</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <XCircle className="text-red-400 opacity-80 shrink-0" strokeWidth={1.5} size={20} />
                                    <span className="text-gray-500 text-[15px] font-medium leading-snug">Ako ne primijeniš vježbe i alate</span>
                                </li>
                            </ul>
                        </div>

                        {/* Mogu ti pomoći... */}
                        <div className="bg-[#f8fafc] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                            <h3 className="text-[22px] font-bold text-[#5493ce] mb-10 relative z-10">Mogu ti pomoći...</h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex gap-4 items-start">
                                    <CheckCircle className="text-[#5493ce] shrink-0 mt-0.5 opacity-90" strokeWidth={1.5} size={20} />
                                    <span className="text-slate-700 text-[15px] font-bold leading-snug">Ako si spreman/na za promjenu i rad na<br />sebi</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <CheckCircle className="text-[#5493ce] shrink-0 opacity-90" strokeWidth={1.5} size={20} />
                                    <span className="text-slate-700 text-[15px] font-bold leading-snug">Ako si voljan/na uložiti vrijeme i trud</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <CheckCircle className="text-[#5493ce] shrink-0 opacity-90" strokeWidth={1.5} size={20} />
                                    <span className="text-slate-700 text-[15px] font-bold leading-snug">Ako si spreman/na na iskrenost i izazove</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => window.open('https://calendly.com', '_blank')}
                            className="bg-[#5493ce] hover:bg-[#4382bd] text-white px-8 py-3.5 rounded-full font-medium flex items-center gap-2 transition-colors text-[15px]"
                        >
                            Zakaži Besplatan Poziv <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
