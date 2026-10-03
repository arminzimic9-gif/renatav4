import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '../components/Button';
import { Loader2, LogOut, Save, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { translations as defaultTranslations } from '../translations';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAdmin();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(defaultTranslations);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  // Protect route
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/admin');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'website_content', 'translations');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(defaultTranslations); // fallback
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: '', type: 'success' });
    try {
      await setDoc(doc(db, 'website_content', 'translations'), data);
      setMessage({ text: 'Promjene su uspješno sačuvane! Osvježite stranicu da vidite promjene.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Greška pri spašavanju. Nemate permisije (Firebase Rules).', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = (path: string[], value: any) => {
    setData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-brand-dark">HabitPlus CMS</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={async () => { await logout(); navigate('/admin'); }}>
            <LogOut size={16} className="mr-2" /> Odjava
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="shadow-lg">
            {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
            Spasi promjene
          </Button>
        </div>
      </header>

      {message.text && (
        <div className={`px-6 py-3 flex items-center gap-2 justify-center font-medium shadow-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          <CheckCircle2 size={18} /> {message.text}
        </div>
      )}

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
          <p className="text-gray-500 mb-8">Pazite prilikom mijenjana koda – sve promjene su odmah vidljive svim korisnicima nakon spašavanja.</p>
          
          <div className="space-y-4">
            {Object.keys(data).map((langKey) => (
              <RenderObject 
                key={langKey} 
                nodeKey={langKey} 
                data={data[langKey]} 
                path={[langKey]} 
                onUpdate={handleUpdate} 
                defaultExpanded={true}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Recursive Component to render dynamic nested objects
const RenderObject: React.FC<{
  nodeKey: string;
  data: any;
  path: string[];
  onUpdate: (path: string[], value: any) => void;
  defaultExpanded?: boolean;
}> = ({ nodeKey, data, path, onUpdate, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isObject = data !== null && typeof data === 'object' && !Array.isArray(data);
  const isArray = Array.isArray(data);

  if (isObject) {
    return (
      <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4 bg-gray-50/50">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full text-left px-4 py-3 bg-white font-bold text-brand-dark flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
            {nodeKey}
          </span>
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Objekat</span>
        </button>
        {expanded && (
          <div className="p-4 pl-6 border-t border-gray-100 space-y-4">
            {Object.keys(data).map((childKey) => (
              <RenderObject 
                key={childKey} 
                nodeKey={childKey} 
                data={data[childKey]} 
                path={[...path, childKey]} 
                onUpdate={onUpdate} 
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isArray) {
    return (
      <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4 bg-gray-50/50">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full text-left px-4 py-3 bg-white font-bold text-brand-dark flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            {expanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
            {nodeKey}
          </span>
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Lista ({data.length})</span>
        </button>
        {expanded && (
          <div className="p-4 pl-6 border-t border-gray-100 space-y-4">
            {data.map((item: any, index: number) => (
              <RenderObject 
                key={index} 
                nodeKey={`[${index}]`} 
                data={item} 
                path={[...path, index.toString()]} 
                onUpdate={onUpdate} 
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Primitive values (string, number, boolean)
  const isLongText = typeof data === 'string' && data.length > 50;

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-600 mb-1">{nodeKey}</label>
      {isLongText ? (
        <textarea
          value={data}
          onChange={(e) => onUpdate(path, e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-brand-dark font-medium resize-y min-h-[100px]"
        />
      ) : (
        <input
          type={typeof data === 'number' ? 'number' : 'text'}
          value={data}
          onChange={(e) => onUpdate(path, typeof data === 'number' ? Number(e.target.value) : e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-brand-dark font-medium"
        />
      )}
    </div>
  );
};
