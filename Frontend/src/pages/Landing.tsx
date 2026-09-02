import { ArrowRight, BarChart3, Brain, TrendingUp, Eye } from 'lucide-react';
import Doodles from '@/components/Doodles';
import CountUpStat from '@/components/CountUpStat';

interface Props {
  onGetStarted: () => void;
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

export default function Landing({ onGetStarted }: Props) {
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
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-sky-400" strokeWidth={2.5} />
          <span className="text-xl font-semibold tracking-tight">
            Biz<span className="text-sky-400">Eye</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <button
            onClick={onGetStarted}
            className="text-white border border-white/20 rounded-full px-5 py-2 hover:bg-white/10 transition-colors"
          >
            Sign in
          </button>
        </div>
        <button className="md:hidden text-gray-400 hover:text-white">
          <div className="w-5 h-px bg-current mb-1.5" />
          <div className="w-5 h-px bg-current mb-1.5" />
          <div className="w-3 h-px bg-current" />
        </button>
      </nav>

      {/* Hero */}
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
              onClick={onGetStarted}
              className="group flex items-center gap-3 bg-sky-400 text-black font-semibold px-7 py-4 rounded-full hover:bg-sky-300 transition-all duration-300"
            >
              <span className="uppercase tracking-widest text-sm">Get Started</span>
              <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </span>
            </button>

            <button className="flex items-center gap-3 text-white/70 hover:text-white transition-colors px-4 py-4">
              <span className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm tracking-wide">See how it works</span>
            </button>
          </div>
        </div>


      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-t border-white/[0.06] border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {[
            { value: '95%', label: 'Upload Success Rate' },
            { value: '<10s', label: 'Dashboard Generation' },
            { value: '85%+', label: 'Forecast Accuracy' },
            { value: '3', label: 'Intelligence Pillars' },
          ].map((stat) => (
            <CountUpStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-8 md:px-16 py-32">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-20">
            <span className="text-white">Three Pillars of</span>
            <br />
            <span className="text-gray-500">Intelligence</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                onClick={onGetStarted}
                className="bg-[#0a0a0a] p-10 group hover:bg-[#141414] transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="w-12 h-12 border border-sky-400/30 rounded-lg flex items-center justify-center mb-8 group-hover:border-sky-400 group-hover:bg-sky-400/10 transition-all">
                  <f.icon className="w-5 h-5 text-sky-400" />
                </div>
                <p className="text-xs tracking-widest text-gray-600 uppercase mb-3 font-mono">0{i + 1}</p>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-sky-300 transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{f.desc}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGetStarted();
                  }}
                  className="mt-4 flex items-center gap-2 text-sky-400 text-sm font-medium opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="relative z-10 px-8 md:px-16 py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">About BizEye</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">Designed for</span>
              <br />
              <span className="text-gray-500">D2C Brands</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Small and growing D2C brands shouldn't need a data science team to understand their business. BizEye automatically cleans your data, generates plain-language insights, and tells you exactly what to do next.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              Upload a CSV, and within seconds you'll know which products are winning, why customers are leaving, and what's coming next month.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'D2C Business Owners', desc: 'Track sales & forecast inventory' },
              { label: 'Operations Managers', desc: 'Plan inventory, spot trends' },
              { label: 'Marketing Teams', desc: 'Understand sentiment & campaigns' },
              { label: 'Non-Technical Users', desc: 'No spreadsheets required' },
            ].map((u) => (
              <div key={u.label} className="border border-white/[0.08] rounded-xl p-6 hover:border-sky-400/20 transition-colors">
                <div className="w-2 h-2 bg-sky-400 rounded-full mb-4" />
                <p className="text-white text-sm font-medium mb-1">{u.label}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 md:px-16 py-32 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Start Seeing</span>
            <br />
            <span className="text-sky-400">Clearly.</span>
          </h2>
          <p className="text-gray-500 mb-10 text-lg">Upload your first dataset and get a full business intelligence report in under 10 seconds.</p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 bg-sky-400 text-black font-semibold px-8 py-4 rounded-full hover:bg-sky-300 transition-all duration-300"
          >
            <span className="uppercase tracking-widest text-sm">Launch Dashboard</span>
            <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-8 md:px-16 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-sky-400" />
            <span className="text-white font-semibold">Biz<span className="text-sky-400">Eye</span></span>
          </div>
          <p className="text-gray-600 text-xs">AI-powered Business Intelligence for D2C brands · v1.5</p>
        </div>
      </footer>
    </div>
  );
}
