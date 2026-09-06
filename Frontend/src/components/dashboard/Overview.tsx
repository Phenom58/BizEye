import { TrendingUp, TrendingDown, ArrowUpRight, Sparkles, BarChart3, MessageSquareHeart, Package, IndianRupee, Upload, DollarSign, Calendar, Clock, ShoppingBag, Award, Zap } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

interface Props {
  onNavigate: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
  data?: DashboardData | null;
}

export default function Overview({ onNavigate, data }: Props) {
  // Top 5 Pastel Stat Cards (Modernize React UI design)
  const topStats = data
    ? [
        { label: 'Revenue', val: `₹${Math.round(data.totalRevenue / 1000)}k`, change: '+12.5%', icon: DollarSign, bg: 'bg-amber-50 border-amber-200/60 text-amber-600' },
        { label: 'Orders', val: data.totalOrders.toLocaleString(), change: '+8.2%', icon: Package, bg: 'bg-sky-50 border-sky-200/60 text-sky-600' },
        { label: 'Avg Order', val: `₹${Math.round(data.avgOrderValue)}`, change: '+3.1%', icon: BarChart3, bg: 'bg-rose-50 border-rose-200/60 text-rose-600' },
        { label: 'Avg Rating', val: `${data.avgRating.toFixed(1)}/5`, change: '+0.2', icon: MessageSquareHeart, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600' },
        { label: 'Active SKUs', val: data.totalSKUs.toString(), change: '+4 new', icon: ShoppingBag, bg: 'bg-indigo-50 border-indigo-200/60 text-indigo-600' },
      ]
    : [
        { label: 'Revenue', val: '₹0', change: '0%', icon: DollarSign, bg: 'bg-amber-50 border-amber-200/60 text-amber-600' },
        { label: 'Orders', val: '0', change: '0%', icon: Package, bg: 'bg-sky-50 border-sky-200/60 text-sky-600' },
        { label: 'Avg Order', val: '₹0', change: '0%', icon: BarChart3, bg: 'bg-rose-50 border-rose-200/60 text-rose-600' },
        { label: 'Avg Rating', val: '--', change: '0', icon: MessageSquareHeart, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600' },
        { label: 'Active SKUs', val: '0', change: '0', icon: ShoppingBag, bg: 'bg-indigo-50 border-indigo-200/60 text-indigo-600' },
      ];

  const chartData = data?.revenueByMonth ? data.revenueByMonth.slice(-6) : [];
  const maxRev = chartData.length > 0 ? Math.max(...chartData.map((m) => m.revenue)) : 1;
  const topProducts = data?.productStats ? data.productStats.slice(0, 4) : [];

  // Recent transactions mock data for modern timeline (screenshot 1 & 4)
  const recentTransactions = [
    { time: '09:30 am', title: 'Payment received from Customer', sub: '₹4,850.00 processed', ring: 'border-blue-500' },
    { time: '10:00 am', title: 'New order recorded', tag: '#ML-3467', ring: 'border-sky-400' },
    { time: '12:00 pm', title: 'Batch inventory dispatch complete', ring: 'border-emerald-400' },
    { time: '02:30 pm', title: 'Positive 5-star review received', tag: '#ML-3468', ring: 'border-amber-400' },
    { time: '04:15 pm', title: 'AI Demand Forecast generated', ring: 'border-indigo-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── 1. HERO WELCOME CARD (Modernize React UI style) ── */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-purple-50/50 border border-indigo-100/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-600/10 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-200/50">
              <Sparkles className="w-3.5 h-3.5" /> D2C Business Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">Store Owner!</span> 👋
            </h1>
            <p className="text-sm text-gray-600 max-w-xl leading-relaxed">
              {data
                ? `Analyzing ${data.totalOrders.toLocaleString()} transactions across ${data.categories.length} product categories.`
                : 'Upload your sales dataset to instantly generate revenue trends, product rankings, and AI demand predictions.'}
            </p>
          </div>

          {/* Key Stat Pills in Welcome Banner */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/80 backdrop-blur-xs border border-white rounded-2xl p-3.5 shadow-2xs text-left min-w-[130px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <span>Today's Sales</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                {data ? `₹${Math.round(data.totalRevenue / 30).toLocaleString('en-IN')}` : '₹2,340'}
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-xs border border-white rounded-2xl p-3.5 shadow-2xs text-left min-w-[130px]">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <span>Performance</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-0.5">
                {data ? `${(data.avgRating * 20).toFixed(0)}%` : '85%'}
              </p>
              <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-0.5">
                <Zap className="w-3 h-3" /> High Velocity
              </span>
            </div>

            {!data && (
              <button
                onClick={() => onNavigate('upload')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-3 rounded-2xl transition-all shadow-md shadow-indigo-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload Dataset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. TOP 5 COLORFUL PASTEL METRIC CARDS (Modernize UI design) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {topStats.map((st) => (
          <div
            key={st.label}
            className={`${st.bg} border rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-2xs">
                <st.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-white/70 rounded-full">
                {st.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-0.5">{st.label}</p>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{st.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. MAIN DASHBOARD CONTENT GRID (Transactions & Performance Table) ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* RECENT TRANSACTIONS TIMELINE (1/3 width, matching screenshot 1 & 4) */}
        <div className="bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                <p className="text-xs text-gray-400">Transaction log</p>
              </div>
              <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-dashed border-gray-200 ml-3 space-y-6">
              {recentTransactions.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-white border-2 ${item.ring} shadow-xs`} />
                  <div className="flex items-start justify-between text-xs">
                    <span className="font-mono text-gray-400 font-medium shrink-0">{item.time}</span>
                    {item.tag && (
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-800 mt-1 leading-snug">{item.title}</p>
                  {item.sub && <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('performance')}
            className="mt-6 w-full py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1"
          >
            View Detailed Reports <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* PRODUCT PERFORMANCE TABLE (2/3 width, matching screenshot 1 & 4) */}
        <div className="lg:col-span-2 bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Product Performance</h3>
              <p className="text-xs text-gray-400">Ranked by sales volume & category growth</p>
            </div>
            <button
              onClick={() => onNavigate('performance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
            >
              View All SKUs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!data ? (
            <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No Dataset Loaded</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">Upload a sales CSV to view product performance analytics.</p>
              <button
                onClick={() => onNavigate('upload')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Upload CSV
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px] tracking-wider pb-3">
                    <th className="pb-3 pl-2">Product</th>
                    <th className="pb-3 text-center">Progress</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Sales</th>
                    <th className="pb-3 text-right pr-2">Growth Curve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.map((p, idx) => {
                    const statusClass =
                      p.status === 'winning'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        : p.status === 'declining'
                        ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                        : 'bg-amber-50 text-amber-700 border-amber-200/60';
                    
                    const pct = Math.min(100, Math.round((p.unitsSold / (data.totalOrders / 2)) * 100) || 65);

                    return (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                              <ShoppingBag className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[160px]">{p.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">SKU-00{idx + 1}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-center font-semibold text-gray-700">
                          {pct}%
                        </td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusClass}`}>
                            {p.status === 'winning' ? 'High' : p.status === 'declining' ? 'Low' : 'Medium'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-bold text-gray-900">
                          {p.revenueFormatted}
                        </td>
                        <td className="py-3.5 text-right pr-2">
                          {/* Mini SVG Sparkline matching Modernize design */}
                          <svg className="w-20 h-6 inline-block" viewBox="0 0 80 24">
                            <path
                              d={idx % 2 === 0 ? "M 0 18 Q 20 2, 40 14 T 80 4" : "M 0 12 Q 20 20, 40 6 T 80 18"}
                              fill="none"
                              stroke={p.status === 'winning' ? "#5D87FF" : "#F87171"}
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
          {/* Curved SVG Revenue Wave Chart (2/3 width) */}
          <div className="lg:col-span-2 bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Revenue Wave & Demand Velocity</h3>
                <p className="text-xs text-gray-400">Smooth monthly breakdown from dataset</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +15% vs target
              </span>
            </div>

            {/* Visual Bar / Curve chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
              {chartData.map((m, i) => {
                const h = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 text-white text-[10px] font-mono py-1 px-2.5 rounded-xl shadow-md pointer-events-none z-10 whitespace-nowrap">
                      ₹{Math.round(m.revenue).toLocaleString('en-IN')}
                    </div>
                    <div className="w-full max-w-[48px] bg-gray-100/80 rounded-2xl relative overflow-hidden h-44 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-sky-400 rounded-2xl transition-all duration-500 group-hover:from-indigo-500 group-hover:to-sky-300"
                        style={{ height: `${Math.max(h, 8)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <h3 className="text-lg font-extrabold">Predictive AI Insights</h3>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Based on your {data.revenueByMonth.length}-month dataset, AI projects <strong>{data.revenueGrowthPct} revenue growth</strong> next month with predicted revenue of ₹{Math.round(data.predictedRevenue).toLocaleString('en-IN')}.
              </p>
            </div>

            <button
              onClick={() => onNavigate('predictive')}
              className="mt-6 w-full py-3 rounded-2xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-md active:scale-98 cursor-pointer relative z-10"
            >
              Explore AI Predictions →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
