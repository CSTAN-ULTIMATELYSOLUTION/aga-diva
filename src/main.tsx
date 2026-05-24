import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { jsPDF } from "jspdf";
import {
  Check,
  Download,
  Eraser,
  LoaderCircle,
  Send,
  Sparkles,
} from "lucide-react";
import "./styles.css";

type FormValue = string | boolean | string[];

type FormData = Record<string, FormValue> & {
  nameCN: string;
  nameEN: string;
  nickname: string;
  age: string;
  icNumber: string;
  dob: string;
  phone: string;
  email: string;
  homeAddress: string;
  instagram: string;
  tiktok: string;
  xiaohongshu: string;
  facebook: string;
  discType: string;
  mbtiType: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  drugAllergyAnswer: string;
  drugAllergyDetail: string;
  skinAllergyAnswer: string;
  skinAllergyDetail: string;
  chronicIllnessAnswer: string;
  chronicIllnessDetail: string;
  physicalConditionAnswer: string;
  physicalConditionDetail: string;
  healthNotes: string;
  haircutSkills: string[];
  coloringSkills: string[];
  permStraightSkills: string[];
  extensionHairpieceSkills: string[];
  scalpCareSkills: string[];
  technicalLevel: string;
  contentCreation: string[];
  softwareSkills: string[];
  socialMediaSkills: string[];
  businessSkills: string[];
  aiSystemSkills: string[];
  cultureRead: boolean;
  cultureRespect: boolean;
  cultureGrowth: boolean;
  cultureImage: boolean;
  cultureNotes: string;
  serviceProfessional: boolean;
  serviceExperience: boolean;
  serviceCommunication: boolean;
  serviceImportance: boolean;
  serviceNotes: string;
  frontImage: boolean;
  frontProfessional: boolean;
  frontGreeting: boolean;
  frontNotes: string;
  teamAssist: boolean;
  teamClean: boolean;
  teamTools: boolean;
  teamImportance: boolean;
  teamNotes: string;
  rulesRead: boolean;
  rulesFollow: boolean;
  rulesConsequences: boolean;
  rulesNotes: string;
  mediaConsent: boolean;
  mediaBrand: boolean;
  mediaNotes: string;
  finalAgreement: boolean;
  hasFinalNotes: boolean;
  finalNotes: string;
  finalName: string;
  dateSigned: string;
  startDate: string;
};

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "checkbox"
  | "checkboxGroup"
  | "radioGroup"
  | "yesNoDetail";

type FieldConfig = {
  id: keyof FormData;
  number: number;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  detailId?: keyof FormData;
  detailPlaceholder?: string;
};

type SectionConfig = {
  id: string;
  number: string;
  nav: string;
  title: string;
  subtitle: string;
  fields: FieldConfig[];
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const schemaName = import.meta.env.VITE_SUPABASE_SCHEMA || "miniapp";
const tableName =
  import.meta.env.VITE_SUPABASE_TABLE || "diva_onboarding_submissions";

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        db: { schema: schemaName },
      })
    : null;

const initialForm: FormData = {
  nameCN: "",
  nameEN: "",
  nickname: "",
  age: "",
  icNumber: "",
  dob: "",
  phone: "",
  email: "",
  homeAddress: "",
  instagram: "",
  tiktok: "",
  xiaohongshu: "",
  facebook: "",
  discType: "",
  mbtiType: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  drugAllergyAnswer: "",
  drugAllergyDetail: "",
  skinAllergyAnswer: "",
  skinAllergyDetail: "",
  chronicIllnessAnswer: "",
  chronicIllnessDetail: "",
  physicalConditionAnswer: "",
  physicalConditionDetail: "",
  healthNotes: "",
  haircutSkills: [],
  coloringSkills: [],
  permStraightSkills: [],
  extensionHairpieceSkills: [],
  scalpCareSkills: [],
  technicalLevel: "",
  contentCreation: [],
  softwareSkills: [],
  socialMediaSkills: [],
  businessSkills: [],
  aiSystemSkills: [],
  cultureRead: false,
  cultureRespect: false,
  cultureGrowth: false,
  cultureImage: false,
  cultureNotes: "",
  serviceProfessional: false,
  serviceExperience: false,
  serviceCommunication: false,
  serviceImportance: false,
  serviceNotes: "",
  frontImage: false,
  frontProfessional: false,
  frontGreeting: false,
  frontNotes: "",
  teamAssist: false,
  teamClean: false,
  teamTools: false,
  teamImportance: false,
  teamNotes: "",
  rulesRead: false,
  rulesFollow: false,
  rulesConsequences: false,
  rulesNotes: "",
  mediaConsent: false,
  mediaBrand: false,
  mediaNotes: "",
  finalAgreement: false,
  hasFinalNotes: false,
  finalNotes: "",
  finalName: "",
  dateSigned: "",
  startDate: "",
};

const sections: SectionConfig[] = [
  {
    id: "personal",
    number: "①",
    nav: "资料 Info",
    title: "个人资料",
    subtitle: "Personal Information",
    fields: [
      { id: "nameCN", number: 1, label: "中文姓名 Chinese Name", type: "text", required: true },
      { id: "nameEN", number: 2, label: "英文姓名 English Name", type: "text", required: true },
      { id: "nickname", number: 3, label: "昵称 Nickname", type: "text" },
      { id: "age", number: 4, label: "年龄 Age", type: "number" },
      { id: "icNumber", number: 5, label: "身份证号码 IC Number", type: "text", required: true },
      { id: "dob", number: 6, label: "出生日期 Date of Birth", type: "date", required: true },
      { id: "phone", number: 7, label: "电话号码 Phone", type: "tel", required: true },
      { id: "email", number: 8, label: "Email", type: "email", required: true },
      { id: "homeAddress", number: 9, label: "住家地址 Home Address", type: "textarea" },
      { id: "instagram", number: 10, label: "Instagram", type: "text" },
      { id: "tiktok", number: 11, label: "TikTok", type: "text" },
      { id: "xiaohongshu", number: 12, label: "小红书 Xiaohongshu", type: "text" },
      { id: "facebook", number: 13, label: "Facebook", type: "text" },
      {
        id: "discType",
        number: 14,
        label: "DISC 类型 DISC Type",
        type: "select",
        options: ["", "D", "I", "S", "C", "DI", "DS", "DC", "ID", "IS", "IC", "SD", "SI", "SC", "CD", "CI", "CS"],
      },
      {
        id: "mbtiType",
        number: 15,
        label: "MBTI 类型 MBTI Type",
        type: "select",
        options: ["", "ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"],
      },
      { id: "emergencyName", number: 16, label: "紧急联系人姓名 Emergency Contact Name", type: "text", required: true },
      { id: "emergencyRelationship", number: 17, label: "关系 Relationship", type: "text" },
      { id: "emergencyPhone", number: 18, label: "紧急联系电话 Emergency Phone", type: "tel", required: true },
    ],
  },
  {
    id: "health",
    number: "②",
    nav: "健康 Health",
    title: "健康与个人状况",
    subtitle: "Health And Personal Condition",
    fields: [
      { id: "drugAllergyAnswer", detailId: "drugAllergyDetail", number: 19, label: "是否有药物敏感？Drug allergy?", type: "yesNoDetail", detailPlaceholder: "请说明详情 / Please provide details" },
      { id: "skinAllergyAnswer", detailId: "skinAllergyDetail", number: 20, label: "是否有皮肤敏感？Skin sensitivity?", type: "yesNoDetail", detailPlaceholder: "请说明详情 / Please provide details" },
      { id: "chronicIllnessAnswer", detailId: "chronicIllnessDetail", number: 21, label: "是否有长期病史？Long-term medical history?", type: "yesNoDetail", detailPlaceholder: "请说明详情 / Please provide details" },
      { id: "physicalConditionAnswer", detailId: "physicalConditionDetail", number: 22, label: "是否有特殊身体状况？Special physical condition?", type: "yesNoDetail", detailPlaceholder: "请说明详情 / Please provide details" },
      { id: "healthNotes", number: 23, label: "健康备注 Health Notes", type: "textarea" },
    ],
  },
  {
    id: "technical",
    number: "③",
    nav: "技术 Tech",
    title: "美发技术能力",
    subtitle: "Technical Skills",
    fields: [
      { id: "haircutSkills", number: 24, label: "剪发技能 Haircut Skills", type: "checkboxGroup", options: ["男士 Men’s", "女士 Women’s", "男女都会 Both", "初学阶段 Beginner"] },
      { id: "coloringSkills", number: 25, label: "染发技能 Coloring Skills", type: "checkboxGroup", options: ["基础染发 Basic Color", "挑染 Highlights", "漂发 Bleach", "渐层染 Gradient Color"] },
      { id: "permStraightSkills", number: 26, label: "烫发/拉直 Perm / Straightening", type: "checkboxGroup", options: ["电发 Perm", "拉直 Straightening", "Keratin", "水疗护理 Spa Treatment"] },
      { id: "extensionHairpieceSkills", number: 27, label: "接发/发片 Extensions / Hairpieces", type: "checkboxGroup", options: ["羽毛 Feather", "贴片 Tape-in", "零点 Micro-link", "男士发片 Men’s Hairpiece"] },
      { id: "scalpCareSkills", number: 28, label: "头皮与护理 Scalp And Care", type: "checkboxGroup", options: ["检测 Diagnosis", "护理 Treatment", "防脱 Anti-hair-loss", "洗护 Wash Care", "深层修复 Deep Repair"] },
      { id: "technicalLevel", number: 29, label: "整体技术程度 Overall Technical Level", type: "radioGroup", required: true, options: ["初级 Beginner", "中级 Intermediate", "高级 Advanced", "导师级 Trainer"] },
    ],
  },
  {
    id: "additional",
    number: "④",
    nav: "能力 Skills",
    title: "额外能力",
    subtitle: "Additional Skills",
    fields: [
      { id: "contentCreation", number: 30, label: "内容创作 Content Creation", type: "checkboxGroup", options: ["拍摄 Shooting", "Reels·TikTok", "剪片 Video Editing", "文案 Copywriting"] },
      { id: "softwareSkills", number: 31, label: "软件技能 Software Skills", type: "checkboxGroup", options: ["Canva", "剪映 CapCut", "Photoshop", "Illustrator", "Lightroom"] },
      { id: "socialMediaSkills", number: 32, label: "社交媒体 Social Media", type: "checkboxGroup", options: ["IG", "TikTok", "小红书 Xiaohongshu", "FB Marketing"] },
      { id: "businessSkills", number: 33, label: "商业能力 Business Skills", type: "checkboxGroup", options: ["销售 Sales", "客户沟通 Client Communication", "团队合作 Teamwork", "管理 Management", "活动策划 Event Planning", "品牌意识 Brand Awareness"] },
      { id: "aiSystemSkills", number: 34, label: "AI/系统能力 AI / System Skills", type: "checkboxGroup", options: ["ChatGPT", "AI Design", "AI Content", "系统管理 System Management"] },
    ],
  },
  {
    id: "culture",
    number: "⑤",
    nav: "文化 Culture",
    title: "Diva 公司文化",
    subtitle: "Diva Company Culture",
    fields: [
      { id: "cultureRead", number: 35, label: "我已阅读并理解 Diva 公司文化 / I have read and understood Diva company culture", type: "checkbox" },
      { id: "cultureRespect", number: 36, label: "我愿意尊重团队与品牌价值 / I am willing to respect team and brand values", type: "checkbox" },
      { id: "cultureGrowth", number: 37, label: "我愿意持续学习与成长 / I am willing to keep learning and growing", type: "checkbox" },
      { id: "cultureImage", number: 38, label: "我愿意维护 Diva 的专业形象 / I am willing to uphold Diva’s professional image", type: "checkbox" },
      { id: "cultureNotes", number: 39, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "service",
    number: "⑥",
    nav: "服务 Service",
    title: "服务与客户体验标准",
    subtitle: "Service And Customer Experience Standards",
    fields: [
      { id: "serviceProfessional", number: 40, label: "我愿意保持专业服务态度 / I am willing to maintain a professional service attitude", type: "checkbox" },
      { id: "serviceExperience", number: 41, label: "我愿意给予客户良好体验 / I am willing to give clients a good experience", type: "checkbox" },
      { id: "serviceCommunication", number: 42, label: "我愿意维持良好沟通与情绪管理 / I am willing to maintain good communication and emotional control", type: "checkbox" },
      { id: "serviceImportance", number: 43, label: "我理解客户体验的重要性 / I understand the importance of customer experience", type: "checkbox" },
      { id: "serviceNotes", number: 44, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "front",
    number: "⑦",
    nav: "前区 Front",
    title: "前区形象与迎宾意识",
    subtitle: "Front Area Image And Welcoming Awareness",
    fields: [
      { id: "frontImage", number: 45, label: "我理解并愿意配合店面形象管理 / I understand and will cooperate with store image management", type: "checkbox" },
      { id: "frontProfessional", number: 46, label: "我愿意保持专业与良好工作状态 / I am willing to maintain a professional and positive work state", type: "checkbox" },
      { id: "frontGreeting", number: 47, label: "我理解前区迎宾感的重要性 / I understand the importance of front-area welcoming presence", type: "checkbox" },
      { id: "frontNotes", number: 48, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "teamwork",
    number: "⑧",
    nav: "团队 Team",
    title: "团队合作与工作责任",
    subtitle: "Teamwork And Work Responsibility",
    fields: [
      { id: "teamAssist", number: 49, label: "我愿意主动协助团队 / I am willing to actively assist the team", type: "checkbox" },
      { id: "teamClean", number: 50, label: "我愿意维持环境整洁 / I am willing to keep the environment clean", type: "checkbox" },
      { id: "teamTools", number: 51, label: "我愿意爱惜公司工具与资源 / I am willing to care for company tools and resources", type: "checkbox" },
      { id: "teamImportance", number: 52, label: "我理解团队合作的重要性 / I understand the importance of teamwork", type: "checkbox" },
      { id: "teamNotes", number: 53, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "rules",
    number: "⑨",
    nav: "制度 Rules",
    title: "公司规则与制度",
    subtitle: "Company Rules And Systems",
    fields: [
      { id: "rulesRead", number: 54, label: "我已阅读并理解公司制度 / I have read and understood the company rules", type: "checkbox" },
      { id: "rulesFollow", number: 55, label: "我愿意遵守公司规则与流程 / I am willing to follow company rules and processes", type: "checkbox" },
      { id: "rulesConsequences", number: 56, label: "我理解违反规则可能带来的后果 / I understand the consequences of breaking rules", type: "checkbox" },
      { id: "rulesNotes", number: 57, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "media",
    number: "⑩",
    nav: "媒体 Media",
    title: "媒体与宣传授权",
    subtitle: "Media And Promotional Authorization",
    fields: [
      { id: "mediaConsent", number: 58, label: "我同意公司使用相关素材 / I agree that the company may use related materials", type: "checkbox" },
      { id: "mediaBrand", number: 59, label: "我理解品牌宣传的重要性 / I understand the importance of brand promotion", type: "checkbox" },
      { id: "mediaNotes", number: 60, label: "意见/备注 Comments / Notes", type: "textarea" },
    ],
  },
  {
    id: "final",
    number: "⑪",
    nav: "签名 Sign",
    title: "最终确认与签名",
    subtitle: "Final Confirmation And Signature",
    fields: [
      { id: "finalAgreement", number: 61, label: "我同意以上内容 / I agree to the above content", type: "checkbox", required: true },
      { id: "hasFinalNotes", detailId: "finalNotes", number: 62, label: "我有意见/备注 / I have comments or notes", type: "checkbox" },
      { id: "finalName", number: 63, label: "姓名 Final Name", type: "text", required: true },
      { id: "dateSigned", number: 65, label: "签署日期 Date Signed", type: "date", required: true },
      { id: "startDate", number: 66, label: "入职日期 Start Date", type: "date", required: true },
    ],
  },
];

const summarizeArrays = (...values: string[][]) =>
  values.filter((value) => value.length).map((value) => value.join(", ")).join(" | ");

function App() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("personal");
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);

      const current =
        [...sections]
          .reverse()
          .find((section) => {
            const element = document.getElementById(section.id);
            return element ? element.offsetTop - 160 <= window.scrollY : false;
          })?.id || sections[0].id;
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isReady = useMemo(
    () =>
      Boolean(
        form.nameCN &&
          form.nameEN &&
          form.icNumber &&
          form.dob &&
          form.email &&
          form.phone &&
          form.emergencyName &&
          form.emergencyPhone &&
          form.technicalLevel &&
          form.finalAgreement &&
          form.finalName &&
          form.dateSigned &&
          form.startDate,
      ),
    [form],
  );

  const update = (name: keyof FormData, value: FormValue) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleArrayValue = (name: keyof FormData, value: string) => {
    const current = form[name];
    if (!Array.isArray(current)) return;
    update(
      name,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const pointerPosition = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const beginSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = pointerPosition(event);
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 2.4;
    context.lineCap = "round";
    context.strokeStyle = "#edd9a3";
    setIsDrawing(true);
  };

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = pointerPosition(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const endSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(false);
    setSignature(canvas.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };

  const payload = () => {
    const salonExperience = summarizeArrays(
      form.haircutSkills,
      form.coloringSkills,
      form.permStraightSkills,
      form.extensionHairpieceSkills,
      form.scalpCareSkills,
    );

    return {
      employee_name: form.nameEN || form.nameCN,
      preferred_name: form.nickname || null,
      email: form.email,
      phone: form.phone,
      date_of_birth: form.dob || null,
      address: form.homeAddress || null,
      emergency_contact_name: form.emergencyName,
      emergency_contact_phone: form.emergencyPhone,
      role_applied_for: form.technicalLevel || "Diva Team Member",
      employment_type: "Onboarding",
      start_date: form.startDate || null,
      schedule_availability: null,
      salon_experience: salonExperience || null,
      certifications: null,
      strengths: summarizeArrays(
        form.contentCreation,
        form.softwareSkills,
        form.socialMediaSkills,
        form.businessSkills,
        form.aiSystemSkills,
      ) || null,
      growth_goals: form.cultureNotes || form.serviceNotes || null,
      uniform_size: null,
      payroll_name: form.finalName || form.nameEN || form.nameCN,
      bank_name: null,
      bank_account_last4: null,
      tax_id_last4: null,
      policies_acknowledged: form.finalAgreement,
      signature_data_url: signature || null,
      form_payload: {
        ...form,
        signatureCaptured: Boolean(signature),
        submittedSectionCount: sections.length,
        submittedFieldCount: 66,
      },
    };
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    if (!supabase) {
      setStatus("error");
      setMessage("请先加入 Supabase URL 与 anon key / Add Supabase URL and anon key to .env before submitting.");
      return;
    }

    const { error } = await supabase.from(tableName).insert(payload());

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("saved");
    setMessage("表格已储存到 Supabase / Onboarding form saved to Supabase.");
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    let y = 52;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Diva Hair Lounge Team Onboarding", 48, y);
    y += 28;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleString()}`, 48, y);
    y += 28;

    sections.forEach((section) => {
      if (y > 670) {
        doc.addPage();
        y = 48;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${section.number} ${section.title} / ${section.subtitle}`, 48, y);
      y += 18;
      doc.setFont("helvetica", "normal");

      section.fields.forEach((field) => {
        const value = formatValue(form[field.id]);
        const lines = doc.splitTextToSize(`${field.number}. ${field.label}: ${value}`, 500);
        if (y + lines.length * 14 > 730) {
          doc.addPage();
          y = 48;
        }
        doc.text(lines, 48, y);
        y += lines.length * 14 + 6;

        if (field.detailId) {
          const detail = formatValue(form[field.detailId]);
          if (detail !== "-") {
            const detailLines = doc.splitTextToSize(`Detail: ${detail}`, 500);
            doc.text(detailLines, 62, y);
            y += detailLines.length * 14 + 6;
          }
        }
      });
    });

    if (signature) {
      if (y > 620) {
        doc.addPage();
        y = 48;
      }
      doc.setFont("helvetica", "bold");
      doc.text("64. 签名 Signature", 48, y);
      doc.addImage(signature, "PNG", 48, y + 12, 220, 80);
    }

    doc.save("diva-onboarding-form.pdf");
  };

  return (
    <main>
      <div className="progress" style={{ width: `${scrollProgress}%` }} />
      <section className="hero">
        <div className="logoMark">DIVA</div>
        <p className="eyebrow">Team Onboarding · 团队入职</p>
        <h1>
          Culture
          <br />
          <em>Agreement</em>
        </h1>
        <div className="rule" />
        <p className="heroSub">入职与文化协议书 · 66 个双语字段 · 请完整填写所有栏目</p>
        <div className="statusPill">
          <Sparkles size={15} />
          {supabase ? "Supabase configured" : "Supabase env needed"}
        </div>
      </section>

      <nav className="sectionNav" aria-label="Onboarding sections">
        <div className="sectionNavInner">
          {sections.map((section) => (
            <a
              className={`navPill ${activeSection === section.id ? "on" : ""}`}
              href={`#${section.id}`}
              key={section.id}
            >
              <span>{section.number}</span>
              {section.nav}
            </a>
          ))}
        </div>
      </nav>

      <div className="shell">
        <form className="form" onSubmit={submit}>
          {sections.map((section) => (
            <Section {...section} key={section.id}>
              {section.id === "final" && (
                <div className="quoteBlock">
                  “我理解 Diva Hair Lounge 建立在技术、纪律、服务与团队精神之上。”
                  <small>
                    I understand that Diva Hair Lounge is built on craft,
                    discipline, service, and teamwork.
                  </small>
                </div>
              )}

              {section.fields.map((field) => (
                <Field
                  field={field}
                  form={form}
                  key={String(field.id)}
                  onChange={update}
                  onToggleArray={toggleArrayValue}
                />
              ))}

              {section.id === "final" && (
                <div className="signatureBox">
                  <div className="signatureHeader">
                    <span>64. 签名 Signature</span>
                    <button type="button" className="iconButton" onClick={clearSignature}>
                      <Eraser size={16} />
                      清除 Clear
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={720}
                    height={180}
                    onPointerDown={beginSignature}
                    onPointerMove={drawSignature}
                    onPointerUp={endSignature}
                    onPointerLeave={endSignature}
                    aria-label="Digital signature pad"
                  />
                </div>
              )}
            </Section>
          ))}

          <div className="actions">
            <button type="button" className="secondary" onClick={downloadPdf}>
              <Download size={18} />
              导出 PDF / Export
            </button>
            <button type="submit" disabled={!isReady || status === "saving"}>
              {status === "saving" ? (
                <LoaderCircle size={18} className="spin" />
              ) : status === "saved" ? (
                <Check size={18} />
              ) : (
                <Send size={18} />
              )}
              提交 / Submit
            </button>
          </div>

          {message && <p className={`message ${status}`}>{message}</p>}
        </form>
      </div>
    </main>
  );
}

function Section({
  id,
  number,
  title,
  subtitle,
  children,
}: {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <div className="sectionHead">
        <div className="sectionNumber">{number}</div>
        <h2>
          {title}
          <small>{subtitle}</small>
        </h2>
      </div>
      <div className="grid">{children}</div>
    </section>
  );
}

function Field({
  field,
  form,
  onChange,
  onToggleArray,
}: {
  field: FieldConfig;
  form: FormData;
  onChange: (name: keyof FormData, value: FormValue) => void;
  onToggleArray: (name: keyof FormData, value: string) => void;
}) {
  const value = form[field.id];
  const label = `${field.number}. ${field.label}`;

  if (field.type === "textarea") {
    return (
      <label className="field wide">
        <span>{label}{field.required && <em>*</em>}</span>
        <textarea
          value={String(value)}
          onChange={(event) => onChange(field.id, event.target.value)}
          placeholder={field.placeholder}
          rows={4}
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="field">
        <span>{label}{field.required && <em>*</em>}</span>
        <select
          value={String(value)}
          onChange={(event) => onChange(field.id, event.target.value)}
          required={field.required}
        >
          {field.options?.map((option) => (
            <option key={option || "blank"} value={option}>
              {option || "请选择 / Select"}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "checkbox") {
    return (
      <>
        <label className="checkRow">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(field.id, event.target.checked)}
            required={field.required}
          />
          <span>
            <strong>{field.number}.</strong> {field.label}
            {field.required && <em>*</em>}
          </span>
        </label>
        {field.detailId && Boolean(value) && (
          <label className="field wide detailField">
            <span>62. 意见/备注 Comments / Notes</span>
            <textarea
              value={String(form[field.detailId])}
              onChange={(event) => onChange(field.detailId!, event.target.value)}
              rows={4}
            />
          </label>
        )}
      </>
    );
  }

  if (field.type === "checkboxGroup" || field.type === "radioGroup") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="choiceBlock wide">
        <legend>{label}{field.required && <em>*</em>}</legend>
        <div className="choiceGrid">
          {field.options?.map((option) => (
            <label className="choice" key={option}>
              <input
                type={field.type === "checkboxGroup" ? "checkbox" : "radio"}
                name={String(field.id)}
                checked={
                  field.type === "checkboxGroup"
                    ? selected.includes(option)
                    : value === option
                }
                onChange={() =>
                  field.type === "checkboxGroup"
                    ? onToggleArray(field.id, option)
                    : onChange(field.id, option)
                }
                required={field.required && field.type === "radioGroup"}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "yesNoDetail") {
    return (
      <fieldset className="choiceBlock wide">
        <legend>{label}</legend>
        <div className="yesNoGrid">
          {["Yes 是", "No 否"].map((option) => (
            <label className="choice ynChoice" key={option}>
              <input
                type="radio"
                name={String(field.id)}
                checked={value === option}
                onChange={() => onChange(field.id, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {value === "Yes 是" && field.detailId && (
          <textarea
            className="detailTextarea"
            value={String(form[field.detailId])}
            onChange={(event) => onChange(field.detailId!, event.target.value)}
            placeholder={field.detailPlaceholder}
            rows={3}
          />
        )}
      </fieldset>
    );
  }

  return (
    <label className="field">
      <span>{label}{field.required && <em>*</em>}</span>
      <input
        value={String(value)}
        onChange={(event) => onChange(field.id, event.target.value)}
        type={field.type === "email" ? "text" : field.type}
        inputMode={
          field.type === "email"
            ? "email"
            : field.type === "tel"
              ? "tel"
              : field.type === "number"
                ? "numeric"
                : undefined
        }
        required={field.required}
        placeholder={field.placeholder}
      />
    </label>
  );
}

function formatValue(value: FormValue) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "boolean") return value ? "Yes / 是" : "No / 否";
  return value || "-";
}

const rootElement = document.getElementById("root")!;
const windowWithRoot = window as typeof window & {
  __divaOnboardingRoot?: ReturnType<typeof createRoot>;
};

windowWithRoot.__divaOnboardingRoot ??= createRoot(rootElement);
windowWithRoot.__divaOnboardingRoot.render(<App />);
