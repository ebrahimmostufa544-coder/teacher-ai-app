import React from 'react';
import { Sparkles, BookOpen, GraduationCap, Award, Bot, BookmarkCheck, Smartphone, Monitor, Download } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
  isAndroidView: boolean;
  setIsAndroidView: (val: boolean) => void;
  onOpenParentModal: () => void;
  onOpenDownloadApk: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  isAndroidView,
  setIsAndroidView,
  onOpenParentModal,
  onOpenDownloadApk
}) => {
  return (
    <header className="bg-blue-900 border-b border-blue-800 text-white shadow-xl sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-2xl text-white shadow-md group-hover:bg-blue-400 transition-colors">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wide font-['Tajawal'] text-white">
                  Teacher AI
                </h1>
                <span className="bg-blue-800 text-blue-200 text-xs px-2.5 py-0.5 rounded-md font-semibold border border-blue-700/60">
                  المعلم الذكي
                </span>
              </div>
              <p className="text-xs text-blue-300 hidden sm:block font-medium">
                مساعد المدرس المتكامل لتوليد الامتحانات والتحضير والشهادات
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 bg-blue-950/60 p-1.5 rounded-2xl border border-blue-800/80">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'home' ? 'bg-blue-400' : 'border border-blue-400'}`} />
              لوحة التحكم
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'exam' ? 'bg-blue-400' : 'border border-blue-400'}`} />
              الامتحانات الذكية
            </button>
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'lesson'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'lesson' ? 'bg-blue-400' : 'border border-blue-400'}`} />
              تحضير الدروس
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'certificate' ? 'bg-blue-400' : 'border border-blue-400'}`} />
              الشهادات
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === 'assistant' ? 'bg-emerald-400' : 'border border-emerald-400'}`} />
              مساعد المعلم
            </button>
          </nav>

          {/* Quick Action Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* APK Download Button */}
            <button
              onClick={onOpenDownloadApk}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md cursor-pointer border border-emerald-400/40"
              title="تنزيل تطبيق أندرويد APK"
            >
              <Download className="w-3.5 h-3.5 animate-pulse text-emerald-200" />
              <span>تطبيق APK</span>
            </button>

            {/* Quick Parent Message Button */}
            <button
              onClick={onOpenParentModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-sm cursor-pointer"
              title="صياغة رسالة ولي أمر"
            >
              <span>💬 رسائل أولياء الأمور</span>
            </button>

            {/* Storage / Saved Items */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`relative p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-blue-800 text-white border-blue-700'
                  : 'bg-blue-950/60 text-blue-200 border-blue-800/80 hover:bg-blue-800/60'
              }`}
              title="السجل والمحفوظات"
            >
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">المحفوظات</span>
              {savedCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Frame Toggle (Full Screen vs Android Phone Frame) */}
            <button
              onClick={() => setIsAndroidView(!isAndroidView)}
              className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-800/60 text-blue-200 border border-blue-800/80 transition-all cursor-pointer"
              title={isAndroidView ? "الوضع الكامل" : "إطار الأندرويد"}
            >
              {isAndroidView ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4 text-emerald-300" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
