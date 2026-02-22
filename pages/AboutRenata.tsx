import React from 'react';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { ArrowLeft, Award, BookOpen, Heart, Globe, Briefcase, Star, Quote, Mail, Calendar } from 'lucide-react';
import { Page } from '../App';

interface AboutRenataProps {
    onNavigate: (page: Page) => void;
}

export const AboutRenata: React.FC<AboutRenataProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">
            {/* 1. HERO SECTION */}
            <section className="pt-40 pb-20 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <button
                        onClick={() => onNavigate('home')}
                        className="group flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors mb-12 font-medium"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Nazad na početnu
                    </button>

                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-8 animate-fade-in-up">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-stone text-brand-dark text-xs font-bold uppercase tracking-wider">
                                Upoznajte Renatu
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-brand-dark">
                                Renata <br />
                                <span className="font-serif text-brand-blue">Lačević.</span>
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed font-light max-w-lg">
                                Stručnjakinja za promjenu navika i prestanak pušenja sa preko 18 godina međunarodnog iskustva u javnom zdravstvu i edukaciji.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-brand-stone/50 rounded-xl border border-gray-100">
                                    <Globe size={16} className="text-brand-blue" />
                                    <span className="text-sm font-bold text-brand-dark">Australija • BiH</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-brand-stone/50 rounded-xl border border-gray-100">
                                    <Award size={16} className="text-brand-teal" />
                                    <span className="text-sm font-bold text-brand-dark">18+ Godina Iskustva</span>
                                </div>
                            </div>
                        </div>

                        {/* Portrait Placeholder */}
                        <div className="lg:w-1/2 w-full">
                            <div className="aspect-[3/4] bg-brand-stone rounded-[3rem] border border-gray-100 relative overflow-hidden shadow-2xl animate-float">
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent"></div>
                                {/* Placeholder for real image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center opacity-20">
                                        <Heart size={80} className="mx-auto mb-4 text-brand-blue" />
                                        <p className="font-serif text-2xl">Portret uskoro</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. DETAILED STORY */}
            <section className="py-24 bg-brand-cream">
                <div className="max-w-4xl mx-auto px-6 md:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-serif text-brand-dark mb-8 border-l-4 border-brand-teal pl-6">Moja Misija</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            [Ovdje će biti unesen detaljan tekst o Renatinom putu, od iskustva stečenog u Australiji do primjene tih praksi na našim prostorima. Tekst će fokusirati na humanistički pristup, razumijevanje psihologije zavisnosti i osnaživanje pojedinca.]
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <BookOpen size={20} className="text-brand-blue" />
                                    Edukacija i Specijalizacija
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Cancer Council Victoria - International Training",
                                        "Specijalizacija za odvikavanje od pušenja",
                                        "Programi prevencije hroničnih bolesti",
                                        "Pedagoški rad i metodika edukacije"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                    <Briefcase size={20} className="text-brand-teal" />
                                    Profesionalni Put
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        "Rad u Ministarstvu obrazovanja (Australija)",
                                        "Saradnja sa vodećim zdravstvenim institucijama",
                                        "Preko 250 održanih edukacija i seminara",
                                        "Osnivač HabitPlus centra u Sarajevu"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. QUOTE / VALUES */}
            <section className="py-24 md:py-32 relative overflow-hidden bg-[#0a1128] flex items-center justify-center min-h-[500px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="max-w-[760px] mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <Quote size={42} strokeWidth={2.5} className="text-[#0e7490] mb-12 opacity-80" />
                    <h2 className="text-[28px] md:text-[36px] font-sans font-medium text-gray-200 leading-[1.3] tracking-tight mb-16">
                        "Vjerujem da niko nije 'izgubljen<br className="hidden md:block" /> slučaj'. Svaka navika ima svoj ključ, a<br className="hidden md:block" /> prestanak pušenja je prvi korak ka<br className="hidden md:block" /> preuzimanju slobode."
                    </h2>
                    <div className="w-12 h-[1px] bg-[#0e7490] mb-6"></div>
                    <p className="font-bold text-[#0ea5e9] uppercase tracking-[0.2em] text-[11px]">RENATA LAČEVIĆ</p>
                </div>
            </section>

            {/* 4. MEDIA PLACEHOLDER / GALLERY */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Rad u zajednici</h2>
                        <p className="text-gray-500">Trenuci sa seminara, radionica i individualnih sesija.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-brand-stone rounded-3xl border border-gray-50 flex items-center justify-center overflow-hidden group">
                                <div className="text-center opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Calendar size={48} className="mx-auto mb-2" />
                                    <p className="text-sm font-bold">Galerija {i}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA */}
            <section className="py-24 bg-brand-cream border-t border-gray-100">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-serif text-brand-dark mb-8">Želite razgovarati sa Renatom?</h2>
                    <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                        Bilo da ste pojedinac spremni za promjenu ili organizacija koja traži edukaciju, Renata nudi stručnost i podršku prilagođenu vašim potrebama.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button size="lg" variant="primary" withArrow onClick={() => window.open('https://calendly.com', '_blank')}>
                            Zakaži termin
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => window.location.href = 'mailto:info@habitplus.ba'}>
                            Kontaktirajte me
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
