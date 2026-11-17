# Form fields in `request.json` (`data`)

Source of truth: `src/lib/admin/cv-schema.ts`. Option codes and their meanings:

- `hasExistingCv`: an existing CV was attached (`uploads.existingCv`). When true, every other answer may be empty.
- `setup`
  - `label`: internal name for the dashboard. Do not use it in the CV.
  - `cvLanguage`: `es` | `en` | `both`
  - `market`: `cr` Costa Rica | `latam` | `us_ca` US/Canada | `europe` | `remote` remote international
  - `format`: `ats` | `visual` | `both`
  - `length`: `1` one page | `2` up to two pages | `auto`
- `contact`: fullName, phone, email, location, linkedin, website; local-market extras:
  nationalId, nationality, includePhoto (bool), driverLicense, ownVehicle (`yes|no|maybe|""`),
  workPermit (`yes` | `no` | `sponsorship` | `""`)
- `target`: role, level (`first|junior|mid|senior|lead|""`), yearsExperience (free text),
  company, jobPostingText, pitch (why they're a good candidate, in their words)
- `experience`
  - `none`: no formal experience. Use `alternative` (internships, projects, volunteering, family or informal work).
  - `jobs[]`: company, title, city, type (`full|part|temp|freelance|own|informal|""`),
    start/end `YYYY-MM`, current (bool), duties, achievements, tools (free text)
  - `gaps`: explanation of gaps longer than 6 months
- `education[]`: level (`primary|secondary_incomplete|secondary|technical|diploma|bachelor|licentiate|master|doctorate`),
  institution, title, status (`completed|in_progress|incomplete`), endYear
- `courses[]`: name, institution, year, hours, url
- `skills`: tools (string[]), languages[] {language, level (`basic|intermediate|advanced|native`), certification},
  soft (codes: punctual, responsible, teamwork, fast_learner, leadership, creative, organized, patient,
  proactive, adaptable, customer_service, communication, problem_solving, pressure; max 5),
  softExample (a real example of one of them)
- `availability`: start (`immediate|2_weeks|1_month|other|""`), schedule[] (`full|part|rotating|weekends`),
  modality[] (`onsite|hybrid|remote`), relocate (`yes|no|maybe|""`), extras (volunteering/awards),
  references (`include|on_request|none`), referenceList[] {name, relation, phone}, other
- `review`: coverLetter (bool), internalNotes (private admin instructions; follow them), consent (always true)

Record fields outside `data`: `id`, `status` (`pending|ready`), `uploads` {existingCv, jobPosting, photo},
`outputs[]`, `duplicatedFrom` (the id of the request this one was copied from).
