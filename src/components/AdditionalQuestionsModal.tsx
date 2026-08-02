import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  X, 
  Check, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  Target, 
  BookOpen, 
  AlertCircle,
  Plus,
  TrendingDown,
  Brain,
  Lightbulb
} from 'lucide-react';
import { ExamData, Question } from '../types';

interface AdditionalQuestionsModalProps {
  exam: ExamData;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (newQuestions: Question[]) => void;
}

export const AdditionalQuestionsModal: React.FC<AdditionalQuestionsModalProps> = ({
  exam,
  isOpen,
  onClose,
  onAddQuestions
}) => {
  const [activeMode, setActiveMode] = useState<'topic' | 'performance'>('topic');
  
  // Topic/Answers Mode state
  const [topicOrAnswers, setTopicOrAnswers] = useState('');

  // Performance Mode state
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [performanceSummary, setPerformanceSummary] = useState('');
  const [followUpType, setFollowUpType] = useState<'remedial' | 'enrichment' | 'diagnostic'>('remedial');

  // Common Question Options
  const [difficulty, setDifficulty] = useState('متوسط');
  const [mcqCount, setMcqCount] = useState(2);
  const [tfCount, setTfCount] = useState(2);
  const [essayCount, setEssayCount] = useState(1);

  // Results & UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedForAdd, setSelectedForAdd] = useState<Record<number, boolean>>({});
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAddedSuccess(false);

    try {
      const selectedQuestionsContext = exam.questions.filter(q => selectedQuestionIds.includes(q.id));

      const response = await fetch('/api/generate-additional-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: exam.subject,
          grade: exam.grade,
          mode: activeMode === 'topic' ? 'topic_or_answers' : 'student_performance',
          topicOrAnswers,
          selectedQuestionContexts: selectedQuestionsContext,
          performanceSummary,
          followUpType,
          mcqCount: Number(mcqCount),
          tfCount: Number(tfCount),
          essayCount: Number(essayCount),
          difficulty,
          existingQuestions: exam.questions
        })
      });

      const data = await response.json();

      if (!data.success || !data.questions) {
        throw new Error(data.error || 'فشل توليد الأسئلة الإضافية');
      }

      const formattedQuestions: Question[] = data.questions.map((q: any, idx: number) => ({
        ...q,
        id: `add-q-${Date.now()}-${idx}`
      }));

      setGeneratedQuestions(formattedQuestions);
      
      // Select all generated questions by default
      const initialSelection: Record<number, boolean> = {};
      formattedQuestions.forEach((_, i) => { initialSelection[i] = true; });
      setSelectedForAdd(initialSelection);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSelectedToExam = () => {
    const questionsToAdd = generatedQuestions.filter((_, idx) => selectedForAdd[idx]);
    if (questionsToAdd.length === 0) return;

    onAddQuestions(questionsToAdd);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setGeneratedQuestions([]);
      onClose();
    }, 1200);
  };

  const toggleCheckGenerated = (index: number) => {
    setSelectedForAdd(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>توليد أسئلة إضافية ومتابعة الذكية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Tajawal']">
              إضافة أسئلة للامتحان: {exam.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              المادة: {exam.subject} | الصف: {exam.grade} | الأسئلة الحالية: {exam.questions.length} سؤال
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 no-scrollbar">
          
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => { setActiveMode('topic'); setGeneratedQuestions([]); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === 'topic'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>بناءً على موضوع / إجابات نموذجية</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveMode('performance'); setGeneratedQuestions([]); }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === 'performance'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-600" />
              <span>أسئلة متابعة لأداء الطلاب</span>
            </button>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Mode 1: Topic or Answers */}
            {activeMode === 'topic' && (
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  أدخل موضوعاً فرعياً جديداً أو إجابات نموذجية لتوليد الأسئلة حولها
                </label>
                <textarea
                  value={topicOrAnswers}
                  onChange={(e) => setTopicOrAnswers(e.target.value)}
                  placeholder="مثال: أضف أسئلة حول التنفس الخلوي في النبات، أو أرقام وإجابات المسائل الحسابية التالية..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            )}

            {/* Mode 2: Student Performance Follow-up */}
            {activeMode === 'performance' && (
              <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                
                {/* Follow-up Purpose Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    الغرض التربوي لأسئلة المتابعة:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFollowUpType('remedial')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        followUpType === 'remedial'
                          ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🩹 علاجي واستدراك</span>
                      <span className="text-[10px] font-normal text-slate-500">لتبسيط الفكرة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFollowUpType('diagnostic')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        followUpType === 'diagnostic'
                          ? 'bg-blue-100 border-blue-300 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🎯 تشخيص وتقويم</span>
                      <span className="text-[10px] font-normal text-slate-500">قياس الاستيعاب</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFollowUpType('enrichment')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        followUpType === 'enrichment'
                          ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>🚀 إثرائي وتحدي</span>
                      <span className="text-[10px] font-normal text-slate-500">للمتفوقين</span>
                    </button>
                  </div>
                </div>

                {/* Question Selection Checkboxes from current exam */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>اختر الأسئلة التي تعثر فيها الطلاب في الامتحان الحالي:</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      المحدد ({selectedQuestionIds.length} من {exam.questions.length})
                    </span>
                  </label>
                  
                  <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-white border border-slate-200 text-xs no-scrollbar">
                    {exam.questions.map((q, idx) => {
                      const isChecked = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestionSelection(q.id)}
                          className={`p-2 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="line-clamp-1">
                            س{idx + 1}: {q.question}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance Notes Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    ملاحظاتك حول أخطاء الطلاب أو نتائج إجاباتهم (اختياري)
                  </label>
                  <input
                    type="text"
                    value={performanceSummary}
                    onChange={(e) => setPerformanceSummary(e.target.value)}
                    placeholder="مثال: أخطأ أغلب الطلاب في تحويل الوحدات القياسية أو تمييز السؤال المقالي الأول"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

              </div>
            )}

            {/* Question Counts and Difficulty Config */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                تحديد أنواع وأعداد الأسئلة الإضافية
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">اختيار متعدد</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">صواب / خطأ</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={tfCount}
                    onChange={(e) => setTfCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">أسئلة مقالية</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={essayCount}
                    onChange={(e) => setEssayCount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">مستوى الصعوبة</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-center"
                  >
                    <option value="سهل">سهل</option>
                    <option value="متوسط">متوسط</option>
                    <option value="صعب">صعب</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري توليد الأسئلة بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>توليد الأسئلة الإضافية الان</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Questions List Section */}
          {generatedQuestions.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 font-['Tajawal'] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  الأسئلة الإضافية المبتكرة ({generatedQuestions.length} سؤال)
                </h3>
                <span className="text-[11px] text-slate-500">حدد الأسئلة التي ترغب بإضافتها للامتحان</span>
              </div>

              <div className="space-y-3">
                {generatedQuestions.map((q, idx) => {
                  const isChecked = selectedForAdd[idx];
                  return (
                    <div
                      key={q.id || idx}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                        isChecked
                          ? 'bg-blue-50/40 border-blue-300'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <label className="flex items-start gap-2.5 cursor-pointer font-bold text-slate-900 text-sm">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCheckGenerated(idx)}
                            className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{q.question}</span>
                        </label>
                        <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {q.marks} {q.marks === 1 ? 'درجة' : 'درجات'}
                        </span>
                      </div>

                      {/* Options if MCQ */}
                      {q.options && q.options.length > 0 && (
                        <div className="pr-6 grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="bg-white p-1.5 rounded-lg border border-slate-200">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Answer Key & Explanation */}
                      <div className="pr-6 text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200/60 pt-2">
                        <p><strong className="text-emerald-700">الإجابة:</strong> {q.correctAnswer}</p>
                        {q.explanation && <p><strong className="text-slate-700">الشرح:</strong> {q.explanation}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add To Exam Button */}
              <button
                type="button"
                onClick={handleAddSelectedToExam}
                disabled={Object.values(selectedForAdd).filter(Boolean).length === 0}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>تمت إضافة الأسئلة للامتحان بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>
                      إضافة الأسئلة المختارة ({Object.values(selectedForAdd).filter(Boolean).length}) إلى الامتحان
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
