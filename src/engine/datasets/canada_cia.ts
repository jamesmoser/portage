import { HistoricalDataset } from '../types'

export const dataset: HistoricalDataset = {
  "id": "canada_cia",
  "name": "Canada CIA",
  "shortName": "Canada CIA",
  "geographicFocus": "Canada",
  "flag": "\ud83c\udde8\ud83c\udde6",
  "startYear": 1924,
  "endYear": 2023,
  "resolution": "monthly",
  "description": "Canadian stock market total returns (TSX), 10-Year Government Bond returns, and StatCan CPI inflation.",
  "limitations": [
    "Equity returns pre-1979 are proxied by USD exchange rate-adjusted S&P 500 returns.",
    "Inflation is based on StatsCan consumer index."
  ],
  "eras": [
    {
      "year": 1929,
      "month": 9,
      "label": "Great Depression",
      "description": "Global economic collapse hitting commodity-heavy Canada."
    },
    {
      "year": 1945,
      "month": 9,
      "label": "Post-War Expansion",
      "description": "Post-WWII growth and industrialization."
    },
    {
      "year": 1973,
      "month": 1,
      "label": "Oil Shock Inflation",
      "description": "Commodity boom with high inflation."
    },
    {
      "year": 1981,
      "month": 8,
      "label": "High Rate Spike",
      "description": "Double-digit bond yields and prime interest rates."
    },
    {
      "year": 2008,
      "month": 1,
      "label": "Global Financial Crisis",
      "description": "Resource collapse and banking system stress."
    }
  ],
  "epochs": [
    {
      "year": 1924,
      "label": "1924\u20132023 (Full History)"
    },
    {
      "year": 1950,
      "label": "1950\u20132023 (Modern Era)"
    },
    {
      "year": 1980,
      "label": "1980\u20132023 (Post-Stagflation)"
    },
    {
      "year": 2000,
      "label": "2000\u20132023 (21st Century)"
    },
    {
      "year": 2010,
      "label": "2010\u20132023 (Recent Decade)"
    }
  ],
  "data": [
    {
      "year": 1924,
      "month": 1,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.9856
    },
    {
      "year": 1924,
      "month": 2,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.9711
    },
    {
      "year": 1924,
      "month": 3,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.9567
    },
    {
      "year": 1924,
      "month": 4,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.9423
    },
    {
      "year": 1924,
      "month": 5,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.928
    },
    {
      "year": 1924,
      "month": 6,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.9136
    },
    {
      "year": 1924,
      "month": 7,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.8993
    },
    {
      "year": 1924,
      "month": 8,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.885
    },
    {
      "year": 1924,
      "month": 9,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.8708
    },
    {
      "year": 1924,
      "month": 10,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.8565
    },
    {
      "year": 1924,
      "month": 11,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.8423
    },
    {
      "year": 1924,
      "month": 12,
      "equity": 0.0171737,
      "bond": 0.0049465,
      "cpi": 9.828
    },
    {
      "year": 1925,
      "month": 1,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8357
    },
    {
      "year": 1925,
      "month": 2,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8434
    },
    {
      "year": 1925,
      "month": 3,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8511
    },
    {
      "year": 1925,
      "month": 4,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8588
    },
    {
      "year": 1925,
      "month": 5,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8665
    },
    {
      "year": 1925,
      "month": 6,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8742
    },
    {
      "year": 1925,
      "month": 7,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8819
    },
    {
      "year": 1925,
      "month": 8,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8896
    },
    {
      "year": 1925,
      "month": 9,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.8974
    },
    {
      "year": 1925,
      "month": 10,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.9051
    },
    {
      "year": 1925,
      "month": 11,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.9128
    },
    {
      "year": 1925,
      "month": 12,
      "equity": 0.0208871,
      "bond": 0.0044955,
      "cpi": 9.9206
    },
    {
      "year": 1926,
      "month": 1,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9294
    },
    {
      "year": 1926,
      "month": 2,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9382
    },
    {
      "year": 1926,
      "month": 3,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9469
    },
    {
      "year": 1926,
      "month": 4,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9557
    },
    {
      "year": 1926,
      "month": 5,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9646
    },
    {
      "year": 1926,
      "month": 6,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9734
    },
    {
      "year": 1926,
      "month": 7,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9822
    },
    {
      "year": 1926,
      "month": 8,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.991
    },
    {
      "year": 1926,
      "month": 9,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 9.9999
    },
    {
      "year": 1926,
      "month": 10,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 10.0087
    },
    {
      "year": 1926,
      "month": 11,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 10.0176
    },
    {
      "year": 1926,
      "month": 12,
      "equity": 0.0108532,
      "bond": 0.0037548,
      "cpi": 10.0264
    },
    {
      "year": 1927,
      "month": 1,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 10.012
    },
    {
      "year": 1927,
      "month": 2,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9975
    },
    {
      "year": 1927,
      "month": 3,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9831
    },
    {
      "year": 1927,
      "month": 4,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9688
    },
    {
      "year": 1927,
      "month": 5,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9544
    },
    {
      "year": 1927,
      "month": 6,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9401
    },
    {
      "year": 1927,
      "month": 7,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9257
    },
    {
      "year": 1927,
      "month": 8,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.9114
    },
    {
      "year": 1927,
      "month": 9,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.8972
    },
    {
      "year": 1927,
      "month": 10,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.8829
    },
    {
      "year": 1927,
      "month": 11,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.8687
    },
    {
      "year": 1927,
      "month": 12,
      "equity": 0.0254423,
      "bond": 0.0050018,
      "cpi": 9.8544
    },
    {
      "year": 1928,
      "month": 1,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8577
    },
    {
      "year": 1928,
      "month": 2,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.861
    },
    {
      "year": 1928,
      "month": 3,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8643
    },
    {
      "year": 1928,
      "month": 4,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8676
    },
    {
      "year": 1928,
      "month": 5,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8709
    },
    {
      "year": 1928,
      "month": 6,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8742
    },
    {
      "year": 1928,
      "month": 7,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8775
    },
    {
      "year": 1928,
      "month": 8,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8808
    },
    {
      "year": 1928,
      "month": 9,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8841
    },
    {
      "year": 1928,
      "month": 10,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8875
    },
    {
      "year": 1928,
      "month": 11,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8908
    },
    {
      "year": 1928,
      "month": 12,
      "equity": 0.0269608,
      "bond": 0.0047411,
      "cpi": 9.8941
    },
    {
      "year": 1929,
      "month": 1,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.904
    },
    {
      "year": 1929,
      "month": 2,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9138
    },
    {
      "year": 1929,
      "month": 3,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9237
    },
    {
      "year": 1929,
      "month": 4,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9336
    },
    {
      "year": 1929,
      "month": 5,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9435
    },
    {
      "year": 1929,
      "month": 6,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9534
    },
    {
      "year": 1929,
      "month": 7,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9634
    },
    {
      "year": 1929,
      "month": 8,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9733
    },
    {
      "year": 1929,
      "month": 9,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9833
    },
    {
      "year": 1929,
      "month": 10,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 9.9932
    },
    {
      "year": 1929,
      "month": 11,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 10.0032
    },
    {
      "year": 1929,
      "month": 12,
      "equity": -0.002256,
      "bond": 0.0011016,
      "cpi": 10.0132
    },
    {
      "year": 1930,
      "month": 1,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 10.0077
    },
    {
      "year": 1930,
      "month": 2,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 10.0021
    },
    {
      "year": 1930,
      "month": 3,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9966
    },
    {
      "year": 1930,
      "month": 4,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9911
    },
    {
      "year": 1930,
      "month": 5,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9856
    },
    {
      "year": 1930,
      "month": 6,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9801
    },
    {
      "year": 1930,
      "month": 7,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9746
    },
    {
      "year": 1930,
      "month": 8,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9691
    },
    {
      "year": 1930,
      "month": 9,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9636
    },
    {
      "year": 1930,
      "month": 10,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9581
    },
    {
      "year": 1930,
      "month": 11,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9526
    },
    {
      "year": 1930,
      "month": 12,
      "equity": -0.0221592,
      "bond": 0.0051279,
      "cpi": 9.9471
    },
    {
      "year": 1931,
      "month": 1,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.8616
    },
    {
      "year": 1931,
      "month": 2,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.7768
    },
    {
      "year": 1931,
      "month": 3,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.6928
    },
    {
      "year": 1931,
      "month": 4,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.6095
    },
    {
      "year": 1931,
      "month": 5,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.5269
    },
    {
      "year": 1931,
      "month": 6,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.445
    },
    {
      "year": 1931,
      "month": 7,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.3638
    },
    {
      "year": 1931,
      "month": 8,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.2833
    },
    {
      "year": 1931,
      "month": 9,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.2036
    },
    {
      "year": 1931,
      "month": 10,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.1244
    },
    {
      "year": 1931,
      "month": 11,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 9.046
    },
    {
      "year": 1931,
      "month": 12,
      "equity": -0.0268776,
      "bond": 0.0043049,
      "cpi": 8.9683
    },
    {
      "year": 1932,
      "month": 1,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.8969
    },
    {
      "year": 1932,
      "month": 2,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.8261
    },
    {
      "year": 1932,
      "month": 3,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.7558
    },
    {
      "year": 1932,
      "month": 4,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.6861
    },
    {
      "year": 1932,
      "month": 5,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.617
    },
    {
      "year": 1932,
      "month": 6,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.5484
    },
    {
      "year": 1932,
      "month": 7,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.4804
    },
    {
      "year": 1932,
      "month": 8,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.4129
    },
    {
      "year": 1932,
      "month": 9,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.3459
    },
    {
      "year": 1932,
      "month": 10,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.2795
    },
    {
      "year": 1932,
      "month": 11,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.2136
    },
    {
      "year": 1932,
      "month": 12,
      "equity": -0.0155743,
      "bond": 0.001011,
      "cpi": 8.1482
    },
    {
      "year": 1933,
      "month": 1,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 8.1155
    },
    {
      "year": 1933,
      "month": 2,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 8.083
    },
    {
      "year": 1933,
      "month": 3,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 8.0506
    },
    {
      "year": 1933,
      "month": 4,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 8.0183
    },
    {
      "year": 1933,
      "month": 5,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.9861
    },
    {
      "year": 1933,
      "month": 6,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.9541
    },
    {
      "year": 1933,
      "month": 7,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.9222
    },
    {
      "year": 1933,
      "month": 8,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.8904
    },
    {
      "year": 1933,
      "month": 9,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.8588
    },
    {
      "year": 1933,
      "month": 10,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.8273
    },
    {
      "year": 1933,
      "month": 11,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.7959
    },
    {
      "year": 1933,
      "month": 12,
      "equity": 0.0230554,
      "bond": 0.007415,
      "cpi": 7.7646
    },
    {
      "year": 1934,
      "month": 1,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.7734
    },
    {
      "year": 1934,
      "month": 2,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.7821
    },
    {
      "year": 1934,
      "month": 3,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.7909
    },
    {
      "year": 1934,
      "month": 4,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.7997
    },
    {
      "year": 1934,
      "month": 5,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8085
    },
    {
      "year": 1934,
      "month": 6,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8173
    },
    {
      "year": 1934,
      "month": 7,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8262
    },
    {
      "year": 1934,
      "month": 8,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.835
    },
    {
      "year": 1934,
      "month": 9,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8438
    },
    {
      "year": 1934,
      "month": 10,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8527
    },
    {
      "year": 1934,
      "month": 11,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8615
    },
    {
      "year": 1934,
      "month": 12,
      "equity": -0.0028234,
      "bond": 0.0072304,
      "cpi": 7.8704
    },
    {
      "year": 1935,
      "month": 1,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.8748
    },
    {
      "year": 1935,
      "month": 2,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.8792
    },
    {
      "year": 1935,
      "month": 3,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.8836
    },
    {
      "year": 1935,
      "month": 4,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.888
    },
    {
      "year": 1935,
      "month": 5,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.8924
    },
    {
      "year": 1935,
      "month": 6,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.8968
    },
    {
      "year": 1935,
      "month": 7,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.9012
    },
    {
      "year": 1935,
      "month": 8,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.9056
    },
    {
      "year": 1935,
      "month": 9,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.91
    },
    {
      "year": 1935,
      "month": 10,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.9145
    },
    {
      "year": 1935,
      "month": 11,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.9189
    },
    {
      "year": 1935,
      "month": 12,
      "equity": 0.033923,
      "bond": 0.0060839,
      "cpi": 7.9233
    },
    {
      "year": 1936,
      "month": 1,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 7.9364
    },
    {
      "year": 1936,
      "month": 2,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 7.9495
    },
    {
      "year": 1936,
      "month": 3,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 7.9627
    },
    {
      "year": 1936,
      "month": 4,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 7.9759
    },
    {
      "year": 1936,
      "month": 5,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 7.9891
    },
    {
      "year": 1936,
      "month": 6,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0023
    },
    {
      "year": 1936,
      "month": 7,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0155
    },
    {
      "year": 1936,
      "month": 8,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0288
    },
    {
      "year": 1936,
      "month": 9,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0421
    },
    {
      "year": 1936,
      "month": 10,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0554
    },
    {
      "year": 1936,
      "month": 11,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.0687
    },
    {
      "year": 1936,
      "month": 12,
      "equity": 0.0253017,
      "bond": 0.0051279,
      "cpi": 8.082
    },
    {
      "year": 1937,
      "month": 1,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.1027
    },
    {
      "year": 1937,
      "month": 2,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.1234
    },
    {
      "year": 1937,
      "month": 3,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.1441
    },
    {
      "year": 1937,
      "month": 4,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.1649
    },
    {
      "year": 1937,
      "month": 5,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.1858
    },
    {
      "year": 1937,
      "month": 6,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.2067
    },
    {
      "year": 1937,
      "month": 7,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.2277
    },
    {
      "year": 1937,
      "month": 8,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.2487
    },
    {
      "year": 1937,
      "month": 9,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.2698
    },
    {
      "year": 1937,
      "month": 10,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.2909
    },
    {
      "year": 1937,
      "month": 11,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.3121
    },
    {
      "year": 1937,
      "month": 12,
      "equity": -0.0300243,
      "bond": 0.001299,
      "cpi": 8.3333
    },
    {
      "year": 1938,
      "month": 1,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.341
    },
    {
      "year": 1938,
      "month": 2,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3487
    },
    {
      "year": 1938,
      "month": 3,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3564
    },
    {
      "year": 1938,
      "month": 4,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3641
    },
    {
      "year": 1938,
      "month": 5,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3718
    },
    {
      "year": 1938,
      "month": 6,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3795
    },
    {
      "year": 1938,
      "month": 7,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3872
    },
    {
      "year": 1938,
      "month": 8,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.3949
    },
    {
      "year": 1938,
      "month": 9,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.4026
    },
    {
      "year": 1938,
      "month": 10,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.4104
    },
    {
      "year": 1938,
      "month": 11,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.4181
    },
    {
      "year": 1938,
      "month": 12,
      "equity": 0.0159077,
      "bond": 0.0030564,
      "cpi": 8.4259
    },
    {
      "year": 1939,
      "month": 1,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.4204
    },
    {
      "year": 1939,
      "month": 2,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.4148
    },
    {
      "year": 1939,
      "month": 3,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.4093
    },
    {
      "year": 1939,
      "month": 4,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.4038
    },
    {
      "year": 1939,
      "month": 5,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3983
    },
    {
      "year": 1939,
      "month": 6,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3928
    },
    {
      "year": 1939,
      "month": 7,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3873
    },
    {
      "year": 1939,
      "month": 8,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3818
    },
    {
      "year": 1939,
      "month": 9,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3762
    },
    {
      "year": 1939,
      "month": 10,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3707
    },
    {
      "year": 1939,
      "month": 11,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3653
    },
    {
      "year": 1939,
      "month": 12,
      "equity": 0.012256,
      "bond": 0.0021413,
      "cpi": 8.3598
    },
    {
      "year": 1940,
      "month": 1,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.3869
    },
    {
      "year": 1940,
      "month": 2,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.414
    },
    {
      "year": 1940,
      "month": 3,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.4413
    },
    {
      "year": 1940,
      "month": 4,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.4686
    },
    {
      "year": 1940,
      "month": 5,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.496
    },
    {
      "year": 1940,
      "month": 6,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.5235
    },
    {
      "year": 1940,
      "month": 7,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.5511
    },
    {
      "year": 1940,
      "month": 8,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.5788
    },
    {
      "year": 1940,
      "month": 9,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.6066
    },
    {
      "year": 1940,
      "month": 10,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.6345
    },
    {
      "year": 1940,
      "month": 11,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.6624
    },
    {
      "year": 1940,
      "month": 12,
      "equity": -0.0058417,
      "bond": 0.0019131,
      "cpi": 8.6905
    },
    {
      "year": 1941,
      "month": 1,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.7324
    },
    {
      "year": 1941,
      "month": 2,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.7744
    },
    {
      "year": 1941,
      "month": 3,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.8167
    },
    {
      "year": 1941,
      "month": 4,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.8592
    },
    {
      "year": 1941,
      "month": 5,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.9018
    },
    {
      "year": 1941,
      "month": 6,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.9447
    },
    {
      "year": 1941,
      "month": 7,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 8.9878
    },
    {
      "year": 1941,
      "month": 8,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 9.0311
    },
    {
      "year": 1941,
      "month": 9,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 9.0746
    },
    {
      "year": 1941,
      "month": 10,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 9.1183
    },
    {
      "year": 1941,
      "month": 11,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 9.1622
    },
    {
      "year": 1941,
      "month": 12,
      "equity": -0.0109439,
      "bond": 0.0037068,
      "cpi": 9.2064
    },
    {
      "year": 1942,
      "month": 1,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.242
    },
    {
      "year": 1942,
      "month": 2,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.2778
    },
    {
      "year": 1942,
      "month": 3,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.3136
    },
    {
      "year": 1942,
      "month": 4,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.3497
    },
    {
      "year": 1942,
      "month": 5,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.3858
    },
    {
      "year": 1942,
      "month": 6,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.4221
    },
    {
      "year": 1942,
      "month": 7,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.4586
    },
    {
      "year": 1942,
      "month": 8,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.4952
    },
    {
      "year": 1942,
      "month": 9,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.5319
    },
    {
      "year": 1942,
      "month": 10,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.5687
    },
    {
      "year": 1942,
      "month": 11,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.6058
    },
    {
      "year": 1942,
      "month": 12,
      "equity": 0.0086073,
      "bond": 0.002774,
      "cpi": 9.6429
    },
    {
      "year": 1943,
      "month": 1,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.6571
    },
    {
      "year": 1943,
      "month": 2,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.6713
    },
    {
      "year": 1943,
      "month": 3,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.6856
    },
    {
      "year": 1943,
      "month": 4,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.6999
    },
    {
      "year": 1943,
      "month": 5,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.7142
    },
    {
      "year": 1943,
      "month": 6,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.7285
    },
    {
      "year": 1943,
      "month": 7,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.7428
    },
    {
      "year": 1943,
      "month": 8,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.7572
    },
    {
      "year": 1943,
      "month": 9,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.7716
    },
    {
      "year": 1943,
      "month": 10,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.786
    },
    {
      "year": 1943,
      "month": 11,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.8004
    },
    {
      "year": 1943,
      "month": 12,
      "equity": 0.020115,
      "bond": 0.0027982,
      "cpi": 9.8149
    },
    {
      "year": 1944,
      "month": 1,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8193
    },
    {
      "year": 1944,
      "month": 2,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8237
    },
    {
      "year": 1944,
      "month": 3,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8281
    },
    {
      "year": 1944,
      "month": 4,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8325
    },
    {
      "year": 1944,
      "month": 5,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8369
    },
    {
      "year": 1944,
      "month": 6,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8413
    },
    {
      "year": 1944,
      "month": 7,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8457
    },
    {
      "year": 1944,
      "month": 8,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8501
    },
    {
      "year": 1944,
      "month": 9,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8546
    },
    {
      "year": 1944,
      "month": 10,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.859
    },
    {
      "year": 1944,
      "month": 11,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8634
    },
    {
      "year": 1944,
      "month": 12,
      "equity": 0.0150881,
      "bond": 0.0025878,
      "cpi": 9.8678
    },
    {
      "year": 1945,
      "month": 1,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8722
    },
    {
      "year": 1945,
      "month": 2,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8766
    },
    {
      "year": 1945,
      "month": 3,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.881
    },
    {
      "year": 1945,
      "month": 4,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8854
    },
    {
      "year": 1945,
      "month": 5,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8898
    },
    {
      "year": 1945,
      "month": 6,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8942
    },
    {
      "year": 1945,
      "month": 7,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.8986
    },
    {
      "year": 1945,
      "month": 8,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.903
    },
    {
      "year": 1945,
      "month": 9,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.9075
    },
    {
      "year": 1945,
      "month": 10,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.9119
    },
    {
      "year": 1945,
      "month": 11,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.9163
    },
    {
      "year": 1945,
      "month": 12,
      "equity": 0.0267861,
      "bond": 0.0027982,
      "cpi": 9.9207
    },
    {
      "year": 1946,
      "month": 1,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 9.9478
    },
    {
      "year": 1946,
      "month": 2,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 9.9751
    },
    {
      "year": 1946,
      "month": 3,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.0024
    },
    {
      "year": 1946,
      "month": 4,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.0297
    },
    {
      "year": 1946,
      "month": 5,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.0572
    },
    {
      "year": 1946,
      "month": 6,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.0847
    },
    {
      "year": 1946,
      "month": 7,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.1123
    },
    {
      "year": 1946,
      "month": 8,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.14
    },
    {
      "year": 1946,
      "month": 9,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.1677
    },
    {
      "year": 1946,
      "month": 10,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.1955
    },
    {
      "year": 1946,
      "month": 11,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.2234
    },
    {
      "year": 1946,
      "month": 12,
      "equity": -0.0095693,
      "bond": 0.0042095,
      "cpi": 10.2514
    },
    {
      "year": 1947,
      "month": 1,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.3286
    },
    {
      "year": 1947,
      "month": 2,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.4064
    },
    {
      "year": 1947,
      "month": 3,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.4847
    },
    {
      "year": 1947,
      "month": 4,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.5637
    },
    {
      "year": 1947,
      "month": 5,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.6432
    },
    {
      "year": 1947,
      "month": 6,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.7233
    },
    {
      "year": 1947,
      "month": 7,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.8041
    },
    {
      "year": 1947,
      "month": 8,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.8854
    },
    {
      "year": 1947,
      "month": 9,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 10.9674
    },
    {
      "year": 1947,
      "month": 10,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 11.05
    },
    {
      "year": 1947,
      "month": 11,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 11.1332
    },
    {
      "year": 1947,
      "month": 12,
      "equity": 0.0076734,
      "bond": 0.0024338,
      "cpi": 11.217
    },
    {
      "year": 1948,
      "month": 1,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.3436
    },
    {
      "year": 1948,
      "month": 2,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.4716
    },
    {
      "year": 1948,
      "month": 3,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.6011
    },
    {
      "year": 1948,
      "month": 4,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.732
    },
    {
      "year": 1948,
      "month": 5,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.8644
    },
    {
      "year": 1948,
      "month": 6,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 11.9983
    },
    {
      "year": 1948,
      "month": 7,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.1337
    },
    {
      "year": 1948,
      "month": 8,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.2707
    },
    {
      "year": 1948,
      "month": 9,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.4092
    },
    {
      "year": 1948,
      "month": 10,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.5492
    },
    {
      "year": 1948,
      "month": 11,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.6908
    },
    {
      "year": 1948,
      "month": 12,
      "equity": 0.0035782,
      "bond": -5.6e-06,
      "cpi": 12.8341
    },
    {
      "year": 1949,
      "month": 1,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 12.8678
    },
    {
      "year": 1949,
      "month": 2,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 12.9017
    },
    {
      "year": 1949,
      "month": 3,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 12.9356
    },
    {
      "year": 1949,
      "month": 4,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 12.9696
    },
    {
      "year": 1949,
      "month": 5,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.0036
    },
    {
      "year": 1949,
      "month": 6,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.0378
    },
    {
      "year": 1949,
      "month": 7,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.0721
    },
    {
      "year": 1949,
      "month": 8,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.1065
    },
    {
      "year": 1949,
      "month": 9,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.1409
    },
    {
      "year": 1949,
      "month": 10,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.1754
    },
    {
      "year": 1949,
      "month": 11,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.2101
    },
    {
      "year": 1949,
      "month": 12,
      "equity": 0.0157762,
      "bond": 0.0027093,
      "cpi": 13.2448
    },
    {
      "year": 1950,
      "month": 1,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.2772
    },
    {
      "year": 1950,
      "month": 2,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.3096
    },
    {
      "year": 1950,
      "month": 3,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.3421
    },
    {
      "year": 1950,
      "month": 4,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.3747
    },
    {
      "year": 1950,
      "month": 5,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.4074
    },
    {
      "year": 1950,
      "month": 6,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.4401
    },
    {
      "year": 1950,
      "month": 7,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.473
    },
    {
      "year": 1950,
      "month": 8,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.5059
    },
    {
      "year": 1950,
      "month": 9,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.5389
    },
    {
      "year": 1950,
      "month": 10,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.572
    },
    {
      "year": 1950,
      "month": 11,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.6051
    },
    {
      "year": 1950,
      "month": 12,
      "equity": 0.0147523,
      "bond": 0.0024534,
      "cpi": 13.6384
    },
    {
      "year": 1951,
      "month": 1,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 13.7515
    },
    {
      "year": 1951,
      "month": 2,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 13.8655
    },
    {
      "year": 1951,
      "month": 3,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 13.9804
    },
    {
      "year": 1951,
      "month": 4,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.0963
    },
    {
      "year": 1951,
      "month": 5,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.2131
    },
    {
      "year": 1951,
      "month": 6,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.331
    },
    {
      "year": 1951,
      "month": 7,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.4498
    },
    {
      "year": 1951,
      "month": 8,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.5696
    },
    {
      "year": 1951,
      "month": 9,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.6903
    },
    {
      "year": 1951,
      "month": 10,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.8121
    },
    {
      "year": 1951,
      "month": 11,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 14.9349
    },
    {
      "year": 1951,
      "month": 12,
      "equity": 0.0165068,
      "bond": 0.0001935,
      "cpi": 15.0587
    },
    {
      "year": 1952,
      "month": 1,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.0897
    },
    {
      "year": 1952,
      "month": 2,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.1208
    },
    {
      "year": 1952,
      "month": 3,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.1519
    },
    {
      "year": 1952,
      "month": 4,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.1832
    },
    {
      "year": 1952,
      "month": 5,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.2144
    },
    {
      "year": 1952,
      "month": 6,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.2458
    },
    {
      "year": 1952,
      "month": 7,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.2772
    },
    {
      "year": 1952,
      "month": 8,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.3086
    },
    {
      "year": 1952,
      "month": 9,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.3402
    },
    {
      "year": 1952,
      "month": 10,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.3718
    },
    {
      "year": 1952,
      "month": 11,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.4034
    },
    {
      "year": 1952,
      "month": 12,
      "equity": 0.0094278,
      "bond": 0.0007607,
      "cpi": 15.4352
    },
    {
      "year": 1953,
      "month": 1,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.4237
    },
    {
      "year": 1953,
      "month": 2,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.4123
    },
    {
      "year": 1953,
      "month": 3,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.4009
    },
    {
      "year": 1953,
      "month": 4,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3894
    },
    {
      "year": 1953,
      "month": 5,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.378
    },
    {
      "year": 1953,
      "month": 6,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3666
    },
    {
      "year": 1953,
      "month": 7,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3552
    },
    {
      "year": 1953,
      "month": 8,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3438
    },
    {
      "year": 1953,
      "month": 9,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3324
    },
    {
      "year": 1953,
      "month": 10,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.321
    },
    {
      "year": 1953,
      "month": 11,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.3097
    },
    {
      "year": 1953,
      "month": 12,
      "equity": 0.0010907,
      "bond": 0.0021182,
      "cpi": 15.2983
    },
    {
      "year": 1954,
      "month": 1,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3054
    },
    {
      "year": 1954,
      "month": 2,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3125
    },
    {
      "year": 1954,
      "month": 3,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3196
    },
    {
      "year": 1954,
      "month": 4,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3268
    },
    {
      "year": 1954,
      "month": 5,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3339
    },
    {
      "year": 1954,
      "month": 6,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.341
    },
    {
      "year": 1954,
      "month": 7,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3482
    },
    {
      "year": 1954,
      "month": 8,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3553
    },
    {
      "year": 1954,
      "month": 9,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3624
    },
    {
      "year": 1954,
      "month": 10,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3696
    },
    {
      "year": 1954,
      "month": 11,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3767
    },
    {
      "year": 1954,
      "month": 12,
      "equity": 0.0319314,
      "bond": 0.0059741,
      "cpi": 15.3839
    },
    {
      "year": 1955,
      "month": 1,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.3867
    },
    {
      "year": 1955,
      "month": 2,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.3896
    },
    {
      "year": 1955,
      "month": 3,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.3924
    },
    {
      "year": 1955,
      "month": 4,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.3953
    },
    {
      "year": 1955,
      "month": 5,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.3982
    },
    {
      "year": 1955,
      "month": 6,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.401
    },
    {
      "year": 1955,
      "month": 7,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4039
    },
    {
      "year": 1955,
      "month": 8,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4067
    },
    {
      "year": 1955,
      "month": 9,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4096
    },
    {
      "year": 1955,
      "month": 10,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4124
    },
    {
      "year": 1955,
      "month": 11,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4153
    },
    {
      "year": 1955,
      "month": 12,
      "equity": 0.0278174,
      "bond": 0.0028305,
      "cpi": 15.4181
    },
    {
      "year": 1956,
      "month": 1,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.4365
    },
    {
      "year": 1956,
      "month": 2,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.455
    },
    {
      "year": 1956,
      "month": 3,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.4734
    },
    {
      "year": 1956,
      "month": 4,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.4919
    },
    {
      "year": 1956,
      "month": 5,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.5104
    },
    {
      "year": 1956,
      "month": 6,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.5289
    },
    {
      "year": 1956,
      "month": 7,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.5475
    },
    {
      "year": 1956,
      "month": 8,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.5661
    },
    {
      "year": 1956,
      "month": 9,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.5846
    },
    {
      "year": 1956,
      "month": 10,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.6033
    },
    {
      "year": 1956,
      "month": 11,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.6219
    },
    {
      "year": 1956,
      "month": 12,
      "equity": 0.0016563,
      "bond": -0.000235,
      "cpi": 15.6406
    },
    {
      "year": 1957,
      "month": 1,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.6817
    },
    {
      "year": 1957,
      "month": 2,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.7229
    },
    {
      "year": 1957,
      "month": 3,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.7643
    },
    {
      "year": 1957,
      "month": 4,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.8057
    },
    {
      "year": 1957,
      "month": 5,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.8472
    },
    {
      "year": 1957,
      "month": 6,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.8889
    },
    {
      "year": 1957,
      "month": 7,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.9307
    },
    {
      "year": 1957,
      "month": 8,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 15.9725
    },
    {
      "year": 1957,
      "month": 9,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 16.0145
    },
    {
      "year": 1957,
      "month": 10,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 16.0566
    },
    {
      "year": 1957,
      "month": 11,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 16.0988
    },
    {
      "year": 1957,
      "month": 12,
      "equity": -0.0059756,
      "bond": 0.0001866,
      "cpi": 16.1411
    },
    {
      "year": 1958,
      "month": 1,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.1759
    },
    {
      "year": 1958,
      "month": 2,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.2107
    },
    {
      "year": 1958,
      "month": 3,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.2456
    },
    {
      "year": 1958,
      "month": 4,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.2806
    },
    {
      "year": 1958,
      "month": 5,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.3157
    },
    {
      "year": 1958,
      "month": 6,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.3508
    },
    {
      "year": 1958,
      "month": 7,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.386
    },
    {
      "year": 1958,
      "month": 8,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.4213
    },
    {
      "year": 1958,
      "month": 9,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.4567
    },
    {
      "year": 1958,
      "month": 10,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.4921
    },
    {
      "year": 1958,
      "month": 11,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.5276
    },
    {
      "year": 1958,
      "month": 12,
      "equity": 0.0247556,
      "bond": 0.003147,
      "cpi": 16.5632
    },
    {
      "year": 1959,
      "month": 1,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.578
    },
    {
      "year": 1959,
      "month": 2,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.5928
    },
    {
      "year": 1959,
      "month": 3,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6076
    },
    {
      "year": 1959,
      "month": 4,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6224
    },
    {
      "year": 1959,
      "month": 5,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6372
    },
    {
      "year": 1959,
      "month": 6,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6521
    },
    {
      "year": 1959,
      "month": 7,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6669
    },
    {
      "year": 1959,
      "month": 8,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6818
    },
    {
      "year": 1959,
      "month": 9,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.6967
    },
    {
      "year": 1959,
      "month": 10,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.7116
    },
    {
      "year": 1959,
      "month": 11,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.7265
    },
    {
      "year": 1959,
      "month": 12,
      "equity": 0.0098637,
      "bond": -0.0019641,
      "cpi": 16.7414
    },
    {
      "year": 1960,
      "month": 1,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.7596
    },
    {
      "year": 1960,
      "month": 2,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.7778
    },
    {
      "year": 1960,
      "month": 3,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.796
    },
    {
      "year": 1960,
      "month": 4,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.8143
    },
    {
      "year": 1960,
      "month": 5,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.8326
    },
    {
      "year": 1960,
      "month": 6,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.8508
    },
    {
      "year": 1960,
      "month": 7,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.8692
    },
    {
      "year": 1960,
      "month": 8,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.8875
    },
    {
      "year": 1960,
      "month": 9,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.9058
    },
    {
      "year": 1960,
      "month": 10,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.9242
    },
    {
      "year": 1960,
      "month": 11,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.9426
    },
    {
      "year": 1960,
      "month": 12,
      "equity": 0.0032619,
      "bond": 0.0035186,
      "cpi": 16.961
    },
    {
      "year": 1961,
      "month": 1,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 16.9732
    },
    {
      "year": 1961,
      "month": 2,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 16.9854
    },
    {
      "year": 1961,
      "month": 3,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 16.9976
    },
    {
      "year": 1961,
      "month": 4,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0098
    },
    {
      "year": 1961,
      "month": 5,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.022
    },
    {
      "year": 1961,
      "month": 6,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0343
    },
    {
      "year": 1961,
      "month": 7,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0465
    },
    {
      "year": 1961,
      "month": 8,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0588
    },
    {
      "year": 1961,
      "month": 9,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.071
    },
    {
      "year": 1961,
      "month": 10,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0833
    },
    {
      "year": 1961,
      "month": 11,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.0956
    },
    {
      "year": 1961,
      "month": 12,
      "equity": 0.0259795,
      "bond": 0.0049932,
      "cpi": 17.1079
    },
    {
      "year": 1962,
      "month": 1,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.1246
    },
    {
      "year": 1962,
      "month": 2,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.1413
    },
    {
      "year": 1962,
      "month": 3,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.1581
    },
    {
      "year": 1962,
      "month": 4,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.1748
    },
    {
      "year": 1962,
      "month": 5,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.1916
    },
    {
      "year": 1962,
      "month": 6,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2084
    },
    {
      "year": 1962,
      "month": 7,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2252
    },
    {
      "year": 1962,
      "month": 8,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2421
    },
    {
      "year": 1962,
      "month": 9,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2589
    },
    {
      "year": 1962,
      "month": 10,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2758
    },
    {
      "year": 1962,
      "month": 11,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.2926
    },
    {
      "year": 1962,
      "month": 12,
      "equity": -0.0058433,
      "bond": 0.0037335,
      "cpi": 17.3095
    },
    {
      "year": 1963,
      "month": 1,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.3348
    },
    {
      "year": 1963,
      "month": 2,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.3602
    },
    {
      "year": 1963,
      "month": 3,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.3856
    },
    {
      "year": 1963,
      "month": 4,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.411
    },
    {
      "year": 1963,
      "month": 5,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.4365
    },
    {
      "year": 1963,
      "month": 6,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.462
    },
    {
      "year": 1963,
      "month": 7,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.4875
    },
    {
      "year": 1963,
      "month": 8,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.5131
    },
    {
      "year": 1963,
      "month": 9,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.5387
    },
    {
      "year": 1963,
      "month": 10,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.5643
    },
    {
      "year": 1963,
      "month": 11,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.59
    },
    {
      "year": 1963,
      "month": 12,
      "equity": 0.0170084,
      "bond": 0.0042943,
      "cpi": 17.6157
    },
    {
      "year": 1964,
      "month": 1,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.6418
    },
    {
      "year": 1964,
      "month": 2,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.6679
    },
    {
      "year": 1964,
      "month": 3,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.6941
    },
    {
      "year": 1964,
      "month": 4,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.7203
    },
    {
      "year": 1964,
      "month": 5,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.7466
    },
    {
      "year": 1964,
      "month": 6,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.7729
    },
    {
      "year": 1964,
      "month": 7,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.7992
    },
    {
      "year": 1964,
      "month": 8,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.8256
    },
    {
      "year": 1964,
      "month": 9,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.852
    },
    {
      "year": 1964,
      "month": 10,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.8784
    },
    {
      "year": 1964,
      "month": 11,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.9049
    },
    {
      "year": 1964,
      "month": 12,
      "equity": 0.0123261,
      "bond": 0.0036194,
      "cpi": 17.9315
    },
    {
      "year": 1965,
      "month": 1,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 17.9679
    },
    {
      "year": 1965,
      "month": 2,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.0043
    },
    {
      "year": 1965,
      "month": 3,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.0408
    },
    {
      "year": 1965,
      "month": 4,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.0774
    },
    {
      "year": 1965,
      "month": 5,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.1141
    },
    {
      "year": 1965,
      "month": 6,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.1508
    },
    {
      "year": 1965,
      "month": 7,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.1876
    },
    {
      "year": 1965,
      "month": 8,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.2245
    },
    {
      "year": 1965,
      "month": 9,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.2615
    },
    {
      "year": 1965,
      "month": 10,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.2985
    },
    {
      "year": 1965,
      "month": 11,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.3356
    },
    {
      "year": 1965,
      "month": 12,
      "equity": 0.0099531,
      "bond": 0.0040861,
      "cpi": 18.3728
    },
    {
      "year": 1966,
      "month": 1,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.4291
    },
    {
      "year": 1966,
      "month": 2,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.4855
    },
    {
      "year": 1966,
      "month": 3,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.5421
    },
    {
      "year": 1966,
      "month": 4,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.5989
    },
    {
      "year": 1966,
      "month": 5,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.6559
    },
    {
      "year": 1966,
      "month": 6,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.713
    },
    {
      "year": 1966,
      "month": 7,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.7703
    },
    {
      "year": 1966,
      "month": 8,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.8278
    },
    {
      "year": 1966,
      "month": 9,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.8854
    },
    {
      "year": 1966,
      "month": 10,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 18.9433
    },
    {
      "year": 1966,
      "month": 11,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 19.0013
    },
    {
      "year": 1966,
      "month": 12,
      "equity": -0.0064377,
      "bond": 0.0015178,
      "cpi": 19.0595
    },
    {
      "year": 1967,
      "month": 1,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.1153
    },
    {
      "year": 1967,
      "month": 2,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.1713
    },
    {
      "year": 1967,
      "month": 3,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.2275
    },
    {
      "year": 1967,
      "month": 4,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.2838
    },
    {
      "year": 1967,
      "month": 5,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.3403
    },
    {
      "year": 1967,
      "month": 6,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.397
    },
    {
      "year": 1967,
      "month": 7,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.4538
    },
    {
      "year": 1967,
      "month": 8,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.5108
    },
    {
      "year": 1967,
      "month": 9,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.568
    },
    {
      "year": 1967,
      "month": 10,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.6253
    },
    {
      "year": 1967,
      "month": 11,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.6828
    },
    {
      "year": 1967,
      "month": 12,
      "equity": 0.0155986,
      "bond": 0.0032443,
      "cpi": 19.7405
    },
    {
      "year": 1968,
      "month": 1,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 19.8065
    },
    {
      "year": 1968,
      "month": 2,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 19.8727
    },
    {
      "year": 1968,
      "month": 3,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 19.9391
    },
    {
      "year": 1968,
      "month": 4,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.0058
    },
    {
      "year": 1968,
      "month": 5,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.0726
    },
    {
      "year": 1968,
      "month": 6,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.1397
    },
    {
      "year": 1968,
      "month": 7,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.207
    },
    {
      "year": 1968,
      "month": 8,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.2746
    },
    {
      "year": 1968,
      "month": 9,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.3423
    },
    {
      "year": 1968,
      "month": 10,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.4103
    },
    {
      "year": 1968,
      "month": 11,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.4786
    },
    {
      "year": 1968,
      "month": 12,
      "equity": 0.0110851,
      "bond": 0.0002123,
      "cpi": 20.547
    },
    {
      "year": 1969,
      "month": 1,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 20.6226
    },
    {
      "year": 1969,
      "month": 2,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 20.6986
    },
    {
      "year": 1969,
      "month": 3,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 20.7748
    },
    {
      "year": 1969,
      "month": 4,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 20.8513
    },
    {
      "year": 1969,
      "month": 5,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 20.928
    },
    {
      "year": 1969,
      "month": 6,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.0051
    },
    {
      "year": 1969,
      "month": 7,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.0824
    },
    {
      "year": 1969,
      "month": 8,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.16
    },
    {
      "year": 1969,
      "month": 9,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.2379
    },
    {
      "year": 1969,
      "month": 10,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.3161
    },
    {
      "year": 1969,
      "month": 11,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.3946
    },
    {
      "year": 1969,
      "month": 12,
      "equity": -0.0101137,
      "bond": 0.0007449,
      "cpi": 21.4733
    },
    {
      "year": 1970,
      "month": 1,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.5326
    },
    {
      "year": 1970,
      "month": 2,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.5921
    },
    {
      "year": 1970,
      "month": 3,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.6518
    },
    {
      "year": 1970,
      "month": 4,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.7116
    },
    {
      "year": 1970,
      "month": 5,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.7716
    },
    {
      "year": 1970,
      "month": 6,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.8317
    },
    {
      "year": 1970,
      "month": 7,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.892
    },
    {
      "year": 1970,
      "month": 8,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 21.9525
    },
    {
      "year": 1970,
      "month": 9,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 22.0132
    },
    {
      "year": 1970,
      "month": 10,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 22.074
    },
    {
      "year": 1970,
      "month": 11,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 22.135
    },
    {
      "year": 1970,
      "month": 12,
      "equity": -0.0030422,
      "bond": 0.0043016,
      "cpi": 22.1961
    },
    {
      "year": 1971,
      "month": 1,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.2479
    },
    {
      "year": 1971,
      "month": 2,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.2998
    },
    {
      "year": 1971,
      "month": 3,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.3519
    },
    {
      "year": 1971,
      "month": 4,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.404
    },
    {
      "year": 1971,
      "month": 5,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.4563
    },
    {
      "year": 1971,
      "month": 6,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.5087
    },
    {
      "year": 1971,
      "month": 7,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.5612
    },
    {
      "year": 1971,
      "month": 8,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.6139
    },
    {
      "year": 1971,
      "month": 9,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.6667
    },
    {
      "year": 1971,
      "month": 10,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.7195
    },
    {
      "year": 1971,
      "month": 11,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.7726
    },
    {
      "year": 1971,
      "month": 12,
      "equity": 0.0098833,
      "bond": 0.0114708,
      "cpi": 22.8257
    },
    {
      "year": 1972,
      "month": 1,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 22.9146
    },
    {
      "year": 1972,
      "month": 2,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.0038
    },
    {
      "year": 1972,
      "month": 3,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.0934
    },
    {
      "year": 1972,
      "month": 4,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.1834
    },
    {
      "year": 1972,
      "month": 5,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.2737
    },
    {
      "year": 1972,
      "month": 6,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.3643
    },
    {
      "year": 1972,
      "month": 7,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.4553
    },
    {
      "year": 1972,
      "month": 8,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.5467
    },
    {
      "year": 1972,
      "month": 9,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.6384
    },
    {
      "year": 1972,
      "month": 10,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.7304
    },
    {
      "year": 1972,
      "month": 11,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.8229
    },
    {
      "year": 1972,
      "month": 12,
      "equity": 0.0159129,
      "bond": 0.0040409,
      "cpi": 23.9156
    },
    {
      "year": 1973,
      "month": 1,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.0622
    },
    {
      "year": 1973,
      "month": 2,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.2098
    },
    {
      "year": 1973,
      "month": 3,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.3582
    },
    {
      "year": 1973,
      "month": 4,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.5076
    },
    {
      "year": 1973,
      "month": 5,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.6579
    },
    {
      "year": 1973,
      "month": 6,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.8091
    },
    {
      "year": 1973,
      "month": 7,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 24.9612
    },
    {
      "year": 1973,
      "month": 8,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 25.1143
    },
    {
      "year": 1973,
      "month": 9,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 25.2683
    },
    {
      "year": 1973,
      "month": 10,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 25.4232
    },
    {
      "year": 1973,
      "month": 11,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 25.5791
    },
    {
      "year": 1973,
      "month": 12,
      "equity": -0.0148584,
      "bond": 0.0040163,
      "cpi": 25.7359
    },
    {
      "year": 1974,
      "month": 1,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 25.9581
    },
    {
      "year": 1974,
      "month": 2,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 26.1821
    },
    {
      "year": 1974,
      "month": 3,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 26.4081
    },
    {
      "year": 1974,
      "month": 4,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 26.6361
    },
    {
      "year": 1974,
      "month": 5,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 26.866
    },
    {
      "year": 1974,
      "month": 6,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 27.0979
    },
    {
      "year": 1974,
      "month": 7,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 27.3318
    },
    {
      "year": 1974,
      "month": 8,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 27.5678
    },
    {
      "year": 1974,
      "month": 9,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 27.8057
    },
    {
      "year": 1974,
      "month": 10,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 28.0458
    },
    {
      "year": 1974,
      "month": 11,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 28.2879
    },
    {
      "year": 1974,
      "month": 12,
      "equity": -0.0245411,
      "bond": -0.0015436,
      "cpi": 28.532
    },
    {
      "year": 1975,
      "month": 1,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 28.7772
    },
    {
      "year": 1975,
      "month": 2,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 29.0245
    },
    {
      "year": 1975,
      "month": 3,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 29.2739
    },
    {
      "year": 1975,
      "month": 4,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 29.5254
    },
    {
      "year": 1975,
      "month": 5,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 29.7791
    },
    {
      "year": 1975,
      "month": 6,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 30.035
    },
    {
      "year": 1975,
      "month": 7,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 30.2931
    },
    {
      "year": 1975,
      "month": 8,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 30.5534
    },
    {
      "year": 1975,
      "month": 9,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 30.816
    },
    {
      "year": 1975,
      "month": 10,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 31.0808
    },
    {
      "year": 1975,
      "month": 11,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 31.3479
    },
    {
      "year": 1975,
      "month": 12,
      "equity": 0.0291912,
      "bond": 0.0064198,
      "cpi": 31.6173
    },
    {
      "year": 1976,
      "month": 1,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 31.8086
    },
    {
      "year": 1976,
      "month": 2,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.0011
    },
    {
      "year": 1976,
      "month": 3,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.1948
    },
    {
      "year": 1976,
      "month": 4,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.3896
    },
    {
      "year": 1976,
      "month": 5,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.5856
    },
    {
      "year": 1976,
      "month": 6,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.7828
    },
    {
      "year": 1976,
      "month": 7,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 32.9811
    },
    {
      "year": 1976,
      "month": 8,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 33.1807
    },
    {
      "year": 1976,
      "month": 9,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 33.3815
    },
    {
      "year": 1976,
      "month": 10,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 33.5835
    },
    {
      "year": 1976,
      "month": 11,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 33.7867
    },
    {
      "year": 1976,
      "month": 12,
      "equity": 0.0165253,
      "bond": 0.0064722,
      "cpi": 33.9912
    },
    {
      "year": 1977,
      "month": 1,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 34.2097
    },
    {
      "year": 1977,
      "month": 2,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 34.4295
    },
    {
      "year": 1977,
      "month": 3,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 34.6508
    },
    {
      "year": 1977,
      "month": 4,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 34.8735
    },
    {
      "year": 1977,
      "month": 5,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 35.0977
    },
    {
      "year": 1977,
      "month": 6,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 35.3232
    },
    {
      "year": 1977,
      "month": 7,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 35.5503
    },
    {
      "year": 1977,
      "month": 8,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 35.7787
    },
    {
      "year": 1977,
      "month": 9,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 36.0087
    },
    {
      "year": 1977,
      "month": 10,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 36.2401
    },
    {
      "year": 1977,
      "month": 11,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 36.473
    },
    {
      "year": 1977,
      "month": 12,
      "equity": 0.0016601,
      "bond": 0.0098686,
      "cpi": 36.7074
    },
    {
      "year": 1978,
      "month": 1,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 36.9695
    },
    {
      "year": 1978,
      "month": 2,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 37.2335
    },
    {
      "year": 1978,
      "month": 3,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 37.4993
    },
    {
      "year": 1978,
      "month": 4,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 37.7671
    },
    {
      "year": 1978,
      "month": 5,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 38.0367
    },
    {
      "year": 1978,
      "month": 6,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 38.3083
    },
    {
      "year": 1978,
      "month": 7,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 38.5819
    },
    {
      "year": 1978,
      "month": 8,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 38.8573
    },
    {
      "year": 1978,
      "month": 9,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 39.1348
    },
    {
      "year": 1978,
      "month": 10,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 39.4142
    },
    {
      "year": 1978,
      "month": 11,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 39.6956
    },
    {
      "year": 1978,
      "month": 12,
      "equity": 0.0130767,
      "bond": 0.0038427,
      "cpi": 39.9791
    },
    {
      "year": 1979,
      "month": 1,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 40.2717
    },
    {
      "year": 1979,
      "month": 2,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 40.5664
    },
    {
      "year": 1979,
      "month": 3,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 40.8633
    },
    {
      "year": 1979,
      "month": 4,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 41.1624
    },
    {
      "year": 1979,
      "month": 5,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 41.4636
    },
    {
      "year": 1979,
      "month": 6,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 41.7671
    },
    {
      "year": 1979,
      "month": 7,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 42.0727
    },
    {
      "year": 1979,
      "month": 8,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 42.3807
    },
    {
      "year": 1979,
      "month": 9,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 42.6908
    },
    {
      "year": 1979,
      "month": 10,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 43.0033
    },
    {
      "year": 1979,
      "month": 11,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 43.318
    },
    {
      "year": 1979,
      "month": 12,
      "equity": 0.0126342,
      "bond": 0.0021955,
      "cpi": 43.635
    },
    {
      "year": 1980,
      "month": 1,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 43.989
    },
    {
      "year": 1980,
      "month": 2,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 44.346
    },
    {
      "year": 1980,
      "month": 3,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 44.7058
    },
    {
      "year": 1980,
      "month": 4,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 45.0685
    },
    {
      "year": 1980,
      "month": 5,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 45.4342
    },
    {
      "year": 1980,
      "month": 6,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 45.8028
    },
    {
      "year": 1980,
      "month": 7,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 46.1745
    },
    {
      "year": 1980,
      "month": 8,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 46.5491
    },
    {
      "year": 1980,
      "month": 9,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 46.9268
    },
    {
      "year": 1980,
      "month": 10,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 47.3076
    },
    {
      "year": 1980,
      "month": 11,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 47.6914
    },
    {
      "year": 1980,
      "month": 12,
      "equity": 0.0237314,
      "bond": -0.0048634,
      "cpi": 48.0784
    },
    {
      "year": 1981,
      "month": 1,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 48.5513
    },
    {
      "year": 1981,
      "month": 2,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 49.0288
    },
    {
      "year": 1981,
      "month": 3,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 49.511
    },
    {
      "year": 1981,
      "month": 4,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 49.998
    },
    {
      "year": 1981,
      "month": 5,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 50.4897
    },
    {
      "year": 1981,
      "month": 6,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 50.9863
    },
    {
      "year": 1981,
      "month": 7,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 51.4878
    },
    {
      "year": 1981,
      "month": 8,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 51.9942
    },
    {
      "year": 1981,
      "month": 9,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 52.5056
    },
    {
      "year": 1981,
      "month": 10,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 53.022
    },
    {
      "year": 1981,
      "month": 11,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 53.5435
    },
    {
      "year": 1981,
      "month": 12,
      "equity": -0.0025516,
      "bond": -0.0057277,
      "cpi": 54.0701
    },
    {
      "year": 1982,
      "month": 1,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 54.5343
    },
    {
      "year": 1982,
      "month": 2,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 55.0025
    },
    {
      "year": 1982,
      "month": 3,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 55.4748
    },
    {
      "year": 1982,
      "month": 4,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 55.951
    },
    {
      "year": 1982,
      "month": 5,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 56.4314
    },
    {
      "year": 1982,
      "month": 6,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 56.9159
    },
    {
      "year": 1982,
      "month": 7,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 57.4046
    },
    {
      "year": 1982,
      "month": 8,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 57.8974
    },
    {
      "year": 1982,
      "month": 9,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 58.3945
    },
    {
      "year": 1982,
      "month": 10,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 58.8958
    },
    {
      "year": 1982,
      "month": 11,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 59.4015
    },
    {
      "year": 1982,
      "month": 12,
      "equity": 0.0170446,
      "bond": 0.0166829,
      "cpi": 59.9115
    },
    {
      "year": 1983,
      "month": 1,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 60.1944
    },
    {
      "year": 1983,
      "month": 2,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 60.4787
    },
    {
      "year": 1983,
      "month": 3,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 60.7643
    },
    {
      "year": 1983,
      "month": 4,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 61.0512
    },
    {
      "year": 1983,
      "month": 5,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 61.3395
    },
    {
      "year": 1983,
      "month": 6,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 61.6291
    },
    {
      "year": 1983,
      "month": 7,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 61.9202
    },
    {
      "year": 1983,
      "month": 8,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 62.2126
    },
    {
      "year": 1983,
      "month": 9,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 62.5064
    },
    {
      "year": 1983,
      "month": 10,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 62.8015
    },
    {
      "year": 1983,
      "month": 11,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 63.0981
    },
    {
      "year": 1983,
      "month": 12,
      "equity": 0.0184434,
      "bond": 0.0230853,
      "cpi": 63.396
    },
    {
      "year": 1984,
      "month": 1,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 63.6208
    },
    {
      "year": 1984,
      "month": 2,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 63.8464
    },
    {
      "year": 1984,
      "month": 3,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 64.0727
    },
    {
      "year": 1984,
      "month": 4,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 64.2999
    },
    {
      "year": 1984,
      "month": 5,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 64.5279
    },
    {
      "year": 1984,
      "month": 6,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 64.7567
    },
    {
      "year": 1984,
      "month": 7,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 64.9863
    },
    {
      "year": 1984,
      "month": 8,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 65.2167
    },
    {
      "year": 1984,
      "month": 9,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 65.448
    },
    {
      "year": 1984,
      "month": 10,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 65.68
    },
    {
      "year": 1984,
      "month": 11,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 65.9129
    },
    {
      "year": 1984,
      "month": 12,
      "equity": 0.0088224,
      "bond": 0.0041359,
      "cpi": 66.1466
    },
    {
      "year": 1985,
      "month": 1,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 66.3605
    },
    {
      "year": 1985,
      "month": 2,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 66.5752
    },
    {
      "year": 1985,
      "month": 3,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 66.7905
    },
    {
      "year": 1985,
      "month": 4,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 67.0065
    },
    {
      "year": 1985,
      "month": 5,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 67.2232
    },
    {
      "year": 1985,
      "month": 6,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 67.4406
    },
    {
      "year": 1985,
      "month": 7,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 67.6588
    },
    {
      "year": 1985,
      "month": 8,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 67.8776
    },
    {
      "year": 1985,
      "month": 9,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 68.0971
    },
    {
      "year": 1985,
      "month": 10,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 68.3174
    },
    {
      "year": 1985,
      "month": 11,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 68.5383
    },
    {
      "year": 1985,
      "month": 12,
      "equity": 0.0274235,
      "bond": 0.0185636,
      "cpi": 68.76
    },
    {
      "year": 1986,
      "month": 1,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 68.9947
    },
    {
      "year": 1986,
      "month": 2,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 69.2302
    },
    {
      "year": 1986,
      "month": 3,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 69.4665
    },
    {
      "year": 1986,
      "month": 4,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 69.7036
    },
    {
      "year": 1986,
      "month": 5,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 69.9416
    },
    {
      "year": 1986,
      "month": 6,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 70.1803
    },
    {
      "year": 1986,
      "month": 7,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 70.4199
    },
    {
      "year": 1986,
      "month": 8,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 70.6602
    },
    {
      "year": 1986,
      "month": 9,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 70.9014
    },
    {
      "year": 1986,
      "month": 10,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 71.1434
    },
    {
      "year": 1986,
      "month": 11,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 71.3863
    },
    {
      "year": 1986,
      "month": 12,
      "equity": 0.016993,
      "bond": 0.0165097,
      "cpi": 71.63
    },
    {
      "year": 1987,
      "month": 1,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 71.8855
    },
    {
      "year": 1987,
      "month": 2,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 72.1419
    },
    {
      "year": 1987,
      "month": 3,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 72.3992
    },
    {
      "year": 1987,
      "month": 4,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 72.6574
    },
    {
      "year": 1987,
      "month": 5,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 72.9165
    },
    {
      "year": 1987,
      "month": 6,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 73.1766
    },
    {
      "year": 1987,
      "month": 7,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 73.4376
    },
    {
      "year": 1987,
      "month": 8,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 73.6995
    },
    {
      "year": 1987,
      "month": 9,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 73.9623
    },
    {
      "year": 1987,
      "month": 10,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 74.2261
    },
    {
      "year": 1987,
      "month": 11,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 74.4909
    },
    {
      "year": 1987,
      "month": 12,
      "equity": -0.0046044,
      "bond": 0.0052696,
      "cpi": 74.7565
    },
    {
      "year": 1988,
      "month": 1,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 75.0026
    },
    {
      "year": 1988,
      "month": 2,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 75.2495
    },
    {
      "year": 1988,
      "month": 3,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 75.4972
    },
    {
      "year": 1988,
      "month": 4,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 75.7458
    },
    {
      "year": 1988,
      "month": 5,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 75.9951
    },
    {
      "year": 1988,
      "month": 6,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 76.2453
    },
    {
      "year": 1988,
      "month": 7,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 76.4963
    },
    {
      "year": 1988,
      "month": 8,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 76.7481
    },
    {
      "year": 1988,
      "month": 9,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 77.0008
    },
    {
      "year": 1988,
      "month": 10,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 77.2542
    },
    {
      "year": 1988,
      "month": 11,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 77.5086
    },
    {
      "year": 1988,
      "month": 12,
      "equity": 0.0071989,
      "bond": 0.006458,
      "cpi": 77.7637
    },
    {
      "year": 1989,
      "month": 1,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 78.0802
    },
    {
      "year": 1989,
      "month": 2,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 78.398
    },
    {
      "year": 1989,
      "month": 3,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 78.7171
    },
    {
      "year": 1989,
      "month": 4,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 79.0375
    },
    {
      "year": 1989,
      "month": 5,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 79.3592
    },
    {
      "year": 1989,
      "month": 6,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 79.6822
    },
    {
      "year": 1989,
      "month": 7,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 80.0065
    },
    {
      "year": 1989,
      "month": 8,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 80.3321
    },
    {
      "year": 1989,
      "month": 9,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 80.6591
    },
    {
      "year": 1989,
      "month": 10,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 80.9874
    },
    {
      "year": 1989,
      "month": 11,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 81.317
    },
    {
      "year": 1989,
      "month": 12,
      "equity": 0.0196277,
      "bond": 0.0097538,
      "cpi": 81.648
    },
    {
      "year": 1990,
      "month": 1,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 81.9653
    },
    {
      "year": 1990,
      "month": 2,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 82.2839
    },
    {
      "year": 1990,
      "month": 3,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 82.6037
    },
    {
      "year": 1990,
      "month": 4,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 82.9247
    },
    {
      "year": 1990,
      "month": 5,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 83.247
    },
    {
      "year": 1990,
      "month": 6,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 83.5705
    },
    {
      "year": 1990,
      "month": 7,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 83.8953
    },
    {
      "year": 1990,
      "month": 8,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 84.2213
    },
    {
      "year": 1990,
      "month": 9,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 84.5487
    },
    {
      "year": 1990,
      "month": 10,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 84.8773
    },
    {
      "year": 1990,
      "month": 11,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 85.2071
    },
    {
      "year": 1990,
      "month": 12,
      "equity": -0.0016948,
      "bond": 0.0027888,
      "cpi": 85.5383
    },
    {
      "year": 1991,
      "month": 1,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 85.9286
    },
    {
      "year": 1991,
      "month": 2,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 86.3207
    },
    {
      "year": 1991,
      "month": 3,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 86.7146
    },
    {
      "year": 1991,
      "month": 4,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 87.1103
    },
    {
      "year": 1991,
      "month": 5,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 87.5078
    },
    {
      "year": 1991,
      "month": 6,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 87.9071
    },
    {
      "year": 1991,
      "month": 7,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 88.3082
    },
    {
      "year": 1991,
      "month": 8,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 88.7112
    },
    {
      "year": 1991,
      "month": 9,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 89.1159
    },
    {
      "year": 1991,
      "month": 10,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 89.5226
    },
    {
      "year": 1991,
      "month": 11,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 89.9311
    },
    {
      "year": 1991,
      "month": 12,
      "equity": 0.016288,
      "bond": 0.0142202,
      "cpi": 90.3414
    },
    {
      "year": 1992,
      "month": 1,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 90.454
    },
    {
      "year": 1992,
      "month": 2,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 90.5667
    },
    {
      "year": 1992,
      "month": 3,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 90.6796
    },
    {
      "year": 1992,
      "month": 4,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 90.7926
    },
    {
      "year": 1992,
      "month": 5,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 90.9058
    },
    {
      "year": 1992,
      "month": 6,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.0191
    },
    {
      "year": 1992,
      "month": 7,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.1325
    },
    {
      "year": 1992,
      "month": 8,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.2461
    },
    {
      "year": 1992,
      "month": 9,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.3598
    },
    {
      "year": 1992,
      "month": 10,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.4737
    },
    {
      "year": 1992,
      "month": 11,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.5877
    },
    {
      "year": 1992,
      "month": 12,
      "equity": 0.0200147,
      "bond": 0.0129951,
      "cpi": 91.7018
    },
    {
      "year": 1993,
      "month": 1,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 91.8413
    },
    {
      "year": 1993,
      "month": 2,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 91.9811
    },
    {
      "year": 1993,
      "month": 3,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.1211
    },
    {
      "year": 1993,
      "month": 4,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.2613
    },
    {
      "year": 1993,
      "month": 5,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.4016
    },
    {
      "year": 1993,
      "month": 6,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.5423
    },
    {
      "year": 1993,
      "month": 7,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.6831
    },
    {
      "year": 1993,
      "month": 8,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.8241
    },
    {
      "year": 1993,
      "month": 9,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 92.9654
    },
    {
      "year": 1993,
      "month": 10,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 93.1068
    },
    {
      "year": 1993,
      "month": 11,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 93.2485
    },
    {
      "year": 1993,
      "month": 12,
      "equity": 0.0112863,
      "bond": 0.0118651,
      "cpi": 93.3904
    },
    {
      "year": 1994,
      "month": 1,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4048
    },
    {
      "year": 1994,
      "month": 2,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4192
    },
    {
      "year": 1994,
      "month": 3,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4336
    },
    {
      "year": 1994,
      "month": 4,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.448
    },
    {
      "year": 1994,
      "month": 5,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4625
    },
    {
      "year": 1994,
      "month": 6,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4769
    },
    {
      "year": 1994,
      "month": 7,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.4913
    },
    {
      "year": 1994,
      "month": 8,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.5057
    },
    {
      "year": 1994,
      "month": 9,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.5202
    },
    {
      "year": 1994,
      "month": 10,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.5346
    },
    {
      "year": 1994,
      "month": 11,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.549
    },
    {
      "year": 1994,
      "month": 12,
      "equity": 0.0052614,
      "bond": 0.001928,
      "cpi": 93.5634
    },
    {
      "year": 1995,
      "month": 1,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 93.7308
    },
    {
      "year": 1995,
      "month": 2,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 93.8985
    },
    {
      "year": 1995,
      "month": 3,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.0665
    },
    {
      "year": 1995,
      "month": 4,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.2348
    },
    {
      "year": 1995,
      "month": 5,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.4034
    },
    {
      "year": 1995,
      "month": 6,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.5723
    },
    {
      "year": 1995,
      "month": 7,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.7415
    },
    {
      "year": 1995,
      "month": 8,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 94.911
    },
    {
      "year": 1995,
      "month": 9,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 95.0808
    },
    {
      "year": 1995,
      "month": 10,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 95.2509
    },
    {
      "year": 1995,
      "month": 11,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 95.4213
    },
    {
      "year": 1995,
      "month": 12,
      "equity": 0.0249076,
      "bond": 0.0088008,
      "cpi": 95.592
    },
    {
      "year": 1996,
      "month": 1,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 95.7154
    },
    {
      "year": 1996,
      "month": 2,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 95.839
    },
    {
      "year": 1996,
      "month": 3,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 95.9628
    },
    {
      "year": 1996,
      "month": 4,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.0867
    },
    {
      "year": 1996,
      "month": 5,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.2107
    },
    {
      "year": 1996,
      "month": 6,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.335
    },
    {
      "year": 1996,
      "month": 7,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.4594
    },
    {
      "year": 1996,
      "month": 8,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.5839
    },
    {
      "year": 1996,
      "month": 9,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.7086
    },
    {
      "year": 1996,
      "month": 10,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.8335
    },
    {
      "year": 1996,
      "month": 11,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 96.9585
    },
    {
      "year": 1996,
      "month": 12,
      "equity": 0.0179234,
      "bond": 0.0107742,
      "cpi": 97.0837
    },
    {
      "year": 1997,
      "month": 1,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.2131
    },
    {
      "year": 1997,
      "month": 2,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.3427
    },
    {
      "year": 1997,
      "month": 3,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.4725
    },
    {
      "year": 1997,
      "month": 4,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.6024
    },
    {
      "year": 1997,
      "month": 5,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.7325
    },
    {
      "year": 1997,
      "month": 6,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.8628
    },
    {
      "year": 1997,
      "month": 7,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 97.9933
    },
    {
      "year": 1997,
      "month": 8,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 98.1239
    },
    {
      "year": 1997,
      "month": 9,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 98.2547
    },
    {
      "year": 1997,
      "month": 10,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 98.3857
    },
    {
      "year": 1997,
      "month": 11,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 98.5168
    },
    {
      "year": 1997,
      "month": 12,
      "equity": 0.0267576,
      "bond": 0.0117571,
      "cpi": 98.6482
    },
    {
      "year": 1998,
      "month": 1,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 98.729
    },
    {
      "year": 1998,
      "month": 2,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 98.8098
    },
    {
      "year": 1998,
      "month": 3,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 98.8908
    },
    {
      "year": 1998,
      "month": 4,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 98.9718
    },
    {
      "year": 1998,
      "month": 5,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.0528
    },
    {
      "year": 1998,
      "month": 6,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.1339
    },
    {
      "year": 1998,
      "month": 7,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.2151
    },
    {
      "year": 1998,
      "month": 8,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.2964
    },
    {
      "year": 1998,
      "month": 9,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.3777
    },
    {
      "year": 1998,
      "month": 10,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.4591
    },
    {
      "year": 1998,
      "month": 11,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.5405
    },
    {
      "year": 1998,
      "month": 12,
      "equity": 0.0248387,
      "bond": 0.0103398,
      "cpi": 99.622
    },
    {
      "year": 1999,
      "month": 1,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 99.7657
    },
    {
      "year": 1999,
      "month": 2,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 99.9096
    },
    {
      "year": 1999,
      "month": 3,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.0537
    },
    {
      "year": 1999,
      "month": 4,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.198
    },
    {
      "year": 1999,
      "month": 5,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.3425
    },
    {
      "year": 1999,
      "month": 6,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.4873
    },
    {
      "year": 1999,
      "month": 7,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.6322
    },
    {
      "year": 1999,
      "month": 8,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.7774
    },
    {
      "year": 1999,
      "month": 9,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 100.9227
    },
    {
      "year": 1999,
      "month": 10,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 101.0683
    },
    {
      "year": 1999,
      "month": 11,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 101.2141
    },
    {
      "year": 1999,
      "month": 12,
      "equity": 0.0113732,
      "bond": 0.0031806,
      "cpi": 101.3601
    },
    {
      "year": 2000,
      "month": 1,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 101.5884
    },
    {
      "year": 2000,
      "month": 2,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 101.8173
    },
    {
      "year": 2000,
      "month": 3,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 102.0466
    },
    {
      "year": 2000,
      "month": 4,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 102.2765
    },
    {
      "year": 2000,
      "month": 5,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 102.5069
    },
    {
      "year": 2000,
      "month": 6,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 102.7378
    },
    {
      "year": 2000,
      "month": 7,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 102.9692
    },
    {
      "year": 2000,
      "month": 8,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 103.2012
    },
    {
      "year": 2000,
      "month": 9,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 103.4337
    },
    {
      "year": 2000,
      "month": 10,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 103.6667
    },
    {
      "year": 2000,
      "month": 11,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 103.9002
    },
    {
      "year": 2000,
      "month": 12,
      "equity": -0.00167,
      "bond": 0.0035353,
      "cpi": 104.1342
    },
    {
      "year": 2001,
      "month": 1,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 104.3494
    },
    {
      "year": 2001,
      "month": 2,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 104.565
    },
    {
      "year": 2001,
      "month": 3,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 104.781
    },
    {
      "year": 2001,
      "month": 4,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 104.9975
    },
    {
      "year": 2001,
      "month": 5,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 105.2145
    },
    {
      "year": 2001,
      "month": 6,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 105.4318
    },
    {
      "year": 2001,
      "month": 7,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 105.6497
    },
    {
      "year": 2001,
      "month": 8,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 105.868
    },
    {
      "year": 2001,
      "month": 9,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 106.0867
    },
    {
      "year": 2001,
      "month": 10,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 106.3059
    },
    {
      "year": 2001,
      "month": 11,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 106.5256
    },
    {
      "year": 2001,
      "month": 12,
      "equity": -0.0064053,
      "bond": 0.0053475,
      "cpi": 106.7457
    },
    {
      "year": 2002,
      "month": 1,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 106.946
    },
    {
      "year": 2002,
      "month": 2,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 107.1468
    },
    {
      "year": 2002,
      "month": 3,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 107.3479
    },
    {
      "year": 2002,
      "month": 4,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 107.5493
    },
    {
      "year": 2002,
      "month": 5,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 107.7512
    },
    {
      "year": 2002,
      "month": 6,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 107.9534
    },
    {
      "year": 2002,
      "month": 7,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 108.1561
    },
    {
      "year": 2002,
      "month": 8,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 108.359
    },
    {
      "year": 2002,
      "month": 9,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 108.5624
    },
    {
      "year": 2002,
      "month": 10,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 108.7662
    },
    {
      "year": 2002,
      "month": 11,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 108.9703
    },
    {
      "year": 2002,
      "month": 12,
      "equity": -0.0191556,
      "bond": 0.0053626,
      "cpi": 109.1748
    },
    {
      "year": 2003,
      "month": 1,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 109.4212
    },
    {
      "year": 2003,
      "month": 2,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 109.6681
    },
    {
      "year": 2003,
      "month": 3,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 109.9156
    },
    {
      "year": 2003,
      "month": 4,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 110.1637
    },
    {
      "year": 2003,
      "month": 5,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 110.4123
    },
    {
      "year": 2003,
      "month": 6,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 110.6615
    },
    {
      "year": 2003,
      "month": 7,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 110.9112
    },
    {
      "year": 2003,
      "month": 8,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 111.1615
    },
    {
      "year": 2003,
      "month": 9,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 111.4124
    },
    {
      "year": 2003,
      "month": 10,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 111.6638
    },
    {
      "year": 2003,
      "month": 11,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 111.9158
    },
    {
      "year": 2003,
      "month": 12,
      "equity": -7.34e-05,
      "bond": 0.0067016,
      "cpi": 112.1684
    },
    {
      "year": 2004,
      "month": 1,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 112.339
    },
    {
      "year": 2004,
      "month": 2,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 112.5099
    },
    {
      "year": 2004,
      "month": 3,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 112.681
    },
    {
      "year": 2004,
      "month": 4,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 112.8524
    },
    {
      "year": 2004,
      "month": 5,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.024
    },
    {
      "year": 2004,
      "month": 6,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.1959
    },
    {
      "year": 2004,
      "month": 7,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.3681
    },
    {
      "year": 2004,
      "month": 8,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.5405
    },
    {
      "year": 2004,
      "month": 9,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.7132
    },
    {
      "year": 2004,
      "month": 10,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 113.8862
    },
    {
      "year": 2004,
      "month": 11,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 114.0594
    },
    {
      "year": 2004,
      "month": 12,
      "equity": 0.0040922,
      "bond": 0.0053881,
      "cpi": 114.2329
    },
    {
      "year": 2005,
      "month": 1,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 114.4431
    },
    {
      "year": 2005,
      "month": 2,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 114.6537
    },
    {
      "year": 2005,
      "month": 3,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 114.8647
    },
    {
      "year": 2005,
      "month": 4,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 115.076
    },
    {
      "year": 2005,
      "month": 5,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 115.2878
    },
    {
      "year": 2005,
      "month": 6,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 115.4999
    },
    {
      "year": 2005,
      "month": 7,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 115.7125
    },
    {
      "year": 2005,
      "month": 8,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 115.9254
    },
    {
      "year": 2005,
      "month": 9,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 116.1387
    },
    {
      "year": 2005,
      "month": 10,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 116.3524
    },
    {
      "year": 2005,
      "month": 11,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 116.5665
    },
    {
      "year": 2005,
      "month": 12,
      "equity": 0.0029642,
      "bond": 0.0079328,
      "cpi": 116.781
    },
    {
      "year": 2006,
      "month": 1,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 116.9755
    },
    {
      "year": 2006,
      "month": 2,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 117.1704
    },
    {
      "year": 2006,
      "month": 3,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 117.3656
    },
    {
      "year": 2006,
      "month": 4,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 117.5611
    },
    {
      "year": 2006,
      "month": 5,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 117.7569
    },
    {
      "year": 2006,
      "month": 6,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 117.9531
    },
    {
      "year": 2006,
      "month": 7,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 118.1496
    },
    {
      "year": 2006,
      "month": 8,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 118.3464
    },
    {
      "year": 2006,
      "month": 9,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 118.5436
    },
    {
      "year": 2006,
      "month": 10,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 118.7411
    },
    {
      "year": 2006,
      "month": 11,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 118.9389
    },
    {
      "year": 2006,
      "month": 12,
      "equity": 0.0111853,
      "bond": 0.0040681,
      "cpi": 119.137
    },
    {
      "year": 2007,
      "month": 1,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 119.3465
    },
    {
      "year": 2007,
      "month": 2,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 119.5563
    },
    {
      "year": 2007,
      "month": 3,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 119.7666
    },
    {
      "year": 2007,
      "month": 4,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 119.9772
    },
    {
      "year": 2007,
      "month": 5,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 120.1881
    },
    {
      "year": 2007,
      "month": 6,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 120.3995
    },
    {
      "year": 2007,
      "month": 7,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 120.6112
    },
    {
      "year": 2007,
      "month": 8,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 120.8233
    },
    {
      "year": 2007,
      "month": 9,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 121.0357
    },
    {
      "year": 2007,
      "month": 10,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 121.2485
    },
    {
      "year": 2007,
      "month": 11,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 121.4617
    },
    {
      "year": 2007,
      "month": 12,
      "equity": -0.0085462,
      "bond": 0.0033126,
      "cpi": 121.6753
    },
    {
      "year": 2008,
      "month": 1,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 121.9145
    },
    {
      "year": 2008,
      "month": 2,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 122.1542
    },
    {
      "year": 2008,
      "month": 3,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 122.3944
    },
    {
      "year": 2008,
      "month": 4,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 122.635
    },
    {
      "year": 2008,
      "month": 5,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 122.8761
    },
    {
      "year": 2008,
      "month": 6,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 123.1177
    },
    {
      "year": 2008,
      "month": 7,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 123.3597
    },
    {
      "year": 2008,
      "month": 8,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 123.6023
    },
    {
      "year": 2008,
      "month": 9,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 123.8453
    },
    {
      "year": 2008,
      "month": 10,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 124.0888
    },
    {
      "year": 2008,
      "month": 11,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 124.3327
    },
    {
      "year": 2008,
      "month": 12,
      "equity": -0.0227131,
      "bond": 0.005183,
      "cpi": 124.5772
    },
    {
      "year": 2009,
      "month": 1,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.6083
    },
    {
      "year": 2009,
      "month": 2,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.6394
    },
    {
      "year": 2009,
      "month": 3,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.6704
    },
    {
      "year": 2009,
      "month": 4,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.7015
    },
    {
      "year": 2009,
      "month": 5,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.7326
    },
    {
      "year": 2009,
      "month": 6,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.7637
    },
    {
      "year": 2009,
      "month": 7,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.7949
    },
    {
      "year": 2009,
      "month": 8,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.826
    },
    {
      "year": 2009,
      "month": 9,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.8571
    },
    {
      "year": 2009,
      "month": 10,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.8883
    },
    {
      "year": 2009,
      "month": 11,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.9194
    },
    {
      "year": 2009,
      "month": 12,
      "equity": 0.0082191,
      "bond": 0.0041412,
      "cpi": 124.9506
    },
    {
      "year": 2010,
      "month": 1,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 125.1334
    },
    {
      "year": 2010,
      "month": 2,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 125.3164
    },
    {
      "year": 2010,
      "month": 3,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 125.4997
    },
    {
      "year": 2010,
      "month": 4,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 125.6832
    },
    {
      "year": 2010,
      "month": 5,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 125.8671
    },
    {
      "year": 2010,
      "month": 6,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.0511
    },
    {
      "year": 2010,
      "month": 7,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.2355
    },
    {
      "year": 2010,
      "month": 8,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.4201
    },
    {
      "year": 2010,
      "month": 9,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.6051
    },
    {
      "year": 2010,
      "month": 10,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.7902
    },
    {
      "year": 2010,
      "month": 11,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 126.9757
    },
    {
      "year": 2010,
      "month": 12,
      "equity": 0.00712,
      "bond": 0.0044909,
      "cpi": 127.1614
    },
    {
      "year": 2011,
      "month": 1,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 127.4637
    },
    {
      "year": 2011,
      "month": 2,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 127.7668
    },
    {
      "year": 2011,
      "month": 3,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 128.0706
    },
    {
      "year": 2011,
      "month": 4,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 128.3751
    },
    {
      "year": 2011,
      "month": 5,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 128.6803
    },
    {
      "year": 2011,
      "month": 6,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 128.9863
    },
    {
      "year": 2011,
      "month": 7,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 129.2929
    },
    {
      "year": 2011,
      "month": 8,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 129.6004
    },
    {
      "year": 2011,
      "month": 9,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 129.9085
    },
    {
      "year": 2011,
      "month": 10,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 130.2174
    },
    {
      "year": 2011,
      "month": 11,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 130.527
    },
    {
      "year": 2011,
      "month": 12,
      "equity": 0.0035361,
      "bond": 0.0054666,
      "cpi": 130.8373
    },
    {
      "year": 2012,
      "month": 1,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.0029
    },
    {
      "year": 2012,
      "month": 2,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.1687
    },
    {
      "year": 2012,
      "month": 3,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.3347
    },
    {
      "year": 2012,
      "month": 4,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.501
    },
    {
      "year": 2012,
      "month": 5,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.6674
    },
    {
      "year": 2012,
      "month": 6,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 131.8341
    },
    {
      "year": 2012,
      "month": 7,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.001
    },
    {
      "year": 2012,
      "month": 8,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.168
    },
    {
      "year": 2012,
      "month": 9,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.3353
    },
    {
      "year": 2012,
      "month": 10,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.5028
    },
    {
      "year": 2012,
      "month": 11,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.6705
    },
    {
      "year": 2012,
      "month": 12,
      "equity": 0.0109447,
      "bond": 0.0075084,
      "cpi": 132.8385
    },
    {
      "year": 2013,
      "month": 1,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 132.9404
    },
    {
      "year": 2013,
      "month": 2,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.0424
    },
    {
      "year": 2013,
      "month": 3,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.1445
    },
    {
      "year": 2013,
      "month": 4,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.2467
    },
    {
      "year": 2013,
      "month": 5,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.3489
    },
    {
      "year": 2013,
      "month": 6,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.4512
    },
    {
      "year": 2013,
      "month": 7,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.5536
    },
    {
      "year": 2013,
      "month": 8,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.6561
    },
    {
      "year": 2013,
      "month": 9,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.7586
    },
    {
      "year": 2013,
      "month": 10,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.8612
    },
    {
      "year": 2013,
      "month": 11,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 133.9639
    },
    {
      "year": 2013,
      "month": 12,
      "equity": 0.0275261,
      "bond": -0.000313,
      "cpi": 134.0667
    },
    {
      "year": 2014,
      "month": 1,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 134.2794
    },
    {
      "year": 2014,
      "month": 2,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 134.4924
    },
    {
      "year": 2014,
      "month": 3,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 134.7057
    },
    {
      "year": 2014,
      "month": 4,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 134.9194
    },
    {
      "year": 2014,
      "month": 5,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 135.1334
    },
    {
      "year": 2014,
      "month": 6,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 135.3478
    },
    {
      "year": 2014,
      "month": 7,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 135.5624
    },
    {
      "year": 2014,
      "month": 8,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 135.7775
    },
    {
      "year": 2014,
      "month": 9,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 135.9929
    },
    {
      "year": 2014,
      "month": 10,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 136.2086
    },
    {
      "year": 2014,
      "month": 11,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 136.4246
    },
    {
      "year": 2014,
      "month": 12,
      "equity": 0.019618,
      "bond": 0.002918,
      "cpi": 136.641
    },
    {
      "year": 2015,
      "month": 1,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 136.7677
    },
    {
      "year": 2015,
      "month": 2,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 136.8946
    },
    {
      "year": 2015,
      "month": 3,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.0215
    },
    {
      "year": 2015,
      "month": 4,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.1486
    },
    {
      "year": 2015,
      "month": 5,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.2758
    },
    {
      "year": 2015,
      "month": 6,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.4031
    },
    {
      "year": 2015,
      "month": 7,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.5305
    },
    {
      "year": 2015,
      "month": 8,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.6581
    },
    {
      "year": 2015,
      "month": 9,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.7857
    },
    {
      "year": 2015,
      "month": 10,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 137.9135
    },
    {
      "year": 2015,
      "month": 11,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 138.0414
    },
    {
      "year": 2015,
      "month": 12,
      "equity": 0.0165907,
      "bond": 0.0053587,
      "cpi": 138.1694
    },
    {
      "year": 2016,
      "month": 1,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 138.3336
    },
    {
      "year": 2016,
      "month": 2,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 138.4981
    },
    {
      "year": 2016,
      "month": 3,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 138.6627
    },
    {
      "year": 2016,
      "month": 4,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 138.8275
    },
    {
      "year": 2016,
      "month": 5,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 138.9925
    },
    {
      "year": 2016,
      "month": 6,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.1577
    },
    {
      "year": 2016,
      "month": 7,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.3231
    },
    {
      "year": 2016,
      "month": 8,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.4887
    },
    {
      "year": 2016,
      "month": 9,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.6545
    },
    {
      "year": 2016,
      "month": 10,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.8205
    },
    {
      "year": 2016,
      "month": 11,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 139.9867
    },
    {
      "year": 2016,
      "month": 12,
      "equity": 0.0004624,
      "bond": 0.0029173,
      "cpi": 140.1531
    },
    {
      "year": 2017,
      "month": 1,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 140.339
    },
    {
      "year": 2017,
      "month": 2,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 140.5251
    },
    {
      "year": 2017,
      "month": 3,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 140.7115
    },
    {
      "year": 2017,
      "month": 4,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 140.8981
    },
    {
      "year": 2017,
      "month": 5,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 141.0849
    },
    {
      "year": 2017,
      "month": 6,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 141.272
    },
    {
      "year": 2017,
      "month": 7,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 141.4594
    },
    {
      "year": 2017,
      "month": 8,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 141.647
    },
    {
      "year": 2017,
      "month": 9,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 141.8349
    },
    {
      "year": 2017,
      "month": 10,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 142.023
    },
    {
      "year": 2017,
      "month": 11,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 142.2113
    },
    {
      "year": 2017,
      "month": 12,
      "equity": 0.0090866,
      "bond": -0.0006964,
      "cpi": 142.3999
    },
    {
      "year": 2018,
      "month": 1,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 142.6663
    },
    {
      "year": 2018,
      "month": 2,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 142.9331
    },
    {
      "year": 2018,
      "month": 3,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 143.2005
    },
    {
      "year": 2018,
      "month": 4,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 143.4684
    },
    {
      "year": 2018,
      "month": 5,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 143.7368
    },
    {
      "year": 2018,
      "month": 6,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 144.0056
    },
    {
      "year": 2018,
      "month": 7,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 144.275
    },
    {
      "year": 2018,
      "month": 8,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 144.5449
    },
    {
      "year": 2018,
      "month": 9,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 144.8153
    },
    {
      "year": 2018,
      "month": 10,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 145.0862
    },
    {
      "year": 2018,
      "month": 11,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 145.3576
    },
    {
      "year": 2018,
      "month": 12,
      "equity": 0.0182143,
      "bond": 0.0009712,
      "cpi": 145.6295
    },
    {
      "year": 2019,
      "month": 1,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 145.864
    },
    {
      "year": 2019,
      "month": 2,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 146.0988
    },
    {
      "year": 2019,
      "month": 3,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 146.3341
    },
    {
      "year": 2019,
      "month": 4,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 146.5697
    },
    {
      "year": 2019,
      "month": 5,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 146.8056
    },
    {
      "year": 2019,
      "month": 6,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 147.042
    },
    {
      "year": 2019,
      "month": 7,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 147.2788
    },
    {
      "year": 2019,
      "month": 8,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 147.5159
    },
    {
      "year": 2019,
      "month": 9,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 147.7534
    },
    {
      "year": 2019,
      "month": 10,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 147.9913
    },
    {
      "year": 2019,
      "month": 11,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 148.2296
    },
    {
      "year": 2019,
      "month": 12,
      "equity": 0.0029103,
      "bond": 0.0052768,
      "cpi": 148.4682
    },
    {
      "year": 2020,
      "month": 1,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.5566
    },
    {
      "year": 2020,
      "month": 2,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.6451
    },
    {
      "year": 2020,
      "month": 3,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.7336
    },
    {
      "year": 2020,
      "month": 4,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.8222
    },
    {
      "year": 2020,
      "month": 5,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.9108
    },
    {
      "year": 2020,
      "month": 6,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 148.9995
    },
    {
      "year": 2020,
      "month": 7,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.0882
    },
    {
      "year": 2020,
      "month": 8,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.177
    },
    {
      "year": 2020,
      "month": 9,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.2659
    },
    {
      "year": 2020,
      "month": 10,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.3548
    },
    {
      "year": 2020,
      "month": 11,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.4437
    },
    {
      "year": 2020,
      "month": 12,
      "equity": 0.0085724,
      "bond": 0.0050852,
      "cpi": 149.5327
    },
    {
      "year": 2021,
      "month": 1,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 149.9499
    },
    {
      "year": 2021,
      "month": 2,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 150.3683
    },
    {
      "year": 2021,
      "month": 3,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 150.7878
    },
    {
      "year": 2021,
      "month": 4,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 151.2086
    },
    {
      "year": 2021,
      "month": 5,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 151.6304
    },
    {
      "year": 2021,
      "month": 6,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 152.0535
    },
    {
      "year": 2021,
      "month": 7,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 152.4778
    },
    {
      "year": 2021,
      "month": 8,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 152.9032
    },
    {
      "year": 2021,
      "month": 9,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 153.3298
    },
    {
      "year": 2021,
      "month": 10,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 153.7576
    },
    {
      "year": 2021,
      "month": 11,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 154.1866
    },
    {
      "year": 2021,
      "month": 12,
      "equity": 0.0165282,
      "bond": -0.0039601,
      "cpi": 154.6168
    },
    {
      "year": 2022,
      "month": 1,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 155.4668
    },
    {
      "year": 2022,
      "month": 2,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 156.3214
    },
    {
      "year": 2022,
      "month": 3,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 157.1808
    },
    {
      "year": 2022,
      "month": 4,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 158.0449
    },
    {
      "year": 2022,
      "month": 5,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 158.9137
    },
    {
      "year": 2022,
      "month": 6,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 159.7873
    },
    {
      "year": 2022,
      "month": 7,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 160.6657
    },
    {
      "year": 2022,
      "month": 8,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 161.549
    },
    {
      "year": 2022,
      "month": 9,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 162.4371
    },
    {
      "year": 2022,
      "month": 10,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 163.33
    },
    {
      "year": 2022,
      "month": 11,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 164.2279
    },
    {
      "year": 2022,
      "month": 12,
      "equity": -0.00752,
      "bond": -0.0102782,
      "cpi": 165.1307
    },
    {
      "year": 2023,
      "month": 1,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 165.658
    },
    {
      "year": 2023,
      "month": 2,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 166.187
    },
    {
      "year": 2023,
      "month": 3,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 166.7177
    },
    {
      "year": 2023,
      "month": 4,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 167.2501
    },
    {
      "year": 2023,
      "month": 5,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 167.7842
    },
    {
      "year": 2023,
      "month": 6,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 168.32
    },
    {
      "year": 2023,
      "month": 7,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 168.8574
    },
    {
      "year": 2023,
      "month": 8,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 169.3967
    },
    {
      "year": 2023,
      "month": 9,
      "equity": 0.0065272,
      "bond": 0.0037788,
      "cpi": 169.9376
    }
  ]
};
