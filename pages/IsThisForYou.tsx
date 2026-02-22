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
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white">
            <Header activePage="is-this-for-you" onNavigate={onNavigate} />

            {/* Hero Section */}
            <section className="bg-brand-blue text-white relative overflow-hidden -mx-6 md:-mx-8 w-screen flex items-center justify-center pt-32 pb-48 md:pt-48 md:pb-64">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center mt-10">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-6">
                        Za koga je HabitPlus?
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
                        Naš program je prilagođen specifičnim potrebama različitih profila. Pronađite svoju kategoriju ispod.
                    </p>
                </div>
            </section>

            {/* Personas Grid - Overlapping the Hero */}
            <section className="pb-24 -mt-24 md:-mt-32 relative z-20">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Fizička lica */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <User size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Fizička lica</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tražiš diskretnu i kvalitetnu podršku od stručnjakinje s 18 godina iskustva u odvikavanju od pušenja i promjeni navika.
                            </p>
                        </div>

                        {/* Stručnjaci */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <Briefcase size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Stručnjaci</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tražiš fleksibilnu i diskretnu podršku koja se uklapa u tvoj poslovni svijet.
                            </p>
                        </div>

                        {/* Vlasnici */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Vlasnici</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Treba ti praktičan pristup koji se uklapa u tvoj tempo rada i razumije stres koji nosiš kao vlasnik.
                            </p>
                        </div>

                        {/* Organizacije */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <Building2 size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Organizacije</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Uposlenicima želiš ponuditi profesionalnu podršku za prestanak pušenja. To je investicija u produktivnost, povjerenje i dugotrajnu lojalnost.
                            </p>
                        </div>

                        {/* Prestao/la si, ali ti treba podrška */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <Shield size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Prestao/la si, ali ti treba podrška</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Prestao si pušiti, ali borba nije gotova, jer se vraćaju stres i stare navike. Treba ti struktura i podrška, ne samo snaga volje.
                            </p>
                        </div>

                        {/* Želiš biti nepušač zauvijek */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                <Heart size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-4">Želiš biti nepušač zauvijek</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Želiš biti nepušač zauvijek. Ne samo prestati, već postati osoba koja ne puši. Treba ti podrška u izgradnji novog identiteta.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Uslovi za rad - Comparison */}
            <section className="py-24 bg-white relative">
                <div className="w-full max-w-[1440px] mx-auto px-6 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                            Prepoznaješ sebe u ovome?
                        </h2>
                        <p className="text-xl text-gray-500 opacity-90 max-w-2xl mx-auto mb-8">
                            Voljela bih da radimo zajedno i da ti pružim podršku. Prije nego se prijaviš, pročitaj ovo:
                        </p>
                    </div>

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
