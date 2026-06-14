// src/data/portfolio.ts

export const portfolio = {
  name: "Ayush Kumar",
  title: "Full-Stack Developer",
  location: "India",
  email: "ayushkumar.2024ug1009@iiitranchi.ac.in",
  github: "https://github.com/BladeRunner-KD6-37",
  linkedin: "https://www.linkedin.com/in/ayush-kumar-991b92324/",

  skills: {
    Languages:  ["JavaScript", "TypeScript", "Python", "C++", "C", "Latex","Markdown"],
    // Frontend:   ["React", "Next.js", "Tailwind CSS", "HTML", "SHADCN/UI"],
    // Backend:    ["Node.js", "RESTAPI", "MySql","PostgreSQL", "NODEMON", "ZOD"],
    // Tools:      ["Git", "Docker", "Linux" "Nodemon"],
    Hosting: ["Render", "Vercel", "Netlify", "AWS"],
    PackageManager: ["Bun", "npm"],
    Frameworks: ["Next.js", "Tailwind CSS", "Express"],
    Library : ["SHADCN/UI", "React.js", "Zod"],
    

  },

  projects: [
    {
      name: "TermFolio",
      description: "Terminal-style portfolio website",
      tech: "Next.js / Tailwind",
      link: "https://github.com/you/termfolio",
    },
    {
      name: "PyTasker",
      description: "CLI task manager in Python",
      tech: "Python / SQLite",
      link: "https://github.com/you/pytasker",
    },
  ],

  experience: [
    {
      role: "Software Engineer Intern",
      company: "Acme Corp",
      period: "2024 – present",
      description: "Built internal tooling with React + FastAPI",
    },
  ],

  education: [
    {
      degree: "B.Tech Computer Science",
      school: "Your University",
      year: "2021 – 2025",
    },
  ],
};