import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, BarChart3, MessageSquareHeart, Package, IndianRupee, Upload, DollarSign, Calendar, Clock, ShoppingBag, Award, Zap } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

interface Props {
  onNavigate: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
  data?: DashboardData | null;
}

export default function Overview({ onNavigate, data }: Props) {
  // Top 5 Pastel Stat Cards (Modernize React UI design with full Dark Mode support)
  const topStats = data
    ? [
        { label: 'Revenue', val: `₹${Math.round(data.totalRevenue / 1000)}k`, change: '+12.5%', icon: DollarSign, bg: 'bg-amber-50 border-amber-200/60 text-amber-600 dark:bg-amber-950/20 dark:border-amber-500/20 dark:text-amber-400' },
        { label: 'Orders', val: data.totalOrders.toLocaleString(), change: '+8.2%', icon: Package, bg: 'bg-sky-50 border-sky-200/60 text-sky-600 dark:bg-sky-950/20 dark:border-sky-500/20 dark:text-sky-400' },
        { label: 'Avg Order', val: `₹${Math.round(data.avgOrderValue)}`, change: '+3.1%', icon: BarChart3, bg: 'bg-rose-50 border-rose-200/60 text-rose-600 dark:bg-rose-950/20 dark:border-rose-500/20 dark:text-rose-400' },
        { label: 'Avg Rating', val: `${data.avgRating.toFixed(1)}/5`, change: '+0.2', icon: MessageSquareHeart, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:text-emerald-400' },
        { label: 'Active SKUs', val: data.totalSKUs.toString(), change: '+4 new', icon: ShoppingBag, bg: 'bg-blue-50 border-blue-200/60 text-blue-600 dark:bg-blue-950/20 dark:border-blue-500/20 dark:text-blue-400' },
      ]
    : [
        { label: 'Revenue', val: '₹0', change: '0%', icon: DollarSign, bg: 'bg-amber-50 border-amber-200/60 text-amber-600 dark:bg-amber-950/20 dark:border-amber-500/20 dark:text-amber-400' },
        { label: 'Orders', val: '0', change: '0%', icon: Package, bg: 'bg-sky-50 border-sky-200/60 text-sky-600 dark:bg-sky-950/20 dark:border-sky-500/20 dark:text-sky-400' },
        { label: 'Avg Order', val: '₹0', change: '0%', icon: BarChart3, bg: 'bg-rose-50 border-rose-200/60 text-rose-600 dark:bg-rose-950/20 dark:border-rose-500/20 dark:text-rose-400' },
        { label: 'Avg Rating', val: '--', change: '0', icon: MessageSquareHeart, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:text-emerald-400' },
        { label: 'Active SKUs', val: '0', change: '0', icon: ShoppingBag, bg: 'bg-blue-50 border-blue-200/60 text-blue-600 dark:bg-blue-950/20 dark:border-blue-500/20 dark:text-blue-400' },
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

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── 1. HERO WELCOME CARD (Royal Blue in Light & Crystal Black in Dark) ── */}
      <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-blue-50/50 dark:from-crystal-900/90 dark:via-crystal-850/80 dark:to-crystal-900/60 border border-blue-100/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" /> D2C Business Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-blue-600 dark:text-sky-400">Store Owner!</span> 👋
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              {data
                ? `Analyzing ${data.totalOrders.toLocaleString()} transactions across ${data.categories.length} product categories.`
                : 'Upload your sales dataset to instantly generate revenue trends, product rankings, and AI demand predictions.'}
            </p>
          </div>

          {/* Key Stat Pills in Welcome Banner */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/80 dark:bg-crystal-800/90 backdrop-blur-xs border border-white dark:border-white/[0.08] rounded-2xl p-3.5 shadow-2xs text-left min-w-[130px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                <span>Avg Daily Revenue</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                {data ? `₹${Math.round(data.totalRevenue / 30).toLocaleString('en-IN')}` : '₹0'}
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {data ? '+12.5%' : '0%'}
              </span>
            </div>

            <div className="bg-white/80 dark:bg-crystal-800/90 backdrop-blur-xs border border-white dark:border-white/[0.08] rounded-2xl p-3.5 shadow-2xs text-left min-w-[130px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
                <span>Store Health</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                {data ? `${(data.avgRating * 20).toFixed(0)}%` : '--'}
              </p>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> {data ? 'Active' : 'Awaiting Data'}
              </span>
            </div>

            {!data && (
              <button
                onClick={() => onNavigate('upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-2xl transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Dataset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. TOP 5 COLORFUL PASTEL METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {topStats.map((st) => (
          <div
            key={st.label}
            className={`${st.bg} border rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-crystal-900/90 backdrop-blur-xs flex items-center justify-center shadow-2xs">
                <st.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white/70 dark:bg-crystal-900/80 dark:text-gray-300 rounded-full">
                {st.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">{st.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{st.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT GRID (Transactions & Performance Table) ── */}
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

      {/* ── 4. MONTHLY REVENUE CURVED CHART & CATEGORY BREAKDOWN ── */}
      {data && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Curved SVG Revenue Wave Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Revenue Wave & Demand Velocity</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Smooth monthly breakdown from dataset</p>
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

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <h3 className="text-lg font-extrabold">Predictive AI Insights</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Based on your {data.revenueByMonth.length}-month dataset, AI projects <strong>{data.revenueGrowthPct} revenue growth</strong> next month with predicted revenue of ₹{Math.round(data.predictedRevenue).toLocaleString('en-IN')}.
              </p>
            </div>

            <button
              onClick={() => onNavigate('predictive')}
              className="mt-6 w-full py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors shadow-md active:scale-98 cursor-pointer relative z-10"
            >
              Explore AI Predictions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
