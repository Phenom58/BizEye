import React from 'react';
import { DashboardData } from '@/utils/csvParser';
import { UserInfo } from '@/App';

interface Props {
  data: DashboardData | null;
  userInfo: UserInfo;
  datasetFilename?: string;
}

export default function PrintableReport({ data, userInfo, datasetFilename }: Props) {
  if (!data) return null;

  const health = data.businessHealth;
  const aspects = data.aspectInsights || [];
  const topics = data.topicClusters || [];
  const inventoryRisks = data.inventoryRisks || [];
  const quality = data.dataQuality;
  const topProducts = data.productStats ? data.productStats.slice(0, 6) : [];
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formatCurr = (n: number) => {
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };

  return (
    <div className="hidden print:block w-full bg-white text-gray-900 font-sans p-6 text-[12px] leading-relaxed">
      {/* ── 1. REPORT HEADER ── */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black tracking-tight text-blue-600">BizEye</span>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">| Enterprise Analytics</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Executive Business Intelligence & Performance Report
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Comprehensive D2C Revenue, Sentiment Diagnostics & Predictive Demand Forecast
            </p>
          </div>

          {/* Health Score Pill */}
          <div className="text-right border-l-2 border-gray-200 pl-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Business Health</span>
            <div className="text-2xl font-black text-blue-600">
              {health.overallScore}<span className="text-xs font-semibold text-gray-400">/100</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
              {health.scoreStatus}
            </span>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-600">
          <div>
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Account</span>
            <span className="font-bold text-gray-900">{userInfo.username}</span> ({userInfo.role || 'Business Owner'})
          </div>
          <div>
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Generated Date</span>
            <span className="font-bold text-gray-900">{currentDate}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Dataset Analyzed</span>
            <span className="font-bold text-gray-900">{datasetFilename || 'sales_dataset.csv'}</span>
          </div>
          <div>
            <span className="text-gray-400 block font-semibold text-[10px] uppercase">Transaction Volume</span>
            <span className="font-bold text-gray-900">{data.totalOrders.toLocaleString()} Total Orders</span>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE SUMMARY & KEY KPIS (Luminous Duotone Gradient UI) ── */}
      <div className="mb-6 print-avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
          1. Key Performance Indicators
        </h2>
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="text-[10px] uppercase text-white/90 font-bold tracking-wider block mb-1">Total Revenue</span>
            <span className="text-lg font-black text-white block">{formatCurr(data.totalRevenue)}</span>
            <span className="text-[10px] font-bold text-white/90 block mt-1">{health.revenueChange} MoM</span>
          </div>
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="text-[10px] uppercase text-white/90 font-bold tracking-wider block mb-1">Total Orders</span>
            <span className="text-lg font-black text-white block">{data.totalOrders.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-white/90 block mt-1">+{data.ordersGrowthPct} growth</span>
          </div>
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#fb7185] via-[#f43f5e] to-[#e11d48] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="text-[10px] uppercase text-white/90 font-bold tracking-wider block mb-1">Avg Order Value</span>
            <span className="text-lg font-black text-white block">{formatCurr(data.avgOrderValue)}</span>
            <span className="text-[10px] text-white/90 font-medium block mt-1">Across {data.categories.length} categories</span>
          </div>
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="text-[10px] uppercase text-white/90 font-bold tracking-wider block mb-1">Avg Rating</span>
            <span className="text-lg font-black text-white block">{data.avgRating.toFixed(1)} / 5.0 ★</span>
            <span className="text-[10px] font-bold text-white/90 block mt-1">{health.satisfactionChange}</span>
          </div>
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#7c3aed] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <span className="text-[10px] uppercase text-white/90 font-bold tracking-wider block mb-1">Active SKUs</span>
            <span className="text-lg font-black text-white block">{data.totalSKUs} SKUs</span>
            <span className="text-[10px] font-bold text-white/90 block mt-1">{health.predictedStockouts} Stockout Risks</span>
          </div>
        </div>

        {/* Restock Warning Banner */}
        <div className="rounded-2xl p-3.5 text-[11px] mb-4 flex items-center justify-between bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white shadow-xs" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div>
            <strong className="text-white font-black">Highest Risk SKU Alert:</strong> {health.highestRiskProduct.name}
            <span className="text-white/95 ml-1">
              — Estimated to stock out in <strong>{health.highestRiskProduct.daysLeft} days</strong> at current velocity.
            </span>
          </div>
          <span className="font-bold text-[#ea580c] bg-white px-3 py-1 rounded-full text-[10px] shadow-xs">
            Action: Reorder Immediately
          </span>
        </div>

        {/* Actionable Strategic Recommendations Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            AI Strategic Action Plan
          </div>
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/60 font-semibold text-gray-500">
                <th className="py-2 px-3 w-12">#</th>
                <th className="py-2 px-3 w-28">Category</th>
                <th className="py-2 px-3">Recommendation & Impact</th>
                <th className="py-2 px-3 w-32 text-right">Target Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {health.recommendations.map((rec, i) => (
                <tr key={rec.id}>
                  <td className="py-2 px-3 font-bold text-gray-400">{i + 1}</td>
                  <td className="py-2 px-3 font-bold text-blue-700">{rec.tag}</td>
                  <td className="py-2 px-3 text-gray-800">{rec.text}</td>
                  <td className="py-2 px-3 text-right font-semibold text-gray-600 capitalize">
                    {rec.targetSection}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. PRODUCT SALES & SKU VELOCITY ── */}
      <div className="mb-6 print-avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
          2. Top Product Performance & Velocity
        </h2>
        <table className="w-full text-left text-[11px] border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2 px-3">SKU / Product Name</th>
              <th className="py-2 px-3 text-center">Category</th>
              <th className="py-2 px-3 text-right">Units Sold</th>
              <th className="py-2 px-3 text-right">Total Revenue</th>
              <th className="py-2 px-3 text-center">Rating</th>
              <th className="py-2 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-3 font-semibold text-gray-900">{p.name}</td>
                <td className="py-2 px-3 text-center text-gray-600">{p.category}</td>
                <td className="py-2 px-3 text-right font-medium">{p.unitsSold.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-bold text-gray-900">{p.revenueFormatted}</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">{p.growth}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    p.status === 'winning' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'declining' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 4. CUSTOMER SENTIMENT & ASPECT ROOT CAUSE ANALYSIS ── */}
      <div className="mb-6 print-avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
          3. Aspect-Based Sentiment Diagnostics
        </h2>
        
        {/* Aspect Table */}
        <table className="w-full text-left text-[11px] border border-gray-200 rounded-xl overflow-hidden mb-3">
          <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2 px-3">Dimension</th>
              <th className="py-2 px-3 text-center">Positive %</th>
              <th className="py-2 px-3 text-center">Neutral %</th>
              <th className="py-2 px-3 text-center">Negative %</th>
              <th className="py-2 px-3">Root Cause Findings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {aspects.map((asp) => (
              <tr key={asp.id}>
                <td className="py-2 px-3 font-bold text-gray-900">{asp.name} ({asp.mentionCount} mentions)</td>
                <td className="py-2 px-3 text-center font-bold text-emerald-700">{asp.positivePct}%</td>
                <td className="py-2 px-3 text-center text-gray-600">{asp.neutralPct}%</td>
                <td className="py-2 px-3 text-center font-bold text-rose-700">{asp.negativePct}%</td>
                <td className="py-2 px-3 text-gray-700">{asp.highlight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BERTopic Clusters List */}
        {topics.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
              Discovered NLP Topic Clusters (BERTopic Unsupervised Model)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {topics.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-lg p-2 bg-white">
                  <span className="font-bold text-gray-900">{t.topic}</span> ({t.mentionCount} reviews, {t.growth} trend)
                  <div className="text-gray-500 font-mono mt-0.5">
                    Keywords: {t.keywords.map((k) => `#${k}`).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 5. PREDICTIVE DEMAND & INVENTORY RESTOCK MATRIX ── */}
      <div className="mb-6 print-avoid-break">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
          4. Predictive Demand & Inventory Stockout Plan
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">30-Day Revenue Projection</span>
            <span className="text-base font-extrabold text-blue-900">{formatCurr(data.predictedRevenue)}</span>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
              +{data.revenueGrowthPct} predicted growth (92% model confidence)
            </span>
          </div>
          <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">30-Day Projected Order Volume</span>
            <span className="text-base font-extrabold text-blue-900">{data.predictedOrders.toLocaleString()} Orders</span>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
              +{data.ordersGrowthPct} projected order velocity
            </span>
          </div>
        </div>

        {/* Inventory SKU Matrix Table */}
        <table className="w-full text-left text-[11px] border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2 px-3">Product Name</th>
              <th className="py-2 px-3 text-center">Category</th>
              <th className="py-2 px-3 text-right">Est. Stock</th>
              <th className="py-2 px-3 text-right">Burn Rate</th>
              <th className="py-2 px-3 text-center">Runway</th>
              <th className="py-2 px-3 text-right">Recommended Reorder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryRisks.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 px-3 font-semibold text-gray-900">{item.productName}</td>
                <td className="py-2 px-3 text-center text-gray-600">{item.category}</td>
                <td className="py-2 px-3 text-right font-medium">{item.currentStock} units</td>
                <td className="py-2 px-3 text-right font-medium">{item.dailyBurnRate}/day</td>
                <td className="py-2 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.riskLevel === 'critical' ? 'bg-rose-100 text-rose-800' :
                    item.riskLevel === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.daysRemaining} Days
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-bold text-blue-700">+{item.restockUnits} units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 6. DATA AUDIT & QUALITY REPORT ── */}
      {quality && (
        <div className="mb-6 print-avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1">
            5. Ingestion Quality & Audit Trail
          </h2>
          <div className="grid grid-cols-4 gap-3 text-[11px]">
            <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Quality Score</span>
              <span className="text-sm font-bold text-emerald-700">{quality.score}/100</span>
            </div>
            <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Processed Records</span>
              <span className="text-sm font-bold text-gray-900">{quality.rowsProcessed.toLocaleString()} rows</span>
            </div>
            <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Missing Handled</span>
              <span className="text-sm font-bold text-gray-900">{quality.missingValuesFilled} cells</span>
            </div>
            <div className="border border-gray-200 rounded-xl p-2.5 bg-gray-50">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Duplicates Cleaned</span>
              <span className="text-sm font-bold text-gray-900">{quality.duplicatesRemoved} duplicates</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. DOCUMENT FOOTER ── */}
      <div className="pt-4 border-t-2 border-gray-900 flex items-center justify-between text-[10px] text-gray-500 print-avoid-break">
        <div>
          <span>BizEye Decision Engine • Confidential Executive Document • Generated on {currentDate}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Authorized Sign-off: _______________________</span>
        </div>
      </div>
    </div>
  );
}
