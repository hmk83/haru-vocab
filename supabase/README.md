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

- Prior private-mode local and deployed cloud harness: `qa/cloud-sync-harness.cjs`, 17 checks each.
- Existing-history migration, 1,025 answer events, concurrent devices, committed upload with lost response: `qa/cloud-sync-edge-harness.cjs`, 3 checks.
- Neutral flashcard interpretation and responsive study layout: `qa/flash-reveal-harness.cjs`, 11 checks.
- Browser viewport checks: 375×640, 375×812, 768×1024, 1024×768; flashcards additionally 1440×900. These are browser simulations, not physical-device tests.
- Three database tables confirmed with RLS enabled; anonymous read without connection code returns zero rows, unauthorized insert is rejected; default privileged function execute permissions confirmed false.
- Production deployment commit: `2cb03bb942e5e55c8e1bb0ead35a3fc34940371a`, GitHub Pages run `38130822664`, successful.

All harness profiles use fresh random test codes. The tests do not reset or modify the user's existing browser history.

Final mobile pairing layout was also checked on the published build after the CSS adjustment: 375×640, 375×812, 768×1024, 1024×768.

Shared-mode regression: `qa/shared-sync-harness.cjs` uses a fresh, isolated shared test namespace, so its synthetic results and reset never affect real public history. It verifies automatic legacy migration, no pairing controls, all modes, automatic background refresh, offline recovery, reload and responsive settings.

Current public shared mode: all 10 local and 10 deployed shared-mode harness checks passed; see `qa/shared-sync-report.md`.

## OX point economy

`game-setup.sql` creates the non-exposed `vocab_game` schema with six RLS-enabled tables, fixed 1,000-point catalog prices, server-issued random full-Day decks, step-by-step grading, and a per-Day high-water mark. `game-catalog-seed.sql` contains an exact copy of the academy dataset plus reviewed unrelated source-word distractor IDs. Apply the setup and seed together in a transaction; client deployment copies no SQL or private credentials.

Only `public.vocab_game_action(text,jsonb)` is callable by the existing public-profile client. It verifies the same 64-hex `x-vocab-key` scope, locks the profile wallet for mutations, validates run order, awards at terminal states, and persists learning records/answer events. It runs as a narrowly scoped SECURITY DEFINER with an empty search path because granting browser UPDATE on wallets would allow balance tampering. The six internal tables and helper functions have no PUBLIC/anon/authenticated grants. This is the previously chosen public shared profile model, not per-person authentication or private personal balances.

Each game receives a UUID; answer replays return their stored outcome, contradictory replays and skipped positions are rejected. The payout is based on the server's completed-correct count, not a client-supplied score, and the stored Day best only increases. History reset does not remove wallets, owned items or Day bests. Purchases/equipment are checked server-side and serialized on the same wallet, so duplicate purchases do not charge twice and negative balances are rejected. Client snapshots include a monotonically increasing version to avoid showing an older response over a newer wallet.

Production installation was verified on 2026-10-22: 1,000 academy words, 150 catalog items, six RLS-enabled tables, no anon USAGE on the private schema, no anon UPDATE on wallets, and the scoped RPC available with an empty search path. Full browser tests use fresh random profile keys; normal shared user balances are not seeded or reset.

## 꾸미기 카테고리 확장
기존 설치에는 `wardrobe-upgrade.sql`을 한 번 실행합니다. 카탈로그에 모자·안경·등·목·신발 각 30개를 추가하고 동일 프로필 RPC의 `face` 동작으로 눈/코/입을 독립 저장합니다. 포인트·구매·최고기록을 삭제하거나 초기화하지 않습니다. 표정은 서버에서도 무료이며 허용 부위와 범위를 검증합니다. 새 설치는 갱신된 `game-setup.sql`에 포함됩니다.
