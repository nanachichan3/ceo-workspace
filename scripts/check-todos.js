const {Client} = require('pg');
const c = new Client({
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
});

async function main() {
  await c.connect();

  const cmoRes = await c.query('SELECT "Projects_id", COUNT(*) as cnt FROM "TODO" WHERE agent_type=$1 AND "Status" NOT IN (\'done\',\'Done\',\'completed\') GROUP BY "Projects_id"', ['cmo']);
  console.log('CMO pending todos per project:', JSON.stringify(cmoRes.rows));

  const ctoRes = await c.query('SELECT "Projects_id", COUNT(*) as cnt FROM "TODO" WHERE agent_type=$1 AND "Status" NOT IN (\'done\',\'Done\',\'completed\') GROUP BY "Projects_id"', ['cto']);
  console.log('CTO pending todos per project:', JSON.stringify(ctoRes.rows));

  // Seed initial CMO todos for projects that have none
  const mvpProjects = [14, 15, 16, 29];
  for (const pid of mvpProjects) {
    const existing = cmoRes.rows.find(r => r.Projects_id === pid);
    if (!existing || parseInt(existing.cnt) === 0) {
      // Get project name for the todo title
      const projRes = await c.query('SELECT title FROM "Projects" WHERE id=$1', [pid]);
      const pname = projRes.rows[0]?.title || `Project ${pid}`;

      const todos = [
        { title: `${pname}: Create social media content calendar (3 posts/week)`, priority: 'High', phase: 'distribute' },
        { title: `${pname}: Identify target audience and top 3 content themes`, priority: 'High', phase: 'research' },
      ];

      for (const t of todos) {
        await c.query(
          'INSERT INTO "TODO" (title, "Priority", "Status", "Projects_id", agent_type, phase, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [t.title, t.priority, 'TODO', pid, 'cmo', t.phase, 'CEO']
        );
        console.log(`✅ Created CMO todo for ${pname}: ${t.title}`);
      }
    }
  }

  // Also add some CEO strategic todos
  const ceoRes = await c.query('SELECT COUNT(*) as cnt FROM "TODO" WHERE agent_type=$1 AND "Status" NOT IN (\'done\',\'Done\',\'completed\')', ['ceo']);
  if (parseInt(ceoRes.rows[0].cnt) === 0) {
    const ceoTodos = [
      { title: 'CEO: Review all MVP project progress and identify blockers', priority: 'High', project_id: null },
      { title: 'CEO: Ensure all 4 MVP projects have non-empty todo queues', priority: 'Critical', project_id: null },
    ];
    for (const t of ceoTodos) {
      await c.query(
        'INSERT INTO "TODO" (title, "Priority", "Status", agent_type, created_by) VALUES ($1,$2,$3,$4,$5)',
        [t.title, t.priority, 'TODO', 'ceo', 'CEO']
      );
      console.log(`✅ Created CEO todo: ${t.title}`);
    }
  }

  await c.end();
  console.log('\n✅ Todo seeding complete');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
