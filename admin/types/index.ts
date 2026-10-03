// Admin panel types

export interface Blog {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
  author: string;
  category: string;
  coverImage: string;
  bhs: {
    title: string;
    excerpt: string;
    content: string;
  };
  en: {
    title: string;
    excerpt: string;
    content: string;
  };
  seo: {
    bhs: { metaTitle: string; metaDescription: string };
    en: { metaTitle: string; metaDescription: string };
  };
}

export interface PopupDocument {
  id: string;
  title_bhs: string;
  title_en: string;
  image_portrait: string;   // URL 9:16 slike
  image_landscape: string;  // URL 16:9 slike
  cta_label_bhs: string;
  cta_label_en: string;
  cta_url: string;          // interni ili eksterni URL
  lang: 'bhs' | 'en' | 'both';
  active: boolean;
  created_at: any;          // Firestore Timestamp ili ISO string
  updated_at: any;
}

export interface AdminPanelState {
  contentData: any;
  blogs: Blog[];
  isDirty: boolean;
  lastSaved: Date | null;
  isLoading: boolean;
}

export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
