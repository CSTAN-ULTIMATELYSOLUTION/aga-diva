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

type FormData = {
  employeeName: string;
  preferredName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  roleAppliedFor: string;
  employmentType: string;
  startDate: string;
  scheduleAvailability: string;
  salonExperience: string;
  certifications: string;
  strengths: string;
  growthGoals: string;
  uniformSize: string;
  payrollName: string;
  bankName: string;
  bankAccountLast4: string;
  taxIdLast4: string;
  policiesAcknowledged: boolean;
};

const initialForm: FormData = {
  employeeName: "",
  preferredName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  roleAppliedFor: "",
  employmentType: "Full time",
  startDate: "",
  scheduleAvailability: "",
  salonExperience: "",
  certifications: "",
  strengths: "",
  growthGoals: "",
  uniformSize: "",
  payrollName: "",
  bankName: "",
  bankAccountLast4: "",
  taxIdLast4: "",
  policiesAcknowledged: false,
};

const labels: Record<keyof FormData, string> = {
  employeeName: "Legal name",
  preferredName: "Preferred name",
  email: "Email",
  phone: "Phone",
  dateOfBirth: "Date of birth",
  address: "Home address",
  emergencyContactName: "Emergency contact",
  emergencyContactPhone: "Emergency phone",
  roleAppliedFor: "Role",
  employmentType: "Employment type",
  startDate: "Target start date",
  scheduleAvailability: "Availability",
  salonExperience: "Salon experience",
  certifications: "Licenses or certifications",
  strengths: "Strengths",
  growthGoals: "Growth goals",
  uniformSize: "Uniform size",
  payrollName: "Payroll name",
  bankName: "Bank name",
  bankAccountLast4: "Bank account last 4",
  taxIdLast4: "Tax ID last 4",
  policiesAcknowledged: "Policy acknowledgement",
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

  const sections = [
    { id: "personal", number: "01", nav: "Personal", title: "个人资料", subtitle: "Personal Information" },
    { id: "emergency", number: "02", nav: "Emergency", title: "紧急联系人", subtitle: "Emergency Contact" },
    { id: "role", number: "03", nav: "Role", title: "岗位与时间", subtitle: "Role And Availability" },
    { id: "experience", number: "04", nav: "Skills", title: "美发经验", subtitle: "Salon Experience" },
    { id: "payroll", number: "05", nav: "Payroll", title: "薪资资料", subtitle: "Payroll Details" },
    { id: "sign", number: "06", nav: "Sign", title: "确认签署", subtitle: "Acknowledgement" },
  ];

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
        form.employeeName &&
          form.email &&
          form.phone &&
          form.emergencyContactName &&
          form.emergencyContactPhone &&
          form.roleAppliedFor &&
          form.policiesAcknowledged,
      ),
    [form],
  );

  const update = (name: keyof FormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [name]: value }));
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

  const payload = () => ({
    employee_name: form.employeeName,
    preferred_name: form.preferredName || null,
    email: form.email,
    phone: form.phone,
    date_of_birth: form.dateOfBirth || null,
    address: form.address || null,
    emergency_contact_name: form.emergencyContactName,
    emergency_contact_phone: form.emergencyContactPhone,
    role_applied_for: form.roleAppliedFor,
    employment_type: form.employmentType,
    start_date: form.startDate || null,
    schedule_availability: form.scheduleAvailability || null,
    salon_experience: form.salonExperience || null,
    certifications: form.certifications || null,
    strengths: form.strengths || null,
    growth_goals: form.growthGoals || null,
    uniform_size: form.uniformSize || null,
    payroll_name: form.payrollName || null,
    bank_name: form.bankName || null,
    bank_account_last4: form.bankAccountLast4 || null,
    tax_id_last4: form.taxIdLast4 || null,
    policies_acknowledged: form.policiesAcknowledged,
    signature_data_url: signature || null,
    form_payload: form,
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    if (!supabase) {
      setStatus("error");
      setMessage("Add Supabase URL and anon key to .env before submitting.");
      return;
    }

    const { error } = await supabase.from(tableName).insert(payload());

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("saved");
    setMessage("Onboarding form saved to Supabase.");
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

    (Object.keys(form) as Array<keyof FormData>).forEach((key) => {
      const value =
        typeof form[key] === "boolean" ? (form[key] ? "Yes" : "No") : form[key];
      const lines = doc.splitTextToSize(`${labels[key]}: ${value || "-"}`, 500);
      if (y + lines.length * 14 > 730) {
        doc.addPage();
        y = 48;
      }
      doc.text(lines, 48, y);
      y += lines.length * 14 + 6;
    });

    if (signature) {
      if (y > 620) {
        doc.addPage();
        y = 48;
      }
      doc.setFont("helvetica", "bold");
      doc.text("Signature", 48, y);
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
        <p className="heroSub">入职与文化协议书 · 请完整填写所有栏目</p>
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
        <Section {...sections[0]}>
          <Input label="Legal name" value={form.employeeName} required onChange={(value) => update("employeeName", value)} />
          <Input label="Preferred name" value={form.preferredName} onChange={(value) => update("preferredName", value)} />
          <Input label="Email" type="email" value={form.email} required onChange={(value) => update("email", value)} />
          <Input label="Phone" value={form.phone} required onChange={(value) => update("phone", value)} />
          <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={(value) => update("dateOfBirth", value)} />
          <TextArea label="Home address" value={form.address} onChange={(value) => update("address", value)} />
        </Section>

        <Section {...sections[1]}>
          <Input label="Contact name" value={form.emergencyContactName} required onChange={(value) => update("emergencyContactName", value)} />
          <Input label="Contact phone" value={form.emergencyContactPhone} required onChange={(value) => update("emergencyContactPhone", value)} />
        </Section>

        <Section {...sections[2]}>
          <Input label="Role" value={form.roleAppliedFor} required placeholder="Stylist, assistant, front desk..." onChange={(value) => update("roleAppliedFor", value)} />
          <Select label="Employment type" value={form.employmentType} onChange={(value) => update("employmentType", value)} options={["Full time", "Part time", "Contract", "Apprentice"]} />
          <Input label="Target start date" type="date" value={form.startDate} onChange={(value) => update("startDate", value)} />
          <TextArea label="Availability" value={form.scheduleAvailability} placeholder="Weekdays, weekends, preferred shifts..." onChange={(value) => update("scheduleAvailability", value)} />
        </Section>

        <Section {...sections[3]}>
          <TextArea label="Salon experience" value={form.salonExperience} onChange={(value) => update("salonExperience", value)} />
          <TextArea label="Licenses or certifications" value={form.certifications} onChange={(value) => update("certifications", value)} />
          <TextArea label="Strengths" value={form.strengths} onChange={(value) => update("strengths", value)} />
          <TextArea label="Growth goals" value={form.growthGoals} onChange={(value) => update("growthGoals", value)} />
        </Section>

        <Section {...sections[4]}>
          <Input label="Uniform size" value={form.uniformSize} onChange={(value) => update("uniformSize", value)} />
          <Input label="Payroll name" value={form.payrollName} onChange={(value) => update("payrollName", value)} />
          <Input label="Bank name" value={form.bankName} onChange={(value) => update("bankName", value)} />
          <Input label="Bank account last 4" value={form.bankAccountLast4} maxLength={4} onChange={(value) => update("bankAccountLast4", value)} />
          <Input label="Tax ID last 4" value={form.taxIdLast4} maxLength={4} onChange={(value) => update("taxIdLast4", value)} />
        </Section>

        <Section {...sections[5]}>
          <div className="quoteBlock">
            “I understand that Diva Hair Lounge is built on craft, discipline,
            service, and teamwork.”
          </div>
          <label className="checkRow">
            <input
              type="checkbox"
              checked={form.policiesAcknowledged}
              onChange={(event) =>
                update("policiesAcknowledged", event.target.checked)
              }
            />
            <span>
              I confirm the information above is accurate and acknowledge Diva
              Hair Lounge onboarding policies.
            </span>
          </label>
          <div className="signatureBox">
            <div className="signatureHeader">
              <span>Digital signature</span>
              <button type="button" className="iconButton" onClick={clearSignature}>
                <Eraser size={16} />
                Clear
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
        </Section>

        <div className="actions">
          <button type="button" className="secondary" onClick={downloadPdf}>
            <Download size={18} />
            Export PDF
          </button>
          <button type="submit" disabled={!isReady || status === "saving"}>
            {status === "saving" ? (
              <LoaderCircle size={18} className="spin" />
            ) : status === "saved" ? (
              <Check size={18} />
            ) : (
              <Send size={18} />
            )}
            Submit
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

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="field">
      <span>{label}{required && <em>*</em>}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type === "email" ? "text" : type}
        inputMode={type === "email" ? "email" : undefined}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    </label>
  );
}

const rootElement = document.getElementById("root")!;
const windowWithRoot = window as typeof window & {
  __divaOnboardingRoot?: ReturnType<typeof createRoot>;
};

windowWithRoot.__divaOnboardingRoot ??= createRoot(rootElement);
windowWithRoot.__divaOnboardingRoot.render(<App />);
