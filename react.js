import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Phone,
  Sun,
  Target,
  Trophy,
  Video,
  Youtube,
  Facebook,
} from "lucide-react";

// ==========================
// Helper Components & Utils
// ==========================
const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="scroll-mt-24 py-16 md:py-24">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-6xl px-4"
    >
      {(title || subtitle) && (
        <div className="mb-10">
          {subtitle && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {subtitle}
            </div>
          )}
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </motion.div>
  </section>
);

const NavLink = ({ to, label, onClick }) => (
  <a
    href={`#${to}`}
    onClick={onClick}
    className="text-sm md:text-base px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
  >
    {label}
  </a>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 backdrop-blur">
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={`p-5 md:p-6 ${className}`}>{children}</div>
);

// Smooth scroll for in-page anchors
const useSmoothScroll = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

// Typing effect
const useTyping = (texts, speed = 80, pause = 1200) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setBlink((v) => !v), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  useEffect(() => {
    if (index >= texts.length) setIndex(0);
    const current = texts[index % texts.length];

    if (!deleting && subIndex === current.length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((s) => s + (deleting ? -1 : 1));
    }, deleting ? speed / 1.6 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, texts, speed, pause]);

  return [texts[index % texts.length].substring(0, subIndex), blink];
};

// Dark mode hook
const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' && window.localStorage.getItem('theme')
      ? window.localStorage.getItem('theme')
      : 'light'
  );
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, setTheme };
};

// ==========================
// DATA
// ==========================
const PROFILE = {
  name: "Ridho Robbi Pasi",
  nickname: "Ridho",
  birth: "Sitinjo, Dairi, 24 April 2006",
  age: "19 tahun (2025)",
  status: "Mahasiswa baru D3 Teknik Informatika, Fakultas Vokasi, Universitas Sumatera Utara (USU)",
  location: "Sitinjo, Dairi, Sumatera Utara",
  heroTagline: "Muslim, Mahasiswa, Technopreneur, dan Calon Politisi Muda",
  socials: {
    instagram: "https://instagram.com/ridhopasii",
    instagram2: "https://instagram.com/edunara.academy",
    threads: "https://www.threads.net/@ridhopasii",
    facebook: "https://facebook.com/ridhorobbipasi",
    youtube: "https://www.youtube.com/@RidhoRobbiPasi",
    email: "mailto:ridhopasi@gmail.com",
  },
};

const ABOUT = {
  bio: `Seorang pemuda visioner, lulusan Pesantren Arraudlatul Hasanah Medan. Punya passion di teknologi, bisnis, dan dunia digital-konten. Visi saya: menjadi muslim yang berguna dan dermawan serta membangun perusahaan teknologi internasional. Misi: berkontribusi lewat bisnis dan politik, memajukan daerah, dan berdakwah melalui digital.`,
  roles: [
    "Technopreneur Muda",
    "Digital Creator",
    "Mahasiswa TI (USU)",
    "Calon Politisi",
  ],
  roleModels: ["Nabi Muhammad SAW", "Abdurrahman bin Auf", "Jono Pasi", "Anies Baswedan", "Mark Zuckerberg"],
  timeline: [
    { year: 2006, text: "Lahir di Sitinjo, Dairi" },
    { year: 2025, text: "Lulus Pesantren & mulai D3 TI USU" },
    { year: 2028, text: "Scale bisnis & studi lanjut" },
    { year: 2035, text: "Ekspansi bisnis internasional & politik nasional" },
  ],
};

const SKILLS = {
  hard: [
    { name: "Laravel", level: 75 },
    { name: "HTML", level: 90 },
    { name: "CSS", level: 82 },
    { name: "Figma", level: 85 },
    { name: "Canva", level: 88 },
    { name: "Photoshop", level: 70 },
    { name: "Video Editing", level: 78 },
  ],
  soft: [
    { name: "Leadership", level: 86 },
    { name: "Public Speaking", level: 80 },
    { name: "Growth Mindset", level: 92 },
  ],
  languages: [
    { name: "Indonesia", level: 100 },
    { name: "Inggris", level: 65 },
    { name: "Arab", level: 40 },
  ],
};

const PORTFOLIO = {
  coding: [
    {
      title: "Landing Page Travel Toba",
      desc: "Website sederhana dengan React + Tailwind, fokus pada UX pesanan wisata Danau Toba.",
      link: "#",
    },
    {
      title: "Personal Starter",
      desc: "Starter portfolio statis dengan Vite + Tailwind, performa kilat.",
      link: "#",
    },
  ],
  design: [
    { title: "UI Dashboard Figma", desc: "Dashboard admin modern – sistem kursus.", link: "#" },
    { title: "Poster Dakwah", desc: "Poster Canva bertema motivasi dan akhlak.", link: "#" },
  ],
  content: [
    { title: "@ridhopasii", desc: "Produktivitas, Islami, gaya hidup muslim muda.", link: PROFILE.socials.instagram },
    { title: "@edunara.academy", desc: "Edukasi & pengembangan diri.", link: PROFILE.socials.instagram2 },
    { title: "YouTube & Facebook", desc: "Motivasi dan insight.", link: PROFILE.socials.youtube },
  ],
  activities: [
    {
      title: "Pra-kuliah: Program 13 Minggu",
      desc: "Logika Matematika, Dasar Python, Pengantar TI.",
    },
    { title: "DQLab Project", desc: "Eksplorasi data dan mini project Python/SQL." },
  ],
};

const ROADMAP = [
  {
    year: 2025,
    phase: "Kuliah & Branding",
    bullets: [
      "Bangun personal brand",
      "Konsisten konten (IG/Threads/YouTube)",
      "Organisasi & jejaring USU",
    ],
    progress: 30,
  },
  {
    year: 2028,
    phase: "Scale Bisnis & Studi Lanjut",
    bullets: ["Mafaza Group tahap growth", "Riset market Asia Tenggara", "S2/sertifikasi TI"],
    progress: 60,
  },
  {
    year: 2035,
    phase: "Bisnis Internasional & Politik Nasional",
    bullets: ["Ekspansi global", "Isu publik & kebijakan digital", "Road to DPR RI"],
    progress: 10,
  },
];

const TESTIMONIALS = [
  {
    name: "Jono Pasi",
    role: "Ayah",
    text: "Ridho itu konsisten, mau belajar, dan selalu ingat amanah.",
  },
  {
    name: "Ustadz Pesantren",
    role: "Guru",
    text: "Adabnya baik, semangat dakwah digitalnya kuat.",
  },
  {
    name: "Sahabat Kuliah",
    role: "Teman",
    text: "Anaknya gerak cepat, idenya out of the box, tapi tetap membumi.",
  },
];

const BLOG = [
  {
    title: "3 Sistem Produktivitas buat Mahasiswa Baru",
    tag: "Produktivitas",
    date: "Aug 2025",
    excerpt:
      "Time-blocking, habit tracking, dan weekly review biar kuliah & konten tetap on-track.",
    link: "#",
  },
  {
    title: "Dakwah Digital: Soft Skill Paling Panas Tahun Ini",
    tag: "Dakwah Digital",
    date: "Aug 2025",
    excerpt:
      "Cara jadi bermanfaat tanpa noise: fokus value, adab komentar, dan data.",
    link: "#",
  },
  {
    title: "Toolset Techno-creators 2025",
    tag: "Teknologi",
    date: "Aug 2025",
    excerpt:
      "Stack ringan buat kreator Gen Z: Figma, CapCut, Notion, dan Vite.",
    link: "#",
  },
];

const GALLERY = [
  // Bebas ganti dengan foto asli
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
];

// ==========================
// MAIN APP
// ==========================
export default function App() {
  useSmoothScroll();
  const { theme, setTheme } = useTheme();
  const [typed, blink] = useTyping(
    [
      "Muslim yang bermanfaat",
      "Mahasiswa TI USU",
      "Technopreneur muda",
      "Calon politisi masa depan",
    ],
    60,
    1200
  );

  const skillRadar = useMemo(
    () =>
      SKILLS.hard.map((s) => ({ subject: s.name, A: s.level, fullMark: 100 })),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-200">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-700 to-yellow-500" />
            <span className="font-bold text-slate-900 dark:text-slate-50">Ridho RP</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="about" label="Tentang" />
            <NavLink to="skills" label="Skill" />
            <NavLink to="portfolio" label="Portofolio" />
            <NavLink to="roadmap" label="Roadmap" />
            <NavLink to="blog" label="Blog" />
            <NavLink to="gallery" label="Galeri" />
            <NavLink to="contact" label="Kontak" />
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/Ridho_Robbi_Pasi_CV.pdf"
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/80"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(29,78,216,0.20),transparent_60%)]" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-2 md:order-1"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              {PROFILE.name}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {PROFILE.heroTagline}
            </p>
            <div className="mt-6 text-lg font-semibold text-slate-900 dark:text-slate-50">
              <span className="opacity-70">Saya adalah </span>
              <span className="bg-gradient-to-r from-blue-700 to-yellow-500 bg-clip-text text-transparent">
                {typed}
              </span>
              <span className={`ml-1 inline-block w-1 ${blink ? "opacity-100" : "opacity-0"} bg-slate-900 dark:bg-white`}>
                &nbsp;
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-yellow-500 px-4 py-2 font-semibold text-white shadow hover:opacity-95"
              >
                Ayo Kolaborasi <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/Ridho_Robbi_Pasi_CV.pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white px-4 py-2 font-medium hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/80"
              >
                <Download className="h-4 w-4" /> CV PDF
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Pill><MapPin className="h-3 w-3" /> {PROFILE.location}</Pill>
              <Pill><GraduationCap className="h-3 w-3" /> {PROFILE.status}</Pill>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 md:order-2"
          >
            <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-700 to-yellow-500 blur-2xl opacity-30" />
              <img
                alt="Ridho photo placeholder"
                src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop"
                className="relative h-full w-full rounded-[2rem] object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <Section id="about" subtitle="Tentang Saya" title="Profil Singkat & Timeline">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardBody>
              <h3 className="mb-3 text-xl font-bold">Halo, saya {PROFILE.nickname} 👋</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {ABOUT.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ABOUT.roles.map((r) => (
                  <Pill key={r}><BadgeCheck className="h-3 w-3" /> {r}</Pill>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold">Nama:</span> {PROFILE.name}</div>
                  <div><span className="font-semibold">Panggilan:</span> {PROFILE.nickname}</div>
                  <div><span className="font-semibold">TTL:</span> {PROFILE.birth}</div>
                  <div><span className="font-semibold">Usia:</span> {PROFILE.age}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold">Status:</span> {PROFILE.status}</div>
                  <div><span className="font-semibold">Domisili:</span> {PROFILE.location}</div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Role Model</h4>
              <ul className="space-y-2 text-sm">
                {ABOUT.roleModels.map((m) => (
                  <li key={m} className="flex items-center gap-2"><StarIcon /> {m}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Timeline Hidup</h4>
              <ol className="relative ml-3 border-l border-slate-200 dark:border-white/10">
                {ABOUT.timeline.map((t) => (
                  <li key={t.year} className="mb-6 ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-blue-600" />
                    <div className="font-semibold">{t.year}</div>
                    <div className="text-slate-600 dark:text-slate-300">{t.text}</div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Visi & Misi</h4>
              <ul className="grid gap-3 text-sm">
                <li className="flex items-center gap-2"><Target className="h-4 w-4" /> Visi: Muslim yang berguna, dermawan, membangun perusahaan teknologi internasional.</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Misi: Berkontribusi lewat bisnis & politik, memajukan daerah, dakwah digital.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ===== SKILLS ===== */}
      <Section id="skills" subtitle="Skill & Kompetensi" title="Hard, Soft, dan Bahasa">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Hard Skill (Radar)</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <RadarChart data={skillRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Hard Skill" dataKey="A" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Bahasa (Bar)</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <BarChart data={SKILLS.languages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="level" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Detail Hard Skill</h4>
              <div className="grid gap-3">
                {SKILLS.hard.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex items-center justify-between text-sm"><span>{s.name}</span><span className="opacity-70">{s.level}%</span></div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-700 to-yellow-500" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Soft Skill</h4>
              <div className="grid gap-3">
                {SKILLS.soft.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex items-center justify-between text-sm"><span>{s.name}</span><span className="opacity-70">{s.level}%</span></div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-700 to-yellow-500" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ===== PORTFOLIO ===== */}
      <Section id="portfolio" subtitle="Portofolio" title="Project Coding, Desain, & Konten">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardBody>
              <h4 className="mb-2 font-semibold">Project Coding</h4>
              <ul className="space-y-3 text-sm">
                {PORTFOLIO.coding.map((p) => (
                  <li key={p.title} className="rounded-xl border border-slate-200 dark:border-white/10 p-3">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-slate-600 dark:text-slate-300">{p.desc}</div>
                    <a href={p.link} className="mt-2 inline-flex items-center gap-1 text-blue-700 dark:text-blue-400">
                      Demo <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-2 font-semibold">Desain</h4>
              <ul className="space-y-3 text-sm">
                {PORTFOLIO.design.map((p) => (
                  <li key={p.title} className="rounded-xl border border-slate-200 dark:border-white/10 p-3">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-slate-600 dark:text-slate-300">{p.desc}</div>
                    <a href={p.link} className="mt-2 inline-flex items-center gap-1 text-blue-700 dark:text-blue-400">
                      Lihat <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-2 font-semibold">Konten Digital</h4>
              <ul className="space-y-3 text-sm">
                {PORTFOLIO.content.map((p) => (
                  <li key={p.title} className="rounded-xl border border-slate-200 dark:border-white/10 p-3">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-slate-600 dark:text-slate-300">{p.desc}</div>
                    <a href={p.link} className="mt-2 inline-flex items-center gap-1 text-blue-700 dark:text-blue-400">
                      Kunjungi <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
        <Card className="mt-6">
          <CardBody>
            <h4 className="mb-2 font-semibold">Aktivitas & Karya Pra-Kuliah</h4>
            <ul className="grid gap-3 md:grid-cols-2">
              {PORTFOLIO.activities.map((a) => (
                <li key={a.title} className="rounded-xl border border-slate-200 dark:border-white/10 p-3">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-slate-600 dark:text-slate-300">{a.desc}</div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </Section>

      {/* ===== ROADMAP ===== */}
      <Section id="roadmap" subtitle="Cita-cita & Roadmap" title="Langkah Strategis ke Depan">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Roadmap Karier</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <LineChart data={ROADMAP}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Detail Tahapan</h4>
              <ol className="relative ml-3 border-l border-slate-200 dark:border-white/10">
                {ROADMAP.map((r) => (
                  <li key={r.year} className="mb-6 ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{r.year} — {r.phase}</div>
                        <ul className="mt-1 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                          {r.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <span className="rounded-lg bg-yellow-500/10 px-2 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-400">{r.progress}%</span>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ===== BLOG ===== */}
      <Section id="blog" subtitle="Blog / Insight" title="Tulisan Terbaru">
        <div className="grid gap-6 md:grid-cols-3">
          {BLOG.map((p) => (
            <Card key={p.title}>
              <CardBody>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-blue-600/10 px-2 py-1 font-semibold text-blue-700 dark:text-blue-400">{p.tag}</span>
                  <span className="opacity-70">{p.date}</span>
                </div>
                <h4 className="text-lg font-bold">{p.title}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</p>
                <a href={p.link} className="mt-4 inline-flex items-center gap-1 text-blue-700 dark:text-blue-400">
                  Baca selengkapnya <ExternalLink className="h-3 w-3" />
                </a>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== GALLERY ===== */}
      <Section id="gallery" subtitle="Galeri" title="Foto Kegiatan, Desain, & Konten">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {GALLERY.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`gallery-${i}`}
              className="aspect-video w-full rounded-2xl object-cover shadow"
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section id="testimoni" subtitle="Testimoni" title="Kata Mereka">
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-yellow-500" />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs opacity-70">{t.role}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">“{t.text}”</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <Section id="contact" subtitle="Kontak" title="Mari Kolaborasi">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Hubungi Ridho</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Terima kasih! Pesanmu sudah dikirim (dummy). Ganti action form ke Formspree / backend kamu.");
                }}
                className="grid gap-4"
              >
                <input required placeholder="Nama" className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2" />
                <input required type="email" placeholder="Email" className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2" />
                <textarea required rows={4} placeholder="Pesan" className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 px-4 py-2" />
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-yellow-500 px-4 py-2 font-semibold text-white shadow hover:opacity-95">
                  Kirim <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h4 className="mb-4 font-semibold">Sosial Media & Link</h4>
              <ul className="grid gap-3 text-sm">
                <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.instagram}>@ridhopasii</a></li>
                <li className="flex items-center gap-2"><Instagram className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.instagram2}>@edunara.academy</a></li>
                <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.threads}>Threads @ridhopasii</a></li>
                <li className="flex items-center gap-2"><Facebook className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.facebook}>Facebook</a></li>
                <li className="flex items-center gap-2"><Youtube className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.youtube}>YouTube</a></li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a className="hover:underline" href={PROFILE.socials.email}>ridhopasi@gmail.com</a></li>
              </ul>
              <div className="mt-6 text-xs opacity-70">
                *Butuh versi cepat? DM Instagram aja. Janji balasnya nggak ghosting 😄
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              © {new Date().getFullYear()} {PROFILE.name}. All rights reserved. Built with React & Tailwind.
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill><Trophy className="h-3 w-3" /> Mafaza Group — Coming Soon</Pill>
              <Pill><Target className="h-3 w-3" /> Road to DPR RI</Pill>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================
// Icons (tiny helpers)
// ==========================
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-500" fill="currentColor" aria-hidden>
      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.263L12 19.771l-7.417 4.088L6 15.596 0 9.748l8.332-1.73z" />
    </svg>
  );
}
