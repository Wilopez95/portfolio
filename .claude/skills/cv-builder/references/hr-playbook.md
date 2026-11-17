# HR playbook for the CV builder

How a professional recruiter and resume writer would build the CV. Read the relevant sections
before writing. Where the evidence is weak (vendor blogs, unpublished studies), the guidance is
marked as convention rather than fact. Sources are listed at the end.

---

## 1. How CVs are actually read

1. **ATS parse.** Portals (Workday, Greenhouse, Taleo, iCIMS, SuccessFactors; in Costa Rica also
   elempleo.com, Computrabajo, LinkedIn) turn the file into fields: name, contact, titles, employers,
   dates, education, skills. Recruiters then **search and filter by keywords and titles**.
   Most ATS do not auto-reject on a "score". The CV fails because it is invisible to the
   recruiter's search, or because it parses into garbage.
2. **Recruiter first scan (~6–8 s).** Eye-tracking research by TheLadders (2012, updated 2018),
   which is cited secondhand, reports that the first pass goes to the name, current title and
   company, previous title and company, dates, and education. The top third of page 1 decides
   whether they keep reading.
3. **Second read.** They read the first 2–3 bullets of the most recent role, then look for proof
   that the candidate matches the posting (numbers, scope, tools).

Consequence: put the most relevant evidence at the **top of the page** and at the **top of each role**.

---

## 2. ATS rules (both formats follow them; "visual" only adds color and a photo)

- Single column, top-to-bottom. No tables, text boxes, columns, icons, skill bars, or text inside images.
- Standard section titles. They let the parser map each block:
  - ES: Perfil profesional · Experiencia laboral · Educación · Habilidades · Cursos y certificaciones · Idiomas · Voluntariado · Referencias
  - EN: Summary · Experience · Education · Skills · Certifications · Languages · Volunteer Experience · References
- Name and contact go in the body, not in the page header or footer.
- Dates use one consistent format everywhere: `MM/YYYY` (ES) or `Mon YYYY` (EN, e.g. "Mar 2020").
  Write "Actual" or "Present" for the current role. Avoid seasons ("Summer 2023").
- Use a standard font, which the renderer handles (Arial). Text must stay selectable, and the renderer guarantees that too.
- **Keywords**:
  - Mirror the posting's exact job title in the headline when it is honestly applicable.
  - Use each critical hard skill or tool in its exact spelling ("Microsoft Excel", "SAP", "Montacargas").
    Ideally it appears in the Skills section and once in context inside a bullet.
  - Include both the acronym and the long form once: "Punto de Venta (POS)", "Customer Relationship Management (CRM)".
  - Never keyword-stuff or add hidden text. Recruiters read the CV after searching, and stuffing reads as dishonest.
- File format: ATS vendors and guides disagree on PDF vs. DOCX. We deliver **both**. Text-based PDF
  is the safe default for email and most portals. DOCX is for portals that ask for Word (some Taleo
  or Workday setups) and for later edits.

---

## 3. Structure and section order

Default order (experienced candidate):
1. Header: name, headline, and one contact line (phone · email · city, country · LinkedIn).
   Local data, if applicable, goes on a second line (§5).
2. Perfil profesional / Summary
3. Habilidades / Skills (grouped: Herramientas · Competencias técnicas · Idiomas)
4. Experiencia laboral / Experience (reverse chronological)
5. Educación / Education
6. Cursos y certificaciones / Certifications
7. Optional: Voluntariado, Logros/Premios
8. Referencias / References (only if `availability.references` ≠ `none`)

Adjust:
- **First job / students** (`target.level = first` or `experience.none`): Summary → Education
  (put this first, with relevant courses and projects) → "Experiencia práctica" (internships,
  family business, informal work, volunteering, projects) → Skills → Courses.
- **Career change**: Summary that explicitly bridges old and new fields → Skills (transferable
  first) → Experience, with bullets re-angled toward transferable results.
- **Senior / lead**: Summary with scope (team size, budget, scale) → Experience first → Skills.
  Two pages are acceptable.
- **Technical / operational roles** (warehouse, driver, maintenance): put licenses, certifications
  and equipment near the top. They are hard filters.

Length (`setup.length`):
- `1`: one page, mandatory.
- `2`: up to two pages. Page 2 must be at least ~1/3 full, or cut back to 1 page.
- `auto`: 1 page for under ~7 years of experience or entry level, 2 pages for more. Never 3+.

Experience depth: last ~10–15 years in detail. Older roles: one line each (title, company, years)
or omit them if irrelevant. Give 3–6 bullets for the most recent or most relevant role and 2–4
for the others.

---

## 4. Writing the content

### Headline
`<Target title> | <Strength 1> | <Strength 2>`, for example:
"Cajera | Atención al cliente | Manejo de efectivo" or
"Administrative Assistant | Scheduling & Records | Bilingual ES/EN".

### Summary (2–4 lines)
Formula: **[Title/identity] with [X years] in [domain/industry]. [Strongest quantified proof].
[What they bring that matches the posting]. [Optional: languages/availability if a hard filter].**
- No "I" or "Yo". Avoid clichés: "proactivo", "trabajador", "responsable", "dinámico",
  "hard-working", "team player", "detail-oriented" unless they come with proof.
- Do not write an "Objetivo profesional" about what the candidate wants. Write what they offer.

### Bullets (the core)
- Use the **XYZ** convention, popularized by Laszlo Bock (Google): *Accomplished [X] as measured
  by [Y], by doing [Z]*. In practice: **Verb + task/scope + result/number**. It is a widely used
  convention, not a validated hiring study.
- Start each bullet with a strong past-tense verb (present tense for the current role). Do not
  repeat the same verb within a role. See `action-verbs.md`.
- Give scale even without "results": clients per day, items per shift, team size, area in m²,
  number of stores or routes, budget, response time, volume per month.
- Turn duties into achievements:
  - Weak: "Encargada de la caja."
  - Strong: "Gestioné la caja de alto flujo (~120 clientes/día) sin faltantes en 4 años."
- One line ideal, two lines max. No period-ending inconsistency: either all bullets end with a period or none.
- Order bullets by relevance to the target role, not chronology.
- **Never invent numbers.** If `achievements` is empty, derive scale from `duties`. If nothing is
  quantifiable, write strong qualitative bullets and add "pedir cifras" to the notes.

### Skills
- Group them: Herramientas / Software, Competencias técnicas, Idiomas (with level), and
  Licencias where relevant. Hard skills only. Soft skills go in Summary and bullets as evidence.
- Language levels: Nativo, Avanzado (C1), Intermedio (B1–B2), Básico (A1–A2). Add the
  certification if present (TOEIC 750). Never inflate. Saying "Inglés avanzado" without basis
  gets exposed in the interview.

### Education
- Highest or most relevant level first. Format: Título — Institución, Ciudad · Año (or "En curso, finaliza 2026").
- Secondary education: list it only if it is the highest level or the candidate is junior.
  Primary education: only if it is the highest level, and phrase it with dignity ("Educación primaria completa").
- Costa Rica specifics: "Bachillerato en Educación Media" is the high school diploma. Do not
  confuse it with "Bachillerato universitario" (bachelor's degree).
  English: "High School Diploma (Bachillerato en Educación Media)".
  INA = Instituto Nacional de Aprendizaje (keep "INA"). CTP = Colegio Técnico Profesional.

### Courses and certifications
Name — Institution (Year)[, hours]. Most relevant first. Group many small courses into one line
when space is tight. Licenses and certifications that the posting requires go first.

### Gaps (`experience.gaps`)
- Gaps of 6+ months: be honest and brief. Options: a one-line entry in Experience
  ("Pausa profesional — cuidado familiar · 2021–2022"), or nothing, if years-only dates cover it
  naturally and the gap is old.
- Studies, freelance work, family business or volunteering during the gap should be listed as
  real entries.

### References (`availability.references`)
- `on_request`: "Referencias disponibles a solicitud." / "References available upon request." This
  is the modern default. It protects the references' data and saves space.
- `include`: Name — relationship, phone. Only for the CR/LatAm markets. For US/CA/Europe, convert
  to "available upon request" and say so in the notes.
- `none`: omit the section.

---

## 5. Market conventions (`setup.market`)

| | Costa Rica (`cr`) | LatAm (`latam`) | US/Canada (`us_ca`) | Europe (`europe`) | Remote intl. (`remote`) |
|---|---|---|---|---|---|
| Paper | Letter | Letter* | Letter | A4 | Letter (A4 if company is EU) |
| Photo | Optional (visual only), common | Optional, common | **Never** | Varies (DE/FR/ES common; UK/IE never). Visual only | Never |
| National ID (cédula) | Optional, 2nd line | Optional | **Never** | Never | Never |
| Nationality | Optional (useful for foreigners re: permits) | Optional | Only work authorization | Work authorization/EU status | Work authorization / timezone |
| Driver license / vehicle | Include if relevant to role | Same | Only if role needs it | Only if role needs it | Omit |
| Date format | MM/YYYY | MM/YYYY | Mon YYYY | MM/YYYY | Mon YYYY |
| Length norm | 1–2 pages | 1–2 | 1 (2 if senior) | 1–2 | 1–2 |

*Letter in Mexico and Central America. Use A4 for South America (Argentina, Chile, Colombia, Peru)
if the posting suggests it.

- Costa Rican sources disagree on whether to include the photo. Some reviewers value it, others
  call personal data unnecessary. Include it only when `includePhoto` is set and the format is
  visual. In the ATS version, never.
- **Work permit** (`contact.workPermit`): when the target country differs from the residence
  country, add "Autorizado/a para trabajar en X" or "Requires visa sponsorship" only if it helps.
  Omit it if the answer is `no` and only mention it in the notes.
- **Remote international**: add timezone / overlap ("Disponible en horario EST") in the header
  second line if it is known from `location` or availability. English level matters a lot, so be precise.

---

## 6. Cover letter (only if `review.coverLetter`)

- 250–400 words, one page, 3–4 short paragraphs. Same header (name and contact) as the CV.
- Structure:
  1. **Hook** (2–3 lines): the role, where they saw it, and one specific reason this company or
     role fits. No "Por medio de la presente…" or "To whom it may concern".
  2. **Proof** (1–2 paragraphs): 2–3 achievements mapped to the 2–3 most important requirements
     of the posting, with numbers. It must add context the CV does not have, not repeat it.
  3. **Close**: availability (start date or modality if relevant), a call to action for the
     interview, and thanks.
- Greeting: use the hiring manager's name if the posting gives it. Otherwise "Estimado equipo de
  Reclutamiento de <Empresa>:" or "Dear <Company> Hiring Team,".
- Date in the local format (ES "17 de noviembre de 2026", EN "November 17, 2026").
- Without a posting: tailor it to `target.role` and `target.company` if given. Otherwise write it
  as a reusable letter, leave the recipient generic, and add a note saying it should be personalized.
- Signature: the full name. Spanish closing: "Atentamente,". English closing: "Sincerely,".

---

## 7. Special cases

- **Low digital literacy or informal answers**: many candidates write very short or colloquial
  answers. Professionalize the language without changing the facts. "Vendía en la feria los
  domingos" becomes "Ventas directas en feria del agricultor: atención al cliente, manejo de
  efectivo y control de inventario (fines de semana, 2019–2021)."
- **Own business or informal work**: legitimate experience. Title it "Emprendedor/a — <Negocio>"
  or "Trabajo independiente".
- **Family business**: list it as real experience, with honest framing ("negocio familiar").
- **Many short jobs**: group them, for example "Varios puestos temporales en comercio (2018–2020)"
  with 2–3 combined bullets.
- **Overqualified for the target**: trim the advanced degrees and senior titles' scope only if
  the user's notes ask for it. Never remove facts on your own initiative. Add a note instead.
- **Typos in names, companies and institutions**: correct obvious capitalization. Ask in the
  notes if you are unsure about spelling.
- **Conflicting info** between the old CV and the form: the form wins. Note the conflict.

---

## 8. Quality checklist (run on every rendered PDF)

Content
- [ ] Headline matches the target role or posting title.
- [ ] Summary has years of experience, the domain, and at least one concrete proof. No clichés.
- [ ] Every role has dates in one consistent format, plus title and company.
- [ ] Each bullet starts with an action verb, no verb repeats within a role, and the most relevant bullet is first.
- [ ] Every number traces back to the candidate's data. Nothing is invented.
- [ ] All must-have keywords from the posting that the candidate honestly has are present.
- [ ] Language levels are honest. Certifications include the year.
- [ ] No age, marital status, religion, salary, or ID/photo where the market forbids them.
- [ ] Spelling and accents are correct (í, ñ, ó…). Spanish uses consistent pronoun-less verbs.

Layout
- [ ] The page count meets the target, and page 2 (if any) is at least ~1/3 full.
- [ ] No orphan section title at the bottom of a page.
- [ ] The visual version only differs in color and photo. The structure stays identical.
- [ ] The file names in `out/` follow `cv_<lang>_<format>.json`.

---

## Sources (consulted November 2026; treat vendor statistics with caution)
- ATS formatting consensus (single column, standard headings, no tables or headers, consistent
  dates). PDF vs. DOCX is disputed:
  [stylingcv](https://stylingcv.com/blog/ats-resume-formatting-guide-2026/),
  [topcv](https://www.topcv.io/blog/how-to-create-ats-friendly-resume-2026),
  [abcdresume](https://www.abcdresume.com/blog/workday-greenhouse-ats-resume-format/),
  [resumeats – Greenhouse](https://resumeats.net/blog/greenhouse-ats-resume-formatting-best-practices),
  [resumeoptimizerpro](https://resumeoptimizerpro.com/blog/how-to-format-resume-for-ats),
  [resumepro](https://www.resumepro.win/guides/optimize-your-resume-for-workday-and-greenhouse-ats)
- Recruiter scan / eye-tracking (TheLadders 2012 & 2018, secondhand):
  [simplify.jobs](https://simplify.jobs/blog/6-second-resume-rule),
  [Business Insider](https://www.businessinsider.in/What-Recruiters-Look-At-In-The-6-Seconds-They-Spend-On-Your-Resume/articleshow/45040460.cms),
  [The Muse](https://www.themuse.com/advice/you-have-6-seconds-to-grab-a-recruiters-attentionheres-how-to-do-it)
- XYZ bullet formula: [Augsburg University careers](https://careers.augsburg.edu/resources/crafting-bullet-points-for-your-resume/)
- Cover letters (length 250–400 words, 3–4 paragraphs, tailored):
  [Built In](https://builtin.com/articles/how-to-write-a-cover-letter),
  [Teal](https://tealhq.com/post/how-long-should-a-cover-letter-be),
  [ResumeHelp](https://www.resumehelp.com/career-blog/how-long-should-a-cover-letter-be)
- Costa Rica practice (references "on request", concise CVs, mixed views on the photo):
  [El Financiero](https://www.elfinancierocr.com/negocios/ef-derriba-cinco-mitos-y-brinda-cuatro-consejos/H6ARIFAG6NG5JA2JTPU2PGFIW4/story/),
  [La República](https://www.larepublica.net/noticia/el-curriculum-ideal-para-llegar-al-siguiente-nivel-miguel-lopez),
  [Observador](https://observador.cr/esta-buscando-empleo-o-una-nueva-oportunidad-laboral-experta-da-5-consejos-para-ser-atractivo-a-los-reclutadores/),
  [Teletica](https://www.teletica.com/amp/otros-temas/las-claves-para-crear-un-curriculo-que-destaque-entre-otros-candidatos_414493)
