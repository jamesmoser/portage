# The Story of Jack & Dianne (Ottawa Demonstration Plan)

This document provides the story and configuration details for the Jack and Dianne demonstration plan. The corresponding JSON import file is located at [jack_and_dianne.json](file:///Users/jamesmoser/Projects/portage/examples/jack_and_dianne.json).

---

## 🎙️ Video Introduction Script (Voiceover)

> "This is a story about Jack and Dianne, two Canadian adults doing the best that they can.
>
> Jack gave up his dream of becoming a hockey star to become a project manager in Ottawa, Ontario. He is 42 years old, making $150,000 per year.
>
> Dianne is 40 years old and works for Industry Canada making $90,000 per year. She is a public servant with a defined benefit pension that will pay her 60% of her salary when she retires on her 55th birthday.
>
> Jack was planning on retiring at 60, but secretly wonders if he can retire early with Dianne.
>
> They have been good savers, putting 18% of their pre-tax earnings into investments, maxing out their TFSAs first, and then their RRSPs. They are aggressive in their savings with an 80/20 mix that has averaged a 9% return, though at age 65 they plan to shift to a more conservative mix for safety, dropping their expected return to 7%.
>
> Dianne's family is long-lived, so she plans to age 95. Jack expects to live to an average age but wants some margin, planning to age 85.
>
> They have a small cash buffer of $10,000 and spend whatever remains of their after-tax income, aiming to maintain this level of lifestyle consumption in their early retirement (Go-Go) years before scaling back to 80% for the rest of their lives.
>
> Now, they are beginning to think about decumulation planning as novices, starting their CPP and OAS benefits at age 65.
>
> If everything goes according to plan, Jack and Dianne are set up for a very comfortable retirement. With their modest spending requirements, Jack could easily retire at 55. But things don't always go according to plan.
>
> With Dianne's defined benefit pension as a buffer, the couple's retirement looks secure under pressure - an unexpected layoff, Jack's untimely death, or a prolonged bear market. But that is only true in isolation; the story quickly erodes when these events occur together - that is, when life happens.
>
> Portage is a tool that allows you to evaluate the outcome under any possible scenario."

---

## ⚙️ Base Plan Configuration Details

### 1. Household Profiles
* **Jack (Person A)**:
  * Birth Date: `1984-07-08` (Age 42 in 2026)
  * Target Retirement: `2044-07-08` (Age 60)
  * Planning Horizon: `85`
  * Theme Color: `#3b82f6` (Blue)
  * Gender: `male`
* **Dianne (Person B)**:
  * Birth Date: `1986-02-12` (Age 40 in 2026)
  * Target Retirement: `2041-02-12` (Age 55)
  * Planning Horizon: `95`
  * Theme Color: `#ec4899` (Pink)
  * Gender: `female`
* **Inflation Rates**:
  * Personal Inflation Rate: `3.0%`
  * CPI Rate: `2.0%`

### 2. Incomes
* **Jack Salary**: `$150,000` / year (growth rate: `0%` real / flat in today's dollars)
* **Dianne Salary**: `$90,000` / year (growth rate: `0%` real / flat in today's dollars)

### 3. Defined Benefit Pension (Dianne)
* **Status**: Enabled
* **Source**: Industry Canada (Public Service Pension)
* **Annual Pension Amount**: `$54,000` (60% of $90,000 salary) starting at age 55 (`2041-02-12`)
* **CPI Indexed**: `true` (indexed at `2.0%`)
* **Survivor Benefit**: `60.0%`
* **Bridge Benefit**: `$0`

### 4. Calculated Assets & Contributions (Current State - 2026)
*Assuming 18% savings rate since age 22, 9% nominal returns, and prioritizing TFSA first:*
* **Jack**:
  * RRSP Balance: `$1,223,533` (Annual Contribution: `$20,000` until age 60)
  * TFSA Balance: `$282,109` (Annual Contribution: `$7,000` until age 60)
* **Dianne**:
  * RRSP Balance: `$447,190` (Annual Contribution: `$9,200` until age 55)
  * TFSA Balance: `$282,109` (Annual Contribution: `$7,000` until age 55)
* **Cash (HISA)**:
  * Balance: `$10,000` (Rate: `4.5%`, Min Balance: `$0`)

### 5. Return Rates (Nominal)
* **Pre-Retirement & Early Retirement (Up to Jack's Age 65)**: **`9.0%`** (Aggressive 80/20 mix)
* **Post-65 Retirement (Jack's Age 65+)**: **`7.0%`** (Shift to more conservative bond mix)

### 6. Spending Phases (Today's Dollars)
* **Pre-Retirement (Jack's Age 42 to 60)**: **`$120,422` / year**
* **Go-Go Years (Jack's Age 60 to 70)**: **`$120,422` / year** (Calculated net cash flow pre-retirement)
* **Slow-Go Years (Jack's Age 70 to 80)**: **`$96,338` / year** (80% of Go-Go)
* **No-Go Years (Jack's Age 80 to 85)**: **`$96,338` / year**
* **Survivor Years (Jack's Age 85 to 95)**: **`$96,338` / year**

### 7. Government Benefits
* **CPP & OAS**: Starts at age 65 for both (novice decumulation baseline)
  * **Jack CPP**: `$1,563` / month starting at `2049-07-08`
  * **Jack OAS**: `$742` / month starting at `2049-07-08`
  * **Dianne CPP**: `$1,563` / month starting at `2051-02-12`
  * **Dianne OAS**: `$742` / month starting at `2051-02-12`
