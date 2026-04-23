/**
 * Build the complete Discord channel structure for MVP startups + self-development.
 * Run: node scripts/build-discord-structure.js
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

async function createChannel(name, type = 0, parentId = null, position = null) {
  return api('POST', `/guilds/${GUILD_ID}/channels`, {
    name,
    type,
    ...(parentId ? { parent_id: parentId } : {}),
    ...(position !== null ? { position } : {}),
  });
}

async function deleteChannel(channelId) {
  return api('DELETE', `/channels/${channelId}`);
}

async function main() {
  console.log('🔧 Building Discord channel structure...\n');

  // ── 1. DELETE the wrong "🚀 MVP Startups" category I just created ──
  const channelsToDelete = [
    '1496976986005049397', '1496976987451822141', '1496976988802519130',
    '1496976989876387951', '1496976990924701816', '1496976991927144539',
    '1496976993068257401', '1496976994053918891', '1496976995228324021',
    '1496976996419244032', '1496976997782388766', '1496976998822838492',
  ];
  for (const id of channelsToDelete) {
    try {
      await deleteChannel(id);
      console.log(`🗑 Deleted channel ${id}`);
    } catch (e) { /* already deleted or not found */ }
  }
  try {
    await deleteChannel('1496976985144955071');
    console.log('🗑 Deleted duplicate MVP category 1496976985144955071');
  } catch (e) {}
  try {
    await deleteChannel('1496976899983802479');
    console.log('🗑 Deleted MVP category 1496976899983802479');
  } catch (e) {}

  // ── 2. Create "Self-Development" category ──
  const selfDevCat = await createChannel('🌱 Self-Development', 4, null, 6);
  console.log('✅ Self-Development category:', selfDevCat.id);

  const selfDevChannels = [
    '🤖 ai',           // AI & LLMs
    '🎓 future-of-education', // Future of learning
    '🕹️ gamification',  // Gamification in products/learning
    '☸️ buddhism',      // Buddhism & mindfulness
    '🧬 biohacking',    // Health optimization
    '💻 open-source',   // OSS projects, contributions
    '🏖️ digital-nomading', // Remote work, location independence
  ];
  for (let i = 0; i < selfDevChannels.length; i++) {
    const ch = await createChannel(selfDevChannels[i], 0, selfDevCat.id, i);
    console.log(`  ✅ #${selfDevChannels[i]} → ${ch.id}`);
  }

  // ── 3. DnDate category — move existing channels, add missing ones ──
  // DnDate's existing category is 1484900894280781944 with marketing + development
  const dndateCatId = '1484900894280781944';

  // Add missing: #general (dndate), #social (dndate)
  const dndateChannels = {};
  const dndateGeneral = await createChannel('📌-dndate-general', 0, dndateCatId, 0);
  const dndateSocial = await createChannel('📌-dndate-social', 0, dndateCatId, 3);
  dndateChannels.general = dndateGeneral.id;
  dndateChannels.social = dndateSocial.id;

  // Find existing dev channel (under dndate)
  const existingDev = await api('GET', `/channels/${dndateCatId}`);
  // We know development channel id is 1485514034227712061
  dndateChannels.dev = '1485514034227712061';

  console.log('✅ DnDate category complete:', dndateCatId);
  console.log('   general →', dndateGeneral.id);
  console.log('   dev →', dndateChannels.dev);
  console.log('   social →', dndateSocial.id);

  // ── 4. SOCOS category — add missing channels ──
  // SOCOS category is 1488926184497745961 with development
  const socosCatId = '1488926184497745961';
  const socosGeneral = await createChannel('📌-socos-crm-general', 0, socosCatId, 0);
  const socosDev = await createChannel('📌-socos-crm-dev', 0, socosCatId, 1);
  const socosSocial = await createChannel('📌-socos-crm-social', 0, socosCatId, 2);
  console.log('✅ SOCOS CRM category complete');
  console.log('   general →', socosGeneral.id);
  console.log('   dev →', socosDev.id);
  console.log('   social →', socosSocial.id);

  // ── 5. Unvibe category — create new, add all channels ──
  // Existing unvibe category is 1493543617296597002 with unvibe channel (which is the text channel)
  const unvibeCatId = '1493543617296597002';
  // Add missing dev and social channels
  const unvibeGeneral = await createChannel('📌-unvibe-general', 0, unvibeCatId, 0);
  const unvibeDev = await createChannel('📌-unvibe-dev', 0, unvibeCatId, 2);
  const unvibeSocial = await createChannel('📌-unvibe-social', 0, unvibeCatId, 3);
  console.log('✅ Unvibe category complete');
  console.log('   general →', unvibeGeneral.id);
  console.log('   dev →', unvibeDev.id);
  console.log('   social →', unvibeSocial.id);

  // ── 6. Self-Degree category (existing) ──
  // Category: 1484900592093761657 — channels: marketing, development, product, research, directory-entry, tutor-sales, student-sales
  // Add #general + #social
  const sdCatId = '1484900592093761657';
  const sdGeneral = await createChannel('📌-self-degree-general', 0, sdCatId, 0);
  const sdDev = await createChannel('📌-self-degree-dev', 0, sdCatId, 1); // development already exists at 1484963402555199498
  const sdSocial = await createChannel('📌-self-degree-social', 0, sdCatId, 2);
  console.log('✅ Self-Degree category complete');
  console.log('   general →', sdGeneral.id);
  console.log('   dev →', '1484963402555199498 (existing)');
  console.log('   social →', sdSocial.id);

  // ── Save results ──
  const results = {
    self_development: {
      category_id: selfDevCat.id,
      channels: {
        ai: selfDevChannels[0] ? (await createChannel('🤖 ai', 0, selfDevCat.id)).id : null,
        future_of_education: null, future_of_education_id: selfDevChannels[1] || null,
        gamification: null, buddhism: null, biohacking: null, open_source: null, digital_nomading: null,
      }
    },
    projects: {
      14: { name: 'Self-Degree', category_id: sdCatId, general_id: sdGeneral.id, dev_id: '1484963402555199498', social_id: sdSocial.id },
      15: { name: 'DnDate', category_id: dndateCatId, general_id: dndateGeneral.id, dev_id: '1485514034227712061', social_id: dndateSocial.id },
      16: { name: 'SOCOS CRM', category_id: socosCatId, general_id: socosGeneral.id, dev_id: socosDev.id, social_id: socosSocial.id },
      29: { name: 'Unvibe', category_id: unvibeCatId, general_id: unvibeGeneral.id, dev_id: unvibeDev.id, social_id: unvibeSocial.id },
    }
  };
  fs.writeFileSync('/data/workspace/scripts/discord-structure-complete.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Saved to scripts/discord-structure-complete.json');
  console.log('\n✅ Discord structure built!');
}

main().catch(e => { console.error('\n❌ Error:', e.message); process.exit(1); });
