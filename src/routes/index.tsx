import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Crown } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Booking, Community, GuardianShield, Hero, OfflineCache } from "@/components/lessgoo/Sections";
import { ChatBot, PremiumModal, SosButton } from "@/components/lessgoo/Widgets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LessGoo — Effortless, ultra-safe travel" },
      { name: "description", content: "Plan safe trips with live hazard alerts, verified prices, Guardian Shield for kids, one-click SOS and offline emergency maps." },
      { property: "og:title", content: "LessGoo — Effortless, ultra-safe travel" },
      { property: "og:description", content: "Live hazard alerts, verified prices, Guardian Shield and one-click SOS for every trip." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [premium, setPremium] = useState(false);
  const nav = [["Plan", "#plan"], ["Guardian Shield", "#guardian"], ["Community", "#community"], ["Book", "#book"], ["Offline", "#offline"]];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#plan" className="font-display text-2xl font-bold text-primary">LessGoo<span className="text-accent-foreground">.</span></a>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            {nav.map(([l, h]) => <a key={h} href={h} className="hover:text-primary">{l}</a>)}
          </nav>
          <Button onClick={() => setPremium(true)} className="rounded-full bg-brand"><Crown className="mr-1 h-4 w-4" />Premium</Button>
        </div>
      </header>
      <main>
        <Hero />
        <GuardianShield />
        <Community />
        <Booking onPremium={() => setPremium(true)} />
        <OfflineCache />
      </main>
      <footer className="bg-hero px-4 py-8 text-center text-sm text-muted-foreground">© 2026 LessGoo · Emergency? Call 112</footer>
      <SosButton />
      <ChatBot />
      <PremiumModal open={premium} onOpenChange={setPremium} />
      <Toaster position="top-center" />
    </div>
  );
}
