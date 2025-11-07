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
        "scan",
        "cage",
        "rail",
        "pallet",
        "progress",
        "status",
        "area",
        "h-code"
      ],
      "steps": [
        "Select Menu.",
        "Select the Loadfill under Adhoc replenishment.",
        "Scan the barcode on the equipment to be filled.",
        "Select Start loadfill cage.",
        "If area is not known, select the world icon and then select the area.",
        "Scanned equipment type will be shown, and status will be in progress.",
        "Fill scanned equipment type.",
        "Completed equipment type and area will show as done, and a pop-up message will display confirmation.",
        "Repeat the steps as you complete each type of equipment to be filled.",
        "If scanning a new equipment type while previous equipment type is in progress, confirm if the previous equipment type is done when prompted.",
        "If previous equipment type is done, select yes and proceed to next equipment.",
        "If previous equipment type is not done, select no, remove it, and proceed to next equipment.",
        "Start loadfill cage for the new equipment type.",
        "Monitor progress and completion times displayed on screen.",
        "Handle screen messages indicating equipment status or conflicts accordingly."
      ],
      "examples": [],
      "bestPractice": [],
      "caveats": [],
      "constraints": [],
      "troubleshooting": [],
      "metrics": [
        "Completion times displayed in minutes (e.g., Completed in 14 mins).",
        "Progress indicators showing number of equipment types completed out of total (e.g., Progress: 1/2).",
        "Current time countdown displayed in minutes (e.g., 1 min, 0 min)."
      ]
    }
  ]
}