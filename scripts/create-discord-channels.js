/**
 * Creates Discord categories and channels for MVP-stage startups.
 * All channels live under one "🚀 MVP Startups" parent category.
 * Channel naming: #startup-general, #startup-dev, #startup-social
 * Run: node scripts/create-discord-channels.js
 */

const fs = require('fs');
const tokenPath = '/data/.openclaw/openclaw.json';
const config = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
const TOKEN = config.channels?.discord?.token;
const GUILD_ID = '1484900471008133262';

if (!TOKEN) { console.error('No Discord token found'); process.exit(1); }

const BASE = 'https://discord.com/api/v10';

async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  return data;
}

const MVP_PROJECTS = [
  { id: 14, name: 'Self-Degree', emoji: '📚' },
  { id: 15, name: 'DnDate',       emoji: '🎲' },
  { id: 16, name: 'SOCOS CRM',    emoji: '💜' },
  { id: 29, name: 'Unvibe',       emoji: '🧠' },
];

async function main() {
  console.log('🔧 Creating Discord categories + channels for MVP startups...\n');

  // 1. Create parent "🚀 MVP Startups" category
  const parent = await api('POST', `/guilds/${GUILD_ID}/channels`, {
    name: '🚀 MVP Startups',
    type: 4,
    position: 5,
  });
  console.log('✅ Parent category:', parent.id, '|', parent.name);

  const results = {};

  // 2. For each project: 3 channels under the parent category
  for (let i = 0; i < MVP_PROJECTS.length; i++) {
    const p = MVP_PROJECTS[i];
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const channelPosition = i * 3; // interleave channels

    const generalCh = await api('POST', `/guilds/${GUILD_ID}/channels`, {
      name: `${p.emoji}-${slug}-general`,
      type: 0,
      parent_id: parent.id,
      position: channelPosition,
    });
    console.log(`✅ #${p.emoji}-${slug}-general → ${generalCh.id}`);

    const devCh = await api('POST', `/guilds/${GUILD_ID}/channels`, {
      name: `${p.emoji}-${slug}-dev`,
      type: 0,
      parent_id: parent.id,
      position: channelPosition + 1,
    });
    console.log(`✅ #${p.emoji}-${slug}-dev → ${devCh.id}`);

    const socialCh = await api('POST', `/guilds/${GUILD_ID}/channels`, {
      name: `${p.emoji}-${slug}-social`,
      type: 0,
      parent_id: parent.id,
      position: channelPosition + 2,
    });
    console.log(`✅ #${p.emoji}-${slug}-social → ${socialCh.id}`);

    results[p.id] = {
      project_id: p.id,
      project_name: p.name,
      discord_category_id: parent.id,
      discord_channel_id: generalCh.id,
      discord_dev_channel_id: devCh.id,
      discord_social_channel_id: socialCh.id,
    };
  }

  console.log('\n\n📊 Results:');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync('/data/workspace/scripts/discord-channel-ids.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Saved to scripts/discord-channel-ids.json');
  console.log('\n✅ Discord setup complete!');
}

main().catch(e => { console.error('\n❌ Error:', e.message); process.exit(1); });
