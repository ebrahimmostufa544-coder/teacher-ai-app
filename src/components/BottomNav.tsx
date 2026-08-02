import React from 'react';
import { Home, BookOpen, GraduationCap, Award, Bot, BookmarkCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, savedCount }) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'الرئيسية', icon: Home },
    { id: 'exam' as ActiveTab, label: 'الامتحانات', icon: BookOpen },
    { id: 'lesson' as ActiveTab, label: 'تحضير الدرس', icon: GraduationCap },
    { id: 'certificate' as ActiveTab, label: 'الشهادات', icon: Award },
    { id: 'assistant' as ActiveTab, label: 'المساعد', icon: Bot },
    { id: 'saved' as ActiveTab, label: 'المحفوظات', icon: BookmarkCheck, badge: savedCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-950/95 backdrop-blur-md border-t border-blue-800 shadow-2xl z-40 px-2 py-2 no-print">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white font-bold shadow-md border border-blue-700'
                  : 'text-blue-200 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-blue-300'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
                )}
                {item.badge !== undefined && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-blue-950 text-[9px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
