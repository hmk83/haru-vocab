# Cloud sync harness verification

The app at https://hmk83.github.io/haru-vocab/ was tested against the real dedicated Supabase project using independent isolated browser contexts.

17 local checks and 17 public checks passed: ALL toggle, pairing through settings, all three study modes, score/answers/mastery reload, unpaired-browser isolation, offline reconnection, selected-stage 30-question test, frequent-mistake practice, all four result navigation buttons, responsive settings, password-guarded paired history reset and no resurrection.

Three additional checks passed: automatic migration of older local records, complete download of 1,025 answer events, simultaneous learning without overwrites, and retry of a committed upload whose response was lost. The first check covers both migration and pagination.

The flashcard regression harness passed 11 checks, including interpretation without grading and five viewport sizes. No JavaScript page errors occurred in the cloud harness.

Public deployment: `289490d0f80d1618996235b73746e96ad24caae6`, Pages run `38130298238` succeeded. Machine-readable results: `cloud-sync-results.json`, `cloud-sync-results-public.json`, `cloud-sync-edge-results.json`, `flash-reveal-results.json`.

Pairing still requires entering the same private connection code once on each real device. Browser contexts prove cross-browser persistence; they do not claim the user's physical iPhone has been paired.

Final mobile pairing layout was also checked on the published build after the CSS adjustment: 375×640, 375×812, 768×1024, 1024×768.
