import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  AlertTriangle, BedDouble, Bus, Car, CloudRain, MapPin, Phone, Search, ShieldCheck, Star, Train, Utensils, WifiOff, Hotel, UserRound, User, Clock3, Navigation, Share2, UserPlus, Check, MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { emergencyContacts, getRouteInfo, itineraries, type RouteInfo } from "@/lib/mock-data";

const card = "rounded-3xl bg-card p-6 shadow-soft border";
const field =
  "w-full rounded-2xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 text-center">
      <span className="rounded-full bg-peach px-4 py-1 text-sm font-semibold text-accent-foreground">
        {eyebrow}
      </span>
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
  const scoreColor =
    info.safetyScore >= 80 ? "text-safe" : info.safetyScore >= 65 ? "text-warn" : "text-sos";

  return (
    <section id="plan" className="bg-hero px-4 pb-16 pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Travel easy. <br />
            Travel safe. <span className="text-primary">LessGoo!</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Live hazard alerts, honest prices and a safety net for solo travelers and kids on the
            move.
          </p>
        </div>
        <form
          onSubmit={search}
          className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-full bg-card p-2 shadow-soft md:flex-row"
        >
          <input
            aria-label="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From"
            className="flex-1 rounded-full px-5 py-3 outline-none"
          />
          <input
            aria-label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To"
            className="flex-1 rounded-full px-5 py-3 outline-none"
          />
          <Button type="submit" className="h-12 rounded-full bg-brand px-8 text-base">
            <Search className="mr-1 h-4 w-4" />
            Plan trip
          </Button>
        </form>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className={card}>
            <p className="text-sm text-muted-foreground">
              {info.from} → {info.to}
            </p>
            <p className="mt-1 font-display text-2xl">
              {info.distanceKm} km · {info.hours} hrs
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className={`font-display text-5xl font-bold ${scoreColor}`}>
                {info.safetyScore}
              </span>
              <span className="mb-2 text-muted-foreground">/100 safety score</span>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-sky/70 p-3">
              <CloudRain className="text-primary" />
              <span>
                {info.weather.temp}°C · {info.weather.condition} · {info.weather.rainChance}% rain
              </span>
            </div>
          </div>
          <div className={card}>
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-warn" />
              Hazard alerts
            </h3>
            <ul className="mt-4 space-y-2">
              {info.alerts.map((a) => (
                <li
                  key={a.text}
                  className={`rounded-2xl px-4 py-3 text-sm ${a.level === "high" ? "bg-sos/15" : a.level === "medium" ? "bg-lemon" : "bg-mint/70"}`}
                >
                  {a.text}
                </li>
              ))}
            </ul>
          </div>
          <div className={card}>
            <h3 className="text-xl font-semibold">Verified prices</h3>
            <ul className="mt-4 space-y-2">
              {info.prices.map((p) => (
                <li
                  key={p.mode}
                  className="flex items-center justify-between rounded-2xl bg-muted px-4 py-2"
                >
                  <div>
                    <p className="font-semibold">{p.mode}</p>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </div>
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
  const [role, setRole] = useState<"user" | "guardian">("guardian");
  const [active, setActive] = useState(true);
  const [interval, setIntervalMins] = useState(30);
  const [phoneOff, setPhoneOff] = useState(false);
  const [log, setLog] = useState<string[]>(["10:00 — Checked in at Chandigarh bus stand", "10:30 — On bus, near Pinjore"]);
  const [username, setUsername] = useState("");
  const [connectedUser, setConnectedUser] = useState("Mom");
  const [shareLocation, setShareLocation] = useState(true);
  const [shareHotel, setShareHotel] = useState(false);
  const [rideBooked, setRideBooked] = useState(false);
  const [shareCab, setShareCab] = useState(false);

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
    {
      icon: Hotel,
      label: "Hotel reception",
      who: "Hotel Snow View, Shimla",
      phone: "+91 98160 00000",
    },
    {
      icon: Car,
      label: "Verified cab driver",
      who: "Ramesh K. · HP 03 1234",
      phone: "+91 98050 00000",
    },
    { icon: UserRound, label: "Emergency contact", who: "Aunt Priya", phone: "+91 98720 00000" },
  ];

  const connectGuardian = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextUsername = username.trim().replace(/^@/, "");
    if (!nextUsername) {
      toast.error("Enter a LessGoo username to connect");
      return;
    }
    setConnectedUser(`@${nextUsername}`);
    setUsername("");
    toast.success(`Connected with @${nextUsername}`);
  };

  return (
    <section id="guardian" className="bg-[#f0fbfc] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex rounded-full bg-peach px-5 py-2 text-sm font-bold text-accent-foreground">Guardian Shield</span>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">{role === "guardian" ? "Peace of mind for parents" : "Your trip, with a safety net"}</h2>
          <p className="mx-auto mt-4 max-w-4xl text-lg text-muted-foreground md:text-2xl">{role === "guardian" ? "Automatic check-ins for kids and solo travelers, with a fail-safe if their phone goes quiet." : "Set your check-in plan, share your trip, and get help quickly wherever you go."}</p>
        </div>
        <div className="mx-auto mb-8 flex w-fit rounded-full border border-[#d1e9ed] bg-white p-1.5 shadow-sm" role="tablist" aria-label="Choose your Guardian Shield view">
          <button role="tab" aria-selected={role === "user"} onClick={() => setRole("user")} className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition md:px-8 ${role === "user" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}><User className="h-4 w-4" />For me</button>
          <button role="tab" aria-selected={role === "guardian"} onClick={() => setRole("guardian")} className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition md:px-8 ${role === "guardian" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}><ShieldCheck className="h-4 w-4" />For a guardian</button>
        </div>
        {role === "user" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#d1e9ed] bg-white p-6 shadow-soft md:p-8">
              <div className="flex items-center justify-between gap-3"><div><h3 className="flex items-center gap-2 text-xl font-semibold"><Navigation className="text-primary" />My trip check-ins</h3><p className="mt-1 text-sm text-muted-foreground">Chandigarh → Shimla · shared with {connectedUser}</p></div><label className="flex items-center gap-2 text-sm">On <Switch checked={active} onCheckedChange={setActive} /></label></div>
              <form onSubmit={connectGuardian} className="mt-6 rounded-3xl bg-[#f0f8fb] p-4 md:p-5">
                <label htmlFor="guardian-username" className="text-sm font-bold">Connect with a LessGoo username</label>
                <div className="mt-2 flex gap-2"><input id="guardian-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. @priya_sharma" className="min-w-0 flex-1 rounded-full border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" /><Button type="submit" className="shrink-0 rounded-full px-4"><UserPlus className="mr-1 h-4 w-4" />Connect</Button></div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-safe" />Currently connected: {connectedUser}</p>
              </form>
              <div className="mt-5"><h4 className="font-semibold">Choose what to share with {connectedUser}</h4><p className="mt-1 text-sm text-muted-foreground">You can change these anytime.</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f0f8fb] p-4"><div className="flex items-start gap-3"><MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold">Live location</p><p className="text-sm text-muted-foreground">Share an updated location every 2 hours</p></div></div><Switch aria-label="Share live location every 2 hours" checked={shareLocation} onCheckedChange={setShareLocation} /></div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f0f8fb] p-4"><div className="flex items-start gap-3"><Hotel className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold">Hotel check-in details</p><p className="text-sm text-muted-foreground">Share hotel name and check-in status</p></div></div><Switch aria-label="Share hotel check-in details" checked={shareHotel} onCheckedChange={setShareHotel} /></div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f0f8fb] p-4"><div className="flex items-start gap-3"><Car className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold">Cab ride details</p><p className="text-sm text-muted-foreground">Share driver name, number and plate when booked in LessGoo</p></div></div><Switch aria-label="Share LessGoo cab ride details" checked={shareCab} disabled={!rideBooked} onCheckedChange={setShareCab} /></div>
                </div>
                {shareLocation && <p className="mt-3 rounded-2xl bg-mint/60 px-4 py-3 text-sm">Next location update will be shared in 2 hours.</p>}
                {shareHotel && <p className="mt-2 rounded-2xl bg-mint/60 px-4 py-3 text-sm">Hotel check-in details will be shared when you check in.</p>}
                {rideBooked ? <p className="mt-2 rounded-2xl bg-mint/60 px-4 py-3 text-sm">LessGoo cab booked · Ramesh K. · +91 98050 00000 · HP 03 1234 {shareCab ? "· shared with " + connectedUser : "· sharing is off"}</p> : <button type="button" onClick={() => { setRideBooked(true); toast.success("Demo LessGoo cab booking added"); }} className="mt-2 text-left text-sm font-semibold text-primary underline underline-offset-4">Preview cab details after a LessGoo booking</button>}
              </div>
              <p className="mt-5 text-sm font-semibold">Check in every</p>
              <div className="mt-2 grid grid-cols-3 gap-2">{[30, 45, 60].map((m) => <button key={m} onClick={() => setIntervalMins(m)} aria-pressed={interval === m} className={`rounded-2xl px-2 py-3 text-sm font-semibold transition ${interval === m ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary"}`}>{m} min</button>)}</div>
              <div className="mt-5 rounded-2xl bg-mint/60 p-4"><p className="flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-safe" />Next check-in</p><p className="mt-1 text-sm text-muted-foreground">In {interval} minutes · your location is shared securely</p></div>
              <ul className="mt-4 space-y-2">{log.slice(0, 3).map((l, i) => <li key={i} className="rounded-2xl bg-muted px-4 py-3 text-sm">{l}</li>)}</ul>
              <Button variant="outline" className="mt-4 w-full rounded-full" onClick={() => toast.success(`Trip status shared with ${connectedUser}`)}><Share2 className="mr-2 h-4 w-4" />Share trip status</Button>
            </div>
            <div className={`flex flex-col justify-between rounded-[2rem] border border-[#d1e9ed] bg-white p-6 shadow-soft md:p-8 ${phoneOff ? "ring-2 ring-sos" : ""}`}>
              <div><h3 className="text-xl font-semibold">If I miss a check-in</h3><p className="mt-1 text-sm text-muted-foreground">Your guardian is notified and can reach your trusted contacts.</p><div className="mt-5 rounded-2xl bg-sky/70 p-4"><p className="font-semibold">Your trusted contacts</p><p className="mt-1 text-sm text-muted-foreground">Mom · Aunt Priya · Verified cab driver</p></div>{phoneOff && <p className="mt-4 rounded-2xl bg-peach p-4 text-sm">Demo alert: your phone is unreachable. Your guardian can now use the fail-safe contacts.</p>}</div>
              <div className="mt-6"><label className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Switch checked={phoneOff} onCheckedChange={setPhoneOff} />Preview missed check-in alert</label><Button className="h-14 w-full rounded-full bg-sos text-lg font-bold text-white hover:bg-sos/90" onClick={() => toast.error("SOS alert sent to your guardian and emergency contacts") }><AlertTriangle className="mr-2 h-5 w-5" />SOS · Get help now</Button><p className="mt-2 text-center text-xs text-muted-foreground">Use for urgent help. For immediate danger, call 112.</p></div>
            </div>
          </div>
        ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#d1e9ed] bg-white p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <ShieldCheck className="text-safe" />
                Aarav's trip
              </h3>
              <label className="flex items-center gap-2 text-sm">
                Tracking <Switch checked={active} onCheckedChange={setActive} />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              {[30, 45, 60].map((m) => (
                <button key={m} onClick={() => setIntervalMins(m)} aria-pressed={interval === m} className={`flex-1 rounded-full px-3 py-3 text-sm font-bold transition md:py-4 md:text-base ${interval === m ? "bg-primary text-primary-foreground shadow-sm" : "bg-[#e8f5f8] hover:bg-[#dceff3]"}`}>Every {m} min</button>
              ))}
            </div>
            <ul className="mt-6 space-y-3">
              {log.map((l, i) => <li key={i} className="rounded-full bg-[#d8f8ee] px-5 py-3 text-sm font-semibold md:px-6 md:py-4 md:text-base">{l}</li>)}
            </ul>
            <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Switch checked={phoneOff} onCheckedChange={setPhoneOff} />
              Simulate phone unreachable
            </label>
          </div>
          <div className={`rounded-[2rem] border border-[#d1e9ed] bg-white p-6 shadow-soft md:p-8 ${phoneOff ? "ring-2 ring-sos" : ""}`}>
            <h3 className="text-xl font-semibold">Fail-safe protocol</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {phoneOff
                ? "Aarav's phone is unreachable. Reach these people in one tap:"
                : "Unlocks automatically if a check-in is missed."}
            </p>
            <ul className="mt-4 space-y-3">
              {failSafe.map((f) => (
                <li key={f.label} className={`flex items-center justify-between gap-3 rounded-[1.5rem] p-4 md:p-5 ${phoneOff ? "bg-peach" : "bg-[#f0f8fb]"}`}>
                  <div className="flex min-w-0 items-center gap-3 md:gap-5"><f.icon className="h-6 w-6 shrink-0 text-safe" /><div className="min-w-0"><p className="font-bold md:text-lg">{f.label}</p><p className="truncate text-sm text-muted-foreground md:text-base">{f.who}</p></div></div>
                  <Button asChild size="sm" disabled={!phoneOff} className="shrink-0 rounded-full bg-safe px-4 text-white hover:bg-safe/90">
                    <a href={phoneOff ? `tel:${f.phone.replace(/\s/g, "")}` : undefined}><Phone className="mr-1 h-3 w-3" />Call</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

/* 4. Community wisdom */
export function Community() {
  const [q, setQ] = useState("");
  const list = itineraries.filter((i) =>
    `${i.title} ${i.route} ${i.tip}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <section id="community" className="bg-secondary/50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="Community wisdom" title="Trips from real travelers" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search itineraries, e.g. Manali"
          className={`${field} mx-auto mb-8 block max-w-md rounded-full`}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((i) => (
            <article key={i.title} className={card}>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{i.route}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warn text-warn" />
                  {i.rating}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-semibold">{i.title}</h3>
              <p className="text-sm text-muted-foreground">
                {i.days} days · by {i.author} ✓ verified
              </p>
              <p className="mt-3 rounded-2xl bg-lemon/70 p-3 text-sm">💡 {i.tip}</p>
              <p className="mt-2 text-sm">
                <MapPin className="mr-1 inline h-4 w-4 text-primary" />
                {i.condition}
              </p>
            </article>
          ))}
          {list.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No trips found yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* 5. Booking */
const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,15}$/, "Enter a valid phone number"),
  destination: z.string().trim().min(1, "Destination is required").max(100),
  date: z.string().min(1, "Pick a date"),
  travelers: z.coerce.number().int().min(1).max(20),
});

export function Booking({ onPremium }: { onPremium: () => void }) {
  const types = [
    { id: "Hotel", icon: BedDouble },
    { id: "Cab", icon: Car },
    { id: "Train", icon: Train },
    { id: "Bus", icon: Bus },
    { id: "Food", icon: Utensils },
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
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 font-semibold transition ${type === t.id ? "bg-brand text-primary-foreground" : "bg-muted"}`}
              >
                <t.icon className="h-4 w-4" />
                {t.id}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" noValidate>
            {[
              { n: "name", l: "Your name", t: "text" },
              { n: "phone", l: "Phone", t: "tel" },
              {
                n: "destination",
                l: type === "Food" ? "Delivery location" : "Destination",
                t: "text",
              },
              { n: "date", l: "Date", t: "date" },
              { n: "travelers", l: type === "Food" ? "Meals" : "Travelers", t: "number" },
            ].map((f) => (
              <label key={f.n} className="text-sm font-semibold">
                {f.l}
                <input
                  name={f.n}
                  type={f.t}
                  defaultValue={f.n === "travelers" ? 1 : undefined}
                  min={f.n === "travelers" ? 1 : undefined}
                  className={`${field} mt-1 font-normal`}
                />
                {errors[f.n] && <span className="text-xs text-destructive">{errors[f.n]}</span>}
              </label>
            ))}
            <div className="flex items-end">
              <Button type="submit" className="h-12 w-full rounded-full bg-brand text-base">
                Request booking
              </Button>
            </div>
          </form>
          <button
            onClick={onPremium}
            className="mx-auto mt-6 block text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
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
              <h3 className="flex items-center gap-2 text-2xl font-semibold">
                <WifiOff className="text-primary" />
                Offline mode
              </h3>
              <p className="text-muted-foreground">
                Saved maps, contacts and routes for zero-network zones.
              </p>
            </div>
            <label className="flex items-center gap-3 font-semibold">
              {offline ? "Offline" : "Online"}
              <Switch checked={offline} onCheckedChange={setOffline} />
            </label>
          </div>
          {offline && (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Saved emergency maps</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>🗺️ Shimla district — 42 MB</li>
                  <li>🗺️ Kullu–Manali — 58 MB</li>
                  <li>🏥 Hospitals & shelters layer</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Emergency contact cards</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {emergencyContacts.map((c) => (
                    <li key={c.name} className="flex justify-between">
                      <span>{c.name}</span>
                      <a className="font-semibold text-primary" href={`tel:${c.phone}`}>
                        {c.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-card p-5">
                <h4 className="font-semibold">Cached routes</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Chandigarh → Shimla · synced today</li>
                  <li>Delhi → Manali · synced 2 days ago</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
