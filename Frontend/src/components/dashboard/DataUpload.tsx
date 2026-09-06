import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowRight, Layers, Table } from 'lucide-react';
import { readFileAsText, parseCSV, validateCSVHeaders, computeAnalytics } from '@/utils/csvParser';
import type { DashboardData } from '@/utils/csvParser';

interface Props {
  onDataLoaded: (data: DashboardData) => void;
  currentData: DashboardData | null;
}

export default function DataUpload({ onDataLoaded, currentData }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setSuccess(false);

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setError(resData.error || 'Failed to process file on server.');
        setLoading(false);
        return;
      }

      onDataLoaded(resData.data);
      setSuccess(true);
    } catch (err) {
      try {
        const text = await readFileAsText(file);
        const validation = validateCSVHeaders(text);
        if (!validation.valid) {
          setError(`Missing columns: ${validation.missing.join(', ')}`);
          setLoading(false);
          return;
        }
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setError('No data rows found in the file.');
          setLoading(false);
          return;
        }
        const data = computeAnalytics(rows);
        onDataLoaded(data);
        setSuccess(true);
      } catch (fallbackErr) {
        setError('Failed to parse the file. Please check the format.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Upload Sales CSV Dataset</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Import your store transactions to populate real-time dashboards and generate AI predictions.
        </p>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : error
            ? 'border-rose-300 bg-rose-50/20'
            : success
            ? 'border-emerald-300 bg-emerald-50/20'
            : 'border-gray-200/90 bg-white hover:border-indigo-400 hover:bg-indigo-50/20 shadow-xs'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv" onChange={handleChange} className="hidden" />

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm font-bold text-gray-800">Processing {fileName}…</p>
              <p className="text-xs text-gray-400 mt-1">Parsing rows and computing analytics</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100/70 text-emerald-600 rounded-2xl flex items-center justify-center shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">Dataset Loaded Successfully!</p>
              <p className="text-xs text-gray-500 mt-1">{fileName} • Click to upload a different CSV</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-rose-100/70 text-rose-600 rounded-2xl flex items-center justify-center shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-700">Upload Error</p>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
              <p className="text-xs text-gray-400 mt-2">Click to try again</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Drag & drop your sales CSV dataset here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse files · Supports files up to 50MB</p>
            </div>
          </div>
        )}
      </div>

      {/* CSV Column Format Reference */}
      <div className="bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-indigo-600" /> Recognized CSV Header Columns
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Product ID', 'Transaction ID', 'Date', 'Product Category',
            'Product Name', 'Units Sold', 'Unit Price', 'Total Revenue',
            'Payment Method', 'Rating', 'Reviews',
          ].map((col) => (
            <span key={col} className="text-xs bg-indigo-50/70 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-xl font-mono font-medium">
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Active Loaded Summary */}
      {currentData && (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Active Dataset Overview</p>
                <p className="text-xs text-indigo-200">{fileName || 'retail_sales_dataset.csv'}</p>
              </div>
            </div>
            <button
              onClick={() => { setSuccess(false); setFileName(''); }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
              title="Reset"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Total Rows', val: currentData.totalOrders.toLocaleString() },
              { label: 'Date Range', val: `${currentData.dateRange.from} → ${currentData.dateRange.to}` },
              { label: 'Categories', val: currentData.categories.length.toString() },
              { label: 'Unique SKUs', val: currentData.totalSKUs.toString() },
            ].map((st) => (
              <div key={st.label} className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5">
                <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">{st.label}</p>
                <p className="text-sm font-extrabold text-white mt-0.5">{st.val}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-indigo-100 flex items-center gap-1.5 pt-2">
            <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
            Switch tabs to Overview, Performance, Sentiment, or Predictive AI to explore interactive charts.
          </p>
        </div>
      )}
    </div>
  );
}
