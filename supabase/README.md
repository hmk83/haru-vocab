# Learning history sync

Production: https://hmk83.github.io/haru-vocab/
Supabase project: `haru-vocab-sync` (`tvaqnawrciznzebqbupf`), Seoul, Free plan.

GitHub Pages serves the website; Supabase stores completed learning records and answer events. `sync-config.js` contains only the public publishable key. No database password, secret API key, or service-role key is shipped.

## Automatic shared records

The user explicitly selected public shared learning history. `sync-config.js` supplies the common public profile code automatically. No login, code copying or pairing UI is required. All visitors see and contribute to the same history. The profile code is public by design, not a private credential.

When the updated app opens, an existing private device code is used once to download that device's accessible cloud history, then the history is merged into the public shared profile. Existing local history also uploads. Private profiles for unrelated codes are not migrated or exposed. A device must reopen the updated site for its older records to migrate.

Subsequent graded answers and completed learning automatically synchronize, including ordinary stages, tests and frequent-mistake practice. Visible pages refresh every 30 seconds and when returning to the browser. Result-screen buttons await cloud confirmation before continuing. Offline results remain local and retry when connectivity returns. In-progress question navigation remains local.

History reset uses the requested `3323` UI confirmation and resets the common history and mastery across all visitors. A server reset timestamp prevents old offline devices from restoring pre-reset records. It is a UI safeguard, not private access control for this intentionally public profile.

## Database

`setup.sql` defines the three tables, explicit anon grants and row-level policies. Only the SHA-256 hash of each 256-bit profile code is stored as the owner key. The shared profile code is included in public frontend configuration by user request. Requests present the code in `x-vocab-key`; RLS computes its hash and restricts rows to that owner. Insert policies reject records predating the owner's reset timestamp. Primary keys `(key_hash,id)` also prevent duplicate uploads.

`harden-defaults.sql` revokes public execution of the optional Supabase auto-RLS administrative event-trigger function. Its owner can still use the automatic RLS trigger.

## Verified

- Local and deployed cloud harness: `qa/cloud-sync-harness.cjs`, 17 checks each.
- Existing-history migration, 1,025 answer events, concurrent devices, committed upload with lost response: `qa/cloud-sync-edge-harness.cjs`, 3 checks.
- Neutral flashcard interpretation and responsive study layout: `qa/flash-reveal-harness.cjs`, 11 checks.
- Browser viewport checks: 375×640, 375×812, 768×1024, 1024×768; flashcards additionally 1440×900. These are browser simulations, not physical-device tests.
- Three database tables confirmed with RLS enabled; anonymous read without connection code returns zero rows, unauthorized insert is rejected; default privileged function execute permissions confirmed false.
- Production deployment commit: `289490d0f80d1618996235b73746e96ad24caae6`, GitHub Pages run `38130298238`, successful.

All harness profiles use fresh random test codes. The tests do not reset or modify the user's existing browser history.

Final mobile pairing layout was also checked on the published build after the CSS adjustment: 375×640, 375×812, 768×1024, 1024×768.

Shared-mode regression: `qa/shared-sync-harness.cjs` uses a fresh, isolated shared test namespace, so its synthetic results and reset never affect real public history. It verifies automatic legacy migration, no pairing controls, all modes, automatic background refresh, offline recovery, reload and responsive settings.
