import { Sparkles, ThumbsUp, ThumbsDown, Meh, Star, Upload, MessageSquare } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';

interface Props {
  data?: DashboardData | null;
  onNavigate?: (s: 'overview' | 'performance' | 'sentiment' | 'predictive' | 'upload') => void;
}

export default function Sentiment({ data, onNavigate }: Props) {
  const sentimentData = data
    ? [
        { label: 'Positive', range: '4–5★', value: data.sentimentBreakdown.positive, icon: ThumbsUp, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400', ring: 'stroke-emerald-500' },
        { label: 'Neutral',  range: '3★',   value: data.sentimentBreakdown.neutral,  icon: Meh,       bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',   ring: 'stroke-amber-400'   },
        { label: 'Negative', range: '1–2★', value: data.sentimentBreakdown.negative, icon: ThumbsDown,bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',     ring: 'stroke-rose-500'    },
      ]
    : [];

  const themes = data ? data.ratingByCategory.map((r) => ({ name: r.name, score: r.score, mentions: r.count })) : [];
  const reviews = data
    ? data.recentReviews.map((r) => ({ text: r.text, product: r.productName, rating: r.rating, date: r.date, sentiment: r.sentiment }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Customer Sentiment & Reviews</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {data
              ? `Analyzed ${data.totalOrders.toLocaleString()} customer ratings across ${data.categories.length} categories. Average score: ${data.avgRating.toFixed(1)} / 5.0 stars.`
              : 'Upload a CSV dataset with customer review ratings to analyze sentiment distribution.'}
          </p>
        </div>

        {!data && onNavigate && (
          <button
            onClick={() => onNavigate('upload')}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            Upload CSV Dataset
          </button>
        )}
      </div>

      {!data ? (
        <div className="bg-white dark:bg-crystal-900 border-2 border-dashed border-gray-100 dark:border-crystal-800 rounded-3xl p-12 text-center shadow-xs">
          <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">No Sentiment Data Available</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Upload your dataset to calculate positive vs negative customer review splits and category satisfaction metrics.
          </p>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Modernize Donut / Circular Progress Card */}
            <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Sentiment Split</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Overall customer satisfaction</p>

                {/* Donut Chart SVG */}
                <div className="flex justify-center my-4">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100 dark:text-crystal-800" />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#2563eb"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(data.sentimentBreakdown.positive * 2.38).toFixed(0)} 238`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{data.sentimentBreakdown.positive}%</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold mt-1">Positive</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                {sentimentData.map((s) => (
                  <div key={s.label} className={`${s.bg} p-2.5 rounded-2xl text-center`}>
                    <s.icon className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs font-extrabold text-gray-900 dark:text-white">{s.value}%</p>
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Satisfaction Scores */}
            <div className="lg:col-span-2 bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Satisfaction by Category</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Normalized 0–100 index based on star ratings</p>
              <div className="space-y-4">
                {themes.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-gray-800 dark:text-gray-200">{t.name}</span>
                      <span className="text-blue-600 dark:text-sky-400">
                        {t.score}/100 <span className="text-gray-400 dark:text-gray-500 font-normal">({t.mentions} reviews)</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-crystal-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.score >= 75 ? 'bg-emerald-500' : t.score >= 50 ? 'bg-blue-600' : 'bg-rose-500'
                        }`}
                        style={{ width: `${t.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews Feed */}
          <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Customer Review Log</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Verified feedback from dataset</p>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((r, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-crystal-850/60 hover:bg-white dark:hover:bg-crystal-800 hover:shadow-xs transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[180px]">{r.product}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-crystal-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">"{r.text}"</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200/50 dark:border-white/[0.06]">
                    <span>{r.date}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      r.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                      r.sentiment === 'neutral' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}>
                      {r.sentiment}
                    </span>
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
