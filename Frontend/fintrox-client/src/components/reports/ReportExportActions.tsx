import React, { useState } from 'react';
import reportApi from '../../api/reportApi';

interface ReportExportActionsProps {
  reportType: string;
  startDate: string;
  endDate: string;
}

const ReportExportActions: React.FC<ReportExportActionsProps> = ({
  reportType,
  startDate,
  endDate,
}) => {
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    try {
      setExporting('excel');
      const response = await reportApi.exportToExcel(reportType, startDate, endDate);
      downloadBlob(new Blob([response.data]), `${reportType}-report.xlsx`);
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting('pdf');
      const response = await reportApi.exportToPDF(reportType, startDate, endDate);
      downloadBlob(new Blob([response.data]), `${reportType}-report.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportExcel}
        disabled={exporting !== null}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">table_view</span>
        {exporting === 'excel' ? 'Exporting...' : 'Excel'}
      </button>
      <button
        onClick={handleExportPDF}
        disabled={exporting !== null}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
      </button>
    </div>
  );
};

export default ReportExportActions;