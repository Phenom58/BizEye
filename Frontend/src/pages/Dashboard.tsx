import { useState, useRef, useEffect } from 'react';
import {
  Eye, LayoutDashboard, BarChart3, MessageSquareHeart, TrendingUp,
  Upload, LogOut, Search, Bell, ChevronDown, Sparkles, User, Settings,
  CheckCheck, AlertTriangle, Info
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

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'sentiment', label: 'Sentiment', icon: MessageSquareHeart },
  { id: 'predictive', label: 'Predictive', icon: TrendingUp },
  { id: 'upload', label: 'Upload Data', icon: Upload },
];

export default function Dashboard({ userInfo, onUpdateUserInfo, onLogout }: Props) {
  const [section, setSection] = useState<Section>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-[#0a0a0a] text-white flex flex-col transition-transform duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-2 border-b border-white/[0.06]">
          <Eye className="w-6 h-6 text-sky-400" strokeWidth={2.5} />
          <span className="text-lg font-semibold tracking-tight">
            Biz<span className="text-sky-400">Eye</span>
          </span>
        </div>

        {/* Upload CTA */}
        <div className="px-4 py-4">
          <button 
            onClick={() => { setSection('upload'); setSidebarOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-sky-400 text-black font-medium text-sm py-3 rounded-lg hover:bg-sky-300 transition-colors shadow-lg shadow-sky-400/10"
          >
            <Upload className="w-4 h-4" />
            Upload Data
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="text-xs text-gray-600 uppercase tracking-wider px-3 py-2 font-mono">Intelligence</p>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                section === item.id
                  ? 'bg-sky-400/10 text-sky-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          <p className="text-xs text-gray-600 uppercase tracking-wider px-3 pt-6 pb-2 font-mono">Account & System</p>
          <button
            onClick={() => { setSection('profile'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              section === 'profile'
                ? 'bg-sky-400/10 text-sky-400 font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => { setSection('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              section === 'settings'
                ? 'bg-sky-400/10 text-sky-400 font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* User Card */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setSection('profile')}
              className="w-9 h-9 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-semibold text-sm cursor-pointer hover:scale-105 transition-transform"
            >
              {userInfo.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSection('profile')}>
              <p className="text-sm text-white font-medium truncate">{userInfo.username}</p>
              <p className="text-xs text-sky-400 font-medium truncate flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pro Member
              </p>
            </div>
            <button onClick={onLogout} className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#f7f7f5]/80 backdrop-blur-md border-b border-gray-200/60">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600"
              >
                <div className="w-5 h-px bg-current mb-1.5" />
                <div className="w-5 h-px bg-current mb-1.5" />
                <div className="w-3 h-px bg-current" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">{section}</h1>
                <p className="text-xs text-gray-500">
                  {section === 'overview' && 'Business intelligence at a glance'}
                  {section === 'performance' && 'Product & sales performance analysis'}
                  {section === 'sentiment' && 'Customer sentiment & feedback intelligence'}
                  {section === 'predictive' && 'AI-powered forecasts & predictions'}
                  {section === 'upload' && 'Upload CSV datasets for analysis'}
                  {section === 'profile' && 'User profile, credentials & business details'}
                  {section === 'settings' && 'System preferences, currency & security'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400"
                />
              </div>

              {/* Notifications Button & Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 text-gray-600 hover:text-gray-900 transition-all rounded-xl hover:bg-gray-200/50 cursor-pointer ${
                    notificationsOpen ? 'bg-gray-200/70 text-gray-900' : ''
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-sky-500 rounded-full ring-2 ring-[#f7f7f5] animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 animate-fade-in divide-y divide-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-sky-500" />
                        <span className="text-sm font-bold text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-sky-400/20 text-sky-700 font-semibold text-[10px] px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 transition-colors"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
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
                              item.unread ? 'bg-sky-50/30 hover:bg-sky-50/60' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {item.type === 'predictive' && (
                                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4" />
                                </div>
                              )}
                              {item.type === 'warning' && (
                                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                  <AlertTriangle className="w-4 h-4" />
                                </div>
                              )}
                              {item.type === 'sentiment' && (
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                  <MessageSquareHeart className="w-4 h-4" />
                                </div>
                              )}
                              {item.type === 'system' && (
                                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                                  <Info className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-xs font-semibold ${item.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                            </div>

                            {item.unread && (
                              <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-2.5 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-xs">
                        <button
                          onClick={handleClearNotifications}
                          className="text-gray-500 hover:text-gray-700 transition-colors px-2 py-1"
                        >
                          Clear all
                        </button>
                        <button
                          onClick={() => {
                            setSection('predictive');
                            setNotificationsOpen(false);
                          }}
                          className="text-sky-600 hover:text-sky-700 font-semibold px-2 py-1 transition-colors"
                        >
                          View Predictions →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown Header Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-400 text-black font-bold text-xs flex items-center justify-center shadow-sm">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 hidden sm:inline-block">{userInfo.username}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900 truncate">{userInfo.username}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{userInfo.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200/60 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-sky-500" /> Pro Member
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSection('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" /> View Profile
                      </button>

                      <button
                        onClick={() => {
                          setSection('settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-400" /> Settings & Preferences
                      </button>

                      <button
                        onClick={() => {
                          setSection('upload');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-2.5 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-gray-400" /> Upload Dataset
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {section === 'overview' && <Overview onNavigate={setSection} data={dashboardData} />}
          {section === 'performance' && <Performance onNavigate={setSection} data={dashboardData} />}
          {section === 'sentiment' && <Sentiment onNavigate={setSection} data={dashboardData} />}
          {section === 'predictive' && <Predictive onNavigate={setSection} data={dashboardData} />}
          {section === 'upload' && <DataUpload onDataLoaded={(d) => { setDashboardData(d); setSection('overview'); }} currentData={dashboardData} />}
          {section === 'profile' && <ProfileSettings userInfo={userInfo} initialTab="profile" onNavigate={setSection} onUpdateUserInfo={onUpdateUserInfo} />}
          {section === 'settings' && <ProfileSettings userInfo={userInfo} initialTab="settings" onNavigate={setSection} onUpdateUserInfo={onUpdateUserInfo} />}
        </main>
      </div>
    </div>
  );
}
