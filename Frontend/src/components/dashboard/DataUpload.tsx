import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowRight, Table, Trash2 } from 'lucide-react';
import { readFileAsText, parseCSV, validateCSVHeaders, computeAnalytics } from '@/utils/csvParser';
import type { DashboardData } from '@/utils/csvParser';

interface Props {
  onDataLoaded: (data: DashboardData, fileName?: string) => void;
  onDataCleared?: () => void;
  currentData: DashboardData | null;
}

export default function DataUpload({ onDataLoaded, onDataCleared, currentData }: Props) {
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

      onDataLoaded(resData.data, file.name);
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
        onDataLoaded(data, file.name);
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

  const handleClear = () => {
    setSuccess(false);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
    if (onDataCleared) onDataCleared();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Upload Sales CSV Dataset</h2>
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
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
            : error
            ? 'border-rose-300 dark:border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/20'
            : success
            ? 'border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20'
            : 'border-gray-200/90 dark:border-white/[0.08] bg-white dark:bg-crystal-900 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-crystal-850 shadow-xs'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv" onChange={handleChange} className="hidden" />

        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Processing {fileName}…</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Parsing rows and computing analytics</p>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Dataset Loaded Successfully!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{fileName} • Click to upload a different CSV</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-rose-100/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400">Upload Error</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Click to try again</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-center justify-center shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Drag & drop your sales CSV dataset here</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">or click to browse files · Supports files up to 50MB</p>
            </div>
          </div>
        )}
      </div>

      {/* CSV Column Format Reference */}
      <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-600 dark:text-sky-400" /> Recognized CSV Header Columns
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Product ID', 'Transaction ID', 'Date', 'Product Category',
            'Product Name', 'Units Sold', 'Unit Price', 'Total Revenue',
            'Payment Method', 'Rating', 'Reviews',
          ].map((col) => (
            <span key={col} className="text-xs bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-sky-300 border border-blue-100 dark:border-blue-500/20 px-3 py-1.5 rounded-xl font-mono font-medium">
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Active Loaded Summary */}
      {currentData && (
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Active Dataset Overview</p>
                <p className="text-xs text-blue-100">{fileName || 'Active Dataset'}</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/80 transition-colors text-white text-xs font-semibold cursor-pointer"
              title="Remove Dataset"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Dataset
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Total Rows', val: currentData.totalOrders.toLocaleString() },
              { label: 'Date Range', val: `${currentData.dateRange.from} → ${currentData.dateRange.to}` },
              { label: 'Categories', val: currentData.categories.length.toString() },
              { label: 'Unique SKUs', val: currentData.totalSKUs.toString() },
            ].map((st) => (
              <div key={st.label} className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10">
                <p className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">{st.label}</p>
                <p className="text-sm font-extrabold text-white mt-0.5">{st.val}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-blue-100 flex items-center gap-1.5 pt-2">
            <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
            Switch tabs to Overview, Performance, Sentiment, or Predictive AI to explore interactive charts.
          </p>
        </div>
      )}
    </div>
  );
}

