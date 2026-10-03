import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isContactModalOpen: boolean;
  contactModalProgram: string;
  openContactModal: (program?: string) => void;
  closeContactModal: () => void;
  isCravingModeOpen: boolean;
  setCravingModeOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isLocalPopupOpen: boolean;
  setLocalPopupOpen: (isOpen: boolean) => void;
  isAppLoading: boolean;
}

const UIContext = createContext<UIContextType>({
  isContactModalOpen: false,
  contactModalProgram: 'individualna',
  openContactModal: () => {},
  closeContactModal: () => {},
  isCravingModeOpen: false,
  setCravingModeOpen: () => {},
  isMobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  isLocalPopupOpen: false,
  setLocalPopupOpen: () => {},
  isAppLoading: false,
});

export const UIProvider: React.FC<{ children: React.ReactNode; isAppLoading?: boolean }> = ({ children, isAppLoading = false }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalProgram, setContactModalProgram] = useState('individualna');
  const [isCravingModeOpen, setIsCravingModeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocalPopupOpen, setIsLocalPopupOpen] = useState(false);

  const openContactModal = (program?: string) => {
    if (program) setContactModalProgram(program);
    setIsContactModalOpen(true);
  };
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <UIContext.Provider value={{ 
      isContactModalOpen, contactModalProgram, openContactModal, closeContactModal,
      isCravingModeOpen, setCravingModeOpen: setIsCravingModeOpen,
      isMobileMenuOpen, setMobileMenuOpen: setIsMobileMenuOpen,
      isLocalPopupOpen, setLocalPopupOpen: setIsLocalPopupOpen,
      isAppLoading
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
