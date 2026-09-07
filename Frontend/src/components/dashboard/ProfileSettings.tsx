import { useState, useEffect } from 'react';
import {
  User as UserIcon, Settings as SettingsIcon, Shield, Bell, Key, Database, Check,
  Sparkles, Save, Mail, Building, Globe, ChevronRight, AlertCircle, KeyRound, Lock, X
} from 'lucide-react';
import { UserInfo } from '@/App';

interface Props {
  userInfo: UserInfo;
  initialTab?: 'profile' | 'settings';
  onNavigate?: (section: any) => void;
  onUpdateUserInfo?: (updated: UserInfo) => void;
}

export default function ProfileSettings({ userInfo, initialTab = 'profile', onUpdateUserInfo }: Props) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security' | 'notifications'>(initialTab);
  
  // User profile state
  const [name, setName] = useState(userInfo.username || '');
  const [email, setEmail] = useState(userInfo.email || '');
  const [role, setRole] = useState(userInfo.role || 'Business Owner');
  const [company, setCompany] = useState(userInfo.company || 'D2C Brand Store');
  
  // Settings state
  const [currency, setCurrency] = useState('INR');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [stockoutAlerts, setStockoutAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verification modal state for email/password updates
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUpdateType, setPendingUpdateType] = useState<'profile' | 'password'>('profile');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUsername, setPendingUsername] = useState('');
  const [pendingNewPassword, setPendingNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    setName(userInfo.username || '');
    setEmail(userInfo.email || '');
    if (userInfo.role) setRole(userInfo.role);
    if (userInfo.company) setCompany(userInfo.company);
  }, [userInfo]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSavedSuccess(false);

    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: name.trim(),
          email: email.trim(),
          role: role.trim(),
          company: company.trim(),
        }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setErrorMsg(resData.detail || 'Failed to update profile in database.');
        setSaving(false);
        return;
      }

      if (resData.requiresVerification) {
        setPendingUpdateType('profile');
        setPendingEmail(resData.newEmail || email.trim());
        setPendingUsername(name.trim());
        setGeneratedOtp(resData.verificationCode || '');
        setShowVerifyModal(true);
        setSaving(false);
        return;
      }

      if (onUpdateUserInfo && resData.user) {
        onUpdateUserInfo(resData.user);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setErrorMsg('Server connection error during profile save.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    if (!currentPassword) {
      setErrorMsg('Please enter your current password');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMsg('New password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch('/api/auth/change-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setErrorMsg(resData.detail || 'Failed to request password update.');
        setSaving(false);
        return;
      }

      setPendingUpdateType('password');
      setPendingNewPassword(newPassword);
      setGeneratedOtp(resData.verificationCode || '');
      setShowVerifyModal(true);
    } catch (err) {
      setErrorMsg('Server error during password update.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!verificationCode.trim() || verificationCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch('/api/auth/confirm-profile-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: pendingUpdateType === 'profile' ? pendingEmail : undefined,
          newUsername: pendingUpdateType === 'profile' ? pendingUsername : undefined,
          newPassword: pendingUpdateType === 'password' ? pendingNewPassword : undefined,
          role: role.trim(),
          company: company.trim(),
          code: verificationCode.trim(),
        }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setErrorMsg(resData.detail || 'Verification code incorrect.');
        setSaving(false);
        return;
      }

      if (resData.token) {
        localStorage.setItem('auth_token', resData.token);
      }

      setShowVerifyModal(false);
      setVerificationCode('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onUpdateUserInfo && resData.user) {
        onUpdateUserInfo(resData.user);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setErrorMsg('Verification failed. Server connection error.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('bizeye_live_sec_99348102938471209348');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto relative">
      {/* Header Banner */}
      <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 text-gray-900 dark:text-white relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-400 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                <span className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-500" /> Pro Member
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{email} • {company}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Account Status: <span className="text-gray-700 dark:text-gray-300 font-medium">Verified & Operational</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-crystal-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-crystal-750'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-crystal-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-crystal-750'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-crystal-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-crystal-750'
              }`}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Profile details updated successfully!</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-500 dark:text-rose-400 text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Navigation Menu */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-3 space-y-1 shadow-xs">
            {[
              { id: 'profile', label: 'Profile Information', icon: UserIcon, desc: 'Personal info and branding' },
              { id: 'settings', label: 'System Preferences', icon: SettingsIcon, desc: 'Currency & display defaults' },
              { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, desc: 'Email digests & stockouts' },
              { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Passwords & API keys' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-blue-500/30 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-crystal-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-crystal-800 text-gray-500 dark:text-gray-400'}`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{tab.label}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{tab.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'text-blue-600 dark:text-sky-400 translate-x-0.5' : 'text-gray-300 dark:text-gray-600'}`} />
              </button>
            ))}
          </div>

          {/* Account Status Card */}
          <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-5 text-gray-900 dark:text-white shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Account Protection</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.04]">
              <span>Security Verification:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enabled (OTP)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.04]">
              <span>Cloud Storage:</span>
              <span className="text-blue-600 dark:text-sky-400 font-semibold">Active Sync</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 text-gray-500 dark:text-gray-400">
              <span>Account Email:</span>
              <span className="text-gray-900 dark:text-white font-mono truncate max-w-[130px] font-semibold">{email}</span>
            </div>
          </div>
        </div>

        {/* Right Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your account credentials and business profile details.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Full Name / Username</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Role / Job Title</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Company / Brand Name</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">System & Display Preferences</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure display format and currency localization across your dashboard.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Display Currency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
                      { code: 'USD', label: 'US Dollar ($)', symbol: '$' },
                      { code: 'EUR', label: 'Euro (€)', symbol: '€' },
                    ].map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCurrency(c.code)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          currency === c.code
                            ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-sky-300 font-semibold ring-1 ring-blue-600'
                            : 'border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/[0.15] hover:bg-gray-50 dark:hover:bg-crystal-800'
                        }`}
                      >
                        <span className="text-xl font-bold">{c.symbol}</span>
                        <span className="text-xs mt-2">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/[0.06] flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Notifications & Alerts</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage automated AI insights and stockout warnings.</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Weekly Intelligence Summary',
                    desc: 'Receive AI generated digest of revenue growth and sentiment every Monday.',
                    state: weeklyDigest,
                    setter: setWeeklyDigest,
                  },
                  {
                    title: 'Inventory Stockout Warnings',
                    desc: 'Get immediate email alerts when products are predicted to sell out within 14 days.',
                    state: stockoutAlerts,
                    setter: setStockoutAlerts,
                  },
                  {
                    title: 'Customer Sentiment Crisis Alerts',
                    desc: 'Instant notifications when negative review spikes exceed 15% threshold.',
                    state: emailNotifications,
                    setter: setEmailNotifications,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-white/[0.06] rounded-2xl hover:bg-gray-50/50 dark:hover:bg-crystal-850/60 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-crystal-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Password change */}
              <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ensure your account uses a strong, unique password.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-60 shadow-md shadow-blue-500/20"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* API Keys */}
              <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">API Access Token</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Use this token to query dataset analytics endpoints securely.</p>
                  </div>
                  <Key className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                </div>

                <div className="flex items-center bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300 justify-between">
                  <span className="truncate pr-2">bizeye_live_sec_99348102938471209348</span>
                  <button
                    onClick={handleCopyApiKey}
                    className="text-xs bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-sans font-semibold hover:bg-blue-700 transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedKey ? 'Copied!' : 'Copy Key'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECURITY VERIFICATION MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-crystal-900 border border-gray-200 dark:border-white/[0.1] rounded-3xl p-6 sm:p-8 max-w-md w-full text-gray-900 dark:text-white space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-sky-400 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security Verification</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                A 6-digit verification code has been sent to confirm updating your account credentials.
              </p>
            </div>

            {generatedOtp && (
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-3 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Verification Code:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-sky-400 tracking-widest text-base">{generatedOtp}</span>
                <button
                  type="button"
                  onClick={() => setVerificationCode(generatedOtp)}
                  className="bg-blue-600 text-white px-2.5 py-1 rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <form onSubmit={handleConfirmVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-gray-50 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.1] rounded-2xl px-4 py-3 text-lg font-mono tracking-widest text-center text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {errorMsg && (
                <p className="text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/20 rounded-xl px-3 py-2">{errorMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-crystal-800 border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-crystal-750 py-3 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Verifying...' : 'Confirm & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
