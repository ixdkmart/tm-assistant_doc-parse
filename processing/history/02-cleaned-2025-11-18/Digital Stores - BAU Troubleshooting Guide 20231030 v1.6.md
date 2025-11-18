# Digital Stores - BAU Troubleshooting Guide

## Page 1

Resources are located under KIT > Resources > Stores > Operations > One Simple Way Of Working > Digital Stores (RFID) > Learning Guides.

## Page 2

Issue Category: TORY

Description: Bot not turning on

Store Troubleshooting: Turn TORY off with the key, wait 5 seconds, then turn TORY back on. If unsuccessful, refer to the EM charging sequence below.

Training Guide: https://youtu.be/gU3ugDZk2l8

---

Issue: Bot not charging

Store Troubleshooting: Complete TORY Emergency Charging Sequence (video linked). If the bot does not come back online, contact Store Support.

Training Guide: https://youtu.be/AwrxX861rGg

---

Issue: Offline or low battery (emergency charging sequence)

Store Troubleshooting: Complete TORY Emergency Charging Sequence. If the bot does not come back online, contact Store Support.

Training Guide: https://youtu.be/AwrxX861rGg

---

Issue: Robots LED screen is blank

Store Troubleshooting: Turn TORY off with the key, wait 5 seconds, then turn TORY back on.

Training Guide: https://youtu.be/95vhWFwhXxI

---

Issue: Bumper is loose

Store Troubleshooting: Log a maintenance request with Store Support. Refer to page 5 of the linked document to identify and confirm which piece of TORY is damaged.

Link: https://intranet.core.kmtltd.net.au/public/download.jsp?id=448639

---

Issue: Emergency button is loose

Store Troubleshooting: Log a maintenance request with Store Support. Refer to page 5 of the linked document to confirm damage. Contact Store Support at 1800 033 534.

Link: https://intranet.core.kmtltd.net.au/public/download.jsp?id=448639

---

Issue: Emergency stop engaged

Store Troubleshooting: Release the emergency stop button. Check TORY display for engagement. If it appears engaged even when not pushed, log a maintenance request with Store Support.

Training Guide: https://youtu.be/sF_xYMEecg4

---

Issue: RFID reader has fallen off

Store Troubleshooting: Log a maintenance request with Store Support. Refer to page 5 of the linked document to identify and confirm damage.

Link: https://intranet.core.kmtltd.net.au/public/download.jsp?id=448639

---

Issue: Bumper error

Store Troubleshooting: Restart TORY. If bumper error does not clear, log a maintenance request with Store Support.

Training Guide: https://youtu.be/gU3ugDZk2l8

---

Issue: Interrupted runs

Store Troubleshooting: Refer to the training guide pages 25-29. If troubleshooting steps are not applicable and you have had consecutive aborted runs, contact Store Support.

Link: https://intranet.core.kmtltd.net.au/public/download.jsp?id=448639

---

Issue: Aborted run

Store Troubleshooting: Refer to training guide page 30. If troubleshooting steps are not applicable and you have had consecutive aborted runs, contact Store Support.

Link: https://intranet.core.kmtltd.net.au/public/download.jsp?id=448639

---

Issue: Run quality not met >90%

Store Troubleshooting: Check TORY run map via the TORY dashboard to identify waypoints TORY was unable to reach. Complete the pre-run checklist and ensure the affected area is free of congestion.

Link: https://dashboard.meta.doshared.a-kmtkmg.net/#/

## Page 3

TORY issues:

Mis-localised run: Clean TORY lasers and check wheels for debris. Check the TORY run path map to identify where the problem occurred. Complete pre-run checklist prior to the next run.

TORY hitting shroud at start: Clean TORY lasers and check wheels for debris. If consecutive runs failed due to hitting the shroud at the start, raise the issue with Store Support.

TORY failing to dock after running: Check charging area for debris and clean if needed. Return TORY to charger. If the problem persists, raise with Store Support.

Lost TORY keys: Replacement keys can be ordered via RTB (Spare Parts).

---

Hand Scanner:

Unable to connect to hand scanner to PDT: Turn on hand scanner by holding the power button (top right, green light) until a beep. Hold the Bluetooth button (bottom left, flashing blue light) until it flashes. Log in to the RFID app, click the hand-scanner symbol, select Zebra, and start scanning. Continuously hold the yellow trigger, select the correct device ID under the wand, click connect, and follow prompts. The device will beep when successfully connected.

Completing a hand scan to capture stock TORY cannot access: Pair the hand scanner as above. Refer to training guide.

---

Power Pack (Large Printer):

Seeing a triangle with an "!": Unplug the printer from AC power, turn on AC power, then plug the printer back in.

---

Printer (Portable):

Printer not connecting to network: Reboot the printer in a new area of the stockroom or shop floor. Contact store support.

RFID label ordering: Order via Bluestar.

Contact Store Support at 1800 033 534.

---

## Page 4

Large Printer issues:

Misaligned tags: Perform manual calibration. Access menu > printer icon > Manual Calibration > start calibration. Follow the 16-step visual guide.

Find the IP address: Click "Printer Info" in the top right corner. The IP address is under "Active IP (WLAN)".

Tags sliding out: Ensure the black lever with a yellow bottom is pushed in fully.

Printing VOID stickers: Perform RFID calibration. Access menu > RFID icon > feed tags out, click RFID calibrate, wait 5-10 minutes. When done, click the tick.

Small calibration not happening on power-up: Go to settings > Power Up Action > set to calibrate. Restart the printer.

Small calibration not happening when lid is closed: Go to settings > Head Close Action > set to calibrate.

Faint labels printing: Adjust print darkness to 25-30 in print settings.

RFID and thermal ribbon ordering: Order via Bluestar with the following product IDs:

Kmart Handheld Printer RFID Sticker: KMA95026392

Kmart Thermal Ribbon Roll: KMA95026390

Kmart Blank RFID Labels: KMA95026389

RFID app connection issues: Restart the printer and PDT, then contact Store Support.

---

## Page 5

RFID app:

Backfill data not loading (TORY successful run): Check TORY dashboard for run criteria. Reboot PDT, try another PDT, and if needed, go to menu > tasks > play button to synchronize remaining data. Contact Store Support at 1800 033 534.

Backfill data not loading (TORY interrupted): Ensure Tory run quality is over 90%. If below 90%, no backfill loads. If above 90%, reboot PDT, try another PDT, and synchronize remaining data.

Backfill data not loading (no run issues): Verify above steps. Check inventory percentage via inventory summary tile; it should be above 40%. If below, save, finalize, and wait 15 minutes. If still no backfill, contact Store Support.

Error symbol on inventory summary tile: If orange, data is uploading; wait up to 1 hour. If red, data failed to upload; contact Store Support.

PDT not responding or freezing: Reboot PDT, try another PDT, and contact Store Support.

Incorrect store assigned to PDT: Remove battery and scan the store-specific QR code.

Store operations:

TORY not moved to second location in time: Depending on run quality and inventory, backfill may still be available. Confirm if backfill loaded. Set reminders to move TORY on time. Contact Store Support for scheduling updates.

Strip and seal or overnight works: Notify Store Manager and Store Support. Engage emergency stop buttons.

Store doors not left open: Coach team to perform pre-run checks and leave doors open.

Pathway blocked: Coach team to ensure pre-run check is complete and pathway is clear.

Stock in wrong container: Locate and fill stock appropriately. Coach team on correct container placement. Contact Store Support for adjustments.

TORY not charging properly: Confirm charge status during pre-run. Contact Store Support if charging issues persist.

---

## Page 6

Store Operations:

Cannot fit all backfill stock: Review and reset pods to allocated module counts. Contact Store Support for any needed adjustments.

BOH container or run path change: Submit the relevant form via KIT.

Links:
https://intranet.core.kmltd.net.au/public/download.jsp?id=729108

https://intranet.core.kmltd.net.au/public/download.jsp?id=729109