import React from 'react';
import { Page } from '../routes';
import { Language } from '../context/LanguageContext';

interface Props {
    onNavigate: (page: Page, lang: Language) => void;
}

export const Contact: React.FC<Props> = ({ onNavigate }) => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Kontakt</h1>
            <p>Placeholder content for formatting</p>
        </div>
    );
};
