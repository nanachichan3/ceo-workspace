# Startup Factory TODO — Yev (Due: Morning 2026-04-24)

## Priority Tasks

### 1. Add mem0 to Openclaw
- Install mem0ai in /opt/openclaw/node_modules/
- Wire openclaw-mem0 plugin into plugins.entries (config patch didn't stick)
- Verify auto-capture and auto-recall work
- Test: POST to mem0 via openclaw-mem0 tools

### 2. Add mem0 to Hermess
- Hermes is NousResearch hermes-agent (Python), NOT OpenClaw
- Needs: pip install mem0ai in Docker image + code changes to use MEM0_URL
- Update docker-compose.yaml or Dockerfile to install mem0ai
- Update entrypoint.sh to call mem0.add() / mem0.search()

### 3. Novu — migrate yevs-life-scroll + verify works
- Check Novu deployment status (app uuid?)
- Check yevs-life-scroll repo for Novu integration
- Verify Novu workflows fire correctly

### 4. Finalize startup-factory implementation
- factory-v2 deployed but not accessible (Bad Gateway)
- Needs: TEMPORAL_ADDRESS=temporal:7233 + MEM0_URL=http://mem0:5000 confirmed working
- Agent loop implementation check
- Browser sidecar deployment

### 5. All MVP/Verification projects — Posthog installed + metrics working
- Query projects DB for projects in MVP and Verification stages
- For each: check if Posthog is installed (source code / deployment)
- Verify events are flowing to Posthog

### 6. All MVP/Verification projects — Stripe connected (where relevant)
- Query projects DB for projects needing payments
- Verify Stripe keys in Bitwarden for each
- Verify Stripe integration in codebase / deployments

### 7. MiroFish running + validate a startup
- Check MiroFish deployment status (Coolify app uuid?)
- Send a startup from projects DB for validation
- Verify swarm intelligence validation works

### 8. All projects with GitHub repos following startup-factory framework
- Query projects DB for projects with github_repo
- For each: check if repo has the startup-factory structure
  - .<startup-id>/ plugin
  - docs/business_stages/
  - docs/operations/
  - docker-compose
- Fix missing structure

### 9. All 3 harnesses — same access, same GitHub workspaces, same memories
- openclaw, hermess (hermes-agent), startup-factory (factory-v2)
- Same workspace repo mounts: ceo/, cto/, cmo/
- Same GitHub tokens (GH_TOKEN)
- Same Bitwarden access
- Same Mem0 backend

### 10. All harnesses aware of startup-factory framework + skills + crons
- startup-factory-framework document loaded into each harness
- CTO skills: coolify-manager, frontend-design, shadcn, etc.
- CMO skills: remotion-best-practices, falai skills
- CEO skills: pptx, xlsx
- Crons: 1% self-reflection, dreaming, heartbeat

## Framework Context (from startup-factory-v3.md)
- 8 startup stages: Idea → Validation → MVP → Launch → Distribution → PMF → Support → Exit
- Global Tools: GitHub, Bitwarden, FS, Chrome, Mem0, Postgres, Discord, Posthog, Elevenlabs, Fal.ai, Apify, Google CLI
- Expert roles: CEO, CTO, CMO
- Expert loop: Listen → Decide → Delegate → Validate → Persist → Reflect
- Startup workspace structure: .<startup-id>/ plugin, docs/, internals/, apps/, packages/, docker/
- Swarm intelligence for stage evolution (MiroFish)
- 3 chances per stage, feedback document required
