# The Story of Dan (Solo Estate Lawyer Plan)

This document provides the story and configuration details for the Dan solo planner demonstration plan. The corresponding JSON import file is located at [dan_solo.json](./dan_solo.json).

---

## 🎙️ Video Introduction Script (Voiceover)

> "This is a story about Dan, a divorced 54-year-old estate lawyer who lives in Ontario. Dan has no dependents, no friends, and no interest in leaving a legacy behind. 
>
> Dan currently makes $190,000 per year. Over his career, he has built up a solid nest egg: $1.2 million in RRSPs, $100,000 in TFSAs, $250,000 in a Non-Registered account, and $50,000 in cash in a High Interest Savings Account.
>
> Dan plans to retire on his 60th birthday—September 12, 2031. During his remaining six working years, Dan will continue saving $20,000 per year into his RRSPs and $7,000 per year into his TFSAs. He will not make any additional non-registered or cash contributions.
>
> When Dan retires, he wants to maintain a flat, simple lifestyle, spending $60,000 per year in today's dollars until he dies at age 82. Since he lives alone, he does not have to worry about spousal pension splitting, survivorship benefits, or passing on an estate.
>
> For his investments, we assume a flat 8.0% nominal return rate on his portfolio, and a 2.0% return rate on his HISA. At age 65, he will start collecting his maximum CPP and full OAS benefits.
>
> Without a spouse or dependents to plan for, Dan's plan is a pure decumulation stress test. Portage will help Dan evaluate if his nest egg will last through his plan, or if his high initial assets mean he can retire even earlier."

---

## ⚙️ Base Plan Configuration Details

### 1. Household Profiles
* **Dan (Person A)**:
  * Birth Date: `1971-09-12` (Age 54 in 2026)
  * Target Retirement: `2031-09-12` (Age 60)
  * Planning Horizon: `82`
  * Theme Color: `#3b82f6` (Blue)
  * Gender: `male`
* **Person B (Inactive)**:
  * *Note: To model a single household, Person B is configured with no name, zero assets, and a planning horizon end at age 54 so they are inactive/deceased from the start of the simulation.*
* **Inflation Rates**:
  * Personal Inflation Rate: `3.0%`
  * CPI Rate: `2.0%`

### 2. Incomes
* **Dan Salary**: `$190,000` / year (growth rate: `3.0%` nominal / year until retirement)

### 3. Defined Benefit Pension
* **Status**: None / Disabled

### 4. Assets & Contributions (Current State - 2026)
* **RRSP (Dan)**:
  * Balance: `$1,200,000` (Annual Contribution: `$20,000` until age 60)
* **TFSA (Dan)**:
  * Balance: `$100,000` (Annual Contribution: `$7,000` until age 60)
* **Non-Registered (Dan)**:
  * Balance: `$250,000` (ACB: `$160,000`, Annual Contribution: `$0`)
* **Cash (HISA)**:
  * Balance: `$50,000` (Rate: `2.0%`, Min Balance: `$0`)

### 5. Return Rates (Nominal)
* **Flat Rate Assumption**: **`8.0%`** across all age tiers.

### 6. Spending Phases (Today's Dollars)
* **Pre-Retirement (Dan's Age 54 to 60)**: **`$120,000` / year**
* **Retirement / Go-Go Years (Dan's Age 60 to 70)**: **`$60,000` / year** (Flat target spending)
* **Slow-Go Years (Dan's Age 70 to 80)**: **`$60,000` / year** (Flat target spending)
* **No-Go Years (Dan's Age 80 to 82)**: **`$60,000` / year** (Flat target spending)

### 7. Government Benefits
* **CPP & OAS**: Both start at age 65 (`2036-09-12`)
  * **Dan CPP**: `$1,563` / month (Maximum combined CPP/CPP2 at age 65)
  * **Dan OAS**: `$742` / month (Full OAS with 40 years of Canadian residency)
