/**
 * Comprehensive refactor: Self-Degree Framework → Self-Degree Company
 * Move ALL related records from project 14 → project 9, then delete project 14.
 */
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('/data/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.channels?.discord?.token;
const GUILD_ID = '1484900471008133262';
const { Client } = require('pg');

const CREDS = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

async function api(method, path, body) {
  const opts = { method, headers: { 'Authorization': `Bot ${TOKEN}`, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://discord.com/api/v10${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function moveTable(c, table, pkCol) {
  const whereCol = pkCol || 'Projects_id';
  const result = await c.query(`SELECT COUNT(*) FROM "${table}" WHERE "${whereCol}" = 14`);
  const count = parseInt(result.rows[0].count);
  if (count > 0) {
    await c.query(`UPDATE "${table}" SET "${whereCol}" = 9 WHERE "${whereCol}" = 14`);
    console.log(`✅ ${table}: ${count} records moved`);
    return count;
  } else {
    console.log(`⏭ ${table}: 0 records`);
    return 0;
  }
}

async function main() {
  const c = new Client(CREDS);
  await c.connect();

  // Move standard tables
  await moveTable(c, 'TODO');
  await moveTable(c, 'Directories');
  await moveTable(c, 'Inspirations');
  await moveTable(c, 'Channels');
  await moveTable(c, 'Partners');
  await moveTable(c, 'Documents');

  // M2M table - needs delete + insert
  const m2m = await c.query('SELECT "TODO_id" FROM "nc_2tiq___nc_m2m_Projects_TODO" WHERE "Projects_id" = 14');
  for (const m of m2m.rows) {
    await c.query('DELETE FROM "nc_2tiq___nc_m2m_Projects_TODO" WHERE "Projects_id" = 14 AND "TODO_id" = $1', [m.TODO_id]);
    await c.query('INSERT INTO "nc_2tiq___nc_m2m_Projects_TODO" ("Projects_id", "TODO_id") VALUES (9, $1) ON CONFLICT DO NOTHING', [m.TODO_id]);
  }
  console.log(`✅ nc_m2m_Projects_TODO: ${m2m.rows.length} records moved`);

  // Sprints uses project_id column
  const sprints = await c.query('SELECT id FROM "Sprints" WHERE project_id = 14');
  for (const s of sprints.rows) {
    await c.query('UPDATE "Sprints" SET project_id = 9 WHERE id = $1', [s.id]);
  }
  console.log(`✅ Sprints: ${sprints.rows.length} records moved`);

  // Rename project 9 to "Self-Degree"
  await c.query("UPDATE \"Projects\" SET title = 'Self-Degree' WHERE id = 9");
  console.log('✅ Renamed project 9 → Self-Degree');

  // Delete project 14
  await c.query('DELETE FROM "Projects" WHERE id = 14');
  console.log('✅ Deleted project 14');

  // Create #framework channel in Self-Degree category
  const frameworkCh = await api('POST', `/guilds/${GUILD_ID}/channels`, {
    name: '📖-framework',
    type: 0,
    parent_id: '1484900592093761657',
    position: 3,
  });
  console.log('✅ #📖-framework channel:', frameworkCh.id);

  // Verify
  const proj = await c.query('SELECT id, title FROM "Projects" WHERE id = 9');
  const todos = await c.query('SELECT COUNT(*) FROM "TODO" WHERE "Projects_id" = 9');
  console.log(`\n📋 Self-Degree (id=9): ${proj.rows[0].title} | ${todos.rows[0].count} todos`);

  fs.writeFileSync('/data/workspace/scripts/self-degree-channel-ids.json', JSON.stringify({
    framework_channel_id: frameworkCh.id,
    self_degree_project_id: 9,
    self_degree_category_id: '1484900592093761657',
    self_degree_general_channel_id: '1496980098371420200',
    self_degree_dev_channel_id: '1484963402555199498',
    self_degree_social_channel_id: '1496980100577624117',
  }, null, 2));

  await c.end();
  console.log('\n✅ Complete!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
