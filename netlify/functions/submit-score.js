import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  let body = {};
  try { body = await req.json(); } catch (e) {}
  const name = (body.name || body.player || "Player").toString().slice(0, 40);
  const score = Number(body.score) || 0;

  const store = getStore("leaderboard");
  let data = [];
  try {
    const raw = await store.get("scores.json");
    if (raw) data = JSON.parse(raw);
  } catch (e) { data = []; }

  const existing = data.find(p => p.name === name);
  if (existing) existing.score = Math.max(existing.score|0, score|0);
  else data.push({ name, score, ts: Date.now() });

  data.sort((a,b)=>(b.score||0)-(a.score||0));
  await store.setJSON("scores.json", data);

  return new Response(JSON.stringify({ ok:true, leaderboard: data.slice(0,100) }), {
    headers: { "Content-Type": "application/json" }
  });
}
