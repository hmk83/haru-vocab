# O/X rendering and hairstyle release

Source: 2ed8ca324277dba2d66ef2cefa6c76c0ddbc5eda. Pages run 39722215710 succeeded.

- Removed platform captions and central track/start-pad markup.
- Original block scenery uses CSS, without remote artwork or extra downloads.
- NPC scene descendants reduced from 2,784 to 96. Only the learner retains a customizable 3D rig.
- Same Chrome/headless viewport 1133x744, 4x CPU throttle, 24 NPCs: median forced render 65ms -> 10.8ms; animation frame p95 100.1ms -> 16.8ms. These are lab measurements, not physical tablet claims.
- Eight deployed source files matched local bytes, including unchanged academy data.
- Existing learning rewards, sound, touch, reduced motion and all 1,000 prompts at five sizes passed the O/X regression harness.
- Live crowd behavior, survivor selection and final opposite side passed.
- Live wardrobe purchase/restore test buys hairstyle 48 for 500P, restores it in another browser and confirms it visible on the actual player without a covering helmet.
- 18 new hairstyles make 48 hair items and 288 total paid items. Prior purchase IDs are unchanged.
