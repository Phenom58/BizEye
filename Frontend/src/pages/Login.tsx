import { useState } from 'react';
import { Eye, ArrowLeft, ArrowRight, Mail, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';
import Doodles from '@/components/Doodles';
import { UserInfo } from '@/App';

interface Props {
  onLogin: (user: UserInfo, token?: string) => void;
  onBack: () => void;
}

export default function Login({ onLogin, onBack }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: name.trim(), email: email.trim(), password }),
        });

        const resData = await res.json();

        if (!res.ok || !resData.success) {
          setError(resData.detail || resData.message || 'Registration failed.');
          setLoading(false);
          return;
        }

        if (resData.requiresVerification) {
          setGeneratedOtp(resData.verificationCode || '');
          setMode('verify');
          setSuccessMsg(`Verification code sent to ${email}`);
        }
      } catch (err) {
        setError('Authentication server error. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'signin') {
      if (!email.trim()) {
        setError('Please enter your email or username');
        return;
      }
      if (!password) {
        setError('Please enter your password');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email.trim(), email: email.trim(), password }),
        });

        const resData = await res.json();

        if (!res.ok || !resData.success) {
          setError(resData.detail || resData.message || 'Authentication failed.');
          setLoading(false);
          return;
        }

        onLogin(resData.user, resData.token);
      } catch (err) {
        setError('Authentication server error. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!verificationCode.trim() || verificationCode.trim().length < 4) {
      setError('Please enter the verification code sent to your email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: verificationCode.trim() }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setError(resData.detail || resData.message || 'Verification failed. Incorrect code.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Account verified successfully! Logging you in...');
      setTimeout(() => {
        onLogin(resData.user, resData.token);
      }, 1000);
    } catch (err) {
      setError('Verification error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setError('');
    const providerName = provider === 'google' ? 'Google' : 'GitHub';
    alert(
      `${providerName} OAuth sign-in triggered!\n\nTo complete setup, enable the ${providerName} Provider in your Supabase Dashboard under Authentication -> Providers.`
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-white/[0.06]">
        <Doodles />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </button>

          <div>
            <div className="flex items-center gap-2 mb-8">
              <Eye className="w-8 h-8 text-sky-400" strokeWidth={2.5} />
              <span className="text-2xl font-semibold tracking-tight">
                Biz<span className="text-sky-400">Eye</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              <span className="text-white">Intelligence</span>
              <br />
              <span className="text-gray-500">Begins Here.</span>
            </h2>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Sign in to access your business intelligence dashboard. Upload data, get insights, and act before your competitors do.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>v1.5</span>
            <span>·</span>
            <span>AI-Powered BI for D2C</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative">
        <Doodles className="opacity-50" />

        <div className="w-full max-w-md relative z-10">
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-12">
            <Eye className="w-7 h-7 text-sky-400" strokeWidth={2.5} />
            <span className="text-xl font-semibold tracking-tight">
              Biz<span className="text-sky-400">Eye</span>
            </span>
          </div>

          {mode === 'verify' ? (
            /* Email Verification Screen */
            <div className="animate-fade-in">
              <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">
                Email Verification
              </p>
              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                We sent a 6-digit verification code to <span className="text-white font-medium">{email}</span>. Please enter it below to verify your account.
              </p>

              {generatedOtp && (
                <div className="mb-6 bg-sky-400/10 border border-sky-400/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-5 h-5 text-sky-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Your Verification Code:</p>
                      <p className="text-lg font-mono font-bold tracking-widest text-sky-400">{generatedOtp}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(generatedOtp)}
                    className="text-xs bg-sky-400/20 hover:bg-sky-400/30 text-sky-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-lg font-mono tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>
                )}

                {successMsg && (
                  <p className="text-emerald-400 text-sm bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 bg-sky-400 text-black font-semibold py-4 rounded-xl hover:bg-sky-300 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-widest text-sm">Verify & Activate Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-8">
                Didn't receive the code?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Back to Sign up
                </button>
              </p>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div>
              <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">
                {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </p>
              <h1 className="text-3xl font-bold mb-2">
                {mode === 'signin' ? 'Sign in to BizEye' : 'Create your account'}
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                {mode === 'signin'
                  ? 'Enter your credentials to access your dashboard.'
                  : 'Start seeing your business clearly in under 10 seconds.'}
              </p>

              {/* Social Sign-In Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs font-medium text-gray-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex items-center justify-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs font-medium text-gray-200"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-white/[0.08] w-full" />
                <span className="bg-[#0a0a0a] px-3 text-[10px] uppercase tracking-widest text-gray-500 font-mono shrink-0">
                  or continue with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>
                )}

                {mode === 'signin' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-sky-400 focus:ring-sky-400/30" />
                      <span className="text-xs">Remember me</span>
                    </label>
                    <button type="button" className="text-sky-400 text-xs hover:text-sky-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 bg-sky-400 text-black font-semibold py-4 rounded-xl hover:bg-sky-300 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-widest text-sm">
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-8">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
