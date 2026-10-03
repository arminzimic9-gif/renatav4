# HabitPlus Website Structure & Section Map

This document provides a comprehensive overview of the pages, sections, components, translation keys, and routing structure of the **HabitPlus** application.

---

## 1. Core Architecture & Tech Stack
- **Framework:** Vite + React (TypeScript)
- **Styling:** TailwindCSS
- **Database & Auth:** Firebase (Firestore & Firebase Auth)
- **Routing:** React Router v7 (`react-router-dom`)
- **State Management:** Context API (`LanguageContext`, `UIContext`, `AdminContext`, `AdminPanelContext`)
- **Localization:** Dual-language support (BHS - Bosnian/Croatian/Serbian, and EN - English). All static texts are mapped to a central translation dictionary in [translations.ts](file:///Users/arminzimic/Desktop/habitplus_v22_backup/translations.ts).

---

## 2. Page-by-Page Mapping & Sections

### 🏠 Home Page
- **Component:** [Home.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/Home.tsx)
- **BHS Route:** `/` | **EN Route:** `/home`
- **Sections:**
  1. **Hero Section:**
     - Displays large title "HabitPlus" and a dynamic typewriter/carousel of quotes.
     - Mobile: Shows a full-screen portrait of Renata with overlay.
     - Translation keys: `home.heroTitle`, `home.heroMobileSubtitle`, `home.heroMobileCta`, `home.quotes`, `home.heroAuthor`, `home.heroAuthorTitle`.
  2. **Hero Hook (Bridge Section):**
     - Empathetic hook showing a brief tagline and a Calendly scheduling CTA.
     - Translation keys: `home.hookTitle`, `home.hookSubtitle`, `home.hookCta`.
  3. **About Founder Preview (Upoznaj osnivačicu):**
     - Preview text of Renata Lačević's experience with a button navigating to the full "O nama" page.
     - Displays 4 cards showing expert stats (e.g. 18+ years experience, cancer prevention, addiction psychology, etc.).
     - Translation keys: `home.aboutFounderTitle`, `home.aboutFounderSubtitle`, `home.aboutFounderCta`, `home.expertCards`.
  4. **Persona Check (Da li je ovo za tebe):**
     - Clean overlay section checking if the user fits the profile.
     - Translation keys: `home.prepoznajSebeTitle`, `home.prepoznajSebeSubtitle`, `home.prepoznajSebeBtn`.
  5. **Program Finder (Pronađi program):**
     - Shows three core programs: *Individualna podrška*, *Intenzivni program*, and *Program "Novi početak"*.
     - Translation keys: `home.findProgramTitle`, `home.findProgramSubtitle`, `home.findPrograms`, `home.findProgramBtn`.
  6. **Corporate Banner (Zdrav tim je produktivan tim):**
     - Full-width call-to-action block highlighting corporate health solutions.
     - Translation keys: `home.corpBannerTitle`, `home.corpBannerSubtitle`, `home.corpBannerBtn`.
  7. **Testimonials (Šta kažu drugi):**
     - Marquee-style sliding cards with reviews from clients, companies, and organizations.
     - A Google reviews badge with stars leading to the Google Review page.
     - Translation keys: `home.testimonialsTitle`, `home.testimonialsSubtitle`, `home.testimonials`.
  8. **Savings Calculator (Kalkulator uštede):**
     - Interactive savings widget computing financial savings and days of life gained based on daily cigarettes consumed and pack price.
     - Translation keys: `savingsCalculator.title`, `savingsCalculator.subtitle`, etc.
  9. **Blog Section Preview:**
     - Shows the latest articles.
  10. **FAQ Section (Često postavljena pitanja):**
      - Two distinct boxes: "Za pojedince" (For individuals) and "Za organizacije" (For organizations).
      - Clicking either opens a modal overlay listing deep FAQs with accordion menus.
      - Translation keys: `home.faq.title`, `home.faq.subtitle`, `home.faq.individual`, `home.faq.corporate`.

---

### ❓ Is This For You? (Za koga je HabitPlus?)
- **Component:** [IsThisForYou.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/IsThisForYou.tsx)
- **BHS Route:** `/da-li-je-ovo-za-vas` | **EN Route:** `/is-this-for-you`
- **Sections:**
  1. **Page Hero:**
     - Title and introduction.
     - Translation keys: `isThisForYou.heroTitle`, `isThisForYou.heroSubtitle`, `isThisForYou.heroButton`.
  2. **Detailed Persona Cards:**
     - Flipping cards containing details and success/ROI stats for: *Fizička lica* (Individuals), *Profesionalci* (Professionals), *Vlasnici biznisa* (Business Owners), *Organizacije* (Organizations), *Prestali ste ali vam treba podrška* (Relapse Prevention), *Želite biti nepušač zauvijek* (Long-term Non-smoker).
     - Translation keys: `isThisForYou.personas`.
  3. **Conditional Rules ("Prije nego što se prijaviš, pročitaj ovo"):**
     - Side-by-side list comparing conditions of where we *cannot* help (e.g. passive participation) versus where we *can* help (e.g. ready for growth).
     - Translation keys: `isThisForYou.cannotTitle`, `isThisForYou.cannotHeader`, `isThisForYou.cannotItems`, `isThisForYou.canHeader`, `isThisForYou.canItems`.
  4. **Bottom CTA Banner:**
     - Translation keys: `isThisForYou.ctaTitle`, `isThisForYou.ctaSubtitle`, `isThisForYou.ctaButton`.

---

### 💼 Services for Individuals (Usluge za pojedince)
- **Component:** [Services.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/Services.tsx)
- **BHS Route:** `/usluge` | **EN Route:** `/services`
- **Sections:**
  1. **Page Hero:**
     - Title and description.
     - Translation keys: `services.heroTitle`, `services.heroSubtitle`, `services.heroButton`.
  2. **Program Comparison Cards:**
     - Detailed layout of individual programs including duration, what you get, and a call-to-action button.
     - Translation keys: `services.programs`.
  3. **Program Structure Accordion (Struktura programa):**
     - Detailed 8-step breakdown of how the program progresses (from understanding habit building to cementing a permanent smoke-free identity).
     - Translation keys: `services.structure`.

---

### 🏢 For Organizations & Corporates (Za organizacije)
- **Component:** [Corporate.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/Corporate.tsx)
- **BHS Route:** `/za-organizacije` | **EN Route:** `/for-organisations`
- **Sections:**
  1. **Page Hero:**
     - Title, subtitle, and primary button.
     - Translation keys: `corporate.heroTitle`, `corporate.heroSubtitle`, `corporate.heroButton`.
  2. **Benefits / ROI Analysis ("Zašto investirati u HabitPlus?"):**
     - Detailed blocks describing economic benefits: *Veća produktivnost* (Higher productivity), *Manje bolovanja* (Less sick leave), *Jača reputacija poslodavca* (Employer branding).
     - Translation keys: `corporate.whyTitle`, `corporate.whySubtitle`, `corporate.benefits`.
  3. **Collaboration Workflow ("Kako izgleda saradnja?"):**
     - Visual 4-step workflow timeline (Assessment -> Tailoring -> Execution -> Support/Tracking).
     - Translation keys: `corporate.collabTag`, `corporate.collabTitle`, `corporate.collabSubtitle`, `corporate.collabSteps`.
  4. **Corporate Program Formats:**
     - Explicit formats available: *Edukativni seminari* (Seminars), *Intenzivni program* (Intensive), *Program "Novi početak"* (New Beginning), *Individualna podrška* (1-on-1).
     - Translation keys: `corporate.programsTitle`, `corporate.programsSubtitle`, `corporate.programs`.
  5. **Bottom CTA Block:**
     - Translation keys: `corporate.ctaTitle`, `corporate.ctaSubtitle`, `corporate.ctaButton`.

---

### 👩 About Renata (O nama / O Renati)
- **Component:** [AboutRenata.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/AboutRenata.tsx)
- **BHS Route:** `/onama` | **EN Route:** `/about-us`
- **Sections:**
  1. **Intro Hero:**
     - Split header with Renata's photo on the right and key stats/tags on the left.
     - Translation keys: `about.heroTag`, `about.heroSubtitle`, `about.credentials`.
  2. **Mission & Vision:**
     - Detailed statement explaining why HabitPlus was founded.
     - Translation keys: `about.visionTitle`, `about.visionLead`, `about.visionText`.
  3. **Qualifications & Education:**
     - Lists of certifications, degrees, and milestones in public health.
     - Translation keys: `about.educationTitle`, `about.educationItems`, `about.experienceTitle`, `about.experienceItems`.
  4. **Key Quote Banner:**
     - Clean, focused quote block.
     - Translation keys: `about.quote`, `about.quoteAuthor`.
  5. **Media Publications & Appearances ("Javni nastupi i publikacije"):**
     - Tabs for TV appearances, radio interviews, and articles.
     - Links point directly to external sites like N1, BHRT, and ResearchGate.
     - Translation keys: `about.publicationsTitle`, `about.publicationsDesc`, `about.publications`.
  6. **Gallery:**
     - Visual grid showcasing snapshots from past workshops, seminars, and events.
     - Translation keys: `about.supportTitle`, `about.supportSubtitle`.

---

### 📝 Blog & Post Details
- **List Page:** [Blog.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/Blog.tsx)
  - **BHS Route:** `/blog` | **EN Route:** `/en-blog`
- **Post Detail Page:** [BlogPost.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/BlogPost.tsx)
  - **BHS Route:** `/blog/:slug` | **EN Route:** `/en-blog/:slug`
- **Dynamic Content:** Blog list and post contents are fetched in real-time from Firestore database.

---

### 📞 Contact Page
- **Component:** [Contact.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/Contact.tsx)
- **BHS Route:** `/kontakt` | **EN Route:** `/contact`
- **Behavior:** Renders the contact form directly or routes to the Global Contact Modal.

---

### 🔒 Privacy Policy
- **Component:** [PrivacyPolicy.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/PrivacyPolicy.tsx)
- **BHS Route:** `/politika-privatnosti` | **EN Route:** `/privacy-policy`
- **Sections:**
  - Data collection, use, protection, user rights, contact details, and a medical disclaimer note.
  - Translation keys: `privacyPolicy.title`, `privacyPolicy.intro`, `privacyPolicy.sections`, `privacyPolicy.note`.

---

## 3. Global & Persistent Widgets

### 🧭 Header
- **Component:** [Header.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/components/Header.tsx)
- **Contents:** Navigation links (Home, Is this for you, Corporate, Services, About Us, Blog, Contact). Language switcher button (BHS / EN).
- **Translation keys:** `header.nav`.

### 🚨 Craving Mode ("Puši mi se")
- **Component:** [CravingMode.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/components/CravingMode.tsx)
- **Access:** Reusable floating action button ("Puši mi se" / "Craving Mode") pinned to the screen bottom.
- **Behavior:** Opens a fullscreen modal with an active 5-minute timer (representing the average duration of a nicotine craving). It randomizes interactive tasks/micro-games (breathing exercise, drinking water, phone a friend, physical stretching, affirmations) to distract the user.
- **Translation keys:** `cravingMode`.

### 📊 Savings Calculator
- **Component:** [SavingsCalculator.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/components/SavingsCalculator.tsx)
- **Behavior:** Dynamic sliders where users specify daily cigarette intake and pack price. Instantly computes financial savings over various periods (1 week, 1 month, 1 year, 5 years) and estimates years of life gained.
- **Translation keys:** `savingsCalculator`.

---

## 4. Admin Panel Map (`/admin`)

The administration portal is protected behind a login panel and contains separate routes for managing Firestore content and articles.

- **Routing Wrapper / Layout:** [AdminShell.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/layout/AdminShell.tsx)
  - Manages the admin sidebar, dashboard header, and active language status.
- **Admin Context:** [AdminPanelContext.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/context/AdminPanelContext.tsx)
  - Keeps track of modified values, loads translations from Firestore, handles save/reset states, and manages blog post creation/updates/deletions.

### Admin Pages:
1. **Login page (`/admin`):**
   - [AdminLogin.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/pages/AdminLogin.tsx) - Logs into Firebase.
2. **Dashboard (`/admin/dashboard`):**
   - [AdminDashboardNew.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/pages/AdminDashboardNew.tsx) - Overview card list linking to BHS and EN translations for each section.
3. **Content Editor (`/admin/content/:lang/:section`):**
   - [ContentEditor.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/pages/ContentEditor.tsx) - Renders editable fields for a specific page translation block (e.g. `home`, `about`, `services`, etc.) using `SmartField` inputs.
4. **Blog List (`/admin/blog`):**
   - [BlogList.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/pages/BlogList.tsx) - Table displaying all Firestore blogs, their status, date, and edit/delete actions.
5. **Blog Editor (`/admin/blog/:id`):**
   - [BlogEditor.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/pages/BlogEditor.tsx) - Form with title, subtitle, cover image, category, and markdown rich text content for creating or editing blog posts.
6. **Settings (`/admin/settings`):**
   - [Settings.tsx](file:///Users/arminzimic/Desktop/habitplus_v22_backup/admin/pages/Settings.tsx) - Quick configurations.
