# Phonics release harness

Added entry title and fixed Day/파닉스 navigation, 14 consonant groups, 654 chart-derived cards, Korean Yuna audio, and ungraded flashcard viewing. Completion records store viewed-card count and synchronize through the existing shared Supabase profile. Scores/mastery events are never generated for phonics. Day grading, Day-only test pools, and neutral Day translation reveal are preserved.

Local harness: `qa/phonics-harness.cjs` passed 10 checks (`qa/phonics-results.json`). It exercises actual UI entry, every list, full 60-card session completion, reload recovery, back confirmation, repeat/shuffle, independent-browser cloud write/read/reload, native audio decoding, Day completion and ALL toggle. Viewports: 375×640, 375×812, 768×1024, 1024×768, 1440×900. Study/entry fit the viewport; lists scroll vertically. These are browser emulation checks, not physical iPhone/iPad claims.

The existing `qa/shared-sync-harness.cjs` also passed 10 regression checks after the record validator/seed change, including private-to-shared migration, flash/quiz/written shared scores, automatic polling, offline recovery and shared reset propagation. Both harnesses use independent randomly generated test namespaces; the real public learner's records are never reset or populated by tests.

Source transcription/corrections: `qa/phonics-source-review.md`.
