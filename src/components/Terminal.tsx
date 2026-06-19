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
  const [showResumePdf, setShowResumePdf] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, loading]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setLines((prev) => {
        if (prev.some((l) => l.text === "Tap a command below or type your own.")) {
          return prev;
        }
        return [...prev, { text: "Tap a command below or type your own.", color: "dim" }];
      });
    }
  }, []);

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

    // --- close / resume close ---
    if (base === "close" || (base === "resume" && arg === "close")) {
      setShowResumePdf(false);
      push({ text: "Closing resume viewer panel...", color: "yellow" });
      push({ text: "" });
      return;
    }

    if (base === "resume") {
      setShowResumePdf(true);
    }

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
    <div className="flex flex-col lg:flex-row gap-4 h-full w-full overflow-hidden">
      <div
        className={`bg-[#0d1117] rounded-xl border border-zinc-800 font-mono text-sm min-h-0 flex flex-col cursor-text transition-all duration-300 ${
          showResumePdf ? "w-full lg:w-1/2 h-[50vh] lg:h-full" : "w-full h-full"
        }`}
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

          {/* Mobile shortcuts */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 pt-1 mb-1 shrink-0 mobile-shortcuts-container select-none">
            <style dangerouslySetInnerHTML={{__html: `
              .mobile-shortcuts-container::-webkit-scrollbar {
                display: none;
              }
            `}} />
            {["about", "skills", "projects", "experience", "contact", "resume", "help"].map((cmd) => (
              <button
                key={cmd}
                onClick={(e) => {
                  e.stopPropagation();
                  handle(cmd);
                }}
                className="px-2.5 py-1 bg-[#161b22] hover:bg-zinc-800 active:bg-zinc-700 text-cyan-400 rounded border border-zinc-800 text-xs font-mono shrink-0 transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-green-400 flex items-center"
              >
                <span className="text-zinc-500 mr-1 select-none">$</span>
                <span>{cmd}</span>
              </button>
            ))}
          </div>

          {/* inline prompt */}
          <div className="flex items-center mt-1">
            <span className="text-green-400 mr-2 shrink-0">visitor@portfolio:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              className="flex-1 bg-transparent outline-none border-none text-zinc-100 caret-green-400 min-w-0"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            {/* Mobile Enter Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const val = input;
                setInput("");
                handle(val);
                inputRef.current?.focus();
              }}
              className="md:hidden ml-2 px-3 py-1 bg-[#161b22] hover:bg-zinc-800 active:bg-zinc-700 text-green-400 rounded border border-zinc-800 font-mono text-xs font-bold cursor-pointer shrink-0 transition-colors select-none focus:outline-none focus:ring-1 focus:ring-green-400 flex items-center gap-1"
              aria-label="Execute command"
            >
              <span>Run</span>
              <span className="text-[10px] opacity-75">↵</span>
            </button>
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {showResumePdf && (
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-[#0d1117] rounded-xl border border-zinc-800 flex flex-col overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-[#161b22] border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <span className="text-zinc-400 text-xs ml-2 font-mono">Resume.pdf — Viewer</span>
            </div>
            <button
              onClick={() => setShowResumePdf(false)}
              className="text-zinc-500 hover:text-red-400 font-mono text-xs transition-colors cursor-pointer select-none px-2 py-0.5 rounded hover:bg-zinc-800 border border-transparent hover:border-zinc-700"
            >
              [X] Close
            </button>
          </div>
          {/* PDF Viewer */}
          <div className="flex-1 bg-[#0b0e14] p-1.5 relative flex flex-col">
            <iframe
              src="/Resume.pdf"
              className="w-full h-full border-0 rounded-lg"
              title="Resume PDF"
            />
            <div className="absolute bottom-4 left-4 bg-zinc-900/90 text-[11px] text-zinc-400 px-3 py-1.5 rounded-md border border-zinc-800 backdrop-blur-sm pointer-events-none select-none">
              Trouble viewing? <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold pointer-events-auto hover:text-cyan-300 transition-colors">Open in new tab</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}