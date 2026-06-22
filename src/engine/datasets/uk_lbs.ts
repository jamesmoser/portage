import { HistoricalDataset } from '../types'

export const dataset: HistoricalDataset = {
  "id": "uk_lbs",
  "name": "United Kingdom LBS",
  "shortName": "UK LBS",
  "geographicFocus": "United Kingdom",
  "flag": "\ud83c\uddec\ud83c\udde7",
  "startYear": 1900,
  "endYear": 2023,
  "resolution": "monthly",
  "description": "UK historical equities total returns (FTSE), UK Gilts, and UK CPI inflation.",
  "limitations": [
    "Includes extreme 1970s stagflation stress periods.",
    "FTSE indices pre-1984 are proxied from historical estimates."
  ],
  "eras": [
    {
      "year": 1920,
      "month": 1,
      "label": "Post-WWI Debt Drag",
      "description": "UK debt service burden and economic stagnation."
    },
    {
      "year": 1929,
      "month": 9,
      "label": "Great Depression",
      "description": "Industrial decline and trade contraction."
    },
    {
      "year": 1945,
      "month": 9,
      "label": "Post-War Austerity",
      "description": "Reconstruction and nationalization."
    },
    {
      "year": 1974,
      "month": 1,
      "label": "Stagflation Crisis",
      "description": "UK inflation peaks above 25% with secondary market crisis."
    },
    {
      "year": 2008,
      "month": 1,
      "label": "Great Financial Crisis",
      "description": "UK banking sector nationalization and recession."
    }
  ],
  "epochs": [
    {
      "year": 1900,
      "label": "1900\u20132023 (Full History)"
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
      "year": 1900,
      "month": 1,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.0415
    },
    {
      "year": 1900,
      "month": 2,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.0832
    },
    {
      "year": 1900,
      "month": 3,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.1251
    },
    {
      "year": 1900,
      "month": 4,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.1672
    },
    {
      "year": 1900,
      "month": 5,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.2094
    },
    {
      "year": 1900,
      "month": 6,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.2518
    },
    {
      "year": 1900,
      "month": 7,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.2944
    },
    {
      "year": 1900,
      "month": 8,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.3372
    },
    {
      "year": 1900,
      "month": 9,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.3801
    },
    {
      "year": 1900,
      "month": 10,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.4232
    },
    {
      "year": 1900,
      "month": 11,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.4665
    },
    {
      "year": 1900,
      "month": 12,
      "equity": 0.0075609,
      "bond": -0.0003633,
      "cpi": 10.51
    },
    {
      "year": 1901,
      "month": 1,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5144
    },
    {
      "year": 1901,
      "month": 2,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5187
    },
    {
      "year": 1901,
      "month": 3,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5231
    },
    {
      "year": 1901,
      "month": 4,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5275
    },
    {
      "year": 1901,
      "month": 5,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5319
    },
    {
      "year": 1901,
      "month": 6,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5362
    },
    {
      "year": 1901,
      "month": 7,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5406
    },
    {
      "year": 1901,
      "month": 8,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.545
    },
    {
      "year": 1901,
      "month": 9,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5494
    },
    {
      "year": 1901,
      "month": 10,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5538
    },
    {
      "year": 1901,
      "month": 11,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5582
    },
    {
      "year": 1901,
      "month": 12,
      "equity": 0.0040024,
      "bond": -0.0013471,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 1,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 2,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 3,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 4,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 5,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 6,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 7,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 8,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 9,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 10,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 11,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1902,
      "month": 12,
      "equity": 0.0047806,
      "bond": 0.0016095,
      "cpi": 10.5626
    },
    {
      "year": 1903,
      "month": 1,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5661
    },
    {
      "year": 1903,
      "month": 2,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5696
    },
    {
      "year": 1903,
      "month": 3,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5731
    },
    {
      "year": 1903,
      "month": 4,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5767
    },
    {
      "year": 1903,
      "month": 5,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5802
    },
    {
      "year": 1903,
      "month": 6,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5837
    },
    {
      "year": 1903,
      "month": 7,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5872
    },
    {
      "year": 1903,
      "month": 8,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5907
    },
    {
      "year": 1903,
      "month": 9,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5943
    },
    {
      "year": 1903,
      "month": 10,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.5978
    },
    {
      "year": 1903,
      "month": 11,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.6013
    },
    {
      "year": 1903,
      "month": 12,
      "equity": 0.0013811,
      "bond": -0.0023322,
      "cpi": 10.6049
    },
    {
      "year": 1904,
      "month": 1,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.6031
    },
    {
      "year": 1904,
      "month": 2,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.6014
    },
    {
      "year": 1904,
      "month": 3,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5996
    },
    {
      "year": 1904,
      "month": 4,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5978
    },
    {
      "year": 1904,
      "month": 5,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5961
    },
    {
      "year": 1904,
      "month": 6,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5943
    },
    {
      "year": 1904,
      "month": 7,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5925
    },
    {
      "year": 1904,
      "month": 8,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5908
    },
    {
      "year": 1904,
      "month": 9,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.589
    },
    {
      "year": 1904,
      "month": 10,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5872
    },
    {
      "year": 1904,
      "month": 11,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5855
    },
    {
      "year": 1904,
      "month": 12,
      "equity": 0.0088254,
      "bond": 0.0033908,
      "cpi": 10.5837
    },
    {
      "year": 1905,
      "month": 1,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.5872
    },
    {
      "year": 1905,
      "month": 2,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.5907
    },
    {
      "year": 1905,
      "month": 3,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.5943
    },
    {
      "year": 1905,
      "month": 4,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.5978
    },
    {
      "year": 1905,
      "month": 5,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6013
    },
    {
      "year": 1905,
      "month": 6,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6048
    },
    {
      "year": 1905,
      "month": 7,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6084
    },
    {
      "year": 1905,
      "month": 8,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6119
    },
    {
      "year": 1905,
      "month": 9,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6154
    },
    {
      "year": 1905,
      "month": 10,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.619
    },
    {
      "year": 1905,
      "month": 11,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.6225
    },
    {
      "year": 1905,
      "month": 12,
      "equity": 0.0086891,
      "bond": 0.0029379,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 1,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 2,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 3,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 4,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 5,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 6,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 7,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 8,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 9,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 10,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 11,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1906,
      "month": 12,
      "equity": 0.0076912,
      "bond": -0.0009083,
      "cpi": 10.626
    },
    {
      "year": 1907,
      "month": 1,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6366
    },
    {
      "year": 1907,
      "month": 2,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6471
    },
    {
      "year": 1907,
      "month": 3,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6577
    },
    {
      "year": 1907,
      "month": 4,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6683
    },
    {
      "year": 1907,
      "month": 5,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6789
    },
    {
      "year": 1907,
      "month": 6,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.6896
    },
    {
      "year": 1907,
      "month": 7,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7002
    },
    {
      "year": 1907,
      "month": 8,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7108
    },
    {
      "year": 1907,
      "month": 9,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7215
    },
    {
      "year": 1907,
      "month": 10,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7322
    },
    {
      "year": 1907,
      "month": 11,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7428
    },
    {
      "year": 1907,
      "month": 12,
      "equity": -0.0001334,
      "bond": 1.1e-05,
      "cpi": 10.7535
    },
    {
      "year": 1908,
      "month": 1,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.758
    },
    {
      "year": 1908,
      "month": 2,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7624
    },
    {
      "year": 1908,
      "month": 3,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7669
    },
    {
      "year": 1908,
      "month": 4,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7714
    },
    {
      "year": 1908,
      "month": 5,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7759
    },
    {
      "year": 1908,
      "month": 6,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7804
    },
    {
      "year": 1908,
      "month": 7,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7848
    },
    {
      "year": 1908,
      "month": 8,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7893
    },
    {
      "year": 1908,
      "month": 9,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7938
    },
    {
      "year": 1908,
      "month": 10,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.7983
    },
    {
      "year": 1908,
      "month": 11,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.8028
    },
    {
      "year": 1908,
      "month": 12,
      "equity": 0.0037294,
      "bond": 0.0029472,
      "cpi": 10.8073
    },
    {
      "year": 1909,
      "month": 1,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8118
    },
    {
      "year": 1909,
      "month": 2,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8163
    },
    {
      "year": 1909,
      "month": 3,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8208
    },
    {
      "year": 1909,
      "month": 4,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8253
    },
    {
      "year": 1909,
      "month": 5,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8298
    },
    {
      "year": 1909,
      "month": 6,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8343
    },
    {
      "year": 1909,
      "month": 7,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8388
    },
    {
      "year": 1909,
      "month": 8,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8433
    },
    {
      "year": 1909,
      "month": 9,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8478
    },
    {
      "year": 1909,
      "month": 10,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8523
    },
    {
      "year": 1909,
      "month": 11,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8568
    },
    {
      "year": 1909,
      "month": 12,
      "equity": 0.0087802,
      "bond": 0.0015025,
      "cpi": 10.8613
    },
    {
      "year": 1910,
      "month": 1,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.8694
    },
    {
      "year": 1910,
      "month": 2,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.8775
    },
    {
      "year": 1910,
      "month": 3,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.8857
    },
    {
      "year": 1910,
      "month": 4,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.8938
    },
    {
      "year": 1910,
      "month": 5,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9019
    },
    {
      "year": 1910,
      "month": 6,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9101
    },
    {
      "year": 1910,
      "month": 7,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9182
    },
    {
      "year": 1910,
      "month": 8,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9264
    },
    {
      "year": 1910,
      "month": 9,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9345
    },
    {
      "year": 1910,
      "month": 10,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9427
    },
    {
      "year": 1910,
      "month": 11,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9509
    },
    {
      "year": 1910,
      "month": 12,
      "equity": 0.0012265,
      "bond": -0.0010951,
      "cpi": 10.9591
    },
    {
      "year": 1911,
      "month": 1,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.96
    },
    {
      "year": 1911,
      "month": 2,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9609
    },
    {
      "year": 1911,
      "month": 3,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9618
    },
    {
      "year": 1911,
      "month": 4,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9628
    },
    {
      "year": 1911,
      "month": 5,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9637
    },
    {
      "year": 1911,
      "month": 6,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9646
    },
    {
      "year": 1911,
      "month": 7,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9655
    },
    {
      "year": 1911,
      "month": 8,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9664
    },
    {
      "year": 1911,
      "month": 9,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9673
    },
    {
      "year": 1911,
      "month": 10,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9682
    },
    {
      "year": 1911,
      "month": 11,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9691
    },
    {
      "year": 1911,
      "month": 12,
      "equity": 0.0013266,
      "bond": 0.0001873,
      "cpi": 10.9701
    },
    {
      "year": 1912,
      "month": 1,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 10.9972
    },
    {
      "year": 1912,
      "month": 2,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.0243
    },
    {
      "year": 1912,
      "month": 3,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.0515
    },
    {
      "year": 1912,
      "month": 4,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.0787
    },
    {
      "year": 1912,
      "month": 5,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.106
    },
    {
      "year": 1912,
      "month": 6,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.1334
    },
    {
      "year": 1912,
      "month": 7,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.1609
    },
    {
      "year": 1912,
      "month": 8,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.1884
    },
    {
      "year": 1912,
      "month": 9,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.216
    },
    {
      "year": 1912,
      "month": 10,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.2437
    },
    {
      "year": 1912,
      "month": 11,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.2714
    },
    {
      "year": 1912,
      "month": 12,
      "equity": 0.0028242,
      "bond": 0.0006267,
      "cpi": 11.2992
    },
    {
      "year": 1913,
      "month": 1,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2954
    },
    {
      "year": 1913,
      "month": 2,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2917
    },
    {
      "year": 1913,
      "month": 3,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2879
    },
    {
      "year": 1913,
      "month": 4,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2841
    },
    {
      "year": 1913,
      "month": 5,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2803
    },
    {
      "year": 1913,
      "month": 6,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2766
    },
    {
      "year": 1913,
      "month": 7,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2728
    },
    {
      "year": 1913,
      "month": 8,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.269
    },
    {
      "year": 1913,
      "month": 9,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2653
    },
    {
      "year": 1913,
      "month": 10,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2615
    },
    {
      "year": 1913,
      "month": 11,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.2578
    },
    {
      "year": 1913,
      "month": 12,
      "equity": -0.00322,
      "bond": -0.0011045,
      "cpi": 11.254
    },
    {
      "year": 1914,
      "month": 1,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2512
    },
    {
      "year": 1914,
      "month": 2,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2484
    },
    {
      "year": 1914,
      "month": 3,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2455
    },
    {
      "year": 1914,
      "month": 4,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2427
    },
    {
      "year": 1914,
      "month": 5,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2399
    },
    {
      "year": 1914,
      "month": 6,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2371
    },
    {
      "year": 1914,
      "month": 7,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2343
    },
    {
      "year": 1914,
      "month": 8,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2315
    },
    {
      "year": 1914,
      "month": 9,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2287
    },
    {
      "year": 1914,
      "month": 10,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2259
    },
    {
      "year": 1914,
      "month": 11,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.223
    },
    {
      "year": 1914,
      "month": 12,
      "equity": -5.33e-05,
      "bond": 0.0036493,
      "cpi": 11.2202
    },
    {
      "year": 1915,
      "month": 1,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.3309
    },
    {
      "year": 1915,
      "month": 2,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.4426
    },
    {
      "year": 1915,
      "month": 3,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.5555
    },
    {
      "year": 1915,
      "month": 4,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.6695
    },
    {
      "year": 1915,
      "month": 5,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.7846
    },
    {
      "year": 1915,
      "month": 6,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 11.9008
    },
    {
      "year": 1915,
      "month": 7,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.0182
    },
    {
      "year": 1915,
      "month": 8,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.1367
    },
    {
      "year": 1915,
      "month": 9,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.2565
    },
    {
      "year": 1915,
      "month": 10,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.3774
    },
    {
      "year": 1915,
      "month": 11,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.4994
    },
    {
      "year": 1915,
      "month": 12,
      "equity": 0.0021413,
      "bond": 0.0027901,
      "cpi": 12.6227
    },
    {
      "year": 1916,
      "month": 1,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 12.7989
    },
    {
      "year": 1916,
      "month": 2,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 12.9776
    },
    {
      "year": 1916,
      "month": 3,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 13.1588
    },
    {
      "year": 1916,
      "month": 4,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 13.3424
    },
    {
      "year": 1916,
      "month": 5,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 13.5287
    },
    {
      "year": 1916,
      "month": 6,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 13.7176
    },
    {
      "year": 1916,
      "month": 7,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 13.9091
    },
    {
      "year": 1916,
      "month": 8,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 14.1032
    },
    {
      "year": 1916,
      "month": 9,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 14.3001
    },
    {
      "year": 1916,
      "month": 10,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 14.4997
    },
    {
      "year": 1916,
      "month": 11,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 14.7022
    },
    {
      "year": 1916,
      "month": 12,
      "equity": -0.0020827,
      "bond": -0.0187293,
      "cpi": 14.9074
    },
    {
      "year": 1917,
      "month": 1,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 15.1892
    },
    {
      "year": 1917,
      "month": 2,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 15.4764
    },
    {
      "year": 1917,
      "month": 3,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 15.769
    },
    {
      "year": 1917,
      "month": 4,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 16.0671
    },
    {
      "year": 1917,
      "month": 5,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 16.3708
    },
    {
      "year": 1917,
      "month": 6,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 16.6803
    },
    {
      "year": 1917,
      "month": 7,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 16.9956
    },
    {
      "year": 1917,
      "month": 8,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 17.317
    },
    {
      "year": 1917,
      "month": 9,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 17.6443
    },
    {
      "year": 1917,
      "month": 10,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 17.9779
    },
    {
      "year": 1917,
      "month": 11,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 18.3178
    },
    {
      "year": 1917,
      "month": 12,
      "equity": 0.0075993,
      "bond": 0.0025179,
      "cpi": 18.6641
    },
    {
      "year": 1918,
      "month": 1,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 18.976
    },
    {
      "year": 1918,
      "month": 2,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 19.293
    },
    {
      "year": 1918,
      "month": 3,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 19.6154
    },
    {
      "year": 1918,
      "month": 4,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 19.9431
    },
    {
      "year": 1918,
      "month": 5,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 20.2764
    },
    {
      "year": 1918,
      "month": 6,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 20.6152
    },
    {
      "year": 1918,
      "month": 7,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 20.9596
    },
    {
      "year": 1918,
      "month": 8,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 21.3098
    },
    {
      "year": 1918,
      "month": 9,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 21.6659
    },
    {
      "year": 1918,
      "month": 10,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 22.0279
    },
    {
      "year": 1918,
      "month": 11,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 22.396
    },
    {
      "year": 1918,
      "month": 12,
      "equity": 0.0158537,
      "bond": 0.0100853,
      "cpi": 22.7702
    },
    {
      "year": 1919,
      "month": 1,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 22.9535
    },
    {
      "year": 1919,
      "month": 2,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 23.1383
    },
    {
      "year": 1919,
      "month": 3,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 23.3246
    },
    {
      "year": 1919,
      "month": 4,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 23.5123
    },
    {
      "year": 1919,
      "month": 5,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 23.7016
    },
    {
      "year": 1919,
      "month": 6,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 23.8924
    },
    {
      "year": 1919,
      "month": 7,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 24.0848
    },
    {
      "year": 1919,
      "month": 8,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 24.2787
    },
    {
      "year": 1919,
      "month": 9,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 24.4741
    },
    {
      "year": 1919,
      "month": 10,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 24.6712
    },
    {
      "year": 1919,
      "month": 11,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 24.8698
    },
    {
      "year": 1919,
      "month": 12,
      "equity": 0.0076341,
      "bond": -0.0073086,
      "cpi": 25.07
    },
    {
      "year": 1920,
      "month": 1,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 25.371
    },
    {
      "year": 1920,
      "month": 2,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 25.6757
    },
    {
      "year": 1920,
      "month": 3,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 25.984
    },
    {
      "year": 1920,
      "month": 4,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 26.296
    },
    {
      "year": 1920,
      "month": 5,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 26.6117
    },
    {
      "year": 1920,
      "month": 6,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 26.9313
    },
    {
      "year": 1920,
      "month": 7,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 27.2547
    },
    {
      "year": 1920,
      "month": 8,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 27.5819
    },
    {
      "year": 1920,
      "month": 9,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 27.9131
    },
    {
      "year": 1920,
      "month": 10,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 28.2483
    },
    {
      "year": 1920,
      "month": 11,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 28.5875
    },
    {
      "year": 1920,
      "month": 12,
      "equity": -0.0198039,
      "bond": -0.0063315,
      "cpi": 28.9308
    },
    {
      "year": 1921,
      "month": 1,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 28.7148
    },
    {
      "year": 1921,
      "month": 2,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 28.5004
    },
    {
      "year": 1921,
      "month": 3,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 28.2877
    },
    {
      "year": 1921,
      "month": 4,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 28.0765
    },
    {
      "year": 1921,
      "month": 5,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 27.8669
    },
    {
      "year": 1921,
      "month": 6,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 27.6588
    },
    {
      "year": 1921,
      "month": 7,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 27.4523
    },
    {
      "year": 1921,
      "month": 8,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 27.2474
    },
    {
      "year": 1921,
      "month": 9,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 27.0439
    },
    {
      "year": 1921,
      "month": 10,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 26.842
    },
    {
      "year": 1921,
      "month": 11,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 26.6417
    },
    {
      "year": 1921,
      "month": 12,
      "equity": -0.0006223,
      "bond": 0.0127827,
      "cpi": 26.4428
    },
    {
      "year": 1922,
      "month": 1,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 26.1125
    },
    {
      "year": 1922,
      "month": 2,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 25.7864
    },
    {
      "year": 1922,
      "month": 3,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 25.4643
    },
    {
      "year": 1922,
      "month": 4,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 25.1463
    },
    {
      "year": 1922,
      "month": 5,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 24.8322
    },
    {
      "year": 1922,
      "month": 6,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 24.522
    },
    {
      "year": 1922,
      "month": 7,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 24.2158
    },
    {
      "year": 1922,
      "month": 8,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 23.9133
    },
    {
      "year": 1922,
      "month": 9,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 23.6146
    },
    {
      "year": 1922,
      "month": 10,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 23.3197
    },
    {
      "year": 1922,
      "month": 11,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 23.0284
    },
    {
      "year": 1922,
      "month": 12,
      "equity": 0.0196076,
      "bond": 0.0124213,
      "cpi": 22.7408
    },
    {
      "year": 1923,
      "month": 1,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.6238
    },
    {
      "year": 1923,
      "month": 2,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.5075
    },
    {
      "year": 1923,
      "month": 3,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.3917
    },
    {
      "year": 1923,
      "month": 4,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.2766
    },
    {
      "year": 1923,
      "month": 5,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.162
    },
    {
      "year": 1923,
      "month": 6,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 22.048
    },
    {
      "year": 1923,
      "month": 7,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.9346
    },
    {
      "year": 1923,
      "month": 8,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.8218
    },
    {
      "year": 1923,
      "month": 9,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.7096
    },
    {
      "year": 1923,
      "month": 10,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.5979
    },
    {
      "year": 1923,
      "month": 11,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.4869
    },
    {
      "year": 1923,
      "month": 12,
      "equity": 0.0007573,
      "bond": 0.0034521,
      "cpi": 21.3764
    },
    {
      "year": 1924,
      "month": 1,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3639
    },
    {
      "year": 1924,
      "month": 2,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3514
    },
    {
      "year": 1924,
      "month": 3,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3389
    },
    {
      "year": 1924,
      "month": 4,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3264
    },
    {
      "year": 1924,
      "month": 5,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3139
    },
    {
      "year": 1924,
      "month": 6,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.3015
    },
    {
      "year": 1924,
      "month": 7,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.289
    },
    {
      "year": 1924,
      "month": 8,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.2765
    },
    {
      "year": 1924,
      "month": 9,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.2641
    },
    {
      "year": 1924,
      "month": 10,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.2516
    },
    {
      "year": 1924,
      "month": 11,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.2392
    },
    {
      "year": 1924,
      "month": 12,
      "equity": 0.0154305,
      "bond": 0.0059295,
      "cpi": 21.2268
    },
    {
      "year": 1925,
      "month": 1,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2321
    },
    {
      "year": 1925,
      "month": 2,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2374
    },
    {
      "year": 1925,
      "month": 3,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2427
    },
    {
      "year": 1925,
      "month": 4,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.248
    },
    {
      "year": 1925,
      "month": 5,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2533
    },
    {
      "year": 1925,
      "month": 6,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2586
    },
    {
      "year": 1925,
      "month": 7,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2639
    },
    {
      "year": 1925,
      "month": 8,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2692
    },
    {
      "year": 1925,
      "month": 9,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2745
    },
    {
      "year": 1925,
      "month": 10,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2799
    },
    {
      "year": 1925,
      "month": 11,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2852
    },
    {
      "year": 1925,
      "month": 12,
      "equity": 0.0118055,
      "bond": 0.0002612,
      "cpi": 21.2905
    },
    {
      "year": 1926,
      "month": 1,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.2763
    },
    {
      "year": 1926,
      "month": 2,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.262
    },
    {
      "year": 1926,
      "month": 3,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.2478
    },
    {
      "year": 1926,
      "month": 4,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.2336
    },
    {
      "year": 1926,
      "month": 5,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.2194
    },
    {
      "year": 1926,
      "month": 6,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.2052
    },
    {
      "year": 1926,
      "month": 7,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.191
    },
    {
      "year": 1926,
      "month": 8,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.1768
    },
    {
      "year": 1926,
      "month": 9,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.1626
    },
    {
      "year": 1926,
      "month": 10,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.1485
    },
    {
      "year": 1926,
      "month": 11,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.1343
    },
    {
      "year": 1926,
      "month": 12,
      "equity": 0.0053336,
      "bond": 0.0023652,
      "cpi": 21.1202
    },
    {
      "year": 1927,
      "month": 1,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 21.0775
    },
    {
      "year": 1927,
      "month": 2,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 21.0349
    },
    {
      "year": 1927,
      "month": 3,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.9923
    },
    {
      "year": 1927,
      "month": 4,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.9499
    },
    {
      "year": 1927,
      "month": 5,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.9075
    },
    {
      "year": 1927,
      "month": 6,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.8652
    },
    {
      "year": 1927,
      "month": 7,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.823
    },
    {
      "year": 1927,
      "month": 8,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.7809
    },
    {
      "year": 1927,
      "month": 9,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.7389
    },
    {
      "year": 1927,
      "month": 10,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.6969
    },
    {
      "year": 1927,
      "month": 11,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.6551
    },
    {
      "year": 1927,
      "month": 12,
      "equity": 0.0068819,
      "bond": 0.0057863,
      "cpi": 20.6133
    },
    {
      "year": 1928,
      "month": 1,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.6081
    },
    {
      "year": 1928,
      "month": 2,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.603
    },
    {
      "year": 1928,
      "month": 3,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5978
    },
    {
      "year": 1928,
      "month": 4,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5927
    },
    {
      "year": 1928,
      "month": 5,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5875
    },
    {
      "year": 1928,
      "month": 6,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5824
    },
    {
      "year": 1928,
      "month": 7,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5772
    },
    {
      "year": 1928,
      "month": 8,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5721
    },
    {
      "year": 1928,
      "month": 9,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5669
    },
    {
      "year": 1928,
      "month": 10,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5618
    },
    {
      "year": 1928,
      "month": 11,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5566
    },
    {
      "year": 1928,
      "month": 12,
      "equity": 0.0127853,
      "bond": 0.0048131,
      "cpi": 20.5515
    },
    {
      "year": 1929,
      "month": 1,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.536
    },
    {
      "year": 1929,
      "month": 2,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.5206
    },
    {
      "year": 1929,
      "month": 3,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.5051
    },
    {
      "year": 1929,
      "month": 4,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.4897
    },
    {
      "year": 1929,
      "month": 5,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.4742
    },
    {
      "year": 1929,
      "month": 6,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.4588
    },
    {
      "year": 1929,
      "month": 7,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.4434
    },
    {
      "year": 1929,
      "month": 8,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.428
    },
    {
      "year": 1929,
      "month": 9,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.4126
    },
    {
      "year": 1929,
      "month": 10,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.3972
    },
    {
      "year": 1929,
      "month": 11,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.3819
    },
    {
      "year": 1929,
      "month": 12,
      "equity": -0.0127139,
      "bond": -0.0013402,
      "cpi": 20.3665
    },
    {
      "year": 1930,
      "month": 1,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.3184
    },
    {
      "year": 1930,
      "month": 2,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.2703
    },
    {
      "year": 1930,
      "month": 3,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.2224
    },
    {
      "year": 1930,
      "month": 4,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.1746
    },
    {
      "year": 1930,
      "month": 5,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.1269
    },
    {
      "year": 1930,
      "month": 6,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.0793
    },
    {
      "year": 1930,
      "month": 7,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 20.0319
    },
    {
      "year": 1930,
      "month": 8,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 19.9845
    },
    {
      "year": 1930,
      "month": 9,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 19.9373
    },
    {
      "year": 1930,
      "month": 10,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 19.8902
    },
    {
      "year": 1930,
      "month": 11,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 19.8431
    },
    {
      "year": 1930,
      "month": 12,
      "equity": -0.0041433,
      "bond": 0.0103432,
      "cpi": 19.7962
    },
    {
      "year": 1931,
      "month": 1,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.7238
    },
    {
      "year": 1931,
      "month": 2,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.6517
    },
    {
      "year": 1931,
      "month": 3,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.5799
    },
    {
      "year": 1931,
      "month": 4,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.5083
    },
    {
      "year": 1931,
      "month": 5,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.437
    },
    {
      "year": 1931,
      "month": 6,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.3659
    },
    {
      "year": 1931,
      "month": 7,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.2951
    },
    {
      "year": 1931,
      "month": 8,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.2246
    },
    {
      "year": 1931,
      "month": 9,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.1543
    },
    {
      "year": 1931,
      "month": 10,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.0843
    },
    {
      "year": 1931,
      "month": 11,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 19.0145
    },
    {
      "year": 1931,
      "month": 12,
      "equity": -0.0185579,
      "bond": -0.0004547,
      "cpi": 18.945
    },
    {
      "year": 1932,
      "month": 1,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.9035
    },
    {
      "year": 1932,
      "month": 2,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.862
    },
    {
      "year": 1932,
      "month": 3,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.8206
    },
    {
      "year": 1932,
      "month": 4,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.7794
    },
    {
      "year": 1932,
      "month": 5,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.7382
    },
    {
      "year": 1932,
      "month": 6,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.6971
    },
    {
      "year": 1932,
      "month": 7,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.6561
    },
    {
      "year": 1932,
      "month": 8,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.6152
    },
    {
      "year": 1932,
      "month": 9,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.5744
    },
    {
      "year": 1932,
      "month": 10,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.5336
    },
    {
      "year": 1932,
      "month": 11,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.493
    },
    {
      "year": 1932,
      "month": 12,
      "equity": 0.0248345,
      "bond": 0.0286307,
      "cpi": 18.4524
    },
    {
      "year": 1933,
      "month": 1,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.4198
    },
    {
      "year": 1933,
      "month": 2,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.3872
    },
    {
      "year": 1933,
      "month": 3,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.3548
    },
    {
      "year": 1933,
      "month": 4,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.3223
    },
    {
      "year": 1933,
      "month": 5,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.2899
    },
    {
      "year": 1933,
      "month": 6,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.2576
    },
    {
      "year": 1933,
      "month": 7,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.2254
    },
    {
      "year": 1933,
      "month": 8,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.1932
    },
    {
      "year": 1933,
      "month": 9,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.161
    },
    {
      "year": 1933,
      "month": 10,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.1289
    },
    {
      "year": 1933,
      "month": 11,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.0969
    },
    {
      "year": 1933,
      "month": 12,
      "equity": 0.0183671,
      "bond": 0.0026009,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 1,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 2,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 3,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 4,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 5,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 6,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 7,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 8,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 9,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 10,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 11,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1934,
      "month": 12,
      "equity": 0.0110136,
      "bond": 0.020583,
      "cpi": 18.0649
    },
    {
      "year": 1935,
      "month": 1,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.0754
    },
    {
      "year": 1935,
      "month": 2,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.0859
    },
    {
      "year": 1935,
      "month": 3,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.0964
    },
    {
      "year": 1935,
      "month": 4,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.107
    },
    {
      "year": 1935,
      "month": 5,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1175
    },
    {
      "year": 1935,
      "month": 6,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.128
    },
    {
      "year": 1935,
      "month": 7,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1386
    },
    {
      "year": 1935,
      "month": 8,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1491
    },
    {
      "year": 1935,
      "month": 9,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1597
    },
    {
      "year": 1935,
      "month": 10,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1702
    },
    {
      "year": 1935,
      "month": 11,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1808
    },
    {
      "year": 1935,
      "month": 12,
      "equity": 0.0109721,
      "bond": -0.0026371,
      "cpi": 18.1914
    },
    {
      "year": 1936,
      "month": 1,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.202
    },
    {
      "year": 1936,
      "month": 2,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2126
    },
    {
      "year": 1936,
      "month": 3,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2232
    },
    {
      "year": 1936,
      "month": 4,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2337
    },
    {
      "year": 1936,
      "month": 5,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2444
    },
    {
      "year": 1936,
      "month": 6,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.255
    },
    {
      "year": 1936,
      "month": 7,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2656
    },
    {
      "year": 1936,
      "month": 8,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2762
    },
    {
      "year": 1936,
      "month": 9,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2868
    },
    {
      "year": 1936,
      "month": 10,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.2975
    },
    {
      "year": 1936,
      "month": 11,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.3081
    },
    {
      "year": 1936,
      "month": 12,
      "equity": 0.0147417,
      "bond": 0.0002234,
      "cpi": 18.3187
    },
    {
      "year": 1937,
      "month": 1,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.3698
    },
    {
      "year": 1937,
      "month": 2,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.4211
    },
    {
      "year": 1937,
      "month": 3,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.4725
    },
    {
      "year": 1937,
      "month": 4,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.524
    },
    {
      "year": 1937,
      "month": 5,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.5757
    },
    {
      "year": 1937,
      "month": 6,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.6275
    },
    {
      "year": 1937,
      "month": 7,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.6795
    },
    {
      "year": 1937,
      "month": 8,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.7316
    },
    {
      "year": 1937,
      "month": 9,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.7839
    },
    {
      "year": 1937,
      "month": 10,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.8363
    },
    {
      "year": 1937,
      "month": 11,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.8888
    },
    {
      "year": 1937,
      "month": 12,
      "equity": -0.0115792,
      "bond": -0.0080134,
      "cpi": 18.9415
    },
    {
      "year": 1938,
      "month": 1,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 18.9666
    },
    {
      "year": 1938,
      "month": 2,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 18.9917
    },
    {
      "year": 1938,
      "month": 3,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.0168
    },
    {
      "year": 1938,
      "month": 4,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.042
    },
    {
      "year": 1938,
      "month": 5,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.0672
    },
    {
      "year": 1938,
      "month": 6,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.0924
    },
    {
      "year": 1938,
      "month": 7,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.1177
    },
    {
      "year": 1938,
      "month": 8,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.143
    },
    {
      "year": 1938,
      "month": 9,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.1683
    },
    {
      "year": 1938,
      "month": 10,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.1937
    },
    {
      "year": 1938,
      "month": 11,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.2191
    },
    {
      "year": 1938,
      "month": 12,
      "equity": -0.0085489,
      "bond": -0.0018362,
      "cpi": 19.2446
    },
    {
      "year": 1939,
      "month": 1,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.2889
    },
    {
      "year": 1939,
      "month": 2,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.3334
    },
    {
      "year": 1939,
      "month": 3,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.3779
    },
    {
      "year": 1939,
      "month": 4,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.4226
    },
    {
      "year": 1939,
      "month": 5,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.4673
    },
    {
      "year": 1939,
      "month": 6,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.5122
    },
    {
      "year": 1939,
      "month": 7,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.5571
    },
    {
      "year": 1939,
      "month": 8,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.6022
    },
    {
      "year": 1939,
      "month": 9,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.6473
    },
    {
      "year": 1939,
      "month": 10,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.6926
    },
    {
      "year": 1939,
      "month": 11,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.738
    },
    {
      "year": 1939,
      "month": 12,
      "equity": 0.00151,
      "bond": 0.0007916,
      "cpi": 19.7834
    },
    {
      "year": 1940,
      "month": 1,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 20.0411
    },
    {
      "year": 1940,
      "month": 2,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 20.3021
    },
    {
      "year": 1940,
      "month": 3,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 20.5666
    },
    {
      "year": 1940,
      "month": 4,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 20.8344
    },
    {
      "year": 1940,
      "month": 5,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 21.1058
    },
    {
      "year": 1940,
      "month": 6,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 21.3807
    },
    {
      "year": 1940,
      "month": 7,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 21.6592
    },
    {
      "year": 1940,
      "month": 8,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 21.9413
    },
    {
      "year": 1940,
      "month": 9,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 22.2271
    },
    {
      "year": 1940,
      "month": 10,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 22.5166
    },
    {
      "year": 1940,
      "month": 11,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 22.8099
    },
    {
      "year": 1940,
      "month": 12,
      "equity": -0.0041688,
      "bond": 0.0123991,
      "cpi": 23.107
    },
    {
      "year": 1941,
      "month": 1,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 23.3053
    },
    {
      "year": 1941,
      "month": 2,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 23.5054
    },
    {
      "year": 1941,
      "month": 3,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 23.7071
    },
    {
      "year": 1941,
      "month": 4,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 23.9106
    },
    {
      "year": 1941,
      "month": 5,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 24.1158
    },
    {
      "year": 1941,
      "month": 6,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 24.3228
    },
    {
      "year": 1941,
      "month": 7,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 24.5316
    },
    {
      "year": 1941,
      "month": 8,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 24.7421
    },
    {
      "year": 1941,
      "month": 9,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 24.9545
    },
    {
      "year": 1941,
      "month": 10,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 25.1687
    },
    {
      "year": 1941,
      "month": 11,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 25.3847
    },
    {
      "year": 1941,
      "month": 12,
      "equity": 0.0172168,
      "bond": 0.0084041,
      "cpi": 25.6026
    },
    {
      "year": 1942,
      "month": 1,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 25.7494
    },
    {
      "year": 1942,
      "month": 2,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 25.897
    },
    {
      "year": 1942,
      "month": 3,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.0454
    },
    {
      "year": 1942,
      "month": 4,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.1947
    },
    {
      "year": 1942,
      "month": 5,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.3449
    },
    {
      "year": 1942,
      "month": 6,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.4959
    },
    {
      "year": 1942,
      "month": 7,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.6478
    },
    {
      "year": 1942,
      "month": 8,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.8006
    },
    {
      "year": 1942,
      "month": 9,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 26.9542
    },
    {
      "year": 1942,
      "month": 10,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 27.1087
    },
    {
      "year": 1942,
      "month": 11,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 27.2641
    },
    {
      "year": 1942,
      "month": 12,
      "equity": 0.0142008,
      "bond": 0.0022709,
      "cpi": 27.4204
    },
    {
      "year": 1943,
      "month": 1,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.4969
    },
    {
      "year": 1943,
      "month": 2,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.5736
    },
    {
      "year": 1943,
      "month": 3,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.6506
    },
    {
      "year": 1943,
      "month": 4,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.7277
    },
    {
      "year": 1943,
      "month": 5,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.8051
    },
    {
      "year": 1943,
      "month": 6,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.8827
    },
    {
      "year": 1943,
      "month": 7,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 27.9604
    },
    {
      "year": 1943,
      "month": 8,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 28.0385
    },
    {
      "year": 1943,
      "month": 9,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 28.1167
    },
    {
      "year": 1943,
      "month": 10,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 28.1951
    },
    {
      "year": 1943,
      "month": 11,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 28.2738
    },
    {
      "year": 1943,
      "month": 12,
      "equity": 0.0087649,
      "bond": -0.0004161,
      "cpi": 28.3527
    },
    {
      "year": 1944,
      "month": 1,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.4157
    },
    {
      "year": 1944,
      "month": 2,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.4789
    },
    {
      "year": 1944,
      "month": 3,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.5422
    },
    {
      "year": 1944,
      "month": 4,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.6056
    },
    {
      "year": 1944,
      "month": 5,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.6692
    },
    {
      "year": 1944,
      "month": 6,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.7329
    },
    {
      "year": 1944,
      "month": 7,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.7968
    },
    {
      "year": 1944,
      "month": 8,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.8608
    },
    {
      "year": 1944,
      "month": 9,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.9249
    },
    {
      "year": 1944,
      "month": 10,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 28.9892
    },
    {
      "year": 1944,
      "month": 11,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 29.0536
    },
    {
      "year": 1944,
      "month": 12,
      "equity": 0.0098262,
      "bond": 0.00465,
      "cpi": 29.1182
    },
    {
      "year": 1945,
      "month": 1,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.1853
    },
    {
      "year": 1945,
      "month": 2,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.2525
    },
    {
      "year": 1945,
      "month": 3,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.3199
    },
    {
      "year": 1945,
      "month": 4,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.3875
    },
    {
      "year": 1945,
      "month": 5,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.4552
    },
    {
      "year": 1945,
      "month": 6,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.523
    },
    {
      "year": 1945,
      "month": 7,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.5911
    },
    {
      "year": 1945,
      "month": 8,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.6592
    },
    {
      "year": 1945,
      "month": 9,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.7276
    },
    {
      "year": 1945,
      "month": 10,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.7961
    },
    {
      "year": 1945,
      "month": 11,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.8647
    },
    {
      "year": 1945,
      "month": 12,
      "equity": 0.0052314,
      "bond": 0.0115791,
      "cpi": 29.9335
    },
    {
      "year": 1946,
      "month": 1,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.0098
    },
    {
      "year": 1946,
      "month": 2,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.0862
    },
    {
      "year": 1946,
      "month": 3,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.1628
    },
    {
      "year": 1946,
      "month": 4,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.2397
    },
    {
      "year": 1946,
      "month": 5,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.3167
    },
    {
      "year": 1946,
      "month": 6,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.3939
    },
    {
      "year": 1946,
      "month": 7,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.4714
    },
    {
      "year": 1946,
      "month": 8,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.549
    },
    {
      "year": 1946,
      "month": 9,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.6268
    },
    {
      "year": 1946,
      "month": 10,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.7048
    },
    {
      "year": 1946,
      "month": 11,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.783
    },
    {
      "year": 1946,
      "month": 12,
      "equity": 0.0136958,
      "bond": 0.0085534,
      "cpi": 30.8614
    },
    {
      "year": 1947,
      "month": 1,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.0359
    },
    {
      "year": 1947,
      "month": 2,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.2114
    },
    {
      "year": 1947,
      "month": 3,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.3878
    },
    {
      "year": 1947,
      "month": 4,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.5653
    },
    {
      "year": 1947,
      "month": 5,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.7438
    },
    {
      "year": 1947,
      "month": 6,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 31.9233
    },
    {
      "year": 1947,
      "month": 7,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 32.1038
    },
    {
      "year": 1947,
      "month": 8,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 32.2853
    },
    {
      "year": 1947,
      "month": 9,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 32.4678
    },
    {
      "year": 1947,
      "month": 10,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 32.6514
    },
    {
      "year": 1947,
      "month": 11,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 32.836
    },
    {
      "year": 1947,
      "month": 12,
      "equity": -0.0021732,
      "bond": -0.0128107,
      "cpi": 33.0217
    },
    {
      "year": 1948,
      "month": 1,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 33.2265
    },
    {
      "year": 1948,
      "month": 2,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 33.4325
    },
    {
      "year": 1948,
      "month": 3,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 33.6398
    },
    {
      "year": 1948,
      "month": 4,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 33.8484
    },
    {
      "year": 1948,
      "month": 5,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 34.0583
    },
    {
      "year": 1948,
      "month": 6,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 34.2695
    },
    {
      "year": 1948,
      "month": 7,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 34.482
    },
    {
      "year": 1948,
      "month": 8,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 34.6958
    },
    {
      "year": 1948,
      "month": 9,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 34.9109
    },
    {
      "year": 1948,
      "month": 10,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 35.1274
    },
    {
      "year": 1948,
      "month": 11,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 35.3452
    },
    {
      "year": 1948,
      "month": 12,
      "equity": -0.0031161,
      "bond": 0.000579,
      "cpi": 35.5644
    },
    {
      "year": 1949,
      "month": 1,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 35.6463
    },
    {
      "year": 1949,
      "month": 2,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 35.7285
    },
    {
      "year": 1949,
      "month": 3,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 35.8108
    },
    {
      "year": 1949,
      "month": 4,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 35.8933
    },
    {
      "year": 1949,
      "month": 5,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 35.976
    },
    {
      "year": 1949,
      "month": 6,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.0589
    },
    {
      "year": 1949,
      "month": 7,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.1419
    },
    {
      "year": 1949,
      "month": 8,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.2252
    },
    {
      "year": 1949,
      "month": 9,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.3087
    },
    {
      "year": 1949,
      "month": 10,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.3923
    },
    {
      "year": 1949,
      "month": 11,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.4762
    },
    {
      "year": 1949,
      "month": 12,
      "equity": -0.0048794,
      "bond": -0.0077691,
      "cpi": 36.5602
    },
    {
      "year": 1950,
      "month": 1,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 36.6775
    },
    {
      "year": 1950,
      "month": 2,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 36.7952
    },
    {
      "year": 1950,
      "month": 3,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 36.9132
    },
    {
      "year": 1950,
      "month": 4,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.0316
    },
    {
      "year": 1950,
      "month": 5,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.1504
    },
    {
      "year": 1950,
      "month": 6,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.2696
    },
    {
      "year": 1950,
      "month": 7,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.3892
    },
    {
      "year": 1950,
      "month": 8,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.5091
    },
    {
      "year": 1950,
      "month": 9,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.6295
    },
    {
      "year": 1950,
      "month": 10,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.7502
    },
    {
      "year": 1950,
      "month": 11,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.8713
    },
    {
      "year": 1950,
      "month": 12,
      "equity": 0.0087024,
      "bond": 0.0033253,
      "cpi": 37.9928
    },
    {
      "year": 1951,
      "month": 1,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 38.2681
    },
    {
      "year": 1951,
      "month": 2,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 38.5454
    },
    {
      "year": 1951,
      "month": 3,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 38.8246
    },
    {
      "year": 1951,
      "month": 4,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 39.106
    },
    {
      "year": 1951,
      "month": 5,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 39.3893
    },
    {
      "year": 1951,
      "month": 6,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 39.6747
    },
    {
      "year": 1951,
      "month": 7,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 39.9622
    },
    {
      "year": 1951,
      "month": 8,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 40.2517
    },
    {
      "year": 1951,
      "month": 9,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 40.5434
    },
    {
      "year": 1951,
      "month": 10,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 40.8371
    },
    {
      "year": 1951,
      "month": 11,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 41.133
    },
    {
      "year": 1951,
      "month": 12,
      "equity": 0.0066121,
      "bond": -0.0084518,
      "cpi": 41.4311
    },
    {
      "year": 1952,
      "month": 1,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 41.782
    },
    {
      "year": 1952,
      "month": 2,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 42.1358
    },
    {
      "year": 1952,
      "month": 3,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 42.4927
    },
    {
      "year": 1952,
      "month": 4,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 42.8526
    },
    {
      "year": 1952,
      "month": 5,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 43.2155
    },
    {
      "year": 1952,
      "month": 6,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 43.5815
    },
    {
      "year": 1952,
      "month": 7,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 43.9506
    },
    {
      "year": 1952,
      "month": 8,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 44.3228
    },
    {
      "year": 1952,
      "month": 9,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 44.6982
    },
    {
      "year": 1952,
      "month": 10,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 45.0768
    },
    {
      "year": 1952,
      "month": 11,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 45.4585
    },
    {
      "year": 1952,
      "month": 12,
      "equity": -0.0001177,
      "bond": -0.0005726,
      "cpi": 45.8435
    },
    {
      "year": 1953,
      "month": 1,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 45.9797
    },
    {
      "year": 1953,
      "month": 2,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.1164
    },
    {
      "year": 1953,
      "month": 3,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.2534
    },
    {
      "year": 1953,
      "month": 4,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.3909
    },
    {
      "year": 1953,
      "month": 5,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.5287
    },
    {
      "year": 1953,
      "month": 6,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.667
    },
    {
      "year": 1953,
      "month": 7,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.8057
    },
    {
      "year": 1953,
      "month": 8,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 46.9448
    },
    {
      "year": 1953,
      "month": 9,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 47.0843
    },
    {
      "year": 1953,
      "month": 10,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 47.2242
    },
    {
      "year": 1953,
      "month": 11,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 47.3646
    },
    {
      "year": 1953,
      "month": 12,
      "equity": 0.0183817,
      "bond": 0.0108761,
      "cpi": 47.5053
    },
    {
      "year": 1954,
      "month": 1,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 47.5951
    },
    {
      "year": 1954,
      "month": 2,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 47.6851
    },
    {
      "year": 1954,
      "month": 3,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 47.7752
    },
    {
      "year": 1954,
      "month": 4,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 47.8655
    },
    {
      "year": 1954,
      "month": 5,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 47.956
    },
    {
      "year": 1954,
      "month": 6,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.0466
    },
    {
      "year": 1954,
      "month": 7,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.1374
    },
    {
      "year": 1954,
      "month": 8,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.2284
    },
    {
      "year": 1954,
      "month": 9,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.3196
    },
    {
      "year": 1954,
      "month": 10,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.4109
    },
    {
      "year": 1954,
      "month": 11,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.5024
    },
    {
      "year": 1954,
      "month": 12,
      "equity": 0.0335677,
      "bond": 0.004918,
      "cpi": 48.5941
    },
    {
      "year": 1955,
      "month": 1,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 48.7948
    },
    {
      "year": 1955,
      "month": 2,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 48.9964
    },
    {
      "year": 1955,
      "month": 3,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 49.1987
    },
    {
      "year": 1955,
      "month": 4,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 49.402
    },
    {
      "year": 1955,
      "month": 5,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 49.606
    },
    {
      "year": 1955,
      "month": 6,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 49.8109
    },
    {
      "year": 1955,
      "month": 7,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 50.0167
    },
    {
      "year": 1955,
      "month": 8,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 50.2232
    },
    {
      "year": 1955,
      "month": 9,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 50.4307
    },
    {
      "year": 1955,
      "month": 10,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 50.639
    },
    {
      "year": 1955,
      "month": 11,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 50.8482
    },
    {
      "year": 1955,
      "month": 12,
      "equity": 0.0086306,
      "bond": -0.0088503,
      "cpi": 51.0582
    },
    {
      "year": 1956,
      "month": 1,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 51.2728
    },
    {
      "year": 1956,
      "month": 2,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 51.4884
    },
    {
      "year": 1956,
      "month": 3,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 51.7048
    },
    {
      "year": 1956,
      "month": 4,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 51.9222
    },
    {
      "year": 1956,
      "month": 5,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 52.1404
    },
    {
      "year": 1956,
      "month": 6,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 52.3596
    },
    {
      "year": 1956,
      "month": 7,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 52.5797
    },
    {
      "year": 1956,
      "month": 8,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 52.8007
    },
    {
      "year": 1956,
      "month": 9,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 53.0227
    },
    {
      "year": 1956,
      "month": 10,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 53.2456
    },
    {
      "year": 1956,
      "month": 11,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 53.4694
    },
    {
      "year": 1956,
      "month": 12,
      "equity": -0.0079776,
      "bond": -0.0025191,
      "cpi": 53.6942
    },
    {
      "year": 1957,
      "month": 1,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 53.8632
    },
    {
      "year": 1957,
      "month": 2,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.0326
    },
    {
      "year": 1957,
      "month": 3,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.2027
    },
    {
      "year": 1957,
      "month": 4,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.3732
    },
    {
      "year": 1957,
      "month": 5,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.5443
    },
    {
      "year": 1957,
      "month": 6,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.716
    },
    {
      "year": 1957,
      "month": 7,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 54.8881
    },
    {
      "year": 1957,
      "month": 8,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 55.0608
    },
    {
      "year": 1957,
      "month": 9,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 55.2341
    },
    {
      "year": 1957,
      "month": 10,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 55.4079
    },
    {
      "year": 1957,
      "month": 11,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 55.5823
    },
    {
      "year": 1957,
      "month": 12,
      "equity": -0.0007932,
      "bond": -0.005413,
      "cpi": 55.7572
    },
    {
      "year": 1958,
      "month": 1,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 55.8892
    },
    {
      "year": 1958,
      "month": 2,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.0215
    },
    {
      "year": 1958,
      "month": 3,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.1541
    },
    {
      "year": 1958,
      "month": 4,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.287
    },
    {
      "year": 1958,
      "month": 5,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.4202
    },
    {
      "year": 1958,
      "month": 6,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.5538
    },
    {
      "year": 1958,
      "month": 7,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.6876
    },
    {
      "year": 1958,
      "month": 8,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.8218
    },
    {
      "year": 1958,
      "month": 9,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 56.9563
    },
    {
      "year": 1958,
      "month": 10,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 57.0911
    },
    {
      "year": 1958,
      "month": 11,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 57.2263
    },
    {
      "year": 1958,
      "month": 12,
      "equity": 0.0330597,
      "bond": 0.0131891,
      "cpi": 57.3617
    },
    {
      "year": 1959,
      "month": 1,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.3903
    },
    {
      "year": 1959,
      "month": 2,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.4189
    },
    {
      "year": 1959,
      "month": 3,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.4475
    },
    {
      "year": 1959,
      "month": 4,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.4761
    },
    {
      "year": 1959,
      "month": 5,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.5047
    },
    {
      "year": 1959,
      "month": 6,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.5334
    },
    {
      "year": 1959,
      "month": 7,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.562
    },
    {
      "year": 1959,
      "month": 8,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.5907
    },
    {
      "year": 1959,
      "month": 9,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.6194
    },
    {
      "year": 1959,
      "month": 10,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.6481
    },
    {
      "year": 1959,
      "month": 11,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.6768
    },
    {
      "year": 1959,
      "month": 12,
      "equity": 0.0371195,
      "bond": 0.0008157,
      "cpi": 57.7055
    },
    {
      "year": 1960,
      "month": 1,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.7436
    },
    {
      "year": 1960,
      "month": 2,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.7817
    },
    {
      "year": 1960,
      "month": 3,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.8198
    },
    {
      "year": 1960,
      "month": 4,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.8579
    },
    {
      "year": 1960,
      "month": 5,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.8961
    },
    {
      "year": 1960,
      "month": 6,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.9343
    },
    {
      "year": 1960,
      "month": 7,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 57.9725
    },
    {
      "year": 1960,
      "month": 8,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 58.0107
    },
    {
      "year": 1960,
      "month": 9,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 58.049
    },
    {
      "year": 1960,
      "month": 10,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 58.0873
    },
    {
      "year": 1960,
      "month": 11,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 58.1256
    },
    {
      "year": 1960,
      "month": 12,
      "equity": 0.0015198,
      "bond": -0.0061212,
      "cpi": 58.1639
    },
    {
      "year": 1961,
      "month": 1,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 58.3192
    },
    {
      "year": 1961,
      "month": 2,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 58.4749
    },
    {
      "year": 1961,
      "month": 3,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 58.631
    },
    {
      "year": 1961,
      "month": 4,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 58.7875
    },
    {
      "year": 1961,
      "month": 5,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 58.9445
    },
    {
      "year": 1961,
      "month": 6,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.1019
    },
    {
      "year": 1961,
      "month": 7,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.2596
    },
    {
      "year": 1961,
      "month": 8,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.4179
    },
    {
      "year": 1961,
      "month": 9,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.5765
    },
    {
      "year": 1961,
      "month": 10,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.7356
    },
    {
      "year": 1961,
      "month": 11,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 59.895
    },
    {
      "year": 1961,
      "month": 12,
      "equity": 0.0014983,
      "bond": -0.006874,
      "cpi": 60.0549
    },
    {
      "year": 1962,
      "month": 1,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 60.2611
    },
    {
      "year": 1962,
      "month": 2,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 60.468
    },
    {
      "year": 1962,
      "month": 3,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 60.6756
    },
    {
      "year": 1962,
      "month": 4,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 60.8839
    },
    {
      "year": 1962,
      "month": 5,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 61.0929
    },
    {
      "year": 1962,
      "month": 6,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 61.3026
    },
    {
      "year": 1962,
      "month": 7,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 61.5131
    },
    {
      "year": 1962,
      "month": 8,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 61.7243
    },
    {
      "year": 1962,
      "month": 9,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 61.9362
    },
    {
      "year": 1962,
      "month": 10,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 62.1488
    },
    {
      "year": 1962,
      "month": 11,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 62.3622
    },
    {
      "year": 1962,
      "month": 12,
      "equity": 0.0003153,
      "bond": 0.0186175,
      "cpi": 62.5763
    },
    {
      "year": 1963,
      "month": 1,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 62.6851
    },
    {
      "year": 1963,
      "month": 2,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 62.7941
    },
    {
      "year": 1963,
      "month": 3,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 62.9032
    },
    {
      "year": 1963,
      "month": 4,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.0126
    },
    {
      "year": 1963,
      "month": 5,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.1221
    },
    {
      "year": 1963,
      "month": 6,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.2319
    },
    {
      "year": 1963,
      "month": 7,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.3418
    },
    {
      "year": 1963,
      "month": 8,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.4519
    },
    {
      "year": 1963,
      "month": 9,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.5622
    },
    {
      "year": 1963,
      "month": 10,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.6727
    },
    {
      "year": 1963,
      "month": 11,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.7834
    },
    {
      "year": 1963,
      "month": 12,
      "equity": 0.0151741,
      "bond": 0.002979,
      "cpi": 63.8943
    },
    {
      "year": 1964,
      "month": 1,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.0637
    },
    {
      "year": 1964,
      "month": 2,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.2336
    },
    {
      "year": 1964,
      "month": 3,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.4039
    },
    {
      "year": 1964,
      "month": 4,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.5747
    },
    {
      "year": 1964,
      "month": 5,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.7459
    },
    {
      "year": 1964,
      "month": 6,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 64.9176
    },
    {
      "year": 1964,
      "month": 7,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.0897
    },
    {
      "year": 1964,
      "month": 8,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.2623
    },
    {
      "year": 1964,
      "month": 9,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.4354
    },
    {
      "year": 1964,
      "month": 10,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.6089
    },
    {
      "year": 1964,
      "month": 11,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.7828
    },
    {
      "year": 1964,
      "month": 12,
      "equity": -0.0046241,
      "bond": -0.0019927,
      "cpi": 65.9573
    },
    {
      "year": 1965,
      "month": 1,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 66.1868
    },
    {
      "year": 1965,
      "month": 2,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 66.4172
    },
    {
      "year": 1965,
      "month": 3,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 66.6483
    },
    {
      "year": 1965,
      "month": 4,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 66.8803
    },
    {
      "year": 1965,
      "month": 5,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 67.1131
    },
    {
      "year": 1965,
      "month": 6,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 67.3466
    },
    {
      "year": 1965,
      "month": 7,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 67.581
    },
    {
      "year": 1965,
      "month": 8,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 67.8162
    },
    {
      "year": 1965,
      "month": 9,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 68.0522
    },
    {
      "year": 1965,
      "month": 10,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 68.2891
    },
    {
      "year": 1965,
      "month": 11,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 68.5267
    },
    {
      "year": 1965,
      "month": 12,
      "equity": 0.0088665,
      "bond": 0.0035889,
      "cpi": 68.7652
    },
    {
      "year": 1966,
      "month": 1,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 68.9903
    },
    {
      "year": 1966,
      "month": 2,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 69.2162
    },
    {
      "year": 1966,
      "month": 3,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 69.4428
    },
    {
      "year": 1966,
      "month": 4,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 69.6701
    },
    {
      "year": 1966,
      "month": 5,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 69.8982
    },
    {
      "year": 1966,
      "month": 6,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 70.127
    },
    {
      "year": 1966,
      "month": 7,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 70.3566
    },
    {
      "year": 1966,
      "month": 8,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 70.5869
    },
    {
      "year": 1966,
      "month": 9,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 70.818
    },
    {
      "year": 1966,
      "month": 10,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 71.0498
    },
    {
      "year": 1966,
      "month": 11,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 71.2824
    },
    {
      "year": 1966,
      "month": 12,
      "equity": -0.0032583,
      "bond": 0.0034463,
      "cpi": 71.5158
    },
    {
      "year": 1967,
      "month": 1,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 71.6482
    },
    {
      "year": 1967,
      "month": 2,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 71.7808
    },
    {
      "year": 1967,
      "month": 3,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 71.9136
    },
    {
      "year": 1967,
      "month": 4,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.0467
    },
    {
      "year": 1967,
      "month": 5,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.18
    },
    {
      "year": 1967,
      "month": 6,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.3136
    },
    {
      "year": 1967,
      "month": 7,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.4474
    },
    {
      "year": 1967,
      "month": 8,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.5815
    },
    {
      "year": 1967,
      "month": 9,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.7158
    },
    {
      "year": 1967,
      "month": 10,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.8504
    },
    {
      "year": 1967,
      "month": 11,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 72.9852
    },
    {
      "year": 1967,
      "month": 12,
      "equity": 0.0248101,
      "bond": 0.001937,
      "cpi": 73.1203
    },
    {
      "year": 1968,
      "month": 1,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 73.3595
    },
    {
      "year": 1968,
      "month": 2,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 73.5995
    },
    {
      "year": 1968,
      "month": 3,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 73.8402
    },
    {
      "year": 1968,
      "month": 4,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 74.0818
    },
    {
      "year": 1968,
      "month": 5,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 74.3241
    },
    {
      "year": 1968,
      "month": 6,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 74.5672
    },
    {
      "year": 1968,
      "month": 7,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 74.8112
    },
    {
      "year": 1968,
      "month": 8,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 75.0559
    },
    {
      "year": 1968,
      "month": 9,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 75.3014
    },
    {
      "year": 1968,
      "month": 10,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 75.5477
    },
    {
      "year": 1968,
      "month": 11,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 75.7949
    },
    {
      "year": 1968,
      "month": 12,
      "equity": 0.0333232,
      "bond": -0.0019668,
      "cpi": 76.0428
    },
    {
      "year": 1969,
      "month": 1,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 76.3647
    },
    {
      "year": 1969,
      "month": 2,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 76.688
    },
    {
      "year": 1969,
      "month": 3,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 77.0126
    },
    {
      "year": 1969,
      "month": 4,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 77.3386
    },
    {
      "year": 1969,
      "month": 5,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 77.666
    },
    {
      "year": 1969,
      "month": 6,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 77.9947
    },
    {
      "year": 1969,
      "month": 7,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 78.3249
    },
    {
      "year": 1969,
      "month": 8,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 78.6565
    },
    {
      "year": 1969,
      "month": 9,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 78.9894
    },
    {
      "year": 1969,
      "month": 10,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 79.3238
    },
    {
      "year": 1969,
      "month": 11,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 79.6596
    },
    {
      "year": 1969,
      "month": 12,
      "equity": -0.0104774,
      "bond": -0.0002076,
      "cpi": 79.9968
    },
    {
      "year": 1970,
      "month": 1,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 80.4189
    },
    {
      "year": 1970,
      "month": 2,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 80.8432
    },
    {
      "year": 1970,
      "month": 3,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 81.2698
    },
    {
      "year": 1970,
      "month": 4,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 81.6986
    },
    {
      "year": 1970,
      "month": 5,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 82.1296
    },
    {
      "year": 1970,
      "month": 6,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 82.563
    },
    {
      "year": 1970,
      "month": 7,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 82.9986
    },
    {
      "year": 1970,
      "month": 8,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 83.4365
    },
    {
      "year": 1970,
      "month": 9,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 83.8768
    },
    {
      "year": 1970,
      "month": 10,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 84.3193
    },
    {
      "year": 1970,
      "month": 11,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 84.7642
    },
    {
      "year": 1970,
      "month": 12,
      "equity": -0.0029522,
      "bond": 0.0028327,
      "cpi": 85.2115
    },
    {
      "year": 1971,
      "month": 1,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 85.8528
    },
    {
      "year": 1971,
      "month": 2,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 86.499
    },
    {
      "year": 1971,
      "month": 3,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 87.15
    },
    {
      "year": 1971,
      "month": 4,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 87.8059
    },
    {
      "year": 1971,
      "month": 5,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 88.4668
    },
    {
      "year": 1971,
      "month": 6,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 89.1326
    },
    {
      "year": 1971,
      "month": 7,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 89.8034
    },
    {
      "year": 1971,
      "month": 8,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 90.4793
    },
    {
      "year": 1971,
      "month": 9,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 91.1603
    },
    {
      "year": 1971,
      "month": 10,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 91.8464
    },
    {
      "year": 1971,
      "month": 11,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 92.5376
    },
    {
      "year": 1971,
      "month": 12,
      "equity": 0.0323926,
      "bond": 0.0200561,
      "cpi": 93.2341
    },
    {
      "year": 1972,
      "month": 1,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 93.7752
    },
    {
      "year": 1972,
      "month": 2,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 94.3195
    },
    {
      "year": 1972,
      "month": 3,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 94.8669
    },
    {
      "year": 1972,
      "month": 4,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 95.4174
    },
    {
      "year": 1972,
      "month": 5,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 95.9712
    },
    {
      "year": 1972,
      "month": 6,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 96.5282
    },
    {
      "year": 1972,
      "month": 7,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 97.0884
    },
    {
      "year": 1972,
      "month": 8,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 97.6519
    },
    {
      "year": 1972,
      "month": 9,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 98.2187
    },
    {
      "year": 1972,
      "month": 10,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 98.7887
    },
    {
      "year": 1972,
      "month": 11,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 99.362
    },
    {
      "year": 1972,
      "month": 12,
      "equity": 0.0127171,
      "bond": -0.003508,
      "cpi": 99.9387
    },
    {
      "year": 1973,
      "month": 1,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 100.6856
    },
    {
      "year": 1973,
      "month": 2,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 101.4381
    },
    {
      "year": 1973,
      "month": 3,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 102.1962
    },
    {
      "year": 1973,
      "month": 4,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 102.96
    },
    {
      "year": 1973,
      "month": 5,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 103.7295
    },
    {
      "year": 1973,
      "month": 6,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 104.5047
    },
    {
      "year": 1973,
      "month": 7,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 105.2857
    },
    {
      "year": 1973,
      "month": 8,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 106.0726
    },
    {
      "year": 1973,
      "month": 9,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 106.8653
    },
    {
      "year": 1973,
      "month": 10,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 107.664
    },
    {
      "year": 1973,
      "month": 11,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 108.4686
    },
    {
      "year": 1973,
      "month": 12,
      "equity": -0.027005,
      "bond": -0.0076352,
      "cpi": 109.2793
    },
    {
      "year": 1974,
      "month": 1,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 110.6179
    },
    {
      "year": 1974,
      "month": 2,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 111.973
    },
    {
      "year": 1974,
      "month": 3,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 113.3446
    },
    {
      "year": 1974,
      "month": 4,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 114.733
    },
    {
      "year": 1974,
      "month": 5,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 116.1385
    },
    {
      "year": 1974,
      "month": 6,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 117.5611
    },
    {
      "year": 1974,
      "month": 7,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 119.0012
    },
    {
      "year": 1974,
      "month": 8,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 120.4589
    },
    {
      "year": 1974,
      "month": 9,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 121.9345
    },
    {
      "year": 1974,
      "month": 10,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 123.4282
    },
    {
      "year": 1974,
      "month": 11,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 124.9401
    },
    {
      "year": 1974,
      "month": 12,
      "equity": -0.0564332,
      "bond": -0.0141978,
      "cpi": 126.4706
    },
    {
      "year": 1975,
      "month": 1,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 128.6452
    },
    {
      "year": 1975,
      "month": 2,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 130.8571
    },
    {
      "year": 1975,
      "month": 3,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 133.1071
    },
    {
      "year": 1975,
      "month": 4,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 135.3957
    },
    {
      "year": 1975,
      "month": 5,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 137.7238
    },
    {
      "year": 1975,
      "month": 6,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 140.0918
    },
    {
      "year": 1975,
      "month": 7,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 142.5006
    },
    {
      "year": 1975,
      "month": 8,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 144.9507
    },
    {
      "year": 1975,
      "month": 9,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 147.4431
    },
    {
      "year": 1975,
      "month": 10,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 149.9782
    },
    {
      "year": 1975,
      "month": 11,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 152.557
    },
    {
      "year": 1975,
      "month": 12,
      "equity": 0.0792069,
      "bond": 0.0260338,
      "cpi": 155.1801
    },
    {
      "year": 1976,
      "month": 1,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 157.0726
    },
    {
      "year": 1976,
      "month": 2,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 158.9882
    },
    {
      "year": 1976,
      "month": 3,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 160.9271
    },
    {
      "year": 1976,
      "month": 4,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 162.8897
    },
    {
      "year": 1976,
      "month": 5,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 164.8763
    },
    {
      "year": 1976,
      "month": 6,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 166.887
    },
    {
      "year": 1976,
      "month": 7,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 168.9223
    },
    {
      "year": 1976,
      "month": 8,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 170.9824
    },
    {
      "year": 1976,
      "month": 9,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 173.0676
    },
    {
      "year": 1976,
      "month": 10,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 175.1783
    },
    {
      "year": 1976,
      "month": 11,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 177.3147
    },
    {
      "year": 1976,
      "month": 12,
      "equity": 0.0019184,
      "bond": 0.010892,
      "cpi": 179.4771
    },
    {
      "year": 1977,
      "month": 1,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 181.5721
    },
    {
      "year": 1977,
      "month": 2,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 183.6915
    },
    {
      "year": 1977,
      "month": 3,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 185.8357
    },
    {
      "year": 1977,
      "month": 4,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 188.005
    },
    {
      "year": 1977,
      "month": 5,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 190.1995
    },
    {
      "year": 1977,
      "month": 6,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 192.4196
    },
    {
      "year": 1977,
      "month": 7,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 194.6657
    },
    {
      "year": 1977,
      "month": 8,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 196.938
    },
    {
      "year": 1977,
      "month": 9,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 199.2368
    },
    {
      "year": 1977,
      "month": 10,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 201.5625
    },
    {
      "year": 1977,
      "month": 11,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 203.9153
    },
    {
      "year": 1977,
      "month": 12,
      "equity": 0.033535,
      "bond": 0.0317767,
      "cpi": 206.2955
    },
    {
      "year": 1978,
      "month": 1,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 207.5381
    },
    {
      "year": 1978,
      "month": 2,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 208.7881
    },
    {
      "year": 1978,
      "month": 3,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 210.0457
    },
    {
      "year": 1978,
      "month": 4,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 211.3109
    },
    {
      "year": 1978,
      "month": 5,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 212.5836
    },
    {
      "year": 1978,
      "month": 6,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 213.8641
    },
    {
      "year": 1978,
      "month": 7,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 215.1522
    },
    {
      "year": 1978,
      "month": 8,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 216.4482
    },
    {
      "year": 1978,
      "month": 9,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 217.7519
    },
    {
      "year": 1978,
      "month": 10,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 219.0635
    },
    {
      "year": 1978,
      "month": 11,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 220.3829
    },
    {
      "year": 1978,
      "month": 12,
      "equity": 0.0069497,
      "bond": -0.0021717,
      "cpi": 221.7104
    },
    {
      "year": 1979,
      "month": 1,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 223.7094
    },
    {
      "year": 1979,
      "month": 2,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 225.7264
    },
    {
      "year": 1979,
      "month": 3,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 227.7616
    },
    {
      "year": 1979,
      "month": 4,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 229.8151
    },
    {
      "year": 1979,
      "month": 5,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 231.8872
    },
    {
      "year": 1979,
      "month": 6,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 233.978
    },
    {
      "year": 1979,
      "month": 7,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 236.0876
    },
    {
      "year": 1979,
      "month": 8,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 238.2162
    },
    {
      "year": 1979,
      "month": 9,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 240.364
    },
    {
      "year": 1979,
      "month": 10,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 242.5312
    },
    {
      "year": 1979,
      "month": 11,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 244.7179
    },
    {
      "year": 1979,
      "month": 12,
      "equity": 0.0090985,
      "bond": 0.0034212,
      "cpi": 246.9243
    },
    {
      "year": 1980,
      "month": 1,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 249.8449
    },
    {
      "year": 1980,
      "month": 2,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 252.8001
    },
    {
      "year": 1980,
      "month": 3,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 255.7902
    },
    {
      "year": 1980,
      "month": 4,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 258.8157
    },
    {
      "year": 1980,
      "month": 5,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 261.877
    },
    {
      "year": 1980,
      "month": 6,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 264.9744
    },
    {
      "year": 1980,
      "month": 7,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 268.1085
    },
    {
      "year": 1980,
      "month": 8,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 271.2797
    },
    {
      "year": 1980,
      "month": 9,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 274.4884
    },
    {
      "year": 1980,
      "month": 10,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 277.7351
    },
    {
      "year": 1980,
      "month": 11,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 281.0201
    },
    {
      "year": 1980,
      "month": 12,
      "equity": 0.0252184,
      "bond": 0.0146906,
      "cpi": 284.344
    },
    {
      "year": 1981,
      "month": 1,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 287.0014
    },
    {
      "year": 1981,
      "month": 2,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 289.6837
    },
    {
      "year": 1981,
      "month": 3,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 292.391
    },
    {
      "year": 1981,
      "month": 4,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 295.1236
    },
    {
      "year": 1981,
      "month": 5,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 297.8818
    },
    {
      "year": 1981,
      "month": 6,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 300.6657
    },
    {
      "year": 1981,
      "month": 7,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 303.4757
    },
    {
      "year": 1981,
      "month": 8,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 306.3119
    },
    {
      "year": 1981,
      "month": 9,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 309.1746
    },
    {
      "year": 1981,
      "month": 10,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 312.0641
    },
    {
      "year": 1981,
      "month": 11,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 314.9806
    },
    {
      "year": 1981,
      "month": 12,
      "equity": 0.0107031,
      "bond": 0.0079641,
      "cpi": 317.9243
    },
    {
      "year": 1982,
      "month": 1,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 319.9972
    },
    {
      "year": 1982,
      "month": 2,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 322.0837
    },
    {
      "year": 1982,
      "month": 3,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 324.1837
    },
    {
      "year": 1982,
      "month": 4,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 326.2975
    },
    {
      "year": 1982,
      "month": 5,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 328.425
    },
    {
      "year": 1982,
      "month": 6,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 330.5664
    },
    {
      "year": 1982,
      "month": 7,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 332.7218
    },
    {
      "year": 1982,
      "month": 8,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 334.8912
    },
    {
      "year": 1982,
      "month": 9,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 337.0748
    },
    {
      "year": 1982,
      "month": 10,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 339.2726
    },
    {
      "year": 1982,
      "month": 11,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 341.4847
    },
    {
      "year": 1982,
      "month": 12,
      "equity": 0.0211112,
      "bond": 0.0363686,
      "cpi": 343.7112
    },
    {
      "year": 1983,
      "month": 1,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 345.0937
    },
    {
      "year": 1983,
      "month": 2,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 346.4818
    },
    {
      "year": 1983,
      "month": 3,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 347.8754
    },
    {
      "year": 1983,
      "month": 4,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 349.2747
    },
    {
      "year": 1983,
      "month": 5,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 350.6796
    },
    {
      "year": 1983,
      "month": 6,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 352.0901
    },
    {
      "year": 1983,
      "month": 7,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 353.5063
    },
    {
      "year": 1983,
      "month": 8,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 354.9282
    },
    {
      "year": 1983,
      "month": 9,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 356.3558
    },
    {
      "year": 1983,
      "month": 10,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 357.7892
    },
    {
      "year": 1983,
      "month": 11,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 359.2284
    },
    {
      "year": 1983,
      "month": 12,
      "equity": 0.0213011,
      "bond": 0.0063006,
      "cpi": 360.6733
    },
    {
      "year": 1984,
      "month": 1,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 361.9288
    },
    {
      "year": 1984,
      "month": 2,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 363.1886
    },
    {
      "year": 1984,
      "month": 3,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 364.4529
    },
    {
      "year": 1984,
      "month": 4,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 365.7215
    },
    {
      "year": 1984,
      "month": 5,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 366.9945
    },
    {
      "year": 1984,
      "month": 6,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 368.272
    },
    {
      "year": 1984,
      "month": 7,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 369.554
    },
    {
      "year": 1984,
      "month": 8,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 370.8404
    },
    {
      "year": 1984,
      "month": 9,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 372.1312
    },
    {
      "year": 1984,
      "month": 10,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 373.4266
    },
    {
      "year": 1984,
      "month": 11,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 374.7265
    },
    {
      "year": 1984,
      "month": 12,
      "equity": 0.0231301,
      "bond": 0.0030775,
      "cpi": 376.0309
    },
    {
      "year": 1985,
      "month": 1,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 377.5396
    },
    {
      "year": 1985,
      "month": 2,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 379.0544
    },
    {
      "year": 1985,
      "month": 3,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 380.5752
    },
    {
      "year": 1985,
      "month": 4,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 382.1021
    },
    {
      "year": 1985,
      "month": 5,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 383.6352
    },
    {
      "year": 1985,
      "month": 6,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 385.1744
    },
    {
      "year": 1985,
      "month": 7,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 386.7198
    },
    {
      "year": 1985,
      "month": 8,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 388.2714
    },
    {
      "year": 1985,
      "month": 9,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 389.8292
    },
    {
      "year": 1985,
      "month": 10,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 391.3932
    },
    {
      "year": 1985,
      "month": 11,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 392.9636
    },
    {
      "year": 1985,
      "month": 12,
      "equity": 0.0154057,
      "bond": 0.0152519,
      "cpi": 394.5402
    },
    {
      "year": 1986,
      "month": 1,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 395.6174
    },
    {
      "year": 1986,
      "month": 2,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 396.6976
    },
    {
      "year": 1986,
      "month": 3,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 397.7807
    },
    {
      "year": 1986,
      "month": 4,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 398.8668
    },
    {
      "year": 1986,
      "month": 5,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 399.9559
    },
    {
      "year": 1986,
      "month": 6,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 401.0479
    },
    {
      "year": 1986,
      "month": 7,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 402.1429
    },
    {
      "year": 1986,
      "month": 8,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 403.2409
    },
    {
      "year": 1986,
      "month": 9,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 404.3419
    },
    {
      "year": 1986,
      "month": 10,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 405.4458
    },
    {
      "year": 1986,
      "month": 11,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 406.5529
    },
    {
      "year": 1986,
      "month": 12,
      "equity": 0.0202633,
      "bond": 0.0098927,
      "cpi": 407.6629
    },
    {
      "year": 1987,
      "month": 1,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 408.736
    },
    {
      "year": 1987,
      "month": 2,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 409.8119
    },
    {
      "year": 1987,
      "month": 3,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 410.8907
    },
    {
      "year": 1987,
      "month": 4,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 411.9723
    },
    {
      "year": 1987,
      "month": 5,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 413.0568
    },
    {
      "year": 1987,
      "month": 6,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 414.1441
    },
    {
      "year": 1987,
      "month": 7,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 415.2342
    },
    {
      "year": 1987,
      "month": 8,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 416.3273
    },
    {
      "year": 1987,
      "month": 9,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 417.4232
    },
    {
      "year": 1987,
      "month": 10,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 418.522
    },
    {
      "year": 1987,
      "month": 11,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 419.6237
    },
    {
      "year": 1987,
      "month": 12,
      "equity": 0.0069381,
      "bond": 0.0138162,
      "cpi": 420.7283
    },
    {
      "year": 1988,
      "month": 1,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 422.0241
    },
    {
      "year": 1988,
      "month": 2,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 423.3239
    },
    {
      "year": 1988,
      "month": 3,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 424.6278
    },
    {
      "year": 1988,
      "month": 4,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 425.9356
    },
    {
      "year": 1988,
      "month": 5,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 427.2474
    },
    {
      "year": 1988,
      "month": 6,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 428.5633
    },
    {
      "year": 1988,
      "month": 7,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 429.8833
    },
    {
      "year": 1988,
      "month": 8,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 431.2073
    },
    {
      "year": 1988,
      "month": 9,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 432.5354
    },
    {
      "year": 1988,
      "month": 10,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 433.8676
    },
    {
      "year": 1988,
      "month": 11,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 435.2039
    },
    {
      "year": 1988,
      "month": 12,
      "equity": 0.0091004,
      "bond": 0.005551,
      "cpi": 436.5443
    },
    {
      "year": 1989,
      "month": 1,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 438.4054
    },
    {
      "year": 1989,
      "month": 2,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 440.2744
    },
    {
      "year": 1989,
      "month": 3,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 442.1514
    },
    {
      "year": 1989,
      "month": 4,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 444.0365
    },
    {
      "year": 1989,
      "month": 5,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 445.9295
    },
    {
      "year": 1989,
      "month": 6,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 447.8306
    },
    {
      "year": 1989,
      "month": 7,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 449.7398
    },
    {
      "year": 1989,
      "month": 8,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 451.6572
    },
    {
      "year": 1989,
      "month": 9,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 453.5827
    },
    {
      "year": 1989,
      "month": 10,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 455.5165
    },
    {
      "year": 1989,
      "month": 11,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 457.4585
    },
    {
      "year": 1989,
      "month": 12,
      "equity": 0.0256199,
      "bond": 0.006597,
      "cpi": 459.4087
    },
    {
      "year": 1990,
      "month": 1,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 461.9964
    },
    {
      "year": 1990,
      "month": 2,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 464.5987
    },
    {
      "year": 1990,
      "month": 3,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 467.2157
    },
    {
      "year": 1990,
      "month": 4,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 469.8474
    },
    {
      "year": 1990,
      "month": 5,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 472.494
    },
    {
      "year": 1990,
      "month": 6,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 475.1554
    },
    {
      "year": 1990,
      "month": 7,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 477.8318
    },
    {
      "year": 1990,
      "month": 8,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 480.5233
    },
    {
      "year": 1990,
      "month": 9,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 483.23
    },
    {
      "year": 1990,
      "month": 10,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 485.9519
    },
    {
      "year": 1990,
      "month": 11,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 488.6891
    },
    {
      "year": 1990,
      "month": 12,
      "equity": -0.0083851,
      "bond": 0.0065977,
      "cpi": 491.4418
    },
    {
      "year": 1991,
      "month": 1,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 494.425
    },
    {
      "year": 1991,
      "month": 2,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 497.4264
    },
    {
      "year": 1991,
      "month": 3,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 500.446
    },
    {
      "year": 1991,
      "month": 4,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 503.4838
    },
    {
      "year": 1991,
      "month": 5,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 506.5402
    },
    {
      "year": 1991,
      "month": 6,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 509.6151
    },
    {
      "year": 1991,
      "month": 7,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 512.7086
    },
    {
      "year": 1991,
      "month": 8,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 515.821
    },
    {
      "year": 1991,
      "month": 9,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 518.9522
    },
    {
      "year": 1991,
      "month": 10,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 522.1024
    },
    {
      "year": 1991,
      "month": 11,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 525.2718
    },
    {
      "year": 1991,
      "month": 12,
      "equity": 0.0158756,
      "bond": 0.0142332,
      "cpi": 528.4604
    },
    {
      "year": 1992,
      "month": 1,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 530.3014
    },
    {
      "year": 1992,
      "month": 2,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 532.1489
    },
    {
      "year": 1992,
      "month": 3,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 534.0027
    },
    {
      "year": 1992,
      "month": 4,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 535.8631
    },
    {
      "year": 1992,
      "month": 5,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 537.7299
    },
    {
      "year": 1992,
      "month": 6,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 539.6032
    },
    {
      "year": 1992,
      "month": 7,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 541.4831
    },
    {
      "year": 1992,
      "month": 8,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 543.3695
    },
    {
      "year": 1992,
      "month": 9,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 545.2624
    },
    {
      "year": 1992,
      "month": 10,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 547.162
    },
    {
      "year": 1992,
      "month": 11,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 549.0682
    },
    {
      "year": 1992,
      "month": 12,
      "equity": 0.015231,
      "bond": 0.015321,
      "cpi": 550.981
    },
    {
      "year": 1993,
      "month": 1,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 552.1188
    },
    {
      "year": 1993,
      "month": 2,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 553.259
    },
    {
      "year": 1993,
      "month": 3,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 554.4016
    },
    {
      "year": 1993,
      "month": 4,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 555.5465
    },
    {
      "year": 1993,
      "month": 5,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 556.6938
    },
    {
      "year": 1993,
      "month": 6,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 557.8434
    },
    {
      "year": 1993,
      "month": 7,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 558.9955
    },
    {
      "year": 1993,
      "month": 8,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 560.1499
    },
    {
      "year": 1993,
      "month": 9,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 561.3066
    },
    {
      "year": 1993,
      "month": 10,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 562.4658
    },
    {
      "year": 1993,
      "month": 11,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 563.6274
    },
    {
      "year": 1993,
      "month": 12,
      "equity": 0.0204839,
      "bond": 0.0172564,
      "cpi": 564.7913
    },
    {
      "year": 1994,
      "month": 1,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 565.7142
    },
    {
      "year": 1994,
      "month": 2,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 566.6385
    },
    {
      "year": 1994,
      "month": 3,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 567.5644
    },
    {
      "year": 1994,
      "month": 4,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 568.4918
    },
    {
      "year": 1994,
      "month": 5,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 569.4207
    },
    {
      "year": 1994,
      "month": 6,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 570.3511
    },
    {
      "year": 1994,
      "month": 7,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 571.283
    },
    {
      "year": 1994,
      "month": 8,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 572.2165
    },
    {
      "year": 1994,
      "month": 9,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 573.1515
    },
    {
      "year": 1994,
      "month": 10,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 574.088
    },
    {
      "year": 1994,
      "month": 11,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 575.0261
    },
    {
      "year": 1994,
      "month": 12,
      "equity": -0.0050986,
      "bond": -0.0091215,
      "cpi": 575.9656
    },
    {
      "year": 1995,
      "month": 1,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 577.2254
    },
    {
      "year": 1995,
      "month": 2,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 578.4879
    },
    {
      "year": 1995,
      "month": 3,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 579.7531
    },
    {
      "year": 1995,
      "month": 4,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 581.0212
    },
    {
      "year": 1995,
      "month": 5,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 582.292
    },
    {
      "year": 1995,
      "month": 6,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 583.5656
    },
    {
      "year": 1995,
      "month": 7,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 584.842
    },
    {
      "year": 1995,
      "month": 8,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 586.1211
    },
    {
      "year": 1995,
      "month": 9,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 587.4031
    },
    {
      "year": 1995,
      "month": 10,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 588.6879
    },
    {
      "year": 1995,
      "month": 11,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 589.9755
    },
    {
      "year": 1995,
      "month": 12,
      "equity": 0.0174153,
      "bond": 0.0135729,
      "cpi": 591.2659
    },
    {
      "year": 1996,
      "month": 1,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 592.4358
    },
    {
      "year": 1996,
      "month": 2,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 593.608
    },
    {
      "year": 1996,
      "month": 3,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 594.7825
    },
    {
      "year": 1996,
      "month": 4,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 595.9593
    },
    {
      "year": 1996,
      "month": 5,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 597.1384
    },
    {
      "year": 1996,
      "month": 6,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 598.3199
    },
    {
      "year": 1996,
      "month": 7,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 599.5037
    },
    {
      "year": 1996,
      "month": 8,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 600.6899
    },
    {
      "year": 1996,
      "month": 9,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 601.8784
    },
    {
      "year": 1996,
      "month": 10,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 603.0693
    },
    {
      "year": 1996,
      "month": 11,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 604.2625
    },
    {
      "year": 1996,
      "month": 12,
      "equity": 0.0123068,
      "bond": 0.0062509,
      "cpi": 605.4581
    },
    {
      "year": 1997,
      "month": 1,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 606.3711
    },
    {
      "year": 1997,
      "month": 2,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 607.2855
    },
    {
      "year": 1997,
      "month": 3,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 608.2012
    },
    {
      "year": 1997,
      "month": 4,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 609.1183
    },
    {
      "year": 1997,
      "month": 5,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 610.0368
    },
    {
      "year": 1997,
      "month": 6,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 610.9567
    },
    {
      "year": 1997,
      "month": 7,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 611.878
    },
    {
      "year": 1997,
      "month": 8,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 612.8007
    },
    {
      "year": 1997,
      "month": 9,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 613.7248
    },
    {
      "year": 1997,
      "month": 10,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 614.6502
    },
    {
      "year": 1997,
      "month": 11,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 615.5771
    },
    {
      "year": 1997,
      "month": 12,
      "equity": 0.0177909,
      "bond": 0.0129959,
      "cpi": 616.5053
    },
    {
      "year": 1998,
      "month": 1,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 617.2998
    },
    {
      "year": 1998,
      "month": 2,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 618.0953
    },
    {
      "year": 1998,
      "month": 3,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 618.8918
    },
    {
      "year": 1998,
      "month": 4,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 619.6893
    },
    {
      "year": 1998,
      "month": 5,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 620.4879
    },
    {
      "year": 1998,
      "month": 6,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 621.2875
    },
    {
      "year": 1998,
      "month": 7,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 622.0881
    },
    {
      "year": 1998,
      "month": 8,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 622.8898
    },
    {
      "year": 1998,
      "month": 9,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 623.6925
    },
    {
      "year": 1998,
      "month": 10,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 624.4962
    },
    {
      "year": 1998,
      "month": 11,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 625.3009
    },
    {
      "year": 1998,
      "month": 12,
      "equity": 0.0107376,
      "bond": 0.0161303,
      "cpi": 626.1067
    },
    {
      "year": 1999,
      "month": 1,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 626.7958
    },
    {
      "year": 1999,
      "month": 2,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 627.4856
    },
    {
      "year": 1999,
      "month": 3,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 628.1762
    },
    {
      "year": 1999,
      "month": 4,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 628.8676
    },
    {
      "year": 1999,
      "month": 5,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 629.5597
    },
    {
      "year": 1999,
      "month": 6,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 630.2525
    },
    {
      "year": 1999,
      "month": 7,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 630.9462
    },
    {
      "year": 1999,
      "month": 8,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 631.6406
    },
    {
      "year": 1999,
      "month": 9,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 632.3358
    },
    {
      "year": 1999,
      "month": 10,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 633.0317
    },
    {
      "year": 1999,
      "month": 11,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 633.7284
    },
    {
      "year": 1999,
      "month": 12,
      "equity": 0.01795,
      "bond": -0.0035237,
      "cpi": 634.4258
    },
    {
      "year": 2000,
      "month": 1,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 634.8453
    },
    {
      "year": 2000,
      "month": 2,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 635.2652
    },
    {
      "year": 2000,
      "month": 3,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 635.6853
    },
    {
      "year": 2000,
      "month": 4,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 636.1057
    },
    {
      "year": 2000,
      "month": 5,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 636.5263
    },
    {
      "year": 2000,
      "month": 6,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 636.9473
    },
    {
      "year": 2000,
      "month": 7,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 637.3685
    },
    {
      "year": 2000,
      "month": 8,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 637.79
    },
    {
      "year": 2000,
      "month": 9,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 638.2117
    },
    {
      "year": 2000,
      "month": 10,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 638.6338
    },
    {
      "year": 2000,
      "month": 11,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 639.0561
    },
    {
      "year": 2000,
      "month": 12,
      "equity": -0.0050904,
      "bond": 0.007817,
      "cpi": 639.4787
    },
    {
      "year": 2001,
      "month": 1,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 640.1323
    },
    {
      "year": 2001,
      "month": 2,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 640.7867
    },
    {
      "year": 2001,
      "month": 3,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 641.4417
    },
    {
      "year": 2001,
      "month": 4,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 642.0973
    },
    {
      "year": 2001,
      "month": 5,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 642.7536
    },
    {
      "year": 2001,
      "month": 6,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 643.4106
    },
    {
      "year": 2001,
      "month": 7,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 644.0683
    },
    {
      "year": 2001,
      "month": 8,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 644.7266
    },
    {
      "year": 2001,
      "month": 9,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 645.3857
    },
    {
      "year": 2001,
      "month": 10,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 646.0453
    },
    {
      "year": 2001,
      "month": 11,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 646.7057
    },
    {
      "year": 2001,
      "month": 12,
      "equity": -0.0117465,
      "bond": 0.0024296,
      "cpi": 647.3667
    },
    {
      "year": 2002,
      "month": 1,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 648.042
    },
    {
      "year": 2002,
      "month": 2,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 648.7179
    },
    {
      "year": 2002,
      "month": 3,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 649.3946
    },
    {
      "year": 2002,
      "month": 4,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 650.072
    },
    {
      "year": 2002,
      "month": 5,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 650.7501
    },
    {
      "year": 2002,
      "month": 6,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 651.4288
    },
    {
      "year": 2002,
      "month": 7,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 652.1083
    },
    {
      "year": 2002,
      "month": 8,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 652.7886
    },
    {
      "year": 2002,
      "month": 9,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 653.4695
    },
    {
      "year": 2002,
      "month": 10,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 654.1511
    },
    {
      "year": 2002,
      "month": 11,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 654.8334
    },
    {
      "year": 2002,
      "month": 12,
      "equity": -0.020765,
      "bond": 0.0081333,
      "cpi": 655.5165
    },
    {
      "year": 2003,
      "month": 1,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 656.2557
    },
    {
      "year": 2003,
      "month": 2,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 656.9957
    },
    {
      "year": 2003,
      "month": 3,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 657.7366
    },
    {
      "year": 2003,
      "month": 4,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 658.4783
    },
    {
      "year": 2003,
      "month": 5,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 659.2208
    },
    {
      "year": 2003,
      "month": 6,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 659.9641
    },
    {
      "year": 2003,
      "month": 7,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 660.7083
    },
    {
      "year": 2003,
      "month": 8,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 661.4534
    },
    {
      "year": 2003,
      "month": 9,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 662.1993
    },
    {
      "year": 2003,
      "month": 10,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 662.946
    },
    {
      "year": 2003,
      "month": 11,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 663.6936
    },
    {
      "year": 2003,
      "month": 12,
      "equity": 0.0154333,
      "bond": 0.0017427,
      "cpi": 664.442
    },
    {
      "year": 2004,
      "month": 1,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 665.1814
    },
    {
      "year": 2004,
      "month": 2,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 665.9216
    },
    {
      "year": 2004,
      "month": 3,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 666.6626
    },
    {
      "year": 2004,
      "month": 4,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 667.4044
    },
    {
      "year": 2004,
      "month": 5,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 668.1471
    },
    {
      "year": 2004,
      "month": 6,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 668.8906
    },
    {
      "year": 2004,
      "month": 7,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 669.6349
    },
    {
      "year": 2004,
      "month": 8,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 670.38
    },
    {
      "year": 2004,
      "month": 9,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 671.126
    },
    {
      "year": 2004,
      "month": 10,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 671.8728
    },
    {
      "year": 2004,
      "month": 11,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 672.6205
    },
    {
      "year": 2004,
      "month": 12,
      "equity": 0.0099346,
      "bond": 0.0053702,
      "cpi": 673.3689
    },
    {
      "year": 2005,
      "month": 1,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 674.5124
    },
    {
      "year": 2005,
      "month": 2,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 675.6578
    },
    {
      "year": 2005,
      "month": 3,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 676.8052
    },
    {
      "year": 2005,
      "month": 4,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 677.9545
    },
    {
      "year": 2005,
      "month": 5,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 679.1058
    },
    {
      "year": 2005,
      "month": 6,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 680.2591
    },
    {
      "year": 2005,
      "month": 7,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 681.4143
    },
    {
      "year": 2005,
      "month": 8,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 682.5714
    },
    {
      "year": 2005,
      "month": 9,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 683.7305
    },
    {
      "year": 2005,
      "month": 10,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 684.8916
    },
    {
      "year": 2005,
      "month": 11,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 686.0547
    },
    {
      "year": 2005,
      "month": 12,
      "equity": 0.0164611,
      "bond": 0.0068226,
      "cpi": 687.2197
    },
    {
      "year": 2006,
      "month": 1,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 688.5393
    },
    {
      "year": 2006,
      "month": 2,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 689.8614
    },
    {
      "year": 2006,
      "month": 3,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 691.1861
    },
    {
      "year": 2006,
      "month": 4,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 692.5133
    },
    {
      "year": 2006,
      "month": 5,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 693.843
    },
    {
      "year": 2006,
      "month": 6,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 695.1753
    },
    {
      "year": 2006,
      "month": 7,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 696.5102
    },
    {
      "year": 2006,
      "month": 8,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 697.8476
    },
    {
      "year": 2006,
      "month": 9,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 699.1876
    },
    {
      "year": 2006,
      "month": 10,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 700.5302
    },
    {
      "year": 2006,
      "month": 11,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 701.8753
    },
    {
      "year": 2006,
      "month": 12,
      "equity": 0.0127586,
      "bond": -0.0004193,
      "cpi": 703.2231
    },
    {
      "year": 2007,
      "month": 1,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 704.57
    },
    {
      "year": 2007,
      "month": 2,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 705.9196
    },
    {
      "year": 2007,
      "month": 3,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 707.2717
    },
    {
      "year": 2007,
      "month": 4,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 708.6264
    },
    {
      "year": 2007,
      "month": 5,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 709.9837
    },
    {
      "year": 2007,
      "month": 6,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 711.3436
    },
    {
      "year": 2007,
      "month": 7,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 712.7061
    },
    {
      "year": 2007,
      "month": 8,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 714.0712
    },
    {
      "year": 2007,
      "month": 9,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 715.4389
    },
    {
      "year": 2007,
      "month": 10,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 716.8093
    },
    {
      "year": 2007,
      "month": 11,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 718.1823
    },
    {
      "year": 2007,
      "month": 12,
      "equity": 0.0041391,
      "bond": 0.0050302,
      "cpi": 719.5579
    },
    {
      "year": 2008,
      "month": 1,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 721.6829
    },
    {
      "year": 2008,
      "month": 2,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 723.8141
    },
    {
      "year": 2008,
      "month": 3,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 725.9516
    },
    {
      "year": 2008,
      "month": 4,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 728.0955
    },
    {
      "year": 2008,
      "month": 5,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 730.2457
    },
    {
      "year": 2008,
      "month": 6,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 732.4022
    },
    {
      "year": 2008,
      "month": 7,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 734.5651
    },
    {
      "year": 2008,
      "month": 8,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 736.7344
    },
    {
      "year": 2008,
      "month": 9,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 738.9101
    },
    {
      "year": 2008,
      "month": 10,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 741.0922
    },
    {
      "year": 2008,
      "month": 11,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 743.2807
    },
    {
      "year": 2008,
      "month": 12,
      "equity": -0.0289983,
      "bond": 0.0124254,
      "cpi": 745.4758
    },
    {
      "year": 2009,
      "month": 1,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 746.8078
    },
    {
      "year": 2009,
      "month": 2,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 748.1422
    },
    {
      "year": 2009,
      "month": 3,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 749.4789
    },
    {
      "year": 2009,
      "month": 4,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 750.8181
    },
    {
      "year": 2009,
      "month": 5,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 752.1596
    },
    {
      "year": 2009,
      "month": 6,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 753.5035
    },
    {
      "year": 2009,
      "month": 7,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 754.8499
    },
    {
      "year": 2009,
      "month": 8,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 756.1986
    },
    {
      "year": 2009,
      "month": 9,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 757.5498
    },
    {
      "year": 2009,
      "month": 10,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 758.9033
    },
    {
      "year": 2009,
      "month": 11,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 760.2593
    },
    {
      "year": 2009,
      "month": 12,
      "equity": 0.0214152,
      "bond": -0.0012725,
      "cpi": 761.6177
    },
    {
      "year": 2010,
      "month": 1,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 763.68
    },
    {
      "year": 2010,
      "month": 2,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 765.7479
    },
    {
      "year": 2010,
      "month": 3,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 767.8214
    },
    {
      "year": 2010,
      "month": 4,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 769.9004
    },
    {
      "year": 2010,
      "month": 5,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 771.9852
    },
    {
      "year": 2010,
      "month": 6,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 774.0755
    },
    {
      "year": 2010,
      "month": 7,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 776.1716
    },
    {
      "year": 2010,
      "month": 8,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 778.2733
    },
    {
      "year": 2010,
      "month": 9,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 780.3807
    },
    {
      "year": 2010,
      "month": 10,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 782.4938
    },
    {
      "year": 2010,
      "month": 11,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 784.6126
    },
    {
      "year": 2010,
      "month": 12,
      "equity": 0.0110955,
      "bond": 0.0080646,
      "cpi": 786.7372
    },
    {
      "year": 2011,
      "month": 1,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 789.6054
    },
    {
      "year": 2011,
      "month": 2,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 792.4841
    },
    {
      "year": 2011,
      "month": 3,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 795.3733
    },
    {
      "year": 2011,
      "month": 4,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 798.2731
    },
    {
      "year": 2011,
      "month": 5,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 801.1834
    },
    {
      "year": 2011,
      "month": 6,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 804.1043
    },
    {
      "year": 2011,
      "month": 7,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 807.0358
    },
    {
      "year": 2011,
      "month": 8,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 809.9781
    },
    {
      "year": 2011,
      "month": 9,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 812.9311
    },
    {
      "year": 2011,
      "month": 10,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 815.8948
    },
    {
      "year": 2011,
      "month": 11,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 818.8693
    },
    {
      "year": 2011,
      "month": 12,
      "equity": -0.0029019,
      "bond": 0.01418,
      "cpi": 821.8547
    },
    {
      "year": 2012,
      "month": 1,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 823.767
    },
    {
      "year": 2012,
      "month": 2,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 825.6838
    },
    {
      "year": 2012,
      "month": 3,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 827.6051
    },
    {
      "year": 2012,
      "month": 4,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 829.5308
    },
    {
      "year": 2012,
      "month": 5,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 831.461
    },
    {
      "year": 2012,
      "month": 6,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 833.3957
    },
    {
      "year": 2012,
      "month": 7,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 835.3349
    },
    {
      "year": 2012,
      "month": 8,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 837.2786
    },
    {
      "year": 2012,
      "month": 9,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 839.2268
    },
    {
      "year": 2012,
      "month": 10,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 841.1796
    },
    {
      "year": 2012,
      "month": 11,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 843.1369
    },
    {
      "year": 2012,
      "month": 12,
      "equity": 0.0095981,
      "bond": 0.003152,
      "cpi": 845.0987
    },
    {
      "year": 2013,
      "month": 1,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 846.8841
    },
    {
      "year": 2013,
      "month": 2,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 848.6732
    },
    {
      "year": 2013,
      "month": 3,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 850.4661
    },
    {
      "year": 2013,
      "month": 4,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 852.2628
    },
    {
      "year": 2013,
      "month": 5,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 854.0633
    },
    {
      "year": 2013,
      "month": 6,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 855.8676
    },
    {
      "year": 2013,
      "month": 7,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 857.6757
    },
    {
      "year": 2013,
      "month": 8,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 859.4877
    },
    {
      "year": 2013,
      "month": 9,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 861.3034
    },
    {
      "year": 2013,
      "month": 10,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 863.123
    },
    {
      "year": 2013,
      "month": 11,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 864.9465
    },
    {
      "year": 2013,
      "month": 12,
      "equity": 0.0156882,
      "bond": -0.0052552,
      "cpi": 866.7738
    },
    {
      "year": 2014,
      "month": 1,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 867.8221
    },
    {
      "year": 2014,
      "month": 2,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 868.8717
    },
    {
      "year": 2014,
      "month": 3,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 869.9226
    },
    {
      "year": 2014,
      "month": 4,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 870.9747
    },
    {
      "year": 2014,
      "month": 5,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 872.0281
    },
    {
      "year": 2014,
      "month": 6,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 873.0828
    },
    {
      "year": 2014,
      "month": 7,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 874.1387
    },
    {
      "year": 2014,
      "month": 8,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 875.1959
    },
    {
      "year": 2014,
      "month": 9,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 876.2544
    },
    {
      "year": 2014,
      "month": 10,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 877.3142
    },
    {
      "year": 2014,
      "month": 11,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 878.3753
    },
    {
      "year": 2014,
      "month": 12,
      "equity": 0.0009908,
      "bond": 0.0121511,
      "cpi": 879.4376
    },
    {
      "year": 2015,
      "month": 1,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.467
    },
    {
      "year": 2015,
      "month": 2,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.4964
    },
    {
      "year": 2015,
      "month": 3,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.5257
    },
    {
      "year": 2015,
      "month": 4,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.5551
    },
    {
      "year": 2015,
      "month": 5,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.5845
    },
    {
      "year": 2015,
      "month": 6,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.6139
    },
    {
      "year": 2015,
      "month": 7,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.6433
    },
    {
      "year": 2015,
      "month": 8,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.6727
    },
    {
      "year": 2015,
      "month": 9,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.7021
    },
    {
      "year": 2015,
      "month": 10,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.7315
    },
    {
      "year": 2015,
      "month": 11,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.7609
    },
    {
      "year": 2015,
      "month": 12,
      "equity": 0.000912,
      "bond": 0.0006374,
      "cpi": 879.7902
    },
    {
      "year": 2016,
      "month": 1,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 880.2724
    },
    {
      "year": 2016,
      "month": 2,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 880.7548
    },
    {
      "year": 2016,
      "month": 3,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 881.2375
    },
    {
      "year": 2016,
      "month": 4,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 881.7205
    },
    {
      "year": 2016,
      "month": 5,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 882.2038
    },
    {
      "year": 2016,
      "month": 6,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 882.6873
    },
    {
      "year": 2016,
      "month": 7,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 883.171
    },
    {
      "year": 2016,
      "month": 8,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 883.6551
    },
    {
      "year": 2016,
      "month": 9,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 884.1394
    },
    {
      "year": 2016,
      "month": 10,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 884.6239
    },
    {
      "year": 2016,
      "month": 11,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 885.1088
    },
    {
      "year": 2016,
      "month": 12,
      "equity": 0.012015,
      "bond": 0.0057532,
      "cpi": 885.5939
    },
    {
      "year": 2017,
      "month": 1,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 887.5622
    },
    {
      "year": 2017,
      "month": 2,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 889.535
    },
    {
      "year": 2017,
      "month": 3,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 891.5121
    },
    {
      "year": 2017,
      "month": 4,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 893.4936
    },
    {
      "year": 2017,
      "month": 5,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 895.4795
    },
    {
      "year": 2017,
      "month": 6,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 897.4698
    },
    {
      "year": 2017,
      "month": 7,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 899.4645
    },
    {
      "year": 2017,
      "month": 8,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 901.4637
    },
    {
      "year": 2017,
      "month": 9,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 903.4673
    },
    {
      "year": 2017,
      "month": 10,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 905.4754
    },
    {
      "year": 2017,
      "month": 11,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 907.4879
    },
    {
      "year": 2017,
      "month": 12,
      "equity": 0.0110306,
      "bond": 0.0030676,
      "cpi": 909.5049
    },
    {
      "year": 2018,
      "month": 1,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 911.3783
    },
    {
      "year": 2018,
      "month": 2,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 913.2556
    },
    {
      "year": 2018,
      "month": 3,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 915.1368
    },
    {
      "year": 2018,
      "month": 4,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 917.0218
    },
    {
      "year": 2018,
      "month": 5,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 918.9107
    },
    {
      "year": 2018,
      "month": 6,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 920.8035
    },
    {
      "year": 2018,
      "month": 7,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 922.7002
    },
    {
      "year": 2018,
      "month": 8,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 924.6008
    },
    {
      "year": 2018,
      "month": 9,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 926.5054
    },
    {
      "year": 2018,
      "month": 10,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 928.4138
    },
    {
      "year": 2018,
      "month": 11,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 930.3262
    },
    {
      "year": 2018,
      "month": 12,
      "equity": -0.0083295,
      "bond": 0.0018421,
      "cpi": 932.2425
    },
    {
      "year": 2019,
      "month": 1,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 933.6295
    },
    {
      "year": 2019,
      "month": 2,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 935.0185
    },
    {
      "year": 2019,
      "month": 3,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 936.4096
    },
    {
      "year": 2019,
      "month": 4,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 937.8027
    },
    {
      "year": 2019,
      "month": 5,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 939.198
    },
    {
      "year": 2019,
      "month": 6,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 940.5953
    },
    {
      "year": 2019,
      "month": 7,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 941.9946
    },
    {
      "year": 2019,
      "month": 8,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 943.3961
    },
    {
      "year": 2019,
      "month": 9,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 944.7997
    },
    {
      "year": 2019,
      "month": 10,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 946.2053
    },
    {
      "year": 2019,
      "month": 11,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 947.613
    },
    {
      "year": 2019,
      "month": 12,
      "equity": 0.0141601,
      "bond": 0.0046462,
      "cpi": 949.0229
    },
    {
      "year": 2020,
      "month": 1,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 949.7317
    },
    {
      "year": 2020,
      "month": 2,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 950.4411
    },
    {
      "year": 2020,
      "month": 3,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 951.151
    },
    {
      "year": 2020,
      "month": 4,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 951.8615
    },
    {
      "year": 2020,
      "month": 5,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 952.5724
    },
    {
      "year": 2020,
      "month": 6,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 953.2839
    },
    {
      "year": 2020,
      "month": 7,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 953.996
    },
    {
      "year": 2020,
      "month": 8,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 954.7085
    },
    {
      "year": 2020,
      "month": 9,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 955.4216
    },
    {
      "year": 2020,
      "month": 10,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 956.1353
    },
    {
      "year": 2020,
      "month": 11,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 956.8494
    },
    {
      "year": 2020,
      "month": 12,
      "equity": -0.0082291,
      "bond": 0.0046718,
      "cpi": 957.5641
    },
    {
      "year": 2021,
      "month": 1,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 959.5521
    },
    {
      "year": 2021,
      "month": 2,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 961.5443
    },
    {
      "year": 2021,
      "month": 3,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 963.5406
    },
    {
      "year": 2021,
      "month": 4,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 965.541
    },
    {
      "year": 2021,
      "month": 5,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 967.5456
    },
    {
      "year": 2021,
      "month": 6,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 969.5543
    },
    {
      "year": 2021,
      "month": 7,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 971.5673
    },
    {
      "year": 2021,
      "month": 8,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 973.5844
    },
    {
      "year": 2021,
      "month": 9,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 975.6056
    },
    {
      "year": 2021,
      "month": 10,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 977.6311
    },
    {
      "year": 2021,
      "month": 11,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 979.6608
    },
    {
      "year": 2021,
      "month": 12,
      "equity": 0.0112003,
      "bond": -0.0044314,
      "cpi": 981.6947
    },
    {
      "year": 2022,
      "month": 1,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 987.9499
    },
    {
      "year": 2022,
      "month": 2,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 994.245
    },
    {
      "year": 2022,
      "month": 3,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1000.5803
    },
    {
      "year": 2022,
      "month": 4,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1006.9558
    },
    {
      "year": 2022,
      "month": 5,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1013.372
    },
    {
      "year": 2022,
      "month": 6,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1019.8291
    },
    {
      "year": 2022,
      "month": 7,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1026.3274
    },
    {
      "year": 2022,
      "month": 8,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1032.867
    },
    {
      "year": 2022,
      "month": 9,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1039.4483
    },
    {
      "year": 2022,
      "month": 10,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1046.0716
    },
    {
      "year": 2022,
      "month": 11,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1052.737
    },
    {
      "year": 2022,
      "month": 12,
      "equity": 0.0007552,
      "bond": -0.0163316,
      "cpi": 1059.4449
    },
    {
      "year": 2023,
      "month": 1,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1065.2607
    },
    {
      "year": 2023,
      "month": 2,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1071.1085
    },
    {
      "year": 2023,
      "month": 3,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1076.9884
    },
    {
      "year": 2023,
      "month": 4,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1082.9005
    },
    {
      "year": 2023,
      "month": 5,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1088.8451
    },
    {
      "year": 2023,
      "month": 6,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1094.8224
    },
    {
      "year": 2023,
      "month": 7,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1100.8324
    },
    {
      "year": 2023,
      "month": 8,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1106.8755
    },
    {
      "year": 2023,
      "month": 9,
      "equity": 0.0030967,
      "bond": 0.0037388,
      "cpi": 1112.9517
    }
  ]
};
