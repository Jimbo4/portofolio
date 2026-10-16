import type { Pillar, Tool } from "@/types";

/**
 * Single source of personal data for the site.
 * Content mirrors cv_master.md — update both together.
 */
export const profile = {
  name: "Jacopo Marcolini",
  roles: ["Deployment Strategist", "Product Design Lead"],
  description:
    "Jacopo Marcolini — Deployment Strategist and Product Design Lead based in Milan. 7+ years across product design, team leadership and generative AI adoption for clients like Mastercard, Leonardo and BPER.",
  email: "jacopomma@gmail.com",
  linkedin: "https://www.linkedin.com/in/jacopo-marcolini",
  github: "https://github.com/Jimbo4",
  location: { city: "Milan", country: "IT", label: "Milan, Italy" },
  siteUrl: "https://jacopomarcolini.com",
  yearsOfExperience: "7+",
} as const;

export const navLinks = [
  { label: "Philosophy", href: "/#philosophy" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;

/** The four pillars drive Philosophy, Skills and the case study grouping. */
export const pillars: Pillar[] = [
  {
    id: "design",
    title: "Product Design",
    description:
      "From discovery to shipped UI. User research, prototyping and design systems, with enough code to build what I design.",
    tagline: "Research, interface craft and design systems, from first interview to production.",
    skills: [
      "UX Research",
      "User Interviews",
      "Usability Testing",
      "Information Architecture",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Mobile App Design",
      "Data Visualization",
      "Brand Identity",
      "Design Thinking",
      "React & TypeScript",
    ],
  },
  {
    id: "lead",
    title: "Team Leadership",
    description:
      "Leading teams of 10 and growing R&D from 3 to 30 people. Roadmaps, budgets up to ~1M EUR and quality standards from kickoff to launch.",
    tagline: "Teams, roadmaps and delivery: programs that ship on time and on budget.",
    skills: [
      "Multidisciplinary Teams",
      "Hiring & Interviewing",
      "Team Scaling",
      "Coaching & Mentoring",
      "Product Management",
      "Roadmapping",
      "Agile & Scrum",
      "Budgeting",
      "Effort Estimation",
      "Stakeholder Management",
      "North Star Metrics",
    ],
  },
  {
    id: "ai",
    title: "AI Enablement",
    description:
      "Turning generative AI into real adoption. 400+ hours of training for 600+ people on LLMs, agents and automation, plus the change management that makes it stick.",
    tagline: "Generative AI workflows, agents and the training that turns them into adoption.",
    skills: [
      "Generative AI Workflows",
      "LLMs",
      "AI Agents",
      "MCP",
      "Prompt Engineering",
      "Context Engineering",
      "Workflow Automation",
      "AI Content Pipelines",
      "Training & Workshops",
      "Reskilling & Upskilling",
      "Change Management",
    ],
  },
  {
    id: "grow",
    title: "Business & Growth",
    description:
      "Connecting product with business. Presales and solution design for clients like Mastercard and Leonardo, and go-to-market for my own startup, Matcha.",
    tagline: "Presales, solution design and go-to-market, where product meets revenue.",
    skills: [
      "Technical Presales",
      "Solution Design",
      "Business Development",
      "Negotiation",
      "Product Strategy",
      "Go-to-Market",
      "Partnership Development",
      "B2B Sales",
      "Growth Marketing",
      "Content Strategy",
      "Brand Positioning",
      "A/B Testing",
    ],
  },
];

/**
 * Tools marquee — a visual digest of tools already listed in the skills pool.
 * Tile classes are literal strings so Tailwind can pick them up.
 */
export const tools: Tool[] = [
  { name: "Figma", icon: "siFigma", tileClass: "bg-[#0B0B0B] fill-[#F24E1E]" },
  { name: "Adobe Photoshop", icon: "photoshop", tileClass: "bg-[#001E36] fill-[#31A8FF]" },
  { name: "React", icon: "siReact", tileClass: "bg-[#20232A] fill-[#61DAFB]" },
  { name: "TypeScript", icon: "siTypescript", tileClass: "bg-[#3178C6] fill-white" },
  { name: "Tailwind CSS", icon: "siTailwindcss", tileClass: "bg-[#0F172A] fill-[#38BDF8]" },
  { name: "Angular", icon: "siAngular", tileClass: "bg-[#C3002F] fill-white" },
  { name: "Flutter", icon: "siFlutter", tileClass: "bg-[#02569B] fill-white" },
  { name: "Node.js", icon: "siNodedotjs", tileClass: "bg-[#1F2A1B] fill-[#5FA04E]" },
  { name: "Python", icon: "siPython", tileClass: "bg-[#3776AB] fill-[#FFD43B]" },
  { name: "MongoDB", icon: "siMongodb", tileClass: "bg-[#001E2B] fill-[#47A248]" },
  { name: "PostgreSQL", icon: "siPostgresql", tileClass: "bg-[#4169E1] fill-white" },
  { name: "GitHub", icon: "siGithub", tileClass: "bg-[#181717] fill-white" },
  { name: "GitLab", icon: "siGitlab", tileClass: "bg-[#171321] fill-[#FC6D26]" },
  { name: "Vercel", icon: "siVercel", tileClass: "bg-black fill-white" },
  { name: "Jira", icon: "siJira", tileClass: "bg-[#0052CC] fill-white" },
  { name: "Confluence", icon: "siConfluence", tileClass: "bg-[#172B4D] fill-white" },
  { name: "Notion", icon: "siNotion", tileClass: "bg-[#F5F1E8] fill-[#1A1A18]" },
  { name: "Trello", icon: "siTrello", tileClass: "bg-[#0052CC] fill-white" },
  { name: "Mural", icon: "siMural", tileClass: "bg-[#FF4B4B] fill-white" },
  { name: "Google Analytics", icon: "siGoogleanalytics", tileClass: "bg-[#E37400] fill-white" },
  { name: "PyTorch", icon: "siPytorch", tileClass: "bg-[#EE4C2C] fill-white" },
  { name: "Claude", icon: "siClaude", tileClass: "bg-[#D97757] fill-white" },
  { name: "ChatGPT", icon: "openai", tileClass: "bg-[#0F0F0F] fill-white" },
  { name: "Gemini", icon: "siGooglegemini", tileClass: "bg-[#1F1B2E] fill-[#8E75B2]" },
  { name: "GitHub Copilot", icon: "siGithubcopilot", tileClass: "bg-[#5E2BE6] fill-white" },
  { name: "n8n", icon: "siN8n", tileClass: "bg-[#EA4B71] fill-white" },
  { name: "Lovable", icon: "lovable", tileClass: "bg-gradient-to-br from-[#FF1F8F] to-[#FF6A1F] fill-white" },
  { name: "Instagram", icon: "siInstagram", tileClass: "bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] fill-white" },
];
