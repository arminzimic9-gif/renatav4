import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { Toast as ToastType } from '../types';
import { useAdminPanel } from '../context/AdminPanelContext';

const icons = {
  success: <CheckCircle2 size={18} style={{ color: '#22c55e' }} />,
  error: <XCircle size={18} style={{ color: '#ef4444' }} />,
  warning: <AlertTriangle size={18} style={{ color: '#f59e0b' }} />,
};

const ToastItem: React.FC<{ toast: ToastType; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: '#1c1c1c',
        border: '1px solid #2a2a2a',
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        minWidth: '280px',
        maxWidth: '420px',
        animation: 'slideInRight 0.3s ease',
      }}
    >
      {icons[toast.type]}
      <span style={{ flex: 1, color: '#f5f5f5', fontSize: '14px', fontFamily: 'DM Sans, sans-serif' }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ color: '#888', cursor: 'pointer', background: 'none', border: 'none', padding: '2px' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdminPanel();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};
