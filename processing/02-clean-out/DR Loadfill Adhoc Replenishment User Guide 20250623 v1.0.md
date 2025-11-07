{
  "focus": { "type": "procedure", "id": "Loadfill (Adhoc Replenishment)" },
  "doc": { "name": "Loadfill Adhoc Replenishment Guide", "path": "/docs/loadfill_adhoc_replenishment.md" },
  "slice": {
    "type": "procedure",
    "title": "Loadfill (Adhoc Replenishment)",
    "pseudonyms": ["Loadfill", "Adhoc Replenishment", "Ad-hoc replenishment"],
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
      "If area is not known, select the world and then select the area.",
      "Scanned equipment type will be shown, and status will be in progress.",
      "Fill scanned equipment type.",
      "Completed equipment type and area will show as done, and a pop-up message will display done.",
      "Repeat the steps as you complete each type of equipment to be filled.",
      "If scanning a new equipment type with previous equipment type in progress, respond to the pop-up asking if the previous equipment type is done by selecting Yes or No, remove it.",
      "If previous equipment type was done, select Yes and then select Next to proceed.",
      "If previous equipment type was not done, select No, remove it and then select Next.",
      "After confirming, select Start loadfill cage to begin filling the new equipment type.",
      "Monitor progress and completion times displayed on screen.",
      "All completed equipment types will be listed in the Loadfill (Adhoc Replenishment) screen."
    ],
    "examples": [],
    "bestPractice": [],
    "caveats": [
      "If equipment type has already been completed, a message 'Loadfill already completed' will be shown.",
      "If someone else is already working on the cage, a warning message 'Someone is already working on this cage' will be displayed.",
      "If an equipment type is removed because it is already completed, a warning message 'cage removed as it is already completed' will be shown."
    ],
    "constraints": [],
    "troubleshooting": [],
    "metrics": [
      "Completion times are displayed in minutes, e.g., 'Completed in 14 mins'.",
      "Current time countdown is shown during filling, e.g., '1 min', '0 min'.",
      "Progress is shown as a fraction of completed equipment types, e.g., 'Progress: 1/2'."
    ]
  },
  "evidence": [
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "1. Select Menu\n2. Select the Loadfill under Adhoc replenishment" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "1. Scan the barcode on the equipment to be filled\n- Screen shows \"Scan barcode to start\" with \"Let's go!\" message\n- Progress: 0/0" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "2. Select Start loadfill cage\n- Shows scanned location C1\n- H-Code: UN11111111\n- \"Edit area\" option available\n- \"Start loadfill cage\" button at bottom" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "3. Scanned equipment type will be shown, and status will be in progress\n- Shows C1 \"In progress\"\n- H-Code: UN11111111\n- Current time: 1 min\n- Progress: 0/1" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "4. Fill scanned equipment type" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "5. Completed equipment type and area will show as done, pop message will also display done. Continue to repeat the steps as you complete each type of equipment to be filled.\n- Shows C1 \"Completed in 14 mins\"\n- H-Code: UN11111111\n- Current time: 0 min\n- Progress: 1/1\n- Pop-up message: \"Nailed it. C1 cage is done.\"" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "1. Scan the barcode on the equipment to be filled\nProgress: 0/0\n\"Let's go!\"\n\n2. No area selected will be shown. Select Start loadfill cage.\nH-Code: UN20052222\n\n3. Select the world\nH-Code: UN44444444\nOptions:\n- Home\n- Kids\n- Clothing\n- Event\n\n4. Select the area\nH-Code: UN44444444\nOptions:\nC1: Womenswear, WUSSH\nC2: Menswear, Basics\nC3: Footwear\nC4: Beauty & Accessories" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "7. Fill scanned equipment type\n\n8. Completed equipment type and area will show as done, pop message will also display done." },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "1. Scans a new equipment type with previous equipment type in progress\n- Shows Progress: 1/2\n- Current time: 4 min\n- C2 (H-Code: UN2222222) In progress\n- C1 (H-Code: UN1111111) Completed in 14 mins\n\n2. Pop up message will ask \"Is the previous equipment type done?\"\n- H-Code: UN2222222\n- Options: Yes / No, remove it\n\n3. If previous equipment type was done, select yes and select next\n- H-Code: UN2222222\n- Selected: Yes\n- Next button activated\n\n4. Pop up message to start loadfill cage will appear\n- Scanned to C3\n- H-Code: UN3333333\n- \"Start loadfill cage\" button\n\n5. Previous equipment type will show as done. New equipment type will show as in progress and can now be filled and completed\n- Progress: 2/3\n- Current time: 1 min\n- C3 (H-Code: UN3333333) In progress\n- C2 (H-Code: UN2222222) Completed in 15 mins\n- C1 (H-Code: UN1111111) Completed in 14 mins\n- Message: \"Nailed it. C2 cage is done.\"" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "1. Scans a new equipment type with previous equipment type in progress\n- Shows Progress: 1/2\n- Current time: 4 min\n- C2 (In progress)\n- H-Code: UN2222222\n- C1 Completed in 14 mins (Done)\n- H-Code: UN11111111\n\n2. Pop up message will ask Is the previous equipment type done\n- H-Code: UN2222222\n- Options: Yes / No, remove it\n\n3. If previous equipment type was not done, select no, remove it and select next\n- H-Code: UN22222\n- \"No, remove it\" selected\n- \"Next\" button highlighted\n\n4. Pop up message to start loadfill cage will appear, select Start loadfill cage\n- Scanned to C3\n- H-Code: UN33333333\n- \"Start loadfill cage\" button shown\n\n5. Previous equipment type will be removed, pop up message will show as removed. New equipment type will show as in progress and can now be filled and completed\n- Progress: 1/2\n- Current time: 1 min\n- C3 (In progress)\n- H-Code: UN33333333\n- C1 Completed in 14 mins (Done)\n- \"Removed C2 cage\" message shown" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "Screen 1:\n- Shows \"Scanned to C1\"\n- H-Code: UN11111111\n- Message: \"Loadfill already completed\"\n- \"Close\" button\nCaption: Equipment type has already been completed\n\nScreen 2:\n- Progress: 1/1\n- Current time: 0 min\n- C1 Completed in 14 mins (Done)\n- H-Code: UN11111111\n- Warning message: \"Someone is already working on this cage\"\nCaption: Equipment type is been worked by another team member\n\nScreen 3:\n- Progress: 0/0\n- \"Scan barcode to start\"\n- \"Let's go!\"\n- Warning message: \"C2 cage removed as it is already completed\"\nCaption: Equipment type has already been completed by another team member" },
    { "doc": "Loadfill Adhoc Replenishment Guide", "quote": "Screen Elements:\n- Total equipment types and progress: Shows as \"Progress: 1/2\" and \"Progress: 2/2\"\n- Current equipment time: Displays countdown (1 min / 0 min)\n- Area: C2\n- Equipment and barcode number:\n  * C2: H-Cage: UN22222222\n  * C1: H-Cage: UN11111111\n- Equipment completed time:\n  * C1: Completed in 14 mins\n  * C2: Completed in 15 mins\n- Equipment status: Shows \"Done\" when completed, \"In progress\" while active\n- Type in equipment barcode: Input field at top of screen\n- Timer will display 0 min when no cage is in progress\n- All completed equipment types are shown with status" }
  ]
}