import React, { useState, useRef } from 'react';
import { UserSettings } from '../types';
import { X, Download, Upload } from 'lucide-react';
import { exportData, importData } from '../lib/storage';

interface Props {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
  isFirstRun?: boolean;
}

export const SettingsModal: React.FC<Props> = ({ settings, onSave, onClose, isFirstRun }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          alert('Podaci su uspješno učitani! Stranica će se sada osvježiti.');
          window.location.reload();
        } else {
          alert('Greška pri učitavanju podataka. Provjerite da li je fajl validan.');
        }
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        alert('Molimo odaberite PNG ili JPG sliku za potpis.');
        return;
      }
      if (file.size > 500 * 1024) {
        alert('Slika ne smije biti veća od 500 KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, signatureImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBottomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        alert('Molimo odaberite PNG sliku za logo.');
        return;
      }
      if (file.size > 500 * 1024) {
        alert('Slika ne smije biti veća od 500 KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bottomLogoImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            {isFirstRun ? 'Dobrodošli! Unesite podatke o kompaniji' : 'Postavke Fakture'}
          </h2>
          {!isFirstRun && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naziv kompanije</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ime vlasnika / Zastupnika</label>
            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID broj</label>
              <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Web stranica</label>
              <input type="text" name="website" value={formData.website || ''} onChange={handleChange} placeholder="npr. www.mojafirma.ba" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Bankovni podaci</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv banke</label>
                <input type="text" name="bankName" value={formData.bankName || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="npr. Raiffeisen Bank d.d." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT / BIC</label>
                <input type="text" name="swift" value={formData.swift || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bankovni račun (BAM / TRN)</label>
                <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bankovni račun (EUR / IBAN)</label>
                <input type="text" name="bankAccountEUR" value={formData.bankAccountEUR || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bankovni račun (USD / IBAN)</label>
                <input type="text" name="bankAccountUSD" value={formData.bankAccountUSD || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Glavna boja (Dizajn)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#004aad'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#004aad' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#004aad' }} title="Standardna Plava"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#00a4cf'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#00a4cf' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#00a4cf' }} title="Svijetlo Plava"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#4295af'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#4295af' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#4295af' }} title="Tirkizno Plava"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#6290c9'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#6290c9' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#6290c9' }} title="Meko Plava"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#16a34a'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#16a34a' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#16a34a' }} title="Zelena"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#dc2626'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#dc2626' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#dc2626' }} title="Crvena"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#4f46e5'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#4f46e5' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#4f46e5' }} title="Ljubičasta"></button>
                <button type="button" onClick={() => setFormData({...formData, primaryColor: '#1f2937'})} className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === '#1f2937' ? 'border-gray-800' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: '#1f2937' }} title="Tamno Siva"></button>
              </div>
              <div className="flex items-center gap-3">
                <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer border-0 p-0" title="Prilagođena boja" />
                <span className="text-sm text-gray-500">Prilagođena: {formData.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font fakture</label>
              <select 
                name="fontFamily" 
                value={formData.fontFamily || 'Arial, Helvetica, sans-serif'} 
                onChange={handleChange as any} 
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Arial, Helvetica, sans-serif">Arial / Sans-serif</option>
                <option value="'Times New Roman', Times, serif">Times New Roman / Serif</option>
                <option value="'Courier New', Courier, monospace">Courier New / Monospace</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, Geneva, sans-serif">Verdana</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Izgled (Šablon) fakture</label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`border rounded-md p-3 cursor-pointer flex flex-col items-center gap-2 transition-colors ${formData.template === 'modern' || !formData.template ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="template" value="modern" checked={formData.template === 'modern' || !formData.template} onChange={handleChange} className="sr-only" />
                <div className="w-full h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col p-2">
                  <div className="w-1/2 h-2 bg-blue-500 rounded mb-2"></div>
                  <div className="w-full h-1 bg-gray-200 rounded mb-1"></div>
                  <div className="w-full h-1 bg-gray-200 rounded mb-1"></div>
                  <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
                </div>
                <span className="text-sm font-medium">Moderni</span>
              </label>
              <label className={`border rounded-md p-3 cursor-pointer flex flex-col items-center gap-2 transition-colors ${formData.template === 'classic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="template" value="classic" checked={formData.template === 'classic'} onChange={handleChange} className="sr-only" />
                <div className="w-full h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col p-2">
                  <div className="w-full flex justify-between mb-2">
                    <div className="w-1/3 h-2 bg-gray-800 rounded"></div>
                    <div className="w-1/4 h-2 bg-gray-400 rounded"></div>
                  </div>
                  <div className="w-full border-t border-b border-gray-800 py-1 mb-1 flex flex-col gap-1">
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                    <div className="w-full h-1 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <span className="text-sm font-medium">Klasični</span>
              </label>
              <label className={`border rounded-md p-3 cursor-pointer flex flex-col items-center gap-2 transition-colors ${formData.template === 'minimal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="template" value="minimal" checked={formData.template === 'minimal'} onChange={handleChange} className="sr-only" />
                <div className="w-full h-20 bg-white border border-gray-200 rounded shadow-sm flex flex-col p-2">
                  <div className="w-1/4 h-2 bg-gray-300 rounded mb-3 mx-auto"></div>
                  <div className="w-full h-px bg-gray-100 mb-1"></div>
                  <div className="w-full h-px bg-gray-100 mb-1"></div>
                  <div className="w-full h-px bg-gray-100"></div>
                </div>
                <span className="text-sm font-medium">Minimalni</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Potpis (PNG/JPG)</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              onChange={handleImageUpload} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            {formData.signatureImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Trenutni potpis:</p>
                <img src={formData.signatureImage} alt="Potpis" className="h-12 object-contain border p-1 rounded bg-white" />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, signatureImage: '' }))}
                  className="text-xs text-red-500 mt-1 hover:underline"
                >
                  Ukloni potpis
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo na dnu fakture (samo PNG, max 500KB)</label>
            <input 
              type="file" 
              accept="image/png" 
              onChange={handleBottomLogoUpload} 
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            {formData.bottomLogoImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Trenutni logo na dnu:</p>
                <img src={formData.bottomLogoImage} alt="Logo dno" className="h-12 object-contain border p-1 rounded bg-white" />
                <button 
                  type="button" 
                  onClick={() => setFormData(prev => ({ ...prev, bottomLogoImage: '' }))}
                  className="text-xs text-red-500 mt-1 hover:underline"
                >
                  Ukloni logo
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Slanje emaila</h3>
            <p className="text-xs text-gray-500">Fakture se šalju preko HabitPlus servera (poštanski sandučić stranice). SMTP lozinka se više ne unosi niti čuva u pregledniku.</p>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Backup i sigurnost (Eksport / Import)</h3>
            <p className="text-xs text-gray-500 mb-4">Napravite sigurnosnu kopiju svih vaših podataka (fakture, klijenti, artikli, postavke) ili ih vratite iz postojećeg fajla u slučaju da vam se obrišu podaci iz pretraživača.</p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                type="button" 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                Eksportuj sve podatke
              </button>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef}
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Importuj podatke"
                />
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors pointer-events-none"
                >
                  <Upload size={18} />
                  Importuj podatke
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200 mt-4">
            {!isFirstRun && (
              <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Odustani</button>
            )}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {isFirstRun ? 'Završi postavljanje' : 'Sačuvaj'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
