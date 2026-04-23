/**
 * Create Discord channels for Viewpulse and update all crons + openclaw-deploy.
 * Run: node scripts/viewpulse-channels.js
 */

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('/data/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.channels?.discord?.token;
const GUILD_ID = '1484900471008133262';

if (!TOKEN) { console.error('No Discord token'); process.exit(1); }

async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  // ── 1. Viewpulse category — create dev/social channels ──
  // Existing viewpulse category: 1484900968746188820
  // Existing channel: #marketing (1485514056243613797)
  const viewpulseCatId = '1484900968746188820';

  const vpDev = await api('POST', `/guilds/${GUILD_ID}/channels`, {
    name: '📌-viewpulse-dev',
    type: 0,
    parent_id: viewpulseCatId,
    position: 1,
  });
  console.log('✅ #📌-viewpulse-dev →', vpDev.id);

  const vpSocial = await api('POST', `/guilds/${GUILD_ID}/channels`, {
    name: '📌-viewpulse-social',
    type: 0,
    parent_id: viewpulseCatId,
    position: 2,
  });
  console.log('✅ #📌-viewpulse-social →', vpSocial.id);

  // Update DB
  const {Client} = require('pg');
  const c = new Client({
    host: 'x0k4w8404wckwwcswg808gco',
    user: 'postgres',
    password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
    database: 'projects'
  });
  await c.connect();
  await c.query('UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2, discord_social_channel_id=$3 WHERE id=28',
    ['1485514056243613797', vpDev.id, vpSocial.id]);
  console.log('✅ Viewpulse (28) channels updated in DB');

  // Also update DnDate (15) — add it to the active project list for crons
  // DnDate already has channels set up but is Launch stage. Include it anyway since it has active todos.
  await c.query("UPDATE \"TODO\" SET agent_type='cto' WHERE \"Projects_id\"=15 AND agent_type IS NULL");
  await c.query("UPDATE \"TODO\" SET agent_type='cmo' WHERE \"Projects_id\"=15 AND agent_type IS NULL AND phase IN ('distribute','research')");
  console.log('✅ DnDate (15) todos tagged');

  await c.end();

  // Save results
  fs.writeFileSync('/data/workspace/scripts/viewpulse-channel-ids.json', JSON.stringify({
    viewpulse_dev: vpDev.id,
    viewpulse_social: vpSocial.id,
  }, null, 2));

  console.log('\n✅ Viewpulse setup complete');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
