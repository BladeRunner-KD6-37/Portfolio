// src/components/Terminal.tsx
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { commands, COMMAND_KEYS } from "@/commands";

type Line = { text: string; color?: string; isCommand?: boolean };

const colorMap: Record<string, string> = {
  green: "text-green-400",
  yellow: "text-yellow-300",
  cyan: "text-cyan-400",
  dim: "text-zinc-500",
  red: "text-red-400",
  white: "text-zinc-100",
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { text: "Welcome! Type  help to see all commands.", color: "green" },
    { text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [awaitingLang, setAwaiting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, loading]);

  function push(...newLines: Line[]) {
    setLines((prev) => [...prev, ...newLines]);
  }

  function renderLineText(text: string) {
    if (!text) return "\u00a0";
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const parts = text.split(urlRegex);
    return parts.map((part, idx) => {
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }

  async function handle(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;

    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
    push({ text: `visitor@portfolio:~$ ${cmd}`, isCommand: true });

    // --- code execution mode ---
    if (awaitingLang) {
      const lang = awaitingLang;
      setAwaiting(null);

      if (lang === "js" || lang === "javascript") {
        runJS(cmd);
      }
      return;
    }

    // --- run command ---
    const [rawBase, ...rest] = cmd.split(" ");
    const base = rawBase.toLowerCase();
    const arg = rest.join(" ").toLowerCase();

    if (base === "run") {
      const supported = ["js", "javascript"];
      if (!arg || !supported.includes(arg)) {
        push({ text: `Usage: run <language>  (e.g. run js)`, color: "red" });
        push({ text: `Supported: ${supported.join(", ")}`, color: "dim" });
      } else {
        setAwaiting(arg);
        push({ text: "" });
        push({ text: `[${arg}] Paste your code and press Enter`, color: "yellow" });
      }
      push({ text: "" });
      return;
    }

    // --- /clear ---
    if (base === "clear") { setLines([]); return; }

    // --- regular commands ---
    const fn = commands[base];
    if (fn) {
      push(...fn().lines);
    } else {
      push({ text: "" });
      push({ text: `command not found: ${rawBase}`, color: "red" });
      push({ text: `type help to see available commands`, color: "dim" });
      push({ text: "" });
    }
  }

  function runJS(code: string) {
    const logs: Line[] = [];
    const orig = console.log;
    console.log = (...args) =>
      logs.push({ text: args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ") });
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      if (result !== undefined) logs.push({ text: String(result) });
    } catch (e: unknown) {
      logs.push({ text: String(e), color: "red" });
    }
    console.log = orig;
    push(...(logs.length ? logs : [{ text: "(no output)", color: "dim" }]));
    push({ text: "" });
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = input;
      setInput("");
      handle(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(history[next]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMAND_KEYS.find((k) => k.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  }

  return (
    <div
      className="bg-[#0d1117] rounded-xl border border-zinc-800 font-mono text-sm h-full min-h-0 flex flex-col cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* titlebar */}
      <div className="bg-[#161b22] border-b border-zinc-800 px-4 py-2.5 flex items-center gap-2 shrink-0">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="text-zinc-500 text-xs ml-2">portfolio — bash</span>
      </div>

      {/* output */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={l.isCommand ? "text-zinc-300" : (colorMap[l.color ?? ""] ?? "text-zinc-400")}>
            {renderLineText(l.text)}
          </div>
        ))}
        {loading && <div className="text-yellow-300 animate-pulse">⟳ Running...</div>}

        {/* inline prompt */}
        <div className="flex items-center mt-1">
          <span className="text-green-400 mr-2">visitor@portfolio:~$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent outline-none border-none text-zinc-100 caret-green-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}