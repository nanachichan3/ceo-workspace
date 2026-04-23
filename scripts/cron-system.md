# CTO Cron — Technical Work Orchestrator

## Trigger
Every **30 minutes** via OpenClaw cron.

## What it does
1. Connect to the `projects` PostgreSQL DB
2. Query all `TODO` rows where:
   - `Status` IN ('TODO', 'todo', 'In Progress', 'in_progress', 'In Progres')
   - `agent_type` = 'cto'
   - `Projects_id` IN (14, 15, 16, 29) — MVP-stage projects
3. For each project with pending todos, spawn a `builder` subagent to execute the most urgent todo
4. Post a brief status update to the project's `discord_dev_channel_id` in Discord

## Connection string
`postgres://postgres:WFBGCo6cjCf7NbxVfkPSe5x0P41v3d27MowubhpPmfk9CgrfcMhBUvp8lyCfjobL@x0k4w8404wckwwcswg808gco:5432/projects`

## Discord reporting
Post status to each project's dev channel using `discord_dev_channel_id` from the `Projects` table.
