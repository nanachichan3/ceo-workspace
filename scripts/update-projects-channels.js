const {Client} = require('pg');

const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

async function main() {
  const c = new Client(CREDS);
  await c.connect();

  // Update Discord channel IDs for all 4 MVP projects
  const updates = [
    // Self-Degree (14) — existing dev: 1484963402555199498
    { id: 14, discord_channel_id: '1496980098371420200', discord_dev_channel_id: '1484963402555199498', discord_social_channel_id: '1496980100577624117' },
    // DnDate (15) — existing dev: 1485514034227712061
    { id: 15, discord_channel_id: '1496980086216327209', discord_dev_channel_id: '1485514034227712061', discord_social_channel_id: '1496980087524823094' },
    // SOCOS CRM (16)
    { id: 16, discord_channel_id: '1496980090775666860', discord_dev_channel_id: '1496980092130295828', discord_social_channel_id: '1496980093204037776' },
    // Unvibe (29)
    { id: 29, discord_channel_id: '1496980094655135958', discord_dev_channel_id: '1496980096001507398', discord_social_channel_id: '1496980097381699765' },
  ];

  for (const u of updates) {
    await c.query(
      `UPDATE "Projects" SET
        discord_channel_id = $1,
        discord_dev_channel_id = $2,
        discord_social_channel_id = $3,
        discord_category_id = COALESCE(discord_category_id, 'existing')
       WHERE id = $4`,
      [u.discord_channel_id, u.discord_dev_channel_id, u.discord_social_channel_id, u.id]
    );
    console.log(`✅ Updated project ${u.id}`);
  }

  // Also add self-development channel IDs to a new table or config
  // Save self-development channel IDs for the research workflow
  const selfDevChannels = {
    ai: '1496980075852337163',
    future_of_education: '1496980076997247086',
    gamification: '1496980077567807503',
    buddhism: '1496980079404781790',
    biohacking: '1496980080885235906',
    open_source: '1496980083389239337',
    digital_nomading: '1496980085209563256',
  };

  // Save to a JSON file for the research cron to use
  require('fs').writeFileSync('/data/workspace/scripts/self-dev-channel-ids.json', JSON.stringify(selfDevChannels, null, 2));

  const res = await c.query('SELECT id, title, discord_channel_id, discord_dev_channel_id, discord_social_channel_id FROM "Projects" WHERE id IN (14, 15, 16, 29)');
  console.log('\n📋 Updated projects:');
  res.rows.forEach(r => console.log(`  ${r.title}: general=${r.discord_channel_id} dev=${r.discord_dev_channel_id} social=${r.discord_social_channel_id}`));

  await c.end();
  console.log('\n✅ DB updated');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
