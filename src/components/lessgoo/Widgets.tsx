import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Siren, X, Crown, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { botReply } from "@/lib/mock-data";

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
            {["SDRF / NDRF control room", "Nearest police station", "Nearby hospitals", "Registered NGOs", "Your emergency contacts"].map((r) => (
              <li key={r} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
                <span>{r}</span>
                <span className={sent ? "text-safe font-semibold" : "text-muted-foreground"}>
                  {sent ? "Alerted ✓" : "Sending…"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">Demo only — no real alert is sent. In a real emergency call 112.</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Floating AI chat (rule-based mock). */
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([{ me: false, text: "Hi! I'm Goo, your travel & safety buddy. Ask me anything." }]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const send = () => {
    const t = input.trim().slice(0, 300);
    if (!t) return;
    setInput("");
    setMsgs((m) => [...m, { me: true, text: t }]);
    setTimeout(() => setMsgs((m) => [...m, { me: false, text: botReply(t) }]), 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-brand text-primary-foreground shadow-soft transition hover:scale-105"
      >
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <div className="fixed bottom-28 right-6 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="bg-brand px-5 py-4 font-display text-lg text-primary-foreground">Goo · Travel buddy</div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.text}
              </div>
            ))}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a route…" className="flex-1 rounded-full bg-muted px-4 text-sm outline-none" />
            <Button size="icon" className="rounded-full" type="submit" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      )}
    </>
  );
}

/** Premium paywall modal. */
export function PremiumModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const features = ["Offline maps & route sync", "Live human travel concierge 24/7", "Dynamic SDRF radar alerts", "Unlimited Guardian Shield trips"];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-lemon"><Crown className="text-warn" /></div>
          <DialogTitle className="text-center font-display text-2xl">LessGoo Premium</DialogTitle>
          <DialogDescription className="text-center">Travel with extra peace of mind.</DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 rounded-2xl bg-mint/60 px-4 py-3"><Check className="h-4 w-4 text-safe" />{f}</li>
          ))}
        </ul>
        <div className="text-center font-display text-3xl">₹199<span className="text-base text-muted-foreground">/month</span></div>
        <Button className="h-12 rounded-full bg-brand text-base" onClick={() => { onOpenChange(false); toast.success("Premium trial started (demo)"); }}>
          Start 7-day free trial
        </Button>
      </DialogContent>
    </Dialog>
  );
}
