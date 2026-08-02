import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Save, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Target, 
  Wrench, 
  Users, 
  BookOpen
} from 'lucide-react';
import { LessonPlanData } from '../types';

interface LessonPlannerProps {
  currentPlan: LessonPlanData | null;
  onSavePlan: (plan: LessonPlanData) => void;
}

export const LessonPlanner: React.FC<LessonPlannerProps> = ({ currentPlan, onSavePlan }) => {
  // Form state
  const [subject, setSubject] = useState('اللغة العربية');
  const [grade, setGrade] = useState('الصف الخامس الابتدائي');
  const [topic, setTopic] = useState('أنواع الفاعل والجملة الفعلية');
  const [duration, setDuration] = useState('45 دقيقة');
  const [teachingStrategy, setTeachingStrategy] = useState('التعلم النشط والاستكشاف الجماعي');
  const [prerequisites, setPrerequisites] = useState('مفهوم الجملة وركنيها الأساسيين');
  const [specialNeeds, setSpecialNeeds] = useState('مراعاة تباين السرعة الكنزية لدى الطلاب');

  // Plan state
  const [plan, setPlan] = useState<LessonPlanData | null>(currentPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          duration,
          teachingStrategy,
          prerequisites,
          specialNeeds
        }),
      });

      const data = await response.json();

      if (!data.success || !data.plan) {
        throw new Error(data.error || 'فشل تحضير الدرس');
      }

      const newPlanData: LessonPlanData = {
        ...data.plan,
        id: `plan-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('ar-EG')
      };

      setPlan(newPlanData);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!plan) return;
    
    let text = `======================================\n`;
    text += `خطة تحضير درس: ${plan.title}\n`;
    text += `المادة: ${plan.subject} | الصف: ${plan.grade} | الزمن: ${plan.duration}\n`;
    text += `======================================\n\n`;

    text += `الهدف العام: ${plan.generalGoal}\n\n`;

    text += `الأهداف السلوكية:\n`;
    plan.learningObjectives.forEach(obj => {
      text += `- [${obj.type}]: ${obj.text}\n`;
    });

    text += `\nالأدوات والوسائل:\n`;
    plan.materialsAndTools.forEach(m => {
      text += `- ${m}\n`;
    });

    text += `\nخطوات سير الدرس:\n`;
    plan.lessonSteps.forEach(s => {
      text += `\n- ${s.phase} (${s.time}):\n`;
      text += `  نشاط المعلم: ${s.teacherActivity}\n`;
      text += `  نشاط الطالب: ${s.studentActivity}\n`;
      text += `  أسلوب التقويم: ${s.assessment}\n`;
    });

    text += `\nالفروق الفردية:\n`;
    text += `- المتفوقون: ${plan.differentiation.advanced}\n`;
    text += `- الدعم: ${plan.differentiation.support}\n\n`;

    text += `الواجب المنزلي: ${plan.homework}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!plan) return;
    onSavePlan(plan);
    setIsSaved(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>مخطط الدروس التفاعلي • Lesson Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal']">
            تحضير الدروس التربوي بالذكاء الاصطناعي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            صمم خطط دروس محكمة بالأهداف السلوكية، المراحل الزمنية، والأنشطة التفاعلية الجاهزة للاستخدام الصفّي.
          </p>
        </div>

        {plan && (
          <button
            onClick={() => setPlan(null)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            تحضير درس جديد
          </button>
        )}
      </div>

      {/* Creation Form */}
      {!plan && (
        <form onSubmit={handleGeneratePlan} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">المادة الدراسية</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: اللغة العربية"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">الصف الدراسي</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="مثال: الصف الخامس الابتدائي"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">عنوان الدرس / الموضوع</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: أنواع الفاعل والجملة الفعلية"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">مدة الحصة</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              >
                <option value="45 دقيقة">45 دقيقة (حصة قياسية)</option>
                <option value="90 دقيقة">90 دقيقة (حصة مزدوجة)</option>
                <option value="30 دقيقة">30 دقيقة (مراجعة سريعة)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">استراتيجية التدريس المفضلة</label>
              <input
                type="text"
                value={teachingStrategy}
                onChange={(e) => setTeachingStrategy(e.target.value)}
                placeholder="مثال: التعلم النشط والاستكشاف الجماعي"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">المكتسبات القبلية للطلاب</label>
              <input
                type="text"
                value={prerequisites}
                onChange={(e) => setPrerequisites(e.target.value)}
                placeholder="مثال: معرفة أركان الجملة الفعلية"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">ملاحظات الفروق الفردية والاحتياجات الخاصة (اختياري)</label>
            <input
              type="text"
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="مثال: مراعاة البطء في الكتابة وتوفير دعم مرئي..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 text-white font-black text-base hover:from-indigo-800 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري توليد خطة التحضير بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>تحضير الدرس الآن</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Generated Plan View & Printable Layout */}
      {plan && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                المادة: {plan.subject}
              </span>
              <span className="text-xs font-bold text-slate-500">
                الزمن: {plan.duration}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'تم النسخ!' : 'نسخ النص'}
              </button>

              <button
                onClick={handleSave}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'تم الحفظ في المحفوظات' : 'حفظ التحضير'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                طباعة / PDF
              </button>
            </div>
          </div>

          {/* Printable Lesson Plan Paper */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-300 print-container space-y-8 text-slate-900 font-['Cairo']">
            
            {/* Header */}
            <div className="border-b-2 border-indigo-900 pb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  بطاقة تحضير درس نموذجية
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{plan.title}</h2>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-600 mt-1">
                  <span>المادة: {plan.subject}</span>
                  <span>•</span>
                  <span>الصف: {plan.grade}</span>
                  <span>•</span>
                  <span>الزمن: {plan.duration}</span>
                </div>
              </div>

              <div className="text-left text-xs font-bold text-slate-500 space-y-1">
                <p>التاريخ: {plan.createdAt}</p>
                <p>إعداد: المعلم الذكي Teacher AI</p>
              </div>
            </div>

            {/* General Goal */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <h3 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2 font-['Tajawal']">
                <Target className="w-4 h-4 text-indigo-600" />
                الهدف العام من الدرس:
              </h3>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {plan.generalGoal}
              </p>
            </div>

            {/* Behavioral Objectives */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                الأهداف السلوكية (مخرجات التعلم):
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.learningObjectives.map((obj, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                      obj.type === 'معرفي' ? 'bg-blue-100 text-blue-800' :
                      obj.type === 'مهاري' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      مجال {obj.type}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 pt-1 leading-relaxed">
                      {obj.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials & Tools */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-600" />
                الأدوات والوسائل التعليمية المستخدمة:
              </h3>
              <div className="flex flex-wrap gap-2">
                {plan.materialsAndTools.map((tool, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                    ✓ {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Timed Step-by-Step Activities Table */}
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                خطوات سير الدرس والأنشطة الصفية (التنفيذ الزمني):
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-300">
                <table className="w-full text-xs sm:text-sm text-right border-collapse">
                  <thead className="bg-indigo-900 text-white font-bold">
                    <tr>
                      <th className="p-3 border-b border-indigo-800">مرحلة الدرس</th>
                      <th className="p-3 border-b border-indigo-800 w-20 text-center">الزمن</th>
                      <th className="p-3 border-b border-indigo-800">دور المعلم (الأنشطة)</th>
                      <th className="p-3 border-b border-indigo-800">دور الطلاب (التفاعل)</th>
                      <th className="p-3 border-b border-indigo-800">أسلوب التقييم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {plan.lessonSteps.map((step, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-3 font-extrabold text-indigo-950 whitespace-nowrap bg-indigo-50/30">
                          {step.phase}
                        </td>
                        <td className="p-3 font-bold text-center text-indigo-700 whitespace-nowrap">
                          {step.time}
                        </td>
                        <td className="p-3 leading-relaxed text-slate-800">
                          {step.teacherActivity}
                        </td>
                        <td className="p-3 leading-relaxed text-slate-700">
                          {step.studentActivity}
                        </td>
                        <td className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                          {step.assessment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Differentiation Strategies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <h4 className="text-xs font-black text-amber-900 font-['Tajawal']">🌟 مراعاة المتفوقين (أنشطة إثرائية):</h4>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {plan.differentiation.advanced}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                <h4 className="text-xs font-black text-blue-900 font-['Tajawal']">🤝 دعم الطلاب الذين يحتاجون مساعدة:</h4>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {plan.differentiation.support}
                </p>
              </div>
            </div>

            {/* Homework & Assignments */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500">الواجب المنزلي والتكليف:</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{plan.homework}</p>
              </div>
              <div className="text-left text-xs font-bold text-slate-400">توقيع المعلم: ..............</div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
