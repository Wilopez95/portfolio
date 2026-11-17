# Document JSON consumed by `scripts/render.mjs`

Each file `.cv-work/<id>/out/<kind>_<lang>_<format>.json` becomes a `.pdf` and a `.docx` with the
same name. The `//` comments below are explanations only, so real files must be plain JSON.
Inline `**bold**` is the only markup supported, and only inside text, bullets and list
items. Use it sparingly, at most one emphasis per bullet, and only for a key number.

## CV

```json
{
  "kind": "cv",
  "lang": "es",                       // "es" | "en"
  "format": "ats",                    // "ats" | "visual"
  "paper": "letter",                  // "letter" | "a4"   (see hr-playbook §5)
  "density": "normal",                // "normal" | "compact"  (compact = smaller margins/font; last resort)
  "accent": "#1F3A5F",                // visual only; dark, print-safe color (navy, teal, wine, slate)
  "photo": "photo.jpg",               // visual only; JPG/PNG path relative to this JSON; omit otherwise
  "name": "María Fernanda Rojas Solís",
  "headline": "Cajera | Atención al cliente | Manejo de efectivo",
  "contact": ["+506 8888 8888", "maria.rojas@gmail.com", "Limón, Costa Rica", "linkedin.com/in/mariarojas"],
  "personal": [["Cédula", "7-0123-0456"], ["Licencia", "B1"]],   // optional 2nd line; market rules apply
  "sections": [
    { "type": "text", "title": "Perfil profesional", "text": "Cajera con 4 años de experiencia…" },
    { "type": "groups", "title": "Habilidades", "groups": [
      { "label": "Herramientas", "items": ["Punto de Venta (POS)", "Microsoft Excel"] },
      { "label": "Idiomas", "items": ["Español (nativo)", "Inglés (intermedio, B1)"] }
    ]},
    { "type": "entries", "title": "Experiencia laboral", "items": [
      { "title": "Cajera", "org": "Supermercado La Esquina", "location": "Limón, Costa Rica",
        "dates": "03/2020 – Actual",
        "bullets": ["Atendí ~**120 clientes diarios** sin faltantes de caja en 4 años.", "…"] }
    ]},
    { "type": "entries", "title": "Educación", "items": [
      { "title": "Bachillerato en Educación Media", "org": "Liceo de Limón", "dates": "2017" }
    ]},
    { "type": "list", "title": "Cursos y certificaciones", "items": ["Manipulación de alimentos — INA (2022)"] },
    { "type": "text", "title": "Referencias", "text": "Disponibles a solicitud." }
  ]
}
```

Section types:
- `text`: `text` is a string or an array of paragraphs.
- `groups`: labelled comma-separated lists (`label: a, b, c`).
- `entries`: `title` (bold, left), `dates` (right), `org` + `location` (second line), optional
  `text` paragraph, and optional `bullets`.
- `list`: simple bullets.

Rules the renderer enforces: an `ats` document must not have a `photo`, and `kind`, `lang`,
`format` and `name` are required.

## Cover letter

```json
{
  "kind": "cover_letter",
  "lang": "es",
  "format": "ats",
  "paper": "letter",
  "name": "María Fernanda Rojas Solís",
  "headline": "Cajera",                               // optional
  "contact": ["+506 8888 8888", "maria.rojas@gmail.com", "Limón, Costa Rica"],
  "date": "17 de noviembre de 2026",
  "recipient": ["Equipo de Reclutamiento", "Supermercados Ejemplo S.A.", "San José, Costa Rica"],
  "greeting": "Estimado equipo de Reclutamiento de Supermercados Ejemplo:",
  "paragraphs": ["…hook…", "…proof…", "…proof/fit…", "…close…"],
  "closing": "Atentamente,",
  "signature": "María Fernanda Rojas Solís"
}
```

## Accent palette for the visual format (pick one that suits the industry)
- Navy `#1F3A5F`: corporate, finance, administration
- Teal `#1F5F5B`: health, services, retail
- Wine `#6B2737`: hospitality, sales
- Slate `#334155`: technology, logistics, operations
- Forest `#2F5233`: agriculture, environment, tourism
