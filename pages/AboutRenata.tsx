import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { ArrowLeft, Award, BookOpen, Heart, Globe, Briefcase, Star, Quote, Mail, Calendar, Shield, Brain, Scale, Tv, Radio, FileText, ExternalLink, X, ChevronDown, GraduationCap, Building2, Target, Sparkles, Zap } from 'lucide-react';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';
import { useLanguage } from '../context/LanguageContext';
import { WordReveal } from '../components/animations/WordReveal';
import { useReveal } from '../hooks/useReveal';
import { useUI } from '../context/UIContext';

interface AboutRenataProps {
    onNavigate: (page: Page, lang: Language) => void;
}

export const AboutRenata: React.FC<AboutRenataProps> = ({ onNavigate }) => {
    const { lang, dict } = useLanguage();
    const { openContactModal } = useUI();
    const t = dict[lang].about;

    // Section reveals
    const [heroRef, heroVisible] = useReveal();
    const [storyRef, storyVisible] = useReveal();
    const [eduExpRef, eduExpVisible] = useReveal();
    const [quoteRef, quoteVisible] = useReveal();
    const [supportRef, supportVisible] = useReveal();
    const [credRef, credVisible] = useReveal();
    const [pubRef, pubVisible] = useReveal();
    const [ctaRef, ctaVisible] = useReveal();

    const [pubModalOpen, setPubModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<'tv' | 'radio' | 'articles' | null>(null);
    const [visibleImages, setVisibleImages] = useState(3);

    const galleryImages = [
        // Ovdje je zamijenjen redoslijed prve dvije slike (druga iteracija):
        { src: '/renata-about-3.jpg', alt: 'Renata Lačević' },
        { src: '/hero-2.jpg', alt: 'HabitPlus Sessions' },
        { src: '/renata-about-1.jpg', alt: 'Health Education' },
        { src: '/hero-1.jpg', alt: 'Individual Support' },
        { src: '/renata-about-2.jpg', alt: 'Workshop Facilitation' },
        { src: '/SL__8066.jpg', alt: 'HabitPlus Office' }
    ];

    const openCategory = (cat: 'tv' | 'radio' | 'articles') => {
        setSelectedCategory(cat);
        setPubModalOpen(true);
    };

    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'tv': return Tv;
            case 'radio': return Radio;
            case 'articles': return FileText;
            default: return FileText;
        }
    };
    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-brand-cream selection:bg-brand-blue selection:text-white">
            {/* 1. HERO SECTION */}
            <section className="relative lg:min-h-screen h-[100svh] flex items-center justify-center overflow-hidden w-full" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
                {/* Background photo */}
                <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{ backgroundImage: 'url(/hero-1.jpg)', backgroundPosition: 'center 30%' }}
                />
                {/* Blue overlay at 90% opacity */}
                <div className="absolute inset-0 bg-brand-blue opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                <div className={`w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center transition-all duration-1000 translate-y-12 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} ref={heroRef}>
                    <WordReveal 
                        text={t.heroTag} 
                        center
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-8 text-white"
                    />
                    <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium opacity-90">
                        {t.heroSubtitle}
                    </p>

                    <Button variant="white" size="lg" withArrow onClick={() => {
                        document.getElementById('put-i-vizija')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        {lang === 'BHS' ? 'Pročitaj moju priču' : 'Read my story'}
                    </Button>
                </div>

                {/* Scroll for More indicator */}
                <div className="absolute bottom-10 inset-x-0 mx-auto w-fit hidden lg:flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-default z-10">
                    <ChevronDown size={20} className="text-white" />
                </div>
            </section>

            {/* 1.5 CREDENTIALS RIBBON */}
            <div className="relative z-20 -mt-12 max-w-5xl mx-auto px-6">
                <div 
                    ref={credRef}
                    className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${credVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    {[
                        { icon: Brain, text: t.credentials[0], delay: '0s' },
                        { icon: Award, text: t.credentials[1], delay: '0.1s' },
                        { icon: Globe, text: t.credentials[2], delay: '0.2s' }
                    ].map((item, idx) => (
                        <div 
                            key={idx}
                            className="bg-white rounded-2xl p-8 shadow-xl shadow-brand-blue/5 border border-brand-blue/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500"
                            style={{ transitionDelay: item.delay }}
                        >
                            <div className="w-14 h-14 bg-brand-cream rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 text-brand-blue">
                                <item.icon size={28} />
                            </div>
                            <p className="font-serif font-bold text-brand-dark/80 text-lg leading-snug">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>            {/* 2. DETAILED STORY */}
            <section id="put-i-vizija" className="py-24 bg-[#fafcff] relative border-t border-brand-blue/5">
                <div className="max-w-3xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
                    <div className={`transition-all duration-1000 ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={storyRef}>
                        <WordReveal 
                            text={t.visionTitle}
                            center
                            className="text-3xl md:text-4xl font-sans font-medium text-brand-blue mb-10 tracking-tight"
                        />
                        <div className="space-y-8 text-lg text-brand-dark/80 leading-relaxed max-w-2xl">
                            <p className="font-bold text-brand-dark/80 text-xl">
                                {t.visionLead}
                            </p>
                            <p>
                                {t.visionText}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 EDUCATION & EXPERIENCE */}
            <section className="py-24 bg-white relative">
                <div className="max-w-6xl mx-auto px-6 md:px-8">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-1000 ${eduExpVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={eduExpRef}>
                        {/* Section: Edukacija */}
                        <div className="space-y-8 flex flex-col">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/20">
                                    <BookOpen size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-brand-dark/80">{t.educationTitle}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 flex-1">
                                {t.educationItems.map((item: any, i: number) => {
                                    const IconMap: { [key: string]: any } = {
                                        BookOpen, Brain, Heart, Target, GraduationCap
                                    };
                                    const Icon = IconMap[item.icon] || BookOpen;

                                    return (
                                        <div 
                                            key={i} 
                                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 min-h-[90px]"
                                            style={{ transitionDelay: `${i * 100}ms` }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                                                <Icon size={20} strokeWidth={1.5} />
                                            </div>
                                            <p className="text-brand-dark/80 text-[15px] leading-relaxed font-medium">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section: Iskustvo */}
                        <div className="space-y-8 flex flex-col">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white flex items-center justify-center shadow-lg shadow-brand-teal/20">
                                    <Briefcase size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-brand-dark/80">{t.experienceTitle}</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4 flex-1">
                                {t.experienceItems.map((item: any, i: number) => {
                                    const IconMap: { [key: string]: any } = {
                                        Globe, Scale, Building2, Award, Briefcase, Zap, Sparkles
                                    };
                                    const Icon = IconMap[item.icon] || Briefcase;

                                    return (
                                        <div 
                                            key={i} 
                                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 min-h-[90px]"
                                            style={{ transitionDelay: `${i * 100 + 400}ms` }}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-brand-teal/5 text-brand-teal flex items-center justify-center shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300">
                                                <Icon size={20} strokeWidth={1.5} />
                                            </div>
                                            <p className="text-brand-dark/80 text-[15px] leading-relaxed font-medium">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. QUOTE / VALUES */}
            <section className="py-24 md:py-32 relative overflow-hidden bg-brand-blue flex items-center justify-center min-h-[500px]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.05] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className={`max-w-[760px] mx-auto px-6 relative z-10 text-center flex flex-col items-center transition-all duration-1000 ${quoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} ref={quoteRef}>
                    <Quote size={42} strokeWidth={2.5} className="text-white mb-12 opacity-80" />
                    <WordReveal 
                        text={t.quote}
                        center
                        className="text-[28px] md:text-[36px] font-sans font-medium text-white leading-[1.3] tracking-tight mb-16 px-4"
                    />
                    <div className="w-12 h-[1px] bg-white/30 mb-6"></div>
                    <p className="font-bold text-white uppercase tracking-[0.2em] text-[11px]">{t.quoteAuthor}</p>
                </div>
            </section>

            {/* 4. SERVICES OVERVIEW */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 ${supportVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={supportRef}>
                        <WordReveal 
                            text={t.supportTitle}
                            center
                            className="text-3xl md:text-4xl font-serif text-brand-blue mb-4"
                        />
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            {t.supportSubtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {galleryImages.slice(0, visibleImages).map((img, i) => (
                            <div key={i} className="aspect-square bg-brand-stone rounded-[2rem] overflow-hidden group relative shadow-lg shadow-brand-blue/5 border border-brand-blue/5 animate-in fade-in zoom-in duration-500">
                                <img 
                                    src={img.src} 
                                    alt={img.alt} 
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-brand-blue scale-90 group-hover:scale-100 transition-transform duration-500">
                                        <Globe size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-6">
                        {visibleImages < galleryImages.length && (
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={() => setVisibleImages(prev => Math.min(prev + 3, galleryImages.length))}
                                className="px-12"
                                withArrow
                            >
                                {lang === 'BHS' ? 'Prikaži više' : 'View more'}
                            </Button>
                        )}
                        {visibleImages > 3 && (
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={() => {
                                    setVisibleImages(3);
                                    document.getElementById('put-i-vizija')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-12"
                            >
                                {lang === 'BHS' ? 'Prikaži manje' : 'View less'}
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* 4.5 PUBLIC PUBLICATIONS */}
            <section className="py-24 bg-[#fafcff] border-t border-brand-blue/5">
                <div className="max-w-6xl mx-auto px-6 md:px-8">
                    <div className={`text-center mb-16 transition-all duration-1000 ${pubVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={pubRef}>
                        <WordReveal 
                            text={t.publicationsTitle}
                            center
                            className="text-3xl md:text-4xl font-serif text-brand-blue mb-4"
                        />
                        <p className="text-brand-dark/50 max-w-2xl mx-auto">
                            {t.publicationsDesc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { id: 'tv' as const, icon: Tv, label: t.tvLabel, count: t.publications.tv.length },
                            { id: 'radio' as const, icon: Radio, label: t.radioLabel, count: t.publications.radio.length },
                            { id: 'articles' as const, icon: FileText, label: t.articlesLabel, count: t.publications.articles.length }
                        ].map((cat, idx) => (
                            <button 
                                key={idx}
                                onClick={() => openCategory(cat.id)}
                                className="bg-white rounded-[2rem] p-10 shadow-xl shadow-brand-blue/5 border border-brand-blue/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500 hover:border-brand-blue/20"
                            >
                                <div className="w-20 h-20 bg-brand-cream rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 text-brand-blue ring-8 ring-transparent group-hover:ring-brand-blue/5">
                                    <cat.icon size={36} />
                                </div>
                                <h3 className="font-serif font-bold text-brand-dark/80 text-2xl mb-3">
                                    {cat.label}
                                </h3>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* PUBLICATIONS MODAL */}
            {pubModalOpen && selectedCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setPubModalOpen(false)}></div>
                    
                    {/* Modal Content */}
                    <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-brand-blue/5 flex items-center justify-between bg-brand-cream/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-brand-blue/20">
                                    {React.createElement(getCategoryIcon(selectedCategory), { size: 24 })}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-brand-dark/80 leading-tight">
                                        {selectedCategory === 'tv' ? t.tvLabel : selectedCategory === 'radio' ? t.radioLabel : t.articlesLabel}
                                    </h3>
                                    {t.publicPublicationsLabel && (
                                        <p className="text-sm text-brand-dark/50 font-medium uppercase tracking-widest">{t.publicPublicationsLabel}</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => setPubModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-brand-dark/40 hover:text-brand-blue transition-all duration-300 border border-transparent hover:border-brand-blue/10"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-6">
                            {t.publications[selectedCategory].map((item, idx) => (
                                <div key={idx} className="group p-6 rounded-2xl border border-brand-blue/5 hover:border-brand-blue/10 hover:bg-brand-cream/20 transition-all duration-300">
                                    <h4 className="text-lg font-bold text-brand-dark/80 mb-3 leading-snug group-hover:text-brand-blue transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-brand-dark/60 font-medium italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/20"></div>
                                            {item.source}
                                        </div>
                                        <a 
                                            href={item.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-brand-blue/10 hover:scale-105 transition-all duration-300"
                                        >
                                            {t.openLink} <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 text-center border-t border-brand-blue/5 bg-brand-cream/10">
                            <button 
                                onClick={() => setPubModalOpen(false)}
                                className="text-brand-blue font-bold text-sm uppercase tracking-widest hover:underline"
                            >
                                {t.closeWindow}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. CTA */}
            <section className="py-24 bg-brand-cream border-t border-gray-100">
                <div className={`max-w-3xl mx-auto px-6 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={ctaRef}>
                    <WordReveal 
                        text={t.ctaTitle}
                        center
                        className="text-4xl font-serif text-brand-blue mb-8"
                    />
                    <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                        {t.ctaSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button size="lg" variant="primary" withArrow onClick={() => window.open('https://calendly.com/contact-habitplus/15min', '_blank')}>
                            {t.ctaButton}
                        </Button>
                        <Button size="lg" variant="outline" onClick={openContactModal}>
                            {t.ctaContact}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
