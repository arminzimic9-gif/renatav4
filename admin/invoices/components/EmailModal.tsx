import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

interface Props {
  defaultEmail: string;
  onSend: (email: string, subject: string, message: string) => Promise<void>;
  onClose: () => void;
}

export const EmailModal: React.FC<Props> = ({ defaultEmail, onSend, onClose }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState('Faktura');
  const [message, setMessage] = useState('Poštovani,\n\nU prilogu Vam dostavljamo fakturu.\n\nSrdačan pozdrav.');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Unesite email adresu primaoca.');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      await onSend(email, subject, message);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške prilikom slanja emaila.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Slanje fakture emailom</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email primaoca</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naslov (Subject)</label>
            <input 
              type="text" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poruka</label>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[120px]" 
              required 
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Odustani
            </button>
            <button 
              type="submit" 
              disabled={isSending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Pošalji
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
