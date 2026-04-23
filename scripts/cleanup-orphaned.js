/**
 * Cleanup orphaned channels from wrong Chef Rachkovan category creation.
 * Also update existing crons with correct channel IDs.
 */
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('/data/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.channels?.discord?.token;
const GUILD_ID = '1484900471008133262';

async function api(method, path, body) {
  const opts = { method, headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function deleteChannel(channelId) {
  try {
    await api('DELETE', `/channels/${channelId}`);
    console.log(`🗑 Deleted channel ${channelId}`);
  } catch (e) {
    if (e.message.includes('404')) console.log(`  (already gone: ${channelId})`);
    else console.error(`  Error ${channelId}: ${e.message}`);
  }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, 300)); }

async function main() {
  // Delete the wrong Chef Rachkovan category (1496991144859537499) and its channels
  const wrongCategoryChannels = [
    '1496991146243784807', // 📌-chef-rachkovan-general (wrong category)
    '1496991147585835110', // 🔧-chef-rachkovan-dev
    '1496991148730748949', // 📣-chef-rachkovan-marketing (renamed but in wrong cat)
  ];

  for (const id of wrongCategoryChannels) {
    await deleteChannel(id);
    await sleep(300);
  }

  // Now delete the wrong category itself
  await deleteChannel('1496991144859537499');
  console.log('🗑 Deleted wrong Chef Rachkovan category');

  // Verify the correct channels are in the right category
  const allCh = await api('GET', `/guilds/${GUILD_ID}/channels`);
  const chefCat = allCh.find(c => c.name.includes('chef') && c.type === 4);
  if (chefCat) {
    const chefChildren = allCh.filter(c => c.parent_id === chefCat.id);
    console.log(`\n✅ Correct Chef Rachkovan category (${chefCat.id}) has:`);
    chefChildren.forEach(c => console.log(`  ${c.id} = ${c.name}`));
    fs.writeFileSync('/data/workspace/scripts/chef-channel-ids.json', JSON.stringify({
      category_id: chefCat.id,
      general: chefChildren.find(c => c.name.includes('general') || c.name.includes('chef-rachkovan') && !c.name.includes('dev'))?.id || null,
      dev: chefChildren.find(c => c.name.includes('dev'))?.id || null,
      marketing: chefChildren.find(c => c.name.includes('marketing'))?.id || null,
      social: chefChildren.find(c => c.name.includes('social'))?.id || null,
    }, null, 2));
    console.log('Saved chef-channel-ids.json');
  }

  // Also clean up the old #personal-brand channel (1496991149913800724)
  // It was renamed to general but in the wrong category... wait, actually it was renamed to #📌-personal-brand
  // in the ypb cat. Let me check - it was at 1496991149913800724 = #📌-personal-brand
  // That channel is still in ypb category at 1484900785396649994
  // We don't need it since we created #📌-general at 1496994139810566308
  // But maybe keep it as it's a valid channel
  const ypbChildren = allCh.filter(c => c.parent_id === '1484900785396649994');
  console.log('\nyev-personal children:');
  ypbChildren.forEach(c => console.log(`  ${c.id} = ${c.name}`));
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
