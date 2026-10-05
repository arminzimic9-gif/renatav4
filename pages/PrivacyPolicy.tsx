import React from 'react';
import { Footer } from '../components/Footer';
import { Shield, Mail, ArrowLeft, Info } from 'lucide-react';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';
import { useLanguage } from '../context/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

interface PrivacyPolicyProps {
    onNavigate: (page: Page, lang: Language) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    const { lang, dict } = useLanguage();
    const navigate = useNavigate();
    const t = dict[lang].privacyPolicy;
    const [headerRef, headerVisible] = useReveal();
    const [contentRef, contentVisible] = useReveal();

    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white">
            {/* CLEAN BACK BUTTON - TOP LEFT */}
            <div className="max-w-4xl mx-auto w-full px-6 pt-28 md:pt-32">
                <button 
                    onClick={() => navigate(ROUTES[lang]['home'])}
                    className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors group px-4 py-2 rounded-full hover:bg-brand-stone/30 w-fit"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">{t.backButton}</span>
                </button>
            </div>

            {/* PLAIN TEXT CONTENT - CENTERED & STRUCTURED */}
            <main className="py-16 md:py-24 flex-1">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-stone/50 rounded-2xl text-brand-blue mb-10">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-10 md:mb-20 leading-tight">
                        {t.title}
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto px-6">
                    <div className="max-w-none text-gray-600 space-y-10 md:space-y-16">
                        <p className="text-lg md:text-xl leading-relaxed text-left md:text-center text-gray-500 font-medium">
                            {t.intro}
                        </p>

                        <div className="space-y-12 md:space-y-20 pt-10">
                            {t.sections.map((section, idx) => {
                                // Dynamic icons based on index/content
                                const icons = [Shield, Mail, Shield, Shield, Mail];
                                const SectionIcon = icons[idx] || Shield;

                                return (
                                    <div key={idx} className="space-y-6 text-left">
                                        <div className="flex flex-row items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-stone/30 flex items-center justify-center text-brand-blue shrink-0">
                                                <SectionIcon size={20} />
                                            </div>
                                            <h2 className="text-2xl font-serif font-bold text-brand-dark">
                                                {section.title}
                                            </h2>
                                        </div>
                                        <p className="leading-relaxed text-base md:text-lg">
                                            {section.content}
                                        </p>
                                        {section.items && (
                                            <ul className="space-y-3 inline-block text-left mx-0">
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2.5 shrink-0"></div>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.footer && (
                                            <p className="pt-4 text-sm font-medium text-gray-400 uppercase tracking-wide">
                                                {section.footer}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* NOTE SECTION - STYLISH BOX */}
                        <div className="pt-10 mt-10 md:pt-20 md:mt-20 border-t border-gray-100">
                            <div className="bg-brand-stone/20 rounded-[2.5rem] p-8 md:p-12 border border-brand-stone/40">
                                <div className="flex flex-col items-center text-center mb-10">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-blue shadow-sm mb-4">
                                        <Info size={24} />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-brand-dark">
                                        {t.note.title}
                                    </h2>
                                </div>
                                <div className="space-y-6 text-gray-600 leading-relaxed text-base md:text-lg text-left">
                                    {t.note.items.map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start justify-start">
                                            <div className="w-1 h-1 rounded-full bg-brand-blue mt-3 opacity-40 shrink-0 hidden md:block" />
                                            <p>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
