# Learning history sync

Production: https://hmk83.github.io/haru-vocab/
Supabase project: `haru-vocab-sync` (`tvaqnawrciznzebqbupf`), Seoul, Free plan.

GitHub Pages serves the website; Supabase stores completed learning records and answer events. `sync-config.js` contains only the public publishable key. No database password, secret API key, or service-role key is shipped.

## Pair devices once

On the device containing the original learning history, open Menu → Settings → 기기 동기화 → 연결 코드 보기 → 코드 복사. On each other device, paste that code into 다른 기기 연결 코드 and select 연결. Existing records from both devices merge. Subsequent answers and completed learning automatically synchronize, including ordinary stages, tests and frequent-mistake practice. Visible pages refresh every 30 seconds and when returning to the browser. Result-screen buttons await cloud confirmation before continuing. Keep the code private: it grants access to that learning history.

Old local history uploads when the updated app opens. Offline results remain on the device and retry when connectivity returns. In-progress question navigation remains local; graded answer events and completed scores synchronize.

History reset uses the requested `3323` confirmation password. It resets the paired history and mastery across devices, using a reset timestamp to prevent an old offline browser from restoring deleted records. The password is a UI confirmation, not the data access credential; server access requires the connection code.

## Database

`setup.sql` defines the three tables, explicit anon grants and row-level policies. Only the SHA-256 hash of the randomly generated 256-bit connection code is stored as the owner key. Requests present the code in `x-vocab-key`; RLS computes its hash and restricts rows to that owner. Insert policies reject records predating the owner's reset timestamp. Primary keys `(key_hash,id)` also prevent duplicate uploads.

`harden-defaults.sql` revokes public execution of the optional Supabase auto-RLS administrative event-trigger function. Its owner can still use the automatic RLS trigger.

## Verified

- Local and deployed cloud harness: `qa/cloud-sync-harness.cjs`, 17 checks each.
- Existing-history migration, 1,025 answer events, concurrent devices, committed upload with lost response: `qa/cloud-sync-edge-harness.cjs`, 3 checks.
- Neutral flashcard interpretation and responsive study layout: `qa/flash-reveal-harness.cjs`, 11 checks.
- Browser viewport checks: 375×640, 375×812, 768×1024, 1024×768; flashcards additionally 1440×900. These are browser simulations, not physical-device tests.
- Three database tables confirmed with RLS enabled; anonymous read without connection code returns zero rows, unauthorized insert is rejected; default privileged function execute permissions confirmed false.
- Production deployment commit: `100d853ac0c7339e8f8aba7fe014850c5c854a52`, GitHub Pages run `38130113167`, successful.

All harness profiles use fresh random test codes. The tests do not reset or modify the user's existing browser history.
