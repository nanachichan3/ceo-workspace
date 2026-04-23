/**
 * Clean up duplicate MVP Startups categories.
 * Run: node scripts/cleanup-discord.js
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

async function deleteChannel(id) {
  try {
    await api('DELETE', `/channels/${id}`);
    console.log(`🗑 Deleted channel/category ${id}`);
  } catch (e) {
    if (e.message.includes('404')) console.log(`  (already gone: ${id})`);
    else console.error(`  Error deleting ${id}: ${e.message}`);
  }
}

async function main() {
  console.log('🧹 Cleaning up duplicate MVP Startups categories...\n');

  // Category 1496976899983802479 had channels 1496976899983802479 (cat itself)
  // We already deleted the channels. Now just delete the category.
  // But wait - we need to delete child channels first before deleting the category.
  // Let me just try to delete both categories directly.
  await deleteChannel('1496976899983802479'); // First duplicate category
  await deleteChannel('1496976985144955071'); // Second duplicate category (had the 12 channels)

  console.log('\n✅ Cleanup complete');
}

main().catch(e => { console.error('\n❌ Error:', e.message); process.exit(1); });
