import React, { useState, useEffect } from 'react';
import { getInvoices } from '../lib/storage';
import { InvoiceData } from '../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ArticleStat {
  description: string;
  currency: string;
  quantity: number;
  total: number;
}

export const KasaTab = () => {
  const [stats, setStats] = useState<ArticleStat[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const invoices = getInvoices();
    const statsMap: { [key: string]: ArticleStat } = {};
    const revenueMap: { [key: string]: number } = { BAM: 0, EUR: 0, USD: 0 };

    invoices.forEach(inv => {
      const currency = inv.currency || 'BAM';
      revenueMap[currency] += inv.totalAmount;

      inv.items.forEach(item => {
        const key = `${item.description}_${currency}`;
        if (!statsMap[key]) {
          statsMap[key] = {
            description: item.description,
            currency: currency,
            quantity: 0,
            total: 0
          };
        }
        statsMap[key].quantity += item.quantity;
        statsMap[key].total += item.total;
      });
    });

    setStats(Object.values(statsMap).sort((a, b) => b.total - a.total));
    setTotalRevenue(revenueMap);
  }, []);

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <BarChart3 size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Kasa / Izvještaji</h2>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {['BAM', 'EUR', 'USD'].map(currency => (
          totalRevenue[currency] > 0 && (
            <div key={currency} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-full text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ukupna zarada ({currency})</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalRevenue[currency].toFixed(2)} {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'KM'}
                </p>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-700">Zarada po artiklima / uslugama</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-600">Artikal / Usluga</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Prodana količina</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Ukupna zarada</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500 italic">
                    Nema podataka za prikaz. Kreirajte i sačuvajte fakture da biste vidjeli statistiku.
                  </td>
                </tr>
              ) : (
                stats.map((stat, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-800 font-medium">{stat.description}</td>
                    <td className="p-4 text-sm text-gray-600 text-center">
                      <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full font-medium">
                        {stat.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-bold text-right">
                      {stat.total.toFixed(2)} {stat.currency === 'EUR' ? '€' : stat.currency === 'USD' ? '$' : 'KM'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
