// Looks up a CODM Global player through Codashop's public top-up validation endpoint
// (the same source the old community API wrapped, called directly).
const VALIDATE_URL = "https://order-sg.codashop.com/validate";

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function validate(userId, country) {
  const res = await fetch(VALIDATE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      country,
      voucherTypeName: "CALL_OF_DUTY_MOBILE_WL",
      whiteLabelId: "1",
      deviceId: crypto.randomUUID(),
      userId,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
  return res.json();
}

// Codashop answers with the player's home country when it differs from the one asked for,
// so follow that hint a couple of times.
async function lookup(query) {
  let country = "IN";
  for (let hop = 0; hop < 3; hop++) {
    const data = await validate(query, country);
    if (data.errorCode == -200 && data.homeBaseCountry2Name) {
      country = data.homeBaseCountry2Name;
      continue;
    }
    if (data.success === false || !data.result) return null;
    return { ...data.result, country };
  }
  return null;
}

export default async (req) => {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (!q || q.length > 40) return json(400, { error: "Enter a nickname or UID (max 40 characters)." });

  try {
    let p = await lookup(q);
    // A UID lookup sometimes returns only the username; look that up for the full profile.
    if (p && !p.nickname && p.username) p = (await lookup(p.username)) || { nickname: p.username, country: p.country };
    if (!p) return json(404, { error: "No player found with that nickname or UID." });

    return json(200, {
      nickname: p.nickname,
      uid: p.shortId ?? null,
      avatar: p.picUrl || null,
      country: p.country ?? null,
      level: p.level ?? null,
      levelIcon: p.customLevelImageUrl || null,
      rank: p.customReadableMpRank || null,
      rankIcon: p.customMpRankImageUrl || null,
      rankClass: p.rankClass ?? null,
      rating: p.rating ?? null,
    });
  } catch {
    return json(502, { error: "The profile service is not responding right now. Try again in a minute." });
  }
};

export const config = { path: "/api/player" };
