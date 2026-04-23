/**
 * Fix DB channel IDs to correctly separate marketing vs social channels.
 * Also update all-channel-ids.json.
 */
const { Client } = require('pg');
const fs = require('fs');

const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

async function main() {
  const c = new Client(CREDS);
  await c.connect();

  // Correct channel IDs after the renaming:
  // Self-Degree: marketing=1496980100577624117, no separate social yet
  // DnDate: marketing=1496994086366871654 (new), social=1496994091630592111 (new)
  // SOCOS: marketing=1496994127122792488 (new), social=1496994131497582592 (new)
  // Viewpulse: marketing=1485514056243613797 (renamed), social=1496994099717476558 (new)
  // Unvibe: marketing=1496980097381699765 (renamed), no separate social yet
  // Chef Rachkovan: marketing=1496994166796714134 (new), social=1496994170676445356 (new)
  // Yev Personal Brand: marketing=1484964638633492510 (renamed), social=1496994148232724676 (new)

  const updates = [
    // Self-Degree: marketing=1496980100577624117 (renamed social→marketing), social=null
    { id: 9, marketing: '1496980100577624117', social: null },

    // Yev Personal Brand: marketing=1484964638633492510, social=1496994148232724676
    { id: 12, marketing: '1484964638633492510', social: '1496994148232724676' },

    // DnDate: marketing=1496994086366871654, social=1496994091630592111
    { id: 15, marketing: '1496994086366871654', social: '1496994091630592111' },

    // SOCOS: marketing=1496994127122792488, social=1496994131497582592
    { id: 16, marketing: '1496994127122792488', social: '1496994131497582592' },

    // Viewpulse: marketing=1485514056243613797, social=1496994099717476558
    { id: 28, marketing: '1485514056243613797', social: '1496994099717476558' },

    // Unvibe: marketing=1496980097381699765, no separate social yet
    { id: 29, marketing: '1496980097381699765', social: null },

    // Chef Rachkovan: marketing=1496994166796714134, social=1496994170676445356
    { id: 27, marketing: '1496994166796714134', social: '1496994170676445356' },
  ];

  for (const u of updates) {
    await c.query(
      `UPDATE "Projects" SET discord_marketing_channel_id=$1, discord_social_channel_id=$2 WHERE id=$3`,
      [u.marketing, u.social, u.id]
    );
    console.log(`✅ Project ${u.id}: marketing=${u.marketing?.substring(0,8)} social=${u.social?.substring(0,8) || 'null'}`);
  }

  // Verify
  const res = await c.query(`
    SELECT id, title,
      discord_channel_id as general,
      discord_dev_channel_id as dev,
      discord_marketing_channel_id as marketing,
      discord_social_channel_id as social,
      discord_social_media_channel_id as social_media
    FROM "Projects" WHERE id IN (9,12,15,16,27,28,29) ORDER BY id
  `);
  console.log('\n📋 Verified final state:');
  res.rows.forEach(r => {
    console.log(`\n  ${r.title} (${r.id}):`);
    console.log(`    general: ${r.general}`);
    console.log(`    dev:     ${r.dev}`);
    console.log(`    mkt:     ${r.marketing}`);
    console.log(`    soc:     ${r.social}`);
    console.log(`    soc_m:   ${r.social_media}`);
  });

  await c.end();

  // Save final channel IDs
  fs.writeFileSync('/data/workspace/scripts/all-channel-ids.json', JSON.stringify({
    self_degree: { project_id: 9, general: '1496980098371420200', dev: '1484963402555199498', marketing: '1496980100577624117' },
    dndate: { project_id: 15, general: '1496994111801262205', dev: '1485514034227712061', marketing: '1496994086366871654', social: '1496994091630592111' },
    socos: { project_id: 16, general: '1496980090775666860', dev: '1496980092130295828', marketing: '1496994127122792488', social: '1496994131497582592' },
    viewpulse: { project_id: 28, general: '1496994104993779844', dev: '1496984581562302614', marketing: '1485514056243613797', social: '1496994099717476558' },
    unvibe: { project_id: 29, general: '1496994115382939831', dev: '1496994119543816212', marketing: '1496980097381699765' },
    chef_rachkovan: { project_id: 27, general: '1496994163109920929', dev: '1489594856371130449', marketing: '1496994166796714134', social: '1496994170676445356' },
    yev_personal_brand: { project_id: 12, general: '1496994139810566308', dev: '1496994154138304554', marketing: '1484964638633492510', social: '1496994148232724676', crm: '1496991114748493967' },
  }, null, 2));
  console.log('\n💾 Saved all-channel-ids.json');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
