"use client";

import {
  CV_LANGUAGES,
  EDU_LEVELS,
  EDU_STATUS,
  FORMATS,
  JOB_TYPES,
  LANG_LEVELS,
  LENGTHS,
  LEVELS,
  MARKETS,
  MAX_JOBS,
  MAX_SOFT_SKILLS,
  MODALITIES,
  REFERENCES,
  SCHEDULES,
  SOFT_SKILLS,
  START_OPTIONS,
  WORK_PERMIT,
  YES_NO_MAYBE,
  emptyCourse,
  emptyEducation,
  emptyJob,
  emptyLanguage,
  emptyReference,
  isLocalMarket,
  type CvFormDraft,
  type UploadKind,
} from "@/lib/admin/cv-schema";
import type { AdminDict } from "../../_lib/i18n";
import {
  AddButton,
  Card,
  Checkbox,
  Choice,
  FileInput,
  MonthYear,
  MultiChoice,
  Select,
  TagInput,
  TextArea,
  TextInput,
} from "../../_components/ui";
import { buildAnswerSections } from "../_lib/answers";

export interface StepProps {
  data: CvFormDraft;
  set: (fn: (d: CvFormDraft) => void) => void;
  t: AdminDict;
  err: (path: string) => boolean;
  files: Partial<Record<UploadKind, File | null>>;
  setFile: (kind: UploadKind, f: File | null) => void;
  /** Attachments available from the request being duplicated. */
  reusable: Partial<Record<UploadKind, string>>;
  reuse: boolean;
  setReuse: (v: boolean) => void;
}

const DOC_ACCEPT = ".pdf,.docx,.doc,image/jpeg,image/png,image/webp";
const IMG_ACCEPT = "image/jpeg,image/png,image/webp";

type Dict = Record<string, string>;
const opts = <V extends string>(values: readonly V[], dict: Dict) =>
  values.filter((v) => v !== "").map((v) => ({ value: v, label: dict[v] ?? v }));

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
);

function YesNoMaybe({ label, value, onChange, t }: {
  label: string;
  value: (typeof YES_NO_MAYBE)[number];
  onChange: (v: (typeof YES_NO_MAYBE)[number]) => void;
  t: AdminDict;
}) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      placeholder={t.common.select}
      options={[
        { value: "yes", label: t.common.yes },
        { value: "no", label: t.common.no },
        { value: "maybe", label: t.common.maybe },
      ]}
    />
  );
}

/* ── 0 · Starting point ───────────────────────────────────── */
export function StepSetup({ data, set, t, err, files, setFile, reusable, reuse, setReuse }: StepProps) {
  const f = t.fields;
  const hasReusable = Object.keys(reusable).length > 0;
  return (
    <div className="space-y-7">
      <TextInput
        label={f.label.label}
        hint={f.label.hint}
        required
        error={err("setup.label")}
        value={data.setup.label}
        onChange={(v) => set((d) => void (d.setup.label = v))}
        maxLength={120}
      />
      {hasReusable && (
        <Checkbox
          label={f.reuse.label}
          hint={Object.values(reusable).join(", ")}
          checked={reuse}
          onChange={setReuse}
        />
      )}
      <FileInput
        label={f.existingCv.label}
        hint={f.existingCv.hint}
        accept={DOC_ACCEPT}
        file={files.existingCv ?? null}
        onChange={(file) => setFile("existingCv", file)}
        removeLabel={t.common.remove}
      />
      <Choice
        label={f.cvLanguage.label}
        required
        value={data.setup.cvLanguage}
        onChange={(v) => set((d) => void (d.setup.cvLanguage = v))}
        options={opts(CV_LANGUAGES, f.cvLanguage as Dict)}
      />
      <Choice
        label={f.market.label}
        hint={f.market.hint}
        required
        value={data.setup.market}
        onChange={(v) => set((d) => void (d.setup.market = v))}
        options={opts(MARKETS, f.market as Dict)}
      />
      <Choice
        label={f.format.label}
        required
        value={data.setup.format}
        onChange={(v) => set((d) => void (d.setup.format = v))}
        options={FORMATS.map((v) => ({
          value: v,
          label: f.format[v],
          hint: f.format[`${v}Hint` as "atsHint" | "visualHint" | "bothHint"],
        }))}
      />
      <Choice
        label={f.length.label}
        value={data.setup.length}
        onChange={(v) => set((d) => void (d.setup.length = v))}
        options={opts(LENGTHS, f.length as Dict)}
      />
    </div>
  );
}

/* ── 1 · Contact ──────────────────────────────────────────── */
export function StepContact({ data, set, t, err, files, setFile }: StepProps) {
  const f = t.fields;
  const c = data.contact;
  const req = !data.hasExistingCv;
  const local = isLocalMarket(data.setup.market);
  return (
    <div className="space-y-6">
      <Grid>
        <TextInput label={f.fullName.label} hint={f.fullName.hint} required={req} error={err("contact.fullName")}
          value={c.fullName} onChange={(v) => set((d) => void (d.contact.fullName = v))} autoComplete="off" />
        <TextInput label={f.phone.label} hint={f.phone.hint} required={req} error={err("contact.phone")} type="tel"
          value={c.phone} onChange={(v) => set((d) => void (d.contact.phone = v))} autoComplete="off" />
        <TextInput label={f.email.label} hint={f.email.hint} required={req} error={err("contact.email")} type="email"
          value={c.email} onChange={(v) => set((d) => void (d.contact.email = v))} autoComplete="off" />
        <TextInput label={f.location.label} hint={f.location.hint} required={req} error={err("contact.location")}
          value={c.location} onChange={(v) => set((d) => void (d.contact.location = v))} />
        <TextInput label={f.linkedin.label} hint={f.linkedin.hint}
          value={c.linkedin} onChange={(v) => set((d) => void (d.contact.linkedin = v))} />
        <TextInput label={f.website.label}
          value={c.website} onChange={(v) => set((d) => void (d.contact.website = v))} />
      </Grid>

      {local && (
        <Card title={f.localSection}>
          <Grid>
            <TextInput label={f.nationalId.label} hint={f.nationalId.hint}
              value={c.nationalId} onChange={(v) => set((d) => void (d.contact.nationalId = v))} />
            <TextInput label={f.nationality.label}
              value={c.nationality} onChange={(v) => set((d) => void (d.contact.nationality = v))} />
            <TextInput label={f.driverLicense.label} hint={f.driverLicense.hint}
              value={c.driverLicense} onChange={(v) => set((d) => void (d.contact.driverLicense = v))} />
            <YesNoMaybe label={f.ownVehicle.label} t={t}
              value={c.ownVehicle} onChange={(v) => set((d) => void (d.contact.ownVehicle = v))} />
          </Grid>
          <Checkbox label={f.includePhoto.label} checked={c.includePhoto}
            onChange={(v) => set((d) => void (d.contact.includePhoto = v))} />
          {c.includePhoto && (
            <FileInput label={f.photo.label} hint={f.photo.hint} accept={IMG_ACCEPT}
              file={files.photo ?? null} onChange={(file) => setFile("photo", file)} removeLabel={t.common.remove} />
          )}
        </Card>
      )}

      <Select label={f.workPermit.label} placeholder={t.common.select}
        value={c.workPermit} onChange={(v) => set((d) => void (d.contact.workPermit = v))}
        options={opts(WORK_PERMIT, f.workPermit as Dict)} />
    </div>
  );
}

/* ── 2 · Target ───────────────────────────────────────────── */
export function StepTarget({ data, set, t, err, files, setFile }: StepProps) {
  const f = t.fields;
  const tg = data.target;
  return (
    <div className="space-y-6">
      <TextInput label={f.role.label} hint={f.role.hint} required={!data.hasExistingCv} error={err("target.role")}
        value={tg.role} onChange={(v) => set((d) => void (d.target.role = v))} />
      <Grid>
        <Select label={f.level.label} placeholder={t.common.select}
          value={tg.level} onChange={(v) => set((d) => void (d.target.level = v))} options={opts(LEVELS, f.level as Dict)} />
        <TextInput label={f.yearsExperience.label} hint={f.yearsExperience.hint} inputMode="numeric" maxLength={10}
          value={tg.yearsExperience} onChange={(v) => set((d) => void (d.target.yearsExperience = v))} />
      </Grid>
      <TextInput label={f.company.label} hint={f.company.hint}
        value={tg.company} onChange={(v) => set((d) => void (d.target.company = v))} />
      <TextArea label={f.jobPostingText.label} hint={f.jobPostingText.hint} rows={6}
        value={tg.jobPostingText} onChange={(v) => set((d) => void (d.target.jobPostingText = v))} />
      <FileInput label={f.jobPosting.label} hint={f.jobPosting.hint} accept={DOC_ACCEPT}
        file={files.jobPosting ?? null} onChange={(file) => setFile("jobPosting", file)} removeLabel={t.common.remove} />
      <TextArea label={f.pitch.label} hint={f.pitch.hint}
        value={tg.pitch} onChange={(v) => set((d) => void (d.target.pitch = v))} />
    </div>
  );
}

/* ── 3 · Experience ───────────────────────────────────────── */
export function StepExperience({ data, set, t, err }: StepProps) {
  const f = t.fields;
  const locale = t.common.locale;
  const monthPh = { month: f.month, year: f.year };
  const e = data.experience;
  const req = !data.hasExistingCv;
  return (
    <div className="space-y-5">
      <Checkbox label={f.noExperience.label} checked={e.none}
        onChange={(v) => set((d) => void (d.experience.none = v))} />

      {e.none ? (
        <TextArea label={f.alternative.label} hint={f.alternative.hint} rows={5}
          value={e.alternative} onChange={(v) => set((d) => void (d.experience.alternative = v))} />
      ) : (
        <>
          {err("experience.jobs") && <p className="text-sm text-red-500">{t.form.fixErrors}</p>}
          {e.jobs.map((j, i) => {
            const p = `experience.jobs.${i}`;
            const up = (fn: (job: typeof j) => void) => set((d) => fn(d.experience.jobs[i]));
            return (
              <Card key={i} title={`${f.job} ${i + 1}`} removeLabel={t.common.remove}
                onRemove={() => set((d) => void d.experience.jobs.splice(i, 1))}>
                <Grid>
                  <TextInput label={f.jobCompany.label} hint={f.jobCompany.hint} required={req} error={err(`${p}.company`)}
                    value={j.company} onChange={(v) => up((x) => void (x.company = v))} />
                  <TextInput label={f.jobTitle.label} hint={f.jobTitle.hint} required={req} error={err(`${p}.title`)}
                    value={j.title} onChange={(v) => up((x) => void (x.title = v))} />
                  <TextInput label={f.jobCity.label}
                    value={j.city} onChange={(v) => up((x) => void (x.city = v))} />
                  <Select label={f.jobType.label} placeholder={t.common.select}
                    value={j.type} onChange={(v) => up((x) => void (x.type = v))} options={opts(JOB_TYPES, f.jobType as Dict)} />
                  <MonthYear label={f.jobStart.label} required={req} error={err(`${p}.start`)} locale={locale}
                    placeholders={monthPh} value={j.start} onChange={(v) => up((x) => void (x.start = v))} />
                  {!j.current && (
                    <MonthYear label={f.jobEnd.label} required={req} error={err(`${p}.end`)} locale={locale}
                      placeholders={monthPh} value={j.end} onChange={(v) => up((x) => void (x.end = v))} />
                  )}
                </Grid>
                <Checkbox label={f.jobCurrent.label} checked={j.current}
                  onChange={(v) => up((x) => { x.current = v; if (v) x.end = ""; })} />
                <TextArea label={f.jobDuties.label} hint={f.jobDuties.hint} required={req} error={err(`${p}.duties`)}
                  value={j.duties} onChange={(v) => up((x) => void (x.duties = v))} />
                <TextArea label={f.jobAchievements.label} hint={f.jobAchievements.hint}
                  value={j.achievements} onChange={(v) => up((x) => void (x.achievements = v))} />
                <TextInput label={f.jobTools.label} hint={f.jobTools.hint}
                  value={j.tools} onChange={(v) => up((x) => void (x.tools = v))} />
              </Card>
            );
          })}
          <AddButton disabled={e.jobs.length >= MAX_JOBS}
            onClick={() => set((d) => void d.experience.jobs.push(emptyJob()))}>
            {f.addJob} ({e.jobs.length}/{MAX_JOBS})
          </AddButton>
        </>
      )}

      <TextArea label={f.gaps.label} hint={f.gaps.hint} rows={3}
        value={e.gaps} onChange={(v) => set((d) => void (d.experience.gaps = v))} />
    </div>
  );
}

/* ── 4 · Education ────────────────────────────────────────── */
export function StepEducation({ data, set, t, err }: StepProps) {
  const f = t.fields;
  return (
    <div className="space-y-5">
      {data.education.map((ed, i) => {
        const up = (fn: (x: typeof ed) => void) => set((d) => fn(d.education[i]));
        return (
          <Card key={i} title={`${f.education} ${i + 1}`} removeLabel={t.common.remove}
            onRemove={data.education.length > 1 ? () => set((d) => void d.education.splice(i, 1)) : undefined}>
            <Select label={f.eduLevel.label} placeholder={t.common.select}
              required={i === 0 && !data.hasExistingCv} error={err(`education.${i}.level`)}
              value={ed.level} onChange={(v) => up((x) => void (x.level = v))} options={opts(EDU_LEVELS, f.eduLevel as Dict)} />
            <Grid>
              <TextInput label={f.eduInstitution.label} hint={f.eduInstitution.hint}
                value={ed.institution} onChange={(v) => up((x) => void (x.institution = v))} />
              <TextInput label={f.eduTitle.label} hint={f.eduTitle.hint}
                value={ed.title} onChange={(v) => up((x) => void (x.title = v))} />
              <Select label={f.eduStatus.label}
                value={ed.status} onChange={(v) => up((x) => void (x.status = v))} options={opts(EDU_STATUS, f.eduStatus as Dict)} />
              <TextInput label={f.eduEndYear.label} hint={f.eduEndYear.hint} inputMode="numeric" maxLength={4}
                error={err(`education.${i}.endYear`)}
                value={ed.endYear} onChange={(v) => up((x) => void (x.endYear = v.replace(/\D/g, "")))} />
            </Grid>
          </Card>
        );
      })}
      <AddButton disabled={data.education.length >= 8}
        onClick={() => set((d) => void d.education.push(emptyEducation()))}>
        {f.addEducation}
      </AddButton>
    </div>
  );
}

/* ── 5 · Courses ──────────────────────────────────────────── */
export function StepCourses({ data, set, t, err }: StepProps) {
  const f = t.fields;
  return (
    <div className="space-y-5">
      {data.courses.length === 0 && <p className="text-sm text-text-muted">{f.noCourses}</p>}
      {data.courses.map((co, i) => {
        const up = (fn: (x: typeof co) => void) => set((d) => fn(d.courses[i]));
        return (
          <Card key={i} title={`${f.course} ${i + 1}`} removeLabel={t.common.remove}
            onRemove={() => set((d) => void d.courses.splice(i, 1))}>
            <TextInput label={f.courseName.label} hint={f.courseName.hint}
              value={co.name} onChange={(v) => up((x) => void (x.name = v))} />
            <Grid>
              <TextInput label={f.courseInstitution.label} hint={f.courseInstitution.hint}
                value={co.institution} onChange={(v) => up((x) => void (x.institution = v))} />
              <div className="grid grid-cols-2 gap-5">
                <TextInput label={f.courseYear.label} inputMode="numeric" maxLength={4} error={err(`courses.${i}.year`)}
                  value={co.year} onChange={(v) => up((x) => void (x.year = v.replace(/\D/g, "")))} />
                <TextInput label={f.courseHours.label} inputMode="numeric" maxLength={20}
                  value={co.hours} onChange={(v) => up((x) => void (x.hours = v))} />
              </div>
            </Grid>
            <TextInput label={f.courseUrl.label} type="url"
              value={co.url} onChange={(v) => up((x) => void (x.url = v))} />
          </Card>
        );
      })}
      <AddButton disabled={data.courses.length >= 15}
        onClick={() => set((d) => void d.courses.push(emptyCourse()))}>
        {f.addCourse}
      </AddButton>
    </div>
  );
}

/* ── 6 · Skills ───────────────────────────────────────────── */
export function StepSkills({ data, set, t }: StepProps) {
  const f = t.fields;
  const s = data.skills;
  return (
    <div className="space-y-7">
      <TagInput label={f.tools.label} hint={f.tools.hint}
        value={s.tools} onChange={(v) => set((d) => void (d.skills.tools = v))} />

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-secondary">{f.languages}</p>
        {s.languages.map((l, i) => {
          const up = (fn: (x: typeof l) => void) => set((d) => fn(d.skills.languages[i]));
          return (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <TextInput label={f.langName.label} hint={i === 0 ? f.langName.hint : undefined}
                value={l.language} onChange={(v) => up((x) => void (x.language = v))} />
              <Select label={f.langLevel.label} placeholder={t.common.select}
                value={l.level} onChange={(v) => up((x) => void (x.level = v))} options={opts(LANG_LEVELS, f.langLevel as Dict)} />
              <TextInput label={f.langCert.label} hint={i === 0 ? f.langCert.hint : undefined}
                value={l.certification} onChange={(v) => up((x) => void (x.certification = v))} />
              <button type="button" onClick={() => set((d) => void d.skills.languages.splice(i, 1))}
                className="text-xs text-text-muted hover:text-red-500 pb-3 cursor-pointer">
                {t.common.remove}
              </button>
            </div>
          );
        })}
        <AddButton disabled={s.languages.length >= 8}
          onClick={() => set((d) => void d.skills.languages.push(emptyLanguage()))}>
          {f.addLanguage}
        </AddButton>
      </div>

      <MultiChoice label={f.soft.label} max={MAX_SOFT_SKILLS}
        value={s.soft} onChange={(v) => set((d) => void (d.skills.soft = v))} options={opts(SOFT_SKILLS, f.soft as Dict)} />
      <TextArea label={f.softExample.label} hint={f.softExample.hint} rows={3}
        value={s.softExample} onChange={(v) => set((d) => void (d.skills.softExample = v))} />
    </div>
  );
}

/* ── 7 · Availability ─────────────────────────────────────── */
export function StepAvailability({ data, set, t }: StepProps) {
  const f = t.fields;
  const a = data.availability;
  return (
    <div className="space-y-7">
      <Grid>
        <Select label={f.start.label} placeholder={t.common.select}
          value={a.start} onChange={(v) => set((d) => void (d.availability.start = v))} options={opts(START_OPTIONS, f.start as Dict)} />
        <YesNoMaybe label={f.relocate.label} t={t}
          value={a.relocate} onChange={(v) => set((d) => void (d.availability.relocate = v))} />
      </Grid>
      <MultiChoice label={f.schedule.label}
        value={a.schedule} onChange={(v) => set((d) => void (d.availability.schedule = v))} options={opts(SCHEDULES, f.schedule as Dict)} />
      <MultiChoice label={f.modality.label}
        value={a.modality} onChange={(v) => set((d) => void (d.availability.modality = v))} options={opts(MODALITIES, f.modality as Dict)} />
      <TextArea label={f.extras.label} hint={f.extras.hint} rows={3}
        value={a.extras} onChange={(v) => set((d) => void (d.availability.extras = v))} />

      <Choice label={f.references.label} hint={f.references.hint}
        value={a.references} onChange={(v) => set((d) => {
          d.availability.references = v;
          if (v === "include" && d.availability.referenceList.length === 0) d.availability.referenceList.push(emptyReference());
        })}
        options={opts(REFERENCES, f.references as Dict)} />
      {a.references === "include" && (
        <div className="space-y-4">
          {a.referenceList.map((r, i) => {
            const up = (fn: (x: typeof r) => void) => set((d) => fn(d.availability.referenceList[i]));
            return (
              <Card key={i} title={`${f.reference} ${i + 1}`} removeLabel={t.common.remove}
                onRemove={() => set((d) => void d.availability.referenceList.splice(i, 1))}>
                <Grid>
                  <TextInput label={f.refName.label} value={r.name} onChange={(v) => up((x) => void (x.name = v))} />
                  <TextInput label={f.refPhone.label} type="tel" value={r.phone} onChange={(v) => up((x) => void (x.phone = v))} />
                </Grid>
                <TextInput label={f.refRelation.label} hint={f.refRelation.hint}
                  value={r.relation} onChange={(v) => up((x) => void (x.relation = v))} />
              </Card>
            );
          })}
          <AddButton disabled={a.referenceList.length >= 3}
            onClick={() => set((d) => void d.availability.referenceList.push(emptyReference()))}>
            {f.addReference}
          </AddButton>
        </div>
      )}

      <TextArea label={f.other.label} rows={3}
        value={a.other} onChange={(v) => set((d) => void (d.availability.other = v))} />
    </div>
  );
}

/* ── 8 · Review ───────────────────────────────────────────── */
export function StepReview({ data, set, t, err, files, reusable, reuse }: StepProps) {
  const f = t.fields;
  const sections = buildAnswerSections(data, t).slice(0, -1);
  const attached = [
    ...Object.values(files).filter((x): x is File => Boolean(x)).map((x) => x.name),
    ...(reuse ? Object.values(reusable) : []),
  ];
  return (
    <div className="space-y-7">
      <Checkbox label={f.coverLetter.label} hint={f.coverLetter.hint} checked={data.review.coverLetter}
        onChange={(v) => set((d) => void (d.review.coverLetter = v))} />
      <TextArea label={f.internalNotes.label} hint={f.internalNotes.hint} rows={3}
        value={data.review.internalNotes} onChange={(v) => set((d) => void (d.review.internalNotes = v))} />

      <div className="rounded-xl border border-border bg-bg-card p-5 space-y-4">
        <p className="text-xs font-semibold text-text-muted tracking-widest uppercase">{t.summary.title}</p>
        <dl className="grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-text-muted">{t.summary.attachments}</dt>
          <dd className="text-text-primary">{attached.length ? attached.join(", ") : t.summary.none}</dd>
        </dl>
        {sections.map((s) => (
          <div key={s.title} className="pt-4 border-t border-border-subtle">
            <p className="text-sm font-semibold text-text-primary mb-2">{s.title}</p>
            {s.groups.map((g, gi) => (
              <dl key={gi} className={`grid sm:grid-cols-[180px_1fr] gap-x-6 gap-y-1 text-sm ${gi > 0 ? "mt-3" : ""}`}>
                {g.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-text-muted">{k}</dt>
                    <dd className="text-text-primary whitespace-pre-line break-words line-clamp-4">{v}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
        ))}
      </div>

      <Checkbox label={f.consent.label} checked={data.review.consent} error={err("review.consent")}
        onChange={(v) => set((d) => void (d.review.consent = v))} />
    </div>
  );
}

export const STEPS = [
  StepSetup,
  StepContact,
  StepTarget,
  StepExperience,
  StepEducation,
  StepCourses,
  StepSkills,
  StepAvailability,
  StepReview,
];

/** Maps a validation issue path to the step that owns it. */
export function stepForPath(path: string): number {
  const root = path.split(".")[0];
  const map: Record<string, number> = {
    setup: 0,
    contact: 1,
    target: 2,
    experience: 3,
    education: 4,
    courses: 5,
    skills: 6,
    availability: 7,
    review: 8,
  };
  return map[root] ?? 0;
}
