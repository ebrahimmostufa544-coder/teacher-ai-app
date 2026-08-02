import React, { useState } from 'react';
import { X, MessageSquare, Sparkles, Copy, Check, Send, RefreshCw } from 'lucide-react';

interface ParentMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentMessageModal: React.FC<ParentMessageModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('عمر خالد النجار');
  const [messageType, setMessageType] = useState('ثناء وتفوق دراسي');
  const [details, setDetails] = useState('تحسن كبير في درجات الاختبار والمشاركة التفاعلية');
  const [teacherName, setTeacherName] = useState('أ. عبد الله الأحمد');
  const [schoolName, setSchoolName] = useState('مدرسة الأفق النموذجية');

  const [result, setResult] = useState<{ subject?: string; whatsappText?: string; smsText?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-parent-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          messageType,
          details,
          teacherName,
          schoolName
        })
      });

      const data = await response.json();
      if (data.success && data.messageData) {
        setResult(data.messageData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Tajawal']">صياغة رسائل أولياء الأمور بالذكاء الاصطناعي</h2>
            <p className="text-xs text-slate-500">رسائل وورد وواتساب راقية ومصاغة تربوياً</p>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">اسم الطالب/الطالبة</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800">نوع الرسالة</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                <option value="ثناء وتفوق دراسي">ثناء وتفوق دراسي 🌟</option>
                <option value="ملاحظة سلوكية وتربوية">ملاحظة سلوكية وتربوية ⚠️</option>
                <option value="تذكير بموعد الامتحان والواجبات">تذكير بموعد الامتحان 📅</option>
                <option value="تأخر أو غياب عن الحصص">تأخر أو غياب ⏰</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">تفاصيل وسياق إضافي</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب أية تفاصيل تريد تضمينها في الرسالة..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-amber-500 text-blue-950 font-bold hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري صياغة الرسالة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد الرسالة الآن</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* WhatsApp Version */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  صيغة الواتساب (WhatsApp):
                </span>
                <button
                  onClick={() => copyToClipboard(result.whatsappText || '', 'wa')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'wa' ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                {result.whatsappText}
              </p>
            </div>

            {/* SMS Version */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">صيغة SMS الموجزة:</span>
                <button
                  onClick={() => copyToClipboard(result.smsText || '', 'sms')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'sms' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'sms' ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
              <p className="text-xs text-slate-800 font-medium">{result.smsText}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
