// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

// Admin = prijavljeni Firebase korisnik (Google nalog ili email/lozinka) čiji email
// postoji kao dokument u kolekciji "admins". Isti popis koriste i pravila baze.

interface AdminContextType {
  user: boolean;
  isLoading: boolean;
  /** Email koji se prijavio, ali nije na listi administratora. */
  deniedEmail: string | null;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  user: false,
  isLoading: true,
  deniedEmail: null,
  logout: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const email = (currentUser.email || '').toLowerCase();
      try {
        const snap = email ? await getDoc(doc(db, 'admins', email)) : null;
        if (snap && snap.exists()) {
          setUser(true);
          setDeniedEmail(null);
        } else {
          // Prijavljen, ali nije administrator: odjavi ga odmah.
          setUser(false);
          setDeniedEmail(email || 'nepoznat nalog');
          await signOut(auth);
        }
      } catch (err) {
        console.error('Provjera administratora nije uspjela', err);
        setUser(false);
        setDeniedEmail(email || 'nepoznat nalog');
        await signOut(auth).catch(() => undefined);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AdminContext.Provider value={{ user, isLoading, deniedEmail, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
