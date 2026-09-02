import { useState, useEffect } from 'react';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export type Page = 'landing' | 'login' | 'dashboard';

export interface UserInfo {
  id?: number;
  username: string;
  email: string;
  role?: string;
  company?: string;
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate backend JWT session on startup
  useEffect(() => {
    async function checkAuthSession() {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resData = await res.json();
        if (res.ok && resData.success && resData.user) {
          setUserInfo(resData.user);
          setPage('dashboard');
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        // Backend unavailable
      } finally {
        setLoading(false);
      }
    }

    checkAuthSession();
  }, []);

  const handleLogin = (user: UserInfo, token?: string) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    setUserInfo(user);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUserInfo(null);
    setPage('landing');
  };

  const handleUpdateUserInfo = (updated: UserInfo) => {
    setUserInfo(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Securing Session...</p>
        </div>
      </div>
    );
  }

  if (page === 'landing') return <Landing onGetStarted={() => setPage('login')} />;
  if (page === 'login') return <Login onLogin={handleLogin} onBack={() => setPage('landing')} />;

  return (
    <Dashboard
      userInfo={userInfo || { username: 'User', email: '' }}
      onUpdateUserInfo={handleUpdateUserInfo}
      onLogout={handleLogout}
    />
  );
}
