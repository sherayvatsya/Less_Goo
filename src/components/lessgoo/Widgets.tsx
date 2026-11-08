import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Siren, X, Crown, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { askLessGooAI } from "@/lib/chat";

/** Floating SOS button: one click sends (mock) GPS alert to responders. */
export function SosButton() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<string>("Locating…");
  const [sent, setSent] = useState(false);

  const trigger = () => {
    setOpen(true);
    setSent(false);
    setCoords("Locating…");
    const done = (c: string) => {
      setCoords(c);
      setTimeout(() => setSent(true), 900);
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => done(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
        () => done("31.1048, 77.1734 (last known)"),
        { timeout: 4000 },
      );
    } else done("31.1048, 77.1734 (last known)");
  };

  return (
    <>
      <button
        onClick={trigger}
        aria-label="Instant SOS"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-sos px-5 py-4 font-display text-lg font-bold text-sos-foreground shadow-soft ring-4 ring-sos/25 transition hover:scale-105"
      >
        <Siren className="h-6 w-6 animate-pulse" /> SOS
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-sos">Emergency alert</DialogTitle>
            <DialogDescription>Your location: {coords}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2">
            {[
              "SDRF / NDRF control room",
              "Nearest police station",
              "Nearby hospitals",
              "Registered NGOs",
              "Your emergency contacts",
            ].map((r) => (
              <li
                key={r}
                className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3"
              >
                <span>{r}</span>
                <span className={sent ? "text-safe font-semibold" : "text-muted-foreground"}>
                  {sent ? "Alerted ✓" : "Sending…"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Demo only — no real alert is sent. In a real emergency call 112.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Floating AI chat (rule-based mock). */

export function ChatBot() {
  type Message = {
    role: "user" | "assistant";
    text: string;
  };

  const welcome: Message = {
    role: "assistant",
    text: "Hi! I'm Goo, your AI travel buddy. How can I help?",
  };

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([welcome]);

  const end = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (open) {
      end.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, loading, open]);

  const send = async () => {
    const text = input.trim().slice(0, 2000);
    if (!text || busy.current) return;

    busy.current = true;
    setLoading(true);
    setInput("");

    const userMessage: Message = {
      role: "user",
      text,
    };

    const history = [
      ...msgs.filter((m) => m !== welcome),
      userMessage,
    ].slice(-19);

    setMsgs((previous) => [...previous, userMessage]);

    try {
      const result = await askLessGooAI({
        data: {
          messages: history,
          language: language as
            | "auto"
            | "English"
            | "Hindi"
            | "Telugu"
            | "Tamil"
            | "Kannada"
            | "Malayalam"
            | "Marathi"
            | "Bengali",
        },
      });

      setMsgs((previous) => [
        ...previous,
        { role: "assistant", text: result.reply },
      ]);
    } catch (error) {
      console.error("LessGoo AI error:", error);
      toast.error("Unable to connect to LessGoo AI.");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft transition hover:scale-105"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-50 flex h-[min(32rem,calc(100dvh-9rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="bg-brand px-5 py-4 text-primary-foreground">
            <h2 className="font-display text-lg font-bold">
              LessGoo AI
            </h2>
            <p className="text-xs opacity-90">
              Your multilingual travel assistant
            </p>
          </div>

          <div className="border-b p-3">
            <select
              aria-label="Response language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border bg-background p-2 text-sm text-foreground"
            >
              <option value="auto">Auto detect</option>
              <option value="English">English</option>
              <option value="Hindi">हिन्दी</option>
              <option value="Telugu">తెలుగు</option>
              <option value="Tamil">தமிழ்</option>
              <option value="Kannada">ಕನ್ನಡ</option>
              <option value="Malayalam">മലയാളം</option>
              <option value="Marathi">मराठी</option>
              <option value="Bengali">বাংলা</option>
            </select>
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {msgs.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="w-fit animate-pulse rounded-2xl bg-muted px-4 py-3 text-sm">
                Goo is thinking...
              </div>
            )}

            <div ref={end} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex gap-2 border-t p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask Goo anything..."
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-full bg-muted px-4 py-3 text-sm outline-none"
            />

            <Button
              size="icon"
              className="shrink-0 rounded-full"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}


/** Premium paywall modal. */
export function PremiumModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const features = [
    "Offline maps & route sync",
    "Live human travel concierge 24/7",
    "Dynamic SDRF radar alerts",
    "Unlimited Guardian Shield trips",
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-lemon">
            <Crown className="text-warn" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">LessGoo Premium</DialogTitle>
          <DialogDescription className="text-center">
            Travel with extra peace of mind.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 rounded-2xl bg-mint/60 px-4 py-3">
              <Check className="h-4 w-4 text-safe" />
              {f}
            </li>
          ))}
        </ul>
        <div className="text-center font-display text-3xl">
          ₹199<span className="text-base text-muted-foreground">/month</span>
        </div>
        <Button
          className="h-12 rounded-full bg-brand text-base"
          onClick={() => {
            onOpenChange(false);
            toast.success("Premium trial started (demo)");
          }}
        >
          Start 7-day free trial
        </Button>
      </DialogContent>
    </Dialog>
  );
}
