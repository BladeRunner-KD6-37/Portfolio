// src/data/portfolio.ts

export const portfolio = {
  name: "Ayush Kumar",
  title: "Full-Stack Developer",
  location: "India",
  email: "ayushkumar.2024ug1009@iiitranchi.ac.in",
  github: "https://github.com/BladeRunner-KD6-37",
  linkedin: "https://www.linkedin.com/in/ayush-kumar-991b92324/",
  bio: [
    "I'm Ayush Kumar, a second-year B.Tech student at the Indian Institute of Information Technology, Ranchi, with a strong passion for web development and problem solving. I enjoy building clean, functional, and impactful digital experiences — from crafting intuitive frontends to engineering robust backend systems.",
    "I'm currently seeking internship opportunities where I can apply my skills in a real-world environment, contribute meaningfully to a team, and continue growing as a developer. I thrive on challenges that push me to think critically and write better code.",
    "If you're looking for a motivated developer who brings curiosity, dedication, and a willingness to learn — let's connect."
  ],

  skills: {
    Languages:  ["JavaScript", "TypeScript", "Python", "C++", "C", "Latex","Markdown"],
    // Frontend:   ["React", "Next.js", "Tailwind CSS", "HTML", "SHADCN/UI"],
    // Backend:    ["Node.js", "RESTAPI", "MySql","PostgreSQL", "NODEMON", "ZOD"],
    Hosting: ["Render", "Vercel", "Netlify", "AWS"],
    PackageManager: ["Bun", "npm"],
    Frameworks: ["Next.js", "Tailwind CSS", "Express"],
    Library : ["SHADCN/UI", "React.js", "Zod"],
    Tools:      ["Git", "Github","Github Copilot", "Linux", "Postman", "Canva"]
  },

  projects: [
    {
      name: "Meta Runtime",
      description: "creates app from JSON config",
      tech: "TypeScript / Node.js / Next.js / React / Express.js / Prisma / PostgreSQL (Neon) / Redis / Tailwind CSS / Radix UI / Lucide React / TanStack Query / Zustand / Zod / JWT Authentication / bcryptjs / WebSockets / Nodemailer / dotenv / CORS / ESLint",
      link: "https://ai-app-generator-imx0az19h-highoncaffienes-projects.vercel.app/",
    },
    {
      name: "AI Invoice App",
      description: "AI powered Invoice Generator",
      tech: "React/Node.js/Express.js/MongoDB/TailwindCSS/Clerk/Gemini API",
      link: "https://a-invoice-shen-e18izup1q-highoncaffienes-projects.vercel.app/",
    },
    {
      name: "K72",
      description: "AI powered Invoice Generator",
      tech: "React/GSAP/TailwindCSS",
      link: "https://k72-omega-ashy.vercel.app/",
    },
  ],

  resume: "https://www.linkedin.com/in/ayush-kumar-991b92324/",

  // experience: [
  //   {
  //     role: "Software Engineer Intern",
  //     company: "Acme Corp",
  //     period: "2024 – present",
  //     description: "Built internal tooling with React + FastAPI",
  //   },
  // ],

  education: [
    {
      degree: "Bachelor of Technology in Computer Science and Engineering",
      college: "Indian Insitute of Information Technology Ranchi",
      year: "2024 – 2028",
    },
  ],
};