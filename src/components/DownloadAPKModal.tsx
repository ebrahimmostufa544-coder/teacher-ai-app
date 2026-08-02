import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, ShieldCheck, ArrowRight, X, Copy, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

interface DownloadAPKModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAPKModal: React.FC<DownloadAPKModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = '/api/download-apk';
  const directApkPath = '/build-outputs/app-debug.apk';

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + directApkPath;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <Smartphone className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-['Tajawal'] text-white">
                  تحميل تطبيق الأندرويد (APK)
                </h2>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Android APK
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                ثبّت تطبيق المعلم الذكي مباشرة على هاتفك الذكي واستمتع بأداء سريع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 no-scrollbar flex-1">
          
          {/* Main Download Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md mb-3">
              <Download className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">
              حزمة الأندرويد جاهزة للتحميل
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              ملف <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-blue-700">app-debug.apk</code> يحتوي على التطبيق الأصلي الكامل باللغة العربية.
            </p>

            {/* Download Buttons */}
            <div className="mt-5 flex flex-col gap-3 w-full max-w-md">
              <a
                href="/api/download-source-zip"
                download="Teacher-AI-Android-Project.zip"
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                <Download className="w-5 h-5" />
                <span>تحميل سورس كود أندرويد ستوديو المكتمل (ZIP)</span>
              </a>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <a
                  href={downloadUrl}
                  download="Teacher-AI-app-debug.apk"
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>تحميل APK المباشر</span>
                </a>

                <a
                  href={directApkPath}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                  title="رابط مباشر موازٍ"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>فتح الرابط</span>
                </a>
              </div>
            </div>

            {/* Copy Link Option */}
            <button
              onClick={handleCopyLink}
              className="mt-3 text-xs text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "تم نسخ رابط APK إلى الحافظة!" : "نسخ رابط التنزيل لمشاركته أو فتحه في الهاتف"}</span>
            </button>
          </div>

          {/* Installation Instructions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              خطوات تثبيت ملف الـ APK على الأندرويد:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                <div>
                  <span className="font-bold text-slate-800">تحميل الملف:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">اضغط زر التنزيل أعلاه لحفظ ملف app-debug.apk على جهازك.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                <div>
                  <span className="font-bold text-slate-800">تفتح التنزيلات:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">افتح مدير الملفات أو إشعارات التحميل واضغط على الملف.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                <div>
                  <span className="font-bold text-slate-800">السماح من المصادر:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">إذا ظهر تحذير التثبيت، اختر "الإعدادات" ثم تفعيل "السماح من هذا المصدر".</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">4</span>
                <div>
                  <span className="font-bold text-slate-800">إكمال التثبيت:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">انقر على "تثبيت" وسيتوفر التطبيق فوراً في قائمة تطبيقاتك!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features of Native App */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 block mb-1">مميزات تطبيق المعلم الذكي للأندرويد:</span>
              <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px]">
                <li>سريع واستجابة لمس فائقة السلاسة على جميع الهواتف والأجهزة اللوحية.</li>
                <li>تصدير وطباعة الامتحانات وشهادات التقدير مباشرة لصيغة PDF.</li>
                <li>مساعد الذكاء الاصطناعي التفاعلي المخصص للمدرسين باللغة العربية.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Teacher AI Native Android v1.0.0
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
