# Managing Tory

[The image shows the Kmart logo and text "Managing Tory" on a pink background, with what appears to be a retail security tag or sensor device shown on the right side against a purple geometric background]

# Purpose

The purpose of this session is to provide information on Tory, Tory Dashboard, Managing Runs, Scenarios, Support, Pop Quiz, and Next Steps.

# Introducing Tory

[Image shows a white and pink robotic device or scanner against a pink and purple gradient background]

Name: TORY

About: Gender: Neutral. Nationality: German. Height: 150 - 180cm. Weight: 50 kg.

Likes: Long walks around the store, counting RFID tags, having a clean and clear path so it can get close to every item.

Dislikes: Heavy metal, particularly big metal surfaces. Strangers pushing my buttons. When people don't open doors for me.

# Getting to know TORY

1. On/Off requires a key.
2. LED display.
3. Sensors for depth perception.
4. Charging contacts to connect to the charging base.
5. Safety bumper.
6. Emergency stop button.
7. Grayscale camera for environmental perception.
8. RFID readers.

TORY should be left on at all times. If TORY is on, you will see an LED screen lit up on the panel of TORY.

The TORY key must not be left in TORY and should be stored in a safe location.

# Moving TORY

You may need to move TORY between chargers or when runs are aborted and Tory's brakes are engaged.

Do not push Tory when brakes are engaged.

Follow these steps when moving TORY:
- Press and release the emergency stop button.
- TORY should now be easy to push when brakes have been disengaged. Be gentle.
- Carefully push Tory to the second charging station.
- To dock, line up the metal bars on TORY with the metal prongs on the charging dock.
- If timeout is reached when moving, repeat step 1.
- Push onto the second charging station.
- Ensure the orange light is flashing.

The new location will be automatically logged.

# Bot Troubleshooting

Issue: TORY is turning off and on.  
Solution: Turn TORY off with the key, wait 5 seconds, then turn it back on.

Issue: TORY isn't charging.  
Solution: Turn the bot off and the charger, unplug the power, wait 30 seconds, then reconnect power and turn everything back on.

Issue: TORY LED screen is blank.  
Solution: Turn TORY off with the key, wait 5 seconds, then turn it back on.

# Cleaning TORY

Regular cleaning ensures good quality runs.  
Clean Tory weekly.  
All lasers need to be dust and grime free.  
Ensure Tory's home cubby is free of rubbish.  
Keep the area around Tory free of equipment and obstructions.

# Pre-Run Checks

Stores must complete a pre-run check via iAuditor to ensure readiness.

Key points: Tory is on charge and docked; TORY run path is clear; doors are open; all stock is in the correct container.  
Checks are accessible in iAuditor using store credentials.  
Verify TORY is correctly on the charging dock with orange and green lights on and screen indicating charging success.  
Ensure all equipment like pallet jacks, ladders, safety steps, h-cages, z rails, and totes are in designated places.  
Check that walkie stackers and electric pallet jacks are charging.  
Ensure stockroom areas are swept and debris-free.  
Confirm TORY's pink path is clear.  
Verify all apparel returns are stored properly.  
Ensure online pallets, ULDs, and FB2s are in correct RFID online areas.  
Signage must be laminated, displayed correctly, and not handwritten.  
Decanted apparel should be stored in RFID Zone 2.  
All fittings and fixtures should be neatly stored away.  
Remove all trolleys from the stockroom.  
Stockroom doors should be open.  
Main shop floor aisles and racetrack should be clear.  
Checkout bollards should not block Tory's run path.  
All DC manifests should be receipted.  
Bins with RFID or kimble tags should be emptied before Tory's run.

# Post Run Checks

Complete a post-run check via iAuditor to confirm Tory has run successfully and digital tasks are created.

Key points: Tory is on charge and docked.  
Digital tasks must be created.

Note: The question "Was the run successful? (Check the dashboard)" must be answered with details.  
Checks are in iAuditor using store credentials.

# TORY Dashboard

[Image shows a pink and white device with a tower-like structure on a pink and purple gradient background]

# Store Run Detail

1. Run Details: State, Location, Time, Duration, Tags, Mileage, Quality, Docking.  
Example: TORY-027 - Run 5896 - 05.30.2022. State: Finished. Location: 1124-STR. Time: 02:00 - 06:02. Duration: 04:01. Tags: 84026. Mileage: 1951m. Quality: 99% (Reached: 205/208, Alternative: 3/208, Skipped: 0/208). Docking: Successful.

2. Logs: Record of TORY run events with timestamps, modules, and logs.  
Example: 02:26 Server starting run 5896. 06:28 InventoryStatus: Finished. 06:28 Run: Finishing run. 06:28 RunEvaluation: Quality 99%. 06:28 Server: Finishing run 5896.

3. Store Map: Displays TORY run path. Can be downloaded or zoomed via mouse.

# Reading a Map

Waypoints: Green dots show waypoints TORY hit, with up to 30 seconds spent at each.  
Missed waypoints: Red dots indicate points not reached due to blockage or other issues.  
Alternative waypoints: Yellow dots show points Tory couldn't get to; yellow outlined green dots show alternative points taken.  
Run path: Red line traces Tory’s route; thicker, darker lines suggest localization issues or rerouting.  
Bumper issues: Yellow X's on map indicate bumper problems.

# [Error: Failed to extract text from page 14]

# Dashboard Overview

Main sections: HOME, RUNS, ROBOTS, ROBOT DETAIL, plus Custom Filters and Tory Dashboard.

# Setting Up Store Filter

Access Tory Dashboard via link: http://10.240.147.67:5555/#!/.  
On the Home page:  
- Click the settings icon.  
- "Manage Custom Filters" window appears.  
- Type your store name (e.g., Toowong).  
- Select the store by pressing the tab; it turns red.  
- Type filter name (e.g., Store name) and save.  
- Click Apply.  
On return, the store name appears at top left.  
- Select the Customer Filter tab; it turns red.  
This setting is saved but requires selecting each login.

# RUNS Page

Access via top toolbar.  
Default shows yesterday's runs.  
Sections: Top overview and bottom daily details.

Statistics include total runs, finished, failed, average run quality, successful docking, average duration.  
Sample data: 1 run, 100% finished, 0% failed, 99% quality, 100% docking, 4:01 average duration.  
Table includes run number, robot, date, start, stop, duration, state, docking, quality, location, tags, mileage.

# Detailed Runs View

Filter settings for date range.  
Graph displays success rate, finished, interrupted, docking metrics.  
Performance metrics per day: number of days, runs finished, quality, docking success, duration.  
Button: Update Data.

Navigation: HOME | RUNS | ROBOTS | ROBOT DETAIL | Custom Filter | Store Filter | Settings | Tory Dashboard.

# Individual Day Run Details

Same filter settings as above.  
Table headers: #, Robot, Date, Start, Stop, Duration, State, Docking, Quality, Location, Tags, Mileage.  
Sample row for May 30, 2022: run #5896, TORY-027, location, timing, etc.

# Store Run Detail (Repeated)

Same as previous, with detailed logs, maps, and run data.

# 7 Day Run Example

Date range: 5/23/2022 to 5/30/2022.  
Statistics: 7 runs, 86% finished, 14% failed, 84% quality, 86% docking, 3:48 average duration.  
Daily details for each date formatted similarly.

# Managing Runs Introduction Header

[The image shows a pink and white robotic or mechanical device against a pink and purple gradient background. The text "Managing Runs" appears as a large white heading on the left side.]

# Failed Runs - Root Cause Analysis

Stores may experience failed runs.  
Investigate root causes thoroughly: check bot, run map, identify what went wrong, and how to prevent recurrence.

For consecutive failed runs (not caused by store):  
• PIA will contact via email.  
• If no contact, raise a ticket with IT Help Desk, keep INC number.  
• Provide detailed reasons in iAuditor, including actions to prevent reoccurrence.

# Failed Runs and Robot Status

Common reasons for failed or interrupted runs:  
- Timeout: run took too long.  
- Too many skeletons skipped: unable to reach points after multiple attempts.  
- Too many waypoints skipped: unable to reach waypoints multiple times.  
- Timeout with low run quality: poor quality due to time limit.  
- Aborted: run stopped by software failure, shutdown, or network issue.

Robot statuses include:  
OK (no issues), Emergency Stop Pressed (EM button pressed; no runs), Motor Stop (internal error; switch off, wait, restart).  
For unlisted causes, contact PIA for troubleshooting.

# Failed Run: Timeout Example

Run 5841, 05.25.2022.  
State: Interrupted.  
Interrupt reason: Timeout.  
Location: 1362-STR.  
Time: 01:00 - 09:00.  
Duration: 07:59.  
Tags: 137458.  
Mileage: 4235m.  
Quality: 87% (Reached: 226/266, Alt: 15/266, Skipped: 2/266).  
Docking: Successful.  

Logs detail start, progress, and finish times, with quality and status updates.

Timeouts may be caused by obstructions or difficult stockroom areas, resulting in longer run times and poor quality.

# Failed Run: Too many skeletons skipped

Run 5865, 05.27.2022.  
State: Interrupted.  
Interrupt reason: Too many skeletons skipped.  
Location: 1124-STR.  
Time: 02:00 - 04:12.  
Duration: 02:11.  
Tags: 40401.  
Mileage: 1.404m.  
Quality: 0%.  
Docking: Failed.

Logs: run start, bumper pressed and released, run finish, quality failed.  
Cause: Mislocalisation or closed doors leading Tory to get lost or blocked, interrupting the run.

# Failed Run: Interrupted - Too many waypoints skipped

Run 5903, 05.31.2022.  
State: Interrupted.  
Interrupt reason: Too many waypoints skipped.  
Location: 1234_STE_FMAP.  
Time: 01:00 - 06:14.  
Duration: 05:14.  
Tags: 127240.  
Mileage: 2.016m.  
Quality: 52%.  
Docking: Successful.

Logs: start, bumper pressed, skipped waypoints, run ends.  
Cause: Congestion, obstacles, or mislocalisation preventing reaching waypoints.

# Failed Run: Timeout with Low Run Quality

Run 5452, 04.20.2022.  
State: Interrupted.  
Interrupt reason: Timeout with low run quality.  
Location: 1231-STR.  
Time: 01:15 - 07:45.  
Duration: 06:29.  
Tags: 100639.  
Mileage: 2617m.  
Quality: 56%.  
Docking: Failed.

Logs detail start, progress, poor quality, and timeout.  
Cause: Reaching max run time with poor waypoint completion.

# Failed Run: Aborted

Run 4677, 02.09.2022.  
State: Aborted.  
Location: 1124-STR.  
Time: 02:00 - -  
Duration: 01:04.  
Tags: 44226.  
Mileage: 619m.  
Quality: 3%.  
Docking: Successful.

Logs show manual abort actions; no detailed map or reason.  
Usually caused by software failure, shutdown, or network issues.  
Troubleshooting with PIA and MetaLabs is required.

# Scenarios

[The image shows a slide with "Scenarios" in white on a pink background, and an image of a white and pink robotic device.]

# Scenario 1 continued

Analysis from map shows Tory spent excessive time in an area, indicating miss-localisation or congestion.  
Actions: Confirm Tory isn't stuck due to congestion.  
PIAs will work with you to optimize runs and minimize recurrence of failures.

# Scenario 2

A run with incomplete map coverage indicates the system missed some parts.  
Possible causes include Tory got lost, shop floor doors were closed, or Tory didn't hit a waypoint.  
Map shows incomplete navigation path with red endpoint.

# Scenario 3

TORY undocked but did not move further from the charging dock.  
No door issues are evident.  
It did not reach any waypoint, suggesting it failed to progress after undocking.

# Tory Flow

Pre-run checklist to be completed in iAuditor.

Process flow:
1. Online picking / customer service.
2. Tory wakes up.
3. Data is collected.
4. Tory docks at charger.
5. Tory is moved:
   - If successful, moved to second charger if needed.
   - If failed, investigate via iAuditor and Web Services.
6. All Tory runs are completed:
   - If successful, proceed to hand scanning or digital tasks.
   - If failed, investigate via iAuditor and Web Services or with PIA.
7. Manual hand scanning if required for areas Tory cannot access.
8. Data consolidation.
9. IPS data verification.
10. Backfill task creation:
    - If not created, contact IT Service Desk.
11. Shop floor backfilling with stock.

# Support

[Image shows a white and pink robotic device with "Support" in white on pink and purple gradient background]

# Troubleshooting Support Issues

For Tory hardware or software issues (including battery), refer to Learning Guides.  
Urgent issues call 1800 033 534; non-urgent issues open a ticket via the KIT and search Service Desk.  
Link: http://intranet.core.kmtltd.net.au/kmart/forms/it_service_desk_issue_log.jsp

RFID printer problems: troubleshoot with Learning Guides.  
Urgent issues: call 1800 033 534; non-urgent: open a ticket via KIT.  
Link as above.

Digital tasks issues: troubleshoot using Learning Guides.  
PDT issues: reboot PDT or try a different device before escalation.  
Use Learning Guides and the Syspro app.

Log return to base jobs: open KIT, search RTB, and log via the Portal.  
Link: https://kmartaus.service-now.com/rtb

RFID tags and consumables are ordered via BlueStar.