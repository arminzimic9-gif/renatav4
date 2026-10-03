import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastContainer } from '../components/Toast';
import { UnsavedWarning } from '../components/UnsavedWarning';
import { useAdminPanel } from '../context/AdminPanelContext';
import { useAdmin } from '../../context/AdminContext';
import { Loader2 } from 'lucide-react';

export const AdminShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const { isDirty, saveContent, resetContent } = useAdminPanel();
  const { user, isLoading: authLoading } = useAdmin();
  const navigate = useNavigate();

  // Auth guard — must be before any early return but AFTER all hooks
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Keyboard shortcut: Cmd/Ctrl + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) saveContent();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveContent, isDirty]);

  // Beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleSaveAndContinue = async () => {
    await saveContent();
    setShowUnsavedWarning(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleDiscardAndContinue = () => {
    resetContent();
    setShowUnsavedWarning(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  // Show spinner while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0a',
      }}>
        <Loader2 className="animate-spin" style={{ color: '#5392ce' }} size={32} />
      </div>
    );
  }

  // Show nothing while redirect fires
  if (!user) return null;

  return (
    <>
      {/* Google Fonts for admin panel */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden' }}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          <main style={{ flex: 1, overflow: 'auto', background: '#0a0a0a' }}>
            <Outlet />
          </main>
        </div>
      </div>

      <ToastContainer />

      <UnsavedWarning
        isOpen={showUnsavedWarning}
        onSave={handleSaveAndContinue}
        onDiscard={handleDiscardAndContinue}
        onCancel={() => setShowUnsavedWarning(false)}
      />
    </>
  );
};
