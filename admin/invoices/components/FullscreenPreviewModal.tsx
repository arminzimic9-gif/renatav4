import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Loader2, Printer } from 'lucide-react';
import { InvoiceData, UserSettings } from '../types';
import { InvoicePreview } from './InvoicePreview';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FullscreenPreviewModalProps {
  invoice: InvoiceData;
  settings: UserSettings;
  onClose: () => void;
}

export function FullscreenPreviewModal({ invoice, settings, onClose }: FullscreenPreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 64; // 32px padding on each side
      const containerHeight = containerRef.current.clientHeight - 64;
      
      const scaleX = containerWidth / 794;
      const scaleY = containerHeight / 1123;
      
      // Use the smaller scale to fit both width and height, but don't scale up beyond 1
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = invoiceRef.current;
      
      const clone = element.cloneNode(true) as HTMLElement;
      document.body.appendChild(clone);
      clone.style.transform = 'none';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '794px';
      clone.style.maxWidth = 'none';
      clone.style.minHeight = '1123px';
      clone.style.backgroundColor = '#ffffff';

      const canvas = await html2canvas(clone, {
        scale: 1.5, // High resolution
        useCORS: true,
        logging: false,
        width: 794,
        windowWidth: 794,
      });
      
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Faktura_${invoice.invoiceNumber.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Greška pri generisanju PDF-a:', error);
      alert('Došlo je do greške prilikom generisanja PDF-a.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm print:bg-white print:block">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 print:hidden">
        <h2 className="text-xl font-semibold text-white">Pregled Fakture (A4 Format)</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 transition-colors bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white"
          >
            <Printer size={20} />
            <span className="font-medium">Štampaj</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400"
          >
            {isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            <span className="font-medium">{isDownloading ? 'Generisanje PDF-a...' : 'Preuzmi PDF'}</span>
          </button>
          <div className="w-px h-8 mx-2 bg-gray-700"></div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-800 hover:text-white"
            title="Zatvori pregled"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-8 flex justify-center items-start print:p-0 print:overflow-visible"
      >
        {/* A4 Container (210mm x 297mm aspect ratio) */}
        <div 
          className="relative shadow-2xl bg-[#ffffff] origin-top" 
          style={{ 
            width: '794px', 
            minHeight: '1123px',
            transform: `scale(${scale})`,
            marginBottom: `-${1123 * (1 - scale)}px` // Prevent extra scroll space
          }}
        >
          <div ref={invoiceRef} className="w-full h-full bg-[#ffffff]" style={{ width: '794px', minHeight: '1123px' }}>
            <InvoicePreview data={invoice} settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
