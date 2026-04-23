const {Client} = require('pg');
const c = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
});

async function main() {
  await c.connect();
  
  // Add Discord columns to Projects
  await c.query('ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS discord_category_id TEXT');
  await c.query('ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS discord_channel_id TEXT');
  await c.query('ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS discord_dev_channel_id TEXT');
  await c.query('ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS discord_social_channel_id TEXT');
  console.log('✅ Added Discord columns to Projects');

  // Add agent_type to TODO
  await c.query('ALTER TABLE "TODO" ADD COLUMN IF NOT EXISTS agent_type TEXT DEFAULT NULL');
  console.log('✅ Added agent_type to TODO');

  // Set agent_type for existing todos where Agents_id = 1 (CTO)
  await c.query("UPDATE \"TODO\" SET agent_type = 'cto' WHERE \"Agents_id\" = 1 AND agent_type IS NULL");
  console.log('✅ Set agent_type=cto for existing todos with Agents_id=1');

  // Set agent_type for existing todos where Agents_id = 2 (CEO/Nanachi as CTO)
  await c.query("UPDATE \"TODO\" SET agent_type = 'cto' WHERE \"Agents_id\" = 2 AND agent_type IS NULL");
  console.log('✅ Set agent_type=cto for existing todos with Agents_id=2');

  // Mark todos with no Agents_id and project_id in {14,15,16,29} as cto by default
  await c.query("UPDATE \"TODO\" SET agent_type = 'cto' WHERE \"Agents_id\" IS NULL AND agent_type IS NULL AND \"Projects_id\" IN (14, 15, 16, 29)");
  console.log('✅ Set agent_type=cto for unassigned MVP project todos');

  // Verify
  const res = await c.query('SELECT id, title, "Projects_id", agent_type, "Status" FROM "TODO" WHERE agent_type IS NOT NULL ORDER BY id LIMIT 20');
  console.log('\n📋 Sample todos with agent_type:');
  console.log(JSON.stringify(res.rows, null, 2));

  await c.end();
  console.log('\n✅ Schema migration complete');
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
