const {Client} = require('pg');
const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};
const fs = require('fs');

async function main() {
  const c = new Client(CREDS);
  await c.connect();
  const res = await c.query('SELECT id, title, discord_channel_id, discord_dev_channel_id, discord_social_channel_id FROM "Projects" WHERE id IN (14, 15, 16, 29)');
  console.log('MVP Projects channel IDs:');
  console.log(JSON.stringify(res.rows, null, 2));

  const sd = JSON.parse(fs.readFileSync('/data/workspace/scripts/self-dev-channel-ids.json', 'utf8'));
  console.log('\nSelf-Development channel IDs:');
  console.log(JSON.stringify(sd, null, 2));

  await c.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
