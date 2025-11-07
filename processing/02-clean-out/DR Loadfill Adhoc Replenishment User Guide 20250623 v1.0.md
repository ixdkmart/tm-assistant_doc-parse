{
  "focus": { "type": "procedure", "id": "Loadfill (Adhoc Replenishment)" },
  "doc": { "name": "Loadfill Adhoc Replenishment Guide", "path": "/docs/loadfill_adhoc_replenishment.md" },
  "slice": {
    "type": "procedure",
    "title": "Loadfill (Adhoc Replenishment)",
    "pseudonyms": ["Adhoc Replenishment", "Ad-hoc replenishment"],
    "keywords": [
      "loadfill",
      "adhoc replenishment",
      "equipment",
      "barcode",
      "cage",
      "rail",
      "pallet",
      "scan",
      "progress",
      "status",
      "area",
      "completion"
    ],
    "steps": [
      "Select Menu.",
      "Select the Loadfill under Adhoc replenishment.",
      "Scan the barcode on the equipment to be filled.",
      "Select Start loadfill cage.",
      "Fill scanned equipment type.",
      "When completed, the equipment type and area will show as done and a pop-up message will display confirmation.",
      "Repeat the steps to complete each type of equipment to be filled.",
      "If area is not known, after scanning barcode, select Start loadfill cage, then select the world, then select the area, then select Start loadfill cage again.",
      "If a new equipment type is scanned while previous equipment type is in progress, a pop-up will ask if the previous equipment type is done.",
      "If previous equipment type is done, select Yes and proceed to next equipment.",
      "If previous equipment type is not done, select No, remove it, and proceed to next equipment.",
      "Start loadfill cage for the new equipment type after confirming previous equipment status.",
      "Monitor progress and completion times on the screen.",
      "Handle screen messages indicating equipment status such as already completed or being worked on by another team member."
    ],
    "examples": [],
    "bestPractice": [],
    "caveats": [],
    "constraints": [],
    "troubleshooting": [],
    "metrics": [
      "Completion times displayed in minutes (e.g., Completed in 14 mins).",
      "Progress indicators show number of equipment types completed out of total (e.g., Progress: 1/2).",
      "Current time countdown displayed in minutes (e.g., 1 min, 0 min)."
    ]
  },
  "evidence": [
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) - Accessing Loadfill\n\n1. Select Menu\n\n2. Select the Loadfill under Adhoc replenishment"
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) – Completing a cage, rail, pallet\n\n1. Scan the barcode on the equipment to be filled\n- Screen shows \"Scan barcode to start\" with \"Let's go!\" message\n- Progress: 0/0\n\n2. Select Start loadfill cage\n- Shows scanned location C1\n- H-Code: UN11111111\n- \"Edit area\" option available\n- \"Start loadfill cage\" button at bottom\n\n3. Scanned equipment type will be shown, and status will be in progress\n- Shows C1 \"In progress\"\n- H-Code: UN11111111\n- Current time: 1 min\n- Progress: 0/1\n\n4. Fill scanned equipment type\n\n5. Completed equipment type and area will show as done, pop message will also display done. Continue to repeat the steps as you complete each type of equipment to be filled.\n- Shows C1 \"Completed in 14 mins\"\n- H-Code: UN11111111\n- Current time: 0 min\n- Progress: 1/1\n- Pop-up message: \"Nailed it. C1 cage is done.\""
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) - Area not known\n\n1. Scan the barcode on the equipment to be filled\nProgress: 0/0\n\"Let's go!\"\n\n2. No area selected will be shown. Select Start loadfill cage.\nH-Code: UN20052222\n\n3. Select the world\nH-Code: UN44444444\nOptions:\n- Home\n- Kids\n- Clothing\n- Event\n\n4. Select the area\nH-Code: UN44444444\nOptions:\nC1: Womenswear, WUSSH\nC2: Menswear, Basics\nC3: Footwear\nC4: Beauty & Accessories\n\n5. Equipment type will have the area selected. Select \"Start loadfill cage\"\n\n6. Scanned equipment type will shown, and status will be in progress\n\n7. Fill scanned equipment type\n\n8. Completed equipment type and area will show as done, pop message will also display done."
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) – Previous equipment not scanned and done\n\nStep-by-step process:\n\n1. Scans a new equipment type with previous equipment type in progress\n- Shows Progress: 1/2\n- Current time: 4 min\n- C2 (H-Code: UN2222222) In progress\n- C1 (H-Code: UN1111111) Completed in 14 mins\n\n2. Pop up message will ask \"Is the previous equipment type done?\"\n- H-Code: UN2222222\n- Options: Yes / No, remove it\n\n3. If previous equipment type was done, select yes and select next\n- H-Code: UN2222222\n- Selected: Yes\n- Next button activated\n\n4. Pop up message to start loadfill cage will appear\n- Scanned to C3\n- H-Code: UN3333333\n- \"Start loadfill cage\" button\n\n5. Previous equipment type will show as done. New equipment type will show as in progress and can now be filled and completed\n- Progress: 2/3\n- Current time: 1 min\n- C3 (H-Code: UN3333333) In progress\n- C2 (H-Code: UN2222222) Completed in 15 mins\n- C1 (H-Code: UN1111111) Completed in 14 mins\n- Message: \"Nailed it. C2 cage is done.\""
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) – Previous equipment not scanned and not done\n\n1. Scans a new equipment type with previous equipment type in progress\n- Shows Progress: 1/2\n- Current time: 4 min\n- C2 (In progress)\n- H-Code: UN2222222\n- C1 Completed in 14 mins (Done)\n- H-Code: UN11111111\n\n2. Pop up message will ask Is the previous equipment type done\n- H-Code: UN2222222\n- Options: Yes / No, remove it\n\n3. If previous equipment type was not done, select no, remove it and select next\n- H-Code: UN22222\n- \"No, remove it\" selected\n- \"Next\" button highlighted\n\n4. Pop up message to start loadfill cage will appear, select Start loadfill cage\n- Scanned to C3\n- H-Code: UN33333333\n- \"Start loadfill cage\" button shown\n\n5. Previous equipment type will be removed, pop up message will show as removed. New equipment type will show as in progress and can now be filled and completed\n- Progress: 1/2\n- Current time: 1 min\n- C3 (In progress)\n- H-Code: UN33333333\n- C1 Completed in 14 mins (Done)\n- \"Removed C2 cage\" message shown"
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc Replenishment) - Screen Messaging\n\nScreen 1:\n- Shows \"Scanned to C1\"\n- H-Code: UN11111111\n- Message: \"Loadfill already completed\"\n- \"Close\" button\nCaption: Equipment type has already been completed\n\nScreen 2:\n- Progress: 1/1\n- Current time: 0 min\n- C1 Completed in 14 mins (Done)\n- H-Code: UN11111111\n- Warning message: \"Someone is already working on this cage\"\nCaption: Equipment type is been worked by another team member\n\nScreen 3:\n- Progress: 0/0\n- \"Scan barcode to start\"\n- \"Let's go!\"\n- Warning message: \"C2 cage removed as it is already completed\"\nCaption: Equipment type has already been completed by another team member"
    },
    {
      "doc": "Loadfill Adhoc Replenishment Guide",
      "quote": "Loadfill (Adhoc replenishment) screen information\n\nScreen Elements:\n- Total equipment types and progress: Shows as \"Progress: 1/2\" and \"Progress: 2/2\"\n- Current equipment time: Displays countdown (1 min / 0 min)\n- Area: C2\n- Equipment and barcode number:\n  * C2: H-Cage: UN22222222\n  * C1: H-Cage: UN11111111\n- Equipment completed time:\n  * C1: Completed in 14 mins\n  * C2: Completed in 15 mins\n- Equipment status: Shows \"Done\" when completed, \"In progress\" while active\n- Type in equipment barcode: Input field at top of screen\n- Timer will display 0 min when no cage is in progress\n- All completed equipment types are shown with status"
    }
  ]
}