import { Sparkles, ThumbsUp, ThumbsDown, Meh, Star, Upload, MessageSquare, MessageSquareHeart, Truck, BatteryCharging, Box, Headphones, TrendingUp, TrendingDown, Tag, Hash, ShieldAlert } from 'lucide-react';
import { DashboardData, AspectInsight, TopicCluster } from '@/utils/csvParser';

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

  const aspects: AspectInsight[] = data?.aspectInsights || [];
  const topics: TopicCluster[] = data?.topicClusters || [];

  const getAspectIcon = (id: string) => {
    switch (id) {
      case 'delivery':
        return Truck;
      case 'battery':
        return BatteryCharging;
      case 'packaging':
        return Box;
      case 'support':
        return Headphones;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner (Vibrant Duotone Gradient) */}
      <div className="bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#1e40af] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-100 bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20 inline-block">
              NLP & Aspect-Based Sentiment Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Customer Sentiment & Root Cause Intelligence</h2>
            <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed max-w-3xl">
              {data
                ? `BERTopic NLP extracted deep signals across ${data.totalOrders.toLocaleString()} customer feedback reviews. Average score: ${data.avgRating.toFixed(1)} / 5.0 stars.`
                : 'Upload a CSV dataset with customer review ratings to analyze sentiment distribution and discover topics.'}
            </p>
          </div>

          {!data && onNavigate && (
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 rounded-full bg-white text-blue-700 font-extrabold text-xs hover:bg-white/95 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              Upload CSV Dataset
            </button>
          )}
        </div>
      </div>

      {!data ? (
        <div className="bg-gradient-to-b from-white to-gray-50/60 dark:from-crystal-900 dark:to-crystal-850 border-2 border-dashed border-gray-200 dark:border-crystal-800 rounded-3xl p-12 text-center shadow-xs">
          <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">No Sentiment Data Available</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Upload your dataset to calculate positive vs negative customer review splits, aspect-based sentiment, and automated topic discovery.
          </p>
        </div>
      ) : (
        <>
          {/* ── 1. ASPECT-BASED SENTIMENT INTELLIGENCE CARDS (Enclosed in White Container Card) ── */}
          <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Aspect-Based Sentiment Breakdown</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Granular root-cause discovery across shipping, hardware, packaging, and support
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-500/30 self-start sm:self-auto shadow-2xs">
                4 Core Dimensions
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {aspects.map((asp) => {
                const IconComponent = getAspectIcon(asp.id);
                
                // Icon badge gradient per aspect
                let iconGradient = 'bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white shadow-md shadow-blue-500/25';
                let alertBorder = 'border-gray-200/90 dark:border-white/[0.08]';
                
                if (asp.id === 'battery' || asp.negativePct >= 20) {
                  iconGradient = 'bg-gradient-to-br from-[#fb7185] to-[#e11d48] text-white shadow-md shadow-rose-500/25';
                  alertBorder = 'border-rose-200 dark:border-rose-500/30';
                } else if (asp.id === 'packaging') {
                  iconGradient = 'bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-white shadow-md shadow-orange-500/25';
                } else if (asp.id === 'support') {
                  iconGradient = 'bg-gradient-to-br from-[#10b981] to-[#047857] text-white shadow-md shadow-emerald-500/25';
                }

                return (
                  <div
                    key={asp.id}
                    className={`bg-white dark:bg-crystal-850 border ${alertBorder} rounded-3xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
                  >
                    {/* Header: icon + name */}
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className={`w-11 h-11 rounded-2xl ${iconGradient} flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">{asp.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{asp.mentionCount} mentions</p>
                        </div>
                      </div>

                      {/* Sentiment bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-emerald-600 dark:text-emerald-400">{asp.positivePct}% Pos</span>
                          <span className="text-gray-500 dark:text-gray-400">{asp.neutralPct}% Neu</span>
                          <span className="text-rose-600 dark:text-rose-400">{asp.negativePct}% Neg</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-crystal-800 rounded-full overflow-hidden flex">
                          <div style={{ width: `${asp.positivePct}%` }} className="bg-emerald-500 h-full" />
                          <div style={{ width: `${asp.neutralPct}%` }} className="bg-amber-400 h-full" />
                          <div style={{ width: `${asp.negativePct}%` }} className="bg-rose-500 h-full" />
                        </div>
                      </div>
                    </div>

                    {/* Compact callout */}
                    <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-white/[0.06]">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {asp.highlight}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 2. DONUT SPLIT & CATEGORY SATISFACTION ── */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Donut / Circular Progress Card */}
            <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Overall Sentiment Split</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Customer satisfaction distribution</p>

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

          {/* ── 3. DISCOVERED TOPIC CLUSTERS (BERTopic Engine) ── */}
          <div className="bg-white dark:bg-crystal-900 border border-gray-100/90 dark:border-white/[0.08] rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Discovered Topic Clusters (BERTopic)</h3>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Unsupervised topic clustering automatically discovers emerging complaint categories without manual rule writing
                </p>
              </div>
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-crystal-800 px-3 py-1.5 rounded-full border border-gray-200/50 dark:border-white/[0.06]">
                Automatic NLP Discovery
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topics.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-gray-50/70 dark:bg-crystal-850/60 border border-gray-100 dark:border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">{t.growth} mentions</span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.topic}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.mentionCount} customer discussions</p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-200/50 dark:border-white/[0.06]">
                    {t.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white dark:bg-crystal-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg border border-gray-200/40 dark:border-white/[0.04]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. CUSTOMER REVIEWS FEED ── */}
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
