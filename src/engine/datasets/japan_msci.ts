import { HistoricalDataset } from '../types'

export const dataset: HistoricalDataset = {
  "id": "japan_msci",
  "name": "Japan MSCI",
  "shortName": "Japan MSCI",
  "geographicFocus": "Japan",
  "flag": "\ud83c\uddef\ud83c\uddf5",
  "startYear": 1970,
  "endYear": 2023,
  "resolution": "monthly",
  "description": "Japanese stock market (Nikkei/MSCI) returns, Japanese Government bond returns, and domestic CPI.",
  "limitations": [
    "Captures the 1989 bubble peak and subsequent multi-decade stagnation/deflation.",
    "Historical span is shorter compared to other monthly datasets."
  ],
  "eras": [
    {
      "year": 1973,
      "month": 1,
      "label": "First Oil Crisis",
      "description": "Inflation spike and end of rapid-growth era."
    },
    {
      "year": 1989,
      "month": 12,
      "label": "Asset Bubble Peak",
      "description": "Peak of Japanese real estate and stock valuations."
    },
    {
      "year": 1997,
      "month": 7,
      "label": "Asian Financial Crisis",
      "description": "Bank failures and domestic credit crunch."
    },
    {
      "year": 2008,
      "month": 1,
      "label": "Global Financial Crisis",
      "description": "Export demand shock and yen appreciation."
    }
  ],
  "epochs": [
    {
      "year": 1970,
      "label": "1970\u20132023 (Full History)"
    },
    {
      "year": 1990,
      "label": "1990\u20132023 (Post-Bubble Stagnation)"
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
      "year": 1970,
      "month": 1,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 100.6149
    },
    {
      "year": 1970,
      "month": 2,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 101.2336
    },
    {
      "year": 1970,
      "month": 3,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 101.8561
    },
    {
      "year": 1970,
      "month": 4,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 102.4824
    },
    {
      "year": 1970,
      "month": 5,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 103.1126
    },
    {
      "year": 1970,
      "month": 6,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 103.7466
    },
    {
      "year": 1970,
      "month": 7,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 104.3846
    },
    {
      "year": 1970,
      "month": 8,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 105.0264
    },
    {
      "year": 1970,
      "month": 9,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 105.6722
    },
    {
      "year": 1970,
      "month": 10,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 106.322
    },
    {
      "year": 1970,
      "month": 11,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 106.9758
    },
    {
      "year": 1970,
      "month": 12,
      "equity": 0.0074826,
      "bond": 0.0053804,
      "cpi": 107.6336
    },
    {
      "year": 1971,
      "month": 1,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 108.1634
    },
    {
      "year": 1971,
      "month": 2,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 108.6958
    },
    {
      "year": 1971,
      "month": 3,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 109.2309
    },
    {
      "year": 1971,
      "month": 4,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 109.7685
    },
    {
      "year": 1971,
      "month": 5,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 110.3088
    },
    {
      "year": 1971,
      "month": 6,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 110.8518
    },
    {
      "year": 1971,
      "month": 7,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 111.3975
    },
    {
      "year": 1971,
      "month": 8,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 111.9458
    },
    {
      "year": 1971,
      "month": 9,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 112.4968
    },
    {
      "year": 1971,
      "month": 10,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 113.0506
    },
    {
      "year": 1971,
      "month": 11,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 113.6071
    },
    {
      "year": 1971,
      "month": 12,
      "equity": 0.0100376,
      "bond": 0.005466,
      "cpi": 114.1663
    },
    {
      "year": 1972,
      "month": 1,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 114.5979
    },
    {
      "year": 1972,
      "month": 2,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 115.0311
    },
    {
      "year": 1972,
      "month": 3,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 115.466
    },
    {
      "year": 1972,
      "month": 4,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 115.9025
    },
    {
      "year": 1972,
      "month": 5,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 116.3407
    },
    {
      "year": 1972,
      "month": 6,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 116.7805
    },
    {
      "year": 1972,
      "month": 7,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 117.222
    },
    {
      "year": 1972,
      "month": 8,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 117.6652
    },
    {
      "year": 1972,
      "month": 9,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 118.11
    },
    {
      "year": 1972,
      "month": 10,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 118.5565
    },
    {
      "year": 1972,
      "month": 11,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 119.0048
    },
    {
      "year": 1972,
      "month": 12,
      "equity": 0.0405811,
      "bond": 0.0070208,
      "cpi": 119.4547
    },
    {
      "year": 1973,
      "month": 1,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 120.5395
    },
    {
      "year": 1973,
      "month": 2,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 121.6341
    },
    {
      "year": 1973,
      "month": 3,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 122.7387
    },
    {
      "year": 1973,
      "month": 4,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 123.8533
    },
    {
      "year": 1973,
      "month": 5,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 124.978
    },
    {
      "year": 1973,
      "month": 6,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 126.1129
    },
    {
      "year": 1973,
      "month": 7,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 127.2581
    },
    {
      "year": 1973,
      "month": 8,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 128.4138
    },
    {
      "year": 1973,
      "month": 9,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 129.5799
    },
    {
      "year": 1973,
      "month": 10,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 130.7566
    },
    {
      "year": 1973,
      "month": 11,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 131.944
    },
    {
      "year": 1973,
      "month": 12,
      "equity": 0.0226908,
      "bond": -0.000158,
      "cpi": 133.1422
    },
    {
      "year": 1974,
      "month": 1,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 135.5989
    },
    {
      "year": 1974,
      "month": 2,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 138.1008
    },
    {
      "year": 1974,
      "month": 3,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 140.649
    },
    {
      "year": 1974,
      "month": 4,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 143.2441
    },
    {
      "year": 1974,
      "month": 5,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 145.8872
    },
    {
      "year": 1974,
      "month": 6,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 148.579
    },
    {
      "year": 1974,
      "month": 7,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 151.3205
    },
    {
      "year": 1974,
      "month": 8,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 154.1126
    },
    {
      "year": 1974,
      "month": 9,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 156.9561
    },
    {
      "year": 1974,
      "month": 10,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 159.8522
    },
    {
      "year": 1974,
      "month": 11,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 162.8017
    },
    {
      "year": 1974,
      "month": 12,
      "equity": -0.0110162,
      "bond": 0.0045921,
      "cpi": 165.8056
    },
    {
      "year": 1975,
      "month": 1,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 167.3564
    },
    {
      "year": 1975,
      "month": 2,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 168.9218
    },
    {
      "year": 1975,
      "month": 3,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 170.5018
    },
    {
      "year": 1975,
      "month": 4,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 172.0966
    },
    {
      "year": 1975,
      "month": 5,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 173.7063
    },
    {
      "year": 1975,
      "month": 6,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 175.331
    },
    {
      "year": 1975,
      "month": 7,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 176.9709
    },
    {
      "year": 1975,
      "month": 8,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 178.6262
    },
    {
      "year": 1975,
      "month": 9,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 180.297
    },
    {
      "year": 1975,
      "month": 10,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 181.9834
    },
    {
      "year": 1975,
      "month": 11,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 183.6855
    },
    {
      "year": 1975,
      "month": 12,
      "equity": 0.0041445,
      "bond": 0.0064307,
      "cpi": 185.4036
    },
    {
      "year": 1976,
      "month": 1,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 186.7963
    },
    {
      "year": 1976,
      "month": 2,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 188.1995
    },
    {
      "year": 1976,
      "month": 3,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 189.6132
    },
    {
      "year": 1976,
      "month": 4,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 191.0375
    },
    {
      "year": 1976,
      "month": 5,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 192.4725
    },
    {
      "year": 1976,
      "month": 6,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 193.9183
    },
    {
      "year": 1976,
      "month": 7,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 195.375
    },
    {
      "year": 1976,
      "month": 8,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 196.8426
    },
    {
      "year": 1976,
      "month": 9,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 198.3212
    },
    {
      "year": 1976,
      "month": 10,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 199.8109
    },
    {
      "year": 1976,
      "month": 11,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 201.3119
    },
    {
      "year": 1976,
      "month": 12,
      "equity": 0.0114515,
      "bond": 0.0065289,
      "cpi": 202.8241
    },
    {
      "year": 1977,
      "month": 1,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 204.1252
    },
    {
      "year": 1977,
      "month": 2,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 205.4347
    },
    {
      "year": 1977,
      "month": 3,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 206.7525
    },
    {
      "year": 1977,
      "month": 4,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 208.0788
    },
    {
      "year": 1977,
      "month": 5,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 209.4137
    },
    {
      "year": 1977,
      "month": 6,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 210.757
    },
    {
      "year": 1977,
      "month": 7,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 212.109
    },
    {
      "year": 1977,
      "month": 8,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 213.4697
    },
    {
      "year": 1977,
      "month": 9,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 214.8391
    },
    {
      "year": 1977,
      "month": 10,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 216.2173
    },
    {
      "year": 1977,
      "month": 11,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 217.6043
    },
    {
      "year": 1977,
      "month": 12,
      "equity": 0.0081451,
      "bond": 0.0164592,
      "cpi": 219.0003
    },
    {
      "year": 1978,
      "month": 1,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 219.6882
    },
    {
      "year": 1978,
      "month": 2,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 220.3783
    },
    {
      "year": 1978,
      "month": 3,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 221.0706
    },
    {
      "year": 1978,
      "month": 4,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 221.765
    },
    {
      "year": 1978,
      "month": 5,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 222.4616
    },
    {
      "year": 1978,
      "month": 6,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 223.1604
    },
    {
      "year": 1978,
      "month": 7,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 223.8614
    },
    {
      "year": 1978,
      "month": 8,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 224.5645
    },
    {
      "year": 1978,
      "month": 9,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 225.2699
    },
    {
      "year": 1978,
      "month": 10,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 225.9776
    },
    {
      "year": 1978,
      "month": 11,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 226.6874
    },
    {
      "year": 1978,
      "month": 12,
      "equity": 0.0107968,
      "bond": 0.0059358,
      "cpi": 227.3995
    },
    {
      "year": 1979,
      "month": 1,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 228.0628
    },
    {
      "year": 1979,
      "month": 2,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 228.728
    },
    {
      "year": 1979,
      "month": 3,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 229.3951
    },
    {
      "year": 1979,
      "month": 4,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 230.0642
    },
    {
      "year": 1979,
      "month": 5,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 230.7352
    },
    {
      "year": 1979,
      "month": 6,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 231.4082
    },
    {
      "year": 1979,
      "month": 7,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 232.0832
    },
    {
      "year": 1979,
      "month": 8,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 232.7601
    },
    {
      "year": 1979,
      "month": 9,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 233.439
    },
    {
      "year": 1979,
      "month": 10,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 234.1199
    },
    {
      "year": 1979,
      "month": 11,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 234.8027
    },
    {
      "year": 1979,
      "month": 12,
      "equity": 0.0080812,
      "bond": -0.0051134,
      "cpi": 235.4876
    },
    {
      "year": 1980,
      "month": 1,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 237.0134
    },
    {
      "year": 1980,
      "month": 2,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 238.549
    },
    {
      "year": 1980,
      "month": 3,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 240.0946
    },
    {
      "year": 1980,
      "month": 4,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 241.6502
    },
    {
      "year": 1980,
      "month": 5,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 243.2159
    },
    {
      "year": 1980,
      "month": 6,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 244.7917
    },
    {
      "year": 1980,
      "month": 7,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 246.3778
    },
    {
      "year": 1980,
      "month": 8,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 247.9741
    },
    {
      "year": 1980,
      "month": 9,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 249.5808
    },
    {
      "year": 1980,
      "month": 10,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 251.1978
    },
    {
      "year": 1980,
      "month": 11,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 252.8254
    },
    {
      "year": 1980,
      "month": 12,
      "equity": 0.0051696,
      "bond": 0.0053638,
      "cpi": 254.4635
    },
    {
      "year": 1981,
      "month": 1,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 255.4779
    },
    {
      "year": 1981,
      "month": 2,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 256.4963
    },
    {
      "year": 1981,
      "month": 3,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 257.5188
    },
    {
      "year": 1981,
      "month": 4,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 258.5454
    },
    {
      "year": 1981,
      "month": 5,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 259.5761
    },
    {
      "year": 1981,
      "month": 6,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 260.6108
    },
    {
      "year": 1981,
      "month": 7,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 261.6497
    },
    {
      "year": 1981,
      "month": 8,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 262.6928
    },
    {
      "year": 1981,
      "month": 9,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 263.74
    },
    {
      "year": 1981,
      "month": 10,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 264.7914
    },
    {
      "year": 1981,
      "month": 11,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 265.8469
    },
    {
      "year": 1981,
      "month": 12,
      "equity": 0.0135639,
      "bond": 0.0109199,
      "cpi": 266.9067
    },
    {
      "year": 1982,
      "month": 1,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 267.4957
    },
    {
      "year": 1982,
      "month": 2,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 268.0861
    },
    {
      "year": 1982,
      "month": 3,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 268.6777
    },
    {
      "year": 1982,
      "month": 4,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 269.2707
    },
    {
      "year": 1982,
      "month": 5,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 269.8649
    },
    {
      "year": 1982,
      "month": 6,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 270.4605
    },
    {
      "year": 1982,
      "month": 7,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 271.0573
    },
    {
      "year": 1982,
      "month": 8,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 271.6555
    },
    {
      "year": 1982,
      "month": 9,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 272.2551
    },
    {
      "year": 1982,
      "month": 10,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 272.8559
    },
    {
      "year": 1982,
      "month": 11,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 273.4581
    },
    {
      "year": 1982,
      "month": 12,
      "equity": 0.0005068,
      "bond": 0.0081505,
      "cpi": 274.0615
    },
    {
      "year": 1983,
      "month": 1,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 274.4729
    },
    {
      "year": 1983,
      "month": 2,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 274.8848
    },
    {
      "year": 1983,
      "month": 3,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 275.2974
    },
    {
      "year": 1983,
      "month": 4,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 275.7106
    },
    {
      "year": 1983,
      "month": 5,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 276.1245
    },
    {
      "year": 1983,
      "month": 6,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 276.5389
    },
    {
      "year": 1983,
      "month": 7,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 276.954
    },
    {
      "year": 1983,
      "month": 8,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 277.3697
    },
    {
      "year": 1983,
      "month": 9,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 277.786
    },
    {
      "year": 1983,
      "month": 10,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 278.203
    },
    {
      "year": 1983,
      "month": 11,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 278.6206
    },
    {
      "year": 1983,
      "month": 12,
      "equity": 0.0169228,
      "bond": 0.0088827,
      "cpi": 279.0388
    },
    {
      "year": 1984,
      "month": 1,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 279.552
    },
    {
      "year": 1984,
      "month": 2,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 280.0662
    },
    {
      "year": 1984,
      "month": 3,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 280.5814
    },
    {
      "year": 1984,
      "month": 4,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 281.0974
    },
    {
      "year": 1984,
      "month": 5,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 281.6145
    },
    {
      "year": 1984,
      "month": 6,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 282.1325
    },
    {
      "year": 1984,
      "month": 7,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 282.6514
    },
    {
      "year": 1984,
      "month": 8,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 283.1713
    },
    {
      "year": 1984,
      "month": 9,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 283.6921
    },
    {
      "year": 1984,
      "month": 10,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 284.2139
    },
    {
      "year": 1984,
      "month": 11,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 284.7367
    },
    {
      "year": 1984,
      "month": 12,
      "equity": 0.0204338,
      "bond": 0.0102372,
      "cpi": 285.2604
    },
    {
      "year": 1985,
      "month": 1,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 285.7229
    },
    {
      "year": 1985,
      "month": 2,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 286.1861
    },
    {
      "year": 1985,
      "month": 3,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 286.6501
    },
    {
      "year": 1985,
      "month": 4,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 287.1148
    },
    {
      "year": 1985,
      "month": 5,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 287.5803
    },
    {
      "year": 1985,
      "month": 6,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 288.0465
    },
    {
      "year": 1985,
      "month": 7,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 288.5135
    },
    {
      "year": 1985,
      "month": 8,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 288.9813
    },
    {
      "year": 1985,
      "month": 9,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 289.4498
    },
    {
      "year": 1985,
      "month": 10,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 289.919
    },
    {
      "year": 1985,
      "month": 11,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 290.3891
    },
    {
      "year": 1985,
      "month": 12,
      "equity": 0.0163797,
      "bond": 0.0093828,
      "cpi": 290.8598
    },
    {
      "year": 1986,
      "month": 1,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.0149
    },
    {
      "year": 1986,
      "month": 2,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.1701
    },
    {
      "year": 1986,
      "month": 3,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.3253
    },
    {
      "year": 1986,
      "month": 4,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.4806
    },
    {
      "year": 1986,
      "month": 5,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.636
    },
    {
      "year": 1986,
      "month": 6,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.7915
    },
    {
      "year": 1986,
      "month": 7,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 291.9471
    },
    {
      "year": 1986,
      "month": 8,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 292.1028
    },
    {
      "year": 1986,
      "month": 9,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 292.2585
    },
    {
      "year": 1986,
      "month": 10,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 292.4144
    },
    {
      "year": 1986,
      "month": 11,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 292.5703
    },
    {
      "year": 1986,
      "month": 12,
      "equity": 0.0232066,
      "bond": 0.0049401,
      "cpi": 292.7263
    },
    {
      "year": 1987,
      "month": 1,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.7522
    },
    {
      "year": 1987,
      "month": 2,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.7781
    },
    {
      "year": 1987,
      "month": 3,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.804
    },
    {
      "year": 1987,
      "month": 4,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.83
    },
    {
      "year": 1987,
      "month": 5,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.8559
    },
    {
      "year": 1987,
      "month": 6,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.8818
    },
    {
      "year": 1987,
      "month": 7,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.9077
    },
    {
      "year": 1987,
      "month": 8,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.9336
    },
    {
      "year": 1987,
      "month": 9,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.9596
    },
    {
      "year": 1987,
      "month": 10,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 292.9855
    },
    {
      "year": 1987,
      "month": 11,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 293.0114
    },
    {
      "year": 1987,
      "month": 12,
      "equity": 0.032928,
      "bond": 0.003752,
      "cpi": 293.0374
    },
    {
      "year": 1988,
      "month": 1,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 293.2182
    },
    {
      "year": 1988,
      "month": 2,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 293.3992
    },
    {
      "year": 1988,
      "month": 3,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 293.5803
    },
    {
      "year": 1988,
      "month": 4,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 293.7615
    },
    {
      "year": 1988,
      "month": 5,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 293.9428
    },
    {
      "year": 1988,
      "month": 6,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 294.1242
    },
    {
      "year": 1988,
      "month": 7,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 294.3057
    },
    {
      "year": 1988,
      "month": 8,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 294.4873
    },
    {
      "year": 1988,
      "month": 9,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 294.6691
    },
    {
      "year": 1988,
      "month": 10,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 294.8509
    },
    {
      "year": 1988,
      "month": 11,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 295.0329
    },
    {
      "year": 1988,
      "month": 12,
      "equity": 0.0077165,
      "bond": 0.0039996,
      "cpi": 295.215
    },
    {
      "year": 1989,
      "month": 1,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 295.7539
    },
    {
      "year": 1989,
      "month": 2,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 296.2939
    },
    {
      "year": 1989,
      "month": 3,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 296.8348
    },
    {
      "year": 1989,
      "month": 4,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 297.3767
    },
    {
      "year": 1989,
      "month": 5,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 297.9196
    },
    {
      "year": 1989,
      "month": 6,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 298.4635
    },
    {
      "year": 1989,
      "month": 7,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 299.0083
    },
    {
      "year": 1989,
      "month": 8,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 299.5542
    },
    {
      "year": 1989,
      "month": 9,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 300.1011
    },
    {
      "year": 1989,
      "month": 10,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 300.6489
    },
    {
      "year": 1989,
      "month": 11,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 301.1978
    },
    {
      "year": 1989,
      "month": 12,
      "equity": 0.0157964,
      "bond": -0.0007119,
      "cpi": 301.7477
    },
    {
      "year": 1990,
      "month": 1,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 302.5146
    },
    {
      "year": 1990,
      "month": 2,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 303.2834
    },
    {
      "year": 1990,
      "month": 3,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 304.0542
    },
    {
      "year": 1990,
      "month": 4,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 304.827
    },
    {
      "year": 1990,
      "month": 5,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 305.6017
    },
    {
      "year": 1990,
      "month": 6,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 306.3784
    },
    {
      "year": 1990,
      "month": 7,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 307.157
    },
    {
      "year": 1990,
      "month": 8,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 307.9377
    },
    {
      "year": 1990,
      "month": 9,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 308.7203
    },
    {
      "year": 1990,
      "month": 10,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 309.5049
    },
    {
      "year": 1990,
      "month": 11,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 310.2915
    },
    {
      "year": 1990,
      "month": 12,
      "equity": -0.0117039,
      "bond": -0.0014624,
      "cpi": 311.0801
    },
    {
      "year": 1991,
      "month": 1,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 311.9229
    },
    {
      "year": 1991,
      "month": 2,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 312.768
    },
    {
      "year": 1991,
      "month": 3,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 313.6154
    },
    {
      "year": 1991,
      "month": 4,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 314.465
    },
    {
      "year": 1991,
      "month": 5,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 315.317
    },
    {
      "year": 1991,
      "month": 6,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 316.1713
    },
    {
      "year": 1991,
      "month": 7,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 317.0279
    },
    {
      "year": 1991,
      "month": 8,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 317.8868
    },
    {
      "year": 1991,
      "month": 9,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 318.748
    },
    {
      "year": 1991,
      "month": 10,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 319.6116
    },
    {
      "year": 1991,
      "month": 11,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 320.4775
    },
    {
      "year": 1991,
      "month": 12,
      "equity": -0.0139461,
      "bond": 0.012523,
      "cpi": 321.3457
    },
    {
      "year": 1992,
      "month": 1,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 321.7831
    },
    {
      "year": 1992,
      "month": 2,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 322.2211
    },
    {
      "year": 1992,
      "month": 3,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 322.6597
    },
    {
      "year": 1992,
      "month": 4,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 323.0989
    },
    {
      "year": 1992,
      "month": 5,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 323.5387
    },
    {
      "year": 1992,
      "month": 6,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 323.9791
    },
    {
      "year": 1992,
      "month": 7,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 324.4201
    },
    {
      "year": 1992,
      "month": 8,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 324.8617
    },
    {
      "year": 1992,
      "month": 9,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 325.3039
    },
    {
      "year": 1992,
      "month": 10,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 325.7467
    },
    {
      "year": 1992,
      "month": 11,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 326.1901
    },
    {
      "year": 1992,
      "month": 12,
      "equity": -0.0249118,
      "bond": 0.0091377,
      "cpi": 326.6341
    },
    {
      "year": 1993,
      "month": 1,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 326.9948
    },
    {
      "year": 1993,
      "month": 2,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 327.356
    },
    {
      "year": 1993,
      "month": 3,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 327.7175
    },
    {
      "year": 1993,
      "month": 4,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 328.0794
    },
    {
      "year": 1993,
      "month": 5,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 328.4417
    },
    {
      "year": 1993,
      "month": 6,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 328.8045
    },
    {
      "year": 1993,
      "month": 7,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 329.1676
    },
    {
      "year": 1993,
      "month": 8,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 329.5311
    },
    {
      "year": 1993,
      "month": 9,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 329.895
    },
    {
      "year": 1993,
      "month": 10,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 330.2594
    },
    {
      "year": 1993,
      "month": 11,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 330.6241
    },
    {
      "year": 1993,
      "month": 12,
      "equity": 0.0102167,
      "bond": 0.0117172,
      "cpi": 330.9892
    },
    {
      "year": 1994,
      "month": 1,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 331.1701
    },
    {
      "year": 1994,
      "month": 2,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 331.3511
    },
    {
      "year": 1994,
      "month": 3,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 331.5323
    },
    {
      "year": 1994,
      "month": 4,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 331.7135
    },
    {
      "year": 1994,
      "month": 5,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 331.8948
    },
    {
      "year": 1994,
      "month": 6,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.0762
    },
    {
      "year": 1994,
      "month": 7,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.2577
    },
    {
      "year": 1994,
      "month": 8,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.4393
    },
    {
      "year": 1994,
      "month": 9,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.621
    },
    {
      "year": 1994,
      "month": 10,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.8028
    },
    {
      "year": 1994,
      "month": 11,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 332.9847
    },
    {
      "year": 1994,
      "month": 12,
      "equity": 0.0052945,
      "bond": -0.0053412,
      "cpi": 333.1668
    },
    {
      "year": 1995,
      "month": 1,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.1409
    },
    {
      "year": 1995,
      "month": 2,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.1149
    },
    {
      "year": 1995,
      "month": 3,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.089
    },
    {
      "year": 1995,
      "month": 4,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.0631
    },
    {
      "year": 1995,
      "month": 5,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.0371
    },
    {
      "year": 1995,
      "month": 6,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 333.0112
    },
    {
      "year": 1995,
      "month": 7,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.9853
    },
    {
      "year": 1995,
      "month": 8,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.9594
    },
    {
      "year": 1995,
      "month": 9,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.9335
    },
    {
      "year": 1995,
      "month": 10,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.9075
    },
    {
      "year": 1995,
      "month": 11,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.8816
    },
    {
      "year": 1995,
      "month": 12,
      "equity": -0.0121861,
      "bond": 0.0122807,
      "cpi": 332.8557
    },
    {
      "year": 1996,
      "month": 1,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 332.8816
    },
    {
      "year": 1996,
      "month": 2,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 332.9075
    },
    {
      "year": 1996,
      "month": 3,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 332.9334
    },
    {
      "year": 1996,
      "month": 4,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 332.9594
    },
    {
      "year": 1996,
      "month": 5,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 332.9853
    },
    {
      "year": 1996,
      "month": 6,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.0112
    },
    {
      "year": 1996,
      "month": 7,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.0371
    },
    {
      "year": 1996,
      "month": 8,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.0631
    },
    {
      "year": 1996,
      "month": 9,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.089
    },
    {
      "year": 1996,
      "month": 10,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.1149
    },
    {
      "year": 1996,
      "month": 11,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.1408
    },
    {
      "year": 1996,
      "month": 12,
      "equity": 0.0131556,
      "bond": 0.0057916,
      "cpi": 333.1668
    },
    {
      "year": 1997,
      "month": 1,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 333.6554
    },
    {
      "year": 1997,
      "month": 2,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 334.1447
    },
    {
      "year": 1997,
      "month": 3,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 334.6347
    },
    {
      "year": 1997,
      "month": 4,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 335.1254
    },
    {
      "year": 1997,
      "month": 5,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 335.6169
    },
    {
      "year": 1997,
      "month": 6,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 336.1091
    },
    {
      "year": 1997,
      "month": 7,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 336.602
    },
    {
      "year": 1997,
      "month": 8,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 337.0956
    },
    {
      "year": 1997,
      "month": 9,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 337.5899
    },
    {
      "year": 1997,
      "month": 10,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 338.085
    },
    {
      "year": 1997,
      "month": 11,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 338.5808
    },
    {
      "year": 1997,
      "month": 12,
      "equity": -0.0113421,
      "bond": 0.0085678,
      "cpi": 339.0773
    },
    {
      "year": 1998,
      "month": 1,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 339.2582
    },
    {
      "year": 1998,
      "month": 2,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 339.4393
    },
    {
      "year": 1998,
      "month": 3,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 339.6204
    },
    {
      "year": 1998,
      "month": 4,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 339.8016
    },
    {
      "year": 1998,
      "month": 5,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 339.9829
    },
    {
      "year": 1998,
      "month": 6,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 340.1643
    },
    {
      "year": 1998,
      "month": 7,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 340.3458
    },
    {
      "year": 1998,
      "month": 8,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 340.5275
    },
    {
      "year": 1998,
      "month": 9,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 340.7092
    },
    {
      "year": 1998,
      "month": 10,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 340.891
    },
    {
      "year": 1998,
      "month": 11,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 341.0729
    },
    {
      "year": 1998,
      "month": 12,
      "equity": -0.0133483,
      "bond": 0.0020374,
      "cpi": 341.2549
    },
    {
      "year": 1999,
      "month": 1,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 341.177
    },
    {
      "year": 1999,
      "month": 2,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 341.0992
    },
    {
      "year": 1999,
      "month": 3,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 341.0214
    },
    {
      "year": 1999,
      "month": 4,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.9435
    },
    {
      "year": 1999,
      "month": 5,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.8657
    },
    {
      "year": 1999,
      "month": 6,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.788
    },
    {
      "year": 1999,
      "month": 7,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.7102
    },
    {
      "year": 1999,
      "month": 8,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.6325
    },
    {
      "year": 1999,
      "month": 9,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.5547
    },
    {
      "year": 1999,
      "month": 10,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.477
    },
    {
      "year": 1999,
      "month": 11,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.3993
    },
    {
      "year": 1999,
      "month": 12,
      "equity": 0.0156731,
      "bond": 0.0036831,
      "cpi": 340.3217
    },
    {
      "year": 2000,
      "month": 1,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 340.1136
    },
    {
      "year": 2000,
      "month": 2,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 339.9057
    },
    {
      "year": 2000,
      "month": 3,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 339.6978
    },
    {
      "year": 2000,
      "month": 4,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 339.4901
    },
    {
      "year": 2000,
      "month": 5,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 339.2825
    },
    {
      "year": 2000,
      "month": 6,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 339.0751
    },
    {
      "year": 2000,
      "month": 7,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 338.8678
    },
    {
      "year": 2000,
      "month": 8,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 338.6606
    },
    {
      "year": 2000,
      "month": 9,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 338.4535
    },
    {
      "year": 2000,
      "month": 10,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 338.2466
    },
    {
      "year": 2000,
      "month": 11,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 338.0397
    },
    {
      "year": 2000,
      "month": 12,
      "equity": 0.00953,
      "bond": 0.0012225,
      "cpi": 337.8331
    },
    {
      "year": 2001,
      "month": 1,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 337.6241
    },
    {
      "year": 2001,
      "month": 2,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 337.4153
    },
    {
      "year": 2001,
      "month": 3,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 337.2066
    },
    {
      "year": 2001,
      "month": 4,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 336.998
    },
    {
      "year": 2001,
      "month": 5,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 336.7896
    },
    {
      "year": 2001,
      "month": 6,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 336.5813
    },
    {
      "year": 2001,
      "month": 7,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 336.3731
    },
    {
      "year": 2001,
      "month": 8,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 336.1651
    },
    {
      "year": 2001,
      "month": 9,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 335.9571
    },
    {
      "year": 2001,
      "month": 10,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 335.7493
    },
    {
      "year": 2001,
      "month": 11,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 335.5417
    },
    {
      "year": 2001,
      "month": 12,
      "equity": -0.0202722,
      "bond": 0.004505,
      "cpi": 335.3341
    },
    {
      "year": 2002,
      "month": 1,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 335.0747
    },
    {
      "year": 2002,
      "month": 2,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 334.8156
    },
    {
      "year": 2002,
      "month": 3,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 334.5566
    },
    {
      "year": 2002,
      "month": 4,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 334.2979
    },
    {
      "year": 2002,
      "month": 5,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 334.0393
    },
    {
      "year": 2002,
      "month": 6,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 333.781
    },
    {
      "year": 2002,
      "month": 7,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 333.5228
    },
    {
      "year": 2002,
      "month": 8,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 333.2649
    },
    {
      "year": 2002,
      "month": 9,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 333.0071
    },
    {
      "year": 2002,
      "month": 10,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 332.7496
    },
    {
      "year": 2002,
      "month": 11,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 332.4922
    },
    {
      "year": 2002,
      "month": 12,
      "equity": -0.0152515,
      "bond": 0.005478,
      "cpi": 332.2351
    },
    {
      "year": 2003,
      "month": 1,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 332.1634
    },
    {
      "year": 2003,
      "month": 2,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 332.0918
    },
    {
      "year": 2003,
      "month": 3,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 332.0201
    },
    {
      "year": 2003,
      "month": 4,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.9485
    },
    {
      "year": 2003,
      "month": 5,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.8769
    },
    {
      "year": 2003,
      "month": 6,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.8053
    },
    {
      "year": 2003,
      "month": 7,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.7337
    },
    {
      "year": 2003,
      "month": 8,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.6621
    },
    {
      "year": 2003,
      "month": 9,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.5905
    },
    {
      "year": 2003,
      "month": 10,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.519
    },
    {
      "year": 2003,
      "month": 11,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.4475
    },
    {
      "year": 2003,
      "month": 12,
      "equity": -0.003875,
      "bond": -0.0022794,
      "cpi": 331.376
    },
    {
      "year": 2004,
      "month": 1,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3732
    },
    {
      "year": 2004,
      "month": 2,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3703
    },
    {
      "year": 2004,
      "month": 3,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3675
    },
    {
      "year": 2004,
      "month": 4,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3646
    },
    {
      "year": 2004,
      "month": 5,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3618
    },
    {
      "year": 2004,
      "month": 6,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.359
    },
    {
      "year": 2004,
      "month": 7,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3561
    },
    {
      "year": 2004,
      "month": 8,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3533
    },
    {
      "year": 2004,
      "month": 9,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3504
    },
    {
      "year": 2004,
      "month": 10,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3476
    },
    {
      "year": 2004,
      "month": 11,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3447
    },
    {
      "year": 2004,
      "month": 12,
      "equity": 0.0189661,
      "bond": 0.0014585,
      "cpi": 331.3419
    },
    {
      "year": 2005,
      "month": 1,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 331.2637
    },
    {
      "year": 2005,
      "month": 2,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 331.1855
    },
    {
      "year": 2005,
      "month": 3,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 331.1073
    },
    {
      "year": 2005,
      "month": 4,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 331.0291
    },
    {
      "year": 2005,
      "month": 5,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.9509
    },
    {
      "year": 2005,
      "month": 6,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.8728
    },
    {
      "year": 2005,
      "month": 7,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.7947
    },
    {
      "year": 2005,
      "month": 8,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.7166
    },
    {
      "year": 2005,
      "month": 9,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.6385
    },
    {
      "year": 2005,
      "month": 10,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.5604
    },
    {
      "year": 2005,
      "month": 11,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.4824
    },
    {
      "year": 2005,
      "month": 12,
      "equity": 0.0120004,
      "bond": 0.0016513,
      "cpi": 330.4044
    },
    {
      "year": 2006,
      "month": 1,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.4736
    },
    {
      "year": 2006,
      "month": 2,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.5429
    },
    {
      "year": 2006,
      "month": 3,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.6122
    },
    {
      "year": 2006,
      "month": 4,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.6815
    },
    {
      "year": 2006,
      "month": 5,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.7508
    },
    {
      "year": 2006,
      "month": 6,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.8201
    },
    {
      "year": 2006,
      "month": 7,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.8894
    },
    {
      "year": 2006,
      "month": 8,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 330.9587
    },
    {
      "year": 2006,
      "month": 9,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 331.0281
    },
    {
      "year": 2006,
      "month": 10,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 331.0975
    },
    {
      "year": 2006,
      "month": 11,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 331.1669
    },
    {
      "year": 2006,
      "month": 12,
      "equity": 0.0202306,
      "bond": 0.0003735,
      "cpi": 331.2363
    },
    {
      "year": 2007,
      "month": 1,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.2536
    },
    {
      "year": 2007,
      "month": 2,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.271
    },
    {
      "year": 2007,
      "month": 3,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.2883
    },
    {
      "year": 2007,
      "month": 4,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3056
    },
    {
      "year": 2007,
      "month": 5,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3229
    },
    {
      "year": 2007,
      "month": 6,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3403
    },
    {
      "year": 2007,
      "month": 7,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3576
    },
    {
      "year": 2007,
      "month": 8,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3749
    },
    {
      "year": 2007,
      "month": 9,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.3923
    },
    {
      "year": 2007,
      "month": 10,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.4096
    },
    {
      "year": 2007,
      "month": 11,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.4269
    },
    {
      "year": 2007,
      "month": 12,
      "equity": 0.0022114,
      "bond": 0.0031776,
      "cpi": 331.4443
    },
    {
      "year": 2008,
      "month": 1,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 331.8243
    },
    {
      "year": 2008,
      "month": 2,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 332.2047
    },
    {
      "year": 2008,
      "month": 3,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 332.5856
    },
    {
      "year": 2008,
      "month": 4,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 332.9669
    },
    {
      "year": 2008,
      "month": 5,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 333.3487
    },
    {
      "year": 2008,
      "month": 6,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 333.7308
    },
    {
      "year": 2008,
      "month": 7,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 334.1135
    },
    {
      "year": 2008,
      "month": 8,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 334.4965
    },
    {
      "year": 2008,
      "month": 9,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 334.88
    },
    {
      "year": 2008,
      "month": 10,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 335.264
    },
    {
      "year": 2008,
      "month": 11,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 335.6483
    },
    {
      "year": 2008,
      "month": 12,
      "equity": -0.0262714,
      "bond": 0.0044562,
      "cpi": 336.0332
    },
    {
      "year": 2009,
      "month": 1,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 335.653
    },
    {
      "year": 2009,
      "month": 2,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 335.2732
    },
    {
      "year": 2009,
      "month": 3,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 334.8938
    },
    {
      "year": 2009,
      "month": 4,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 334.5149
    },
    {
      "year": 2009,
      "month": 5,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 334.1364
    },
    {
      "year": 2009,
      "month": 6,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 333.7583
    },
    {
      "year": 2009,
      "month": 7,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 333.3807
    },
    {
      "year": 2009,
      "month": 8,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 333.0035
    },
    {
      "year": 2009,
      "month": 9,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 332.6267
    },
    {
      "year": 2009,
      "month": 10,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 332.2503
    },
    {
      "year": 2009,
      "month": 11,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 331.8744
    },
    {
      "year": 2009,
      "month": 12,
      "equity": -0.0236799,
      "bond": 0.0008029,
      "cpi": 331.4989
    },
    {
      "year": 2010,
      "month": 1,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 331.2988
    },
    {
      "year": 2010,
      "month": 2,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 331.0988
    },
    {
      "year": 2010,
      "month": 3,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 330.8989
    },
    {
      "year": 2010,
      "month": 4,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 330.6992
    },
    {
      "year": 2010,
      "month": 5,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 330.4996
    },
    {
      "year": 2010,
      "month": 6,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 330.3001
    },
    {
      "year": 2010,
      "month": 7,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 330.1007
    },
    {
      "year": 2010,
      "month": 8,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 329.9014
    },
    {
      "year": 2010,
      "month": 9,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 329.7023
    },
    {
      "year": 2010,
      "month": 10,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 329.5033
    },
    {
      "year": 2010,
      "month": 11,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 329.3044
    },
    {
      "year": 2010,
      "month": 12,
      "equity": 0.003093,
      "bond": 0.003208,
      "cpi": 329.1056
    },
    {
      "year": 2011,
      "month": 1,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 329.0308
    },
    {
      "year": 2011,
      "month": 2,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.956
    },
    {
      "year": 2011,
      "month": 3,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.8812
    },
    {
      "year": 2011,
      "month": 4,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.8065
    },
    {
      "year": 2011,
      "month": 5,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.7317
    },
    {
      "year": 2011,
      "month": 6,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.657
    },
    {
      "year": 2011,
      "month": 7,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.5823
    },
    {
      "year": 2011,
      "month": 8,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.5076
    },
    {
      "year": 2011,
      "month": 9,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.4329
    },
    {
      "year": 2011,
      "month": 10,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.3582
    },
    {
      "year": 2011,
      "month": 11,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.2836
    },
    {
      "year": 2011,
      "month": 12,
      "equity": -0.0041119,
      "bond": 0.002814,
      "cpi": 328.209
    },
    {
      "year": 2012,
      "month": 1,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1937
    },
    {
      "year": 2012,
      "month": 2,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1783
    },
    {
      "year": 2012,
      "month": 3,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.163
    },
    {
      "year": 2012,
      "month": 4,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1476
    },
    {
      "year": 2012,
      "month": 5,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1323
    },
    {
      "year": 2012,
      "month": 6,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1169
    },
    {
      "year": 2012,
      "month": 7,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.1016
    },
    {
      "year": 2012,
      "month": 8,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.0863
    },
    {
      "year": 2012,
      "month": 9,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.0709
    },
    {
      "year": 2012,
      "month": 10,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.0556
    },
    {
      "year": 2012,
      "month": 11,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.0402
    },
    {
      "year": 2012,
      "month": 12,
      "equity": -0.0037118,
      "bond": 0.0029635,
      "cpi": 328.0249
    },
    {
      "year": 2013,
      "month": 1,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.1185
    },
    {
      "year": 2013,
      "month": 2,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.2121
    },
    {
      "year": 2013,
      "month": 3,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.3058
    },
    {
      "year": 2013,
      "month": 4,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.3995
    },
    {
      "year": 2013,
      "month": 5,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.4932
    },
    {
      "year": 2013,
      "month": 6,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.5869
    },
    {
      "year": 2013,
      "month": 7,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.6807
    },
    {
      "year": 2013,
      "month": 8,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.7745
    },
    {
      "year": 2013,
      "month": 9,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.8683
    },
    {
      "year": 2013,
      "month": 10,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 328.9622
    },
    {
      "year": 2013,
      "month": 11,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 329.0561
    },
    {
      "year": 2013,
      "month": 12,
      "equity": 0.0463157,
      "bond": 0.0014011,
      "cpi": 329.15
    },
    {
      "year": 2014,
      "month": 1,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 329.898
    },
    {
      "year": 2014,
      "month": 2,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 330.6477
    },
    {
      "year": 2014,
      "month": 3,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 331.3991
    },
    {
      "year": 2014,
      "month": 4,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 332.1522
    },
    {
      "year": 2014,
      "month": 5,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 332.9071
    },
    {
      "year": 2014,
      "month": 6,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 333.6636
    },
    {
      "year": 2014,
      "month": 7,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 334.4219
    },
    {
      "year": 2014,
      "month": 8,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 335.1818
    },
    {
      "year": 2014,
      "month": 9,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 335.9435
    },
    {
      "year": 2014,
      "month": 10,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 336.707
    },
    {
      "year": 2014,
      "month": 11,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 337.4722
    },
    {
      "year": 2014,
      "month": 12,
      "equity": 0.008268,
      "bond": 0.0043675,
      "cpi": 338.2391
    },
    {
      "year": 2015,
      "month": 1,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 338.4616
    },
    {
      "year": 2015,
      "month": 2,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 338.6842
    },
    {
      "year": 2015,
      "month": 3,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 338.907
    },
    {
      "year": 2015,
      "month": 4,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 339.13
    },
    {
      "year": 2015,
      "month": 5,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 339.3531
    },
    {
      "year": 2015,
      "month": 6,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 339.5763
    },
    {
      "year": 2015,
      "month": 7,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 339.7997
    },
    {
      "year": 2015,
      "month": 8,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 340.0232
    },
    {
      "year": 2015,
      "month": 9,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 340.2469
    },
    {
      "year": 2015,
      "month": 10,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 340.4707
    },
    {
      "year": 2015,
      "month": 11,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 340.6947
    },
    {
      "year": 2015,
      "month": 12,
      "equity": 0.00886,
      "bond": 0.0014725,
      "cpi": 340.9188
    },
    {
      "year": 2016,
      "month": 1,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.8864
    },
    {
      "year": 2016,
      "month": 2,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.854
    },
    {
      "year": 2016,
      "month": 3,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.8216
    },
    {
      "year": 2016,
      "month": 4,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.7892
    },
    {
      "year": 2016,
      "month": 5,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.7568
    },
    {
      "year": 2016,
      "month": 6,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.7244
    },
    {
      "year": 2016,
      "month": 7,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.692
    },
    {
      "year": 2016,
      "month": 8,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.6596
    },
    {
      "year": 2016,
      "month": 9,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.6273
    },
    {
      "year": 2016,
      "month": 10,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.5949
    },
    {
      "year": 2016,
      "month": 11,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.5625
    },
    {
      "year": 2016,
      "month": 12,
      "equity": 0.0004323,
      "bond": 0.0126393,
      "cpi": 340.5301
    },
    {
      "year": 2017,
      "month": 1,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 340.6678
    },
    {
      "year": 2017,
      "month": 2,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 340.8055
    },
    {
      "year": 2017,
      "month": 3,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 340.9433
    },
    {
      "year": 2017,
      "month": 4,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.0811
    },
    {
      "year": 2017,
      "month": 5,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.219
    },
    {
      "year": 2017,
      "month": 6,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.357
    },
    {
      "year": 2017,
      "month": 7,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.495
    },
    {
      "year": 2017,
      "month": 8,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.633
    },
    {
      "year": 2017,
      "month": 9,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.7712
    },
    {
      "year": 2017,
      "month": 10,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 341.9093
    },
    {
      "year": 2017,
      "month": 11,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 342.0476
    },
    {
      "year": 2017,
      "month": 12,
      "equity": 0.0166673,
      "bond": -7.42e-05,
      "cpi": 342.1859
    },
    {
      "year": 2018,
      "month": 1,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 342.4667
    },
    {
      "year": 2018,
      "month": 2,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 342.7477
    },
    {
      "year": 2018,
      "month": 3,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 343.0289
    },
    {
      "year": 2018,
      "month": 4,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 343.3103
    },
    {
      "year": 2018,
      "month": 5,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 343.592
    },
    {
      "year": 2018,
      "month": 6,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 343.8739
    },
    {
      "year": 2018,
      "month": 7,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 344.1561
    },
    {
      "year": 2018,
      "month": 8,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 344.4385
    },
    {
      "year": 2018,
      "month": 9,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 344.7211
    },
    {
      "year": 2018,
      "month": 10,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 345.0039
    },
    {
      "year": 2018,
      "month": 11,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 345.287
    },
    {
      "year": 2018,
      "month": 12,
      "equity": -0.0136165,
      "bond": 0.0027488,
      "cpi": 345.5703
    },
    {
      "year": 2019,
      "month": 1,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 345.7048
    },
    {
      "year": 2019,
      "month": 2,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 345.8394
    },
    {
      "year": 2019,
      "month": 3,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 345.974
    },
    {
      "year": 2019,
      "month": 4,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.1087
    },
    {
      "year": 2019,
      "month": 5,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.2434
    },
    {
      "year": 2019,
      "month": 6,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.3781
    },
    {
      "year": 2019,
      "month": 7,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.513
    },
    {
      "year": 2019,
      "month": 8,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.6478
    },
    {
      "year": 2019,
      "month": 9,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.7828
    },
    {
      "year": 2019,
      "month": 10,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 346.9178
    },
    {
      "year": 2019,
      "month": 11,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 347.0528
    },
    {
      "year": 2019,
      "month": 12,
      "equity": 0.0142315,
      "bond": 0.0038031,
      "cpi": 347.1879
    },
    {
      "year": 2020,
      "month": 1,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1801
    },
    {
      "year": 2020,
      "month": 2,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1723
    },
    {
      "year": 2020,
      "month": 3,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1645
    },
    {
      "year": 2020,
      "month": 4,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1567
    },
    {
      "year": 2020,
      "month": 5,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1488
    },
    {
      "year": 2020,
      "month": 6,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.141
    },
    {
      "year": 2020,
      "month": 7,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1332
    },
    {
      "year": 2020,
      "month": 8,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1254
    },
    {
      "year": 2020,
      "month": 9,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1176
    },
    {
      "year": 2020,
      "month": 10,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.1098
    },
    {
      "year": 2020,
      "month": 11,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.102
    },
    {
      "year": 2020,
      "month": 12,
      "equity": 0.0063019,
      "bond": 0.0003696,
      "cpi": 347.0942
    },
    {
      "year": 2021,
      "month": 1,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 347.0276
    },
    {
      "year": 2021,
      "month": 2,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.961
    },
    {
      "year": 2021,
      "month": 3,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.8944
    },
    {
      "year": 2021,
      "month": 4,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.8279
    },
    {
      "year": 2021,
      "month": 5,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.7613
    },
    {
      "year": 2021,
      "month": 6,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.6948
    },
    {
      "year": 2021,
      "month": 7,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.6283
    },
    {
      "year": 2021,
      "month": 8,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.5618
    },
    {
      "year": 2021,
      "month": 9,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.4953
    },
    {
      "year": 2021,
      "month": 10,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.4288
    },
    {
      "year": 2021,
      "month": 11,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.3623
    },
    {
      "year": 2021,
      "month": 12,
      "equity": 0.0040024,
      "bond": -0.0002754,
      "cpi": 346.2959
    },
    {
      "year": 2022,
      "month": 1,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 347.0092
    },
    {
      "year": 2022,
      "month": 2,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 347.724
    },
    {
      "year": 2022,
      "month": 3,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 348.4402
    },
    {
      "year": 2022,
      "month": 4,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 349.158
    },
    {
      "year": 2022,
      "month": 5,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 349.8772
    },
    {
      "year": 2022,
      "month": 6,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 350.5979
    },
    {
      "year": 2022,
      "month": 7,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 351.3201
    },
    {
      "year": 2022,
      "month": 8,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 352.0437
    },
    {
      "year": 2022,
      "month": 9,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 352.7689
    },
    {
      "year": 2022,
      "month": 10,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 353.4955
    },
    {
      "year": 2022,
      "month": 11,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 354.2237
    },
    {
      "year": 2022,
      "month": 12,
      "equity": -0.0081652,
      "bond": -0.0020053,
      "cpi": 354.9533
    },
    {
      "year": 2023,
      "month": 1,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 355.9063
    },
    {
      "year": 2023,
      "month": 2,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 356.862
    },
    {
      "year": 2023,
      "month": 3,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 357.8201
    },
    {
      "year": 2023,
      "month": 4,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 358.7809
    },
    {
      "year": 2023,
      "month": 5,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 359.7442
    },
    {
      "year": 2023,
      "month": 6,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 360.7101
    },
    {
      "year": 2023,
      "month": 7,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 361.6786
    },
    {
      "year": 2023,
      "month": 8,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 362.6497
    },
    {
      "year": 2023,
      "month": 9,
      "equity": 0.0209441,
      "bond": -0.0007615,
      "cpi": 363.6234
    }
  ]
};
