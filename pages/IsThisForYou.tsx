import React from 'react';
import { useSiteImage, useSiteImageList, bgStyle, posVars } from '../context/SiteImagesContext';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { User, Briefcase, TrendingUp, Building2, Shield, Heart, CheckCircle, XCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WordReveal } from '../components/animations/WordReveal';
import { useReveal } from '../hooks/useReveal';
import { ProgressRingInfographic } from '../components/animations/ProgressRingInfographic';

interface Props {
    onNavigate: (page: Page, lang: Language) => void;
}

export const IsThisForYou: React.FC<Props> = ({ onNavigate }) => {
    const heroBg = useSiteImage('isThisForYouHero');
    const { lang, dict } = useLanguage();
    const t = dict[lang].isThisForYou;

    // Section reveals
    const [heroRef, heroVisible] = useReveal();
    const [personasRef, personasVisible] = useReveal();
    const [cannotRef, cannotVisible] = useReveal();
    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-text bg-white selection:bg-brand-blue selection:text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[75svh] pt-28 pb-16 lg:pt-0 lg:pb-0 lg:h-[100svh] lg:min-h-screen flex items-center justify-center overflow-hidden w-full">
                {/* Background photo */}
                <div
                    className="hp-pos absolute inset-0 bg-cover bg-no-repeat"
                    style={bgStyle(heroBg)}
                />
                {/* Blue overlay at 90% opacity */}
                <div className="absolute inset-0 bg-brand-blue opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className={`w-full max-w-[1440px] mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center transition-all duration-1000 lg:translate-y-12 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} ref={heroRef}>
                    <WordReveal 
                        text={t.heroTitle} 
                        center
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-extrabold tracking-tight leading-tight mb-5 md:mb-8 text-white"
                    />
                    <p className="text-white/90 text-base sm:text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
                        {t.heroSubtitle}
                    </p>
                    <Button
                        onClick={() => window.open(dict.BHS.links.calendlyUrl, '_blank')}
                        variant="white"
                        size="lg"
                        withArrow
                    >
                        {t.heroButton}
                    </Button>
                </div>

                {/* Scroll for More indicator */}
                <div className="absolute bottom-10 inset-x-0 mx-auto w-fit hidden lg:flex flex-col items-center gap-2 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-default z-10">
                    <ChevronDown size={20} className="text-white" />
                </div>
            </section>

            {/* Personas Grid - Separate White Section */}
            <section className="py-16 bg-white relative z-20">
                <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${personasVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={personasRef}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {t.personas.map((persona, idx) => {
                            const IconMap: { [key: string]: any } = {
                                User, Briefcase, TrendingUp, Building2, Shield, Heart
                            };
                            const Icon = IconMap[persona.icon] || User;

                            return (
                                <div key={idx} className="bg-white border border-gray-100 shadow-md md:shadow-xl rounded-3xl p-6 md:p-8 flex flex-col hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                                    <div className="w-12 h-12 bg-gray-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-4">{persona.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm flex-1">{persona.desc}</p>
                                </div>
                            );
                        })}

                    </div>
                    
                    <div className="mt-10 md:mt-16 text-center max-w-3xl mx-auto border-y border-gray-100 py-8 md:py-12 px-6">
                        <p className="text-gray-600 text-lg md:text-xl font-medium tracking-wide">
                            {t.recognitionLine}
                        </p>
                    </div>
                </div>
            </section>

            {/* Comparison Table - UNIFIED WHITE SECTION */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
                    {/* Heading */}
                    <div className={`text-center mb-16 transition-all duration-1000 ${cannotVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} ref={cannotRef}>
                        <WordReveal 
                            text={t.cannotTitle}
                            center
                            className="text-3xl md:text-5xl font-serif font-bold text-brand-blue mb-5"
                        />
                    </div>

                    <ProgressRingInfographic 
                        t={{
                            prepoznajSebeNegativeTitle: t.cannotHeader,
                            prepoznajSebeNegativeItems: t.cannotItems,
                            prepoznajSebePositiveTitle: t.canHeader,
                            prepoznajSebePositiveItems: t.canItems,
                            prepoznajSebeBtn: t.ctaButton
                        }} 
                    />
                </div>
            </section>

            <Footer onNavigate={onNavigate} />
        </div>
    );
};
