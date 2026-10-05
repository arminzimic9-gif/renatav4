// @refresh reset
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Blog, Toast } from '../types';
import { blogService, translationsService } from '../services/firestoreService';
import { translations as defaultTranslations } from '../../translations';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AdminPanelContextType {
  // Content (translations)
  contentData: any;
  updateContent: (path: string[], value: any) => void;
  saveContent: () => Promise<void>;
  resetContent: () => void;

  // Blogs
  blogs: Blog[];
  loadBlogs: () => Promise<void>;
  saveBlog: (blog: Blog) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  // State
  isDirty: boolean;
  lastSaved: Date | null;
  isLoading: boolean;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | null>(null);

export const AdminPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentData, setContentData] = useState<any>(defaultTranslations);
  const [originalData, setOriginalData] = useState<any>(defaultTranslations);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Wait for Firebase Auth then load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await translationsService.get();
        if (data) {
          setContentData(data);
          setOriginalData(data);
        }
      } catch (err) {
        console.error('Failed to load translations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsLoading(false);
        return;
      }
      await loadData();
    });
    return () => unsubscribe();
  }, []);

  const updateContent = useCallback((path: string[], value: any) => {
    setContentData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = value;
      return next;
    });
    setIsDirty(true);
  }, []);

  const saveContent = useCallback(async () => {
    try {
      await translationsService.save(contentData);
      setOriginalData(JSON.parse(JSON.stringify(contentData)));
      setIsDirty(false);
      setLastSaved(new Date());
      addToast('Promjene su uspješno sačuvane!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(`Greška: ${err.message || 'Provjerite Firebase permisije.'}`, 'error');
    }
  }, [contentData]);

  const resetContent = useCallback(() => {
    setContentData(JSON.parse(JSON.stringify(originalData)));
    setIsDirty(false);
    addToast('Sadržaj je resetovan na posljednju sačuvanu verziju.', 'warning');
  }, [originalData]);

  const loadBlogs = useCallback(async () => {
    try {
      // Ugrađene objave prebaci u bazu da bi se mogle uređivati (samo jednom).
      await blogService.seedDefaultsIfNeeded().catch((err) => console.error('Seed blogova nije uspio:', err));
      const data = await blogService.getAll();
      setBlogs(data);
    } catch (err) {
      console.error('Failed to load blogs:', err);
    }
  }, []);

  const saveBlog = useCallback(async (blog: Blog) => {
    try {
      if (blog.id && blog.id !== 'new') {
        await blogService.update(blog.id, blog);
      } else {
        const { id: _id, ...rest } = blog;
        const newId = await blogService.create(rest);
        blog = { ...blog, id: newId };
      }
      await loadBlogs();
      addToast('Blog je uspješno sačuvan!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Greška pri spašavanju bloga.', 'error');
      throw err;
    }
  }, [loadBlogs]);

  const deleteBlog = useCallback(async (id: string) => {
    try {
      await blogService.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      addToast('Blog je obrisan.', 'success');
    } catch (err) {
      addToast('Greška pri brisanju bloga.', 'error');
      throw err;
    }
  }, []);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AdminPanelContext.Provider value={{
      contentData, updateContent, saveContent, resetContent,
      blogs, loadBlogs, saveBlog, deleteBlog,
      isDirty, lastSaved, isLoading,
      toasts, addToast, removeToast,
    }}>
      {children}
    </AdminPanelContext.Provider>
  );
};

export const useAdminPanel = () => {
  const ctx = useContext(AdminPanelContext);
  if (!ctx) throw new Error('useAdminPanel must be used within AdminPanelProvider');
  return ctx;
};
