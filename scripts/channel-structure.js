/**
 * Full channel structure fix and CRM cron setup.
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
    name, type: type || 0,
    ...(parentId ? { parent_id: parentId } : {}),
    ...(position !== undefined ? { position } : {}),
  });
}

async function renameChannel(channelId, newName) {
  return api('PATCH', `/channels/${channelId}`, { name: newName });
}

async function deleteChannel(channelId) {
  return api('DELETE', `/channels/${channelId}`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const D = 500; // delay between ops

  // ── 1. Rename social→marketing ──
  await renameChannel('1496980100577624117', '📣-self-degree-marketing');
  console.log('✅ → #📣-self-degree-marketing'); await sleep(D);

  await renameChannel('1496980087524823094', '📣-dndate-marketing');
  console.log('✅ → #📣-dndate-marketing'); await sleep(D);

  await renameChannel('1496980093204037776', '📣-socos-crm-marketing');
  console.log('✅ → #📣-socos-crm-marketing'); await sleep(D);

  await renameChannel('1496980097381699765', '📣-unvibe-marketing');
  console.log('✅ → #📣-unvibe-marketing'); await sleep(D);

  await renameChannel('1496984582950486057', '📣-viewpulse-marketing');
  console.log('✅ → #📣-viewpulse-marketing'); await sleep(D);

  await renameChannel('1496991148730748949', '📣-chef-rachkovan-marketing');
  console.log('✅ → #📣-chef-rachkovan-marketing'); await sleep(D);

  // ── 2. Add missing #marketing and #social channels ──
  // DnDate category: 1484900894280781944
  const dnMarketing = await createChannel('📣-dndate-marketing', 0, '1484900894280781944', 2);
  console.log('✅ #📣-dndate-marketing:', dnMarketing.id); await sleep(D);

  const dnSocial = await createChannel('📱-dndate-social', 0, '1484900894280781944', 3);
  console.log('✅ #📱-dndate-social:', dnSocial.id); await sleep(D);

  // Viewpulse: rename existing #marketing → marketing, add social
  await renameChannel('1485514056243613797', '📣-viewpulse-marketing');
  console.log('✅ → #📣-viewpulse-marketing'); await sleep(D);

  const vpSocial = await createChannel('📱-viewpulse-social', 0, '1484900968746188820', 2);
  console.log('✅ #📱-viewpulse-social:', vpSocial.id); await sleep(D);

  // ── 3. Add #general where missing ──
  // Viewpulse #general
  const vpGeneral = await createChannel('📌-viewpulse', 0, '1484900968746188820', 0);
  console.log('✅ #📌-viewpulse:', vpGeneral.id); await sleep(D);

  // DnDate #general + rename dev
  await renameChannel('1485514034227712061', '🔧-dndate-dev');
  console.log('✅ → #🔧-dndate-dev'); await sleep(D);

  const dnGeneral = await createChannel('📌-dndate', 0, '1484900894280781944', 0);
  console.log('✅ #📌-dndate:', dnGeneral.id); await sleep(D);

  // Unvibe #general + #dev
  const unvGeneral = await createChannel('📌-unvibe', 0, '1493543617296597002', 0);
  console.log('✅ #📌-unvibe:', unvGeneral.id); await sleep(D);

  const unvDev = await createChannel('🔧-unvibe-dev', 0, '1493543617296597002', 1);
  console.log('✅ #🔧-unvibe-dev:', unvDev.id); await sleep(D);

  // SOCOS: rename general + add marketing + social
  await renameChannel('1496980090775666860', '📌-socos-crm');
  console.log('✅ → #📌-socos-crm'); await sleep(D);

  const socosMarketing = await createChannel('📣-socos-crm-marketing', 0, '1488926184497745961', 2);
  console.log('✅ #📣-socos-crm-marketing:', socosMarketing.id); await sleep(D);

  const socosSocial = await createChannel('📱-socos-crm-social', 0, '1488926184497745961', 3);
  console.log('✅ #📱-socos-crm-social:', socosSocial.id); await sleep(D);

  // ── 4. Delete duplicate pr in yev-personal ──
  await deleteChannel('1496991150890942578');
  console.log('🗑 Deleted duplicate #📣-pr'); await sleep(D);

  // ── 5. Add yev-personal missing channels ──
  const ypbCat = '1484900785396649994';

  const ypbGeneral = await createChannel('📌-general', 0, ypbCat, 10);
  console.log('✅ #📌-general (yev-personal):', ypbGeneral.id); await sleep(D);

  // Existing #pr (1484964638633492510) → #marketing
  await renameChannel('1484964638633492510', '📣-ypb-marketing');
  console.log('✅ → #📣-ypb-marketing'); await sleep(D);

  const ypbSocial = await createChannel('📱-ypb-social', 0, ypbCat, 12);
  console.log('✅ #📱-ypb-social:', ypbSocial.id); await sleep(D);

  const ypbDev = await createChannel('🔧-ypb-dev', 0, ypbCat, 13);
  console.log('✅ #🔧-ypb-dev:', ypbDev.id); await sleep(D);

  // ── 6. Chef Rachkovan: add missing channels ──
  const allCh = await api('GET', `/guilds/${GUILD_ID}/channels`);
  const chefCat = allCh.find(c => c.name.includes('chef') && c.type === 4);

  if (chefCat) {
    // Rename existing #development → #dev
    await renameChannel('1489594856371130449', '🔧-chef-rachkovan-dev');
    console.log('✅ → #🔧-chef-rachkovan-dev'); await sleep(D);

    const chefGeneral = await createChannel('📌-chef-rachkovan', 0, chefCat.id, 0);
    console.log('✅ #📌-chef-rachkovan:', chefGeneral.id); await sleep(D);

    const chefMarketing = await createChannel('📣-chef-rachkovan-marketing', 0, chefCat.id, 2);
    console.log('✅ #📣-chef-rachkovan-marketing:', chefMarketing.id); await sleep(D);

    const chefSocial = await createChannel('📱-chef-rachkovan-social', 0, chefCat.id, 3);
    console.log('✅ #📱-chef-rachkovan-social:', chefSocial.id); await sleep(D);

    fs.writeFileSync('/data/workspace/scripts/chef-channel-ids.json', JSON.stringify({
      category_id: chefCat.id,
      general: chefGeneral.id, dev: '1489594856371130449',
      marketing: chefMarketing.id, social: chefSocial.id,
    }, null, 2));
  }

  // ── 7. Save all channel IDs ──
  const channelIds = {
    crm_channel_id: '1496991114748493967',
    yev_personal_brand: {
      project_id: 12, category_id: ypbCat,
      general: ypbGeneral.id, dev: ypbDev.id,
      marketing: '1484964638633492510', social: ypbSocial.id,
      crm: '1496991114748493967',
    },
    dndate: {
      project_id: 15, category_id: '1484900894280781944',
      general: dnGeneral.id, dev: '1485514034227712061',
      marketing: dnMarketing.id, social: dnSocial.id,
    },
    socos: {
      project_id: 16, category_id: '1488926184497745961',
      general: '1496980090775666860', dev: '1496980092130295828',
      marketing: socosMarketing.id, social: socosSocial.id,
    },
    viewpulse: {
      project_id: 28, category_id: '1484900968746188820',
      general: vpGeneral.id, dev: '1496984581562302614',
      marketing: '1485514056243613797', social: vpSocial.id,
    },
    unvibe: {
      project_id: 29, category_id: '1493543617296597002',
      general: unvGeneral.id, dev: unvDev.id,
      marketing: '1496980097381699765', social: '1496980097381699765',
    },
  };

  fs.writeFileSync('/data/workspace/scripts/all-channel-ids.json', JSON.stringify(channelIds, null, 2));

  // ── 8. Update DB ──
  const { Client } = require('pg');
  const c = new Client({
    host: 'x0k4w8404wckwwcswg808gco',
    user: 'postgres',
    password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
    database: 'projects'
  });
  await c.connect();

  // Update Viewpulse (28) — add general channel
  await c.query('UPDATE "Projects" SET discord_channel_id=$1 WHERE id=28', [vpGeneral.id]);
  console.log('✅ Viewpulse general updated in DB');

  // Update DnDate (15) — add general channel, fix dev
  await c.query('UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2 WHERE id=15', [dnGeneral.id, '1485514034227712061']);
  console.log('✅ DnDate channels updated in DB');

  // Update SOCOS (16) — fix general naming (already has IDs)
  await c.query('UPDATE "Projects" SET discord_channel_id=$1 WHERE id=16', ['1496980090775666860']);
  console.log('✅ SOCOS general updated in DB');

  // Update Unvibe (29) — add general + dev
  await c.query('UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2 WHERE id=29', [unvGeneral.id, unvDev.id]);
  console.log('✅ Unvibe channels updated in DB');

  // Update Yev Personal Brand (12) — general + crm
  await c.query('UPDATE "Projects" SET discord_channel_id=$1, discord_dev_channel_id=$2 WHERE id=12',
    [ypbGeneral.id, ypbDev.id]);
  console.log('✅ Yev Personal Brand general/dev updated in DB');

  // Also save CRM channel for cron
  fs.writeFileSync('/data/workspace/scripts/crm-channel-ids.json', JSON.stringify({
    personal_crm_channel_id: '1496991114748493967',
    personal_crm_project_id: 12,
  }, null, 2));

  await c.end();
  console.log('\n✅ All channel fixes complete!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
