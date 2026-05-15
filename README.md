# Opinionated Agent Engineering Sharing

Static multi-page Astro site for an opinionated technical sharing session on building agents that actually ship — what they are, how they use tools, how to test them, and how Google ADK and tool-augmented code generation fit into a real harness.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Open the page at the URL printed by `pnpm dev`, usually `http://localhost:4321`.

## What's covered

The deck is split into a **main track** (read in order) and an **optional track** of deep dives.

### Main track

- **Overview** (`index.astro`) — landing page with the full table of contents.
- **01 What is an agent?** (`what-is-agent.astro`) — models in a control loop: state, tools, observations, and stopping criteria.
- **01A Session, state, memory** (`session-state-memory.astro`) — the current thread, the live scratchpad, and long-term searchable context.
- **02 Design patterns** (`orchestration.astro`) — ReAct, planner-executor, reflection, multi-agent, graph, CodeAct — the six shapes an agent runs in.
- **03 Tools & capability** (`engineering-practice.astro`) — function tools, MCP, skills, code execution, retrieval, and human handoff control points.
  - **03A Function tools** (`function-tools.astro`) — the narrowest useful tool form.
  - **03B Skills** (`skills.astro`) — packaged repeatable know-how.
  - **03C Code execution** (`code-execution.astro`) — code execution as a tool form, the runtime piece behind CodeAct.
  - **03D Human handoff** (`human-handoff.astro`) — approval, escalation, override.
  - **03E Search & retrieval** (`search-retrieval.astro`) — web search, docs lookup, vector search, memory recall.
  - **03F MCP servers** (`mcp-servers.astro`) — shared capabilities through a standard interface.
  - **03G File system & OS** (`file-system-os.astro`) — tools for reading, writing, grepping, and navigating local directories.
  - **03H Browser & computer use** (`browser-computer-use.astro`) — interacting with graphical UIs and controlling web browsers.
- **04 Eval & observability** (`eval-observability.astro`) — traces explain what happened; evals tell whether it was good enough.
- **05 Harness concept** (`harness-engineering.astro`) — the runtime boundary around state, tools, permissions, replay, and tests.
  - **05A ADK harness examples** (`harness-examples.astro`) — runner, confirmations, HITL, evals, events — the harness made concrete.
  - **05B Cost & latency engineering** (`cost-latency.astro`) — budgets, parallelization, deterministic caching, and routing by difficulty.
  - **05C Failure-mode catalog** (`failure-modes.astro`) — plan, tool, and grounding failures, plus runbooks to detect and mitigate them.

### Optional deep dives

- **06 CodeAct deep dive** (`codeact.astro`) — the action shape that scales, with the trade-off named.
- **06A ML agent: a coding agent, specialized** (`codeact-ds-agent.astro`) — end-to-end Kaggle workflow: function tool for the CLI, skill for the modeling sweep, CodeAct in between.
- **06B Security & permission model** (`security-model.astro`) — least privilege, policy gates, and building permissions as a stack.
- **06C Rollout lifecycle** (`rollout-lifecycle.astro`) — canary, versioning, shadow runs, and fast rollbacks.
- **07 Useful resources** (`resources.astro`) — curated reading on agent design, evals, frameworks, and protocols.

## Editing

Pages live in `src/pages/`. The shared side-nav layout lives in `src/layouts/SiteLayout.astro` — it maintains three arrays (`mainNavItems`, `bonusNavItems`, `chapterFlow`) that must stay in sync when pages are added or reordered. Visual styling lives in `src/styles/page.css`. See `CLAUDE.md` for the conventions.
