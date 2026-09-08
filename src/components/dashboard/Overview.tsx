import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, BarChart3, MessageSquareHeart, Package, Upload, DollarSign, Clock, ShoppingBag, Zap, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

interface Props {
  onNavigate: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
  data?: DashboardData | null;
  onExportPDF?: () => void;
}

export default function Overview({ onNavigate, data, onExportPDF }: Props) {
  // Top 5 Full Vibrant Duotone Gradient Stat Cards (Brightened ~15% for optimal luminosity)
  const topStats = data
    ? [
        {
          label: 'Total Revenue',
          val: `₹${Math.round(data.totalRevenue / 1000)}k`,
          change: '+12.5%',
          icon: DollarSign,
          cardBg: 'bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-lg shadow-orange-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Total Orders',
          val: data.totalOrders.toLocaleString(),
          change: '+8.2%',
          icon: Package,
          cardBg: 'bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-blue-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Avg Order Value',
          val: `₹${Math.round(data.avgOrderValue)}`,
          change: '+3.1%',
          icon: BarChart3,
          cardBg: 'bg-gradient-to-br from-[#fb7185] via-[#f43f5e] to-[#e11d48] text-white shadow-lg shadow-rose-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Avg Rating',
          val: `${data.avgRating.toFixed(1)}/5`,
          change: '+0.2',
          icon: MessageSquareHeart,
          cardBg: 'bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white shadow-lg shadow-emerald-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Active SKUs',
          val: data.totalSKUs.toString(),
          change: '+4 new',
          icon: ShoppingBag,
          cardBg: 'bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#7c3aed] text-white shadow-lg shadow-indigo-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
      ]
    : [
        {
          label: 'Total Revenue',
          val: '₹0',
          change: '0%',
          icon: DollarSign,
          cardBg: 'bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-lg shadow-orange-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Total Orders',
          val: '0',
          change: '0%',
          icon: Package,
          cardBg: 'bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-blue-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Avg Order Value',
          val: '₹0',
          change: '0%',
          icon: BarChart3,
          cardBg: 'bg-gradient-to-br from-[#fb7185] via-[#f43f5e] to-[#e11d48] text-white shadow-lg shadow-rose-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Avg Rating',
          val: '--',
          change: '0',
          icon: MessageSquareHeart,
          cardBg: 'bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white shadow-lg shadow-emerald-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
        {
          label: 'Active SKUs',
          val: '0',
          change: '0',
          icon: ShoppingBag,
          cardBg: 'bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#7c3aed] text-white shadow-lg shadow-indigo-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          badgeBg: 'bg-white/20 text-white border border-white/30',
          labelColor: 'text-white/95',
          valColor: 'text-white',
        },
      ];

  const chartData = data?.revenueByMonth ? data.revenueByMonth.slice(-6) : [];
  const maxRev = chartData.length > 0 ? Math.max(...chartData.map((m) => m.revenue)) : 1;
  const topProducts = data?.productStats ? data.productStats.slice(0, 4) : [];

  // Activity log dynamically derived from active session data
  const activityItems = data
    ? [
        { time: 'Just now', title: `Dataset analyzed: ${data.totalOrders.toLocaleString()} orders`, tag: 'Active', ring: 'border-blue-500' },
        { time: 'Analytics', title: `Best seller identified: ${data.bestSeller.name}`, sub: `${data.bestSeller.revenue} total sales`, ring: 'border-emerald-400' },
        { time: 'Sentiment', title: `Satisfaction rating processed: ${data.avgRating.toFixed(1)}/5.0★`, tag: `${data.sentimentBreakdown.positive}% Positive`, ring: 'border-amber-400' },
        { time: 'AI Forecast', title: `30-day forecast ready (${data.revenueGrowthPct} growth)`, sub: `Projected ₹${Math.round(data.predictedRevenue).toLocaleString('en-IN')}`, ring: 'border-sky-400' },
      ]
    : [];

  const health = data?.businessHealth;

  return (
    <div className="space-y-8 animate-fade-in font-sans">

      {/* ── 1. HERO WELCOME CARD (Vibrant Duotone Gradient UI) ── */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] text-white rounded-3xl p-7 sm:p-9 relative overflow-hidden shadow-xl shadow-blue-500/20 border border-white/15">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-inner">
              <BarChart3 className="w-3.5 h-3.5 text-sky-200" /> D2C Business Intelligence Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="text-yellow-300">Store Owner!</span> 👋
            </h1>
            <p className="text-sm text-blue-100/95 leading-relaxed">
              {data
                ? `Analyzing ${data.totalOrders.toLocaleString()} transactions across ${data.categories.length} product categories.`
                : 'Upload your sales dataset to instantly generate revenue trends, product rankings, and AI demand predictions.'}
            </p>
          </div>

          {/* Key Stat Pills in Welcome Banner */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-inner text-left min-w-[140px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                <span>Avg Daily Revenue</span>
              </div>
              <p className="text-xl font-extrabold text-white mt-1">
                {data ? `₹${Math.round(data.totalRevenue / 30).toLocaleString('en-IN')}` : '₹0'}
              </p>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> {data ? '+12.5%' : '0%'}
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-inner text-left min-w-[140px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                <span>Store Health</span>
              </div>
              <p className="text-xl font-extrabold text-white mt-1">
                {data ? `${health ? health.overallScore : (data.avgRating * 20).toFixed(0)}/100` : '--'}
              </p>
              <span className="text-xs font-bold text-yellow-300 flex items-center gap-1 mt-1">
                <Zap className="w-3.5 h-3.5" /> {data ? 'Optimal' : 'Awaiting Data'}
              </span>
            </div>

            {!data && (
              <button
                onClick={() => onNavigate('upload')}
                className="bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs px-6 py-3.5 rounded-full transition-all shadow-lg shadow-blue-950/30 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Dataset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. AI BUSINESS EXECUTIVE SUMMARY CARD ── */}
      {data && health && (
        <div className="bg-white dark:bg-crystal-900 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-500/30">
                  AI Executive Summary
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Business Health & Strategic Digest
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Synthesized from {data.totalOrders.toLocaleString()} orders and customer review signals.
              </p>
            </div>

            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="self-start lg:self-auto px-4 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-crystal-800 dark:hover:bg-crystal-750 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center gap-2 border border-gray-200 dark:border-white/[0.08] transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" /> Export PDF
              </button>
            )}
          </div>

          {/* KPI Pillars — Luminous Duotone Gradients (~15% Brighter) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-blue-500/20 border border-white/20">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">Health Score</p>
              <p className="text-3xl font-black text-white">{health.overallScore}<span className="text-sm font-semibold text-white/80">/100</span></p>
              <p className="text-xs text-white font-bold flex items-center gap-1 mt-2"><ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" /> {health.scoreStatus}</p>
            </div>

            <div className="bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-emerald-500/20 border border-white/20">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">Revenue Velocity</p>
              <p className="text-3xl font-black text-white">{health.revenueChange}</p>
              <p className="text-xs text-white/90 mt-2 font-medium">Month-over-month</p>
            </div>

            <div className="bg-gradient-to-br from-[#fb7185] via-[#f43f5e] to-[#e11d48] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-rose-500/20 border border-white/20">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">Satisfaction</p>
              <p className="text-3xl font-black text-white">{health.satisfactionChange}</p>
              <p className="text-xs text-white/90 mt-2 font-medium">Shipping impact</p>
            </div>

            <div className="bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-orange-500/20 border border-white/20">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-1.5">Stockout Risk</p>
              <p className="text-3xl font-black text-white">{health.predictedStockouts} <span className="text-sm font-semibold text-white/80">SKUs</span></p>
              <p className="text-xs text-white/90 mt-2 font-medium">Restock needed</p>
            </div>
          </div>

          {/* Highest Risk Alert (Luminous Amber/Orange Duotone) */}
          <div className="bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg shadow-orange-500/20 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner text-white">
                <AlertTriangle className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <div>
                <p className="text-base font-black text-white tracking-tight">
                  Highest Risk: <span className="text-white underline decoration-white/40">{health.highestRiskProduct.name}</span>
                </p>
                <p className="text-xs sm:text-sm text-white/95 font-medium mt-1 leading-relaxed">
                  Estimated stockout in <strong className="text-white font-black">{health.highestRiskProduct.daysLeft} days</strong> at current sales velocity.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('predictive')}
              className="px-6 py-3 rounded-full bg-white text-[#ea580c] font-black text-xs hover:bg-white/95 transition-all self-start sm:self-auto cursor-pointer shrink-0 active:scale-95 shadow-md"
            >
              View Restock Plan →
            </button>
          </div>

          {/* Actionable Recommendations (Spacious & Breathable Card Layout) */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actionable Strategic Recommendations
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Priority actions synthesized from demand, fulfillment, and customer sentiment signals
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-500/30 self-start sm:self-auto">
                {health.recommendations.length} Strategic Actions
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {health.recommendations.map((rec) => {
                const upperTag = rec.tag.toUpperCase();
                let tagBadge = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border-blue-200/80 dark:border-blue-500/30';
                let TagIcon = TrendingUp;

                if (upperTag.includes('INVENTORY') || upperTag.includes('STOCK')) {
                  tagBadge = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/30';
                  TagIcon = AlertTriangle;
                } else if (upperTag.includes('QUALITY') || upperTag.includes('BATTERY') || upperTag.includes('ASSURANCE')) {
                  tagBadge = 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/30';
                  TagIcon = ShieldAlert;
                } else if (upperTag.includes('GROWTH') || upperTag.includes('OPPORTUNITY')) {
                  tagBadge = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/30';
                  TagIcon = Sparkles;
                }

                return (
                  <div
                    key={rec.id}
                    onClick={() => onNavigate(rec.targetSection)}
                    className="bg-white dark:bg-crystal-850 border border-gray-200/90 dark:border-white/[0.08] hover:border-blue-400 dark:hover:border-sky-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 cursor-pointer transition-all duration-300 group shadow-xs hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${tagBadge}`}>
                        <TagIcon className="w-3.5 h-3.5 shrink-0" />
                        {rec.tag}
                      </span>
                      <div className="w-9 h-9 rounded-2xl bg-gray-100/80 dark:bg-crystal-800 flex items-center justify-center text-gray-400 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white transition-all shrink-0 shadow-xs">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 leading-relaxed group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                      {rec.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. TOP 5 VIBRANT DUOTONE GRADIENT METRIC CARDS (Pure White Typography) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {topStats.map((st) => (
          <div
            key={st.label}
            className={`${st.cardBg} rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between shadow-md`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl ${st.iconBg} flex items-center justify-center`}>
                <st.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${st.badgeBg}`}>
                {st.change}
              </span>
            </div>
            <div>
              <p className={`text-xs font-bold ${st.labelColor || 'text-white/95'} uppercase tracking-wider mb-1`}>{st.label}</p>
              <p className={`text-2xl sm:text-3xl font-black ${st.valColor || 'text-white'} tracking-tight`}>{st.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. MAIN DASHBOARD CONTENT GRID (Transactions & Performance Table) ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* RECENT TRANSACTIONS TIMELINE */}
        <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Live system and data events</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-crystal-800 text-gray-400 dark:text-gray-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Timeline */}
            {activityItems.length > 0 ? (
              <div className="relative border-l-2 border-dashed border-gray-200 dark:border-crystal-700 ml-3 space-y-6">
                {activityItems.map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white dark:bg-crystal-900 border-2 ${item.ring} shadow-xs`} />
                    <div className="flex items-start justify-between text-xs">
                      <span className="font-mono text-gray-400 dark:text-gray-500 font-medium shrink-0">{item.time}</span>
                      {item.tag && (
                        <span className="text-[10px] font-mono text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md font-semibold">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 leading-snug">{item.title}</p>
                    {item.sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-gray-200 dark:border-crystal-800 rounded-2xl">
                <Clock className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">No Activity Yet</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Upload a CSV to generate live transaction analytics.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('performance')}
            className="mt-6 w-full py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-crystal-800 dark:hover:bg-crystal-750 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            View Detailed Reports <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PRODUCT PERFORMANCE TABLE */}
        <div className="lg:col-span-2 bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Product Performance</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Ranked by sales volume & category growth</p>
            </div>
            <button
              onClick={() => onNavigate('performance')}
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              View All SKUs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!data ? (
            <div className="p-12 text-center border-2 border-dashed border-gray-100 dark:border-crystal-800 rounded-2xl">
              <Package className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No Dataset Loaded</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">Upload a sales CSV to view product performance analytics.</p>
              <button
                onClick={() => onNavigate('upload')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Upload CSV
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.06] text-gray-400 dark:text-gray-500 font-semibold uppercase text-[10px] tracking-wider pb-3">
                    <th className="pb-3 pl-2">Product</th>
                    <th className="pb-3 text-center">Progress</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Sales</th>
                    <th className="pb-3 text-right pr-2">Growth Curve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                  {topProducts.map((p, idx) => {
                    const statusClass =
                      p.status === 'winning'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20'
                        : p.status === 'declining'
                        ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-500/20';
                    
                    const pct = Math.min(100, Math.round((p.unitsSold / (data.totalOrders / 2)) * 100) || 65);

                    return (
                      <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-crystal-800/40 transition-colors">
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950/50 dark:to-sky-950/50 flex items-center justify-center text-blue-600 dark:text-sky-400 font-bold shrink-0">
                              <ShoppingBag className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[160px]">{p.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">SKU-00{idx + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-center font-semibold text-gray-700 dark:text-gray-300">
                          {pct}%
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusClass}`}>
                            {p.status === 'winning' ? 'High' : p.status === 'declining' ? 'Low' : 'Medium'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-gray-900 dark:text-white">
                          {p.revenueFormatted}
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          {/* Mini SVG Sparkline */}
                          <svg className="w-20 h-6 inline-block" viewBox="0 0 80 24">
                            <path
                              d={idx % 2 === 0 ? "M 0 18 Q 20 2, 40 14 T 80 4" : "M 0 12 Q 20 20, 40 6 T 80 18"}
                              fill="none"
                              stroke={p.status === 'winning' ? "#2563eb" : "#F87171"}
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. MONTHLY REVENUE CURVED CHART & PREDICTIVE TEASER ── */}
      {data && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Curved SVG Revenue Wave Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Revenue Wave & Demand Velocity</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Monthly breakdown from dataset</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +15% vs target
              </span>
            </div>

            {/* Visual Bar chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
              {chartData.map((m, i) => {
                const h = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 dark:bg-crystal-750 text-white text-[10px] font-mono py-1 px-2.5 rounded-xl shadow-md pointer-events-none z-10 whitespace-nowrap">
                      ₹{Math.round(m.revenue).toLocaleString('en-IN')}
                    </div>
                    <div className="w-full max-w-[48px] bg-gray-100/80 dark:bg-crystal-800 rounded-2xl relative overflow-hidden h-44 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 via-blue-700 to-sky-400 rounded-2xl transition-all duration-500 group-hover:from-blue-500 group-hover:to-sky-300"
                        style={{ height: `${Math.max(h, 8)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Card (Vibrant Duotone Gradient matching user reference image) */}
          <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-blue-500/25 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/20">
                <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Predictive AI Insights</h3>
              <p className="text-sm text-blue-100/95 leading-relaxed">
                Based on your {data.revenueByMonth.length}-month dataset, AI projects <strong className="text-white font-black">{data.revenueGrowthPct} revenue growth</strong> next month with predicted revenue of ₹{Math.round(data.predictedRevenue).toLocaleString('en-IN')}.
              </p>
            </div>

            <button
              onClick={() => onNavigate('predictive')}
              className="mt-6 w-full py-3.5 rounded-full bg-white text-blue-700 font-extrabold text-sm hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/30 active:scale-95 cursor-pointer relative z-10 flex items-center justify-center gap-1.5"
            >
              Explore AI Predictions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
