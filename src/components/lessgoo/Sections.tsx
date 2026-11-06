import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle, BedDouble, Bus, Car, CloudRain, MapPin, Phone, Search, ShieldCheck, Star, Train, Utensils, WifiOff, Hotel, UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { emergencyContacts, getRouteInfo, itineraries, type RouteInfo } from "@/lib/mock-data";

const card = "rounded-3xl bg-card p-6 shadow-soft border";
const field = "w-full rounded-2xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

export function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 text-center">
      <span className="rounded-full bg-peach px-4 py-1 text-sm font-semibold text-accent-foreground">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      {sub && <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{sub}</p>}
    </div>
  );
}

/* 1. Hero & search hub */
export function Hero() {
  const [from, setFrom] = useState("Chandigarh");
  const [to, setTo] = useState("Shimla");
  const [info, setInfo] = useState<RouteInfo>(() => getRouteInfo("Chandigarh", "Shimla"));

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast.error("Enter both places");
      return;
    }
    setInfo(getRouteInfo(from.slice(0, 60), to.slice(0, 60)));
  };
  const scoreColor = info.safetyScore >= 80 ? "text-safe" : info.safetyScore >= 65 ? "text-warn" : "text-sos";

  return (
    <section id="plan" className="bg-hero px-4 pb-16 pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Travel easy. <br />Travel safe. <span className="text-primary">LessGoo!</span></h1>
          <p className="mt-4 text-lg text-muted-foreground">Live hazard alerts, honest prices and a safety net for solo travelers and kids on the move.</p>
        </div>
        <form onSubmit={search} className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-full bg-card p-2 shadow-soft md:flex-row">
          <input aria-label="From" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" className="flex-1 rounded-full px-5 py-3 outline-none" />
          <input aria-label="To" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" className="flex-1 rounded-full px-5 py-3 outline-none" />
          <Button type="submit" className="h-12 rounded-full bg-brand px-8 text-base"><Search className="mr-1 h-4 w-4" />Plan trip</Button>
        </form>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className={card}>
            <p className="text-sm text-muted-foreground">{info.from} → {info.to}</p>
            <p className="mt-1 font-display text-2xl">{info.distanceKm} km · {info.hours} hrs</p>
            <div className="mt-4 flex items-end gap-2">
              <span className={`font-display text-5xl font-bold ${scoreColor}`}>{info.safetyScore}</span>
              <span className="mb-2 text-muted-foreground">/100 safety score</span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sky/70 p-3">
              <CloudRain className="text-primary" />
              <span>{info.weather.temp}°C · {info.weather.condition} · {info.weather.rainChance}% rain</span>
            </div>
          </div>
          <div className={card}>
            <h3 className="flex items-center gap-2 text-xl font-semibold"><AlertTriangle className="h-5 w-5 text-warn" />Hazard alerts</h3>
            <ul className="mt-4 space-y-2">
              {info.alerts.map((a) => (
                <li key={a.text} className={`rounded-2xl px-4 py-3 text-sm ${a.level === "high" ? "bg-sos/15" : a.level === "medium" ? "bg-lemon" : "bg-mint/70"}`}>{a.text}</li>
              ))}
            </ul>
          </div>
          <div className={card}>
            <h3 className="text-xl font-semibold">Verified prices</h3>
            <ul className="mt-4 space-y-2">
              {info.prices.map((p) => (
                <li key={p.mode} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-2">
                  <div><p className="font-semibold">{p.mode}</p><p className="text-xs text-muted-foreground">{p.note}</p></div>
                  <span className="font-display text-lg">₹{p.price.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3. Guardian Shield */
export function GuardianShield() {
  const [active, setActive] = useState(true);
  const [interval, setIntervalMins] = useState(30);
  const [phoneOff, setPhoneOff] = useState(false);
  const [log, setLog] = useState<string[]>(["10:00 — Checked in at Chandigarh bus stand", "10:30 — On bus, near Pinjore"]);

  // Demo: add a check-in every 8s while active and phone is on
  useEffect(() => {
    if (!active || phoneOff) return;
    const id = setInterval(() => {
      const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setLog((l) => [`${t} — Auto check-in sent to parents ✓`, ...l].slice(0, 6));
    }, 8000);
    return () => clearInterval(id);
  }, [active, phoneOff]);

  const failSafe = [
    { icon: Hotel, label: "Hotel reception", who: "Hotel Snow View, Shimla", phone: "+91 98160 00000" },
    { icon: Car, label: "Verified cab driver", who: "Ramesh K. · HP 03 1234", phone: "+91 98050 00000" },
    { icon: UserRound, label: "Emergency contact", who: "Aunt Priya", phone: "+91 98720 00000" },
  ];

  return (
    <section id="guardian" className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Guardian Shield" title="Peace of mind for parents" sub="Automatic check-ins for kids and solo travelers, with a fail-safe if their phone goes quiet." />
        <div className="grid gap-5 md:grid-cols-2">
          <div className={card}>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="text-safe" />Aarav's trip</h3>
              <label className="flex items-center gap-2 text-sm">Tracking <Switch checked={active} onCheckedChange={setActive} /></label>
            </div>
            <div className="mt-4 flex gap-2">
              {[30, 45, 60].map((m) => (
                <button key={m} onClick={() => setIntervalMins(m)} className={`rounded-full px-4 py-2 text-sm font-semibold ${interval === m ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Every {m} min</button>
              ))}
            </div>
            <ul className="mt-5 space-y-2">
              {log.map((l, i) => <li key={i} className="rounded-2xl bg-mint/60 px-4 py-2 text-sm">{l}</li>)}
            </ul>
            <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={phoneOff} onCheckedChange={setPhoneOff} />Simulate phone unreachable</label>
          </div>
          <div className={`${card} ${phoneOff ? "ring-2 ring-sos" : ""}`}>
            <h3 className="text-xl font-semibold">Fail-safe protocol</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {phoneOff ? "Aarav's phone is unreachable. Reach these people in one tap:" : "Unlocks automatically if a check-in is missed."}
            </p>
            <ul className="mt-4 space-y-3">
              {failSafe.map((f) => (
                <li key={f.label} className={`flex items-center justify-between rounded-2xl p-4 ${phoneOff ? "bg-peach" : "bg-muted opacity-60"}`}>
                  <div className="flex items-center gap-3"><f.icon className="text-primary" /><div><p className="font-semibold">{f.label}</p><p className="text-xs text-muted-foreground">{f.who}</p></div></div>
                  <Button asChild size="sm" disabled={!phoneOff} className="rounded-full">
                    <a href={phoneOff ? `tel:${f.phone.replace(/\s/g, "")}` : undefined}><Phone className="mr-1 h-3 w-3" />Call</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 4. Community wisdom */
export function Community() {
  const [q, setQ] = useState("");
  const list = itineraries.filter((i) => `${i.title} ${i.route} ${i.tip}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="community" className="bg-secondary/50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Community wisdom" title="Trips from real travelers" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search itineraries, e.g. Manali" className={`${field} mx-auto mb-8 block max-w-md rounded-full`} />
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((i) => (
            <article key={i.title} className={card}>
              <div className="flex items-center justify-between text-sm text-muted-foreground"><span>{i.route}</span><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warn text-warn" />{i.rating}</span></div>
              <h3 className="mt-2 text-xl font-semibold">{i.title}</h3>
              <p className="text-sm text-muted-foreground">{i.days} days · by {i.author} ✓ verified</p>
              <p className="mt-3 rounded-2xl bg-lemon/70 p-3 text-sm">💡 {i.tip}</p>
              <p className="mt-2 text-sm"><MapPin className="mr-1 inline h-4 w-4 text-primary" />{i.condition}</p>
            </article>
          ))}
          {list.length === 0 && <p className="col-span-full text-center text-muted-foreground">No trips found yet.</p>}
        </div>
      </div>
    </section>
  );
}

/* 5. Booking */
const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Enter a valid phone number"),
  destination: z.string().trim().min(1, "Destination is required").max(100),
  date: z.string().min(1, "Pick a date"),
  travelers: z.coerce.number().int().min(1).max(20),
});

export function Booking({ onPremium }: { onPremium: () => void }) {
  const types = [
    { id: "Hotel", icon: BedDouble }, { id: "Cab", icon: Car }, { id: "Train", icon: Train }, { id: "Bus", icon: Bus }, { id: "Food", icon: Utensils },
  ];
  const [type, setType] = useState("Hotel");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = bookingSchema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast.success(`${type} booking request received! We'll confirm shortly.`);
  };

  return (
    <section id="book" className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle eyebrow="Book" title="Book everything in one place" />
        <div className={card}>
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {types.map((t) => (
              <button key={t.id} type="button" onClick={() => setType(t.id)} className={`flex items-center gap-2 rounded-full px-5 py-2 font-semibold transition ${type === t.id ? "bg-brand text-primary-foreground" : "bg-muted"}`}>
                <t.icon className="h-4 w-4" />{t.id}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" noValidate>
            {[
              { n: "name", l: "Your name", t: "text" },
              { n: "phone", l: "Phone", t: "tel" },
              { n: "destination", l: type === "Food" ? "Delivery location" : "Destination", t: "text" },
              { n: "date", l: "Date", t: "date" },
              { n: "travelers", l: type === "Food" ? "Meals" : "Travelers", t: "number" },
            ].map((f) => (
              <label key={f.n} className="text-sm font-semibold">
                {f.l}
                <input name={f.n} type={f.t} defaultValue={f.n === "travelers" ? 1 : undefined} min={f.n === "travelers" ? 1 : undefined} className={`${field} mt-1 font-normal`} />
                {errors[f.n] && <span className="text-xs text-destructive">{errors[f.n]}</span>}
              </label>
            ))}
            <div className="flex items-end">
              <Button type="submit" className="h-12 w-full rounded-full bg-brand text-base">Request booking</Button>
            </div>
          </form>
          <button onClick={onPremium} className="mx-auto mt-6 block text-sm font-semibold text-primary underline-offset-4 hover:underline">
            ✨ Get a live human concierge with Premium
          </button>
        </div>
      </div>
    </section>
  );
}

/* 7. Offline cache */
export function OfflineCache() {
  const [offline, setOffline] = useState(false);
  return (
    <section id="offline" className="px-4 pb-24 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className={`${card} ${offline ? "bg-sky/60" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-semibold"><WifiOff className="text-primary" />Offline mode</h3>
              <p className="text-muted-foreground">Saved maps, contacts and routes for zero-network zones.</p>
            </div>
            <label className="flex items-center gap-3 font-semibold">{offline ? "Offline" : "Online"}<Switch checked={offline} onCheckedChange={setOffline} /></label>
          </div>
          {offline && (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Saved emergency maps</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>🗺️ Shimla district — 42 MB</li><li>🗺️ Kullu–Manali — 58 MB</li><li>🏥 Hospitals & shelters layer</li></ul>
              </div>
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Emergency contact cards</h4>
                <ul className="mt-2 space-y-1 text-sm">{emergencyContacts.map((c) => <li key={c.name} className="flex justify-between"><span>{c.name}</span><a className="font-semibold text-primary" href={`tel:${c.phone}`}>{c.phone}</a></li>)}</ul>
              </div>
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Cached routes</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Chandigarh → Shimla · synced today</li><li>Delhi → Manali · synced 2 days ago</li></ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
