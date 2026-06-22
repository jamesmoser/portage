# Portage — Historical Data Sources & Refresh Instructions

This document outlines the sources, methodology, and refresh instructions for the historical financial datasets used in Portage. This serves as a reference for future updates (e.g., at the end of each calendar year).

---

## 1. Datasets Overview

Portage supports five geographical/economic datasets for stress-testing retirement plans:

| ID | Name | Resolution | Period | Primary Sources | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `us_shiller` | U.S. Shiller | Monthly | 1871–2023 | Robert Shiller (Yale) | Standard long-horizon US equity and bond total returns. |
| `canada_cia` | Canada CIA | Monthly | 1924–2023 | StatCan, Bank of Canada, JST | Canadian domestic inflation, bond yields, and TSX returns. |
| `uk_lbs` | United Kingdom LBS | Monthly | 1900–2023 | London Business School, BoE | European benchmark, highlighting the 1970s stagflation crisis. |
| `japan_msci` | Japan MSCI | Monthly | 1970–2023 | MSCI Japan, Bank of Japan | The ultimate stagnation and long-term deflation stress test. |
| `global_jst` | Global Developed JST | Annual | 1870–2020 | Jordà-Schularick-Taylor (QJE) | Unbiased, cap-weighted average across 16 developed nations. |

---

## 2. Methodology & Sourcing

### A. U.S. Shiller (`us_shiller`)
*   **Equities:** S&P 500 Price + Dividends (reinvested monthly).
*   **Bonds:** 10-Year Treasury constant-maturity approximation.
*   **Inflation:** U.S. Consumer Price Index (CPI-U).
*   **Source URL:** [Robert Shiller's Yale Data](http://www.econ.yale.edu/~shiller/data.htm) (Download `ie_data.xls`).

### B. Canada CIA (`canada_cia`)
*   **Equities:** S&P/TSX Composite Total Return (reinvested) from 1979–Present. For 1924–1979, US total returns are adjusted by the CAD/USD exchange rate change and the domestic inflation differential.
*   **Bonds:** Canadian 10-Year Government Bond yields (constant maturity return approximation).
*   **Inflation:** Consumer Price Index (CPI) from Statistics Canada.
*   **Source URLs:**
    *   [FRED Canada CPI (CPALTT01CAM659N)](https://fred.stlouisfed.org/series/CPALTT01CAM659N)
    *   [FRED Canada 10-Yr Bond Yield (IRLTLT01CAM156N)](https://fred.stlouisfed.org/series/IRLTLT01CAM156N)
    *   [Yahoo Finance TSX (^GSPTSE)](https://finance.yahoo.com/quote/%5EGSPTSE)

### C. United Kingdom LBS (`uk_lbs`)
*   **Equities:** FTSE All-Share Total Return.
*   **Bonds:** UK Government Gilts (10-Year constant maturity approximation).
*   **Inflation:** UK Consumer Price Index (ONS).
*   **Source URLs:**
    *   [FRED UK CPI (CPALTT01GBM659N)](https://fred.stlouisfed.org/series/CPALTT01GBM659N)
    *   [FRED UK 10-Yr Bond Yield (IRLTLT01GBM156N)](https://fred.stlouisfed.org/series/IRLTLT01GBM156N)

### D. Japan MSCI (`japan_msci`)
*   **Equities:** MSCI Japan Index / Nikkei 225 Total Return.
*   **Bonds:** Japanese 10-Year Government Bond Yields.
*   **Inflation:** Japan Consumer Price Index (Statistics Bureau).
*   **Source URLs:**
    *   [FRED Japan CPI (CPALTT01JPM659N)](https://fred.stlouisfed.org/series/CPALTT01JPM659N)
    *   [FRED Japan 10-Yr Bond Yield (IRLTLT01JPM156N)](https://fred.stlouisfed.org/series/IRLTLT01JPM156N)

### E. Global Developed JST (`global_jst`)
*   **Data:** Annual stock, bond, and CPI inflation returns.
*   **Sourcing:** Extracted from the **Jordà-Schularick-Taylor Macrohistory Database** (QJE, 2019). The global index represents the cap-weighted/equal average across the 16 countries containing full returns history (excluding Canada and Ireland due to missing equity returns).
*   **Source URL:** [JST Macrohistory Database](https://www.macrohistory.net/data/) (Download `JSTdatasetR6.xlsx`).

---

## 3. How to Refresh Data (e.g., Year-End Update)

When updating the data for a new calendar year (e.g., at the end of 2026 to add 2024 and 2025 data):

### Step 1: Download/Refresh the JST Macrohistory Database
1. Go to the [JST Macrohistory Database page](https://www.macrohistory.net/data/).
2. Download the Excel file `JSTdatasetR6.xlsx` (or its latest version).
3. Place this file in your `Downloads` folder, or in the root of the Portage directory. The compilation script checks these locations automatically.

### Step 2: Refresh the Monthly U.S. Shiller Data
Since the script reads U.S. Shiller monthly returns from [historicalData.ts](file:///Users/jamesmoser/Projects/portage/src/engine/historicalData.ts), you must update that file first:
1. Go to [Robert Shiller's Yale Data](http://www.econ.yale.edu/~shiller/data.htm).
2. Download `ie_data.xls`.
3. Open the spreadsheet and look at the recent monthly rows (columns for Stock Price, Dividend, CPI, and Long-Term Bond Yield).
4. Calculate the monthly returns:
   - **Equity return (nominal):** $R_{eq} = \frac{P_t + (D_t / 12)}{P_{t-1}} - 1$
   - **Bond return (nominal):** Constant-maturity approximation: $R_{bond} = y_{t-1}/12 - D \cdot (y_t - y_{t-1})/12$ where $y$ is the yield decimal and $D \approx 7.0$ is the duration.
   - **CPI level:** Use the raw CPI-U value.
5. Open [src/engine/historicalData.ts](file:///Users/jamesmoser/Projects/portage/src/engine/historicalData.ts) and append the new monthly rows to the `HISTORICAL_MONTHLY_RETURNS` array:
   ```typescript
   { year: 2023, month: 10, equity: 0.021, bond: 0.005, cpi: 307.671 },
   ...
   ```

### Step 3: Append Recent Years for Canada, UK, and Japan in the Script
Because the JST database currently ends in 2020, recent annual returns are hardcoded in the compilation script:
1. Open [scripts/compile_datasets.py](file:///Users/jamesmoser/Projects/portage/scripts/compile_datasets.py).
2. Locate the sections where annual data is appended for Canada (around line 224), UK (around line 273), and Japan (around line 326).
3. Find the annual equity return, bond return, and inflation (CPI change) for the new years (e.g., 2024, 2025) from public databases (like StatCan, ONS, ONS UK, StatBureau Japan, FRED, or Yahoo Finance).
4. Append the new year dictionary to each country list. For example, for Canada:
   ```python
   can_annual.append({'year': 2024, 'equity': 0.105, 'bond': 0.032, 'cpiChange': 0.025})
   ```

### Step 4: Run the Compilation Script
Run the script using `python3` (or `python` if configured as an alias):
```bash
python3 scripts/compile_datasets.py
```
This script will:
- Parse `JSTdatasetR6.xlsx`.
- Extract long-term series for Canada, UK, Japan, and USA.
- Merge the JST data with the recent hardcoded years.
- Convert annual returns into monthly compounding points for the monthly datasets.
- Generate the compiled TypeScript files in [src/engine/datasets/](file:///Users/jamesmoser/Projects/portage/src/engine/datasets/).

### Step 5: Test and Build the Application
After compilation, run the test suite and compile the single-file production build to ensure that all changes are valid:
```bash
npm run test
npm run build
```
The application will bundle the new datasets into the single HTML output.
