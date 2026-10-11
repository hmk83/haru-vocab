# Automatic public shared history

The user selected public shared history after confirming that all visitors can see and contribute to the same records. The website now automatically chooses the common shared profile; the pairing code controls are removed.

10 local harness checks passed against the real Supabase backend:

- Download and migrate the prior device's private cloud history without user input.
- Fresh independent browser downloads the same scores, answers and mastery automatically.
- No pairing, connection-code or copy-code controls in settings.
- Flashcard, multiple-choice and written results synchronize.
- An already-open second browser refreshes through the automatic 30-second timer.
- Offline completion automatically uploads after reconnection; records survive reload.
- iPhone mini and tablet settings do not overflow horizontally.
- Shared reset clears records across browsers; migrated history does not resurrect.

The mode checks account for three separate checks, giving ten total. All harness records are synthetic and use a fresh isolated shared namespace. The harness never inserts scores into or resets the actual public learner's shared profile. Browser viewport simulations are not physical-device tests.

Harness: `qa/shared-sync-harness.cjs`. Machine-readable local and public evidence: `shared-sync-results.json` and `shared-sync-results-public.json`.
