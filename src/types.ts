export type ActiveTab = 'home' | 'exam' | 'lesson' | 'certificate' | 'assistant' | 'saved';

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  marks: number;
}

export interface ExamData {
  id: string;
  title: string;
  subject: string;
  grade: string;
  schoolName: string;
  term: string;
  duration: string;
  totalMarks: number;
  generalInstructions: string[];
  questions: Question[];
  createdAt: string;
}

export interface LessonStep {
  phase: string;
  time: string;
  teacherActivity: string;
  studentActivity: string;
  assessment: string;
}

export interface Objective {
  type: 'معرفي' | 'مهاري' | 'وجداني';
  text: string;
}

export interface LessonPlanData {
  id: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  generalGoal: string;
  learningObjectives: Objective[];
  materialsAndTools: string[];
  lessonSteps: LessonStep[];
  differentiation: {
    advanced: string;
    support: string;
  };
  homework: string;
  createdAt: string;
}

export interface CertificateData {
  id: string;
  title: string;
  recipient: string;
  appreciationText: string;
  badgeText: string;
  quote: string;
  date: string;
  teacherName: string;
  schoolName: string;
  style: 'classic' | 'modern' | 'royal' | 'gold';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ParentMessageData {
  subject: string;
  whatsappText: string;
  smsText: string;
}
