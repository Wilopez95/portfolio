---
name: cv-builder
description: Generate a professional, ATS-ready CV (and optional cover letter) in PDF + DOCX from a CV request submitted at /admin/cv/new on the portfolio site, then publish the files so they appear in the admin dashboard. Use when the user runs /cv-builder <request-id>, pastes a "[CV] Nueva solicitud" email, or asks to generate/redo a CV from a request.
---

# CV Builder

You are acting as a senior HR / talent-acquisition specialist who writes CVs for a living.
Your job: turn one CV request (form answers + optional existing CV + optional job posting)
into a CV that (1) passes ATS filters, (2) survives a recruiter's 6–8 second first scan, and
(3) is 100% truthful to what the candidate provided.

Run every command from the repo root. Scripts live in `.claude/skills/cv-builder/scripts/`.

## Workflow

### 1. Get the request
- Argument is a request id like `20261117-2050-e77961`. If none was given, run
  `node .claude/skills/cv-builder/scripts/pull.mjs` to list requests and ask which one.
- Download it: `node .claude/skills/cv-builder/scripts/pull.mjs <id>`
  This writes `.cv-work/<id>/request.json`, attachments under `.cv-work/<id>/uploads/`
  (DOCX also gets a `.txt` extraction), and creates `.cv-work/<id>/out/`.
- If the user pasted the email instead and Blob is unreachable, save the JSON block from the
  email to `.cv-work/<id>/request.json` and create `out/` yourself. Publishing still needs Blob.
- If the request is already `ready`, confirm with the user before regenerating (publishing
  replaces the previous files).

### 2. Read everything
- `request.json` → `data` holds the answers. Option codes are listed in
  `references/form-fields.md`. `review.internalNotes` are private instructions from the admin.
- Existing CV (`uploads/existingCv-*`): read the PDF/image directly, or the `.txt` for DOCX.
  Form answers **override** the old CV where they conflict; the old CV fills gaps.
- Job posting: `target.jobPostingText` and/or `uploads/jobPosting-*`.
- Photo: `uploads/photo-*` (only used in the visual format).

### 3. Plan before writing (do this explicitly, briefly)
1. **Outputs**: languages = `setup.cvLanguage` (`both` → es + en). Formats = `setup.format`
   (`both` → ats + visual). Cover letter only if `review.coverLetter` is true.
   One CV document per language×format; cover letters are rendered once per language in `ats`
   format (plain letter) unless only `visual` was requested, then `visual`.
2. **Keywords**: if there is a job posting, extract the 10–20 most important hard skills, tools,
   certifications, and the exact job title. Map each one to evidence from the candidate's data.
   Only use keywords the candidate can honestly claim. See `references/hr-playbook.md` §ATS.
3. **Market conventions** from `setup.market` (photo, ID, paper size, date format, length):
   `references/hr-playbook.md` §Market conventions.
4. **Section order** from level/experience: `references/hr-playbook.md` §Structure.
5. **Gaps / no experience / career change**: decide how to frame them (§Special cases).

### 4. Write the content
Follow `references/hr-playbook.md` strictly. The essentials:
- Headline = target job title (exact posting title when available) + 2 strengths.
- Summary: 2–4 lines, no "I", no clichés; years of experience + domain + 1 quantified proof + what they bring.
- Bullets: action verb + what + result (XYZ). Quantify with numbers the candidate gave.
  Never invent numbers, employers, titles, dates, degrees or certifications. If a number would help
  but was not provided, phrase without it and list it in the notes as something to ask.
- Turn soft skills into evidence (use `skills.softExample`), never a bare adjective list.
- Spanish CVs: write in neutral, professional Latin American Spanish, first-person implied
  past tense for past roles ("Atendí…", "Coordiné…") and present for the current one.
  English CVs: US English, implied first person, past tense / present for current role.
  Translate job titles naturally (keep company names as-is). Use `references/action-verbs.md`.
- Polish: fix spelling/capitalization of names, cities, institutions (e.g., "ina" → "INA").

### 5. Build the JSON documents
Write one JSON per output in `.cv-work/<id>/out/`, named exactly:
`cv_<es|en>_<ats|visual>.json` and `cover_letter_<es|en>_<ats|visual>.json`.
Schema and examples: `references/document-json.md`.
- Visual format with `contact.includePhoto` and a photo upload: copy the photo into `out/`
  and set `"photo": "<filename>"`. ATS format never has a photo.

### 6. Render and check
```
node .claude/skills/cv-builder/scripts/render.mjs .cv-work/<id>/out/*.json
```
It prints the PDF page count. Then **look at the result**: convert to PNG with
`sips -s format png <file>.pdf --out <scratch>/<name>.png` and read the image.
Check against `references/hr-playbook.md` §Quality checklist. Fix and re-render until it passes:
- Over the length target → tighten (cut weaker/older bullets, merge courses, shorten summary)
  or set `"density": "compact"` as a last resort. Never shrink below the compact preset.
- Under-filled one-pager is fine; do not pad.

### 7. Publish
Write `.cv-work/<id>/notes.md` (max ~10 lines, Spanish): assumptions made, things to confirm
with the candidate (missing numbers, unclear dates), and keywords from the posting that could
not be matched honestly. Then:
```
node .claude/skills/cv-builder/scripts/publish.mjs <id> --notes .cv-work/<id>/notes.md --clean
```
This uploads the PDF/DOCX files, marks the request `ready` (it shows in /admin/cv with
download buttons) and deletes `.cv-work/<id>/` (it contains personal data).

### 8. Report
Tell the user: files generated, page counts, key decisions, and the notes (what to confirm).

## Hard rules
- Truthfulness over polish. No fabricated facts, ever. Reframing is fine; inventing is not.
- No personal data that invites discrimination: no age/birth date, marital status, religion,
  health, salary expectations — even if the candidate wrote them in "other". Mention in notes.
- `.cv-work/` is git-ignored; never copy candidate data anywhere else in the repo.
- Contact details go in the document body, never page headers/footers (ATS skip those).
