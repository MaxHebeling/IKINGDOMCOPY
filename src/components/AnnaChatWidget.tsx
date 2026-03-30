"use client";

/**
 * AnnaChatWidget — iKingdom
 * Floating chat bubble powered by ANNA (via proxy → hebeling-imperium-hub).
 * Standalone — no shadcn dependencies.
 */

import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AnnaChatWidgetProps {
  origin_page?: string;
}

// ─── Theme (iKingdom) ─────────────────────────────────────────────────────────

const THEME = {
  headerBg: "#041E39",
  headerText: "#F8F6F1",
  accentColor: "#D4AF37",
  accentText: "#041E39",
  botName: "ANNA",
  brandLabel: "iKingdom Digital",
  placeholder: "¿En qué te puedo ayudar?",
};

// ─── IK Logo SVG (from favicon, no background) ───────────────────────────────

function IKLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="108" y="148" width="88" height="88" />
      <rect x="108" y="285" width="88" height="420" />
      <rect x="296" y="148" width="88" height="557" />
      <polygon points="384,400 692,148 580,148 296,348 296,420" />
      <polygon points="296,385 296,460 580,705 692,705 384,415" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const SESSION_KEY = "anna_session_id";

function getOrCreateSession(): string {
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    if (s) return s;
    const id = `anna_${Date.now()}_${genId()}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `anna_${Date.now()}_${genId()}`;
  }
}

const GREETING =
  "¡Hola! Soy ANNA, asistente de iKingdom. ¿En qué puedo ayudarte hoy? 👋";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnnaChatWidget({ origin_page }: AnnaChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const sessionRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionRef.current = getOrCreateSession();
  }, []);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setMessages([{ id: genId(), role: "assistant", content: GREETING }]);
    }
  }, [isOpen, hasOpened]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = { id: genId(), role: "user", content: text };
    const assistantId = genId();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    const history = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/anna/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          session_id: sessionRef.current ?? undefined,
          brand: "ikingdom",
          channel: "web_chat",
          origin_page,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += value;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: acc } : m
          )
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Lo siento, hubo un problema. Por favor intenta de nuevo." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleClose() {
    abortRef.current?.abort();
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] rounded-2xl border border-white/10 bg-[#06162A] shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ background: THEME.headerBg, color: THEME.headerText }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex-shrink-0 size-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.15)", color: THEME.accentColor }}
              >
                <IKLogo className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-none">{THEME.botName}</p>
                <p className="text-xs truncate" style={{ opacity: 0.75 }}>
                  {isStreaming ? "escribiendo..." : THEME.brandLabel}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex flex-col gap-3 p-4 max-h-[380px] overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div
                    className="flex-shrink-0 size-6 rounded-full flex items-center justify-center mr-2 mt-0.5"
                    style={{ background: `${THEME.accentColor}30`, color: THEME.accentColor }}
                  >
                    <IKLogo className="size-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap${
                    m.role === "assistant" ? " bg-white/8 text-white/90" : ""
                  }`}
                  style={
                    m.role === "user"
                      ? {
                          background: THEME.accentColor,
                          color: THEME.accentText,
                          borderBottomRightRadius: "4px",
                        }
                      : { borderBottomLeftRadius: "4px" }
                  }
                >
                  {m.content || (
                    <span className="flex items-center gap-1.5 text-white/40">
                      <Loader2 className="size-3 animate-spin" />
                      <span className="text-xs">...</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-white/8 p-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={THEME.placeholder}
              disabled={isStreaming}
              rows={1}
              className="flex-1 resize-none bg-white/8 text-white/90 placeholder:text-white/30 rounded-xl px-3 py-2 text-sm leading-normal focus:outline-none focus:ring-1 focus:ring-yellow-600/40 min-h-[38px] max-h-[120px] disabled:opacity-50"
              style={{ height: "38px", overflowY: "auto" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 size-[38px] rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80"
              style={{ background: THEME.accentColor, color: THEME.accentText }}
              aria-label="Enviar mensaje"
            >
              {isStreaming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-white/30 py-1.5 border-t border-white/8">
            Powered by Hebeling OS · ANNA v2
          </p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="size-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center text-xl"
        style={{ background: THEME.accentColor, color: THEME.accentText }}
        aria-label={isOpen ? "Cerrar chat con ANNA" : "Chatear con ANNA"}
      >
        {isOpen ? <X className="size-6" /> : <IKLogo className="size-8" />}
      </button>
    </div>
  );
}
