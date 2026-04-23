const {Client} = require('pg');

const CREDs = {
  host: 'x0k4w8404wckwwcswg808gco',
  user: 'postgres',
  password: 'WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL',
  database: 'projects'
};

const channels = {
  14: { discord_category_id: '1496976985144955071', discord_channel_id: '1496976986005049397', discord_dev_channel_id: '1496976987451822141', discord_social_channel_id: '1496976988802519130' },
  15: { discord_category_id: '1496976985144955071', discord_channel_id: '1496976989876387951', discord_dev_channel_id: '1496976990924701816', discord_social_channel_id: '1496976991927144539' },
  16: { discord_category_id: '1496976985144955071', discord_channel_id: '1496976993068257401', discord_dev_channel_id: '1496976994053918891', discord_social_channel_id: '1496976995228324021' },
  29: { discord_category_id: '1496976985144955071', discord_channel_id: '1496976996419244032', discord_dev_channel_id: '1496976997782388766', discord_social_channel_id: '1496976998822838492' },
};

async function main() {
  const c = new Client(CREDs);
  await c.connect();

  for (const [projectId, ch] of Object.entries(channels)) {
    await c.query(
      `UPDATE "Projects" SET
        discord_category_id = $1,
        discord_channel_id = $2,
        discord_dev_channel_id = $3,
        discord_social_channel_id = $4
       WHERE id = $5`,
      [ch.discord_category_id, ch.discord_channel_id, ch.discord_dev_channel_id, ch.discord_social_channel_id, parseInt(projectId)]
    );
    console.log(`✅ Updated project ${projectId} with Discord IDs`);
  }

  // Verify
  const res = await c.query('SELECT id, title, discord_channel_id, discord_dev_channel_id, discord_social_channel_id FROM "Projects" WHERE id IN (14, 15, 16, 29)');
  console.log('\n📋 Updated projects:');
  console.log(JSON.stringify(res.rows, null, 2));

  await c.end();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
