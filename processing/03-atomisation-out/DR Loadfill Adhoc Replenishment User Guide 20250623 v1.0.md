{
  "doc": {
    "name": "Loadfill Adhoc Replenishment Guide",
    "path": "/docs/loadfill_adhoc_replenishment.md"
  },
  "objects": [
    {
      "type": "procedure",
      "title": "Loadfill (Adhoc Replenishment)",
      "pseudonyms": [
        "Loadfill",
        "Adhoc Replenishment",
        "Ad-hoc replenishment"
      ],
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
      "caveats": [
        "If equipment type has already been completed, a message 'Loadfill already completed' will be shown.",
        "If someone else is already working on the cage, a warning message 'Someone is already working on this cage' will be displayed.",
        "If an equipment type is removed because it is already completed, a warning message 'cage removed as it is already completed' will be shown."
      ],
      "metrics": [
        "Completion times are displayed in minutes, e.g., 'Completed in 14 mins'.",
        "Current time countdown is shown during filling, e.g., '1 min', '0 min'.",
        "Progress is shown as a fraction of completed equipment types, e.g., 'Progress: 1/2'."
      ]
    }
  ]
}