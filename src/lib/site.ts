export const site = {
  name: "GDG SKASC",
  short: "GDG on Campus · SKASC",
  formalName: "GDG on Campus Sri Krishna Arts & Science College - Coimbatore, India",
  college: "Sri Krishna Arts & Science College, Coimbatore",
  tagline: "Google Developer Groups on Campus",
  headline: "Big ideas start with curious minds.",
  memberCount: 2672,
  website: "https://gdg-skasc.vercel.app/",
  address: [
    "Sri Krishna Arts and Science College,",
    "Sugunapuram, Kuniamuthur P.O.,",
    "Coimbatore, Tamil Nadu 641008",
    "India",
  ],
  links: {
    community:
      "https://gdg.community.dev/gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india/",
    linkedin: "https://www.linkedin.com/company/google-developers-students-club-skasc",
    college: "https://skasc.ac.in/",
    join: "https://gdg.community.dev/gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india/",
  },
}

export const about = {
  title: "About",
  eyebrow: "GDG on Campus | Sri Krishna Arts & Science College, Coimbatore",
  body: "We're a community of students exploring what technology can do, experimenting with what's next, and turning ideas into real experiences. Through hands-on learning, collaborative building, and shared discovery, we create space to question, innovate, and grow beyond the classroom.",
  practiceTitle: "What do we do?",
  practice:
    "The future isn't just something we learn about. It's something we build. At SKASC we run study jams, tech talks, TechSprint, Solution Challenge tracks, and campus inaugurations so curious minds can ship real work together.",
}

export const teach = {
  title: "What we teach in workshops",
  points: [
    "Hands-on learning through workshops, codelabs, and study jams.",
    "Collaborative building on real projects and challenge tracks.",
    "Shared discovery that helps students grow beyond the classroom.",
  ],
  note: "Google Developer Groups on Campus recognizes this chapter. Students at SKASC run the sessions.",
}

export const domains = [
  {
    id: "technical",
    name: "Technical",
    tone: "blue" as const,
    summary:
      "Study jams, app and web workshops, cloud labs, and build tracks like Solution Challenge and TechSprint.",
    focus: ["Web & app builds", "Cloud labs", "AI & automation tracks", "Hackathons"],
    people: [
      "Abdul Munaf — Technical Lead",
      "Niranjan J — Full Stack & Android",
      "Shreemathi R — AI & Emerging Tech",
      "Sree Lakshmi A — Automation & RPA",
      "Surjune R S — Cloud & Cybersecurity",
    ],
  },
  {
    id: "relations",
    name: "Corporate and Public Relations",
    tone: "red" as const,
    summary:
      "Speakers, partnerships, registrations, and the notes that go out before a session fills up.",
    focus: ["Outreach", "Speaker invites", "Registrations", "Campus partnerships"],
    people: [
      "Nithiesh — Public Operations & Outreach",
      "Lethika C — Social Media",
      "Suvarnalatha Sivaramakrishnan — Event Operations",
      "Rupika V — Woman in Tech",
    ],
  },
  {
    id: "creatives",
    name: "Creatives and Photography",
    tone: "yellow" as const,
    summary:
      "Posters, reels, recap photos, and the look of every workshop the chapter puts on campus.",
    focus: ["Posters & reels", "Event photography", "Brand look", "Stage visuals"],
    people: [
      "Dharsitha — UI/UX & Creative Design",
      "Sukhee Sakthivel G M — Design & Creative Head",
      "Mohammed Abbas Ali Baig Z — Media Team Head",
    ],
  },
]

export const upcomingEvent = {
  title: "INITIATE | GDG on Campus SKASC Inauguration 2026–27",
  tag: "Upcoming",
  date: "23 Nov 2026",
  status: "Free registration",
  blurb:
    'Kick off the 2026–27 year with INITIATE. Discover new ideas, experiments, and collaborations. Meet the team and explore opportunities to get involved and create something amazing together.',
  href: "https://gdg.community.dev/events/details/google-gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india-presents-initiate-gdg-on-campus-skasc-inauguration-2026-27/",
  action: "View details",
}

export const events = [
  {
    title: "Google Study Jam Swags Distribution",
    tag: "Cloud",
    date: "9 Jun 2026",
    icon: "cloud" as const,
    tone: "blue" as const,
    blurb: "Swag distribution for students who finished the Google Study Jam path.",
    href: "https://gdg.community.dev/events/details/google-gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india-presents-google-study-jam-swags-distribution/",
    action: "Event page",
  },
  {
    title: "Solution Challenge 2026 Kickoff: Build with AI",
    tag: "Build with AI",
    date: "5 Apr 2026",
    icon: "ai" as const,
    tone: "yellow" as const,
    blurb:
      "How to form a team, pick a problem, and build with Google technologies and AI for Solution Challenge 2026.",
    href: "https://gdg.community.dev/events/details/google-gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india-presents-solution-challenge-2026-kickoff-build-with-ai-gdg-on-campus/",
    action: "Event page",
  },
  {
    title: "GDG TechSprint 2025: Top 10 Teams Announcement",
    tag: "Hackathon",
    date: "11 Jan 2026",
    icon: "sprint" as const,
    tone: "red" as const,
    blurb: "Announcement of the top 10 teams from GDG TechSprint 2025.",
    href: "https://gdg.community.dev/events/details/google-gdg-on-campus-sri-krishna-arts-science-college-coimbatore-india-presents-gdg-techsprint-2025-top-10-teams-announcement/",
    action: "Event page",
  },
  {
    title: "TechSprint Session #2 – Tech Talk & Project Submission Guidance",
    tag: "Tech Talk",
    date: "30 Dec 2025",
    icon: "code" as const,
    tone: "green" as const,
    blurb: "Tech talk and project-submission guidance for TechSprint teams.",
    href: site.links.community,
    action: "Chapter page",
  },
]

export const teamIntro =
  "Big ideas start with curious minds. GDG on Campus at Sri Krishna Arts & Science College is a community of students exploring what technology can do, experimenting with what's next, and turning ideas into real experiences."

const leadTones = ["blue", "red", "yellow", "green"] as const

function initialsFrom(name: string) {
  const parts = name
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function withCardStyle<T extends { name: string; role: string; photo?: string }>(
  people: readonly T[],
) {
  return people.map((person, index) => ({
    name: person.name,
    role: person.role,
    photo: person.photo,
    initials: initialsFrom(person.name),
    tone: leadTones[index % leadTones.length],
  }))
}

/** Official chapter organizers from gdg.community.dev, plus campus heads. */
const organiserList = [
  { name: "Prathiksha J", role: "GDGoC Organizer", photo: "/team/prathiksha-j.jpg" },
  { name: "Pragathi P", role: "GDGoC Organizer", photo: "/team/pragathi-p.jpg" },
  { name: "Likhith Sai N", role: "GDGoC Organizer", photo: "/team/likhith-sai-n.jpg" },
  { name: "Sanjana S S", role: "Co-Lead", photo: "/team/sanjana-s-s.jpg" },
  { name: "Abdul Munaf", role: "Technical Lead", photo: "/team/abdul-munaf.jpg" },
] as const

const leadList = [
  { name: "Dharsitha", role: "UI/UX & Creative Design Lead", photo: "/team/dharsitha.jpg" },
  { name: "Lethika C", role: "Social Media Manager", photo: "/team/lethika-c.jpg" },
  {
    name: "Mohammed Abbas Ali Baig Z",
    role: "Media Team Head",
    photo: "/team/mohammed-abbas.jpg",
  },
  {
    name: "Niranjan J",
    role: "Full Stack & Android Development Lead",
    photo: "/team/niranjan-j.jpg",
  },
  { name: "Nithiesh", role: "Public Operations & Outreach Lead", photo: "/team/nithiesh.jpg" },
  { name: "Rupika V", role: "Woman in Tech Lead", photo: "/team/rupika-v.jpg" },
  {
    name: "Shreemathi R",
    role: "AI & Emerging Technologies Lead",
    photo: "/team/shreemathi-r.jpg",
  },
  { name: "Sree Lakshmi A", role: "Automation and RPA Lead", photo: "/team/sree-lakshmi-a.jpg" },
  {
    name: "Sukhee Sakthivel G M",
    role: "Design & Creative Head",
    photo: "/team/sukhee-sakthivel.jpg",
  },
  { name: "Surjune R S", role: "Cloud & Cybersecurity Lead", photo: "/team/surjune-r-s.jpg" },
  {
    name: "Suvarnalatha Sivaramakrishnan",
    role: "Event Management & Operations Head",
    photo: "/team/suvarnalatha.jpg",
  },
] as const

export const organisers = withCardStyle(organiserList)
export const members = withCardStyle(leadList)
