/**
 * Create Discord channels for Chef Rachkovan, Yev's Personal Brand
 * and standardize existing channel names/emojis.
 */
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('/data/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.channels?.discord?.token;
const GUILD_ID = '1484900471008133262';

if (!TOKEN) { console.error('No Discord token'); process.exit(1); }

async function api(method, path, body) {
  const opts = { method, headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function createChannel(name, type, parentId, position) {
  return api('POST', `/guilds/${GUILD_ID}/channels`, {
    name,
    type: type || 0,
    ...(parentId ? { parent_id: parentId } : {}),
    ...(position !== null && position !== undefined ? { position } : {}),
  });
}

async function main() {
  console.log('🔧 Creating channels for Chef Rachkovan + Yev Personal Brand...\n');

  // ── 1. Create "🍳 Chef Rachkovan" category ──
  const chefCat = await createChannel('🍳 Chef Rachkovan', 4, null, 7);
  console.log('✅ Chef Rachkovan category:', chefCat.id);

  const chefGeneral = await createChannel('📌-chef-rachkovan-general', 0, chefCat.id, 0);
  const chefDev = await createChannel('🔧-chef-rachkovan-dev', 0, chefCat.id, 1);
  const chefSocial = await createChannel('📣-chef-rachkovan-social', 0, chefCat.id, 2);
  console.log('✅ #📌-chef-rachkovan-general:', chefGeneral.id);
  console.log('✅ #🔧-chef-rachkovan-dev:', chefDev.id);
  console.log('✅ #📣-chef-rachkovan-social:', chefSocial.id);

  // ── 2. Add channels to Yev Personal Brand category ──
  // yev-personal category: 1484900785396649994
  const ypbCatId = '1484900785396649994';

  const personalBrandCh = await createChannel('📝-personal-brand', 0, ypbCatId, 8);
  console.log('✅ #📝-personal-brand:', personalBrandCh.id);

  const prCh = await createChannel('📣-pr', 0, ypbCatId, 9);
  console.log('✅ #📣-pr:', prCh.id);

  // ── 3. Standardize Self-Degree channel names ──
  // Current: #📌-self-degree-general, #📌-self-degree-dev, #📌-self-degree-social
  // Standardize: #📌-self-degree (general), #🔧-self-degree-dev, #📣-self-degree-social
  // And add #📖-framework (already created)
  const sdCatId = '1484900592093761657';

  // Rename existing self-degree dev channel (under self-degree category)
  // The existing #development channel for self-degree is at 1484963402555199498
  // But it's in self-degree category already, just rename it
  await api('PATCH', '/channels/1484963402555199498', { name: '🔧-self-degree-dev' });
  console.log('✅ Renamed #development → #🔧-self-degree-dev');

  await api('PATCH', '/channels/1496980098371420200', { name: '📌-self-degree' });
  console.log('✅ Renamed #📌-self-degree-general → #📌-self-degree');

  await api('PATCH', '/channels/1496980100577624117', { name: '📣-self-degree-social' });
  console.log('✅ Renamed #📌-self-degree-social → #📣-self-degree-social');

  // ── 4. Standardize DnDate channel names ──
  await api('PATCH', '/channels/1496980086216327209', { name: '📌-dndate' });
  await api('PATCH', '/channels/1496980087524823094', { name: '📣-dndate-social' });
  console.log('✅ DnDate channel names standardized');

  // ── 5. Standardize SOCOS channel names ──
  await api('PATCH', '/channels/1496980090775666860', { name: '📌-socos-crm' });
  await api('PATCH', '/channels/1496980092130295828', { name: '🔧-socos-crm-dev' });
  await api('PATCH', '/channels/1496980093204037776', { name: '📣-socos-crm-social' });
  console.log('✅ SOCOS channel names standardized');

  // ── 6. Standardize Unvibe channel names ──
  await api('PATCH', '/channels/1496980094655135958', { name: '📌-unvibe' });
  await api('PATCH', '/channels/1496980096001507398', { name: '🔧-unvibe-dev' });
  await api('PATCH', '/channels/1496980097381699765', { name: '📣-unvibe-social' });
  console.log('✅ Unvibe channel names standardized');

  // ── 7. Standardize Viewpulse channel names ──
  await api('PATCH', '/channels/1496984581562302614', { name: '🔧-viewpulse-dev' });
  await api('PATCH', '/channels/1496984582950486057', { name: '📣-viewpulse-social' });
  console.log('✅ Viewpulse channel names standardized');

  // ── 8. Update yev-personal channel names ──
  // Existing: #pr (1484964638633492510), #social-media (1484964706920697987), #assistant (1484964875125133415)
  // #trainer (1484964995723694231), #research (1484965108940542195)
  await api('PATCH', '/channels/1484964638633492510', { name: '📣-pr' });
  await api('PATCH', '/channels/1484964706920697987', { name: '📱-social-media' });
  await api('PATCH', '/channels/1484964875125133415', { name: '🤖-assistant' });
  await api('PATCH', '/channels/1484964995723694231', { name: '🏋️-trainer' });
  await api('PATCH', '/channels/1484965108940542195', { name: '🔬-research' });
  console.log('✅ yev-personal channel names standardized');

  // Save all channel IDs
  const channelIds = {
    self_degree: {
      project_id: 9,
      category_id: '1484900592093761657',
      general: '1496980098371420200',  // will be renamed to 📌-self-degree
      dev: '1484963402555199498',      // will be renamed to 🔧-self-degree-dev
      social: '1496980100577624117',   // will be renamed to 📣-self-degree-social
      framework: '1496990931470254100', // new #📖-framework channel
    },
    chef_rachkovan: {
      project_id: 27,
      category_id: chefCat.id,
      general: chefGeneral.id,
      dev: chefDev.id,
      social: chefSocial.id,
    },
    yev_personal_brand: {
      project_id: 12,
      category_id: ypbCatId,
      personal_brand: personalBrandCh.id,
      pr: prCh.id,
    },
    dndate: {
      project_id: 15,
      general: '1496980086216327209',
      dev: '1485514034227712061',
      social: '1496980087524823094',
    },
    socos: {
      project_id: 16,
      general: '1496980090775666860',
      dev: '1496980092130295828',
      social: '1496980093204037776',
    },
    unvibe: {
      project_id: 29,
      general: '1496980094655135958',
      dev: '1496980096001507398',
      social: '1496980097381699765',
    },
    viewpulse: {
      project_id: 28,
      dev: '1496984581562302614',
      social: '1496984582950486057',
    },
  };

  fs.writeFileSync('/data/workspace/scripts/all-channel-ids.json', JSON.stringify(channelIds, null, 2));

  // Update DB for Chef Rachkovan (id=27)
  const { Client } = require('pg');
  const c = new Client({
    host: 'x0k4w8404wckwwcswg808gco',
    user: 'postgres',
    password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
    database: 'projects'
  });
  await c.connect();
  await c.query(
    'UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2, discord_social_channel_id=$3, discord_category_id=$4 WHERE id=27',
    [chefGeneral.id, chefDev.id, chefSocial.id, chefCat.id]
  );
  console.log('✅ Chef Rachkovan (27) channels updated in DB');

  // Yev's Personal Brand (id=12)
  await c.query(
    'UPDATE "Projects" SET discord_channel_id=$1, discord_social_channel_id=$2, discord_category_id=$3 WHERE id=12',
    [personalBrandCh.id, prCh.id, ypbCatId]
  );
  console.log('✅ Yev Personal Brand (12) channels updated in DB');

  // Also update Self-Degree (id=9) channel IDs
  await c.query(
    'UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2, discord_social_channel_id=$3 WHERE id=9',
    ['1496980098371420200', '1484963402555199498', '1496980100577624117']
  );
  console.log('✅ Self-Degree (9) channel IDs updated');

  await c.end();
  console.log('\n✅ All channels created and standardized!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
