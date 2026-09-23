# Tip tracking

Anonymous counts of how often the tip nudge is shown and clicked. Stored in Upstash Redis by `server/api/tip-event.post.ts`. No visitor data is kept, only numbers.

## How to see the numbers

In the Upstash console, open the **Data Browser** or **CLI** and run:

- `HGETALL stats:tip:total` for all-time counts, for example `share:shown = 120`, `share:click = 6`.
- `HGETALL stats:tip:daily:2026-09-24` for one day (use the date you want, `YYYY-MM-DD`, UTC). Daily counts are kept for 400 days.
- Click rate: `share:click` ÷ `share:shown`.

## What the fields mean

Each field is `<where>:<event>`.

**where**

| Value     | Place                                   |
| --------- | --------------------------------------- |
| `share`   | Tip card after sending text or a file   |
| `receive` | Tip card after receiving                |
| `banner`  | "Support this project" in the home page banner |
| `footer`  | "Support this project" link in the footer |
| `about`   | "Support via PayPal" button on the About page |

**event**

| Value    | Meaning                                                  |
| -------- | -------------------------------------------------------- |
| `shown`  | Tip card was shown                                       |
| `click`  | "Leave a tip" clicked on the tip card (or a support link) |
| `later`  | "Maybe later" clicked                                    |

## Notes

- Clicks count people who opened the PayPal page, not people who actually paid. Check PayPal for real payments.
- Each visitor can add at most 30 events a minute, so one person can't inflate the numbers.
- QR code scans can't be counted.
