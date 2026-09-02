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
      <div className="bg-gradient-to-r from-[#0a0a0a] via-[#141414] to-[#1a1a1a] border border-white/[0.08] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-400/10 rounded-full blur-[100px]" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-black font-bold text-3xl shadow-xl shadow-sky-400/20">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <span className="bg-sky-400/10 border border-sky-400/30 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Pro Member
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{email} • {company}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Account Status: <span className="text-gray-300 font-medium">Verified & Operational</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-sky-400 text-black shadow-lg shadow-sky-400/20'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-600 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Profile details updated successfully!</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Navigation Menu */}
        <div className="space-y-2">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-3 space-y-1 shadow-sm">
            {[
              { id: 'profile', label: 'Profile Information', icon: UserIcon, desc: 'Personal info and branding' },
              { id: 'settings', label: 'System Preferences', icon: SettingsIcon, desc: 'Currency & display defaults' },
              { id: 'notifications', label: 'Notifications & Alerts', icon: Bell, desc: 'Email digests & stockouts' },
              { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Passwords & API keys' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-sky-50 text-sky-700 border border-sky-200/60 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-sky-400 text-black' : 'bg-gray-100 text-gray-500'}`}>
                    <tab.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tab.label}</p>
                    <p className="text-xs text-gray-400">{tab.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'text-sky-600 translate-x-0.5' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#171717] rounded-2xl p-5 text-white border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-semibold">Account Protection</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 text-gray-400">
              <span>Security Verification:</span>
              <span className="text-emerald-400 font-medium">Enabled (OTP)</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 text-gray-400">
              <span>Cloud Storage:</span>
              <span className="text-sky-400 font-medium">Active Sync</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 text-gray-400">
              <span>Account Email:</span>
              <span className="text-white font-mono truncate max-w-[140px]">{email}</span>
            </div>
          </div>
        </div>

        {/* Right Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-500">Update your account credentials and business profile details.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name / Username</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role / Job Title</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Company / Brand Name</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-sky-400/20 disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">System & Display Preferences</h3>
                <p className="text-sm text-gray-500">Configure display format and currency localization across your dashboard.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Display Currency</label>
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
                        className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          currency === c.code
                            ? 'border-sky-400 bg-sky-50/50 text-sky-900 font-semibold ring-1 ring-sky-400'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl font-bold">{c.symbol}</span>
                        <span className="text-xs mt-2">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 bg-sky-400 hover:bg-sky-300 text-black font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-sky-400/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Notifications & Alerts</h3>
                <p className="text-sm text-gray-500">Manage automated AI insights and stockout warnings.</p>
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
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-400" />
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
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-500">Ensure your account uses a strong, unique password.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gray-900 hover:bg-black text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-60"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* API Keys */}
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">API Access Token</h3>
                    <p className="text-sm text-gray-500">Use this token to query dataset analytics endpoints securely.</p>
                  </div>
                  <Key className="w-5 h-5 text-sky-500" />
                </div>

                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-xs text-gray-700 justify-between">
                  <span>bizeye_live_sec_99348102938471209348</span>
                  <button
                    onClick={handleCopyApiKey}
                    className="text-xs bg-sky-400 text-black px-3 py-1 rounded-lg font-sans font-semibold hover:bg-sky-300 transition-colors"
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
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full text-white space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-sky-400/10 border border-sky-400/20 rounded-xl flex items-center justify-center text-sky-400 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Security Verification</h3>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                A 6-digit verification code has been sent to confirm updating your account credentials.
              </p>
            </div>

            {generatedOtp && (
              <div className="bg-sky-400/10 border border-sky-400/20 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Verification Code:</span>
                <span className="font-mono font-bold text-sky-400 tracking-widest text-base">{generatedOtp}</span>
                <button
                  type="button"
                  onClick={() => setVerificationCode(generatedOtp)}
                  className="bg-sky-400/20 text-sky-300 px-2.5 py-1 rounded-lg font-medium hover:bg-sky-400/30 transition-colors"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <form onSubmit={handleConfirmVerification} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-lg font-mono tracking-widest text-center text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{errorMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-sky-400 hover:bg-sky-300 text-black font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-sky-400/20 disabled:opacity-60 cursor-pointer"
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
