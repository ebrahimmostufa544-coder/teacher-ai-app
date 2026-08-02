import React from 'react';
import { 
  Sparkles, 
  FileCheck2, 
  GraduationCap, 
  Award, 
  Bot, 
  MessageSquare, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Printer, 
  FileText,
  Star,
  Users
} from 'lucide-react';
import { ActiveTab, ExamData, LessonPlanData, CertificateData } from '../types';

interface HomeScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
  exams: ExamData[];
  plans: LessonPlanData[];
  certificates: CertificateData[];
  onSelectExam: (exam: ExamData) => void;
  onSelectPlan: (plan: LessonPlanData) => void;
  onSelectCert: (cert: CertificateData) => void;
  onOpenParentModal: () => void;
  onOpenDownloadApk?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  exams,
  plans,
  certificates,
  onSelectExam,
  onSelectPlan,
  onSelectCert,
  onOpenParentModal,
  onOpenDownloadApk
}) => {
  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Welcome Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 font-['Tajawal']">
            مرحباً، أستاذ أحمد 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            جاهز لمساعدتك في مهامك التعليمية اليوم • {currentDate}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button 
            onClick={onOpenParentModal}
            className="px-4 py-2.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>رسائل أولياء الأمور</span>
          </button>

          <div className="flex items-center gap-3 pr-3 border-r border-slate-200">
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">أحمد محمود</p>
              <p className="text-xs text-slate-400">معلم متميز</p>
            </div>
            <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
              أ
            </div>
          </div>
        </div>
      </div>

      {/* Android Native App Promotion Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Native Android App
            </span>
            <span className="bg-blue-800/80 text-blue-200 text-xs px-2.5 py-0.5 rounded-full border border-blue-700/60">
              تطبيق الأندرويد الأصلي جاهز
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Tajawal'] text-white">
            حمل تطبيق المعلم الذكي بصيغة APK على هاتفك الأندرويد
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
            تم بناء التطبيق كتطبيق أندرويد متكامل. قم بتنزيل ملف <code className="bg-blue-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">app-debug.apk</code> للتثبيت والعمل المباشر على الهاتف.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenDownloadApk}
            className="w-full md:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>📱 تنزيل APK الأندرويد</span>
          </button>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Workspace Grid Layout: Main Action Cards + Right Active Assist Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Main Workspace (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2x2 Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Exam Generator */}
            <div 
              onClick={() => setActiveTab('exam')}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                📝
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  إنشاء وتوسيع الامتحانات بالذكاء الاصطناعي
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  أنشئ امتحانات جديدة، أو ولّد أسئلة إضافية ومتابعة واستدراك بناءً على أداء وأخطاء الطلاب.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer mt-2">
                  ابدأ الآن
                </button>
              </div>
            </div>

            {/* Lesson Prep */}
            <div 
              onClick={() => setActiveTab('lesson')}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                📚
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  تحضير الدروس
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  خطط لدروسك بذكاء. صياغة الأهداف والوسائل التعليمية والخاتمة واستراتيجيات التقييم.
                </p>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer mt-2">
                  توليد خطة
                </button>
              </div>
            </div>

            {/* Certificates */}
            <div 
              onClick={() => setActiveTab('certificate')}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                🎓
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                  شهادات تقدير
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  تصاميم احترافية لشهادات الشكر والتقدير لطلابك المتميزين مع شعر وعبارات تشجيعية.
                </p>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer mt-2">
                  تصميم شهادة
                </button>
              </div>
            </div>

            {/* AI Chat Assistant */}
            <div 
              onClick={() => setActiveTab('assistant')}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5 hover:shadow-md transition-all cursor-pointer group border-r-4 border-r-blue-500"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                🤖
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  مساعد المعلم الذكي
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  اسأل المساعد عن أسلوب صفّي، صياغة التغذية الراجعة، أو حل تحديات الطلاب.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer mt-2">
                  افتح المحادثة
                </button>
              </div>
            </div>

          </div>

          {/* Recent History / Archives List */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">آخر الأعمال والمحفوظات</h2>
              <button 
                onClick={() => setActiveTab('saved')}
                className="text-blue-600 text-sm font-semibold hover:underline cursor-pointer"
              >
                عرض الكل ({exams.length + plans.length + certificates.length})
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {exams.length > 0 && (
                <div 
                  onClick={() => { onSelectExam(exams[0]); setActiveTab('exam'); }}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm text-xl font-bold">📄</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{exams[0].title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{exams[0].subject} • {exams[0].grade} • {exams[0].questions.length} أسئلة</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-200">معاينة</span>
                </div>
              )}

              {plans.length > 0 && (
                <div 
                  onClick={() => { onSelectPlan(plans[0]); setActiveTab('lesson'); }}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm text-xl font-bold">📖</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{plans[0].title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{plans[0].subject} • {plans[0].grade} • {plans[0].duration}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-white px-3 py-1 rounded-lg border border-slate-200">معاينة</span>
                </div>
              )}

              {certificates.length > 0 && (
                <div 
                  onClick={() => { onSelectCert(certificates[0]); setActiveTab('certificate'); }}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-amber-600 rounded-xl flex items-center justify-center shadow-sm text-xl font-bold">🏆</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">شهادة تكريم: {certificates[0].recipient}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{certificates[0].schoolName} • {certificates[0].createdAt}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-white px-3 py-1 rounded-lg border border-slate-200">عرض</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Active Assistant Sidebar Panel */}
        <div className="space-y-6">
          
          {/* Active AI Status Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">مساعدك النشط الأن</h2>
            </div>

            {/* AI Recommendation Quote Box */}
            <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 space-y-2">
              <p className="text-xs text-indigo-500 font-bold">توصية الذكاء الاصطناعي</p>
              <p className="text-xs sm:text-sm text-indigo-950 font-medium italic leading-relaxed">
                "لاحظت أنك تقوم بإنشاء امتحانات للتحضير الدوري بكثرة. هل ترغب في توليد خطة تحضير درس تفاعلية تلائم الامتحان الأخير؟"
              </p>
            </div>

            {/* Monthly Efficiency Statistics Chart */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-xs font-bold text-slate-600">إحصائيات الإنجاز والإنتاجية</p>
              <div className="flex justify-between items-end h-20 gap-2 pt-2">
                <div className="w-full bg-blue-200 h-1/2 rounded-t-md" title="الأسبوع 1" />
                <div className="w-full bg-blue-300 h-3/4 rounded-t-md" title="الأسبوع 2" />
                <div className="w-full bg-blue-600 h-full rounded-t-md" title="الأسبوع 3" />
                <div className="w-full bg-blue-400 h-2/3 rounded-t-md" title="الأسبوع 4" />
                <div className="w-full bg-blue-200 h-1/3 rounded-t-md" title="الأسبوع الحالي" />
              </div>
              <p className="text-[10px] text-center text-slate-500 font-medium">زيادة 25% في كفاءة التحضير وإعداد الامتحانات</p>
            </div>

            {/* AI Credit usage status */}
            <div className="bg-blue-900 text-white p-4 rounded-2xl border border-blue-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-300 font-bold">استهلاك الذكاء الاصطناعي</span>
                <span className="font-mono text-blue-200">750 / 1000 نقطة</span>
              </div>
              <div className="w-full bg-blue-950 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-400 w-3/4 h-full rounded-full" />
              </div>
            </div>

            {/* Talk to AI CTA Button */}
            <button 
              onClick={() => setActiveTab('assistant')}
              className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>تحدث إلى المعلم الذكي</span>
              <span className="text-lg">✨</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
