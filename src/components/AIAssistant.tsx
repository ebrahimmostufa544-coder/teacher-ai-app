import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  User, 
  Lightbulb, 
  Table, 
  MessageSquare, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onOpenParentModal: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onOpenParentModal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'أهلاً بك يا أستاذي! أنا مساعدك الذكي Teacher AI. يمكنك سؤالي عن طرق التدريس، أفكار الأنشطة الصفية، إعداد سلم التقييم (Rubric)، أو التعامل مع تحديات الطلاب.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'كيف أتعامل مع طالب مفرط الحركة ومشتت الانتباه أثناء الحصة؟',
    'اقترح فكرة نشاط تفاعلي لمادة العلوم عن التغيرات الكيميائية',
    'اكتب لي نموذج تغذية راجعة إيجابية لطالب تحسن مستواه الدراسي',
    'صغ لي سلم تقييم (Rubric) لمشروع بحثي من 10 درجات'
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await response.json();

      if (!data.success || !data.reply) {
        throw new Error(data.error || 'فشل الحصول على رد المساعد');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 2}`,
          sender: 'assistant',
          text: `عذراً يا أستاذي: ${err.message || 'حدث خطأ في الاتصال بالسيرفر'}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <Bot className="w-4 h-4" />
            <span>مساعد المعلم الذكي • AI Teacher Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal']">
            استشارتك الصفية والتربوية الفورية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اطرح أي سؤال حول الإدارة الصفية، صياغة التغذية الراجعة، أدوات التقييم، وأفكار التدريس المبتكرة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenParentModal}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-blue-950 font-bold hover:bg-amber-300 transition-all shadow-sm text-xs flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            مولد رسائل أولياء الأمور
          </button>
        </div>
      </div>

      {/* Quick Prompt Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          مقترحات أسئلة سريعة للمعلم:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="p-3 text-right rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-xs font-bold text-slate-800 transition-all flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>{prompt}</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Messages View */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xs shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 space-y-2 text-sm leading-relaxed shadow-sm relative group ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line font-medium font-['Cairo']">
                  {msg.text}
                </div>

                <div className={`flex items-center justify-between text-[10px] pt-1 ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ النص'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 text-slate-500 text-xs font-bold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>المعلم الذكي يكتب الإجابة...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب استفسارك التربوي هنا..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
