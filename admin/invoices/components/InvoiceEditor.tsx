import React, { useState, useEffect } from 'react';
import { InvoiceData, InvoiceItem, Client, Article } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { getClients, getArticles } from '../lib/storage';

interface Props {
  invoice: InvoiceData;
  onChange: (invoice: InvoiceData) => void;
}

export const InvoiceEditor: React.FC<Props> = ({ invoice, onChange }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setClients(getClients());
    setArticles(getArticles());
  }, []);

  const handleChange = (field: keyof InvoiceData, value: any) => {
    onChange({ ...invoice, [field]: value });
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    if (!clientId) return;
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      onChange({
        ...invoice,
        clientName: client.name,
        clientAddress: client.address || '',
        clientId: client.clientId || '',
        clientEmail: client.email || ''
      });
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate totals
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    
    onChange({ ...invoice, items: newItems, totalAmount });
  };

  const handleArticleSelect = (index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const articleId = e.target.value;
    if (!articleId) return;
    
    const article = articles.find(a => a.id === articleId);
    if (article) {
      const newItems = [...invoice.items];
      newItems[index] = {
        ...newItems[index],
        description: article.description,
        price: article.price,
        total: newItems[index].quantity * article.price
      };
      
      const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
      onChange({ ...invoice, items: newItems, totalAmount });
    }
  };

  const addItem = () => {
    onChange({
      ...invoice,
      items: [...invoice.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.total, 0);
    onChange({ ...invoice, items: newItems, totalAmount });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-white border-r border-gray-200">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Uređivanje fakture</h2>
        <p className="text-sm text-gray-500 mb-6">Popunite podatke ispod da biste kreirali fakturu.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Broj fakture</label>
          <input 
            type="text" 
            value={invoice.invoiceNumber} 
            onChange={e => handleChange('invoiceNumber', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Datum</label>
          <input 
            type="text" 
            value={invoice.date} 
            onChange={e => handleChange('date', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Valuta</label>
          <select 
            value={invoice.currency || 'BAM'} 
            onChange={e => handleChange('currency', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="BAM">BAM (KM)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Podaci o klijentu</h3>
          {clients.length > 0 && (
            <select 
              onChange={handleClientSelect}
              className="text-sm p-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              defaultValue=""
            >
              <option value="" disabled>Izaberi sačuvanog klijenta...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Naziv klijenta" 
            value={invoice.clientName} 
            onChange={e => handleChange('clientName', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
          <input 
            type="text" 
            placeholder="Adresa klijenta" 
            value={invoice.clientAddress || ''} 
            onChange={e => handleChange('clientAddress', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
          <input 
            type="text" 
            placeholder="JIB / ID broj klijenta (opciono)" 
            value={invoice.clientId || ''} 
            onChange={e => handleChange('clientId', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
          <input 
            type="email" 
            placeholder="Email klijenta (opciono)" 
            value={invoice.clientEmail || ''} 
            onChange={e => handleChange('clientEmail', e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Stavke na fakturi</h3>
          <button 
            onClick={addItem} 
            className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md flex items-center transition-colors font-medium"
          >
            <Plus size={16} className="mr-1" /> Dodaj stavku
          </button>
        </div>
        
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Opis usluge/proizvoda" 
                    value={item.description} 
                    onChange={e => handleItemChange(index, 'description', e.target.value)} 
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                  />
                  {articles.length > 0 && (
                    <select 
                      onChange={(e) => handleArticleSelect(index, e)}
                      className="w-48 text-sm p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                      defaultValue=""
                    >
                      <option value="" disabled>Izaberi artikal...</option>
                      {articles.map(a => (
                        <option key={a.id} value={a.id}>{a.description}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Količina</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity || ''} 
                      onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Cijena ({invoice.currency === 'EUR' ? '€' : invoice.currency === 'USD' ? '$' : 'KM'})</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={item.price || ''} 
                      onChange={e => handleItemChange(index, 'price', Number(e.target.value))} 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex-1 text-right pt-5">
                    <span className="text-sm font-bold text-gray-700">
                      ={(item.quantity * item.price).toFixed(2)} {invoice.currency === 'EUR' ? '€' : invoice.currency === 'USD' ? '$' : 'KM'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeItem(index)} 
                className="text-gray-400 hover:text-red-500 p-2 transition-colors mt-1"
                title="Ukloni stavku"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {invoice.items.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Nema dodanih stavki.
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-2">
          <div className="text-lg font-bold text-gray-800">
            Ukupno: {invoice.totalAmount.toFixed(2)} {invoice.currency === 'EUR' ? '€' : invoice.currency === 'USD' ? '$' : 'KM'}
          </div>
        </div>
      </div>

      <div className="space-y-1 pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700">Iznos slovima</label>
        <input 
          type="text" 
          placeholder="npr. stotinu konvertibilnih maraka"
          value={invoice.amountInWords} 
          onChange={e => handleChange('amountInWords', e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div className="space-y-1 pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700">Napomena</label>
        <textarea 
          placeholder="Unesite napomenu..."
          value={invoice.notes || ''} 
          onChange={e => handleChange('notes', e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[80px]" 
        />
      </div>
    </div>
  );
}

