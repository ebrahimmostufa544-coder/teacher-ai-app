import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  Printer, 
  FileCheck2, 
  GraduationCap, 
  Award, 
  Search,
  ArrowLeft
} from 'lucide-react';
import { ExamData, LessonPlanData, CertificateData, ActiveTab } from '../types';

interface SavedStorageModalProps {
  exams: ExamData[];
  plans: LessonPlanData[];
  certificates: CertificateData[];
  onSelectExam: (exam: ExamData) => void;
  onSelectPlan: (plan: LessonPlanData) => void;
  onSelectCert: (cert: CertificateData) => void;
  onDeleteExam: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onDeleteCert: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SavedStorageModal: React.FC<SavedStorageModalProps> = ({
  exams,
  plans,
  certificates,
  onSelectExam,
  onSelectPlan,
  onSelectCert,
  onDeleteExam,
  onDeletePlan,
  onDeleteCert,
  setActiveTab
}) => {
  const [filter, setFilter] = useState<'all' | 'exams' | 'plans' | 'certs'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = exams.filter(e => 
    e.title.includes(searchQuery) || e.subject.includes(searchQuery) || e.grade.includes(searchQuery)
  );
  const filteredPlans = plans.filter(p => 
    p.title.includes(searchQuery) || p.subject.includes(searchQuery) || p.grade.includes(searchQuery)
  );
  const filteredCerts = certificates.filter(c => 
    c.recipient.includes(searchQuery) || c.schoolName.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 no-print flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <BookmarkCheck className="w-4 h-4" />
            <span>سجل الأعمال والمحفوظات • Saved Archives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Tajawal']">
            جميع أعمالك المحفوظة للطباعة والمراجعة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إجمالي المحفوظات: {exams.length + plans.length + certificates.length} عمل مفهرس وجاهز للاستخدام.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المحفوظات..."
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-print">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الكل ({exams.length + plans.length + certificates.length})
        </button>

        <button
          onClick={() => setFilter('exams')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'exams'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الامتحانات ({exams.length})
        </button>

        <button
          onClick={() => setFilter('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'plans'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          تحضير الدروس ({plans.length})
        </button>

        <button
          onClick={() => setFilter('certs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filter === 'certs'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الشهادات ({certificates.length})
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Exam Cards */}
        {(filter === 'all' || filter === 'exams') && filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  امتحان
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{exam.createdAt}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base line-clamp-2">{exam.title}</h3>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• المادة: {exam.subject}</p>
                <p>• الصف: {exam.grade}</p>
                <p>• عدد الأسئلة: {exam.questions.length} | الدرجة: {exam.totalMarks}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onDeleteExam(exam.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => { onSelectExam(exam); setActiveTab('exam'); }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                معاينة وطباعة
              </button>
            </div>
          </div>
        ))}

        {/* Lesson Plan Cards */}
        {(filter === 'all' || filter === 'plans') && filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  تحضير درس
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{plan.createdAt}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base line-clamp-2">{plan.title}</h3>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• المادة: {plan.subject}</p>
                <p>• الصف: {plan.grade}</p>
                <p>• الزمن: {plan.duration}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onDeletePlan(plan.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => { onSelectPlan(plan); setActiveTab('lesson'); }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                معاينة التحضير
              </button>
            </div>
          </div>
        ))}

        {/* Certificate Cards */}
        {(filter === 'all' || filter === 'certs') && filteredCerts.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  شهادة تقدير
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{cert.createdAt}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base line-clamp-1">تكريم: {cert.recipient}</h3>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• المدرسة: {cert.schoolName}</p>
                <p>• المعلم: {cert.teacherName}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onDeleteCert(cert.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => { onSelectCert(cert); setActiveTab('certificate'); }}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-amber-700 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                عرض الشهادة
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
