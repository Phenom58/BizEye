import { useState, useRef, useEffect } from 'react';
import {
  Eye, LayoutDashboard, BarChart3, MessageSquareHeart, TrendingUp,
  Upload, LogOut, Search, Bell, Sparkles, User, Settings,
  CheckCheck, AlertTriangle, Info, X, Moon, Sun, ShoppingCart, Home, ChevronDown
} from 'lucide-react';
import Overview from '@/components/dashboard/Overview';
import Performance from '@/components/dashboard/Performance';
import Sentiment from '@/components/dashboard/Sentiment';
import Predictive from '@/components/dashboard/Predictive';
import DataUpload from '@/components/dashboard/DataUpload';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import { DashboardData } from '@/utils/csvParser';
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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Demand Growth Predicted',
    desc: 'Category sales are projected to grow by +18% next month based on historical trends.',
    time: '10m ago',
    unread: true,
    type: 'predictive',
  },
  {
    id: '2',
    title: 'Low Inventory Alert',
    desc: 'Top seller inventory is running low. Estimated 8 active days remaining.',
    time: '1h ago',
    unread: true,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Positive Sentiment Spike',
    desc: 'Customer review satisfaction score reached 88% (+4.2% increase).',
    time: '3h ago',
    unread: true,
    type: 'sentiment',
  },
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
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const handleMarkSingleRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const handleClearNotifications = () => setNotifications([]);

  const navigate = (s: Section) => {
    setSection(s);
    setMobileSidebarOpen(false);
    setProfileDropdownOpen(false);
  };

  const initials = userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U';
  const isExpanded = sidebarExpanded || isSidebarPinned;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121824] text-gray-100' : 'bg-[#F4F7FB] text-gray-800'} flex font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300`}>

      {/* ── HOVER-EXPANDING MINI-SIDEBAR (Modernize React UI) ── */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen ${
          isExpanded ? 'w-[250px]' : 'w-[72px]'
        } ${darkMode ? 'bg-[#1e2738] border-gray-700/60' : 'bg-white border-gray-100/90'} border-r flex flex-col transition-all duration-300 ease-in-out shrink-0 shadow-sm group`}
      >
        {/* Logo Header */}
        <div className="h-[68px] px-4 flex items-center justify-between border-b border-gray-100/70">
          <button
            onClick={() => onGoHome ? onGoHome() : navigate('overview')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            title="Go to Home Landing Page"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0 transition-transform active:scale-95">
              <Eye className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
            </div>
            {isExpanded && (
              <span className="text-xl font-bold tracking-tight text-gray-900 transition-opacity duration-200 opacity-100">
                Biz<span className="text-indigo-600">Eye</span>
              </span>
            )}
          </button>

          {isExpanded && (
            <button
              onClick={() => setIsSidebarPinned(!isSidebarPinned)}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title={isSidebarPinned ? 'Unpin sidebar' : 'Pin sidebar expanded'}
            >
              <div className={`w-2 h-2 rounded-full ${isSidebarPinned ? 'bg-indigo-600' : 'border border-gray-400'}`} />
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
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all duration-200 cursor-pointer active:scale-[0.98]"
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
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70'
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
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                    }`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform ${active ? 'text-white' : 'text-gray-500'}`} />
                    {isExpanded && (
                      <>
                        <span className="truncate flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-cyan-400 text-black font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
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
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/70'
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
        <div className="p-3 border-t border-gray-100/80 bg-blue-50/40">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl hover:bg-white transition-all shadow-2xs">
            <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => navigate('profile')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                {initials}
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate leading-tight">{userInfo.username}</p>
                  <p className="text-[10px] text-gray-500 truncate leading-tight">{userInfo.role || 'Business Owner'}</p>
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
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100/90 h-[68px] flex items-center justify-between px-6 transition-all duration-200">
          {/* Left Side: Navigation Quick Tabs & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <div className="w-5 h-0.5 bg-gray-700 rounded mb-1" />
              <div className="w-5 h-0.5 bg-gray-700 rounded mb-1" />
              <div className="w-3.5 h-0.5 bg-gray-700 rounded" />
            </button>

            {/* Quick Nav Links */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/70 p-1 rounded-2xl text-xs font-medium text-gray-600">
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="px-3 py-1.5 rounded-xl hover:text-indigo-600 hover:bg-white transition-all flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-indigo-600" /> Home Landing
                </button>
              )}

              {[
                { id: 'overview', label: 'Overview' },
                { id: 'performance', label: 'Performance' },
                { id: 'sentiment', label: 'Sentiment' },
                { id: 'predictive', label: 'Predictive' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    section === t.id ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'hover:text-gray-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search metrics, datasets..."
                className="w-44 sm:w-64 bg-gray-50 border border-gray-200/80 rounded-2xl pl-9 pr-8 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:w-72 transition-all duration-200"
              />
              <span className="hidden sm:inline-block absolute right-3 text-[10px] font-mono text-gray-400 bg-gray-200/60 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-2xl hover:bg-gray-100 text-gray-600 transition-colors text-base cursor-pointer" title="Language">
              🇬🇧
            </button>

            <button className="hidden sm:flex relative items-center justify-center w-9 h-9 rounded-2xl hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer" title="Cart">
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                0
              </span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-2xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-2xl transition-all cursor-pointer ${
                  notificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notifications Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-3xl shadow-xl z-50 animate-fade-in overflow-hidden">
                  <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No notifications right now.</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleMarkSingleRead(item.id)}
                          className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                            item.unread ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === 'predictive' ? 'bg-blue-100 text-blue-600' :
                            item.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            item.type === 'sentiment' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {item.type === 'predictive' && <TrendingUp className="w-4 h-4" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {item.type === 'sentiment' && <MessageSquareHeart className="w-4 h-4" />}
                            {item.type === 'system' && <Info className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold ${item.unread ? 'text-gray-900' : 'text-gray-600'}`}>{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{item.desc}</p>
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
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer active:scale-95 border border-gray-200/60 bg-white"
              >
                <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-500/20">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-3xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-gray-100">
                  <div className="px-5 py-3">
                    <p className="text-sm font-bold text-gray-900 truncate">{userInfo.username}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{userInfo.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> Pro Member
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('profile')}
                      className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-400" /> View Profile
                    </button>
                    <button
                      onClick={() => navigate('settings')}
                      className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-gray-400" /> Settings & Preferences
                    </button>
                    {onGoHome && (
                      <button
                        onClick={onGoHome}
                        className="w-full text-left px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
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
                      className="w-full text-left px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" /> Sign Out / Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT DISPLAY ── */}
        <main className="flex-1 overflow-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {section === 'overview'    && <Overview     onNavigate={navigate} data={dashboardData} />}
          {section === 'performance' && <Performance  onNavigate={navigate} data={dashboardData} />}
          {section === 'sentiment'   && <Sentiment    onNavigate={navigate} data={dashboardData} />}
          {section === 'predictive'  && <Predictive   onNavigate={navigate} data={dashboardData} />}
          {section === 'upload' && (
            <DataUpload
              onDataLoaded={(d) => { setDashboardData(d); setSection('overview'); }}
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

      {/* ── FLOATING QUICK SETTINGS GEAR BUTTON ── */}
      <button
        onClick={() => navigate('settings')}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        title="Quick Dashboard Settings"
      >
        <Settings className="w-5.5 h-5.5 animate-spin-slow" />
      </button>
    </div>
  );
}
