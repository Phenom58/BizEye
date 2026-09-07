import { TrendingUp, TrendingDown, Package, BarChart2, ArrowUpRight, Upload, Filter, DollarSign, Layers } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Performance({ data, onNavigate }: Props) {
  const products = data
    ? data.productStats.slice(0, 15).map((p, idx) => ({
        name: p.name,
        sku: p.name.substring(0, 3).toUpperCase() + '-' + String(idx + 1).padStart(3, '0'),
        sold: p.unitsSold,
        revenue: p.revenueFormatted,
        growth: p.growth,
        up: p.up,
        status: p.status,
      }))
    : [];

  const categories = data
    ? data.categoryRevenue.map((c) => ({
        name: c.name,
        revenue: Math.round(c.revenue / 1000),
        color: c.color,
      }))
    : [];

  const maxCatRevenue = categories.length > 0 ? Math.max(...categories.map((c) => c.revenue)) : 1;

  const summaryCards = data
    ? [
        { label: 'Top Seller', value: data.bestSeller.name, sub: data.bestSeller.revenue + ' revenue', icon: Package, bg: 'bg-amber-50 border-amber-200/60 text-amber-600 dark:bg-amber-950/20 dark:border-amber-500/20 dark:text-amber-400' },
        { label: 'Active SKUs', value: String(data.totalSKUs), sub: `${data.productStats.length} active items`, icon: Layers, bg: 'bg-sky-50 border-sky-200/60 text-sky-600 dark:bg-sky-950/20 dark:border-sky-500/20 dark:text-sky-400' },
        { label: 'High Velocity', value: String(data.winningCount), sub: 'Growth > 10%', icon: TrendingUp, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:text-emerald-400' },
        { label: 'Slow Moving', value: String(data.decliningCount), sub: 'Action needed', icon: TrendingDown, bg: 'bg-rose-50 border-rose-200/60 text-rose-600 dark:bg-rose-950/20 dark:border-rose-500/20 dark:text-rose-400' },
      ]
    : [
        { label: 'Top Seller', value: '--', sub: '₹0 revenue', icon: Package, bg: 'bg-amber-50 border-amber-200/60 text-amber-600 dark:bg-amber-950/20 dark:border-amber-500/20 dark:text-amber-400' },
        { label: 'Active SKUs', value: '0', sub: '0 active', icon: Layers, bg: 'bg-sky-50 border-sky-200/60 text-sky-600 dark:bg-sky-950/20 dark:border-sky-500/20 dark:text-sky-400' },
        { label: 'High Velocity', value: '0', sub: 'No data', icon: TrendingUp, bg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-500/20 dark:text-emerald-400' },
        { label: 'Slow Moving', value: '0', sub: 'No data', icon: TrendingDown, bg: 'bg-rose-50 border-rose-200/60 text-rose-600 dark:bg-rose-950/20 dark:border-rose-500/20 dark:text-rose-400' },
      ];

  const monthlyData = data?.revenueByMonth || [];
  const maxMonthlyRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map((m) => m.revenue)) : 1;
  const peakMonth = monthlyData.length > 0 ? monthlyData.reduce((max, curr) => (curr.revenue > max.revenue ? curr : max), monthlyData[0]) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 4 Summary Pastel Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-3xl p-5 shadow-2xs hover:-translate-y-1 transition-all duration-300`}>
            <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-crystal-900/90 backdrop-blur-xs flex items-center justify-center shadow-2xs mb-3">
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate tracking-tight">{s.value}</p>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">{s.label}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {!data ? (
        <div className="bg-white dark:bg-crystal-900 border-2 border-dashed border-gray-100 dark:border-crystal-800 rounded-3xl p-12 text-center shadow-xs">
          <BarChart2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">No Performance Analytics Loaded</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Upload your sales CSV file to unlock monthly revenue graphs, category performance distributions, and full SKU tables.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Upload CSV File
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Sales Performance Graph */}
          <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Monthly Sales Velocity</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Revenue trajectory from uploaded dataset</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20">
                  Peak: {peakMonth?.month} (₹{Math.round((peakMonth?.revenue || 0) / 1000)}k)
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
              {monthlyData.map((m, i) => {
                const revHeight = maxMonthlyRevenue > 0 ? (m.revenue / maxMonthlyRevenue) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-gray-900 dark:bg-crystal-750 text-white text-[10px] font-mono py-1 px-2.5 rounded-xl shadow-md pointer-events-none z-10 whitespace-nowrap">
                      ₹{Math.round(m.revenue).toLocaleString('en-IN')} · {m.orders.toLocaleString()} orders
                    </div>
                    <div className="w-full max-w-[52px] bg-gray-100/80 dark:bg-crystal-800 rounded-2xl relative overflow-hidden h-48 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 via-blue-700 to-sky-400 rounded-2xl transition-all duration-500 group-hover:from-blue-500 group-hover:to-sky-300"
                        style={{ height: `${Math.max(revHeight, 6)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown & Product Performance Table */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Revenue by Category</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Distribution in ₹ thousands</p>
              <div className="space-y-4">
                {categories.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-gray-700 dark:text-gray-300">{c.name}</span>
                      <span className="text-blue-600 dark:text-sky-400">₹{c.revenue}k</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-crystal-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Table */}
            <div className="lg:col-span-2 bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Ranked SKU Performance</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">All products sorted by total revenue</p>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-crystal-800 px-2.5 py-1 rounded-lg">
                  {products.length} SKUs
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/[0.06] text-gray-400 dark:text-gray-500 font-semibold uppercase text-[10px] tracking-wider pb-3">
                      <th className="pb-3 pl-2">Product</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3 text-right">Units Sold</th>
                      <th className="pb-3 text-right">Total Revenue</th>
                      <th className="pb-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {products.map((p, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-crystal-800/40 transition-colors">
                        <td className="py-3 pl-2 font-bold text-gray-900 dark:text-white max-w-[200px] truncate">{p.name}</td>
                        <td className="py-3 font-mono text-gray-400 dark:text-gray-500">{p.sku}</td>
                        <td className="py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{p.sold.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-blue-600 dark:text-sky-400">{p.revenue}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              p.status === 'winning'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20'
                                : p.status === 'declining'
                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-500/20'
                                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-500/20'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
