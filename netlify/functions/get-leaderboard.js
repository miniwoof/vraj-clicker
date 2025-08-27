import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  const store = getStore("leaderboard");
  let data = [];
  try {
    const raw = await store.get("scores.json");
    if (raw) data = JSON.parse(raw);
  } catch (e) { data = []; }
  data.sort((a,b)=>(b.score||0)-(a.score||0));
  return new Response(JSON.stringify(data.slice(0,100)), {
    headers: { "Content-Type": "application/json" }
  });
}
