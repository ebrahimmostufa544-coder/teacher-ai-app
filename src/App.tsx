import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ExamGenerator } from './components/ExamGenerator';
import { LessonPlanner } from './components/LessonPlanner';
import { CertificateCreator } from './components/CertificateCreator';
import { AIAssistant } from './components/AIAssistant';
import { SavedStorageModal } from './components/SavedStorageModal';
import { ParentMessageModal } from './components/ParentMessageModal';
import { DownloadAPKModal } from './components/DownloadAPKModal';

import { ActiveTab, ExamData, LessonPlanData, CertificateData } from './types';
import { SAMPLE_EXAMS, SAMPLE_LESSON_PLANS, SAMPLE_CERTIFICATES } from './data/sampleData';
import { Wifi, Signal, Battery, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAndroidView, setIsAndroidView] = useState<boolean>(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState<boolean>(false);
  const [isDownloadApkModalOpen, setIsDownloadApkModalOpen] = useState<boolean>(false);

  // Storage state with initial sample data fallback
  const [exams, setExams] = useState<ExamData[]>(() => {
    const saved = localStorage.getItem('teacher_ai_exams');
    return saved ? JSON.parse(saved) : SAMPLE_EXAMS;
  });

  const [plans, setPlans] = useState<LessonPlanData[]>(() => {
    const saved = localStorage.getItem('teacher_ai_plans');
    return saved ? JSON.parse(saved) : SAMPLE_LESSON_PLANS;
  });

  const [certificates, setCertificates] = useState<CertificateData[]>(() => {
    const saved = localStorage.getItem('teacher_ai_certificates');
    return saved ? JSON.parse(saved) : SAMPLE_CERTIFICATES;
  });

  // Selected item states for instant viewing
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlanData | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('teacher_ai_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('teacher_ai_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('teacher_ai_certificates', JSON.stringify(certificates));
  }, [certificates]);

  // Handlers
  const handleSaveExam = (newExam: ExamData) => {
    setExams((prev) => [newExam, ...prev]);
    setSelectedExam(newExam);
  };

  const handleSavePlan = (newPlan: LessonPlanData) => {
    setPlans((prev) => [newPlan, ...prev]);
    setSelectedPlan(newPlan);
  };

  const handleSaveCert = (newCert: CertificateData) => {
    setCertificates((prev) => [newCert, ...prev]);
    setSelectedCert(newCert);
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => prev.filter(e => e.id !== id));
  };

  const handleDeletePlan = (id: string) => {
    setPlans((prev) => prev.filter(p => p.id !== id));
  };

  const handleDeleteCert = (id: string) => {
    setCertificates((prev) => prev.filter(c => c.id !== id));
  };

  const totalSavedCount = exams.length + plans.length + certificates.length;

  // Render Inner Content
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            setActiveTab={setActiveTab}
            exams={exams}
            plans={plans}
            certificates={certificates}
            onSelectExam={(e) => setSelectedExam(e)}
            onSelectPlan={(p) => setSelectedPlan(p)}
            onSelectCert={(c) => setSelectedCert(c)}
            onOpenParentModal={() => setIsParentModalOpen(true)}
            onOpenDownloadApk={() => setIsDownloadApkModalOpen(true)}
          />
        );
      case 'exam':
        return (
          <ExamGenerator
            currentExam={selectedExam}
            onSaveExam={handleSaveExam}
          />
        );
      case 'lesson':
        return (
          <LessonPlanner
            currentPlan={selectedPlan}
            onSavePlan={handleSavePlan}
          />
        );
      case 'certificate':
        return (
          <CertificateCreator
            currentCert={selectedCert}
            onSaveCert={handleSaveCert}
          />
        );
      case 'assistant':
        return (
          <AIAssistant
            onOpenParentModal={() => setIsParentModalOpen(true)}
          />
        );
      case 'saved':
        return (
          <SavedStorageModal
            exams={exams}
            plans={plans}
            certificates={certificates}
            onSelectExam={(e) => setSelectedExam(e)}
            onSelectPlan={(p) => setSelectedPlan(p)}
            onSelectCert={(c) => setSelectedCert(c)}
            onDeleteExam={handleDeleteExam}
            onDeletePlan={handleDeletePlan}
            onDeleteCert={handleDeleteCert}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 ${isAndroidView ? 'py-6 px-2 sm:px-4 flex flex-col items-center justify-center' : ''}`}>
      
      {/* Optional Android Phone Frame Container */}
      {isAndroidView ? (
        <div className="w-full max-w-[440px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden flex flex-col h-[90vh] max-h-[880px]">
          
          {/* Top Notch / Speaker Bar */}
          <div className="w-36 h-5 bg-slate-950 rounded-b-2xl mx-auto flex items-center justify-center gap-2 z-50 shrink-0">
            <div className="w-3 h-3 rounded-full bg-slate-800" />
            <div className="w-12 h-1.5 rounded-full bg-slate-800" />
          </div>

          {/* Android Status Bar */}
          <div className="bg-blue-700 text-white text-[11px] px-6 py-1 flex items-center justify-between font-bold z-40 shrink-0">
            <span>Teacher AI</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Android Screen Display */}
          <div className="bg-slate-50 flex-1 overflow-y-auto rounded-[32px] flex flex-col relative no-scrollbar">
            <Header
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              savedCount={totalSavedCount}
              isAndroidView={isAndroidView}
              setIsAndroidView={setIsAndroidView}
              onOpenParentModal={() => setIsParentModalOpen(true)}
              onOpenDownloadApk={() => setIsDownloadApkModalOpen(true)}
            />

            <main className="flex-1 p-3">
              {renderContent()}
            </main>

            <BottomNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              savedCount={totalSavedCount}
            />
          </div>

          {/* Android Navigation Pill Bar */}
          <div className="py-2 flex items-center justify-center z-50 shrink-0">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>

        </div>
      ) : (
        /* Standard Full Screen Layout */
        <div className="min-h-screen flex flex-col">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedCount={totalSavedCount}
            isAndroidView={isAndroidView}
            setIsAndroidView={setIsAndroidView}
            onOpenParentModal={() => setIsParentModalOpen(true)}
            onOpenDownloadApk={() => setIsDownloadApkModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderContent()}
          </main>

          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            savedCount={totalSavedCount}
          />
        </div>
      )}

      {/* Parent Communication Modal */}
      <ParentMessageModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
      />

      {/* Download Android APK Modal */}
      <DownloadAPKModal
        isOpen={isDownloadApkModalOpen}
        onClose={() => setIsDownloadApkModalOpen(false)}
      />
    </div>
  );
}
