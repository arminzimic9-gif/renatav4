import { Language } from './context/LanguageContext';

export type Page = 'home' | 'is-this-for-you' | 'services' | 'corporate' | 'about-renata' | 'contact' | 'privacy-policy' | 'blog';

export const ROUTES: Record<Language, Record<Page, string>> = {
  BHS: {
    home: '/',
    'is-this-for-you': '/da-li-je-ovo-za-vas',
    services: '/usluge',
    corporate: '/za-organizacije',
    'about-renata': '/onama',
    contact: '/kontakt',
    'privacy-policy': '/politika-privatnosti',
    blog: '/blog',
  },
  EN: {
    home: '/home',
    'is-this-for-you': '/is-this-for-you',
    services: '/services',
    corporate: '/for-organisations',
    'about-renata': '/about-us',
    contact: '/contact',
    'privacy-policy': '/privacy-policy',
    blog: '/en-blog',
  },
};

// Given a pathname, figure out which page and language it corresponds to
export function resolveRoute(pathname: string): { page: Page; lang: Language } | null {
  for (const lang of ['BHS', 'EN'] as Language[]) {
    for (const [page, route] of Object.entries(ROUTES[lang]) as [Page, string][]) {
      if (pathname === route || pathname === route + '/') {
        return { page, lang };
      }
    }
  }
  return null;
}

// Given a page and current lang, return the equivalent page URL in the other lang
export function getAlternateRoute(page: Page, currentLang: Language): string {
  const otherLang: Language = currentLang === 'BHS' ? 'EN' : 'BHS';
  return ROUTES[otherLang][page];
}
