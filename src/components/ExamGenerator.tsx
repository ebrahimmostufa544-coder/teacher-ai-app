import React, { useState } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Save, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  BookOpen, 
  School, 
  Clock, 
  FileText,
  Layers,
  HelpCircle,
  PlusCircle,
  Plus
} from 'lucide-react';
import { ExamData, Question } from '../types';
import { AdditionalQuestionsModal } from './AdditionalQuestionsModal';

interface ExamGeneratorProps {
  currentExam: ExamData | null;
  onSaveExam: (exam: ExamData) => void;
}

export const ExamGenerator: React.FC<ExamGeneratorProps> = ({ currentExam, onSaveExam }) => {
  // Form Inputs
  const [subject, setSubject] = useState('العلوم العامة');
  const [grade, setGrade] = useState('الصف السادس الابتدائي');
  const [topic, setTopic] = useState('أجهزة جسم الإنسان والبناء الضوئي');
  const [difficulty, setDifficulty] = useState('متوسط');
  const [schoolName, setSchoolName] = useState('المدرسة العربية النموذجية');
  const [term, setTerm] = useState('اختبار منتصف الفصل الدراسي الأول');
  const [duration, setDuration] = useState('60 دقيقة');
  const [mcqCount, setMcqCount] = useState(5);
  const [tfCount, setTfCount] = useState(5);
  const [essayCount, setEssayCount] = useState(2);
  const [customInstructions, setCustomInstructions] = useState('');

  // Generated Exam State
  const [exam, setExam] = useState<ExamData | null>(currentExam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);

  const subjectsList = [
    'العلوم العامة',
    'الرياضيات',
    'اللغة العربية',
    'الدراسات الاجتماعية',
    'التربية الإسلامية',
    'اللغة الإنجليزية',
    'الفيزياء',
    'الكيمياء',
    'الأحياء',
    'التكنولوجيا والحاسب'
  ];

  const handleGenerateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          difficulty,
          schoolName,
          term,
          examDuration: duration,
          mcqCount: Number(mcqCount),
          tfCount: Number(tfCount),
          essayCount: Number(essayCount),
          customInstructions
        }),
      });

      const data = await response.json();

      if (!data.success || !data.exam) {
        throw new Error(data.error || 'فشل توليد الامتحان');
      }

      const newExamData: ExamData = {
        ...data.exam,
        id: `exam-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('ar-EG')
      };

      setExam(newExamData);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التواصل مع الذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!exam) return;
    
    let text = `======================================\n`;
    text += `${exam.schoolName}\n`;
    text += `${exam.term} - مادة: ${exam.subject} (${exam.grade})\n`;
    text += `الزمن: ${exam.duration} | الدرجة الكلية: ${exam.totalMarks}\n`;
    text += `======================================\n\n`;
    
    exam.questions.forEach((q, idx) => {
      text += `س${idx + 1} (${q.marks} درجات): ${q.question}\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          text += `   ${opt}\n`;
        });
      }
      text += `\n`;
    });

    if (showAnswerKey) {
      text += `\n-------- نموذج الإجابة والتصحيح --------\n`;
      exam.questions.forEach((q, idx) => {
        text += `إجابة س${idx + 1}: ${q.correctAnswer}\n`;
        if (q.explanation) text += `الشرح: ${q.explanation}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (!exam) return;
    onSaveExam(exam);
    setIsSaved(true);
  };

  const handleAddQuestions = (newQuestions: Question[]) => {
    if (!exam) return;
    const updatedQuestions = [...exam.questions, ...newQuestions];
    const addedMarks = newQuestions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
    const updatedExam: ExamData = {
      ...exam,
      questions: updatedQuestions,
      totalMarks: exam.totalMarks + addedMarks
    };
    setExam(updatedExam);
    onSaveExam(updatedExam);
    setIsSaved(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Description */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <FileCheck2 className="w-4 h-4" />
            <span>مولد الامتحانات الذكي • Exam Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal']">
            أنشئ امتحاناً متكاملاً بالذكاء الاصطناعي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            حدد المادة والصف وعناصر الأسئلة، وسيقوم الذكاء الاصطناعي ببناء امتحان متوازن مع نموذج الإجابة وسلالم التصحيح.
          </p>
        </div>

        {exam && (
          <button
            onClick={() => setExam(null)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            توليد امتحان جديد
          </button>
        )}
      </div>

      {/* Main Creation Form (Only when exam is null or explicitly creating new) */}
      {!exam && (
        <form onSubmit={handleGenerateExam} className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                المادة الدراسية
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              >
                {subjectsList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Grade Level */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                الصف الدراسي
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="مثال: الصف السادس الابتدائي"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                required
              />
            </div>

            {/* Topic / Unit */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                الموضوع أو الوحدة
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: البناء الضوئي وأجهزة الجسم"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                required
              />
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                اسم المدرسة / المؤسسة
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            {/* Exam Term / Header */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                مسمى الاختبار
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="مثال: اختبار منتصف الفصل الأول"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            {/* Exam Duration */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                مدة الاختبار
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="مثال: 60 دقيقة"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          {/* Difficulty Level & Question Breakdown Counters */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-4">
            <h3 className="text-sm font-extrabold text-blue-900 font-['Tajawal'] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              تحديد نوع وتوزيع الأسئلة
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">مستوى الصعوبة</label>
                <div className="flex rounded-xl bg-white p-1 border border-slate-200">
                  {['سهل', 'متوسط', 'صعب'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        difficulty === diff
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اختيار من متعدد (MCQ)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-sm text-center"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">صواب أو خطأ</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={tfCount}
                  onChange={(e) => setTfCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-sm text-center"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">أسئلة مقالية / قصيرة</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={essayCount}
                  onChange={(e) => setEssayCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-sm text-center"
                />
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">تعليمات أو ملاحظات خاصة للذكاء الاصطناعي (اختياري)</label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="مثال: ركز على الفصل الثالث، اجعل الأسئلة تخدم الفهم والتطبيق..."
              rows={2}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm font-bold border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 text-white font-black text-base hover:from-blue-800 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري إنشاء الامتحان بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>توليد الامتحان الآن</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Generated Printable Exam View */}
      {exam && (
        <div className="space-y-6">
          
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                الدرجة الكلية: {exam.totalMarks} درجة
              </span>
              <span className="text-xs font-bold text-slate-500">
                الزمن: {exam.duration}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAdditionalModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>أسئلة إضافية / متابعة</span>
              </button>

              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAnswerKey
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnswerKey ? 'إخفاء نموذج الإجابة' : 'عرض نموذج الإجابة'}
              </button>

              <button
                onClick={handleCopyText}
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
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'تم الحفظ في المحفوظات' : 'حفظ الامتحان'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                طباعة / PDF
              </button>
            </div>
          </div>

          {/* Interactive Feature Banner for Additional & Follow-up Questions */}
          <div className="bg-gradient-to-r from-blue-60 to-amber-50/80 p-4 rounded-2xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                هل تريد إضافة أسئلة إضافية أو أسئلة متابعة واستدراك بناءً على أداء الطلاب؟
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600">
                أدخل موضوعاً جديداً أو حدد الأسئلة التي تعثر فيها الطلاب لتوليد أسئلة علاجية أو إثرائية فورية وتضمينها بالامتحان.
              </p>
            </div>
            <button
              onClick={() => setIsAdditionalModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>توليد أسئلة إضافية الآن</span>
            </button>
          </div>

          {/* Additional Questions Modal */}
          <AdditionalQuestionsModal
            exam={exam}
            isOpen={isAdditionalModalOpen}
            onClose={() => setIsAdditionalModalOpen(false)}
            onAddQuestions={handleAddQuestions}
          />

          {/* Printable Exam Paper Container */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-300 print-container space-y-8 text-slate-900 font-['Cairo']">
            
            {/* Header / School Seal Box */}
            <div className="border-b-2 border-slate-900 pb-6 space-y-4">
              <div className="flex items-center justify-between text-center sm:text-right">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{exam.schoolName}</h2>
                  <p className="text-sm font-bold text-slate-700">{exam.term}</p>
                  <p className="text-xs font-medium text-slate-600">المادة: {exam.subject} | الصف: {exam.grade}</p>
                </div>

                <div className="hidden sm:block text-center border-2 border-slate-800 p-2 rounded-xl min-w-32">
                  <div className="text-xs font-bold">الدرجة الكلية</div>
                  <div className="text-2xl font-black text-blue-900">{exam.totalMarks}</div>
                  <div className="text-[10px] text-slate-500">درجة</div>
                </div>

                <div className="text-left text-xs text-slate-700 font-bold space-y-1">
                  <p>الزمن: {exam.duration}</p>
                  <p>التاريخ: {exam.createdAt}</p>
                  <p>نوع النموذج: (أ)</p>
                </div>
              </div>

              {/* Student Info Filling Fields */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                <div>اسم الطالب: .....................................................</div>
                <div>رقم الجلوس: ........................</div>
                <div>درجة الطالب: ( &nbsp;&nbsp;&nbsp;&nbsp; / {exam.totalMarks} )</div>
              </div>
            </div>

            {/* General Instructions */}
            {exam.generalInstructions && exam.generalInstructions.length > 0 && (
              <div className="text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1">
                <span className="font-extrabold text-blue-900">تعليمات عامة للطلاب:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {exam.generalInstructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Question Sections */}
            <div className="space-y-8">
              {exam.questions.map((q, idx) => (
                <div key={q.id || idx} className="space-y-3 border-b border-slate-200 pb-6 last:border-none">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                      <span className="text-blue-700 font-black ml-2">س{idx + 1}:</span>
                      {q.question}
                    </h3>
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 whitespace-nowrap">
                      [{q.marks} {q.marks === 1 ? 'درجة' : 'درجات'}]
                    </span>
                  </div>

                  {/* Multiple Choice Options */}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6 pt-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium">
                          <div className="w-4 h-4 rounded-full border border-slate-400" />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True / False Options */}
                  {q.type === 'true_false' && (
                    <div className="flex items-center gap-6 pr-6 pt-2 text-sm font-bold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="w-4 h-4 rounded border border-slate-400" />
                        <span>( &nbsp;&nbsp; ) صواب</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="w-4 h-4 rounded border border-slate-400" />
                        <span>( &nbsp;&nbsp; ) خطأ</span>
                      </label>
                    </div>
                  )}

                  {/* Essay / Short Answer Writing Lines */}
                  {q.type === 'essay' && (
                    <div className="pt-2 space-y-3 pr-6">
                      <div className="border-b border-dashed border-slate-400 h-6" />
                      <div className="border-b border-dashed border-slate-400 h-6" />
                      <div className="border-b border-dashed border-slate-400 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Model Answer Section (Key for teachers) */}
            {showAnswerKey && (
              <div className="mt-12 pt-8 border-t-2 border-indigo-600 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-indigo-900 font-['Tajawal'] flex items-center gap-2">
                    <Check className="w-5 h-5 text-indigo-600" />
                    نموذج الإجابة ودليل التصحيح للمعلم
                  </h3>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    خاص بالمصحح
                  </span>
                </div>

                <div className="space-y-4">
                  {exam.questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm space-y-1">
                      <div className="font-bold text-indigo-950">
                        س{idx + 1}: الإجابة الصحيحة: <span className="text-emerald-700 font-extrabold">{q.correctAnswer}</span>
                      </div>
                      {q.explanation && (
                        <div className="text-slate-600">
                          <span className="font-semibold text-slate-800">تفسير ودليل التصحيح: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paper Footer */}
            <div className="pt-8 text-center text-xs font-bold text-slate-500 border-t border-slate-200">
              مع تمنياتنا لجميع طلابنا بالتوفيق والنجاح • أُعد بواسطة تطبيق Teacher AI
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
