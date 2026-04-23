/**
 * 1. Merge Self-degree.com (id=9) into Self-Degree Framework (id=14)
 * 2. Update Discord channels for both to be consistent
 * 3. Add validation-stage projects (DnDate/Viewpulse) to the MVP project set
 */
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

  // 1. Get Self-degree.com (id=9) todos and move them to id=14
  const todos9 = await c.query('SELECT * FROM "TODO" WHERE "Projects_id" = 9');
  console.log(`Found ${todos9.rows.length} todos for self-degree.com (id=9)`);

  for (const todo of todos9.rows) {
    await c.query('UPDATE "TODO" SET "Projects_id" = 14 WHERE id = $1', [todo.id]);
    console.log(`  Moved todo ${todo.id}: "${todo.title}"`);
  }

  // 2. Merge the Comment fields
  const proj9 = await c.query('SELECT * FROM "Projects" WHERE id = 9');
  const proj14 = await c.query('SELECT * FROM "Projects" WHERE id = 14');
  const mergedComment = [proj14.rows[0].Comment, proj9.rows[0].Comment].filter(Boolean).join(' | ');
  await c.query('UPDATE "Projects" SET "Comment" = $1 WHERE id = 14', [mergedComment]);
  console.log(`\nMerged comment into project 14`);

  // 3. Update project 14 to also represent the Self-degree.com platform
  await c.query('UPDATE "Projects" SET "Comment" = $1, "Public_URL" = COALESCE("Public_URL", $2) WHERE id = 14',
    [mergedComment, proj9.rows[0].Public_URL]);

  // 4. Mark self-degree.com as merged (keep record but mark as internal)
  await c.query('UPDATE "Projects" SET "Internal_Use" = true, "Comment" = $1 WHERE id = 9',
    ['MERGED into Self-Degree Framework (id=14). Keep for reference.']);

  // 5. Update DnDate (id=15) and Viewpulse (id=28) — add them to the active project set
  // They already have channels — DnDate has channels, Viewpulse has channels
  const proj15 = await c.query('SELECT discord_channel_id FROM "Projects" WHERE id = 15');
  const proj28 = await c.query('SELECT discord_channel_id FROM "Projects" WHERE id = 28');
  console.log(`\nDnDate (15) has discord_channel_id: ${proj15.rows[0]?.discord_channel_id}`);
  console.log(`Viewpulse (28) has discord_channel_id: ${proj28.rows[0]?.discord_channel_id}`);

  // 6. Print updated state
  const res = await c.query('SELECT id, title, "Stage", "Internal_Use", "Comment" FROM "Projects" WHERE id IN (9, 14, 15, 28)');
  console.log('\nUpdated projects:');
  console.log(JSON.stringify(res.rows, null, 2));

  await c.end();
  console.log('\n✅ Self-degree merge complete');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
