import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Printer, 
  Save, 
  RefreshCw, 
  Check, 
  Star, 
  Medal, 
  School, 
  UserCheck, 
  Palette
} from 'lucide-react';
import { CertificateData } from '../types';

interface CertificateCreatorProps {
  currentCert: CertificateData | null;
  onSaveCert: (cert: CertificateData) => void;
}

export const CertificateCreator: React.FC<CertificateCreatorProps> = ({ currentCert, onSaveCert }) => {
  // Form State
  const [studentName, setStudentName] = useState('سارة عبد الرحمن الشهري');
  const [achievement, setAchievement] = useState('التميز والدرجة الكاملة في اختبار العلوم والأنشطة الإبداعية');
  const [subject, setSubject] = useState('العلوم العامة والتفوق الأكاديمي');
  const [teacherName, setTeacherName] = useState('الأستاذ عبد الله الأحمد');
  const [schoolName, setSchoolName] = useState('مدرسة الرائد النموذجية');
  const [style, setStyle] = useState<'classic' | 'modern' | 'royal' | 'gold'>('modern');

  // Certificate State
  const [certificate, setCertificate] = useState<CertificateData | null>(currentCert);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerateCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          achievement,
          subject,
          teacherName,
          schoolName,
          style
        }),
      });

      const data = await response.json();

      if (!data.success || !data.certificate) {
        throw new Error(data.error || 'فشل توليد الشهادة');
      }

      const newCertData: CertificateData = {
        ...data.certificate,
        id: `cert-${Date.now()}`,
        style,
        createdAt: new Date().toLocaleDateString('ar-EG')
      };

      setCertificate(newCertData);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!certificate) return;
    onSaveCert(certificate);
    setIsSaved(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
            <Award className="w-4 h-4" />
            <span>مصمم شهادات التقدير • Certificate Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal']">
            إنشاء شهادات تقدير باهرة وشعر تشجيعي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            صمم شهادات تكريم وتفوق للطلاب بعبارات بلاغية راقية وتصاميم جاهزة للطباعة الفورية.
          </p>
        </div>

        {certificate && (
          <button
            onClick={() => setCertificate(null)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            توليد شهادة جديدة
          </button>
        )}
      </div>

      {/* Creation Form */}
      {!certificate && (
        <form onSubmit={handleGenerateCert} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                اسم الطالب / المكرم
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="مثال: سارة عبد الرحمن الشهري"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600" />
                المادة / المجال
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: العلوم العامة والتفوق الصفّي"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-600" />
                سبب التكريم والإنجاز
              </label>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="مثال: الحصول على المركز الأول في اختبار منتصف العام والسلوك الحسن"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                اسم المعلم / المعلمة
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="مثال: الأستاذ عبد الله الأحمد"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <School className="w-4 h-4 text-amber-600" />
                اسم المدرسة / الأكاديمية
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="مثال: مدرسة الرائد النموذجية"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
          </div>

          {/* Certificate Style Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600" />
              اختيار تصميم النمط البصري للشهادة
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'modern', label: 'أزرق ملكي عصري', color: 'from-blue-600 to-indigo-800' },
                { id: 'gold', label: 'كلاسيكي ذهبي', color: 'from-amber-600 to-yellow-800' },
                { id: 'royal', label: 'زمردي فاخر', color: 'from-emerald-600 to-teal-800' },
                { id: 'classic', label: 'أكاديمي رسمي', color: 'from-slate-700 to-slate-900' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStyle(item.id as any)}
                  className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-24 cursor-pointer ${
                    style === item.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-full h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                  <span className="text-xs font-bold text-slate-900">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black text-base hover:from-amber-700 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري كتابة وتصميم الشهادة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>إنشاء وتصميم الشهادة</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Generated Certificate Display */}
      {certificate && (
        <div className="space-y-6">
          
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                شهادة الطالب: {certificate.recipient}
              </span>
              <span className="text-xs font-bold text-slate-500">
                جاهزة للطباعة A4
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSave}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'تم الحفظ في المحفوظات' : 'حفظ الشهادة'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                طباعة الشهادة (A4 Landscape)
              </button>
            </div>
          </div>

          {/* Printable Certificate Frame */}
          <div className="relative print-container overflow-hidden rounded-3xl bg-white shadow-2xl p-8 sm:p-14 border-8 border-amber-400 text-center font-['Cairo'] min-h-[500px] flex flex-col justify-between">
            
            {/* Background Decorative Frame Watermark */}
            <div className="absolute inset-0 border-[16px] border-double border-blue-900/10 pointer-events-none rounded-2xl m-3" />
            <div className="absolute top-6 right-6 w-24 h-24 border-r-4 border-t-4 border-amber-500 pointer-events-none" />
            <div className="absolute top-6 left-6 w-24 h-24 border-l-4 border-t-4 border-amber-500 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-24 h-24 border-r-4 border-b-4 border-amber-500 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-24 h-24 border-l-4 border-b-4 border-amber-500 pointer-events-none" />

            {/* Certificate Header */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                  <Award className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-500 tracking-widest">{certificate.schoolName}</h3>
              <h2 className="text-3xl sm:text-5xl font-black text-blue-950 font-['Tajawal'] tracking-tight pt-2">
                {certificate.title}
              </h2>
              <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full my-2" />
            </div>

            {/* Certificate Body */}
            <div className="relative z-10 my-8 space-y-6">
              <p className="text-base sm:text-lg font-bold text-slate-700">
                تسر إدارة المدرسة ومعلم المادة أن يمنحوا هذه الشهادة للطالب/الطالبة المتميز:
              </p>

              <div className="text-3xl sm:text-5xl font-black text-blue-900 font-['Tajawal'] py-3 border-b-2 border-dashed border-amber-400 max-w-xl mx-auto">
                {certificate.recipient}
              </div>

              <p className="text-base sm:text-xl font-medium text-slate-800 max-w-3xl mx-auto leading-relaxed px-4">
                {certificate.appreciationText}
              </p>

              {certificate.quote && (
                <div className="italic text-xs sm:text-sm font-bold text-amber-800 bg-amber-50/70 p-3 rounded-2xl max-w-2xl mx-auto border border-amber-200">
                  {certificate.quote}
                </div>
              )}
            </div>

            {/* Certificate Footer Signatures */}
            <div className="relative z-10 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-xs font-bold text-slate-800">
              <div className="space-y-1 text-right">
                <p className="text-slate-500">مختوم بتاريخ:</p>
                <p className="text-sm font-black text-slate-900">{certificate.date}</p>
              </div>

              <div className="space-y-1 text-center hidden sm:block">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-blue-950 flex flex-col items-center justify-center mx-auto shadow-md border-2 border-white">
                  <Star className="w-5 h-5 fill-blue-950" />
                  <span className="text-[9px] font-black">وسام التفوق</span>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <p className="text-slate-500">معلم المادة:</p>
                <p className="text-sm font-black text-blue-900">{certificate.teacherName}</p>
                <div className="text-[10px] text-slate-400 italic">التوقيع الإعتيادي</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
