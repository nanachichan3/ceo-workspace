const {Client} = require('pg');
const c = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
});

async function main() {
  await c.connect();

  // Active projects by stage
  const res = await c.query(
    `SELECT id, title, "Stage", "Status", "Comment", discord_channel_id
     FROM "Projects"
     WHERE "Stage" IN ('MVP', 'Validation', 'Launch')
     AND "Status" NOT IN ('Closed', 'Sold', 'Exit')
     ORDER BY "Stage", title`
  );
  console.log('ACTIVE PROJECTS:');
  res.rows.forEach(r => console.log(`  [${r.Stage}] ${r.title} (id=${r.id}) | ${r.discord_channel_id ? 'has discord' : 'NO DISCORD'}`));

  // Personal category channels from Discord
  console.log('\nPersonal category channels (1484900785396649994):');
  console.log('  #pr: 1484964638633492510');
  console.log('  #social-media: 1484964706920697987');
  console.log('  #assistant: 1484964875125133415');
  console.log('  #trainer: 1484964995723694231');
  console.log('  #research: 1484965108940542195');
  console.log('  #self-degree-framework: 1493545940152221726');
  console.log('  #biography-framework: 1493545994904928287');
  console.log('  #startup-factory-framework: 1493546097728163920');

  // Check Validation stage projects in DB
  const valRes = await c.query(`SELECT id, title, "Stage" FROM "Projects" WHERE "Stage" = 'Validation'`);
  console.log('\nValidation stage projects:', JSON.stringify(valRes.rows));

  // Check self-degree related projects
  const sdRes = await c.query(`SELECT id, title, "Stage", "Comment" FROM "Projects" WHERE title ILIKE '%self%degree%' OR title ILIKE '%self-degree%'`);
  console.log('\nSelf-degree related projects:', JSON.stringify(sdRes.rows));

  await c.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
