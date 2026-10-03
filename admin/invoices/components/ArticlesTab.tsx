import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { getArticles, saveArticle, deleteArticle } from '../lib/storage';
import { Plus, Trash2, Save, Edit2, X } from 'lucide-react';

export const ArticlesTab = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      saveArticle(editingArticle);
      setArticles(getArticles());
      setEditingArticle(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Da li ste sigurni da želite obrisati ovaj artikal?')) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const createNew = () => {
    setEditingArticle({
      id: `article-${Date.now()}`,
      description: '',
      price: 0
    });
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Artikli / Usluge</h2>
        <button 
          onClick={createNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Plus size={18} />
          Novi Artikal
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Lista artikala</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {articles.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">Nema sačuvanih artikala.</p>
            ) : (
              articles.map(article => (
                <div key={article.id} className="p-3 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors flex justify-between items-center group">
                  <div>
                    <div className="font-medium text-gray-800">{article.description}</div>
                    <div className="text-sm font-semibold text-gray-600 mt-1">{article.price.toFixed(2)} KM</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingArticle(article)} className="text-gray-400 hover:text-blue-600 p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {editingArticle && (
          <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                {articles.some(a => a.id === editingArticle.id) ? 'Uredi artikal' : 'Novi artikal'}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis artikla / usluge *</label>
                <input 
                  type="text" 
                  required
                  value={editingArticle.description} 
                  onChange={e => setEditingArticle({...editingArticle, description: e.target.value})} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (KM) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={editingArticle.price || ''} 
                  onChange={e => setEditingArticle({...editingArticle, price: Number(e.target.value)})} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                  <Save size={18} />
                  Sačuvaj artikal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
