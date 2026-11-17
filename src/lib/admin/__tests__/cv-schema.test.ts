/** @jest-environment node */
import { cvFormSchema, emptyCvForm, emptyJob, type CvFormDraft } from "../cv-schema";

const issuePaths = (d: CvFormDraft) => {
  const r = cvFormSchema.safeParse(d);
  return r.success ? [] : r.error.issues.map((i) => i.path.join("."));
};

function complete(): CvFormDraft {
  const d = emptyCvForm();
  d.setup.label = "Test";
  d.contact = { ...d.contact, fullName: "Ana", phone: "+506 8888 8888", email: "ana@example.com", location: "Limón" };
  d.target.role = "Cajera";
  d.experience.jobs = [{ ...emptyJob(), company: "Súper", title: "Cajera", start: "2020-03", current: true, duties: "Caja" }];
  d.education[0].level = "secondary";
  d.review.consent = true;
  return d;
}

describe("cvFormSchema", () => {
  it("accepts a complete request", () => {
    expect(issuePaths(complete())).toEqual([]);
  });

  it("reports missing contact fields even while consent is still unchecked", () => {
    // Regression: required-field rules used to be skipped until the base shape was valid.
    const d = complete();
    d.review.consent = false;
    d.contact.fullName = "";
    expect(issuePaths(d)).toEqual(expect.arrayContaining(["contact.fullName", "review.consent"]));
  });

  it("reports required fields alongside format errors", () => {
    const d = complete();
    d.contact.email = "not-an-email";
    d.target.role = "";
    expect(issuePaths(d)).toEqual(expect.arrayContaining(["contact.email", "target.role"]));
  });

  it("only requires setup and consent when an existing CV is attached", () => {
    const d = emptyCvForm();
    d.hasExistingCv = true;
    expect(issuePaths(d).sort()).toEqual(["review.consent", "setup.label"]);
  });

  it("requires an end date unless the job is current", () => {
    const d = complete();
    d.experience.jobs[0].current = false;
    expect(issuePaths(d)).toContain("experience.jobs.0.end");
  });

  it("skips job checks when there is no formal experience", () => {
    const d = complete();
    d.experience.none = true;
    d.experience.jobs = [emptyJob()];
    expect(issuePaths(d)).toEqual([]);
  });

  it("rejects malformed months and more than five soft skills", () => {
    const d = complete();
    d.experience.jobs[0].start = "2020-13";
    d.skills.soft = ["punctual", "responsible", "teamwork", "fast_learner", "leadership", "creative"];
    expect(issuePaths(d)).toEqual(expect.arrayContaining(["experience.jobs.0.start", "skills.soft"]));
  });
});
