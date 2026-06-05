export type Lang = "en" | "es";

export interface T {
  nav: { projects: string; about: string; certifications: string; blog: string; contact: string };
  hero: { available: string; headline1: string; headline2: string; tagline: string; descPre: string; descMid: string; viewProjects: string; downloadCv: string };
  about: { eyebrow: string; background: string; techStack: string; experience: string };
  bio: { p1: string; p2: string; p3Pre: string; p3Post: string; p4: string; factLocation: string; factLocationVal: string; factAvailability: string; factAvailabilityVal: string; factLanguages: string; factLanguagesVal: string; factDegree: string; factDegreeVal: string };
  timeline: { current: string; present: string; more: string };
  projects: { eyebrow: string; title: string; desc: string; privateProject: string; liveDemo: string; active: string; completed: string; inProgress: string };
  contact: { eyebrow: string; title: string; subtitle: string; location: string; locationMid: string };
  form: { name: string; email: string; message: string; messagePlaceholder: string; send: string; sending: string; successTitle: string; successSubtitle: string; sendAnother: string; errorMsg: string };
  certifications: { eyebrow: string; title: string; desc: string; featured: string; total: string };
  blog: { eyebrow: string; title: string; desc: string; empty: string; readArticle: string; medium: string; linkedin: string };
}

export const translations: Record<Lang, T> = {
  en: {
    nav: {
      projects: "Projects",
      about: "About",
      certifications: "Certifications",
      blog: "Blog",
      contact: "Contact",
    },
    hero: {
      available: "Available for remote roles",
      headline1: "Senior Fullstack",
      headline2: "Engineer.",
      tagline: "AI & Security-focused · Building products that scale.",
      descPre: "6+ years designing and shipping enterprise and SaaS applications. Currently at",
      descMid: "working on Privileged Access Management. Based in Costa Rica",
      viewProjects: "View Projects",
      downloadCv: "Download CV",
    },
    about: {
      eyebrow: "About",
      background: "Background",
      techStack: "Tech Stack",
      experience: "Experience",
    },
    bio: {
      p1: "I'm a Full-Stack Software Engineer with 6+ years of experience building enterprise and SaaS applications — from e-commerce mobile apps to ERP systems and AI-powered analytics platforms.",
      p2: "My core stack is React, Node.js, Spring Boot, and AWS, but what drives me is solving real problems at scale: migrating monoliths to microservices, designing cloud-native architectures, and shipping products that people actually use.",
      p3Pre: "Currently at",
      p3Post: ", I work on Privileged Access Management (PAM) — enterprise security software where performance, compliance, and reliability aren't optional. This work has deepened my focus on secure software development and threat modeling.",
      p4: "I'm now actively expanding into AI engineering — building agents, studying LLM integration patterns, and exploring how AI can be applied responsibly in production systems.",
      factLocation: "Location",
      factLocationVal: "Costa Rica",
      factAvailability: "Availability",
      factAvailabilityVal: "Open to remote",
      factLanguages: "Languages",
      factLanguagesVal: "Spanish (native) · English (C1)",
      factDegree: "Degree",
      factDegreeVal: "B.Sc. Computer Engineering",
    },
    timeline: {
      current: "Current",
      present: "Present",
      more: "more",
    },
    projects: {
      eyebrow: "Selected Work",
      title: "Projects",
      desc: "Enterprise applications, AI platforms, SaaS products, and mobile apps built over 6+ years across multiple industries.",
      privateProject: "Private project",
      liveDemo: "Live Demo →",
      active: "Active",
      completed: "Completed",
      inProgress: "In Progress",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's work together.",
      subtitle: "Open to senior/lead remote roles and interesting projects. Send me a message or reach out directly.",
      location: "Based in",
      locationMid: "— available for remote positions worldwide. I typically respond within 24 hours.",
    },
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      messagePlaceholder: "Tell me about your project or opportunity...",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message sent!",
      successSubtitle: "I'll get back to you as soon as possible.",
      sendAnother: "Send another",
      errorMsg: "Something went wrong. Try emailing me directly.",
    },
    certifications: {
      eyebrow: "Credentials",
      title: "Certifications",
      desc: "Academic degrees, professional certifications, and completed courses.",
      featured: "featured",
      total: "total",
    },
    blog: {
      eyebrow: "Writing",
      title: "Blog",
      desc: "Articles and thoughts on software engineering, AI, and building products — published on Medium and LinkedIn.",
      empty: "No posts yet. Check back soon.",
      readArticle: "Read article →",
      medium: "Medium",
      linkedin: "LinkedIn",
    },
  },

  es: {
    nav: {
      projects: "Proyectos",
      about: "Sobre mí",
      certifications: "Certificaciones",
      blog: "Blog",
      contact: "Contacto",
    },
    hero: {
      available: "Disponible para roles remotos",
      headline1: "Ingeniero Fullstack",
      headline2: "Senior.",
      tagline: "Enfocado en IA y Seguridad · Construyendo productos que escalan.",
      descPre: "6+ años diseñando y desarrollando aplicaciones enterprise y SaaS. Actualmente en",
      descMid: "trabajando en Gestión de Acceso Privilegiado. Costa Rica",
      viewProjects: "Ver Proyectos",
      downloadCv: "Descargar CV",
    },
    about: {
      eyebrow: "Sobre mí",
      background: "Perfil",
      techStack: "Stack Tecnológico",
      experience: "Experiencia",
    },
    bio: {
      p1: "Soy un Ingeniero de Software Full-Stack con 6+ años de experiencia construyendo aplicaciones enterprise y SaaS — desde apps móviles de e-commerce hasta sistemas ERP y plataformas de analítica con IA.",
      p2: "Mi stack principal es React, Node.js, Spring Boot y AWS, pero lo que me impulsa es resolver problemas reales a escala: migrar monolitos a microservicios, diseñar arquitecturas cloud-native y lanzar productos que la gente realmente usa.",
      p3Pre: "Actualmente en",
      p3Post: ", trabajo en Gestión de Acceso Privilegiado (PAM) — software de seguridad enterprise donde el rendimiento, el cumplimiento normativo y la confiabilidad no son opcionales. Este trabajo ha profundizado mi enfoque en desarrollo seguro y modelado de amenazas.",
      p4: "Actualmente me estoy expandiendo en ingeniería de IA — construyendo agentes, estudiando patrones de integración de LLMs y explorando cómo aplicar la IA de forma responsable en sistemas productivos.",
      factLocation: "Ubicación",
      factLocationVal: "Costa Rica",
      factAvailability: "Disponibilidad",
      factAvailabilityVal: "Disponible para trabajo remoto",
      factLanguages: "Idiomas",
      factLanguagesVal: "Español (nativo) · Inglés (C1)",
      factDegree: "Título",
      factDegreeVal: "Ing. en Computación",
    },
    timeline: {
      current: "Actual",
      present: "Presente",
      more: "más",
    },
    projects: {
      eyebrow: "Trabajo Selecto",
      title: "Proyectos",
      desc: "Aplicaciones enterprise, plataformas de IA, productos SaaS y apps móviles desarrolladas en 6+ años en múltiples industrias.",
      privateProject: "Proyecto privado",
      liveDemo: "Demo en vivo →",
      active: "Activo",
      completed: "Completado",
      inProgress: "En Progreso",
    },
    contact: {
      eyebrow: "Contacto",
      title: "Trabajemos juntos.",
      subtitle: "Disponible para roles senior/lead remotos y proyectos interesantes. Enviame un mensaje o contactame directamente.",
      location: "Con base en",
      locationMid: "— disponible para posiciones remotas en todo el mundo. Generalmente respondo en menos de 24 horas.",
    },
    form: {
      name: "Nombre",
      email: "Correo electrónico",
      message: "Mensaje",
      messagePlaceholder: "Cuéntame sobre tu proyecto u oportunidad...",
      send: "Enviar mensaje",
      sending: "Enviando...",
      successTitle: "¡Mensaje enviado!",
      successSubtitle: "Te responderé lo antes posible.",
      sendAnother: "Enviar otro",
      errorMsg: "Algo salió mal. Intentá escribirme directamente al correo.",
    },
    certifications: {
      eyebrow: "Credenciales",
      title: "Certificaciones",
      desc: "Títulos académicos, certificaciones profesionales y cursos completados.",
      featured: "destacados",
      total: "en total",
    },
    blog: {
      eyebrow: "Escritura",
      title: "Blog",
      desc: "Artículos y reflexiones sobre ingeniería de software, IA y construcción de productos — publicados en Medium y LinkedIn.",
      empty: "Sin publicaciones aún. Volvé pronto.",
      readArticle: "Leer artículo →",
      medium: "Medium",
      linkedin: "LinkedIn",
    },
  },
};
