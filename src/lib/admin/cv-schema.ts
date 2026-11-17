import { z } from "zod";

/*
 * Shape of a CV request as submitted from /admin/cv/new.
 * Shared by the form (client), the API route (server) and the cv-builder skill
 * (which reads the stored JSON). Keep option codes stable: they are persisted.
 */

export const CV_LANGUAGES = ["es", "en", "both"] as const;
export const MARKETS = ["cr", "latam", "us_ca", "europe", "remote"] as const;
export const FORMATS = ["ats", "visual", "both"] as const;
export const LENGTHS = ["1", "2", "auto"] as const;
export const LEVELS = ["", "first", "junior", "mid", "senior", "lead"] as const;
export const JOB_TYPES = ["", "full", "part", "temp", "freelance", "own", "informal"] as const;
export const EDU_LEVELS = [
  "primary",
  "secondary_incomplete",
  "secondary",
  "technical",
  "diploma",
  "bachelor",
  "licentiate",
  "master",
  "doctorate",
] as const;
export const EDU_STATUS = ["completed", "in_progress", "incomplete"] as const;
export const LANG_LEVELS = ["basic", "intermediate", "advanced", "native"] as const;
export const SOFT_SKILLS = [
  "punctual",
  "responsible",
  "teamwork",
  "fast_learner",
  "leadership",
  "creative",
  "organized",
  "patient",
  "proactive",
  "adaptable",
  "customer_service",
  "communication",
  "problem_solving",
  "pressure",
] as const;
export const START_OPTIONS = ["", "immediate", "2_weeks", "1_month", "other"] as const;
export const SCHEDULES = ["full", "part", "rotating", "weekends"] as const;
export const MODALITIES = ["onsite", "hybrid", "remote"] as const;
export const YES_NO_MAYBE = ["", "yes", "no", "maybe"] as const;
export const WORK_PERMIT = ["", "yes", "no", "sponsorship"] as const;
export const REFERENCES = ["include", "on_request", "none"] as const;

export const MAX_SOFT_SKILLS = 5;
export const MAX_JOBS = 6;

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const str = (max = 300) => z.string().trim().max(max);
const longStr = () => z.string().trim().max(4000);
const month = z.union([z.literal(""), z.string().regex(MONTH)]);
const year = z.union([z.literal(""), z.string().regex(/^\d{4}$/)]);

export const jobSchema = z.object({
  company: str(150),
  title: str(150),
  city: str(150),
  type: z.enum(JOB_TYPES),
  start: month,
  end: month,
  current: z.boolean(),
  duties: longStr(),
  achievements: longStr(),
  tools: str(500),
});

export const educationSchema = z.object({
  level: z.union([z.literal(""), z.enum(EDU_LEVELS)]),
  institution: str(200),
  title: str(200),
  status: z.enum(EDU_STATUS),
  endYear: year,
});

export const courseSchema = z.object({
  name: str(200),
  institution: str(200),
  year,
  hours: str(20),
  url: str(500),
});

export const languageSchema = z.object({
  language: str(60),
  level: z.union([z.literal(""), z.enum(LANG_LEVELS)]),
  certification: str(150),
});

export const referenceSchema = z.object({
  name: str(150),
  relation: str(150),
  phone: str(40),
});

function hasShape(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const isObj = (x: unknown) => Boolean(x) && typeof x === "object";
  return (
    ["setup", "contact", "target", "experience", "skills", "availability", "review"].every((k) => isObj(o[k])) &&
    Array.isArray(o.education) &&
    Array.isArray((o.experience as Record<string, unknown>).jobs) &&
    o.education.every(isObj) &&
    ((o.experience as Record<string, unknown>).jobs as unknown[]).every(isObj)
  );
}

export const cvFormSchema = z
  .object({
    setup: z.object({
      label: str(120),
      cvLanguage: z.enum(CV_LANGUAGES),
      market: z.enum(MARKETS),
      format: z.enum(FORMATS),
      length: z.enum(LENGTHS),
    }),
    contact: z.object({
      fullName: str(150),
      phone: str(40),
      email: z.union([z.literal(""), z.string().trim().email().max(200)]),
      location: str(200),
      linkedin: str(300),
      website: str(300),
      nationalId: str(40),
      nationality: str(80),
      includePhoto: z.boolean(),
      driverLicense: str(80),
      ownVehicle: z.enum(YES_NO_MAYBE),
      workPermit: z.enum(WORK_PERMIT),
    }),
    target: z.object({
      role: str(150),
      level: z.enum(LEVELS),
      yearsExperience: str(10),
      company: str(150),
      jobPostingText: z.string().trim().max(15000),
      pitch: longStr(),
    }),
    experience: z.object({
      none: z.boolean(),
      jobs: z.array(jobSchema).max(MAX_JOBS),
      alternative: longStr(),
      gaps: longStr(),
    }),
    education: z.array(educationSchema).max(8),
    courses: z.array(courseSchema).max(15),
    skills: z.object({
      tools: z.array(str(80)).max(40),
      languages: z.array(languageSchema).max(8),
      soft: z.array(z.enum(SOFT_SKILLS)).max(MAX_SOFT_SKILLS),
      softExample: longStr(),
    }),
    availability: z.object({
      start: z.enum(START_OPTIONS),
      schedule: z.array(z.enum(SCHEDULES)),
      modality: z.array(z.enum(MODALITIES)),
      relocate: z.enum(YES_NO_MAYBE),
      extras: longStr(),
      references: z.enum(REFERENCES),
      referenceList: z.array(referenceSchema).max(3),
      other: longStr(),
    }),
    review: z.object({
      coverLetter: z.boolean(),
      internalNotes: longStr(),
      consent: z.boolean(),
    }),
    /** Set by the form when a CV file is attached (or reused from a duplicate). */
    hasExistingCv: z.boolean(),
  })
  .superRefine((d, ctx) => {
    // Required-field rules live here (not in the base shape) so they all run together:
    // zod skips refinements when the base shape already has issues.
    const req = (value: unknown, path: (string | number)[]) => {
      if (typeof value !== "string" || !value.trim()) ctx.addIssue({ code: "custom", message: "required", path });
    };
    req(d.setup.label, ["setup", "label"]);
    if (!d.review.consent) ctx.addIssue({ code: "custom", message: "required", path: ["review", "consent"] });

    // With an existing CV attached, the skill extracts the data from it, so only the
    // setup and consent are mandatory. Without it, the core of a CV must be present.
    if (d.hasExistingCv) return;
    req(d.contact.fullName, ["contact", "fullName"]);
    req(d.contact.phone, ["contact", "phone"]);
    req(d.contact.email, ["contact", "email"]);
    req(d.contact.location, ["contact", "location"]);
    req(d.target.role, ["target", "role"]);

    if (!d.experience.none) {
      if (d.experience.jobs.length === 0) {
        ctx.addIssue({ code: "custom", message: "required", path: ["experience", "jobs"] });
      }
      d.experience.jobs.forEach((j, i) => {
        req(j.company, ["experience", "jobs", i, "company"]);
        req(j.title, ["experience", "jobs", i, "title"]);
        req(j.start, ["experience", "jobs", i, "start"]);
        req(j.duties, ["experience", "jobs", i, "duties"]);
        if (!j.current) req(j.end, ["experience", "jobs", i, "end"]);
      });
    }

    if (!d.education.some((e) => e.level)) {
      ctx.addIssue({ code: "custom", message: "required", path: ["education", 0, "level"] });
    }
  }, {
    // Run even when only format checks failed (e.g. a malformed email), as long as the
    // structure is intact, so every missing required field is reported in one pass.
    when: (payload) => hasShape(payload.value),
  });

export type CvFormData = z.infer<typeof cvFormSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Course = z.infer<typeof courseSchema>;
export type LanguageEntry = z.infer<typeof languageSchema>;
export type ReferenceEntry = z.infer<typeof referenceSchema>;

export const emptyJob = (): Job => ({
  company: "",
  title: "",
  city: "",
  type: "",
  start: "",
  end: "",
  current: false,
  duties: "",
  achievements: "",
  tools: "",
});

export const emptyEducation = (): Education => ({
  level: "",
  institution: "",
  title: "",
  status: "completed",
  endYear: "",
});

export const emptyCourse = (): Course => ({ name: "", institution: "", year: "", hours: "", url: "" });
export const emptyLanguage = (): LanguageEntry => ({ language: "", level: "", certification: "" });
export const emptyReference = (): ReferenceEntry => ({ name: "", relation: "", phone: "" });

/** Form state before validation (same shape; required rules are checked by the schema). */
export type CvFormDraft = CvFormData;

export function emptyCvForm(): CvFormDraft {
  return {
    setup: { label: "", cvLanguage: "es", market: "cr", format: "ats", length: "auto" },
    contact: {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      linkedin: "",
      website: "",
      nationalId: "",
      nationality: "",
      includePhoto: false,
      driverLicense: "",
      ownVehicle: "",
      workPermit: "",
    },
    target: { role: "", level: "", yearsExperience: "", company: "", jobPostingText: "", pitch: "" },
    experience: { none: false, jobs: [emptyJob()], alternative: "", gaps: "" },
    education: [emptyEducation()],
    courses: [],
    skills: { tools: [], languages: [emptyLanguage()], soft: [], softExample: "" },
    availability: {
      start: "",
      schedule: [],
      modality: [],
      relocate: "",
      extras: "",
      references: "on_request",
      referenceList: [],
      other: "",
    },
    review: { coverLetter: false, internalNotes: "", consent: false },
    hasExistingCv: false,
  };
}

/** Markets where local CV conventions include ID, nationality, photo and license. */
export const isLocalMarket = (m: CvFormData["setup"]["market"]) => m === "cr" || m === "latam";

/* ── Stored record ─────────────────────────────────────────── */

export type UploadKind = "existingCv" | "jobPosting" | "photo";

export interface StoredFile {
  pathname: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface OutputFile extends StoredFile {
  kind: "cv" | "cover_letter";
  lang: "es" | "en";
  format: "ats" | "visual";
  ext: "pdf" | "docx";
}

export interface CvRequestRecord {
  id: string;
  version: 1;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "ready";
  label: string;
  duplicatedFrom?: string;
  emailSent: boolean;
  data: CvFormData;
  uploads: Partial<Record<UploadKind, StoredFile>>;
  outputs: OutputFile[];
  generatedAt?: string;
  /** Short note left by the cv-builder skill (assumptions, things to confirm). */
  generatorNotes?: string;
}

export const UPLOAD_LIMITS = {
  /** Vercel functions reject request bodies above 4.5 MB. */
  totalBytes: 4 * 1024 * 1024,
  types: {
    existingCv: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    jobPosting: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    photo: ["image/jpeg", "image/png", "image/webp"],
  } satisfies Record<UploadKind, string[]>,
};
