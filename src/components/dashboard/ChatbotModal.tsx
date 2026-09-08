import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, ArrowRight, RefreshCw, BarChart3, TrendingUp, MessageSquareHeart } from 'lucide-react';
import { DashboardData } from '@/utils/csvParser';
import { UserInfo } from '@/App';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  provider?: string;
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
  const [activeProvider, setActiveProvider] = useState<string>('BizEye Intelligence Engine');
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
            provider: 'BizEye Intelligence Engine',
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

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: now,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const formattedHistory = updatedHistory.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          datasetSummary: data || null,
          history: formattedHistory,
          provider: 'auto',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const resData = await res.json();
      const botReply = resData.reply || 'Analysis complete.';
      const providerLabel = resData.provider || 'BizEye Intelligence Engine';
      setActiveProvider(providerLabel);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: providerLabel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Graceful fallback response on connection error
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `⚠️ **Connection Notice**: Unable to connect to the backend AI service.\n\nPlease verify that the FastAPI backend server is running at port 8000.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Offline Fallback',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
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
              <p className="text-[11px] text-blue-100">Live Business & Multi-LLM Intelligence</p>
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
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={line.startsWith('•') || line.startsWith('  •') || line.startsWith('  1.') || line.startsWith('  2.') || line.startsWith('  3.') || line.startsWith('  4.') ? 'ml-2 my-0.5' : 'my-1'}>
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
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 dark:border-white/5 text-[9px] font-mono">
                  {msg.provider ? (
                    <span className={msg.sender === 'user' ? 'text-blue-200' : 'text-blue-600 dark:text-sky-400 font-semibold'}>
                      {msg.provider}
                    </span>
                  ) : <span />}
                  <span className={msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}>
                    {msg.time}
                  </span>
                </div>
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
          <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-mono px-1">
            <span>Powered by BizEye AI</span>
            <span>{activeProvider}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
