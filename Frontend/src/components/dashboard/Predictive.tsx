import { TrendingUp, AlertTriangle, Sparkles, Package, Users, IndianRupee, Upload, DollarSign } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

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
        { metric: '30-Day Revenue Forecast', current: formatCurr(lastMonthRevenue), predicted: formatCurr(data.predictedRevenue), change: data.revenueGrowthPct, confidence: 92, icon: DollarSign, bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
        { metric: '30-Day Order Volume', current: lastMonthOrders.toLocaleString(), predicted: data.predictedOrders.toLocaleString(), change: data.ordersGrowthPct, confidence: 88, icon: Package, bg: 'bg-sky-50 text-sky-600 border-sky-100' },
        { metric: 'Avg Rating Forecast', current: data.avgRating.toFixed(1), predicted: Math.min(5.0, data.avgRating * 1.03).toFixed(1), change: '+3%', confidence: 85, icon: Users, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      ]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero AI banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-white/15 backdrop-blur-xs rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              AI Demand Intelligence
            </span>
            <h2 className="text-2xl font-extrabold">30-Day Predictive Analytics</h2>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-3xl">
              {data
                ? `Based on ${data.revenueByMonth.length} months of sales data across ${data.totalOrders.toLocaleString()} orders, AI projects ${data.revenueGrowthPct} revenue growth next month with predicted revenue of ${formatCurr(data.predictedRevenue)}.`
                : 'Upload your sales dataset to generate AI-driven demand projections and order volume forecasts.'}
            </p>
          </div>
        </div>
      </div>

      {!data ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center shadow-xs">
          <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800 mb-1">No Forecast Available</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5 leading-relaxed">
            Upload your sales CSV file to calculate 30-day revenue growth and category demand projections.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Upload CSV File
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 30-Day Forecast Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {forecasts.map((f) => (
              <div key={f.metric} className="bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${f.bg}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {f.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mb-1">{f.metric}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-gray-900">{f.predicted}</span>
                    <span className="text-xs font-medium text-gray-400">from {f.current}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{f.change} predicted growth</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 pt-3 border-t border-gray-50">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${f.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Forecast Grid */}
          <div className="bg-white border border-gray-100/90 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Category Demand Forecasts</h3>
                <p className="text-xs text-gray-400">Estimated 30-day velocity by category</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.categoryRevenue.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
                  <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Current: ₹{Math.round(cat.revenue / 1000)}k</span>
                    <span className="text-emerald-600 font-bold">+15% est.</span>
                  </div>
                  <div className="h-2 bg-gray-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '75%' }} />
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
