// ═══ PALATE / FLAVOR PROFILE SYSTEM ═══
// Analyzes a user's rated cigars to build an evolving taste profile,
// then recommends cigars from the database that match their preferences.

import CIGAR_DATA from "./cigarDatabase";

const avgRating = (ratings) => {
  if (!ratings) return 0;
  const v = Object.values(ratings).filter(x => typeof x === "number" && x > 0);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
};

// Minimum rated cigars before a profile is generated
export const PALATE_MIN = 5;

// Build a weighted preference map for a given attribute (wrapper, strength, origin, shape).
// Each cigar contributes its rating as weight; higher-rated cigars pull the profile toward their attributes.
function weightedPreference(ratedCigars, attr) {
  const scores = {}; // attribute value -> { totalScore, count }
  ratedCigars.forEach(c => {
    const val = c[attr];
    if (!val) return;
    const r = avgRating(c.ratings);
    if (!scores[val]) scores[val] = { total: 0, count: 0 };
    scores[val].total += r;
    scores[val].count += 1;
  });
  // Convert to average rating per value, but also keep count for confidence
  const result = Object.entries(scores).map(([value, { total, count }]) => ({
    value,
    avg: total / count,
    count,
    // weighted score favors things rated highly AND often
    weight: (total / count) * Math.log2(count + 1),
  }));
  result.sort((a, b) => b.weight - a.weight);
  return result;
}

// Map strength labels to a numeric body scale for "preferred body" calculation
const STRENGTH_SCALE = {
  "Mild": 1, "Mild-Medium": 2, "Medium": 3, "Medium-Full": 4, "Full": 5,
};
const SCALE_TO_LABEL = { 1: "Mild", 2: "Mild-Medium", 3: "Medium", 4: "Medium-Full", 5: "Full" };

// Build the full palate profile
export function buildPalate(cigars) {
  const rated = cigars.filter(c => c.ratings && Object.values(c.ratings).some(v => v > 0));
  if (rated.length < PALATE_MIN) {
    return { ready: false, count: rated.length, needed: PALATE_MIN };
  }

  const wrappers = weightedPreference(rated, "wrapper");
  const origins = weightedPreference(rated, "origin");
  const shapes = weightedPreference(rated, "shape");
  const strengths = weightedPreference(rated, "strength");
  const brands = weightedPreference(rated, "brand");

  // Preferred body: weighted average of strength scale by rating
  let bodyTotal = 0, bodyWeight = 0;
  rated.forEach(c => {
    const s = STRENGTH_SCALE[c.strength];
    if (s) { const r = avgRating(c.ratings); bodyTotal += s * r; bodyWeight += r; }
  });
  const bodyScore = bodyWeight ? bodyTotal / bodyWeight : 3;
  const preferredBody = SCALE_TO_LABEL[Math.round(bodyScore)] || "Medium";

  // Which rating categories does this person care about most? (highest avg sub-scores)
  const catTotals = {};
  rated.forEach(c => {
    Object.entries(c.ratings || {}).forEach(([k, v]) => {
      if (v > 0) { if (!catTotals[k]) catTotals[k] = { total: 0, count: 0 }; catTotals[k].total += v; catTotals[k].count += 1; }
    });
  });

  // Average overall rating across all rated cigars
  const overallAvg = rated.reduce((s, c) => s + avgRating(c.ratings), 0) / rated.length;

  return {
    ready: true,
    count: rated.length,
    topWrapper: wrappers[0]?.value || null,
    wrappers: wrappers.slice(0, 3),
    topOrigin: origins[0]?.value || null,
    origins: origins.slice(0, 3),
    topShape: shapes[0]?.value || null,
    shapes: shapes.slice(0, 3),
    topBrand: brands[0]?.value || null,
    brands: brands.slice(0, 3),
    preferredBody,
    bodyScore,
    overallAvg,
    strengths: strengths.slice(0, 3),
  };
}

// Generate a human-readable summary sentence from the palate
export function palateSummary(palate) {
  if (!palate.ready) return "";
  const parts = [];
  if (palate.preferredBody) parts.push(`${palate.preferredBody}-bodied`);
  if (palate.topWrapper) parts.push(`${palate.topWrapper} wrapper`);
  let sentence = `You gravitate toward ${parts.join(", ")} cigars`;
  if (palate.topOrigin) sentence += ` from ${palate.topOrigin}`;
  sentence += ".";
  return sentence;
}

// Score a candidate cigar from the database against the palate (0-100)
function scoreCandidate(cigar, palate) {
  let score = 0, max = 0;
  // Wrapper match (weight 35)
  max += 35;
  const wMatch = palate.wrappers.find(w => w.value === cigar.wrapper);
  if (wMatch) score += 35 * (palate.wrappers.indexOf(wMatch) === 0 ? 1 : palate.wrappers.indexOf(wMatch) === 1 ? 0.6 : 0.35);
  // Strength/body match (weight 30) - closer on the scale = higher
  max += 30;
  const candScale = STRENGTH_SCALE[cigar.strength] || 3;
  const bodyDiff = Math.abs(candScale - palate.bodyScore);
  score += 30 * Math.max(0, 1 - bodyDiff / 4);
  // Origin match (weight 20)
  max += 20;
  const oMatch = palate.origins.find(o => o.value === cigar.origin);
  if (oMatch) score += 20 * (palate.origins.indexOf(oMatch) === 0 ? 1 : palate.origins.indexOf(oMatch) === 1 ? 0.6 : 0.35);
  // Shape match (weight 15)
  max += 15;
  const sMatch = palate.shapes.find(s => s.value === cigar.shape);
  if (sMatch) score += 15 * (palate.shapes.indexOf(sMatch) === 0 ? 1 : 0.5);
  return Math.round((score / max) * 100);
}

// Recommend cigars from the database, excluding ones the user already has
export function recommendCigars(palate, userCigars, limit = 6) {
  if (!palate.ready) return [];
  const ownedNames = new Set(userCigars.map(c => (c.name || "").toLowerCase()));
  const scored = CIGAR_DATA
    .filter(c => !ownedNames.has(c.name.toLowerCase()))
    .map(c => ({ ...c, matchScore: scoreCandidate(c, palate) }))
    .filter(c => c.matchScore >= 55)
    .sort((a, b) => b.matchScore - a.matchScore);

  // De-duplicate by brand a little so it's not all one brand - keep variety
  const seen = {};
  const diverse = [];
  for (const c of scored) {
    seen[c.brand] = (seen[c.brand] || 0);
    if (seen[c.brand] < 2) { diverse.push(c); seen[c.brand]++; }
    if (diverse.length >= limit) break;
  }
  // If we didn't get enough with the diversity cap, fill from remaining
  if (diverse.length < limit) {
    for (const c of scored) {
      if (!diverse.includes(c)) { diverse.push(c); if (diverse.length >= limit) break; }
    }
  }
  return diverse.slice(0, limit);
}
