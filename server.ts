import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("لم يتم العثور على مفتاح GEMINI_API_KEY. يرجى إعداده في إعدادات التطبيق.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API: Generate Exam (إنشاء الامتحانات)
app.post("/api/generate-exam", async (req, res) => {
  try {
    const {
      subject,
      grade,
      topic,
      difficulty = "متوسط",
      questionTypes = ["multiple_choice", "true_false", "essay"],
      mcqCount = 5,
      tfCount = 5,
      essayCount = 2,
      schoolName = "المدرسة العربية الحديثة",
      term = "الفصل الدراسي الأول",
      examDuration = "60 دقيقة",
      customInstructions = "",
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `أنت خبير واضع امتحانات تعليمية للمناهج الدراسية باللغة العربية.
قم بإنشاء نموذج امتحان متكامل واحترافي في المادة التالية:
- المادة: ${subject}
- الصف الدراسي: ${grade}
- الموضوع/الوحدة: ${topic}
- مستوى الصعوبة: ${difficulty}
- اسم المدرسة: ${schoolName}
- الفصل الدراسي: ${term}
- زمن الاختبار: ${examDuration}
- ملاحظات أو تعليمات خاصة: ${customInstructions || "لا يوجد"}

تفاصيل الأسئلة المطلوبة:
- عدد أسئلة الاختيار من متعدد (multiple_choice): ${mcqCount}
- عدد أسئلة صواب أو خطأ (true_false): ${tfCount}
- عدد الأسئلة المقالية أو القصيرة (essay): ${essayCount}

يرجى إرجاع النتيجة بصيغة JSON فقط ووفق البنية التالية دون أي نصوص إضافية خارج الـ JSON:
{
  "title": "عنوان الاختبار (مثال: اختبار منتصف الفصل في المادة)",
  "subject": "${subject}",
  "grade": "${grade}",
  "schoolName": "${schoolName}",
  "term": "${term}",
  "duration": "${examDuration}",
  "totalMarks": 30,
  "generalInstructions": [
    "اقرأ جميع الأسئلة بعناية قبل الإجابة",
    "الزمن المحدد للاختبار 60 دقيقة"
  ],
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "نص السؤال هنا",
      "options": ["أ) خيار 1", "ب) خيار 2", "ج) خيار 3", "د) خيار 4"],
      "correctAnswer": "أ) خيار 1",
      "explanation": "شرح الإجابة الصحيحة وتعلليها",
      "marks": 2
    },
    {
      "id": "q2",
      "type": "true_false",
      "question": "عبارة صواب أو خطأ هنا",
      "options": ["صواب", "خطأ"],
      "correctAnswer": "صواب",
      "explanation": "تفسير الإجابة",
      "marks": 1
    },
    {
      "id": "q3",
      "type": "essay",
      "question": "السؤال المقالي هنا",
      "correctAnswer": "النموذج المثالي للإجابة",
      "explanation": "نقاط توزيع الدرجات المقالية",
      "marks": 5
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    const examData = JSON.parse(jsonText);
    res.json({ success: true, exam: examData });
  } catch (error: any) {
    console.error("Error generating exam:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ أثناء إنشاء الامتحان" });
  }
});

// 2. API: Generate Lesson Plan (تحضير الدروس)
app.post("/api/generate-lesson-plan", async (req, res) => {
  try {
    const {
      subject,
      grade,
      topic,
      duration = "45 دقيقة",
      teachingStrategy = "التعلم النشط والاستكشاف",
      prerequisites = "",
      specialNeeds = "",
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `أنت خبير تخطيط دراسي وموجه تربوي محترف باللغة العربية.
أنشئ خطة تحضير درس تفصيلية وعصرية متكاملة للمعلم وفق المعايير التربوية الحديثة.

بيانات الدرس:
- المادة: ${subject}
- الصف: ${grade}
- عنوان الدرس: ${topic}
- مدة الحصة: ${duration}
- استراتيجية التدريس المفضلة: ${teachingStrategy}
- المكتسبات القبلية: ${prerequisites || "التعلم السابق"}
- مراعاة الفروق الفردية: ${specialNeeds || "عامة الطلاب"}

قم بإرجاع النتيجة بصيغة JSON بالهيكل التالي:
{
  "title": "عنوان الدرس",
  "subject": "${subject}",
  "grade": "${grade}",
  "duration": "${duration}",
  "generalGoal": "الهدف العام للدرس",
  "learningObjectives": [
    {"type": "معرفي", "text": "أن يوضح الطالب مفهوم..."},
    {"type": "مهاري", "text": "أن يطبق الطالب..."},
    {"type": "وجداني", "text": "أن يقدر الطالب أهمية..."}
  ],
  "materialsAndTools": [
    "السبورة الذكية",
    "عروض تقديمية",
    "بطاقات النشاط"
  ],
  "lessonSteps": [
    {
      "phase": "التمهيد والتهيئة (Warm-up)",
      "time": "5 دقائق",
      "teacherActivity": "عرض فيديو قصير أو طرح سؤال عصف ذهني...",
      "studentActivity": "المشاركة والإجابة عن الأسئلة...",
      "assessment": "ملاحظة التفاعل القبلي"
    },
    {
      "phase": "العرض والشرح (Main Activity)",
      "time": "20 دقيقة",
      "teacherActivity": "شرح المفاهيم الرئيسية باستخدام استراتيجية التعلم النشط...",
      "studentActivity": "العمل في مجموعات صغيرة لتحليل...",
      "assessment": "أسئلة مرحلية وتشخيصية"
    },
    {
      "phase": "التطبيق والتدريب (Practice)",
      "time": "12 دقيقة",
      "teacherActivity": "توزيع أوراق عمل وتوجيه الطلاب...",
      "studentActivity": "حل التدريبات فردياً وجماعياً...",
      "assessment": "تقييم أوراق العمل"
    },
    {
      "phase": "الخاتمة والتقويم (Closure)",
      "time": "8 دقائق",
      "teacherActivity": "مراجعة النقاط الرئيسية وغلق الدرس...",
      "studentActivity": "تلخيص أهم ما تم تعلمه اليوم...",
      "assessment": "بطاقة الخروج (Exit Ticket)"
    }
  ],
  "differentiation": {
    "advanced": "أنشطة إثرائية للطلاب المتفوقين",
    "support": "دعم وتعزيز للطلاب الذين يحتاجون مساعدة"
  },
  "homework": "الواجب المنزلي أو التكليف"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    const planData = JSON.parse(jsonText);
    res.json({ success: true, plan: planData });
  } catch (error: any) {
    console.error("Error generating lesson plan:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ أثناء تحضير الدرس" });
  }
});

// 3. API: Generate Certificate Citation (شهادات التقدير)
app.post("/api/generate-certificate", async (req, res) => {
  try {
    const { studentName, achievement, subject, teacherName, schoolName, style = "classic" } = req.body;

    const ai = getGeminiClient();

    const prompt = `أنت مصمم عبارات تكريم وتربية إسلامية وعربية محترف.
قم بكتابة نص شهادة تقدير وتشجيع فخمة ومؤثرة للطالب:
- اسم الطالب/الطالبة: ${studentName}
- سبب التكريم/الإنجاز: ${achievement}
- المادة/المجال: ${subject}
- اسم المعلم/المعلمة: ${teacherName}
- اسم المدرسة/المؤسسة: ${schoolName}

قم بإرجاع JSON بالبنية التالية:
{
  "title": "شهادة شكر وتقدير",
  "recipient": "${studentName}",
  "appreciationText": "نص التقدير البليغ والجميل الموجه للطالب بعبارات تحفيزية عالية...",
  "badgeText": "وسام التميز الدراسي",
  "quote": "مقولة أو بيت شعر تشجيعي قصير عن العلم والنجاح",
  "date": "${new Date().toLocaleDateString('ar-EG')}",
  "teacherName": "${teacherName}",
  "schoolName": "${schoolName}"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const jsonText = response.text || "{}";
    const certData = JSON.parse(jsonText);
    res.json({ success: true, certificate: certData });
  } catch (error: any) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ أثناء صياغة الشهادة" });
  }
});

// 4. API: Teacher AI Chat Assistant (مساعد المعلم الذكي)
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { messages = [], systemContext = "" } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `أنت "Teacher AI" (المعلم الذكي) - مساعد ذكي متقدم ومستشار تربوي مخصص للمعلمين والمعلمات باللغة العربية.
تتسم إجاباتك بالإيجابية، الاحترافية، والعمق التربوي والعملي.
تساعد المدرسين في:
1. ابتخار طرق تدريس مبتكرة وأنشطة تفاعلية للغرفة الصفية.
2. إدارة السلوك والتعامل مع تحديات الانضباط بأسلوب تربوي حديث.
3. صياغة الملاحظات والرسائل لأولياء الأمور.
4. تفسير المفاهيم المعقدة وتبسيطها للطلاب.
5. تصميم السلالم التقييمية (Rubrics) والتغذية الراجعة.
اجعل إجاباتك منسقة بشكل ممتاز باستخدام نقاط واضحة وعناوين بارزة.`;

    const chatMessages = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Generate content using gemini-3.6-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { role: "user", parts: [{ text: "مرحباً يا المعلم الذكي!" }] },
        { role: "model", parts: [{ text: "أهلاً بك يا أستاذي الفاضل! أنا مساعدك التربوي الذكي Teacher AI. كيف يمكنني مساعدتك اليوم في مسيرتك التعليمية؟" }] },
        ...chatMessages,
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error("Error in AI assistant:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ في التواصل مع مساعد الذكاء الاصطناعي" });
  }
});

// 5. API: Parent Communication Message (رسائل أولياء الأمور)
app.post("/api/generate-parent-message", async (req, res) => {
  try {
    const { studentName, messageType, details, teacherName, schoolName } = req.body;

    const ai = getGeminiClient();

    const prompt = `أنت مساعد معلمين متخصص في صياغة التواصل الودي والاحترافي مع أولياء الأمور.
قم بكتابة رسالة (نصية قصيرة SMS أو واتساب) موجهة لولي أمر الطالب/الطالبة:
- اسم الطالب/الطالبة: ${studentName}
- نوع الرسالة: ${messageType} (مثال: ثناء وتفوق، ملاحظة سلوكية، تذكير بالامتحان، غياب أو تأخر)
- تفاصيل وسياق إضافي: ${details || "لا يوجد"}
- اسم المعلم: ${teacherName || "معلم المادة"}
- المدرسة: ${schoolName || "المدرسة"}

يرجى إرجاع JSON بالبنية التالية:
{
  "subject": "عنوان الرسالة المختصر",
  "whatsappText": "صيغة الرسالة المناسبة للواتساب تحتوي على إيموجيات لطيفة وعبارات تربوية راقية...",
  "smsText": "صيغة موجزة ومباشرة تناسب الـ SMS..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    res.json({ success: true, messageData: JSON.parse(jsonText) });
  } catch (error: any) {
    console.error("Error generating parent message:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ في صياغة الرسالة" });
  }
});

// 6. API: Generate Additional & Follow-up Exam Questions (توليد أسئلة إضافية ومتابعة)
app.post("/api/generate-additional-questions", async (req, res) => {
  try {
    const {
      subject = "العلوم العامة",
      grade = "الصف السادس الابتدائي",
      mode = "topic_or_answers", // 'topic_or_answers' or 'student_performance'
      topicOrAnswers = "",
      selectedQuestionContexts = [], // questions students struggled with
      performanceSummary = "",
      followUpType = "remedial", // 'remedial', 'enrichment', 'diagnostic'
      mcqCount = 2,
      tfCount = 2,
      essayCount = 1,
      difficulty = "متوسط",
      existingQuestions = [],
    } = req.body;

    const ai = getGeminiClient();

    let contextPrompt = "";
    if (mode === "topic_or_answers") {
      contextPrompt = `المطلوب: توليد أسئلة إضافية دقيقة بناءً على الموضوع المحدد أو الإجابات/المفاهيم النموذجية التالية:
- الموضوع أو الإجابات النموذجية المدخلة من المعلم: "${topicOrAnswers}"`;
    } else {
      const qContextStr = Array.isArray(selectedQuestionContexts) && selectedQuestionContexts.length > 0
        ? selectedQuestionContexts.map((q: any, i: number) => `  * سؤال ${i + 1}: ${typeof q === 'string' ? q : q.question || JSON.stringify(q)}`).join('\n')
        : 'الامتحان ككل';

      contextPrompt = `المطلوب: توليد أسئلة متابعة واستدراك (Follow-up Questions) بناءً على أداء الطلاب وتحدياتهم في الأسئلة السابقة.
- نوع هدف سؤال المتابعة: ${
        followUpType === 'remedial' ? 'علاجي وتبسيطي (لتعزيز المفاهيم وتصحيح المفهوم الخاطئ لدى الطلاب)' :
        followUpType === 'enrichment' ? 'إثرائي وتحدي (للطلاب الذين أتقنوا المفهوم ويريدون أسئلة متقدمة)' :
        'تشخيصي ومتابعة (لقياس درجة استيعاب الطلاب ومتابعة تقدمهم)'
      }
- الأسئلة التي واجه فيها الطلاب صعوبة أو انخفاضاً في الأداء:
${qContextStr}
- ملاحظات المعلم على أداء الطلاب والأخطاء الشائعة: "${performanceSummary || 'لا يوجد ملاحظات إضافية'}"`;
    }

    const existingQuestionsSummary = Array.isArray(existingQuestions) && existingQuestions.length > 0
      ? `تجنب تكرار أو إعادة صياغة الأسئلة التالية الموجودة بالفعل في الامتحان:\n` +
        existingQuestions.map((q: any, i: number) => `- ${q.question}`).join('\n')
      : '';

    const prompt = `أنت خبير تقويم تربوي وبناء امتحانات واستراتيجيات الدعم الأكاديمي للمعلمين باللغة العربية.
المادة: ${subject}
الصف الدراسي: ${grade}
مستوى الصعوبة المطلوب: ${difficulty}

${contextPrompt}

${existingQuestionsSummary}

تفاصيل أعداد وأنواع الأسئلة المطلوبة توليدها:
- عدد أسئلة اختيار من متعدد (multiple_choice): ${mcqCount}
- عدد أسئلة صواب أو خطأ (true_false): ${tfCount}
- عدد أسئلة مقالية أو قصيرة (essay): ${essayCount}

قم بإرجاع النتيجة بصيغة JSON حصرية تحتوي على قائمة الأسئلة بالتنسيق التالي:
{
  "questions": [
    {
      "id": "add-q1",
      "type": "multiple_choice",
      "question": "نص السؤال الجديد المبتكر",
      "options": ["أ) خيار 1", "ب) خيار 2", "ج) خيار 3", "د) خيار 4"],
      "correctAnswer": "أ) خيار 1",
      "explanation": "شرح وتحليل الإجابة الصحيحة وكيف تساعد الطالب على الفهم",
      "marks": 2
    },
    {
      "id": "add-q2",
      "type": "true_false",
      "question": "عبارة صواب أو خطأ حديثة",
      "options": ["صواب", "خطأ"],
      "correctAnswer": "صواب",
      "explanation": "التفسير التربوي للإجابة",
      "marks": 1
    },
    {
      "id": "add-q3",
      "type": "essay",
      "question": "سؤال مقالي أو تحليلي متابعة",
      "correctAnswer": "النموذج المثالي للإجابة",
      "explanation": "توزيع درجات الإجابة وشروحات المعلم",
      "marks": 4
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, questions: data.questions || [] });
  } catch (error: any) {
    console.error("Error generating additional questions:", error);
    res.status(500).json({ success: false, error: error.message || "حدث خطأ أثناء توليد الأسئلة الإضافية" });
  }
});

// 7. API & Static Serve: Download Android APK and Complete Source ZIP
const buildOutputsDir = path.join(process.cwd(), "build-outputs");
const publicDir = path.join(process.cwd(), "public");

app.use("/build-outputs", express.static(buildOutputsDir));
app.use(express.static(publicDir));

app.get("/api/download-apk", (req, res) => {
  const apkPath = path.join(process.cwd(), "build-outputs", "app-debug.apk");
  if (fs.existsSync(apkPath)) {
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", 'attachment; filename="Teacher-AI-app-debug.apk"');
    res.sendFile(apkPath);
  } else {
    res.status(444).json({
      success: false,
      error: "جاري تجهيز ملف APK للتحميل، يرجى المحاولة بعد لحظات.",
    });
  }
});

app.get("/api/download-source-zip", (req, res) => {
  const zipPath = path.join(process.cwd(), "public", "Teacher-AI-Android-Project.zip");
  const fallbackZipPath = path.join(process.cwd(), "build-outputs", "Teacher-AI-Android-Project.zip");
  const finalPath = fs.existsSync(zipPath) ? zipPath : fs.existsSync(fallbackZipPath) ? fallbackZipPath : null;

  if (finalPath) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="Teacher-AI-Android-Project.zip"');
    res.sendFile(finalPath);
  } else {
    res.status(404).json({
      success: false,
      error: "جاري تجهيز كود المصدر والمشروع بصيغة ZIP، يرجى المحاولة بعد لحظات.",
    });
  }
});

// Vite middleware / Static serving
async function startServer() {
  // Always mount build-outputs for static downloads
  app.use("/build-outputs", express.static(buildOutputsDir));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Teacher AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
