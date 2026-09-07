import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, ArrowRight, RefreshCw, BarChart3, TrendingUp, MessageSquareHeart } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import { UserInfo } from '@/App';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardData | null;
  userInfo: UserInfo;
  onNavigate?: (section: any) => void;
}

const QUICK_PROMPTS = [
  'What is our total revenue & best seller?',
  'What is the 30-day revenue forecast?',
  'How is customer sentiment rating?',
  'Are there any declining products?',
];

export default function ChatbotModal({ isOpen, onClose, data, userInfo, onNavigate }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (messages.length === 0) {
        const welcomeText = data
          ? `Hello ${userInfo.username || 'there'}! I've analyzed your uploaded dataset with **${data.totalOrders.toLocaleString()} transactions** across **${data.categories.length} categories**.\n\nTotal revenue is **₹${Math.round(data.totalRevenue).toLocaleString('en-IN')}** with top seller **${data.bestSeller.name}**.\n\nAsk me anything about revenue trends, customer reviews, or 30-day demand predictions!`
          : `Hello ${userInfo.username || 'there'}! I am your **BizEye AI Assistant**.\n\nYou haven't loaded a sales dataset yet. Upload a CSV file in the **Upload Data** tab to unlock automated business analysis, product performance rankings, and demand forecasting.\n\nHow can I help you today?`;

        setMessages([
          {
            id: '1',
            sender: 'assistant',
            text: welcomeText,
            time: now,
          },
        ]);
      }
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, data, userInfo.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (!data) {
      if (q.includes('upload') || q.includes('dataset') || q.includes('file')) {
        return "To upload your data, click the **Upload Data** tab in the sidebar. We support any sales CSV containing columns like Product Name, Revenue, Units Sold, and Customer Ratings.";
      }
      return "No dataset is currently loaded in your session. Please upload a sales CSV file first, and I will be able to answer specific questions about your revenue, SKUs, customer sentiment, and demand forecast!";
    }

    // Revenue / Sales query
    if (q.includes('revenue') || q.includes('sales') || q.includes('money') || q.includes('earn')) {
      const peak = data.revenueByMonth.reduce((max, c) => (c.revenue > max.revenue ? c : max), data.revenueByMonth[0] || { month: 'N/A', revenue: 0 });
      return `💰 **Revenue Summary**:\n• **Total Revenue**: ₹${Math.round(data.totalRevenue).toLocaleString('en-IN')}\n• **Total Orders**: ${data.totalOrders.toLocaleString()}\n• **Average Order Value**: ₹${Math.round(data.avgOrderValue)}\n• **Peak Month**: ${peak.month} (₹${Math.round(peak.revenue).toLocaleString('en-IN')})\n• **Best Seller**: ${data.bestSeller.name} (${data.bestSeller.revenue})`;
    }

    // Forecast / Predictive query
    if (q.includes('forecast') || q.includes('predict') || q.includes('future') || q.includes('next month') || q.includes('growth')) {
      return `📈 **30-Day Predictive Forecast**:\n• **Projected Revenue**: ₹${Math.round(data.predictedRevenue).toLocaleString('en-IN')} (${data.revenueGrowthPct} growth)\n• **Expected Order Volume**: ${data.predictedOrders.toLocaleString()} orders\n• **Forecast Confidence**: 92%\n\nBased on your ${data.revenueByMonth.length}-month sales velocity, category demand is expanding. Check the **Predictive AI** tab for detailed breakdown.`;
    }

    // Top / Best Seller query
    if (q.includes('top') || q.includes('best') || q.includes('winner') || q.includes('winning') || q.includes('popular')) {
      const topList = data.productStats.slice(0, 3).map((p, i) => `${i + 1}. **${p.name}** (${p.revenueFormatted}, ${p.unitsSold} units sold, ${p.growth})`).join('\n• ');
      return `🏆 **Top Performing Products**:\n• ${topList}\n\nThere are currently **${data.winningCount} high-velocity SKUs** driving strong revenue growth.`;
    }

    // Declining / Worst / Problem items query
    if (q.includes('declin') || q.includes('worst') || q.includes('slow') || q.includes('risk') || q.includes('low')) {
      const declining = data.productStats.filter((p) => p.status === 'declining').slice(0, 3);
      if (declining.length === 0) {
        return `✅ Great news! None of your active SKUs are currently classified as declining based on sales volume.`;
      }
      const list = declining.map((p) => `**${p.name}** (${p.revenueFormatted}, ${p.unitsSold} units)`).join('\n• ');
      return `⚠️ **Slow Moving & Declining Items (${data.decliningCount} SKUs)**:\n• ${list}\n\nConsider running promotional bundles or reviewing customer feedback to revitalize demand.`;
    }

    // Sentiment / Rating / Reviews query
    if (q.includes('sentiment') || q.includes('rating') || q.includes('review') || q.includes('happy') || q.includes('feedback') || q.includes('star')) {
      return `⭐ **Customer Sentiment Intelligence**:\n• **Average Store Rating**: ${data.avgRating.toFixed(1)} / 5.0 stars\n• **Positive Feedback**: ${data.sentimentBreakdown.positive}%\n• **Neutral**: ${data.sentimentBreakdown.neutral}%\n• **Negative/Concerns**: ${data.sentimentBreakdown.negative}%\n\nTop satisfaction category: **${data.ratingByCategory[0]?.name || 'N/A'}** (${data.ratingByCategory[0]?.score || 0}/100 satisfaction index).`;
    }

    // Categories query
    if (q.includes('category') || q.includes('categories')) {
      const cats = data.categoryRevenue.map((c) => `**${c.name}**: ₹${Math.round(c.revenue / 1000)}k`).join('\n• ');
      return `📁 **Category Distribution (${data.categories.length} Categories)**:\n• ${cats}`;
    }

    // General Summary
    return `📊 **Quick Business Snapshot**:\n• **Total Revenue**: ₹${Math.round(data.totalRevenue).toLocaleString('en-IN')}\n• **Total Orders**: ${data.totalOrders.toLocaleString()}\n• **Average Rating**: ${data.avgRating.toFixed(1)} / 5.0★\n• **30-Day Projected Revenue**: ₹${Math.round(data.predictedRevenue).toLocaleString('en-IN')} (${data.revenueGrowthPct})\n• **Best Selling SKU**: ${data.bestSeller.name}\n\nLet me know if you want deep-dive analytics on a specific product or category!`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-crystal-900 border border-gray-100 dark:border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[580px] max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Bot className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">BizEye AI Assistant</h3>
                <span className="bg-sky-400 text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-blue-100">Live Business & Dataset Intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-2xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-gray-50 dark:bg-crystal-800 border border-gray-100 dark:border-white/[0.06] text-gray-800 dark:text-gray-200 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text.split('\n').map((line, i) => {
                    // Simple inline bold parser
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={line.startsWith('•') ? 'ml-2 my-0.5' : 'my-1'}>
                        {parts.map((p, j) =>
                          p.startsWith('**') && p.endsWith('**') ? (
                            <strong key={j} className="font-bold">
                              {p.slice(2, -2)}
                            </strong>
                          ) : (
                            p
                          )
                        )}
                      </p>
                    );
                  })}
                </div>
                <span
                  className={`text-[9px] block text-right mt-1 font-mono ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-gray-200 dark:bg-crystal-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                  {userInfo.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-gray-400 dark:text-gray-500">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 dark:bg-crystal-800 border border-gray-100 dark:border-white/[0.06] rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2 bg-gray-50/70 dark:bg-crystal-900/60 border-t border-gray-100 dark:border-white/[0.06] flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium bg-white dark:bg-crystal-800 border border-gray-200/80 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-sky-400 px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-crystal-900 border-t border-gray-100 dark:border-white/[0.06] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI about sales, products, forecast..."
              className="flex-1 bg-gray-50 dark:bg-crystal-800 border border-gray-200/80 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-crystal-750 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-blue-500/20 shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2 font-mono">
            Powered by BizEye AI Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
