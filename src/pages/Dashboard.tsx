import { useState, useRef, useEffect } from 'react';
import {
  Eye, LayoutDashboard, BarChart3, MessageSquareHeart, TrendingUp,
  Upload, LogOut, Search, Bell, Sparkles, User, Settings,
  AlertTriangle, Info, Moon, Sun, Home, ChevronDown, Bot, Check, Loader2, X,
  Download, FileSpreadsheet, Printer, ShieldCheck
} from 'lucide-react';
import Overview from '@/components/dashboard/Overview';
import Performance from '@/components/dashboard/Performance';
import Sentiment from '@/components/dashboard/Sentiment';
import Predictive from '@/components/dashboard/Predictive';
import DataUpload from '@/components/dashboard/DataUpload';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import ChatbotModal from '@/components/dashboard/ChatbotModal';
import PrintableReport from '@/components/dashboard/PrintableReport';
import { DashboardData, exportAnalyticsToCSV } from '@/utils/csvParser';
import { UserInfo } from '@/App';

interface Props {
  userInfo: UserInfo;
  onUpdateUserInfo: (updated: UserInfo) => void;
  onLogout: () => void;
  onGoHome?: () => void;
}

export type Section = 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload' | 'profile' | 'settings';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'predictive' | 'warning' | 'sentiment' | 'system';
}

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
}

const COUNTRIES: CountryOption[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR', symbol: '€' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', symbol: 'د.إ' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', symbol: '¥' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: '$' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: '$' },
];

interface NavItemDef {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const NAV_HOME: NavItemDef[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
];

const NAV_ANALYTICS: NavItemDef[] = [
  { id: 'sentiment', label: 'Sentiment', icon: MessageSquareHeart },
  { id: 'predictive', label: 'Predictive AI', icon: TrendingUp, badge: 'New' },
  { id: 'upload', label: 'Upload Data', icon: Upload },
];

const NAV_ACCOUNT: NavItemDef[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard({ userInfo, onUpdateUserInfo, onLogout, onGoHome }: Props) {
  const [section, setSection] = useState<Section>('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]); // Default India 🇮🇳
  const [notifications, setNotifications] = useState<NotificationItem[]>([]); // Empty by default
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [datasetFilename, setDatasetFilename] = useState<string>('');
  const [uploadState, setUploadState] = useState<{
    isUploading: boolean;
    fileName: string;
    progress: number;
    error: string | null;
  }>({
    isUploading: false,
    fileName: '',
    progress: 0,
    error: null,
  });
  const [searchValue, setSearchValue] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Sync dark class with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const handleMarkSingleRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const handleClearNotifications = () => setNotifications([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUploadState({ isUploading: false, fileName: '', progress: 0, error: null });
  };

  const handleStartUpload = async (file: File) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadState({ isUploading: false, fileName: file.name, progress: 0, error: 'Please upload a valid .csv file.' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadState({ isUploading: false, fileName: file.name, progress: 0, error: 'File too large. Maximum size is 50MB.' });
      return;
    }

    setUploadState({ isUploading: true, fileName: file.name, progress: 45, error: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setUploadState({ isUploading: false, fileName: file.name, progress: 0, error: resData.detail || 'Failed to process dataset on server.' });
        return;
      }

      setUploadState({ isUploading: false, fileName: file.name, progress: 100, error: null });
      handleDatasetLoaded(resData.data, file.name);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setUploadState({ isUploading: false, fileName: '', progress: 0, error: null });
        return;
      }
      setUploadState({ isUploading: false, fileName: file.name, progress: 0, error: 'Unable to connect to backend server. Make sure FastAPI is running on port 8000.' });
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleDatasetLoaded = (d: DashboardData, fname?: string) => {
    const filename = fname || 'sales_dataset.csv';
    setDashboardData(d);
    setDatasetFilename(filename);
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title: 'Dataset Uploaded',
      desc: `${filename} (${d.totalOrders.toLocaleString()} rows) processed and analytics generated.`,
      time: 'Just now',
      unread: true,
      type: 'predictive',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setSection('overview');
  };

  const handleDatasetRemoved = () => {
    const filename = datasetFilename || 'Dataset';
    setDashboardData(null);
    setDatasetFilename('');
    setUploadState({ isUploading: false, fileName: '', progress: 0, error: null });
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      title: 'Dataset Removed',
      desc: `${filename} has been cleared from your active session.`,
      time: 'Just now',
      unread: true,
      type: 'warning',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleExportPDF = () => {
    if (!dashboardData) return;
    window.print();
  };

  const handleExportCSV = () => {
    if (!dashboardData) return;
    const csvContent = exportAnalyticsToCSV(dashboardData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bizeye_analytics_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigate = (s: Section) => {
    setSection(s);
    setMobileSidebarOpen(false);
    setProfileDropdownOpen(false);
    setCountryDropdownOpen(false);
  };

  const initials = userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U';
  const isExpanded = sidebarExpanded || isSidebarPinned;

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-crystal-950 text-gray-800 dark:text-gray-100 flex font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">

      {/* ── HOVER-EXPANDING MINI-SIDEBAR (Crystal Black Dark / Pure Light) ── */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen ${
          isExpanded ? 'w-[250px]' : 'w-[72px]'
        } bg-white dark:bg-crystal-900 border-r border-gray-200/80 dark:border-white/[0.08] flex flex-col transition-all duration-300 ease-in-out shrink-0 shadow-sm group print:hidden`}
      >
        {/* Logo Header */}
        <div className="h-[68px] px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/[0.08]">
          <button
            onClick={() => onGoHome ? onGoHome() : navigate('overview')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            title="Go to Home Landing Page"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 transition-transform active:scale-95">
              <Eye className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
            </div>
            {isExpanded && (
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-opacity duration-200 opacity-100">
                Biz<span className="text-blue-600 dark:text-sky-400">Eye</span>
              </span>
            )}
          </button>

          {isExpanded && (
            <button
              onClick={() => setIsSidebarPinned(!isSidebarPinned)}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-crystal-800 transition-colors cursor-pointer"
              title={isSidebarPinned ? 'Unpin sidebar' : 'Pin sidebar expanded'}
            >
              <div className={`w-2 h-2 rounded-full ${isSidebarPinned ? 'bg-blue-600' : 'border border-gray-400'}`} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-thin">
          {/* HOME Group */}
          <div>
            {isExpanded && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2 font-mono">Home</p>
            )}
            <nav className="space-y-1">
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                  title={!isExpanded ? 'Home Landing Page' : undefined}
                >
                  <Home className="w-5 h-5 shrink-0 text-gray-500" />
                  {isExpanded && <span className="truncate flex-1 text-left">Landing Page</span>}
                </button>
              )}

              {NAV_HOME.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/20'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${active ? 'text-white' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ANALYTICS Group */}
          <div>
            {isExpanded && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2 font-mono">Intelligence</p>
            )}
            <nav className="space-y-1">
              {NAV_ANALYTICS.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/20'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${active ? 'text-white' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <>
                        <span className="truncate flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-sky-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ACCOUNT Group */}
          <div>
            {isExpanded && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2 font-mono">Account</p>
            )}
            <nav className="space-y-1">
              {NAV_ACCOUNT.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-blue-50/70 dark:hover:bg-blue-900/20'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${active ? 'text-white' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                  </button>
                );
              })}

              {/* Sign Out Button in Sidebar */}
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium text-rose-600 hover:bg-rose-50/80 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                title={!isExpanded ? 'Sign Out' : undefined}
              >
                <LogOut className="w-5 h-5 shrink-0 text-rose-500" />
                {isExpanded && <span className="truncate flex-1 text-left font-semibold">Sign Out</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* User Card at Sidebar Bottom */}
        <div className="p-3 border-t border-gray-100/80 dark:border-gray-700/50 bg-blue-50/40 dark:bg-blue-950/20">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all shadow-2xs">
            <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => navigate('profile')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20 shrink-0">
                {initials}
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight">{userInfo.username}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight">{userInfo.role || 'Business Owner'}</p>
                </div>
              )}
            </div>

            {isExpanded && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* ── TOP HEADER BAR ── */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-crystal-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-white/[0.08] h-[68px] flex items-center justify-between px-6 transition-colors duration-200 print:hidden">
          {/* Left Side: Mobile Sidebar Toggle + Breadcrumb & Search */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-crystal-800 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded mb-1" />
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded mb-1" />
              <div className="w-3.5 h-0.5 bg-gray-700 dark:bg-gray-300 rounded" />
            </button>

            {/* Breadcrumb / Section Title */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-semibold text-gray-400 dark:text-gray-500">Dashboard</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="font-bold text-gray-900 dark:text-white capitalize">
                {section === 'upload' ? 'Upload Data' : section === 'predictive' ? 'Predictive AI' : section}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search metrics, datasets..."
                className="w-44 sm:w-64 md:w-72 bg-gray-50 dark:bg-crystal-800 border border-gray-200/80 dark:border-white/[0.1] rounded-2xl pl-9 pr-8 py-1.5 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750 focus:w-80 transition-all duration-200"
              />
              <span className="hidden md:inline-block absolute right-3 text-[10px] font-mono text-gray-400 bg-gray-200/60 dark:bg-crystal-700 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Background Upload Status Indicator */}
            {uploadState.isUploading && (
              <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-sky-300 text-xs font-semibold shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-sky-400 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">Uploading {uploadState.fileName}...</span>
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="w-5 h-5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer ml-1 shrink-0"
                  title="Cancel upload"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Export (when data active) — single dropdown button */}
            {dashboardData && (
              <div className="hidden sm:block relative" ref={exportDropdownRef}>
                <button
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="w-9 h-9 rounded-2xl hover:bg-gray-100 dark:hover:bg-crystal-800 text-gray-600 dark:text-gray-300 transition-all cursor-pointer border border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-crystal-800 shadow-2xs flex items-center justify-center shrink-0"
                  title="Export report"
                >
                  <Download className="w-4 h-4" />
                </button>
                {exportDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 p-1.5 bg-white dark:bg-crystal-850 border border-gray-200/80 dark:border-white/[0.1] rounded-2xl shadow-lg z-50 animate-fade-in">
                    <button
                      onClick={() => { handleExportPDF(); setExportDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-crystal-800 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer rounded-xl"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" /> Export PDF
                    </button>
                    <button
                      onClick={() => { handleExportCSV(); setExportDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-crystal-800 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer rounded-xl"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Export CSV
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Country Flag Selector Dropdown (Icon Only - Default India 🇮🇳) */}
            <div className="relative" ref={countryDropdownRef}>
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="w-9 h-9 rounded-2xl hover:bg-gray-100 dark:hover:bg-crystal-800 text-gray-700 dark:text-gray-200 transition-all cursor-pointer border border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-crystal-800 shadow-2xs flex items-center justify-center shrink-0"
                title={`Selected: ${selectedCountry.name} (${selectedCountry.currency})`}
              >
                <span className="text-lg leading-none select-none flex items-center justify-center">{selectedCountry.flag}</span>
              </button>

              {countryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[196px] p-2.5 bg-white dark:bg-crystal-850 border border-gray-200/80 dark:border-white/[0.1] rounded-3xl shadow-xl z-50 animate-fade-in">
                  <div className="grid grid-cols-4 gap-2">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setSelectedCountry(c);
                          setCountryDropdownOpen(false);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer hover:scale-110 active:scale-95 shrink-0 ${
                          selectedCountry.code === c.code
                            ? 'bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500 shadow-2xs'
                            : 'hover:bg-gray-100 dark:hover:bg-crystal-800'
                        }`}
                        title={`${c.name} • ${c.currency} (${c.symbol})`}
                      >
                        <span className="leading-none select-none flex items-center justify-center">{c.flag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-2xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-crystal-800 transition-colors cursor-pointer border border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-crystal-800 shadow-2xs flex items-center justify-center shrink-0"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative w-9 h-9 rounded-2xl transition-all cursor-pointer border flex items-center justify-center shrink-0 ${
                  notificationsOpen
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 border-blue-200 dark:border-blue-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-crystal-800 border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-crystal-800 shadow-2xs'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-crystal-900" />
                )}
              </button>

              {/* Notifications Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-crystal-850 border border-gray-200/80 dark:border-white/[0.1] rounded-3xl shadow-xl z-50 animate-fade-in overflow-hidden">
                  <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-crystal-800/80 border-b border-gray-100 dark:border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer">
                            Mark read
                          </button>
                        )}
                        <button onClick={handleClearNotifications} className="text-xs text-gray-400 hover:text-rose-500 font-semibold cursor-pointer">
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">No notifications yet</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Upload a sales CSV dataset to receive automated intelligence alerts.</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleMarkSingleRead(item.id)}
                          className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                            item.unread ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/30' : 'hover:bg-gray-50 dark:hover:bg-crystal-800/40'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === 'predictive' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400' :
                            item.type === 'warning' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' :
                            item.type === 'sentiment' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' :
                            'bg-gray-100 dark:bg-crystal-800 text-gray-600'
                          }`}>
                            {item.type === 'predictive' && <TrendingUp className="w-4 h-4" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {item.type === 'sentiment' && <MessageSquareHeart className="w-4 h-4" />}
                            {item.type === 'system' && <Info className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold ${item.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
                            <span className="text-[10px] text-gray-400 font-mono mt-1 block">{item.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Dropdown Menu Trigger */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-crystal-800 transition-all cursor-pointer active:scale-95 border border-gray-200/80 dark:border-white/[0.1] bg-white dark:bg-crystal-800 shadow-2xs group"
                title="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20 shrink-0">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-crystal-850 border border-gray-200/80 dark:border-white/[0.1] rounded-3xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-gray-100 dark:divide-white/[0.06]">
                  <div className="px-5 py-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userInfo.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{userInfo.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/50">
                      <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0" /> Pro Member
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('profile')}
                      className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-crystal-800 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-400" /> View Profile
                    </button>
                    <button
                      onClick={() => navigate('settings')}
                      className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-crystal-800 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-gray-400" /> Settings & Preferences
                    </button>
                    {onGoHome && (
                      <button
                        onClick={onGoHome}
                        className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-crystal-800 hover:text-blue-600 dark:hover:text-sky-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Home className="w-4 h-4 text-gray-400" /> Home Landing Page
                      </button>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out / Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT DISPLAY (Hidden on Print) ── */}
        <main className="flex-1 overflow-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full print:hidden">
          {section === 'overview'    && <Overview     onNavigate={navigate} data={dashboardData} onExportPDF={handleExportPDF} />}
          {section === 'performance' && <Performance  onNavigate={navigate} data={dashboardData} />}
          {section === 'sentiment'   && <Sentiment    onNavigate={navigate} data={dashboardData} />}
          {section === 'predictive'  && <Predictive   onNavigate={navigate} data={dashboardData} />}
          {section === 'upload' && (
            <DataUpload
              uploadState={uploadState}
              onStartUpload={handleStartUpload}
              onCancelUpload={handleCancelUpload}
              onDataLoaded={handleDatasetLoaded}
              onDataCleared={handleDatasetRemoved}
              currentData={dashboardData}
            />
          )}
          {section === 'profile' && (
            <ProfileSettings userInfo={userInfo} initialTab="profile" onNavigate={navigate} onUpdateUserInfo={onUpdateUserInfo} />
          )}
          {section === 'settings' && (
            <ProfileSettings userInfo={userInfo} initialTab="settings" onNavigate={navigate} onUpdateUserInfo={onUpdateUserInfo} />
          )}
        </main>
      </div>

      {/* ── DEDICATED STRUCTURED EXECUTIVE REPORT FOR PDF EXPORT ── */}
      <PrintableReport
        data={dashboardData}
        userInfo={userInfo}
        datasetFilename={datasetFilename}
      />

      {/* ── FLOATING AI CHATBOT BUTTON ── */}
      <button
        onClick={() => setChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-400 hover:from-blue-700 hover:to-sky-500 text-white rounded-full border-2 border-white/80 ring-4 ring-white/20 shadow-xl shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer print:hidden"
        title="BizEye AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>

      {/* ── INTERACTIVE AI CHATBOT MODAL SCREEN ── */}
      <ChatbotModal
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        data={dashboardData}
        userInfo={userInfo}
        onNavigate={navigate}
      />
    </div>
  );
}
