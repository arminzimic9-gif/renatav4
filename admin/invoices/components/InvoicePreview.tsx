import React from 'react';
import { InvoiceData, UserSettings } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  settings: UserSettings;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bs-BA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, settings }) => {
  const color = settings.primaryColor;
  const font = settings.fontFamily || 'Arial, Helvetica, sans-serif';
  const currency = data.currency || 'BAM';
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'KM';
  const template = settings.template || 'modern';
  
  if (template === 'classic') {
    return (
      <div className="invoice-box max-w-[800px] mx-auto p-10 border-none bg-[#ffffff] text-[#000000]" style={{ fontFamily: font }}>
        <div className="flex justify-between items-start mb-8 border-b-4 border-[#000000] pb-6">
          <div className="w-1/2">
            <h1 className="text-4xl font-bold uppercase mb-2">RAČUN</h1>
            <p className="text-sm font-bold mb-1">Broj: {data.invoiceNumber}</p>
            <p className="text-sm">Datum: {data.date}</p>
            <p className="text-sm">Mjesto: Sarajevo</p>
          </div>
          <div className="w-1/2 text-right">
            <h2 className="text-2xl font-bold uppercase mb-2">{settings.companyName}</h2>
            <p className="text-sm">{settings.address}</p>
            <p className="text-sm">ID: {settings.idNumber}</p>
            <p className="text-sm">Tel: {settings.phone}</p>
            <p className="text-sm">Email: {settings.email}</p>
            {settings.website && <p className="text-sm">Web: {settings.website}</p>}
          </div>
        </div>

        <div className="mb-8 border-2 border-[#000000] p-4">
          <h3 className="text-sm font-bold uppercase mb-2 border-b border-[#000000] pb-1">Kupac / Primalac:</h3>
          <p className="font-bold text-lg">{data.clientName}</p>
          {data.clientAddress && <p className="text-sm">{data.clientAddress}</p>}
          <p className="text-sm mt-1">ID broj: {data.clientId}</p>
        </div>

        <table className="w-full border-collapse mb-8 border-2 border-[#000000]">
          <thead>
            <tr className="border-b-2 border-[#000000] bg-[#f3f4f6]">
              <th className="text-left p-2 text-sm font-bold border-r border-[#000000] w-[5%]">R.b.</th>
              <th className="text-left p-2 text-sm font-bold border-r border-[#000000] w-[50%]">Opis</th>
              <th className="text-center p-2 text-sm font-bold border-r border-[#000000] w-[10%]">Kol.</th>
              <th className="text-right p-2 text-sm font-bold border-r border-[#000000] w-[15%]">Cijena</th>
              <th className="text-right p-2 text-sm font-bold w-[20%]">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className="border-b border-[#000000]">
                <td className="p-2 text-sm border-r border-[#000000]">{index + 1}.</td>
                <td className="p-2 text-sm border-r border-[#000000]">{item.description}</td>
                <td className="p-2 text-sm text-center border-r border-[#000000]">{item.quantity}</td>
                <td className="p-2 text-sm text-right border-r border-[#000000]">{formatCurrency(item.price)}</td>
                <td className="p-2 text-sm text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start mb-8">
          <div className="w-1/2 text-sm">
            <p className="font-bold mb-1">Bankovni podaci:</p>
            {currency === 'BAM' && <p>TRN: {settings.bankAccount}</p>}
            {currency === 'EUR' && settings.bankAccountEUR && (
              <><p>Banka: {settings.bankName}</p><p>SWIFT: {settings.swift}</p><p>IBAN (EUR): {settings.bankAccountEUR}</p></>
            )}
            {currency === 'USD' && settings.bankAccountUSD && (
              <><p>Banka: {settings.bankName}</p><p>SWIFT: {settings.swift}</p><p>IBAN (USD): {settings.bankAccountUSD}</p></>
            )}
            <p className="mt-4 italic">Slovima: {data.amountInWords}</p>
          </div>
          <div className="w-1/3">
            <table className="w-full border-collapse border-2 border-[#000000]">
              <tbody>
                <tr className="border-b border-[#000000]">
                  <td className="p-2 text-sm font-bold">Iznos:</td>
                  <td className="p-2 text-sm text-right">{formatCurrency(data.totalAmount)} {currencySymbol}</td>
                </tr>
                <tr className="border-b border-[#000000]">
                  <td className="p-2 text-sm font-bold">PDV (0%):</td>
                  <td className="p-2 text-sm text-right">0,00 {currencySymbol}</td>
                </tr>
                <tr className="bg-[#f3f4f6]">
                  <td className="p-2 text-lg font-bold">UKUPNO:</td>
                  <td className="p-2 text-lg font-bold text-right">{formatCurrency(data.totalAmount)} {currencySymbol}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {data.notes && (
          <div className="mb-12 text-sm border-t border-[#000000] pt-4 whitespace-pre-wrap">
            <strong>Napomena:</strong><br />
            {data.notes}
          </div>
        )}

        <div className="flex justify-between items-end mt-16">
          <div className="w-[40%] text-center border-t border-[#000000] pt-2 text-sm">
            Potpis kupca
          </div>
          <div className="w-[40%] text-center border-t border-[#000000] pt-2 text-sm relative">
            {settings.signatureImage && (
              <img src={settings.signatureImage} alt="Potpis" className="absolute bottom-full left-1/2 -translate-x-1/2 max-h-20 mb-1 object-contain" />
            )}
            M.P. Ovlašteno lice
          </div>
        </div>

        {settings.bottomLogoImage && (
          <div className="mt-12 flex justify-center w-full">
            <img src={settings.bottomLogoImage} alt="Logo Dno" className="max-h-24 object-contain" />
          </div>
        )}
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className="invoice-box max-w-[800px] mx-auto p-12 border-none bg-[#ffffff] text-[#1f2937]" style={{ fontFamily: font }}>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-widest uppercase mb-2" style={{ color }}>{settings.companyName}</h1>
          <p className="text-xs text-[#6b7280] tracking-wider">{settings.address} • {settings.email} • {settings.phone}</p>
        </div>

        <div className="flex justify-between items-end mb-12 pb-4 border-b border-[#e5e7eb]">
          <div>
            <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">Fakturisano za</p>
            <p className="text-lg font-medium">{data.clientName}</p>
            {data.clientAddress && <p className="text-sm text-[#4b5563]">{data.clientAddress}</p>}
            <p className="text-sm text-[#4b5563]">ID: {data.clientId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#9ca3af] uppercase tracking-wider mb-1">Faktura br.</p>
            <p className="text-xl font-light mb-2">{data.invoiceNumber}</p>
            <p className="text-sm text-[#4b5563]">Datum: {data.date}</p>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr>
              <th className="text-left py-3 text-xs text-[#9ca3af] uppercase tracking-wider font-normal border-b border-[#e5e7eb] w-[60%]">Opis</th>
              <th className="text-center py-3 text-xs text-[#9ca3af] uppercase tracking-wider font-normal border-b border-[#e5e7eb] w-[10%]">Kol</th>
              <th className="text-right py-3 text-xs text-[#9ca3af] uppercase tracking-wider font-normal border-b border-[#e5e7eb] w-[15%]">Cijena</th>
              <th className="text-right py-3 text-xs text-[#9ca3af] uppercase tracking-wider font-normal border-b border-[#e5e7eb] w-[15%]">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-sm border-b border-[#f3f4f6]">{item.description}</td>
                <td className="py-4 text-sm text-center border-b border-[#f3f4f6]">{item.quantity}</td>
                <td className="py-4 text-sm text-right border-b border-[#f3f4f6]">{formatCurrency(item.price)}</td>
                <td className="py-4 text-sm text-right border-b border-[#f3f4f6]">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-sm text-[#4b5563]">
              <span>Iznos</span>
              <span>{formatCurrency(data.totalAmount)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-2 text-sm text-[#4b5563] border-b border-[#e5e7eb]">
              <span>PDV (0%)</span>
              <span>0,00 {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-light" style={{ color }}>
              <span>Ukupno</span>
              <span>{formatCurrency(data.totalAmount)} {currencySymbol}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-xs text-[#6b7280] mb-16">
          <div>
            <p className="uppercase tracking-wider text-[#9ca3af] mb-2">Plaćanje</p>
            {currency === 'BAM' && <p>TRN: {settings.bankAccount}</p>}
            {currency === 'EUR' && settings.bankAccountEUR && (
              <><p>Banka: {settings.bankName}</p><p>SWIFT: {settings.swift}</p><p>IBAN: {settings.bankAccountEUR}</p></>
            )}
            {currency === 'USD' && settings.bankAccountUSD && (
              <><p>Banka: {settings.bankName}</p><p>SWIFT: {settings.swift}</p><p>IBAN: {settings.bankAccountUSD}</p></>
            )}
            <p className="mt-2">Slovima: {data.amountInWords}</p>
          </div>
          {data.notes && (
            <div>
              <p className="uppercase tracking-wider text-[#9ca3af] mb-2">Napomena</p>
              <p className="whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-12">
          <div className="w-48 text-center border-t border-[#d1d5db] pt-2 text-xs text-[#6b7280] relative">
            {settings.signatureImage && (
              <img src={settings.signatureImage} alt="Potpis" className="absolute bottom-full left-1/2 -translate-x-1/2 max-h-16 mb-2 object-contain" />
            )}
            Ovlašteno lice
          </div>
        </div>

        {settings.bottomLogoImage && (
          <div className="mt-12 flex justify-center w-full">
            <img src={settings.bottomLogoImage} alt="Logo Dno" className="max-h-24 object-contain" />
          </div>
        )}
      </div>
    );
  }

  // Default 'modern' template
  return (
    <div className="invoice-box max-w-[800px] mx-auto p-10 border-none bg-[#ffffff] text-[#333]" style={{ fontFamily: font }}>
      <div className="header flex justify-between mb-10 border-b-2 pb-5" style={{ borderColor: color }}>
        <div className="sender-details">
          <h2 className="m-0 mb-2.5 uppercase text-2xl font-bold" style={{ color }}>OD {settings.companyName}</h2>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]"><strong>{settings.ownerName}</strong></p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">{settings.address}</p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">ID broj: <strong>{settings.idNumber}</strong></p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">Tel: {settings.phone}</p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">Email: {settings.email}</p>
          {settings.website && <p className="m-0 mt-0.5 text-[13px] text-[#555]">Web: {settings.website}</p>}
          
          {currency === 'BAM' && (
            <p className="m-0 mt-0.5 text-[13px] text-[#555]"><strong>TRN: {settings.bankAccount}</strong></p>
          )}
          {currency === 'EUR' && settings.bankAccountEUR && (
            <>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]">Banka: {settings.bankName}</p>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]">SWIFT: {settings.swift}</p>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]"><strong>IBAN (EUR): {settings.bankAccountEUR}</strong></p>
            </>
          )}
          {currency === 'USD' && settings.bankAccountUSD && (
            <>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]">Banka: {settings.bankName}</p>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]">SWIFT: {settings.swift}</p>
              <p className="m-0 mt-0.5 text-[13px] text-[#555]"><strong>IBAN (USD): {settings.bankAccountUSD}</strong></p>
            </>
          )}
        </div>
        <div className="invoice-meta text-right">
          <h1 className="m-0 mb-2.5 text-[32px] text-[#333] font-bold">RAČUN br. {data.invoiceNumber}</h1>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">Datum računa: <strong>{data.date}</strong></p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">Mjesto izdavanja: <strong>Sarajevo</strong></p>
          <p className="m-0 mt-0.5 text-[13px] text-[#555]">Valuta plaćanja: <strong>{currency}</strong></p>
        </div>
      </div>

      <div className="client-section mb-10 p-4 bg-[#f9fbfc] border-l-4" style={{ borderColor: color }}>
        <h3 className="m-0 mb-2.5 text-sm uppercase font-bold" style={{ color }}>Klijent (Primalac računa):</h3>
        <p className="m-0 mt-1 text-sm"><strong>{data.clientName}</strong></p>
        {data.clientAddress && <p className="m-0 mt-1 text-sm">{data.clientAddress}</p>}
        <p className="m-0 mt-1 text-sm">ID broj: {data.clientId}</p>
      </div>

      <table className="w-full border-collapse mb-7">
        <thead>
          <tr>
            <th className="text-[#ffffff] text-left p-3 text-[13px] uppercase font-bold w-[5%]" style={{ backgroundColor: color }}>R.br.</th>
            <th className="text-[#ffffff] text-left p-3 text-[13px] uppercase font-bold w-[55%]" style={{ backgroundColor: color }}>Artikal / Opis usluge</th>
            <th className="text-[#ffffff] text-right p-3 text-[13px] uppercase font-bold w-[10%]" style={{ backgroundColor: color }}>Kol.</th>
            <th className="text-[#ffffff] text-right p-3 text-[13px] uppercase font-bold w-[15%]" style={{ backgroundColor: color }}>Cijena</th>
            <th className="text-[#ffffff] text-right p-3 text-[13px] uppercase font-bold w-[15%]" style={{ backgroundColor: color }}>Ukupno</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={item.id}>
              <td className="p-3 border-b border-[#eee] text-sm">{index + 1}.</td>
              <td className="p-3 border-b border-[#eee] text-sm">{item.description}</td>
              <td className="p-3 border-b border-[#eee] text-sm text-right">{item.quantity}</td>
              <td className="p-3 border-b border-[#eee] text-sm text-right">{formatCurrency(item.price)}</td>
              <td className="p-3 border-b border-[#eee] text-sm text-right">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals w-full flex justify-end">
        <table className="totals-table w-[300px] border-collapse">
          <tbody>
            <tr>
              <td className="p-2 border-b border-[#eee]">Prodajna vrijednost:</td>
              <td className="p-2 border-b border-[#eee] text-right">{formatCurrency(data.totalAmount)} {currencySymbol}</td>
            </tr>
            <tr>
              <td className="p-2 border-b border-[#eee]">PDV (0%):</td>
              <td className="p-2 border-b border-[#eee] text-right">0,00 {currencySymbol}</td>
            </tr>
            <tr>
              <td className="grand-total font-bold text-lg border-t-2 p-2" style={{ color: color, borderColor: color }}>ZA UPLATU:</td>
              <td className="grand-total font-bold text-lg border-t-2 p-2 text-right" style={{ color: color, borderColor: color }}>{formatCurrency(data.totalAmount)} {currencySymbol}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="amount-in-words mt-5 italic text-[13px] text-[#666]">
        Slovima: {data.amountInWords}
      </div>

      {data.notes && (
        <div className="footer-notes mt-10 text-xs text-[#777] border-t border-[#eee] pt-2.5 whitespace-pre-wrap">
          <strong>Napomena:</strong><br />
          {data.notes}
        </div>
      )}

      <div className="signatures flex justify-between mt-20 mb-5">
        <div className="signature-box w-[40%] text-center border-t border-[#333] pt-2.5 text-sm font-medium">
          <br />
          Za komitenta:<br />
          <strong>{data.clientName}</strong>
        </div>
        <div className="signature-box w-[40%] text-center border-t border-[#333] pt-2.5 text-sm font-medium relative">
          {settings.signatureImage && (
            <img src={settings.signatureImage} alt="Potpis" className="absolute bottom-full left-1/2 -translate-x-1/2 max-h-24 mb-2 object-contain" />
          )}
          <br />
          M.P.<br />
          Ovlašteno lice
        </div>
      </div>

      {settings.bottomLogoImage && (
        <div className="mt-8 flex justify-center w-full pb-4">
          <img src={settings.bottomLogoImage} alt="Logo Dno" className="max-h-24 object-contain" />
        </div>
      )}
    </div>
  );
};
