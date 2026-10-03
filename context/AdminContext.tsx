// @refresh reset
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AdminContextType {
  user: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  user: false,
  isLoading: true,
  logout: () => {},
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') {
      setUser(true);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(!!currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('isAdmin');
      await signOut(auth);
      setUser(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AdminContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
