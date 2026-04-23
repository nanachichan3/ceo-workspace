/**
 * Build comprehensive channel map and save all channel IDs.
 * Also update DB with correct social_channel_id values.
 */
const fs = require('fs');
const { Client } = require('pg');

const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

async function main() {
  const c = new Client(CREDS);
  await c.connect();

  // DnDate: fix social_channel_id to point to the actual social media channel
  // 1496994091630592111 = #📱-dndate-social (social media mgmt)
  await c.query("UPDATE \"Projects\" SET discord_social_channel_id = '1496994091630592111' WHERE id = 15");
  console.log('✅ DnDate social_channel_id fixed → 1496994091630592111 (#📱-dndate-social)');

  // Verify final state
  const res = await c.query(`
    SELECT id, title,
      discord_channel_id as general,
      discord_dev_channel_id as dev,
      discord_marketing_channel_id as marketing,
      discord_social_channel_id as social,
      discord_social_media_channel_id as social_media
    FROM "Projects" WHERE id IN (9,12,15,16,27,28,29) ORDER BY id
  `);

  console.log('\n📋 Final channel state:');
  res.rows.forEach(r => console.log(`  ${r.title} (${r.id}):`));
  res.rows.forEach(r => {
    console.log(`    general:    ${r.general}`);
    console.log(`    dev:        ${r.dev}`);
    console.log(`    marketing:  ${r.marketing}`);
    console.log(`    social:    ${r.social}`);
    console.log(`    social_m:  ${r.social_media || 'n/a'}`);
  });

  // Build full channel map
  const fullMap = {
    projects: {},
    personal_channels: {
      biography_framework: '1493545994904928287',  // #life-to-remember-book
      startup_factory_framework: '1493546097728163920',
      social_media: '1484964706920697987',  // #📱-social-media
      research: '1484965108940542195',  // #🔬-research
      assistant: '1484964875125133415',  // #🤖-assistant
      experiments: '1488623502339604743',
      self_degree_book: '1493545940152221726',
      life_to_remember_book: '1493545994904928287',
    },
    self_dev: {
      ai: '1496980075852337163',
      future_of_education: '1496980076997247086',
      gamification: '1496980077567807503',
      buddhism: '1496980079404781790',
      biohacking: '1496980080885235906',
      open_source: '1496980083389239337',
      digital_nomading: '1496980085209563256',
    },
    crm: {
      personal_channel: '1496991114748493967',  // #crm in yev-personal
    },
    chef_rachkovan: {
      category_id: '1489594832388231208',
      general: '1496994163109920929',
      dev: '1489594856371130449',
      marketing: '1496994166796714134',
      social: '1496994170676445356',
    },
  };

  // Add project channels from DB query
  for (const row of res.rows) {
    fullMap.projects[row.id] = {
      title: row.title,
      general: row.general,
      dev: row.dev,
      marketing: row.marketing,
      social: row.social,
      social_media: row.social_media,
    };
  }

  fs.writeFileSync('/data/workspace/scripts/full-channel-map.json', JSON.stringify(fullMap, null, 2));
  console.log('\n💾 Saved full-channel-map.json');

  // Also recreate self-dev-channel-ids.json
  fs.writeFileSync('/data/workspace/scripts/self-dev-channel-ids.json', JSON.stringify(fullMap.self_dev, null, 2));

  // And crm-channel-ids.json
  fs.writeFileSync('/data/workspace/scripts/crm-channel-ids.json', JSON.stringify({ personal_crm_channel_id: '1496991114748493967' }, null, 2));

  await c.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
