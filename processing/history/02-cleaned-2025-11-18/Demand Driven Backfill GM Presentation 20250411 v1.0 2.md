# Page 1

Kmart

Low prices for life

Demand Driven

Backfill GM

March 2025

# Page 2

Contents

1. Digital Stores roadmap
2. Agile delivery
3. Benefits & unlocking value
4. Changes to backfill
5. Backfill Logic
6. Workload planning
7. Completion & Compliance
8. Rollout & support

# Page 3

Digital Stores roadmap

Key elements along the roadmap are RFID Khubs, demand driven GM backfill, backfill optimisation, inventory accuracy 2.1, apparel markdown, digitised replenishment, product location maps, task engine, Kmart NZ apparel RFID, and Kmart AU apparel RFID.

The roadmap is presented as a winding road with various initiatives branching off at different points, with checkmarks indicating completed items.

# Page 4

Agile delivery

Traditional delivery:

Solution scoped, designed and developed, followed by full launch.

The approach is linear in time and value progression.

Agile delivery:

Incremental steps include solution scoped, proof of concept launched, pilot launch, extended pilot, full launch, and additional functionality.

Each step shows user feedback incorporated.

Benefits include early access to the tool, early and frequent feedback opportunities, influence over next priorities, and improved team satisfaction and productivity.

# Page 5

What do agile enhancements look like for stores?

Updated route planning, table clustering v1, and Pathfinder barcode scanning.

Store specific MDU's, single pick reduction, and wall bleed reduction.

Identification of recalls or withdrawals, near-time reporting via the manager portal, and sound alerts for clearance, not on show, or no sales in 30 days.

# Page 6

Why are we changing?

There is an inconsistent approach to backfill completion, leading to waste.

Focus on 100% weekly fixture completion.

Order is based on store team preference with limited data backing.

Fixture pick timing impacts volume output.

BOH congestion affects store operations.

Use data-driven prioritisation to maintain or improve sales by selecting the right fixture at the right time.

# Page 7

Benefits

EBIT REM benefit is $2.53 million, saving 7 hours per store per week on average, a 26% reduction.

Sales benefit is $12 million, a 1.75% sales increase, tracked through BOH keycodes.

On average, 30% fewer BOH fixtures are scanned weekly.

Units picked increase by 25% compared to pre-pilot stores completing 100% backfill.

Volume of cages driven onto the shop floor increases by 9.5%.

Fixtures are repeated during peak periods (6.8 fixtures) and in standard weeks (1.9 fixtures).

# Page 8

How value is unlocked

Fixtures prioritised by logic, ensuring right stock at the right time.

Increased stock coming from stockrooms.

Reduction in BOH congestion.

Removal of non-value fixtures from workload.

Fewer fixtures scanned weekly.

Increases in productivity for backfill pick and sequence pack away.

New logic saves managers time in fixture selection.

# Page 9

Demand Driven Backfill

Daily fixture prioritisation removes non-value fixtures using dynamic logic to determine the percentage of total locations to pick each week.

Key elements:

Prioritise most valuable fixtures based on right stock, right time.

Pick the maximum amount of stock productively.

Identify fixtures for weekly repetition to maximise stock availability and sales.

Aim for an average completion of 70% of total fixtures, saving REM and driving sales.

# Page 10

How will backfill change?

Prioritisation and thresholds will be introduced.

Fixtures will be provided daily via task engine on PDT.

Stores will only complete fixtures if value is identified; doing so will be mandatory for all generated fixtures.

There will be no need to complete 100% of total stockroom fixtures.

Compliance is measured daily by comparing generated fixtures to completed fixtures.

Additional fixtures cannot be added.

Reporting will transition to Power BI, replacing paper-based methods long-term.

Near-time reporting will be available soon in the manager portal.

The mobile app will display store tasks and GM backfill fixtures with details like fixture numbers, keycodes, and locations.

# Page 11

What's not changing?

The calculation method for take quantities remains the same.

Scanning all keycodes in fixtures is unchanged.

Manifesting on time influences take quantity requirements.

SMS is calculated based on scanned versus expected keycodes.

Overstock overstocks reset keycode take quantities to zero.

Fixtures numbered 8900-8999 will not generate backfill tasks.

# Page 12

Introduction of prioritisation logic and thresholds

Current state:

All fixtures are picked on a Monday.

Example:

Fixtures 7001 to 7009 are scheduled on different days, for example, 7001 on Monday, 7002 on Wednesday, etc.

Future state:

Fixtures will be targeted at specific days, such as Monday, Wednesday, or Friday, with some fixtures not scheduled (N/A).

This approach targets the right locations at the right time to maximise stock output.

It results in more cages being produced, improving stock availability for customers.

N/A indicates fixtures not required to backfill that week.

# Page 13

Non-priority fixtures

Week 1-4:

Fixture 8003 is marked as not done, with a red X, indicating it was not completed in the last 4 weeks.

Week 5:

Fixture 8003 is added to the priority list regardless of initial priority, marked with a green check.

Key points:

All fixtures will be backfilled over a rolling 5-week period.

Less than 5% of fixtures are expected to reach week 5.

Fixtures not scanned within 28 days will automatically be added to week 5 to ensure SMS integrity.

# Page 14

Repeat fixtures

Symbols:

A green checkmark indicates the fixture was completed this week.

A dollar sign indicates the fixture's score exceeds the threshold and will be provided for repeat.

A refresh symbol indicates the fixture will be added to the priority list the following day.

# Page 15

Workload planning

After 3 weeks, a baseline trend for the average number of fixtures completed daily will be established to create a new base roster.

The weekly number of fixtures will be available each Monday via the Power BI report.

Teams will review the daily task list and assign fixtures accordingly, with tasks sorted numerically and filtered by world for ease.

Fixtures not completed on schedule will be recalculated and reprioritised for the next day, including weekends.

Remaining fixtures will be generated the following week if tasks are incomplete.

Two indicators show that prescribed fixtures must be completed Monday through Sunday, with 20% of fixtures assigned each weekday.

# Page 16

Backfill task completion

All GM backfill tasks are created daily between 4:00 am and 5:00 am local time.

Fixtures are provided daily via the task engine on PDT.

Each fixture has a dedicated task card; team members use the GM backfill pick filter to select it.

Only prescribed fixtures can be completed; additional fixtures are not allowed.

Stores will only complete fixtures if value is identified; repeat fixtures require value to be present.

Location refresh is still available and adds value to fixtures the next day.

Shop floor backfill, stockroom scan in/out, and current backfill functions remain operational.

The current backfill function will be disabled.

The mobile app interface shows fixture details, including fixture number, take count, and product info, with a "Finalise backfill" button.

# Page 17

Task compliance

Stores must complete 100% of generated fixtures daily.

Compliance is measured by comparing fixtures generated versus fixtures completed each day.

Example table:

Monday: 20 generated, 20 completed, 100% compliance, 0 carry over.

Tuesday: 20 generated, 20 completed, 100% compliance, 0 carry over.

Wednesday: 20 generated, 10 completed, 50% compliance, 10 carry over.

Thursday: 30 generated, 30 completed, 100% compliance, 0 carry over.

Friday: 20 generated, 5 completed, 25% compliance, 15 carry over.

Saturday: 15 generated, 15 completed, 100% compliance, 0 carry over.

Sunday: 4 generated, 4 completed, 100% compliance, 0 carry over.

Total fixtures completed: 104, compliance rate approximately 80.6%.

Weekend compliance is required during the pilot.

# Page 18

Reporting

Power BI dashboards will be the primary reporting interface as paper-based reports are phased out.

A new reporting dashboard with metrics, progress reports, and performance indicators is upcoming.

The visualisations include performance metrics, progress charts, completion rates, time-based analytics, tabular data, and status indicators.

# Page 19

When the priority logic works best

Stockroom keycodes are scanned in to increase fixture priority when accurate.

BOH fixture sortation following lean standards ensures efficiency and high SMS integrity.

Multi-located keycodes should be kept under 5% to ensure correct fixture value.

Location refresh maintained via store task tool updates fixture value, promoting stock out of stockrooms.

Gap scanning should be completed according to store task procedures.

# Page 20

Getting ready

Perform a lean (5S) reset.

Complete location refresh and gap scan as part of BAU in W4.

Ensure backfill is 100% complete by the Friday prior to go live.

Action multi-location fixtures with less than 5%.

Roster and train team members accordingly.

# Page 21

[No text provided]

# Page 22

Rollout & Support

Support contacts:

NSW/ACT: Nigel Brennan, Mobile: 0458 780 642

VIC/TAS: Ella Mulcahy, Mobile: 0447 438 169

QLD/NZ: Caleb Yeend, Mobile: 0460 359 216

WA: Ben Lewellin, Mobile: 0458 786 505

SA/NT: Josh Sustic, Mobile: 0457 195 250

Hypercare support involves contacting your Future Operations Manager for the first two weeks after rollout. After that, issues should be raised with the IT Service Desk at the provided contact numbers.

# Page 23

Rollout timelines

From January to March, weekly periods are marked from P7W1 to P9W4.

Activities include:

Yellow phase (Jan 20th - Feb 17th): Reset lean standards, signage, reduce multi locations within fixtures.

Green phase (Feb 24th - Mar 17th): Pre-deployment activities, training in MS Teams for NZ, NSW/QLD, WANTSA/VIC, go live events, and location refresh.

Specific BAU tasks involve gap scans in various categories and location refreshes, detailed in a red dashed box.

Note: “Stocktake” is labeled in February.

# Page 24

Support contacts during rollout:

NSW/ACT: Nigel Brennan, Mobile: 0458 780 642

VIC/TAS: Ella Mulcahy, Mobile: 0447 438 169

QLD/NZ: Caleb Yeend, Mobile: 0460 359 216

WA: Ben Lewellin, Mobile: 0458 786 505

SA/NT: Josh Sustic, Mobile: 0457 195 250

Hypercare support is available for the first two weeks. After that, raise issues to the IT Service Desk via the provided numbers.

# Page 25

Key callouts

Complete all pre-deployment activities before go live.

Support prioritisation and thresholds through BAU processes, including multi-location and location refresh.

Complete prescribed fixtures daily via Task Engine.

Continue learning and improving the process.

Gather and incorporate feedback continuously.

# Page 26

[No text provided]