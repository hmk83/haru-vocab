# Phonics release harness

Added entry title and fixed Day/파닉스 navigation, 14 consonant groups, 654 chart-derived cards, Korean Yuna audio, and ungraded flashcard viewing. Completion records store viewed-card count and synchronize through the existing shared Supabase profile. Scores/mastery events are never generated for phonics. Day grading, Day-only test pools, and neutral Day translation reveal are preserved.

Local harness: `qa/phonics-harness.cjs` passed 10 checks (`qa/phonics-results.json`). It exercises actual UI entry, every list, full 60-card session completion, reload recovery, back confirmation, repeat/shuffle, independent-browser cloud write/read/reload, native audio decoding, Day completion and ALL toggle. Viewports: 375×640, 375×812, 768×1024, 1024×768, 1440×900. Study/entry fit the viewport; lists scroll vertically. These are browser emulation checks, not physical iPhone/iPad claims.

The existing `qa/shared-sync-harness.cjs` also passed 10 regression checks after the record validator/seed change, including private-to-shared migration, flash/quiz/written shared scores, automatic polling, offline recovery and shared reset propagation. Both harnesses use independent randomly generated test namespaces; the real public learner's records are never reset or populated by tests.

Source transcription/corrections: `qa/phonics-source-review.md`.

Public deployment: source commit `0b9db1dde33342ee7b6d024b1b894e1d291e1d0a`, GitHub Pages run [38210004948](https://github.com/hmk83/haru-vocab/actions/runs/38210004948) succeeded. The same 10-check phonics harness passed against https://hmk83.github.io/haru-vocab/ (`qa/phonics-results-public.json`), including deployed Korean audio decoding and independent-browser Supabase completion retrieval. All 654 generated M4A files were also checked locally for nonempty MP4 container/media content before upload.

## Follow-up: compact syllable grid without listening

Removed listening controls from all phonics list/study screens. Each consonant's syllables now use the same grid-card presentation as the preceding consonant list (3 columns on mobile, 4 on tablet, 5 on desktop). Day listening remains available. The updated local harness passed all 10 checks, including first/second card geometry on each device width, absence of phonics listening, and Day listening preservation.

The follow-up public deployment `55d03214836b72c267a76a4cb0df8255d65dcefd` succeeded in Pages run [38210342141](https://github.com/hmk83/haru-vocab/actions/runs/38210342141). All 10 updated harness checks passed against the public site, recorded in `qa/phonics-results-public.json`.

## Follow-up: direct, bilingual flashcards

Phonics starts immediately without a Hangul/romanization picker. Every card shows its Latin text above Hangul; no reveal, audio or grading control is present. Next remains at the bottom. The 10-check local harness passed, including paired text content/order, direct entry, reload recovery, independent-browser completion synchronization and Day regression checks across the five viewports.

Direct bilingual cards deployed as `865c985670cb45e2d8b1eca9a7099796a3c2c0f1` in successful Pages run [38211424920](https://github.com/hmk83/haru-vocab/actions/runs/38211424920). All 10 updated checks passed on the public site (`qa/phonics-results-public.json`).

## Follow-up: phonics lists only

Removed the phonics flashcard entry, session renderer and next-card handler. Lists retain all 654 items and their responsive grid. Existing phonics drafts return to their consonant list; existing completed records remain readable with no restart action. Day flashcards remain unchanged. `qa/phonics-list-only.cjs` replaces the prior phonics session harness for the current feature scope and checks all groups, five viewport sizes, legacy-state recovery and Day controls.

List-only release `6786f5069e8babd849b03d8ba10d26b7c7df0d67` deployed successfully in Pages run [38212037471](https://github.com/hmk83/haru-vocab/actions/runs/38212037471). The four list-only checks also passed on the public site, recorded in `qa/phonics-list-only-results-public.json`.

## Follow-up: centered entry choices

Entry screen removes the title/mark/header and lower dock, showing two large centered Day and Phonics navigation buttons. Mobile stacks the two buttons; tablet/desktop and landscape show them side by side. `qa/launch-options-harness.cjs` verifies exact labels, absence of title, central alignment, large touch targets and no scrolling in six viewports, plus both navigation destinations and logo return behavior.
