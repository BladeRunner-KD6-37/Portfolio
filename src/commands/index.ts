// src/commands/index.ts
import { portfolio } from "@/data/portfolio";

export type CommandOutput = {
  lines: { text: string; color?: string }[];
};

export const commands: Record<string, () => CommandOutput> = {
  "help": () => ({
    lines: [
      { text: "" },
      { text: "Available commands:", color: "green" },
      { text: "" },
      { text: "about        — Who I am",           color: "cyan" },
      { text: "skills       — My tech stack",       color: "cyan" },
      { text: "projects     — Things I've built",   color: "cyan" },
      // { text: "experience   — Work history",        color: "cyan" },
      { text: "education    — Academic background", color: "cyan" },
      { text: "contact      — Get in touch",        color: "cyan" },
      { text: "resume       — View my resume",      color: "cyan" },
      { text: "run <lang>   — Execute JavaScript code", color: "cyan" },
      { text: "clear        — Clear the terminal",  color: "cyan" },
      { text: "" },
      { text: "↑↓ arrow keys navigate history • Tab autocompletes", color: "dim" },
      { text: "" },
    ],
  }),

  "about": () => ({
    lines: [
      { text: "" },
      { text: portfolio.bio[0] },
      { text: "" },
      { text: portfolio.bio[1] },
      { text: "" },
      { text: portfolio.bio[2] },
      { text: "" },
    ],
  }),

  "skills": () => {
    const lines: CommandOutput["lines"] = [{ text: "" }, { text: "Skills", color: "green" }, { text: "" }];
    for (const [cat, items] of Object.entries(portfolio.skills)) {
      lines.push({ text: `  ${cat}`, color: "yellow" });
      lines.push({ text: `  ${(items as string[]).join("  •  ")}`, color: "cyan" });
      lines.push({ text: "" });
    }
    return { lines };
  },

  "projects": () => {
    const lines: CommandOutput["lines"] = [{ text: "" }, { text: `Projects (${portfolio.projects.length})`, color: "green" }, { text: "" }];
    portfolio.projects.forEach((p, i) => {
      lines.push({ text: `  [${i + 1}] ${p.name}`, color: "yellow" });
      lines.push({ text: `      ${p.description}` });
      lines.push({ text: `      Tech: ${p.tech}  |  ${p.link}`, color: "dim" });
      lines.push({ text: "" });
    });
    return { lines };
  },

  // "experience": () => {
  //   const lines: CommandOutput["lines"] = [{ text: "" }, { text: "Experience", color: "green" }, { text: "" }];
  //   portfolio.experience.forEach((e) => {
  //     lines.push({ text: `  ${e.role} @ ${e.company}`, color: "yellow" });
  //     lines.push({ text: `  ${e.period}`, color: "cyan" });
  //     lines.push({ text: `  ${e.description}` });
  //     lines.push({ text: "" });
  //   });
  //   return { lines };
  // },

  "resume": () => ({
    lines: [
      { text: "" },
      { text: "Resume", color: "green" },
      { text: "" },
      { text: `  You can view my resume here:`, color: "white" },
      { text: `  ${portfolio.resume}`, color: "cyan" },
      { text: "" },
    ],
  }),

  "education": () => {
    const lines: CommandOutput["lines"] = [{ text: "" }, { text: "Education", color: "green" }, { text: "" }];
    portfolio.education.forEach((e) => {
      lines.push({ text: `  ${e.degree}`, color: "yellow" });
      lines.push({ text: `  ${e.college}  —  ${e.year}`, color: "cyan" });
      lines.push({ text: "" });
    });
    return { lines };
  },

  "contact": () => ({
    lines: [
      { text: "" },
      { text: "Contact", color: "green" },
      { text: "" },
      { text: `  Email     ${portfolio.email}` },
      { text: `  GitHub    ${portfolio.github}` },
      { text: `  LinkedIn  ${portfolio.linkedin}` },
      { text: "" },
    ],
  }),
};

export const COMMAND_KEYS = Object.keys(commands);