{
  "focus": { "type": "procedure", "id": "GM Backfill Pick" },
  "doc":   { "name": "Task Engine - GM Backfill Pick", "path": "" },
  "slice": {
    "type": "procedure",
    "title": "GM Backfill Pick",
    "pseudonyms": [],
    "keywords": [
      "task engine",
      "gm backfill pick",
      "fixture location",
      "barcode scanning",
      "product scanning",
      "task completion",
      "troubleshooting"
    ],
    "steps": [
      "To filter tasks by Type select the filter function.",
      "Select to filter by Task Type to only display GM Backfill Pick tasks. You can also filter by World.",
      "Tasks shown will now be for Kids World GM Backfill Pick.",
      "Open a task to complete by selecting the task card.",
      "Scan the fixture location barcode with the PDT or type in the fixture number by pressing the keyboard icon.",
      "Once the fixture location has been accepted, scan the barcode of the first item in the location. Work from left to right, top to bottom.",
      "After scanning the barcode, the \"Take\" number indicates the minimum quantity you should take. If there's less than that in the fixture, take all.",
      "To continue, scan the barcode of the next item in the fixture location. If the \"Take\" number is 0, this item does not need to be picked and you can scan the next item.",
      "If the product is scanned into more than one location, enter the quantity you have picked from this location.",
      "Once each keycode (one of each item) in the fixture location has been scanned and all relevant quantities picked, press \"Finalise Backfill\".",
      "Before finalising, ensure there are not any keycodes in the fixture location that have been missed.",
      "Your task is complete and has been removed from the Task Engine home screen. You can now select the next task.",
      "This has been successfully passed through this phase, nothing has been done to it. This is just to test that it is sequentially going through the pipeline."
    ],
    "examples": [],
    "bestPractice": [],
    "caveats": [],
    "constraints": [],
    "troubleshooting": [
      "Error - Invalid fixture barcode on task screen: The barcode scanned is not a fixture location barcode, try scanning the correct one that matches the task you have selected.",
      "Error - Barcode scanned doesn't match fixture selected on task screen: The scanned fixture location barcode does not match the task you have selected. Ensure you are scanning the correct fixture.",
      "Error - Fixture already scanned on task screen: The correct fixture location barcode has already been scanned. Proceed with scanning a product keycode.",
      "Error - Product recall/withdrawal on task screen: This product has been recalled or withdrawn from sale and should not be placed on the shop floor. Ensure this product is moved to the recall bag immediately. After removal delete the product from the fixture.",
      "Errors- Something went wrong. Please try again or Lost connection. Please make sure you're within network coverage range: Pull down the app to refresh. Ensure you are in network range and have Wi-Fi bars on the PDT. If error message is still displayed, log out and log back into the Task Engine. If error message is still displayed after logging back in, reboot PDT. If rebooting the PDT does not clear the error message, contact the IT Service Desk.",
      "Error - lost connection with no tasks displayed on home screen: Pull down the app to refresh. Ensure you are in network range and have Wi-Fi bars on the PDT. If error message is still displayed, log out and log back in to the Task Engine."
    ],
    "metrics": []
  },
  "evidence": [
    { "doc": "Task Engine - GM Backfill Pick", "quote": "1. To filter tasks by Type select the filter function" },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "2. Here you can select to filter by Task Type to only display GM Backfill Pick tasks. You can also filter by World." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "3. Tasks shown will now be for Kids World GM Backfill Pick." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "5. Open a task to complete by selecting the task card" },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "6. Scan the fixture location barcode with the PDT or type in the fixture number by pressing the keyboard icon." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "7. Once the fixture location has been accepted, scan the barcode of the first item in the location. Work from left to right, top to bottom." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "8. After scanning the barcode, the \"Take\" number indicates the minimum quantity you should take. If there's less than that in the fixture, take all." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "9. To continue, scan the barcode of the next item in the fixture location. If the \"Take\" number is 0, this item does not need to be picked and you can scan the next item." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "10. If the product is scanned into more than one location, enter the quantity you have picked from this location." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "11. Once each keycode (one of each item) in the fixture location has been scanned and all relevant quantities picked, press \"Finalise Backfill\"." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "12. Before finalising, ensure there are not any keycodes in the fixture location that have been missed." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "13. Your task is complete and has been removed from the Task Engine home screen. You can now select the next task." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Error - Invalid fixture barcode on task screen\n1. The barcode scanned is not a fixture location barcode, try scanning the correct one that matches the task you have selected." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Error - Barcode scanned doesn't match fixture selected on task screen\n1. The scanned fixture location barcode does not match the task you have selected. Ensure you are scanning the correct fixture." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Error - Fixture already scanned on task screen\n1. The correct fixture location barcode has already been scanned. Proceed with scanning a product keycode." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Error - Product recall/withdrawal on task screen\n1. This product has been recalled or withdrawn from sale and should not be placed on the shop floor.\n2. Ensure this product is moved to the recall bag immediately.\n3. After removal delete the product from the fixture." },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Errors- Something went wrong. Please try again\nor\nLost connection. Please make sure you're within network coverage range\n\n1. Pull down the app to refresh\n2. Ensure you are in network range and have Wi-Fi bars on the PDT\n3. If error message is still displayed, log out and log back into the Task Engine\n4. If error message is still displayed after logging back in, reboot PDT\n5. If rebooting the PDT does not clear the error message, contact the IT Service Desk" },
    { "doc": "Task Engine - GM Backfill Pick", "quote": "Error - lost connection with no tasks displayed on home screen\n\n1. Pull down the app to refresh\n2. Ensure you are in network range and have Wi-Fi bars on the PDT\n3. If error message is still displayed, log out and log back in to the Task Engine" }
  ]
}