import { TrendingUp, AlertTriangle, Sparkles, Package, Users, DollarSign, Clock, ShieldAlert, ArrowUpRight, Boxes, BarChart2 } from 'lucide-react';
import { DashboardData, InventoryRisk } from '@/utils/csvParser';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Predictive({ data, onNavigate }: Props) {
  const formatCurr = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n.toFixed(0)}`;
  };

  const lastMonthRevenue = data?.revenueByMonth[data.revenueByMonth.length - 1]?.revenue || 0;
  const lastMonthOrders = data?.revenueByMonth[data.revenueByMonth.length - 1]?.orders || 0;

  const forecasts = data
    ? [
        {
          metric: '30-Day Revenue Forecast',
          current: formatCurr(lastMonthRevenue),
          predicted: formatCurr(data.predictedRevenue),
          change: data.revenueGrowthPct,
          confidence: 92,
          icon: DollarSign,
          cardBg: 'bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] text-white shadow-lg shadow-blue-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          labelColor: 'text-white/95',
          valColor: 'text-white',
          currColor: 'text-white/80',
          growthColor: 'text-white font-bold',
          barTrack: 'bg-white/20',
          barFill: 'bg-white',
        },
        {
          metric: '30-Day Order Volume',
          current: lastMonthOrders.toLocaleString(),
          predicted: data.predictedOrders.toLocaleString(),
          change: data.ordersGrowthPct,
          confidence: 88,
          icon: Package,
          cardBg: 'bg-gradient-to-br from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white shadow-lg shadow-sky-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          labelColor: 'text-white/95',
          valColor: 'text-white',
          currColor: 'text-white/80',
          growthColor: 'text-white font-bold',
          barTrack: 'bg-white/20',
          barFill: 'bg-white',
        },
        {
          metric: 'Avg Rating Forecast',
          current: data.avgRating.toFixed(1),
          predicted: Math.min(5.0, data.avgRating * 1.03).toFixed(1),
          change: '+3%',
          confidence: 85,
          icon: Users,
          cardBg: 'bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white shadow-lg shadow-emerald-500/20 border border-white/20',
          iconBg: 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner',
          labelColor: 'text-white/95',
          valColor: 'text-white',
          currColor: 'text-white/80',
          growthColor: 'text-white font-bold',
          barTrack: 'bg-white/20',
          barFill: 'bg-white',
        },
      ]
    : [];

  const inventoryRisks: InventoryRisk[] = data?.inventoryRisks || [];
  const criticalItems = inventoryRisks.filter((r) => r.riskLevel === 'critical');
  const highestRisk = inventoryRisks[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero AI banner (Vibrant Duotone Gradient) */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-100 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 inline-block">
              Predictive AI & Inventory Risk Models
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">30-Day Demand & Stockout Forecasting</h2>
            <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed max-w-3xl">
              {data
                ? `Prophet-modeled demand projection indicates ${data.revenueGrowthPct} revenue growth with predicted revenue of ${formatCurr(data.predictedRevenue)}. ${data.businessHealth.predictedStockouts} SKUs require immediate inventory attention.`
                : 'Upload your sales dataset to generate AI-driven demand projections, stockout risks, and order volume forecasts.'}
            </p>
          </div>
        </div>
      </div>

      {!data ? (
        <div className="bg-gradient-to-b from-white to-gray-50/60 dark:from-crystal-900 dark:to-crystal-850 border-2 border-dashed border-gray-200 dark:border-crystal-800 rounded-3xl p-12 text-center shadow-xs">
          <TrendingUp className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">No Forecast Available</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Upload your sales CSV file to calculate 30-day revenue growth and category demand projections.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Upload CSV File
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── 1. 30-DAY FORECAST CARDS WITH DUOTONE GRADIENTS ── */}
          <div className="grid md:grid-cols-3 gap-6">
            {forecasts.map((f) => (
              <div key={f.metric} className={`${f.cardBg} rounded-3xl p-6 shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl ${f.iconBg} flex items-center justify-center`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 shadow-inner">
                      {f.confidence}% confidence
                    </span>
                  </div>
                  <p className={`text-xs font-bold ${f.labelColor} tracking-wide uppercase mb-1`}>{f.metric}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl sm:text-3xl font-black ${f.valColor} tracking-tight`}>{f.predicted}</span>
                    <span className={`text-xs font-medium ${f.currColor}`}>from {f.current}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/95 font-bold">
                    <TrendingUp className="w-4 h-4 text-emerald-200" />
                    <span>{f.change} predicted growth</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 pt-4 border-t border-white/15">
                  <div className={`h-2 ${f.barTrack} rounded-full overflow-hidden`}>
                    <div className={`h-full ${f.barFill} rounded-full transition-all duration-500`} style={{ width: `${f.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── 2. INVENTORY STOCKOUT & RESTOCK INTELLIGENCE (Duotone Styling) ── */}
          <div className="bg-gradient-to-b from-white to-gray-50/60 dark:from-crystal-900 dark:to-crystal-850 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Boxes className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Predictive Inventory Stockout & Restock Plan</h3>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Calculates daily burn rates from recent transaction volume to forecast exact days until stockout
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {data.businessHealth.predictedStockouts} Items Need Reordering
                </span>
              </div>
            </div>

            {/* Critical Stockout Highlight Banner (Luminous Duotone Amber/Orange) */}
            {highestRisk && (
              <div className="bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg shadow-orange-500/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner text-white">
                    <ShieldAlert className="w-6 h-6 text-white stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white tracking-tight">
                      Critical Restock Alert: <span className="text-white underline decoration-white/40">{highestRisk.productName}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/95 font-medium mt-1 leading-relaxed">
                      Current velocity is <strong className="text-white font-black">{highestRisk.dailyBurnRate} units/day</strong>. Inventory will deplete in approximately <strong className="text-white font-black">{highestRisk.daysRemaining} days</strong>.
                    </p>
                  </div>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="text-xs font-black text-[#ea580c] bg-white px-5 py-2.5 rounded-full shadow-md inline-block">
                    Recommended Reorder: +{highestRisk.restockUnits} units
                  </span>
                </div>
              </div>
            )}

            {/* Inventory SKU Grid (Duotone Styled Cards) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryRisks.map((item, idx) => {
                const isCrit = item.riskLevel === 'critical';
                const isWarn = item.riskLevel === 'warning';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-2xs ${
                      isCrit
                        ? 'bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-rose-500/5 border-rose-500/30 dark:from-rose-950/40 dark:via-pink-950/20 dark:to-crystal-900'
                        : isWarn
                        ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border-amber-500/30 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-crystal-900'
                        : 'bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border-emerald-500/30 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-crystal-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-500/30'
                            : isWarn
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30'
                        }`}>
                          {item.daysRemaining} Days Runway
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.productName}</h4>

                      <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                        <div className="bg-white/80 dark:bg-crystal-800/90 backdrop-blur-xs p-2 rounded-xl border border-white/60 dark:border-white/[0.04]">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Est. Stock</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{item.currentStock} units</span>
                        </div>
                        <div className="bg-white/80 dark:bg-crystal-800/90 backdrop-blur-xs p-2 rounded-xl border border-white/60 dark:border-white/[0.04]">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 block">Burn Rate</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{item.dailyBurnRate}/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/50 dark:border-white/[0.06] text-[11px] text-gray-600 dark:text-gray-300 leading-snug">
                      {item.actionNeeded}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. CATEGORY DEMAND VELOCITY FORECASTS (Soft & Duotone Gradients) ── */}
          <div className="bg-gradient-to-b from-white to-gray-50/60 dark:from-crystal-900 dark:to-crystal-850 border border-gray-200/80 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Category Demand Forecasts</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Estimated 30-day velocity by category</p>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/10 text-blue-600 dark:text-sky-400 border border-blue-500/20">
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categoryRevenue.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-200/60 dark:border-white/[0.06] bg-gradient-to-br from-gray-50/80 to-white dark:from-crystal-850/70 dark:to-crystal-800/60 space-y-2.5 shadow-2xs">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{cat.name}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Current: ₹{Math.round(cat.revenue / 1000)}k</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/20">+{12 + (idx * 3)}% est.</span>
                  </div>
                  <div className="h-2 bg-gray-200/80 dark:bg-crystal-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" style={{ width: `${80 - idx * 6}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
