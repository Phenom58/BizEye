import { ArrowRight, BarChart3, Brain, TrendingUp, Eye, LayoutDashboard, LogOut } from 'lucide-react';
import Doodles from '@/components/Doodles';
import CountUpStat from '@/components/CountUpStat';

interface Props {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    desc: 'Understand which products drive revenue, which are declining, and where to focus next.',
  },
  {
    icon: Brain,
    title: 'Sentiment Intelligence',
    desc: 'Automatically surface why customers are unhappy before complaints become crises.',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Forecasting',
    desc: 'Know what will sell out, which customers are at risk, and expected demand next month.',
  },
];

export default function Landing({ onGetStarted, isLoggedIn, onGoToDashboard, onLogout }: Props) {
  const handlePrimaryAction = () => {
    if (isLoggedIn && onGoToDashboard) {
      onGoToDashboard();
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Floating doodles background */}
      <Doodles className="fixed" />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-sky-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handlePrimaryAction}>
          <Eye className="w-6 h-6 text-sky-400" strokeWidth={2.5} />
          <span className="text-xl font-semibold tracking-tight">
            Biz<span className="text-sky-400">Eye</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onGoToDashboard}
                className="text-black bg-sky-400 hover:bg-sky-300 font-semibold rounded-full px-5 py-2 transition-all flex items-center gap-2 shadow-lg shadow-sky-400/20 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-full px-4 py-2 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onGetStarted}
              className="text-white border border-white/20 rounded-full px-5 py-2 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>

        <button className="md:hidden text-gray-400 hover:text-white" onClick={handlePrimaryAction}>
          <div className="w-5 h-px bg-current mb-1.5" />
          <div className="w-5 h-px bg-current mb-1.5" />
          <div className="w-3 h-px bg-current" />
        </button>
      </nav>

      {/* Hero Introduction */}
      <section className="relative z-10 px-8 md:px-16 pt-20 pb-32">
        <div className="max-w-5xl">
          <div className="opacity-0 animate-slide-up">
            <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-6 font-medium">
              AI-Powered Business Intelligence
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 opacity-0 animate-slide-up delay-100">
            <span className="text-white">See Your</span>{' '}
            <span className="text-gray-500">Business</span>
            <br />
            <span className="text-white">Clearly</span>{' '}
            <span className="text-gray-500">Today</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12 opacity-0 animate-slide-up delay-200">
            BizEye transforms raw business data into actionable intelligence — performance, sentiment, and predictions from one unified dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-4 opacity-0 animate-slide-up delay-300">
            <button
              onClick={handlePrimaryAction}
              className="group flex items-center gap-3 bg-sky-400 text-black font-semibold px-7 py-4 rounded-full hover:bg-sky-300 transition-all duration-300 cursor-pointer shadow-lg shadow-sky-400/20"
            >
              <span className="uppercase tracking-widest text-sm">
                {isLoggedIn ? 'Open Dashboard' : 'Get Started'}
              </span>
              <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </span>
            </button>

            <a href="#features" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors px-4 py-4">
              <span className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm tracking-wide">See how it works</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats counter section */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-sm px-8 md:px-16 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <CountUpStat end={94} suffix="%" label="Forecast Accuracy" />
          <CountUpStat end={10} prefix="<" suffix="s" label="Dataset Load Time" />
          <CountUpStat end={3} label="Intelligence Modules" />
          <CountUpStat end={100} suffix="%" label="Privacy & Security" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-8 md:px-16 py-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">Capabilities</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-16 max-w-xl">
            Everything you need to make data-driven decisions.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                onClick={handlePrimaryAction}
                className="group border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-sky-400/40 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-400 group-hover:text-black transition-all">
                  <f.icon className="w-6 h-6 text-sky-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span>{f.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-sky-400" />
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-sky-400" strokeWidth={2.5} />
          <span className="font-semibold text-white">BizEye</span>
        </div>
        <p>© {new Date().getFullYear()} BizEye. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
