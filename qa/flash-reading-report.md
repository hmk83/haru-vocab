# Ungraded Day flashcards

Flashcards show English with a listening button. One full-width lower button first reveals Korean below English, then advances on the next click. No O/X controls, answer effects, score, mastery update or completed learning record is generated. Completion offers repeat/list only. Existing completed records are retained. Graded legacy flash drafts resume without their previous answer payloads. Quiz and written grading/history synchronization remain available.

`qa/flash-reading-harness.cjs` passed 7 local checks: full 20-card completion without local/cloud writes, reveal/advance/reload behavior, repeated shuffle, responsive order and lower button across five viewport sizes, legacy draft recovery, quiz/written independent-browser result synchronization and a 30-card selected-stage flash test without saving scores or records. Cloud checks use isolated random profile keys; real public learner records are untouched. This new harness supersedes older checks that expected flash O/X grading.

Public release `b001bcb4bf3ea86d3d1781f7b21ce1aa6c4d123d` deployed successfully in Pages run [38214126466](https://github.com/hmk83/haru-vocab/actions/runs/38214126466). All 7 checks passed against https://hmk83.github.io/haru-vocab/ (`qa/flash-reading-results-public.json`), including absence of flash record writes and continued quiz/written cloud synchronization.
