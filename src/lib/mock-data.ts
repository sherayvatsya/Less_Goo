// Mock backend data for LessGoo. Replace with real APIs later.

export type RouteInfo = {
  from: string;
  to: string;
  distanceKm: number;
  hours: number;
  safetyScore: number; // 0-100
  weather: { temp: number; condition: string; rainChance: number };
  alerts: { level: "low" | "medium" | "high"; text: string }[];
  prices: { mode: string; price: number; note: string }[];
};

const presets: Record<string, Partial<RouteInfo>> = {
  "chandigarh-shimla": {
    distanceKm: 113,
    hours: 3.5,
    safetyScore: 78,
    weather: { temp: 14, condition: "Light showers", rainChance: 60 },
    alerts: [
      { level: "medium", text: "Landslide risk near Parwanoo after 6 PM" },
      { level: "low", text: "Slow traffic at Solan bypass" },
      { level: "low", text: "Heavy rain recorded on this stretch last October" },
    ],
  },
};

export function getRouteInfo(from: string, to: string): RouteInfo {
  const key = `${from.trim().toLowerCase()}-${to.trim().toLowerCase()}`;
  const p = presets[key] ?? {};
  // Deterministic pseudo-random from route names
  const seed = [...key].reduce((a, c) => a + c.charCodeAt(0), 0);
  const dist = p.distanceKm ?? 80 + (seed % 400);
  return {
    from,
    to,
    distanceKm: dist,
    hours: p.hours ?? Math.round((dist / 45) * 10) / 10,
    safetyScore: p.safetyScore ?? 65 + (seed % 30),
    weather: p.weather ?? {
      temp: 18 + (seed % 14),
      condition: seed % 2 ? "Clear skies" : "Partly cloudy",
      rainChance: seed % 50,
    },
    alerts: p.alerts ?? [{ level: "low", text: "No major hazards reported right now" }],
    prices: [
      { mode: "Cab", price: Math.round(dist * 14), note: "Verified driver, AC sedan" },
      { mode: "Bus", price: Math.round(dist * 2.2), note: "Volvo, GPS tracked" },
      { mode: "Train", price: Math.round(dist * 1.4), note: "Chair car, where available" },
      { mode: "Hotel / night", price: 1800 + (seed % 9) * 250, note: "Verified, women-safe rated" },
      { mode: "Local guide / day", price: 1200, note: "ID-verified guide" },
    ],
  };
}

export const itineraries = [
  {
    title: "Shimla in a weekend",
    route: "Chandigarh → Shimla",
    days: 2,
    author: "Ananya R.",
    rating: 4.8,
    tip: "Leave before 7 AM to beat Parwanoo traffic.",
    condition: "Good roads, foggy mornings",
  },
  {
    title: "Manali with kids",
    route: "Delhi → Manali",
    days: 5,
    author: "Rohit & family",
    rating: 4.6,
    tip: "Stop overnight at Mandi, the kids will thank you.",
    condition: "Watch for landslides past Aut tunnel",
  },
  {
    title: "Rishikesh solo trip",
    route: "Delhi → Rishikesh",
    days: 3,
    author: "Meera S.",
    rating: 4.9,
    tip: "Tapovan hostels have great solo-traveler check-ins.",
    condition: "Smooth highway",
  },
  {
    title: "Dharamshala monsoon",
    route: "Amritsar → Dharamshala",
    days: 4,
    author: "Kabir J.",
    rating: 4.4,
    tip: "Pack rain covers; trails close after heavy rain.",
    condition: "Slippery after rain",
  },
  {
    title: "Kasol backpacking",
    route: "Chandigarh → Kasol",
    days: 4,
    author: "Tanvi P.",
    rating: 4.7,
    tip: "Carry cash, ATMs are rare past Bhuntar.",
    condition: "Narrow roads, drive slowly",
  },
  {
    title: "Mussoorie quick escape",
    route: "Dehradun → Mussoorie",
    days: 2,
    author: "Arjun K.",
    rating: 4.5,
    tip: "Mall Road is best on weekday evenings.",
    condition: "Clear, busy on weekends",
  },
];

export const emergencyContacts = [
  { name: "National Emergency", phone: "112" },
  { name: "NDRF Helpline", phone: "011-24363260" },
  { name: "Police", phone: "100" },
  { name: "Ambulance", phone: "108" },
  { name: "Women Helpline", phone: "1091" },
  { name: "Tourist Helpline", phone: "1363" },
];

/** Rule-based chatbot reply (mock AI). */
export function botReply(q: string): string {
  const s = q.toLowerCase();
  if (/landslide|flood|earthquake|disaster/.test(s))
    return "Move to higher, open ground away from slopes and rivers. Press the red SOS button to share your location with SDRF/NDRF, police and nearby hospitals.";
  if (/shimla/.test(s))
    return "Chandigarh to Shimla takes about 3.5 hours. Leave early, and avoid the Parwanoo stretch after dark during rain.";
  if (/kid|child|minor/.test(s))
    return "Turn on Guardian Shield: parents get check-ins every 30–60 minutes and one-tap access to the hotel and driver.";
  if (/weather|rain/.test(s))
    return "Search your route at the top of the page to see live weather and rain alerts.";
  if (/price|cost|cheap/.test(s))
    return "Buses are usually the cheapest; cabs are fastest. All prices on LessGoo are verified.";
  if (/hi|hello|hey/.test(s))
    return "Hi! I can help with routes, safety tips and emergencies. Where are you headed?";
  return "Good question! Share your start and destination and I'll suggest a safe route, best time to leave and verified stays.";
}
