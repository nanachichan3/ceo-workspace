/**
 * Update Projects DB and cron jobs with correct channel IDs.
 * Then update openclaw-deploy config.
 */
const fs = require('fs');
const { Client } = require('pg');

const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

// Read the channel IDs
const allIds = JSON.parse(fs.readFileSync('/data/workspace/scripts/all-channel-ids.json', 'utf8'));
const chefIds = JSON.parse(fs.readFileSync('/data/workspace/scripts/chef-channel-ids.json', 'utf8'));
const crmIds = JSON.parse(fs.readFileSync('/data/workspace/scripts/crm-channel-ids.json', 'utf8'));

async function main() {
  const c = new Client(CREDS);
  await c.connect();

  // ── 1. Update Chef Rachkovan (27) ──
  await c.query(
    `UPDATE "Projects" SET
      discord_channel_id = $1,
      discord_dev_channel_id = $2,
      discord_social_channel_id = $3,
      discord_category_id = $4
    WHERE id = 27`,
    [chefIds.general, chefIds.dev, chefIds.marketing, chefIds.category_id]
  );
  console.log('✅ Chef Rachkovan (27) updated:', JSON.stringify(chefIds));

  // ── 2. Update DnDate (15) ──
  await c.query(
    `UPDATE "Projects" SET
      discord_channel_id = $1,
      discord_dev_channel_id = $2,
      discord_social_channel_id = $3
    WHERE id = 15`,
    [allIds.dndate.general, allIds.dndate.dev, allIds.dndate.social]
  );
  console.log('✅ DnDate (15) general updated:', allIds.dndate.general);

  // ── 3. Verify all projects ──
  const res = await c.query(
    `SELECT id, title, discord_channel_id, discord_dev_channel_id, discord_social_channel_id
     FROM "Projects" WHERE id IN (9,12,15,16,27,28,29) ORDER BY id`
  );
  console.log('\n📋 Updated projects:');
  res.rows.forEach(r => console.log(`  ${r.title} (${r.id}): general=${r.discord_channel_id} dev=${r.discord_dev_channel_id} social=${r.discord_social_channel_id}`));

  await c.end();

  // ── 4. Save full channel map for crons ──
  const fullChannelMap = {
    // Project channels
    self_degree: { project_id: 9, general: '1496980098371420200', dev: '1484963402555199498', marketing: '1496980100577624117' },
    dndate: { project_id: 15, general: allIds.dndate.general, dev: allIds.dndate.dev, marketing: allIds.dndate.marketing, social: allIds.dndate.social },
    socos: { project_id: 16, general: '1496980090775666860', dev: '1496980092130295828', marketing: allIds.socos.marketing, social: allIds.socos.social },
    viewpulse: { project_id: 28, general: allIds.viewpulse.general, dev: allIds.viewpulse.dev, marketing: allIds.viewpulse.marketing, social: allIds.viewpulse.social },
    unvibe: { project_id: 29, general: allIds.unvibe.general, dev: allIds.unvibe.dev, marketing: allIds.unvibe.marketing, social: allIds.unvibe.social },
    chef_rachkovan: { project_id: 27, category_id: chefIds.category_id, general: chefIds.general, dev: chefIds.dev, marketing: chefIds.marketing, social: chefIds.social },
    yev_personal_brand: { project_id: 12, general: allIds.yev_personal_brand.general, dev: allIds.yev_personal_brand.dev, marketing: allIds.yev_personal_brand.marketing, social: allIds.yev_personal_brand.social, crm: crmIds.personal_crm_channel_id },
    // Personal channels
    personal: {
      biography_framework: '1493545994904928287',
      startup_factory_framework: '1493546097728163920',
      social_media: '1484964706920697987',
      research: '1484965108940542195',
      assistant: '1484964875125133415',
      experiments: '1488623502339604743',
      self_degree_book: '1493545940152221726',
      life_to_remember_book: '1493545994904928287',
    },
    // Self-development
    self_dev: JSON.parse(fs.readFileSync('/data/workspace/scripts/self-dev-channel-ids.json', 'utf8')),
    // CRM
    crm: crmIds,
  };

  fs.writeFileSync('/data/workspace/scripts/full-channel-map.json', JSON.stringify(fullChannelMap, null, 2));
  console.log('\n💾 Saved full-channel-map.json');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
