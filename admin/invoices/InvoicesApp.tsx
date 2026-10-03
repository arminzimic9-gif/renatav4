import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Save, Loader2, Trash2, Settings, Users, Package, BarChart3, Send, DollarSign } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { InvoiceData, UserSettings } from './types';
import { getInvoices, saveInvoice, deleteInvoice, getUserSettings, saveUserSettings, defaultSettings, getNextInvoiceNumber } from './lib/storage';
import { generateInvoiceFromPrompt, sendInvoiceEmail } from './lib/api';
import { InvoicePreview } from './components/InvoicePreview';
import { SettingsModal } from './components/SettingsModal';
import { InvoiceEditor } from './components/InvoiceEditor';
import { ClientsTab } from './components/ClientsTab';
import { ArticlesTab } from './components/ArticlesTab';
import { KasaTab } from './components/KasaTab';
import { EmailModal } from './components/EmailModal';
import { ExchangeRatesTab } from './components/ExchangeRatesTab';
import { FullscreenPreviewModal } from './components/FullscreenPreviewModal';

export default function InvoicesApp() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'clients' | 'articles' | 'kasa' | 'rates'>('invoices');
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInvoices(getInvoices());
    const loadedSettings = getUserSettings();
    setSettings(loadedSettings);
    
    // Show settings modal on first run if company name is empty
    if (!loadedSettings.companyName) {
      setShowSettings(true);
    }
  }, []);

  const handleSendEmail = async (email: string, subject: string, message: string) => {
    if (!invoiceRef.current || !currentInvoice) {
      throw new Error('Nema fakture za slanje.');
    }

    try {
      const element = invoiceRef.current;
      
      // Kloniramo element izvan stabla da izbjegnemo probleme s overflow-om
      const clone = element.cloneNode(true) as HTMLElement;
      document.body.appendChild(clone);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px';
      clone.style.maxWidth = 'none';
      clone.style.minHeight = '1123px';
      clone.style.backgroundColor = '#ffffff';
      
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        width: 794,
        windowWidth: 794,
      });
      
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Smanjen kvalitet i skala zbog veličine fajla
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Ako PDF ima više stranica (faktura viša od jedne A4 stranice), jsPDF može generisati samo jednu, ali ovo skalira sliku
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      await sendInvoiceEmail({
        to: email,
        subject,
        body: message,
        filename: `Faktura_${currentInvoice.invoiceNumber.replace(/\//g, '-')}.pdf`,
        pdfBase64,
      });

      alert('Email je uspješno poslan!');
    } catch (error: any) {
      console.error('Greška pri slanju emaila:', error);
      throw new Error(error.message || 'Došlo je do greške prilikom slanja emaila.');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedData = await generateInvoiceFromPrompt(prompt);
      const nextInvoiceNumber = getNextInvoiceNumber(invoices);
      
      const newInvoice: InvoiceData = {
        id: `inv-${Date.now()}`,
        createdAt: Date.now(),
        invoiceNumber: nextInvoiceNumber,
        date: generatedData.date || new Date().toLocaleDateString('bs-BA'),
        clientName: generatedData.clientName || '',
        clientAddress: generatedData.clientAddress || '',
        clientId: generatedData.clientId || '',
        currency: generatedData.currency || 'BAM',
        items: generatedData.items || [],
        totalAmount: generatedData.totalAmount || 0,
        amountInWords: generatedData.amountInWords || '',
        notes: generatedData.notes || 'Obveznik nije u sistemu PDV-a. Oslobođeno plaćanja PDV-a prema članu 57. Zakona o PDV-u.\nMolimo uplatu izvršiti na navedeni žiro račun pozivom na broj računa.',
      };
      
      setCurrentInvoice(newInvoice);
      setShowFullscreenPreview(true);
    } catch (err) {
      console.error(err);
      setError('Došlo je do greške prilikom generisanja fakture. Pokušajte ponovo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (currentInvoice) {
      saveInvoice(currentInvoice);
      setInvoices(getInvoices());
      alert('Faktura je uspješno sačuvana!');
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Da li ste sigurni da želite obrisati ovu fakturu?')) {
      deleteInvoice(id);
      setInvoices(getInvoices());
      if (currentInvoice?.id === id) {
        setCurrentInvoice(null);
      }
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    saveUserSettings(newSettings);
    setSettings(newSettings);
    setShowSettings(false);
  };

  const createNew = () => {
    setActiveTab('invoices');
    setCurrentInvoice(null);
    setPrompt('');
  };

  const createManual = () => {
    const nextInvoiceNumber = getNextInvoiceNumber(invoices);
    const newInvoice: InvoiceData = {
      id: `inv-${Date.now()}`,
      createdAt: Date.now(),
      invoiceNumber: nextInvoiceNumber,
      date: new Date().toLocaleDateString('bs-BA'),
      clientName: '',
      clientAddress: '',
      clientId: '',
      currency: 'BAM',
      items: [{ id: Date.now().toString(), description: '', quantity: 1, price: 0, total: 0 }],
      totalAmount: 0,
      amountInWords: '',
      notes: 'Obveznik nije u sistemu PDV-a. Oslobođeno plaćanja PDV-a prema članu 57. Zakona o PDV-u.\nMolimo uplatu izvršiti na navedeni žiro račun pozivom na broj računa.',
    };
    setCurrentInvoice(newInvoice);
  };

  return (
    <div className="flex h-full min-h-[600px] bg-gray-50 font-sans text-left">
      {/* Sidebar - Hidden when printing */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col print:hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" />
              Fakture
            </h1>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Postavke"
            >
              <Settings size={20} />
            </button>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === 'invoices' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FileText size={18} />
              Fakture
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === 'clients' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={18} />
              Klijenti
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === 'articles' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Package size={18} />
              Artikli / Usluge
            </button>
            <button 
              onClick={() => setActiveTab('kasa')}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === 'kasa' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BarChart3 size={18} />
              Kasa / Izvještaji
            </button>
            <button 
              onClick={() => setActiveTab('rates')}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${activeTab === 'rates' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <DollarSign size={18} />
              Kursna Lista
            </button>
          </div>

          <button 
            onClick={createNew}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Plus size={18} />
            Nova Faktura
          </button>
        </div>
        
        {activeTab === 'invoices' && (
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sačuvane Fakture</h2>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Nema sačuvanih faktura.</p>
            ) : (
              <div className="space-y-2">
                {invoices.sort((a, b) => b.createdAt - a.createdAt).map((inv) => (
                  <div 
                    key={inv.id}
                    onClick={() => setCurrentInvoice(inv)}
                    className={`p-3 rounded-lg cursor-pointer border transition-colors group ${
                      currentInvoice?.id === inv.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{inv.clientName}</div>
                        <div className="text-xs text-gray-500 mt-1">Račun br: {inv.invoiceNumber}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{inv.date}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button 
                          onClick={(e) => handleDelete(inv.id, e)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                        <span className="text-xs font-semibold text-gray-600">
                          {inv.totalAmount.toFixed(2)} {inv.currency === 'EUR' ? '€' : inv.currency === 'USD' ? '$' : 'KM'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {activeTab === 'invoices' ? (
          <>
            {/* Top Bar - Hidden when printing */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium text-gray-800">
                  {currentInvoice ? 'Faktura:' : 'Kreiranje nove fakture'}
                </h2>
                {currentInvoice && (
                  <input 
                    type="text" 
                    value={currentInvoice.invoiceNumber}
                    onChange={(e) => setCurrentInvoice({...currentInvoice, invoiceNumber: e.target.value})}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-32 focus:outline-none focus:border-blue-500"
                    placeholder="Broj računa"
                  />
                )}
              </div>
              
              {currentInvoice && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    <Save size={18} />
                    Sačuvaj
                  </button>
                  <button 
                    onClick={() => setShowFullscreenPreview(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <FileText size={18} />
                    Pregled i Preuzimanje
                  </button>
                  <button 
                    onClick={() => setShowEmailModal(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    <Send size={18} />
                    Pošalji Email
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex print:block bg-gray-100">
              
              {!currentInvoice ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center print:hidden overflow-y-auto">
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl w-full mb-6">
                    <FileText size={48} className="mx-auto text-blue-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Generiši fakturu pomoću AI</h3>
                    <p className="text-gray-500 mb-6">Unesite podatke o klijentu, uslugama i cijenama. AI će automatski popuniti fakturu.</p>
                    
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Npr. Napravi fakturu za Via Creativa, adresa Urijan Dedina 137, ID 123456789, za dizajn postera, cijena 2100 KM."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-left mb-4"
                    />
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-left">
                        {error}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Generisanje...
                          </>
                        ) : (
                          'Generiši Fakturu'
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400 w-full max-w-2xl mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="text-sm">ILI</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <button 
                    onClick={createManual}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg transition-colors font-medium shadow-sm mx-auto"
                  >
                    <Plus size={20} />
                    Kreiraj praznu fakturu ručno
                  </button>
                </div>
              ) : (
                <>
                  {/* Editor Pane */}
                  <div className="w-1/3 min-w-[400px] border-r border-gray-200 bg-white print:hidden overflow-y-auto">
                    <InvoiceEditor invoice={currentInvoice} onChange={setCurrentInvoice} />
                  </div>
                  
                  {/* Preview Pane */}
                  <div className="flex-1 overflow-y-auto p-6 print:p-0 print:bg-white">
                    <div className="max-w-[800px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:rounded-none overflow-hidden">
                      <div ref={invoiceRef}>
                        <InvoicePreview data={currentInvoice} settings={settings} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
            </div>
          </>
        ) : activeTab === 'clients' ? (
          <ClientsTab />
        ) : activeTab === 'articles' ? (
          <ArticlesTab />
        ) : activeTab === 'kasa' ? (
          <KasaTab />
        ) : activeTab === 'rates' ? (
          <ExchangeRatesTab />
        ) : null}
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          settings={settings} 
          onSave={handleSaveSettings} 
          onClose={() => setShowSettings(false)} 
          isFirstRun={!settings.companyName}
        />
      )}
      
      {showEmailModal && currentInvoice && (
        <EmailModal
          defaultEmail={currentInvoice.clientEmail || ''}
          onSend={handleSendEmail}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {showFullscreenPreview && currentInvoice && (
        <FullscreenPreviewModal
          invoice={currentInvoice}
          settings={settings}
          onClose={() => setShowFullscreenPreview(false)}
        />
      )}
    </div>
  );
}
