import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ExchangeRates {
  [currency: string]: number;
}

export function ExchangeRatesTab() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using a free API for exchange rates (e.g., exchangerate-api.com or similar)
      // Note: In a real app, you'd want to handle API keys securely or use a reliable free tier.
      // For this example, we'll use a public API that doesn't require a key for basic usage,
      // or simulate it if a reliable free one isn't available without a key.
      
      // Let's use a mock for demonstration as reliable free APIs often require signup
      // In a real scenario, replace this with an actual fetch to an exchange rate API
      // e.g., fetch('https://api.exchangerate-api.com/v4/latest/BAM')
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRates: ExchangeRates = {
        'EUR': 0.51129, // 1 BAM = 0.51129 EUR (approx 1.95583 BAM = 1 EUR)
        'USD': 0.55,    // 1 BAM = 0.55 USD
        'GBP': 0.43,
        'CHF': 0.49,
        'HRK': 3.85,    // Historical, but often still referenced
        'RSD': 60.0,
      };

      setRates(mockRates);
      setLastUpdated(new Date().toLocaleString('bs-BA'));
    } catch (err) {
      setError('Nije moguće dohvatiti kursnu listu. Molimo pokušajte ponovo kasnije.');
      console.error('Greška pri dohvaćanju kursne liste:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kursna Lista</h2>
            <p className="text-gray-500 mt-1">Informativni pregled kurseva valuta u odnosu na BAM (Konvertibilna Marka)</p>
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Osježi
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <DollarSign size={20} className="text-blue-600" />
              Osnovna valuta: 1 BAM
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                Zadnje ažuriranje: {lastUpdated}
              </div>
            )}
          </div>

          {loading && !rates ? (
            <div className="p-12 flex justify-center items-center">
              <RefreshCw size={32} className="animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-6 font-semibold text-gray-600">Valuta</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Kupovni za 1 BAM</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Prodajni za 1 BAM</th>
                    <th className="py-3 px-6 font-semibold text-gray-600">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rates && Object.entries(rates).map(([currency, rateValue]) => {
                    const rate = Number(rateValue);
                    // Simulate slight differences for buy/sell and trend
                    const buyRate = (rate * 0.98).toFixed(4);
                    const sellRate = (rate * 1.02).toFixed(4);
                    const isUp = Math.random() > 0.5;

                    return (
                      <tr key={currency} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              {currency}
                            </div>
                            <span className="font-medium text-gray-800">{currency}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{buyRate}</td>
                        <td className="py-4 px-6 text-gray-600 font-medium">{sellRate}</td>
                        <td className="py-4 px-6">
                          {isUp ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <TrendingUp size={16} className="mr-1" />
                              <span>+{(Math.random() * 0.5).toFixed(2)}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 text-sm">
                              <TrendingDown size={16} className="mr-1" />
                              <span>-{(Math.random() * 0.5).toFixed(2)}%</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500 text-center">
          * Prikazani kursevi su informativnog karaktera. Za tačne informacije kontaktirajte vašu banku.
          <br/>
          (Napomena: Podaci su trenutno simulirani za demonstraciju)
        </div>
      </div>
    </div>
  );
}
