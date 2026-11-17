import type { CvFormDraft } from "@/lib/admin/cv-schema";
import type { AdminDict } from "../../_lib/i18n";

/*
 * Turns stored form data into labelled rows for the detail page and the
 * form's review step. Empty values are skipped so the view stays compact.
 */

export type AnswerSection = { title: string; groups: [string, string][][] };

type Options = Record<string, string>;

const opt = (dict: Options, value: string) => (value ? (dict[value] ?? value) : "");

export function buildAnswerSections(data: CvFormDraft, t: AdminDict): AnswerSection[] {
  const f = t.fields;
  const yn = (v: string) => (v === "yes" ? t.common.yes : v === "no" ? t.common.no : v === "maybe" ? t.common.maybe : "");
  const bool = (v: boolean) => (v ? t.common.yes : "");
  const rows = (pairs: [string, string][]) => pairs.filter(([, v]) => v && v.trim());
  const steps = t.form.steps;
  const sections: AnswerSection[] = [];
  const push = (title: string, groups: [string, string][][]) => {
    const kept = groups.map(rows).filter((g) => g.length);
    if (kept.length) sections.push({ title, groups: kept });
  };

  push(steps[0], [[
    [f.label.label, data.setup.label],
    [f.cvLanguage.label, opt(f.cvLanguage as Options, data.setup.cvLanguage)],
    [f.market.label, opt(f.market as Options, data.setup.market)],
    [f.format.label, opt(f.format as Options, data.setup.format)],
    [f.length.label, opt(f.length as Options, data.setup.length)],
    [f.existingCv.label, bool(data.hasExistingCv)],
  ]]);

  const c = data.contact;
  push(steps[1], [[
    [f.fullName.label, c.fullName],
    [f.phone.label, c.phone],
    [f.email.label, c.email],
    [f.location.label, c.location],
    [f.linkedin.label, c.linkedin],
    [f.website.label, c.website],
    [f.nationalId.label, c.nationalId],
    [f.nationality.label, c.nationality],
    [f.includePhoto.label, bool(c.includePhoto)],
    [f.driverLicense.label, c.driverLicense],
    [f.ownVehicle.label, yn(c.ownVehicle)],
    [f.workPermit.label, opt(f.workPermit as Options, c.workPermit)],
  ]]);

  const tg = data.target;
  push(steps[2], [[
    [f.role.label, tg.role],
    [f.level.label, opt(f.level as Options, tg.level)],
    [f.yearsExperience.label, tg.yearsExperience],
    [f.company.label, tg.company],
    [f.pitch.label, tg.pitch],
    [f.jobPostingText.label, tg.jobPostingText],
  ]]);

  const e = data.experience;
  push(steps[3], [
    [[f.noExperience.label, bool(e.none)], [f.alternative.label, e.alternative], [f.gaps.label, e.gaps]],
    ...(e.none ? [] : e.jobs).map((j): [string, string][] => [
      [f.jobCompany.label, j.company],
      [f.jobTitle.label, j.title],
      [f.jobCity.label, j.city],
      [f.jobType.label, opt(f.jobType as Options, j.type)],
      [f.jobStart.label, j.start],
      [f.jobEnd.label, j.current ? f.jobCurrent.label : j.end],
      [f.jobDuties.label, j.duties],
      [f.jobAchievements.label, j.achievements],
      [f.jobTools.label, j.tools],
    ]),
  ]);

  push(
    steps[4],
    data.education.map((ed) => [
      [f.eduLevel.label, opt(f.eduLevel as Options, ed.level)],
      [f.eduInstitution.label, ed.institution],
      [f.eduTitle.label, ed.title],
      [f.eduStatus.label, ed.level ? opt(f.eduStatus as Options, ed.status) : ""],
      [f.eduEndYear.label, ed.endYear],
    ]),
  );

  push(
    steps[5],
    data.courses.map((co) => [
      [f.courseName.label, co.name],
      [f.courseInstitution.label, co.institution],
      [f.courseYear.label, co.year],
      [f.courseHours.label, co.hours],
      [f.courseUrl.label, co.url],
    ]),
  );

  const s = data.skills;
  push(steps[6], [[
    [f.tools.label, s.tools.join(", ")],
    [
      f.languages,
      s.languages
        .filter((l) => l.language)
        .map((l) => [l.language, opt(f.langLevel as Options, l.level), l.certification].filter(Boolean).join(" · "))
        .join("\n"),
    ],
    [f.soft.label, s.soft.map((k) => opt(f.soft as Options, k)).join(", ")],
    [f.softExample.label, s.softExample],
  ]]);

  const a = data.availability;
  push(steps[7], [[
    [f.start.label, opt(f.start as Options, a.start)],
    [f.schedule.label, a.schedule.map((k) => opt(f.schedule as Options, k)).join(", ")],
    [f.modality.label, a.modality.map((k) => opt(f.modality as Options, k)).join(", ")],
    [f.relocate.label, yn(a.relocate)],
    [f.extras.label, a.extras],
    [f.references.label, opt(f.references as Options, a.references)],
    [
      f.reference,
      a.references === "include"
        ? a.referenceList.map((r) => [r.name, r.relation, r.phone].filter(Boolean).join(" · ")).join("\n")
        : "",
    ],
    [f.other.label, a.other],
  ]]);

  push(steps[8], [[
    [f.coverLetter.label, bool(data.review.coverLetter)],
    [f.internalNotes.label, data.review.internalNotes],
  ]]);

  return sections;
}
