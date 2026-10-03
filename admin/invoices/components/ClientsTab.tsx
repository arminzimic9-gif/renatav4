import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { getClients, saveClient, deleteClient } from '../lib/storage';
import { Plus, Trash2, Save, Edit2, X } from 'lucide-react';

export const ClientsTab = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      saveClient(editingClient);
      setClients(getClients());
      setEditingClient(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Da li ste sigurni da želite obrisati ovog klijenta?')) {
      deleteClient(id);
      setClients(getClients());
    }
  };

  const createNew = () => {
    setEditingClient({
      id: `client-${Date.now()}`,
      name: '',
      address: '',
      clientId: ''
    });
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Klijenti</h2>
        <button 
          onClick={createNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Plus size={18} />
          Novi Klijent
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Lista klijenata</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {clients.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">Nema sačuvanih klijenata.</p>
            ) : (
              clients.map(client => (
                <div key={client.id} className="p-3 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors flex justify-between items-start group">
                  <div>
                    <div className="font-medium text-gray-800">{client.name}</div>
                    {client.clientId && <div className="text-xs text-gray-500 mt-1">ID: {client.clientId}</div>}
                    {client.address && <div className="text-xs text-gray-500 mt-0.5">{client.address}</div>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingClient(client)} className="text-gray-400 hover:text-blue-600 p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {editingClient && (
          <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                {clients.some(c => c.id === editingClient.id) ? 'Uredi klijenta' : 'Novi klijent'}
              </h3>
              <button onClick={() => setEditingClient(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv klijenta *</label>
                <input 
                  type="text" 
                  required
                  value={editingClient.name} 
                  onChange={e => setEditingClient({...editingClient, name: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa klijenta</label>
                <input 
                  type="text" 
                  value={editingClient.address} 
                  onChange={e => setEditingClient({...editingClient, address: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">JIB / ID broj</label>
                <input 
                  type="text" 
                  value={editingClient.clientId} 
                  onChange={e => setEditingClient({...editingClient, clientId: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                  <Save size={18} />
                  Sačuvaj klijenta
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
