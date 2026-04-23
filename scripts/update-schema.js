const {Client} = require('pg');
const c = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
});

async function main() {
  await c.connect();

  // Add new columns (ignore errors if they exist)
  try { await c.query('ALTER TABLE "Projects" ADD COLUMN discord_marketing_channel_id TEXT'); console.log('✅ Added discord_marketing_channel_id'); } catch(e) { if(e.message.includes('already exists')) console.log('⏭ discord_marketing_channel_id exists'); else console.error(e.message); }
  try { await c.query('ALTER TABLE "Projects" ADD COLUMN discord_social_media_channel_id TEXT'); console.log('✅ Added discord_social_media_channel_id'); } catch(e) { if(e.message.includes('already exists')) console.log('⏭ discord_social_media_channel_id exists'); else console.error(e.message); }

  // Migrate: copy social_channel_id → marketing_channel_id for all projects that have it
  await c.query('UPDATE "Projects" SET discord_marketing_channel_id = discord_social_channel_id WHERE discord_marketing_channel_id IS NULL AND discord_social_channel_id IS NOT NULL');
  console.log('✅ Migrated social_channel_id → marketing_channel_id');

  // Set social_media_channel_id for Yev Personal Brand
  await c.query("UPDATE \"Projects\" SET discord_social_media_channel_id = '1496994148232724676' WHERE id = 12");
  console.log('✅ Set Yev Personal Brand social_media_channel_id = 1496994148232724676');

  // Verify
  const res = await c.query('SELECT id, title, discord_channel_id, discord_dev_channel_id, discord_marketing_channel_id, discord_social_channel_id, discord_social_media_channel_id FROM "Projects" WHERE id IN (9,12,15,16,27,28,29) ORDER BY id');
  console.log('\n📋 Final state:');
  res.rows.forEach(r => console.log(`  ${r.title}: gen=${r.discord_channel_id?.substring(0,8)} dev=${r.discord_dev_channel_id?.substring(0,8)} mkt=${r.discord_marketing_channel_id?.substring(0,8)} soc=${r.discord_social_channel_id?.substring(0,8)} sm=${r.discord_social_media_channel_id?.substring(0,8)}`));

  await c.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
