// Historical monthly total returns (1871-present) calculated from Robert Shiller's Yale dataset.
// Equities = S&P 500 (Price + Dividends). Bonds = 10-Year Treasury constant-maturity approximation.
// Returns are nominal decimals. CPI is the Consumer Price Index index level.

export interface MonthlyReturn {
  year: number
  month: number // 1-12
  equity: number
  bond: number
  cpi: number
}

export const HISTORICAL_MONTHLY_RETURNS: MonthlyReturn[] = [
  {
    "year": 1871,
    "month": 2,
    "equity": 0.018393,
    "bond": 0.004433,
    "cpi": 12.84
  },
  {
    "year": 1871,
    "month": 3,
    "equity": 0.029259,
    "bond": 0.003659,
    "cpi": 13.03
  },
  {
    "year": 1871,
    "month": 4,
    "equity": 0.032899,
    "bond": 0.004442,
    "cpi": 12.56
  },
  {
    "year": 1871,
    "month": 5,
    "equity": 0.029887,
    "bond": 0.004442,
    "cpi": 12.27
  },
  {
    "year": 1871,
    "month": 6,
    "equity": -0.003772,
    "bond": 0.003668,
    "cpi": 12.08
  },
  {
    "year": 1871,
    "month": 7,
    "equity": -0.014177,
    "bond": 0.00445,
    "cpi": 12.08
  },
  {
    "year": 1871,
    "month": 8,
    "equity": 0.017266,
    "bond": 0.00445,
    "cpi": 11.89
  },
  {
    "year": 1871,
    "month": 9,
    "equity": 0.014962,
    "bond": 0.003677,
    "cpi": 12.18
  },
  {
    "year": 1871,
    "month": 10,
    "equity": -0.047176,
    "bond": 0.004458,
    "cpi": 12.37
  },
  {
    "year": 1871,
    "month": 11,
    "equity": 0.015614,
    "bond": 0.004458,
    "cpi": 12.37
  },
  {
    "year": 1871,
    "month": 12,
    "equity": 0.026221,
    "bond": 0.003686,
    "cpi": 12.65
  },
  {
    "year": 1872,
    "month": 1,
    "equity": 0.029945,
    "bond": 0.004467,
    "cpi": 12.65
  },
  {
    "year": 1872,
    "month": 2,
    "equity": 0.008688,
    "bond": 0.002922,
    "cpi": 12.65
  },
  {
    "year": 1872,
    "month": 3,
    "equity": 0.037398,
    "bond": 0.002941,
    "cpi": 12.84
  },
  {
    "year": 1872,
    "month": 4,
    "equity": 0.032297,
    "bond": 0.002959,
    "cpi": 13.13
  },
  {
    "year": 1872,
    "month": 5,
    "equity": 0.004451,
    "bond": 0.003746,
    "cpi": 13.13
  },
  {
    "year": 1872,
    "month": 6,
    "equity": -0.005148,
    "bond": 0.002986,
    "cpi": 13.03
  },
  {
    "year": 1872,
    "month": 7,
    "equity": -0.001246,
    "bond": 0.003004,
    "cpi": 12.84
  },
  {
    "year": 1872,
    "month": 8,
    "equity": -0.00708,
    "bond": 0.003022,
    "cpi": 12.94
  },
  {
    "year": 1872,
    "month": 9,
    "equity": -0.013062,
    "bond": 0.00304,
    "cpi": 13.03
  },
  {
    "year": 1872,
    "month": 10,
    "equity": 0.008978,
    "bond": 0.003825,
    "cpi": 12.75
  },
  {
    "year": 1872,
    "month": 11,
    "equity": 0.000951,
    "bond": 0.003067,
    "cpi": 13.13
  },
  {
    "year": 1872,
    "month": 12,
    "equity": 0.029293,
    "bond": 0.003085,
    "cpi": 12.94
  },
  {
    "year": 1873,
    "month": 1,
    "equity": 0.012862,
    "bond": 0.003103,
    "cpi": 12.94
  },
  {
    "year": 1873,
    "month": 2,
    "equity": 0.012802,
    "bond": 0.005415,
    "cpi": 13.23
  },
  {
    "year": 1873,
    "month": 3,
    "equity": -0.002791,
    "bond": 0.005407,
    "cpi": 13.23
  },
  {
    "year": 1873,
    "month": 4,
    "equity": -0.008643,
    "bond": 0.005399,
    "cpi": 13.23
  },
  {
    "year": 1873,
    "month": 5,
    "equity": 0.007151,
    "bond": 0.005391,
    "cpi": 12.94
  },
  {
    "year": 1873,
    "month": 6,
    "equity": -0.008663,
    "bond": 0.005383,
    "cpi": 12.56
  },
  {
    "year": 1873,
    "month": 7,
    "equity": 0.003305,
    "bond": 0.004608,
    "cpi": 12.56
  },
  {
    "year": 1873,
    "month": 8,
    "equity": 0.005366,
    "bond": 0.005375,
    "cpi": 12.56
  },
  {
    "year": 1873,
    "month": 9,
    "equity": -0.071051,
    "bond": 0.005368,
    "cpi": 12.56
  },
  {
    "year": 1873,
    "month": 10,
    "equity": -0.081245,
    "bond": 0.00536,
    "cpi": 12.27
  },
  {
    "year": 1873,
    "month": 11,
    "equity": -0.029286,
    "bond": 0.005352,
    "cpi": 11.89
  },
  {
    "year": 1873,
    "month": 12,
    "equity": 0.100866,
    "bond": 0.005344,
    "cpi": 12.18
  },
  {
    "year": 1874,
    "month": 1,
    "equity": 0.06052,
    "bond": 0.005336,
    "cpi": 12.37
  },
  {
    "year": 1874,
    "month": 2,
    "equity": 0.035944,
    "bond": 0.006868,
    "cpi": 12.37
  },
  {
    "year": 1874,
    "month": 3,
    "equity": -0.008854,
    "bond": 0.007619,
    "cpi": 12.37
  },
  {
    "year": 1874,
    "month": 4,
    "equity": -0.02167,
    "bond": 0.006817,
    "cpi": 12.18
  },
  {
    "year": 1874,
    "month": 5,
    "equity": -0.020109,
    "bond": 0.006796,
    "cpi": 12.08
  },
  {
    "year": 1874,
    "month": 6,
    "equity": 0.001674,
    "bond": 0.00755,
    "cpi": 11.8
  },
  {
    "year": 1874,
    "month": 7,
    "equity": 0.006166,
    "bond": 0.006745,
    "cpi": 11.89
  },
  {
    "year": 1874,
    "month": 8,
    "equity": 0.008408,
    "bond": 0.006723,
    "cpi": 11.8
  },
  {
    "year": 1874,
    "month": 9,
    "equity": 0.021812,
    "bond": 0.007481,
    "cpi": 11.8
  },
  {
    "year": 1874,
    "month": 10,
    "equity": 0.003855,
    "bond": 0.006672,
    "cpi": 11.61
  },
  {
    "year": 1874,
    "month": 11,
    "equity": 0.014901,
    "bond": 0.00665,
    "cpi": 11.51
  },
  {
    "year": 1874,
    "month": 12,
    "equity": -0.000547,
    "bond": 0.007412,
    "cpi": 11.51
  },
  {
    "year": 1875,
    "month": 1,
    "equity": 0.006011,
    "bond": 0.006599,
    "cpi": 11.51
  },
  {
    "year": 1875,
    "month": 2,
    "equity": 0.003763,
    "bond": 0.007363,
    "cpi": 11.51
  },
  {
    "year": 1875,
    "month": 3,
    "equity": 0.019178,
    "bond": 0.007336,
    "cpi": 11.51
  },
  {
    "year": 1875,
    "month": 4,
    "equity": 0.018882,
    "bond": 0.007308,
    "cpi": 11.61
  },
  {
    "year": 1875,
    "month": 5,
    "equity": -0.03302,
    "bond": 0.007281,
    "cpi": 11.32
  },
  {
    "year": 1875,
    "month": 6,
    "equity": -0.014262,
    "bond": 0.007253,
    "cpi": 11.13
  },
  {
    "year": 1875,
    "month": 7,
    "equity": 0.008229,
    "bond": 0.007226,
    "cpi": 11.13
  },
  {
    "year": 1875,
    "month": 8,
    "equity": 0.01044,
    "bond": 0.007198,
    "cpi": 11.23
  },
  {
    "year": 1875,
    "month": 9,
    "equity": -0.00326,
    "bond": 0.007171,
    "cpi": 11.13
  },
  {
    "year": 1875,
    "month": 10,
    "equity": -0.010202,
    "bond": 0.007143,
    "cpi": 11.13
  },
  {
    "year": 1875,
    "month": 11,
    "equity": 0.022141,
    "bond": 0.007116,
    "cpi": 11.04
  },
  {
    "year": 1875,
    "month": 12,
    "equity": 0.005721,
    "bond": 0.007089,
    "cpi": 10.94
  },
  {
    "year": 1876,
    "month": 1,
    "equity": 0.026316,
    "bond": 0.007061,
    "cpi": 10.85
  },
  {
    "year": 1876,
    "month": 2,
    "equity": 0.019058,
    "bond": 0.004626,
    "cpi": 10.85
  },
  {
    "year": 1876,
    "month": 3,
    "equity": 0.003319,
    "bond": 0.004618,
    "cpi": 10.85
  },
  {
    "year": 1876,
    "month": 4,
    "equity": -0.032151,
    "bond": 0.00461,
    "cpi": 10.75
  },
  {
    "year": 1876,
    "month": 5,
    "equity": -0.031106,
    "bond": 0.005405,
    "cpi": 10.37
  },
  {
    "year": 1876,
    "month": 6,
    "equity": -0.001196,
    "bond": 0.004586,
    "cpi": 10.09
  },
  {
    "year": 1876,
    "month": 7,
    "equity": -0.006024,
    "bond": 0.004578,
    "cpi": 10.09
  },
  {
    "year": 1876,
    "month": 8,
    "equity": -0.035366,
    "bond": 0.00457,
    "cpi": 10.18
  },
  {
    "year": 1876,
    "month": 9,
    "equity": -0.054707,
    "bond": 0.004562,
    "cpi": 10.28
  },
  {
    "year": 1876,
    "month": 10,
    "equity": 0.001355,
    "bond": 0.004554,
    "cpi": 10.47
  },
  {
    "year": 1876,
    "month": 11,
    "equity": -0.012262,
    "bond": 0.005352,
    "cpi": 10.56
  },
  {
    "year": 1876,
    "month": 12,
    "equity": 0.001389,
    "bond": 0.004531,
    "cpi": 10.75
  },
  {
    "year": 1877,
    "month": 1,
    "equity": -0.001611,
    "bond": 0.004523,
    "cpi": 10.94
  },
  {
    "year": 1877,
    "month": 2,
    "equity": -0.052542,
    "bond": 0.004515,
    "cpi": 10.66
  },
  {
    "year": 1877,
    "month": 3,
    "equity": -0.044099,
    "bond": 0.004507,
    "cpi": 10.18
  },
  {
    "year": 1877,
    "month": 4,
    "equity": -0.065634,
    "bond": 0.004499,
    "cpi": 10.47
  },
  {
    "year": 1877,
    "month": 5,
    "equity": 0.007205,
    "bond": 0.004491,
    "cpi": 10.66
  },
  {
    "year": 1877,
    "month": 6,
    "equity": -0.064484,
    "bond": 0.004483,
    "cpi": 10.09
  },
  {
    "year": 1877,
    "month": 7,
    "equity": 0.051154,
    "bond": 0.004475,
    "cpi": 10.18
  },
  {
    "year": 1877,
    "month": 8,
    "equity": 0.076804,
    "bond": 0.003658,
    "cpi": 9.8
  },
  {
    "year": 1877,
    "month": 9,
    "equity": 0.068238,
    "bond": 0.004467,
    "cpi": 9.7
  },
  {
    "year": 1877,
    "month": 10,
    "equity": 0.026962,
    "bond": 0.004459,
    "cpi": 9.7
  },
  {
    "year": 1877,
    "month": 11,
    "equity": -0.010091,
    "bond": 0.004451,
    "cpi": 9.51
  },
  {
    "year": 1877,
    "month": 12,
    "equity": 0.001789,
    "bond": 0.004443,
    "cpi": 9.51
  },
  {
    "year": 1878,
    "month": 1,
    "equity": 0.004851,
    "bond": 0.004435,
    "cpi": 9.23
  },
  {
    "year": 1878,
    "month": 2,
    "equity": -0.01671,
    "bond": 0.004427,
    "cpi": 9.13
  },
  {
    "year": 1878,
    "month": 3,
    "equity": 0.023781,
    "bond": 0.004419,
    "cpi": 8.94
  },
  {
    "year": 1878,
    "month": 4,
    "equity": 0.03258,
    "bond": 0.004411,
    "cpi": 8.85
  },
  {
    "year": 1878,
    "month": 5,
    "equity": 0.007653,
    "bond": 0.004403,
    "cpi": 8.56
  },
  {
    "year": 1878,
    "month": 6,
    "equity": 0.025574,
    "bond": 0.004395,
    "cpi": 8.37
  },
  {
    "year": 1878,
    "month": 7,
    "equity": 0.025029,
    "bond": 0.004387,
    "cpi": 8.47
  },
  {
    "year": 1878,
    "month": 8,
    "equity": -0.004231,
    "bond": 0.004379,
    "cpi": 8.56
  },
  {
    "year": 1878,
    "month": 9,
    "equity": 0.024698,
    "bond": 0.004371,
    "cpi": 8.56
  },
  {
    "year": 1878,
    "month": 10,
    "equity": -0.007062,
    "bond": 0.004364,
    "cpi": 8.47
  },
  {
    "year": 1878,
    "month": 11,
    "equity": 0.001456,
    "bond": 0.004356,
    "cpi": 8.37
  },
  {
    "year": 1878,
    "month": 12,
    "equity": -0.001441,
    "bond": 0.004348,
    "cpi": 8.18
  },
  {
    "year": 1879,
    "month": 1,
    "equity": 0.04207,
    "bond": 0.00434,
    "cpi": 8.28
  },
  {
    "year": 1879,
    "month": 2,
    "equity": 0.04058,
    "bond": 0.005147,
    "cpi": 8.37
  },
  {
    "year": 1879,
    "month": 3,
    "equity": -0.012017,
    "bond": 0.004316,
    "cpi": 8.28
  },
  {
    "year": 1879,
    "month": 4,
    "equity": 0.037139,
    "bond": 0.005125,
    "cpi": 8.18
  },
  {
    "year": 1879,
    "month": 5,
    "equity": 0.049255,
    "bond": 0.00511,
    "cpi": 8.18
  },
  {
    "year": 1879,
    "month": 6,
    "equity": 0.009095,
    "bond": 0.004276,
    "cpi": 8.09
  },
  {
    "year": 1879,
    "month": 7,
    "equity": 0.024236,
    "bond": 0.005087,
    "cpi": 8.18
  },
  {
    "year": 1879,
    "month": 8,
    "equity": 0.011413,
    "bond": 0.005072,
    "cpi": 8.18
  },
  {
    "year": 1879,
    "month": 9,
    "equity": 0.040848,
    "bond": 0.004236,
    "cpi": 8.47
  },
  {
    "year": 1879,
    "month": 10,
    "equity": 0.112889,
    "bond": 0.005049,
    "cpi": 8.94
  },
  {
    "year": 1879,
    "month": 11,
    "equity": 0.05695,
    "bond": 0.005034,
    "cpi": 9.42
  },
  {
    "year": 1879,
    "month": 12,
    "equity": 0.001352,
    "bond": 0.004197,
    "cpi": 9.7
  },
  {
    "year": 1880,
    "month": 1,
    "equity": 0.04209,
    "bond": 0.005011,
    "cpi": 9.99
  },
  {
    "year": 1880,
    "month": 2,
    "equity": 0.021037,
    "bond": 0.00582,
    "cpi": 9.99
  },
  {
    "year": 1880,
    "month": 3,
    "equity": 0.022676,
    "bond": 0.004973,
    "cpi": 10.09
  },
  {
    "year": 1880,
    "month": 4,
    "equity": -0.019182,
    "bond": 0.005785,
    "cpi": 9.7
  },
  {
    "year": 1880,
    "month": 5,
    "equity": -0.075531,
    "bond": 0.005763,
    "cpi": 9.42
  },
  {
    "year": 1880,
    "month": 6,
    "equity": 0.008211,
    "bond": 0.004913,
    "cpi": 9.23
  },
  {
    "year": 1880,
    "month": 7,
    "equity": 0.050017,
    "bond": 0.005727,
    "cpi": 9.23
  },
  {
    "year": 1880,
    "month": 8,
    "equity": 0.03992,
    "bond": 0.005706,
    "cpi": 9.23
  },
  {
    "year": 1880,
    "month": 9,
    "equity": 0.002007,
    "bond": 0.004853,
    "cpi": 9.32
  },
  {
    "year": 1880,
    "month": 10,
    "equity": 0.032979,
    "bond": 0.00567,
    "cpi": 9.32
  },
  {
    "year": 1880,
    "month": 11,
    "equity": 0.05652,
    "bond": 0.005648,
    "cpi": 9.42
  },
  {
    "year": 1880,
    "month": 12,
    "equity": 0.04486,
    "bond": 0.004792,
    "cpi": 9.51
  },
  {
    "year": 1881,
    "month": 1,
    "equity": 0.063713,
    "bond": 0.005613,
    "cpi": 9.42
  },
  {
    "year": 1881,
    "month": 2,
    "equity": 0.000404,
    "bond": 0.003919,
    "cpi": 9.51
  },
  {
    "year": 1881,
    "month": 3,
    "equity": 0.015059,
    "bond": 0.003075,
    "cpi": 9.51
  },
  {
    "year": 1881,
    "month": 4,
    "equity": 0.000534,
    "bond": 0.003911,
    "cpi": 9.61
  },
  {
    "year": 1881,
    "month": 5,
    "equity": 0.048834,
    "bond": 0.003903,
    "cpi": 9.51
  },
  {
    "year": 1881,
    "month": 6,
    "equity": 0.016026,
    "bond": 0.003058,
    "cpi": 9.51
  },
  {
    "year": 1881,
    "month": 7,
    "equity": -0.031218,
    "bond": 0.003895,
    "cpi": 9.61
  },
  {
    "year": 1881,
    "month": 8,
    "equity": -0.019685,
    "bond": 0.003887,
    "cpi": 9.8
  },
  {
    "year": 1881,
    "month": 9,
    "equity": 0.012164,
    "bond": 0.003042,
    "cpi": 10.18
  },
  {
    "year": 1881,
    "month": 10,
    "equity": -0.011867,
    "bond": 0.003879,
    "cpi": 10.28
  },
  {
    "year": 1881,
    "month": 11,
    "equity": 0.010772,
    "bond": 0.003871,
    "cpi": 10.18
  },
  {
    "year": 1881,
    "month": 12,
    "equity": -0.024771,
    "bond": 0.003025,
    "cpi": 10.18
  },
  {
    "year": 1882,
    "month": 1,
    "equity": -0.010538,
    "bond": 0.003863,
    "cpi": 10.18
  },
  {
    "year": 1882,
    "month": 2,
    "equity": -0.017455,
    "bond": 0.003017,
    "cpi": 10.28
  },
  {
    "year": 1882,
    "month": 3,
    "equity": 0.002879,
    "bond": 0.003017,
    "cpi": 10.28
  },
  {
    "year": 1882,
    "month": 4,
    "equity": 0.004614,
    "bond": 0.003017,
    "cpi": 10.37
  },
  {
    "year": 1882,
    "month": 5,
    "equity": -0.007497,
    "bond": 0.003017,
    "cpi": 10.47
  },
  {
    "year": 1882,
    "month": 6,
    "equity": -0.000584,
    "bond": 0.003017,
    "cpi": 10.56
  },
  {
    "year": 1882,
    "month": 7,
    "equity": 0.061033,
    "bond": 0.003017,
    "cpi": 10.47
  },
  {
    "year": 1882,
    "month": 8,
    "equity": 0.034444,
    "bond": 0.002179,
    "cpi": 10.56
  },
  {
    "year": 1882,
    "month": 9,
    "equity": 0.014024,
    "bond": 0.003025,
    "cpi": 10.28
  },
  {
    "year": 1882,
    "month": 10,
    "equity": -0.02297,
    "bond": 0.003025,
    "cpi": 10.18
  },
  {
    "year": 1882,
    "month": 11,
    "equity": -0.03844,
    "bond": 0.003025,
    "cpi": 10.09
  },
  {
    "year": 1882,
    "month": 12,
    "equity": 0.009753,
    "bond": 0.003025,
    "cpi": 9.99
  },
  {
    "year": 1883,
    "month": 1,
    "equity": -0.000559,
    "bond": 0.003025,
    "cpi": 9.99
  },
  {
    "year": 1883,
    "month": 2,
    "equity": -0.017761,
    "bond": 0.003025,
    "cpi": 10.09
  },
  {
    "year": 1883,
    "month": 3,
    "equity": 0.017055,
    "bond": 0.003025,
    "cpi": 9.99
  },
  {
    "year": 1883,
    "month": 4,
    "equity": 0.025555,
    "bond": 0.003025,
    "cpi": 9.9
  },
  {
    "year": 1883,
    "month": 5,
    "equity": -0.012433,
    "bond": 0.003025,
    "cpi": 9.8
  },
  {
    "year": 1883,
    "month": 6,
    "equity": 0.013359,
    "bond": 0.003025,
    "cpi": 9.51
  },
  {
    "year": 1883,
    "month": 7,
    "equity": -0.010799,
    "bond": 0.003863,
    "cpi": 9.32
  },
  {
    "year": 1883,
    "month": 8,
    "equity": -0.040624,
    "bond": 0.003017,
    "cpi": 9.32
  },
  {
    "year": 1883,
    "month": 9,
    "equity": 0.015958,
    "bond": 0.003017,
    "cpi": 9.23
  },
  {
    "year": 1883,
    "month": 10,
    "equity": -0.022178,
    "bond": 0.003017,
    "cpi": 9.23
  },
  {
    "year": 1883,
    "month": 11,
    "equity": 0.019969,
    "bond": 0.003017,
    "cpi": 9.13
  },
  {
    "year": 1883,
    "month": 12,
    "equity": -0.016941,
    "bond": 0.003017,
    "cpi": 9.23
  },
  {
    "year": 1884,
    "month": 1,
    "equity": -0.024839,
    "bond": 0.003017,
    "cpi": 9.23
  },
  {
    "year": 1884,
    "month": 2,
    "equity": 0.032283,
    "bond": 0.003855,
    "cpi": 9.23
  },
  {
    "year": 1884,
    "month": 3,
    "equity": 0.001331,
    "bond": 0.003847,
    "cpi": 9.23
  },
  {
    "year": 1884,
    "month": 4,
    "equity": -0.0402,
    "bond": 0.003839,
    "cpi": 9.04
  },
  {
    "year": 1884,
    "month": 5,
    "equity": -0.07573,
    "bond": 0.002992,
    "cpi": 8.85
  },
  {
    "year": 1884,
    "month": 6,
    "equity": -0.035125,
    "bond": 0.003831,
    "cpi": 8.85
  },
  {
    "year": 1884,
    "month": 7,
    "equity": 0.005947,
    "bond": 0.003823,
    "cpi": 8.75
  },
  {
    "year": 1884,
    "month": 8,
    "equity": 0.068698,
    "bond": 0.003815,
    "cpi": 8.75
  },
  {
    "year": 1884,
    "month": 9,
    "equity": -0.026108,
    "bond": 0.003807,
    "cpi": 8.66
  },
  {
    "year": 1884,
    "month": 10,
    "equity": -0.026992,
    "bond": 0.003799,
    "cpi": 8.56
  },
  {
    "year": 1884,
    "month": 11,
    "equity": -0.01442,
    "bond": 0.00295,
    "cpi": 8.37
  },
  {
    "year": 1884,
    "month": 12,
    "equity": 0.00364,
    "bond": 0.003792,
    "cpi": 8.28
  },
  {
    "year": 1885,
    "month": 1,
    "equity": -0.0172,
    "bond": 0.003784,
    "cpi": 8.28
  },
  {
    "year": 1885,
    "month": 2,
    "equity": 0.036523,
    "bond": 0.003776,
    "cpi": 8.37
  },
  {
    "year": 1885,
    "month": 3,
    "equity": 0.007866,
    "bond": 0.003768,
    "cpi": 8.18
  },
  {
    "year": 1885,
    "month": 4,
    "equity": 0.003172,
    "bond": 0.004604,
    "cpi": 8.28
  },
  {
    "year": 1885,
    "month": 5,
    "equity": -0.006087,
    "bond": 0.003744,
    "cpi": 8.09
  },
  {
    "year": 1885,
    "month": 6,
    "equity": 0.000675,
    "bond": 0.003736,
    "cpi": 7.9
  },
  {
    "year": 1885,
    "month": 7,
    "equity": 0.042426,
    "bond": 0.004574,
    "cpi": 7.99
  },
  {
    "year": 1885,
    "month": 8,
    "equity": 0.060973,
    "bond": 0.003712,
    "cpi": 7.99
  },
  {
    "year": 1885,
    "month": 9,
    "equity": -0.008183,
    "bond": 0.003704,
    "cpi": 7.9
  },
  {
    "year": 1885,
    "month": 10,
    "equity": 0.062575,
    "bond": 0.003696,
    "cpi": 7.9
  },
  {
    "year": 1885,
    "month": 11,
    "equity": 0.069204,
    "bond": 0.003688,
    "cpi": 7.99
  },
  {
    "year": 1885,
    "month": 12,
    "equity": -0.003817,
    "bond": 0.004528,
    "cpi": 8.18
  },
  {
    "year": 1886,
    "month": 1,
    "equity": 0.003819,
    "bond": 0.003665,
    "cpi": 7.99
  },
  {
    "year": 1886,
    "month": 2,
    "equity": 0.023024,
    "bond": 0.001961,
    "cpi": 7.99
  },
  {
    "year": 1886,
    "month": 3,
    "equity": -0.01706,
    "bond": 0.001123,
    "cpi": 7.9
  },
  {
    "year": 1886,
    "month": 4,
    "equity": -0.009741,
    "bond": 0.001987,
    "cpi": 7.8
  },
  {
    "year": 1886,
    "month": 5,
    "equity": -0.01576,
    "bond": 0.001996,
    "cpi": 7.61
  },
  {
    "year": 1886,
    "month": 6,
    "equity": 0.049635,
    "bond": 0.002004,
    "cpi": 7.52
  },
  {
    "year": 1886,
    "month": 7,
    "equity": 0.018862,
    "bond": 0.002013,
    "cpi": 7.61
  },
  {
    "year": 1886,
    "month": 8,
    "equity": 0.011049,
    "bond": 0.001178,
    "cpi": 7.71
  },
  {
    "year": 1886,
    "month": 9,
    "equity": 0.029562,
    "bond": 0.002039,
    "cpi": 7.71
  },
  {
    "year": 1886,
    "month": 10,
    "equity": 0.028786,
    "bond": 0.002048,
    "cpi": 7.71
  },
  {
    "year": 1886,
    "month": 11,
    "equity": 0.028049,
    "bond": 0.001215,
    "cpi": 7.71
  },
  {
    "year": 1886,
    "month": 12,
    "equity": -0.02274,
    "bond": 0.002074,
    "cpi": 7.8
  },
  {
    "year": 1887,
    "month": 1,
    "equity": -0.007351,
    "bond": 0.002083,
    "cpi": 7.99
  },
  {
    "year": 1887,
    "month": 2,
    "equity": -0.003808,
    "bond": 0.002092,
    "cpi": 8.09
  },
  {
    "year": 1887,
    "month": 3,
    "equity": 0.026888,
    "bond": 0.00126,
    "cpi": 8.09
  },
  {
    "year": 1887,
    "month": 4,
    "equity": 0.026308,
    "bond": 0.002118,
    "cpi": 8.09
  },
  {
    "year": 1887,
    "month": 5,
    "equity": 0.020582,
    "bond": 0.002127,
    "cpi": 8.09
  },
  {
    "year": 1887,
    "month": 6,
    "equity": -0.025494,
    "bond": 0.002135,
    "cpi": 7.99
  },
  {
    "year": 1887,
    "month": 7,
    "equity": -0.020979,
    "bond": 0.002144,
    "cpi": 7.9
  },
  {
    "year": 1887,
    "month": 8,
    "equity": -0.021467,
    "bond": 0.001315,
    "cpi": 7.99
  },
  {
    "year": 1887,
    "month": 9,
    "equity": -0.009136,
    "bond": 0.00217,
    "cpi": 7.9
  },
  {
    "year": 1887,
    "month": 10,
    "equity": -0.029662,
    "bond": 0.002179,
    "cpi": 7.99
  },
  {
    "year": 1887,
    "month": 11,
    "equity": 0.023197,
    "bond": 0.001351,
    "cpi": 8.09
  },
  {
    "year": 1887,
    "month": 12,
    "equity": -0.00173,
    "bond": 0.002205,
    "cpi": 8.28
  },
  {
    "year": 1888,
    "month": 1,
    "equity": 0.011516,
    "bond": 0.002214,
    "cpi": 8.37
  },
  {
    "year": 1888,
    "month": 2,
    "equity": -0.001778,
    "bond": 0.004732,
    "cpi": 8.28
  },
  {
    "year": 1888,
    "month": 3,
    "equity": -0.034012,
    "bond": 0.004717,
    "cpi": 8.28
  },
  {
    "year": 1888,
    "month": 4,
    "equity": 0.007928,
    "bond": 0.003863,
    "cpi": 8.18
  },
  {
    "year": 1888,
    "month": 5,
    "equity": 0.017675,
    "bond": 0.004694,
    "cpi": 8.09
  },
  {
    "year": 1888,
    "month": 6,
    "equity": -0.027079,
    "bond": 0.004679,
    "cpi": 7.99
  },
  {
    "year": 1888,
    "month": 7,
    "equity": 0.029912,
    "bond": 0.004664,
    "cpi": 8.09
  },
  {
    "year": 1888,
    "month": 8,
    "equity": 0.025238,
    "bond": 0.004649,
    "cpi": 8.09
  },
  {
    "year": 1888,
    "month": 9,
    "equity": 0.028492,
    "bond": 0.004634,
    "cpi": 8.09
  },
  {
    "year": 1888,
    "month": 10,
    "equity": -0.001963,
    "bond": 0.004619,
    "cpi": 8.18
  },
  {
    "year": 1888,
    "month": 11,
    "equity": -0.016952,
    "bond": 0.00376,
    "cpi": 8.28
  },
  {
    "year": 1888,
    "month": 12,
    "equity": -0.015426,
    "bond": 0.004596,
    "cpi": 8.28
  },
  {
    "year": 1889,
    "month": 1,
    "equity": 0.023171,
    "bond": 0.004581,
    "cpi": 7.99
  },
  {
    "year": 1889,
    "month": 2,
    "equity": 0.015081,
    "bond": 0.002875,
    "cpi": 7.9
  },
  {
    "year": 1889,
    "month": 3,
    "equity": -0.017178,
    "bond": 0.00372,
    "cpi": 7.8
  },
  {
    "year": 1889,
    "month": 4,
    "equity": 0.001713,
    "bond": 0.002867,
    "cpi": 7.8
  },
  {
    "year": 1889,
    "month": 5,
    "equity": 0.03066,
    "bond": 0.002867,
    "cpi": 7.61
  },
  {
    "year": 1889,
    "month": 6,
    "equity": 0.020442,
    "bond": 0.002867,
    "cpi": 7.61
  },
  {
    "year": 1889,
    "month": 7,
    "equity": -0.016879,
    "bond": 0.002867,
    "cpi": 7.61
  },
  {
    "year": 1889,
    "month": 8,
    "equity": 0.016719,
    "bond": 0.003712,
    "cpi": 7.61
  },
  {
    "year": 1889,
    "month": 9,
    "equity": 0.027661,
    "bond": 0.002858,
    "cpi": 7.71
  },
  {
    "year": 1889,
    "month": 10,
    "equity": -0.014823,
    "bond": 0.002858,
    "cpi": 7.71
  },
  {
    "year": 1889,
    "month": 11,
    "equity": -0.005852,
    "bond": 0.002858,
    "cpi": 7.71
  },
  {
    "year": 1889,
    "month": 12,
    "equity": -0.002181,
    "bond": 0.003704,
    "cpi": 7.8
  },
  {
    "year": 1890,
    "month": 1,
    "equity": 0.014724,
    "bond": 0.00285,
    "cpi": 7.61
  },
  {
    "year": 1890,
    "month": 2,
    "equity": -0.007745,
    "bond": 0.00116,
    "cpi": 7.61
  },
  {
    "year": 1890,
    "month": 3,
    "equity": -0.004073,
    "bond": 0.002022,
    "cpi": 7.61
  },
  {
    "year": 1890,
    "month": 4,
    "equity": 0.024306,
    "bond": 0.001187,
    "cpi": 7.61
  },
  {
    "year": 1890,
    "month": 5,
    "equity": 0.046073,
    "bond": 0.001205,
    "cpi": 7.71
  },
  {
    "year": 1890,
    "month": 6,
    "equity": -0.003855,
    "bond": 0.002066,
    "cpi": 7.71
  },
  {
    "year": 1890,
    "month": 7,
    "equity": -0.003883,
    "bond": 0.001233,
    "cpi": 7.71
  },
  {
    "year": 1890,
    "month": 8,
    "equity": -0.020156,
    "bond": 0.001251,
    "cpi": 7.99
  },
  {
    "year": 1890,
    "month": 9,
    "equity": -0.013247,
    "bond": 0.002109,
    "cpi": 8.09
  },
  {
    "year": 1890,
    "month": 10,
    "equity": -0.041667,
    "bond": 0.001278,
    "cpi": 8.09
  },
  {
    "year": 1890,
    "month": 11,
    "equity": -0.069226,
    "bond": 0.001297,
    "cpi": 7.9
  },
  {
    "year": 1890,
    "month": 12,
    "equity": -0.019462,
    "bond": 0.002153,
    "cpi": 7.9
  },
  {
    "year": 1891,
    "month": 1,
    "equity": 0.056159,
    "bond": 0.001324,
    "cpi": 7.8
  },
  {
    "year": 1891,
    "month": 2,
    "equity": 0.016185,
    "bond": 0.003017,
    "cpi": 7.9
  },
  {
    "year": 1891,
    "month": 3,
    "equity": -0.014626,
    "bond": 0.003017,
    "cpi": 7.99
  },
  {
    "year": 1891,
    "month": 4,
    "equity": 0.037076,
    "bond": 0.003855,
    "cpi": 8.09
  },
  {
    "year": 1891,
    "month": 5,
    "equity": -0.000335,
    "bond": 0.003008,
    "cpi": 7.99
  },
  {
    "year": 1891,
    "month": 6,
    "equity": -0.016498,
    "bond": 0.003008,
    "cpi": 7.8
  },
  {
    "year": 1891,
    "month": 7,
    "equity": -0.012715,
    "bond": 0.003008,
    "cpi": 7.71
  },
  {
    "year": 1891,
    "month": 8,
    "equity": 0.037386,
    "bond": 0.003008,
    "cpi": 7.71
  },
  {
    "year": 1891,
    "month": 9,
    "equity": 0.084855,
    "bond": 0.003008,
    "cpi": 7.61
  },
  {
    "year": 1891,
    "month": 10,
    "equity": 0.00344,
    "bond": 0.003847,
    "cpi": 7.61
  },
  {
    "year": 1891,
    "month": 11,
    "equity": -0.01157,
    "bond": 0.003,
    "cpi": 7.52
  },
  {
    "year": 1891,
    "month": 12,
    "equity": 0.033968,
    "bond": 0.003,
    "cpi": 7.52
  },
  {
    "year": 1892,
    "month": 1,
    "equity": 0.021899,
    "bond": 0.003,
    "cpi": 7.33
  },
  {
    "year": 1892,
    "month": 2,
    "equity": 0.005192,
    "bond": 0.002162,
    "cpi": 7.33
  },
  {
    "year": 1892,
    "month": 3,
    "equity": 0.014266,
    "bond": 0.00217,
    "cpi": 7.14
  },
  {
    "year": 1892,
    "month": 4,
    "equity": 0.001593,
    "bond": 0.001342,
    "cpi": 7.04
  },
  {
    "year": 1892,
    "month": 5,
    "equity": 0.003416,
    "bond": 0.002197,
    "cpi": 7.04
  },
  {
    "year": 1892,
    "month": 6,
    "equity": -0.001945,
    "bond": 0.002205,
    "cpi": 7.04
  },
  {
    "year": 1892,
    "month": 7,
    "equity": 0.003485,
    "bond": 0.002214,
    "cpi": 7.23
  },
  {
    "year": 1892,
    "month": 8,
    "equity": 0.01795,
    "bond": 0.001388,
    "cpi": 7.33
  },
  {
    "year": 1892,
    "month": 9,
    "equity": -0.021426,
    "bond": 0.00224,
    "cpi": 7.33
  },
  {
    "year": 1892,
    "month": 10,
    "equity": 0.023672,
    "bond": 0.002249,
    "cpi": 7.33
  },
  {
    "year": 1892,
    "month": 11,
    "equity": -2.5e-05,
    "bond": 0.001424,
    "cpi": 7.52
  },
  {
    "year": 1892,
    "month": 12,
    "equity": -0.007181,
    "bond": 0.002275,
    "cpi": 7.61
  },
  {
    "year": 1893,
    "month": 1,
    "equity": 0.021791,
    "bond": 0.002284,
    "cpi": 7.9
  },
  {
    "year": 1893,
    "month": 2,
    "equity": -0.014235,
    "bond": 0.003125,
    "cpi": 7.99
  },
  {
    "year": 1893,
    "month": 3,
    "equity": -0.03263,
    "bond": 0.003958,
    "cpi": 7.8
  },
  {
    "year": 1893,
    "month": 4,
    "equity": 0.003818,
    "bond": 0.003117,
    "cpi": 7.71
  },
  {
    "year": 1893,
    "month": 5,
    "equity": -0.08468,
    "bond": 0.00395,
    "cpi": 7.61
  },
  {
    "year": 1893,
    "month": 6,
    "equity": -0.043302,
    "bond": 0.003108,
    "cpi": 7.42
  },
  {
    "year": 1893,
    "month": 7,
    "equity": -0.088832,
    "bond": 0.003108,
    "cpi": 7.23
  },
  {
    "year": 1893,
    "month": 8,
    "equity": -0.019005,
    "bond": 0.003942,
    "cpi": 6.95
  },
  {
    "year": 1893,
    "month": 9,
    "equity": 0.076134,
    "bond": 0.0031,
    "cpi": 7.23
  },
  {
    "year": 1893,
    "month": 10,
    "equity": 0.034483,
    "bond": 0.003934,
    "cpi": 7.33
  },
  {
    "year": 1893,
    "month": 11,
    "equity": 0.02017,
    "bond": 0.003092,
    "cpi": 7.14
  },
  {
    "year": 1893,
    "month": 12,
    "equity": -0.030452,
    "bond": 0.003926,
    "cpi": 7.04
  },
  {
    "year": 1894,
    "month": 1,
    "equity": -0.015746,
    "bond": 0.003083,
    "cpi": 6.85
  },
  {
    "year": 1894,
    "month": 2,
    "equity": 0.018582,
    "bond": 0.004754,
    "cpi": 6.76
  },
  {
    "year": 1894,
    "month": 3,
    "equity": 0.034247,
    "bond": 0.004739,
    "cpi": 6.57
  },
  {
    "year": 1894,
    "month": 4,
    "equity": 0.017677,
    "bond": 0.004724,
    "cpi": 6.57
  },
  {
    "year": 1894,
    "month": 5,
    "equity": -0.032945,
    "bond": 0.004709,
    "cpi": 6.57
  },
  {
    "year": 1894,
    "month": 6,
    "equity": -0.00928,
    "bond": 0.004694,
    "cpi": 6.57
  },
  {
    "year": 1894,
    "month": 7,
    "equity": -0.016384,
    "bond": 0.004679,
    "cpi": 6.57
  },
  {
    "year": 1894,
    "month": 8,
    "equity": 0.042025,
    "bond": 0.004664,
    "cpi": 6.76
  },
  {
    "year": 1894,
    "month": 9,
    "equity": 0.02003,
    "bond": 0.004649,
    "cpi": 6.85
  },
  {
    "year": 1894,
    "month": 10,
    "equity": -0.027219,
    "bond": 0.004634,
    "cpi": 6.66
  },
  {
    "year": 1894,
    "month": 11,
    "equity": 0.004096,
    "bond": 0.004619,
    "cpi": 6.66
  },
  {
    "year": 1894,
    "month": 12,
    "equity": -0.005184,
    "bond": 0.004604,
    "cpi": 6.57
  },
  {
    "year": 1895,
    "month": 1,
    "equity": -0.007591,
    "bond": 0.004589,
    "cpi": 6.57
  },
  {
    "year": 1895,
    "month": 2,
    "equity": -0.010065,
    "bond": 0.002039,
    "cpi": 6.57
  },
  {
    "year": 1895,
    "month": 3,
    "equity": 0.004077,
    "bond": 0.002048,
    "cpi": 6.57
  },
  {
    "year": 1895,
    "month": 4,
    "equity": 0.047003,
    "bond": 0.001215,
    "cpi": 6.85
  },
  {
    "year": 1895,
    "month": 5,
    "equity": 0.058766,
    "bond": 0.002074,
    "cpi": 6.95
  },
  {
    "year": 1895,
    "month": 6,
    "equity": 0.023138,
    "bond": 0.002083,
    "cpi": 7.04
  },
  {
    "year": 1895,
    "month": 7,
    "equity": 0.007771,
    "bond": 0.002092,
    "cpi": 6.95
  },
  {
    "year": 1895,
    "month": 8,
    "equity": 0.018303,
    "bond": 0.002101,
    "cpi": 6.85
  },
  {
    "year": 1895,
    "month": 9,
    "equity": 0.009656,
    "bond": 0.002109,
    "cpi": 6.85
  },
  {
    "year": 1895,
    "month": 10,
    "equity": -0.011181,
    "bond": 0.002118,
    "cpi": 6.85
  },
  {
    "year": 1895,
    "month": 11,
    "equity": -0.030321,
    "bond": 0.001288,
    "cpi": 6.85
  },
  {
    "year": 1895,
    "month": 12,
    "equity": -0.055374,
    "bond": 0.002144,
    "cpi": 6.76
  },
  {
    "year": 1896,
    "month": 1,
    "equity": -0.007924,
    "bond": 0.002153,
    "cpi": 6.66
  },
  {
    "year": 1896,
    "month": 2,
    "equity": 0.045829,
    "bond": 0.004679,
    "cpi": 6.57
  },
  {
    "year": 1896,
    "month": 3,
    "equity": -0.012219,
    "bond": 0.003823,
    "cpi": 6.57
  },
  {
    "year": 1896,
    "month": 4,
    "equity": 0.012685,
    "bond": 0.004656,
    "cpi": 6.47
  },
  {
    "year": 1896,
    "month": 5,
    "equity": -0.001022,
    "bond": 0.004641,
    "cpi": 6.37
  },
  {
    "year": 1896,
    "month": 6,
    "equity": -0.014678,
    "bond": 0.003784,
    "cpi": 6.28
  },
  {
    "year": 1896,
    "month": 7,
    "equity": -0.061262,
    "bond": 0.004619,
    "cpi": 6.28
  },
  {
    "year": 1896,
    "month": 8,
    "equity": -0.05315,
    "bond": 0.004604,
    "cpi": 6.28
  },
  {
    "year": 1896,
    "month": 9,
    "equity": 0.056485,
    "bond": 0.003744,
    "cpi": 6.28
  },
  {
    "year": 1896,
    "month": 10,
    "equity": 0.02622,
    "bond": 0.004581,
    "cpi": 6.47
  },
  {
    "year": 1896,
    "month": 11,
    "equity": 0.071967,
    "bond": 0.004566,
    "cpi": 6.66
  },
  {
    "year": 1896,
    "month": 12,
    "equity": -0.033105,
    "bond": 0.003704,
    "cpi": 6.66
  },
  {
    "year": 1897,
    "month": 1,
    "equity": 0.003555,
    "bond": 0.004543,
    "cpi": 6.47
  },
  {
    "year": 1897,
    "month": 2,
    "equity": -0.005924,
    "bond": 0.002833,
    "cpi": 6.47
  },
  {
    "year": 1897,
    "month": 3,
    "equity": 0.005981,
    "bond": 0.00368,
    "cpi": 6.47
  },
  {
    "year": 1897,
    "month": 4,
    "equity": -0.027446,
    "bond": 0.002825,
    "cpi": 6.37
  },
  {
    "year": 1897,
    "month": 5,
    "equity": 0.008621,
    "bond": 0.003673,
    "cpi": 6.28
  },
  {
    "year": 1897,
    "month": 6,
    "equity": 0.050245,
    "bond": 0.002817,
    "cpi": 6.28
  },
  {
    "year": 1897,
    "month": 7,
    "equity": 0.048009,
    "bond": 0.002817,
    "cpi": 6.28
  },
  {
    "year": 1897,
    "month": 8,
    "equity": 0.068386,
    "bond": 0.003665,
    "cpi": 6.57
  },
  {
    "year": 1897,
    "month": 9,
    "equity": 0.051579,
    "bond": 0.002808,
    "cpi": 6.76
  },
  {
    "year": 1897,
    "month": 10,
    "equity": -0.029116,
    "bond": 0.003657,
    "cpi": 6.66
  },
  {
    "year": 1897,
    "month": 11,
    "equity": -0.032158,
    "bond": 0.0028,
    "cpi": 6.66
  },
  {
    "year": 1897,
    "month": 12,
    "equity": 0.024731,
    "bond": 0.003649,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 1,
    "equity": 0.030556,
    "bond": 0.002792,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 2,
    "equity": 0.001081,
    "bond": 0.004491,
    "cpi": 6.76
  },
  {
    "year": 1898,
    "month": 3,
    "equity": -0.042009,
    "bond": 0.004476,
    "cpi": 6.76
  },
  {
    "year": 1898,
    "month": 4,
    "equity": -0.013858,
    "bond": 0.004461,
    "cpi": 6.76
  },
  {
    "year": 1898,
    "month": 5,
    "equity": 0.069079,
    "bond": 0.004446,
    "cpi": 7.23
  },
  {
    "year": 1898,
    "month": 6,
    "equity": 0.042266,
    "bond": 0.004431,
    "cpi": 6.76
  },
  {
    "year": 1898,
    "month": 7,
    "equity": 0.00711,
    "bond": 0.004416,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 8,
    "equity": 0.040573,
    "bond": 0.005256,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 9,
    "equity": 0.001186,
    "bond": 0.004378,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 10,
    "equity": -0.017796,
    "bond": 0.004363,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 11,
    "equity": 0.036218,
    "bond": 0.004348,
    "cpi": 6.66
  },
  {
    "year": 1898,
    "month": 12,
    "equity": 0.065163,
    "bond": 0.004333,
    "cpi": 6.76
  },
  {
    "year": 1899,
    "month": 1,
    "equity": 0.079068,
    "bond": 0.004318,
    "cpi": 6.76
  },
  {
    "year": 1899,
    "month": 2,
    "equity": 0.040593,
    "bond": 0.002583,
    "cpi": 6.95
  },
  {
    "year": 1899,
    "month": 3,
    "equity": 0.016937,
    "bond": 0.001725,
    "cpi": 6.95
  },
  {
    "year": 1899,
    "month": 4,
    "equity": 0.015147,
    "bond": 0.002592,
    "cpi": 7.04
  },
  {
    "year": 1899,
    "month": 5,
    "equity": -0.039041,
    "bond": 0.001734,
    "cpi": 7.04
  },
  {
    "year": 1899,
    "month": 6,
    "equity": -0.019793,
    "bond": 0.0026,
    "cpi": 7.14
  },
  {
    "year": 1899,
    "month": 7,
    "equity": 0.037422,
    "bond": 0.0026,
    "cpi": 7.23
  },
  {
    "year": 1899,
    "month": 8,
    "equity": 0.028221,
    "bond": 0.001742,
    "cpi": 7.33
  },
  {
    "year": 1899,
    "month": 9,
    "equity": -0.008185,
    "bond": 0.002608,
    "cpi": 7.61
  },
  {
    "year": 1899,
    "month": 10,
    "equity": -0.001985,
    "bond": 0.001751,
    "cpi": 7.71
  },
  {
    "year": 1899,
    "month": 11,
    "equity": 0.021677,
    "bond": 0.002617,
    "cpi": 7.8
  },
  {
    "year": 1899,
    "month": 12,
    "equity": -0.065402,
    "bond": 0.00176,
    "cpi": 7.9
  },
  {
    "year": 1900,
    "month": 1,
    "equity": 0.0163,
    "bond": 0.002625,
    "cpi": 7.9
  },
  {
    "year": 1900,
    "month": 2,
    "equity": 0.021107,
    "bond": 0.002625,
    "cpi": 7.99
  },
  {
    "year": 1900,
    "month": 3,
    "equity": 0.011171,
    "bond": 0.003482,
    "cpi": 7.99
  },
  {
    "year": 1900,
    "month": 4,
    "equity": 0.015974,
    "bond": 0.002617,
    "cpi": 7.99
  },
  {
    "year": 1900,
    "month": 5,
    "equity": -0.044065,
    "bond": 0.003474,
    "cpi": 7.8
  },
  {
    "year": 1900,
    "month": 6,
    "equity": -0.026283,
    "bond": 0.002608,
    "cpi": 7.71
  },
  {
    "year": 1900,
    "month": 7,
    "equity": 0.003733,
    "bond": 0.003466,
    "cpi": 7.8
  },
  {
    "year": 1900,
    "month": 8,
    "equity": 0.017491,
    "bond": 0.0026,
    "cpi": 7.71
  },
  {
    "year": 1900,
    "month": 9,
    "equity": -0.019676,
    "bond": 0.0026,
    "cpi": 7.8
  },
  {
    "year": 1900,
    "month": 10,
    "equity": 0.040302,
    "bond": 0.003458,
    "cpi": 7.71
  },
  {
    "year": 1900,
    "month": 11,
    "equity": 0.082259,
    "bond": 0.002592,
    "cpi": 7.71
  },
  {
    "year": 1900,
    "month": 12,
    "equity": 0.064043,
    "bond": 0.003451,
    "cpi": 7.61
  },
  {
    "year": 1901,
    "month": 1,
    "equity": 0.032772,
    "bond": 0.002583,
    "cpi": 7.71
  },
  {
    "year": 1901,
    "month": 2,
    "equity": 0.029035,
    "bond": 0.001725,
    "cpi": 7.61
  },
  {
    "year": 1901,
    "month": 3,
    "equity": 0.039368,
    "bond": 0.002592,
    "cpi": 7.61
  },
  {
    "year": 1901,
    "month": 4,
    "equity": 0.087291,
    "bond": 0.001734,
    "cpi": 7.52
  },
  {
    "year": 1901,
    "month": 5,
    "equity": -0.047212,
    "bond": 0.001742,
    "cpi": 7.52
  },
  {
    "year": 1901,
    "month": 6,
    "equity": 0.102954,
    "bond": 0.002608,
    "cpi": 7.52
  },
  {
    "year": 1901,
    "month": 7,
    "equity": -0.064003,
    "bond": 0.001751,
    "cpi": 7.61
  },
  {
    "year": 1901,
    "month": 8,
    "equity": 0.017164,
    "bond": 0.00176,
    "cpi": 7.71
  },
  {
    "year": 1901,
    "month": 9,
    "equity": -0.00171,
    "bond": 0.002625,
    "cpi": 7.8
  },
  {
    "year": 1901,
    "month": 10,
    "equity": -0.007951,
    "bond": 0.001769,
    "cpi": 7.8
  },
  {
    "year": 1901,
    "month": 11,
    "equity": 0.024845,
    "bond": 0.001777,
    "cpi": 7.9
  },
  {
    "year": 1901,
    "month": 12,
    "equity": -0.012789,
    "bond": 0.002642,
    "cpi": 7.99
  },
  {
    "year": 1902,
    "month": 1,
    "equity": 0.024746,
    "bond": 0.001786,
    "cpi": 7.9
  },
  {
    "year": 1902,
    "month": 2,
    "equity": 0.011922,
    "bond": 0.001795,
    "cpi": 7.9
  },
  {
    "year": 1902,
    "month": 3,
    "equity": 0.004502,
    "bond": 0.001804,
    "cpi": 7.9
  },
  {
    "year": 1902,
    "month": 4,
    "equity": 0.037432,
    "bond": 0.001812,
    "cpi": 7.99
  },
  {
    "year": 1902,
    "month": 5,
    "equity": 0.000827,
    "bond": 0.001821,
    "cpi": 8.09
  },
  {
    "year": 1902,
    "month": 6,
    "equity": -0.002709,
    "bond": 0.00183,
    "cpi": 8.18
  },
  {
    "year": 1902,
    "month": 7,
    "equity": 0.02582,
    "bond": 0.001838,
    "cpi": 8.18
  },
  {
    "year": 1902,
    "month": 8,
    "equity": 0.02991,
    "bond": 0.001847,
    "cpi": 8.09
  },
  {
    "year": 1902,
    "month": 9,
    "equity": 0.005356,
    "bond": 0.001856,
    "cpi": 8.18
  },
  {
    "year": 1902,
    "month": 10,
    "equity": -0.028547,
    "bond": 0.001865,
    "cpi": 8.75
  },
  {
    "year": 1902,
    "month": 11,
    "equity": -0.035305,
    "bond": 0.001873,
    "cpi": 8.47
  },
  {
    "year": 1902,
    "month": 12,
    "equity": -0.019721,
    "bond": 0.001882,
    "cpi": 8.56
  },
  {
    "year": 1903,
    "month": 1,
    "equity": 0.054365,
    "bond": 0.001891,
    "cpi": 8.66
  },
  {
    "year": 1903,
    "month": 2,
    "equity": -0.002627,
    "bond": 0.0019,
    "cpi": 8.66
  },
  {
    "year": 1903,
    "month": 3,
    "equity": -0.03592,
    "bond": 0.001908,
    "cpi": 8.37
  },
  {
    "year": 1903,
    "month": 4,
    "equity": -0.037369,
    "bond": 0.001917,
    "cpi": 8.37
  },
  {
    "year": 1903,
    "month": 5,
    "equity": -0.015717,
    "bond": 0.002775,
    "cpi": 8.18
  },
  {
    "year": 1903,
    "month": 6,
    "equity": -0.051535,
    "bond": 0.001926,
    "cpi": 8.18
  },
  {
    "year": 1903,
    "month": 7,
    "equity": -0.041995,
    "bond": 0.001935,
    "cpi": 8.18
  },
  {
    "year": 1903,
    "month": 8,
    "equity": -0.02794,
    "bond": 0.001943,
    "cpi": 8.18
  },
  {
    "year": 1903,
    "month": 9,
    "equity": -0.019796,
    "bond": 0.001952,
    "cpi": 8.28
  },
  {
    "year": 1903,
    "month": 10,
    "equity": -0.027992,
    "bond": 0.002808,
    "cpi": 8.18
  },
  {
    "year": 1903,
    "month": 11,
    "equity": 0.007831,
    "bond": 0.001961,
    "cpi": 8.09
  },
  {
    "year": 1903,
    "month": 12,
    "equity": 0.050823,
    "bond": 0.00197,
    "cpi": 8.09
  },
  {
    "year": 1904,
    "month": 1,
    "equity": 0.02114,
    "bond": 0.001978,
    "cpi": 8.28
  },
  {
    "year": 1904,
    "month": 2,
    "equity": -0.022663,
    "bond": 0.001987,
    "cpi": 8.47
  },
  {
    "year": 1904,
    "month": 3,
    "equity": 0.001282,
    "bond": 0.002842,
    "cpi": 8.37
  },
  {
    "year": 1904,
    "month": 4,
    "equity": 0.029021,
    "bond": 0.001996,
    "cpi": 8.28
  },
  {
    "year": 1904,
    "month": 5,
    "equity": -0.016901,
    "bond": 0.002004,
    "cpi": 8.09
  },
  {
    "year": 1904,
    "month": 6,
    "equity": 0.005769,
    "bond": 0.002858,
    "cpi": 8.09
  },
  {
    "year": 1904,
    "month": 7,
    "equity": 0.045657,
    "bond": 0.002013,
    "cpi": 8.09
  },
  {
    "year": 1904,
    "month": 8,
    "equity": 0.037897,
    "bond": 0.002022,
    "cpi": 8.18
  },
  {
    "year": 1904,
    "month": 9,
    "equity": 0.048027,
    "bond": 0.002875,
    "cpi": 8.28
  },
  {
    "year": 1904,
    "month": 10,
    "equity": 0.062349,
    "bond": 0.002031,
    "cpi": 8.28
  },
  {
    "year": 1904,
    "month": 11,
    "equity": 0.057562,
    "bond": 0.002039,
    "cpi": 8.47
  },
  {
    "year": 1904,
    "month": 12,
    "equity": 0.012954,
    "bond": 0.002892,
    "cpi": 8.47
  },
  {
    "year": 1905,
    "month": 1,
    "equity": 0.024967,
    "bond": 0.002048,
    "cpi": 8.47
  },
  {
    "year": 1905,
    "month": 2,
    "equity": 0.046988,
    "bond": 0.0029,
    "cpi": 8.47
  },
  {
    "year": 1905,
    "month": 3,
    "equity": 0.031392,
    "bond": 0.003744,
    "cpi": 8.37
  },
  {
    "year": 1905,
    "month": 4,
    "equity": -0.009238,
    "bond": 0.002892,
    "cpi": 8.37
  },
  {
    "year": 1905,
    "month": 5,
    "equity": -0.04625,
    "bond": 0.003736,
    "cpi": 8.28
  },
  {
    "year": 1905,
    "month": 6,
    "equity": 0.014902,
    "bond": 0.002883,
    "cpi": 8.28
  },
  {
    "year": 1905,
    "month": 7,
    "equity": 0.034513,
    "bond": 0.002883,
    "cpi": 8.28
  },
  {
    "year": 1905,
    "month": 8,
    "equity": 0.040241,
    "bond": 0.003728,
    "cpi": 8.37
  },
  {
    "year": 1905,
    "month": 9,
    "equity": 0.006205,
    "bond": 0.002875,
    "cpi": 8.28
  },
  {
    "year": 1905,
    "month": 10,
    "equity": 0.017034,
    "bond": 0.00372,
    "cpi": 8.28
  },
  {
    "year": 1905,
    "month": 11,
    "equity": -0.002419,
    "bond": 0.002867,
    "cpi": 8.37
  },
  {
    "year": 1905,
    "month": 12,
    "equity": 0.027658,
    "bond": 0.003712,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 1,
    "equity": 0.037524,
    "bond": 0.002858,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 2,
    "equity": -0.004207,
    "bond": 0.001169,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 3,
    "equity": -0.021535,
    "bond": 0.001187,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 4,
    "equity": -0.010519,
    "bond": 0.001205,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 5,
    "equity": -0.023337,
    "bond": 0.001224,
    "cpi": 8.56
  },
  {
    "year": 1906,
    "month": 6,
    "equity": 0.016385,
    "bond": 0.001242,
    "cpi": 8.56
  },
  {
    "year": 1906,
    "month": 7,
    "equity": -0.022484,
    "bond": 0.00126,
    "cpi": 8.28
  },
  {
    "year": 1906,
    "month": 8,
    "equity": 0.077416,
    "bond": 0.001278,
    "cpi": 8.47
  },
  {
    "year": 1906,
    "month": 9,
    "equity": 0.034108,
    "bond": 0.001297,
    "cpi": 8.56
  },
  {
    "year": 1906,
    "month": 10,
    "equity": -0.026684,
    "bond": 0.001315,
    "cpi": 8.75
  },
  {
    "year": 1906,
    "month": 11,
    "equity": 0.023931,
    "bond": 0.001333,
    "cpi": 8.85
  },
  {
    "year": 1906,
    "month": 12,
    "equity": -0.005707,
    "bond": 0.001351,
    "cpi": 8.94
  },
  {
    "year": 1907,
    "month": 1,
    "equity": -0.02504,
    "bond": 0.00137,
    "cpi": 8.85
  },
  {
    "year": 1907,
    "month": 2,
    "equity": -0.027836,
    "bond": 0.001388,
    "cpi": 9.04
  },
  {
    "year": 1907,
    "month": 3,
    "equity": -0.094582,
    "bond": 0.00224,
    "cpi": 8.94
  },
  {
    "year": 1907,
    "month": 4,
    "equity": 0.008915,
    "bond": 0.001415,
    "cpi": 8.94
  },
  {
    "year": 1907,
    "month": 5,
    "equity": -0.030426,
    "bond": 0.001434,
    "cpi": 9.13
  },
  {
    "year": 1907,
    "month": 6,
    "equity": -0.027778,
    "bond": 0.002284,
    "cpi": 9.23
  },
  {
    "year": 1907,
    "month": 7,
    "equity": 0.042765,
    "bond": 0.001461,
    "cpi": 9.23
  },
  {
    "year": 1907,
    "month": 8,
    "equity": -0.07057,
    "bond": 0.001479,
    "cpi": 9.23
  },
  {
    "year": 1907,
    "month": 9,
    "equity": -0.005865,
    "bond": 0.002327,
    "cpi": 9.23
  },
  {
    "year": 1907,
    "month": 10,
    "equity": -0.103878,
    "bond": 0.001507,
    "cpi": 9.32
  },
  {
    "year": 1907,
    "month": 11,
    "equity": -0.053254,
    "bond": 0.001525,
    "cpi": 8.94
  },
  {
    "year": 1907,
    "month": 12,
    "equity": 0.057067,
    "bond": 0.002371,
    "cpi": 8.75
  },
  {
    "year": 1908,
    "month": 1,
    "equity": 0.048157,
    "bond": 0.001552,
    "cpi": 8.66
  },
  {
    "year": 1908,
    "month": 2,
    "equity": -0.031225,
    "bond": 0.004054,
    "cpi": 8.56
  },
  {
    "year": 1908,
    "month": 3,
    "equity": 0.046338,
    "bond": 0.004046,
    "cpi": 8.56
  },
  {
    "year": 1908,
    "month": 4,
    "equity": 0.059033,
    "bond": 0.004038,
    "cpi": 8.66
  },
  {
    "year": 1908,
    "month": 5,
    "equity": 0.05874,
    "bond": 0.00403,
    "cpi": 8.66
  },
  {
    "year": 1908,
    "month": 6,
    "equity": 0.005898,
    "bond": 0.004022,
    "cpi": 8.66
  },
  {
    "year": 1908,
    "month": 7,
    "equity": 0.041194,
    "bond": 0.004014,
    "cpi": 8.75
  },
  {
    "year": 1908,
    "month": 8,
    "equity": 0.047278,
    "bond": 0.003175,
    "cpi": 8.75
  },
  {
    "year": 1908,
    "month": 9,
    "equity": -0.006759,
    "bond": 0.004006,
    "cpi": 8.75
  },
  {
    "year": 1908,
    "month": 10,
    "equity": 0.016388,
    "bond": 0.003998,
    "cpi": 8.85
  },
  {
    "year": 1908,
    "month": 11,
    "equity": 0.071779,
    "bond": 0.00399,
    "cpi": 8.94
  },
  {
    "year": 1908,
    "month": 12,
    "equity": 0.026425,
    "bond": 0.003982,
    "cpi": 9.04
  },
  {
    "year": 1909,
    "month": 1,
    "equity": 0.007044,
    "bond": 0.003974,
    "cpi": 8.94
  },
  {
    "year": 1909,
    "month": 2,
    "equity": -0.024957,
    "bond": 0.002301,
    "cpi": 9.04
  },
  {
    "year": 1909,
    "month": 3,
    "equity": 0.017519,
    "bond": 0.00231,
    "cpi": 9.04
  },
  {
    "year": 1909,
    "month": 4,
    "equity": 0.048704,
    "bond": 0.001488,
    "cpi": 9.23
  },
  {
    "year": 1909,
    "month": 5,
    "equity": 0.036988,
    "bond": 0.002336,
    "cpi": 9.32
  },
  {
    "year": 1909,
    "month": 6,
    "equity": 0.021288,
    "bond": 0.002345,
    "cpi": 9.42
  },
  {
    "year": 1909,
    "month": 7,
    "equity": 0.017885,
    "bond": 0.002354,
    "cpi": 9.42
  },
  {
    "year": 1909,
    "month": 8,
    "equity": 0.027722,
    "bond": 0.001534,
    "cpi": 9.51
  },
  {
    "year": 1909,
    "month": 9,
    "equity": 0.004502,
    "bond": 0.00238,
    "cpi": 9.61
  },
  {
    "year": 1909,
    "month": 10,
    "equity": 0.007469,
    "bond": 0.002389,
    "cpi": 9.8
  },
  {
    "year": 1909,
    "month": 11,
    "equity": -0.00133,
    "bond": 0.002397,
    "cpi": 9.9
  },
  {
    "year": 1909,
    "month": 12,
    "equity": 0.01539,
    "bond": 0.001579,
    "cpi": 9.99
  },
  {
    "year": 1910,
    "month": 1,
    "equity": -0.017779,
    "bond": 0.002423,
    "cpi": 9.9
  },
  {
    "year": 1910,
    "month": 2,
    "equity": -0.032035,
    "bond": 0.002432,
    "cpi": 9.9
  },
  {
    "year": 1910,
    "month": 3,
    "equity": 0.028528,
    "bond": 0.003267,
    "cpi": 10.09
  },
  {
    "year": 1910,
    "month": 4,
    "equity": -0.020331,
    "bond": 0.002441,
    "cpi": 10.18
  },
  {
    "year": 1910,
    "month": 5,
    "equity": -0.012581,
    "bond": 0.003275,
    "cpi": 9.99
  },
  {
    "year": 1910,
    "month": 6,
    "equity": -0.044151,
    "bond": 0.00245,
    "cpi": 9.9
  },
  {
    "year": 1910,
    "month": 7,
    "equity": -0.04636,
    "bond": 0.002458,
    "cpi": 9.9
  },
  {
    "year": 1910,
    "month": 8,
    "equity": 0.028742,
    "bond": 0.003292,
    "cpi": 9.8
  },
  {
    "year": 1910,
    "month": 9,
    "equity": 0.011135,
    "bond": 0.002467,
    "cpi": 9.7
  },
  {
    "year": 1910,
    "month": 10,
    "equity": 0.050365,
    "bond": 0.0033,
    "cpi": 9.42
  },
  {
    "year": 1910,
    "month": 11,
    "equity": 0.003107,
    "bond": 0.002476,
    "cpi": 9.23
  },
  {
    "year": 1910,
    "month": 12,
    "equity": -0.02372,
    "bond": 0.003308,
    "cpi": 9.23
  },
  {
    "year": 1911,
    "month": 1,
    "equity": 0.028637,
    "bond": 0.002484,
    "cpi": 9.23
  },
  {
    "year": 1911,
    "month": 2,
    "equity": 0.021485,
    "bond": 0.003317,
    "cpi": 8.94
  },
  {
    "year": 1911,
    "month": 3,
    "equity": -0.007511,
    "bond": 0.003317,
    "cpi": 9.04
  },
  {
    "year": 1911,
    "month": 4,
    "equity": -8.9e-05,
    "bond": 0.002493,
    "cpi": 8.75
  },
  {
    "year": 1911,
    "month": 5,
    "equity": 0.025772,
    "bond": 0.003325,
    "cpi": 8.75
  },
  {
    "year": 1911,
    "month": 6,
    "equity": 0.024174,
    "bond": 0.003325,
    "cpi": 8.75
  },
  {
    "year": 1911,
    "month": 7,
    "equity": -8.6e-05,
    "bond": 0.002502,
    "cpi": 8.85
  },
  {
    "year": 1911,
    "month": 8,
    "equity": -0.0437,
    "bond": 0.003333,
    "cpi": 9.13
  },
  {
    "year": 1911,
    "month": 9,
    "equity": -0.050254,
    "bond": 0.003333,
    "cpi": 9.23
  },
  {
    "year": 1911,
    "month": 10,
    "equity": 0.010285,
    "bond": 0.003333,
    "cpi": 9.23
  },
  {
    "year": 1911,
    "month": 11,
    "equity": 0.044629,
    "bond": 0.003333,
    "cpi": 9.13
  },
  {
    "year": 1911,
    "month": 12,
    "equity": 0.008728,
    "bond": 0.002511,
    "cpi": 9.04
  },
  {
    "year": 1912,
    "month": 1,
    "equity": 0.005404,
    "bond": 0.003342,
    "cpi": 9.13
  },
  {
    "year": 1912,
    "month": 2,
    "equity": -0.004462,
    "bond": 5.7e-05,
    "cpi": 9.23
  },
  {
    "year": 1912,
    "month": 3,
    "equity": 0.033117,
    "bond": 0.000915,
    "cpi": 9.42
  },
  {
    "year": 1912,
    "month": 4,
    "equity": 0.035424,
    "bond": 0.000126,
    "cpi": 9.7
  },
  {
    "year": 1912,
    "month": 5,
    "equity": 0.003078,
    "bond": 0.000166,
    "cpi": 9.7
  },
  {
    "year": 1912,
    "month": 6,
    "equity": 0.004132,
    "bond": 0.001019,
    "cpi": 9.61
  },
  {
    "year": 1912,
    "month": 7,
    "equity": 0.005183,
    "bond": 0.000235,
    "cpi": 9.61
  },
  {
    "year": 1912,
    "month": 8,
    "equity": 0.027083,
    "bond": 0.000274,
    "cpi": 9.7
  },
  {
    "year": 1912,
    "month": 9,
    "equity": 0.009153,
    "bond": 0.001124,
    "cpi": 9.8
  },
  {
    "year": 1912,
    "month": 10,
    "equity": 0.002014,
    "bond": 0.000343,
    "cpi": 9.8
  },
  {
    "year": 1912,
    "month": 11,
    "equity": -0.007121,
    "bond": 0.000382,
    "cpi": 9.8
  },
  {
    "year": 1912,
    "month": 12,
    "equity": -0.03186,
    "bond": 0.001228,
    "cpi": 9.7
  },
  {
    "year": 1913,
    "month": 1,
    "equity": -0.004264,
    "bond": 0.000451,
    "cpi": 9.8
  },
  {
    "year": 1913,
    "month": 2,
    "equity": -0.031183,
    "bond": 0.005322,
    "cpi": 9.8
  },
  {
    "year": 1913,
    "month": 3,
    "equity": -0.014493,
    "bond": 0.006115,
    "cpi": 9.8
  },
  {
    "year": 1913,
    "month": 4,
    "equity": 0.003409,
    "bond": 0.005284,
    "cpi": 9.8
  },
  {
    "year": 1913,
    "month": 5,
    "equity": -0.022753,
    "bond": 0.006079,
    "cpi": 9.7
  },
  {
    "year": 1913,
    "month": 6,
    "equity": -0.045614,
    "bond": 0.005246,
    "cpi": 9.8
  },
  {
    "year": 1913,
    "month": 7,
    "equity": 0.018473,
    "bond": 0.006043,
    "cpi": 9.9
  },
  {
    "year": 1913,
    "month": 8,
    "equity": 0.031592,
    "bond": 0.005208,
    "cpi": 9.9
  },
  {
    "year": 1913,
    "month": 9,
    "equity": 0.014201,
    "bond": 0.005193,
    "cpi": 10.0
  },
  {
    "year": 1913,
    "month": 10,
    "equity": -0.026964,
    "bond": 0.005993,
    "cpi": 10.0
  },
  {
    "year": 1913,
    "month": 11,
    "equity": -0.020581,
    "bond": 0.005155,
    "cpi": 10.1
  },
  {
    "year": 1913,
    "month": 12,
    "equity": 0.003727,
    "bond": 0.005957,
    "cpi": 10.0
  },
  {
    "year": 1914,
    "month": 1,
    "equity": 0.045968,
    "bond": 0.005117,
    "cpi": 10.0
  },
  {
    "year": 1914,
    "month": 2,
    "equity": 0.017822,
    "bond": 0.00265,
    "cpi": 9.9
  },
  {
    "year": 1914,
    "month": 3,
    "equity": -0.014298,
    "bond": 0.003475,
    "cpi": 9.9
  },
  {
    "year": 1914,
    "month": 4,
    "equity": -0.019431,
    "bond": 0.002659,
    "cpi": 9.8
  },
  {
    "year": 1914,
    "month": 5,
    "equity": 0.010827,
    "bond": 0.002668,
    "cpi": 9.9
  },
  {
    "year": 1914,
    "month": 6,
    "equity": -0.000306,
    "bond": 0.003492,
    "cpi": 9.9
  },
  {
    "year": 1914,
    "month": 7,
    "equity": -0.050789,
    "bond": 0.002676,
    "cpi": 10.0
  },
  {
    "year": 1914,
    "month": 8,
    "equity": 0.004774,
    "bond": 0.002685,
    "cpi": 10.2
  },
  {
    "year": 1914,
    "month": 9,
    "equity": 0.00472,
    "bond": 0.003508,
    "cpi": 10.2
  },
  {
    "year": 1914,
    "month": 10,
    "equity": 0.004666,
    "bond": 0.002694,
    "cpi": 10.1
  },
  {
    "year": 1914,
    "month": 11,
    "equity": 0.004612,
    "bond": 0.002702,
    "cpi": 10.2
  },
  {
    "year": 1914,
    "month": 12,
    "equity": -0.038411,
    "bond": 0.003525,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 1,
    "equity": 0.022458,
    "bond": 0.002711,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 2,
    "equity": -0.008671,
    "bond": 0.005163,
    "cpi": 10.0
  },
  {
    "year": 1915,
    "month": 3,
    "equity": 0.030516,
    "bond": 0.004332,
    "cpi": 9.9
  },
  {
    "year": 1915,
    "month": 4,
    "equity": 0.079957,
    "bond": 0.00514,
    "cpi": 10.0
  },
  {
    "year": 1915,
    "month": 5,
    "equity": -0.018999,
    "bond": 0.004308,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 6,
    "equity": 0.015776,
    "bond": 0.005117,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 7,
    "equity": 0.000682,
    "bond": 0.005102,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 8,
    "equity": 0.046886,
    "bond": 0.004268,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 9,
    "equity": 0.041392,
    "bond": 0.005079,
    "cpi": 10.1
  },
  {
    "year": 1915,
    "month": 10,
    "equity": 0.059549,
    "bond": 0.004244,
    "cpi": 10.2
  },
  {
    "year": 1915,
    "month": 11,
    "equity": 0.038924,
    "bond": 0.005057,
    "cpi": 10.3
  },
  {
    "year": 1915,
    "month": 12,
    "equity": 0.005902,
    "bond": 0.00422,
    "cpi": 10.3
  },
  {
    "year": 1916,
    "month": 1,
    "equity": -0.011948,
    "bond": 0.005034,
    "cpi": 10.4
  },
  {
    "year": 1916,
    "month": 2,
    "equity": -0.009899,
    "bond": 0.002554,
    "cpi": 10.4
  },
  {
    "year": 1916,
    "month": 3,
    "equity": 0.000928,
    "bond": 0.001743,
    "cpi": 10.5
  },
  {
    "year": 1916,
    "month": 4,
    "equity": -0.006604,
    "bond": 0.00258,
    "cpi": 10.6
  },
  {
    "year": 1916,
    "month": 5,
    "equity": 0.026499,
    "bond": 0.001771,
    "cpi": 10.7
  },
  {
    "year": 1916,
    "month": 6,
    "equity": 0.014159,
    "bond": 0.002607,
    "cpi": 10.8
  },
  {
    "year": 1916,
    "month": 7,
    "equity": -0.009386,
    "bond": 0.001798,
    "cpi": 10.8
  },
  {
    "year": 1916,
    "month": 8,
    "equity": 0.012249,
    "bond": 0.001816,
    "cpi": 10.9
  },
  {
    "year": 1916,
    "month": 9,
    "equity": 0.045587,
    "bond": 0.00265,
    "cpi": 11.1
  },
  {
    "year": 1916,
    "month": 10,
    "equity": 0.035626,
    "bond": 0.001843,
    "cpi": 11.3
  },
  {
    "year": 1916,
    "month": 11,
    "equity": 0.027632,
    "bond": 0.002676,
    "cpi": 11.5
  },
  {
    "year": 1916,
    "month": 12,
    "equity": -0.035586,
    "bond": 0.002685,
    "cpi": 11.6
  },
  {
    "year": 1917,
    "month": 1,
    "equity": -0.018616,
    "bond": 0.00188,
    "cpi": 11.7
  },
  {
    "year": 1917,
    "month": 2,
    "equity": -0.051361,
    "bond": 0.001086,
    "cpi": 12.0
  },
  {
    "year": 1917,
    "month": 3,
    "equity": 0.036476,
    "bond": 0.001114,
    "cpi": 12.0
  },
  {
    "year": 1917,
    "month": 4,
    "equity": -0.009637,
    "bond": 0.001142,
    "cpi": 12.6
  },
  {
    "year": 1917,
    "month": 5,
    "equity": -0.028224,
    "bond": 0.00198,
    "cpi": 12.8
  },
  {
    "year": 1917,
    "month": 6,
    "equity": 0.026195,
    "bond": 0.00119,
    "cpi": 13.0
  },
  {
    "year": 1917,
    "month": 7,
    "equity": -0.021794,
    "bond": 0.001218,
    "cpi": 12.8
  },
  {
    "year": 1917,
    "month": 8,
    "equity": -0.023448,
    "bond": 0.001247,
    "cpi": 13.0
  },
  {
    "year": 1917,
    "month": 9,
    "equity": -0.041642,
    "bond": 0.001275,
    "cpi": 13.3
  },
  {
    "year": 1917,
    "month": 10,
    "equity": -0.047329,
    "bond": 0.001303,
    "cpi": 13.5
  },
  {
    "year": 1917,
    "month": 11,
    "equity": -0.075964,
    "bond": 0.002134,
    "cpi": 13.5
  },
  {
    "year": 1917,
    "month": 12,
    "equity": -0.025923,
    "bond": 0.001351,
    "cpi": 13.7
  },
  {
    "year": 1918,
    "month": 1,
    "equity": 0.068627,
    "bond": 0.001379,
    "cpi": 14.0
  },
  {
    "year": 1918,
    "month": 2,
    "equity": 0.038257,
    "bond": 0.00461,
    "cpi": 14.1
  },
  {
    "year": 1918,
    "month": 3,
    "equity": -0.012786,
    "bond": 0.0038,
    "cpi": 14.0
  },
  {
    "year": 1918,
    "month": 4,
    "equity": -0.002175,
    "bond": 0.004602,
    "cpi": 14.2
  },
  {
    "year": 1918,
    "month": 5,
    "equity": 0.039297,
    "bond": 0.003792,
    "cpi": 14.5
  },
  {
    "year": 1918,
    "month": 6,
    "equity": 0.008401,
    "bond": 0.004594,
    "cpi": 14.7
  },
  {
    "year": 1918,
    "month": 7,
    "equity": 0.014989,
    "bond": 0.003783,
    "cpi": 15.1
  },
  {
    "year": 1918,
    "month": 8,
    "equity": 0.01609,
    "bond": 0.004586,
    "cpi": 15.4
  },
  {
    "year": 1918,
    "month": 9,
    "equity": 0.001319,
    "bond": 0.004578,
    "cpi": 15.7
  },
  {
    "year": 1918,
    "month": 10,
    "equity": 0.048961,
    "bond": 0.003767,
    "cpi": 16.0
  },
  {
    "year": 1918,
    "month": 11,
    "equity": 0.031595,
    "bond": 0.00457,
    "cpi": 16.3
  },
  {
    "year": 1918,
    "month": 12,
    "equity": -0.013958,
    "bond": 0.003758,
    "cpi": 16.5
  },
  {
    "year": 1919,
    "month": 1,
    "equity": -0.000351,
    "bond": 0.004562,
    "cpi": 16.5
  },
  {
    "year": 1919,
    "month": 2,
    "equity": 0.009801,
    "bond": 0.00054,
    "cpi": 16.2
  },
  {
    "year": 1919,
    "month": 3,
    "equity": 0.036379,
    "bond": 0.000579,
    "cpi": 16.4
  },
  {
    "year": 1919,
    "month": 4,
    "equity": 0.038964,
    "bond": 0.000618,
    "cpi": 16.7
  },
  {
    "year": 1919,
    "month": 5,
    "equity": 0.074626,
    "bond": 0.000658,
    "cpi": 16.9
  },
  {
    "year": 1919,
    "month": 6,
    "equity": 0.031865,
    "bond": 0.000697,
    "cpi": 16.9
  },
  {
    "year": 1919,
    "month": 7,
    "equity": 0.03752,
    "bond": 0.00153,
    "cpi": 17.4
  },
  {
    "year": 1919,
    "month": 8,
    "equity": -0.062537,
    "bond": 0.000765,
    "cpi": 17.7
  },
  {
    "year": 1919,
    "month": 9,
    "equity": 0.020857,
    "bond": 0.000805,
    "cpi": 17.8
  },
  {
    "year": 1919,
    "month": 10,
    "equity": 0.056018,
    "bond": 0.000844,
    "cpi": 18.1
  },
  {
    "year": 1919,
    "month": 11,
    "equity": -0.024874,
    "bond": 0.000883,
    "cpi": 18.5
  },
  {
    "year": 1919,
    "month": 12,
    "equity": -0.024574,
    "bond": 0.000922,
    "cpi": 18.9
  },
  {
    "year": 1920,
    "month": 1,
    "equity": -0.005154,
    "bond": 0.000961,
    "cpi": 19.3
  },
  {
    "year": 1920,
    "month": 2,
    "equity": -0.077702,
    "bond": 0.003355,
    "cpi": 19.5
  },
  {
    "year": 1920,
    "month": 3,
    "equity": 0.075772,
    "bond": 0.003364,
    "cpi": 19.7
  },
  {
    "year": 1920,
    "month": 4,
    "equity": -0.003044,
    "bond": 0.003373,
    "cpi": 20.3
  },
  {
    "year": 1920,
    "month": 5,
    "equity": -0.057735,
    "bond": 0.003381,
    "cpi": 20.6
  },
  {
    "year": 1920,
    "month": 6,
    "equity": -0.011993,
    "bond": 0.00339,
    "cpi": 20.9
  },
  {
    "year": 1920,
    "month": 7,
    "equity": 0.004191,
    "bond": 0.003399,
    "cpi": 20.8
  },
  {
    "year": 1920,
    "month": 8,
    "equity": -0.033747,
    "bond": 0.003407,
    "cpi": 20.3
  },
  {
    "year": 1920,
    "month": 9,
    "equity": 0.041173,
    "bond": 0.003416,
    "cpi": 20.0
  },
  {
    "year": 1920,
    "month": 10,
    "equity": 0.006706,
    "bond": 0.003425,
    "cpi": 19.9
  },
  {
    "year": 1920,
    "month": 11,
    "equity": -0.04535,
    "bond": 0.003434,
    "cpi": 19.8
  },
  {
    "year": 1920,
    "month": 12,
    "equity": -0.08389,
    "bond": 0.003442,
    "cpi": 19.4
  },
  {
    "year": 1921,
    "month": 1,
    "equity": 0.050242,
    "bond": 0.003451,
    "cpi": 19.0
  },
  {
    "year": 1921,
    "month": 2,
    "equity": -0.001152,
    "bond": 0.009736,
    "cpi": 18.4
  },
  {
    "year": 1921,
    "month": 3,
    "equity": -0.019623,
    "bond": 0.008906,
    "cpi": 18.3
  },
  {
    "year": 1921,
    "month": 4,
    "equity": 0.010336,
    "bond": 0.009661,
    "cpi": 18.1
  },
  {
    "year": 1921,
    "month": 5,
    "equity": 0.03629,
    "bond": 0.008826,
    "cpi": 17.7
  },
  {
    "year": 1921,
    "month": 6,
    "equity": -0.07438,
    "bond": 0.009586,
    "cpi": 17.6
  },
  {
    "year": 1921,
    "month": 7,
    "equity": 0.003064,
    "bond": 0.008747,
    "cpi": 17.7
  },
  {
    "year": 1921,
    "month": 8,
    "equity": -0.006168,
    "bond": 0.009511,
    "cpi": 17.7
  },
  {
    "year": 1921,
    "month": 9,
    "equity": 0.030911,
    "bond": 0.009471,
    "cpi": 17.5
  },
  {
    "year": 1921,
    "month": 10,
    "equity": 0.01952,
    "bond": 0.008624,
    "cpi": 17.5
  },
  {
    "year": 1921,
    "month": 11,
    "equity": 0.059505,
    "bond": 0.009397,
    "cpi": 17.4
  },
  {
    "year": 1921,
    "month": 12,
    "equity": 0.04084,
    "bond": 0.008545,
    "cpi": 17.3
  },
  {
    "year": 1922,
    "month": 1,
    "equity": 0.003924,
    "bond": 0.009323,
    "cpi": 16.9
  },
  {
    "year": 1922,
    "month": 2,
    "equity": 0.027264,
    "bond": 0.003583,
    "cpi": 16.9
  },
  {
    "year": 1922,
    "month": 3,
    "equity": 0.042812,
    "bond": 0.002772,
    "cpi": 16.7
  },
  {
    "year": 1922,
    "month": 4,
    "equity": 0.065856,
    "bond": 0.003592,
    "cpi": 16.7
  },
  {
    "year": 1922,
    "month": 5,
    "equity": 0.043857,
    "bond": 0.002781,
    "cpi": 16.7
  },
  {
    "year": 1922,
    "month": 6,
    "equity": -0.00464,
    "bond": 0.00279,
    "cpi": 16.7
  },
  {
    "year": 1922,
    "month": 7,
    "equity": 0.011925,
    "bond": 0.003608,
    "cpi": 16.8
  },
  {
    "year": 1922,
    "month": 8,
    "equity": 0.042433,
    "bond": 0.003608,
    "cpi": 16.6
  },
  {
    "year": 1922,
    "month": 9,
    "equity": 0.030743,
    "bond": 0.002798,
    "cpi": 16.6
  },
  {
    "year": 1922,
    "month": 10,
    "equity": 0.02669,
    "bond": 0.003617,
    "cpi": 16.7
  },
  {
    "year": 1922,
    "month": 11,
    "equity": -0.045124,
    "bond": 0.002807,
    "cpi": 16.8
  },
  {
    "year": 1922,
    "month": 12,
    "equity": 0.002557,
    "bond": 0.003625,
    "cpi": 16.9
  },
  {
    "year": 1923,
    "month": 1,
    "equity": 0.018524,
    "bond": 0.002816,
    "cpi": 16.8
  },
  {
    "year": 1923,
    "month": 2,
    "equity": 0.047503,
    "bond": 0.006065,
    "cpi": 16.8
  },
  {
    "year": 1923,
    "month": 3,
    "equity": 0.020788,
    "bond": 0.005231,
    "cpi": 16.8
  },
  {
    "year": 1923,
    "month": 4,
    "equity": -0.030429,
    "bond": 0.005216,
    "cpi": 16.9
  },
  {
    "year": 1923,
    "month": 5,
    "equity": -0.042506,
    "bond": 0.006014,
    "cpi": 16.9
  },
  {
    "year": 1923,
    "month": 6,
    "equity": -0.033064,
    "bond": 0.005993,
    "cpi": 17.0
  },
  {
    "year": 1923,
    "month": 7,
    "equity": -0.02836,
    "bond": 0.005155,
    "cpi": 17.2
  },
  {
    "year": 1923,
    "month": 8,
    "equity": 0.010373,
    "bond": 0.005957,
    "cpi": 17.1
  },
  {
    "year": 1923,
    "month": 9,
    "equity": 0.011574,
    "bond": 0.005117,
    "cpi": 17.2
  },
  {
    "year": 1923,
    "month": 10,
    "equity": -0.009338,
    "bond": 0.005921,
    "cpi": 17.3
  },
  {
    "year": 1923,
    "month": 11,
    "equity": 0.03537,
    "bond": 0.005079,
    "cpi": 17.3
  },
  {
    "year": 1923,
    "month": 12,
    "equity": 0.039198,
    "bond": 0.005885,
    "cpi": 17.3
  },
  {
    "year": 1924,
    "month": 1,
    "equity": 0.037931,
    "bond": 0.005042,
    "cpi": 17.3
  },
  {
    "year": 1924,
    "month": 2,
    "equity": 0.009563,
    "bond": 0.005026,
    "cpi": 17.2
  },
  {
    "year": 1924,
    "month": 3,
    "equity": -0.014139,
    "bond": 0.004189,
    "cpi": 17.1
  },
  {
    "year": 1924,
    "month": 4,
    "equity": -0.017848,
    "bond": 0.005004,
    "cpi": 17.0
  },
  {
    "year": 1924,
    "month": 5,
    "equity": 0.001748,
    "bond": 0.004989,
    "cpi": 17.0
  },
  {
    "year": 1924,
    "month": 6,
    "equity": 0.024203,
    "bond": 0.004149,
    "cpi": 17.0
  },
  {
    "year": 1924,
    "month": 7,
    "equity": 0.051581,
    "bond": 0.004966,
    "cpi": 17.1
  },
  {
    "year": 1924,
    "month": 8,
    "equity": 0.039344,
    "bond": 0.004951,
    "cpi": 17.0
  },
  {
    "year": 1924,
    "month": 9,
    "equity": -0.004773,
    "bond": 0.004109,
    "cpi": 17.1
  },
  {
    "year": 1924,
    "month": 10,
    "equity": -0.008048,
    "bond": 0.004928,
    "cpi": 17.2
  },
  {
    "year": 1924,
    "month": 11,
    "equity": 0.060864,
    "bond": 0.004913,
    "cpi": 17.2
  },
  {
    "year": 1924,
    "month": 12,
    "equity": 0.058696,
    "bond": 0.004069,
    "cpi": 17.3
  },
  {
    "year": 1925,
    "month": 1,
    "equity": 0.045884,
    "bond": 0.00489,
    "cpi": 17.3
  },
  {
    "year": 1925,
    "month": 2,
    "equity": 0.012904,
    "bond": 0.004046,
    "cpi": 17.2
  },
  {
    "year": 1925,
    "month": 3,
    "equity": -0.021849,
    "bond": 0.004868,
    "cpi": 17.3
  },
  {
    "year": 1925,
    "month": 4,
    "equity": -0.006042,
    "bond": 0.004853,
    "cpi": 17.2
  },
  {
    "year": 1925,
    "month": 5,
    "equity": 0.036728,
    "bond": 0.004006,
    "cpi": 17.3
  },
  {
    "year": 1925,
    "month": 6,
    "equity": 0.022424,
    "bond": 0.003998,
    "cpi": 17.5
  },
  {
    "year": 1925,
    "month": 7,
    "equity": 0.032247,
    "bond": 0.004822,
    "cpi": 17.7
  },
  {
    "year": 1925,
    "month": 8,
    "equity": 0.017893,
    "bond": 0.003974,
    "cpi": 17.7
  },
  {
    "year": 1925,
    "month": 9,
    "equity": 0.027463,
    "bond": 0.0048,
    "cpi": 17.7
  },
  {
    "year": 1925,
    "month": 10,
    "equity": 0.037299,
    "bond": 0.00395,
    "cpi": 17.7
  },
  {
    "year": 1925,
    "month": 11,
    "equity": 0.035294,
    "bond": 0.004777,
    "cpi": 18.0
  },
  {
    "year": 1925,
    "month": 12,
    "equity": 0.020392,
    "bond": 0.003926,
    "cpi": 17.9
  },
  {
    "year": 1926,
    "month": 1,
    "equity": 0.019312,
    "bond": 0.004754,
    "cpi": 17.9
  },
  {
    "year": 1926,
    "month": 2,
    "equity": 0.005632,
    "bond": 0.005577,
    "cpi": 17.9
  },
  {
    "year": 1926,
    "month": 3,
    "equity": -0.063783,
    "bond": 0.005556,
    "cpi": 17.8
  },
  {
    "year": 1926,
    "month": 4,
    "equity": -0.023497,
    "bond": 0.004694,
    "cpi": 17.9
  },
  {
    "year": 1926,
    "month": 5,
    "equity": 0.011596,
    "bond": 0.00552,
    "cpi": 17.8
  },
  {
    "year": 1926,
    "month": 6,
    "equity": 0.052228,
    "bond": 0.005498,
    "cpi": 17.7
  },
  {
    "year": 1926,
    "month": 7,
    "equity": 0.046604,
    "bond": 0.005477,
    "cpi": 17.5
  },
  {
    "year": 1926,
    "month": 8,
    "equity": 0.043978,
    "bond": 0.005456,
    "cpi": 17.4
  },
  {
    "year": 1926,
    "month": 9,
    "equity": 0.019484,
    "bond": 0.005434,
    "cpi": 17.5
  },
  {
    "year": 1926,
    "month": 10,
    "equity": -0.0183,
    "bond": 0.005413,
    "cpi": 17.6
  },
  {
    "year": 1926,
    "month": 11,
    "equity": 0.017425,
    "bond": 0.004543,
    "cpi": 17.7
  },
  {
    "year": 1926,
    "month": 12,
    "equity": 0.027104,
    "bond": 0.005377,
    "cpi": 17.7
  },
  {
    "year": 1927,
    "month": 1,
    "equity": -0.002368,
    "bond": 0.005356,
    "cpi": 17.5
  },
  {
    "year": 1927,
    "month": 2,
    "equity": 0.023777,
    "bond": 0.002783,
    "cpi": 17.4
  },
  {
    "year": 1927,
    "month": 3,
    "equity": 0.019705,
    "bond": 0.002783,
    "cpi": 17.3
  },
  {
    "year": 1927,
    "month": 4,
    "equity": 0.028819,
    "bond": 0.002783,
    "cpi": 17.3
  },
  {
    "year": 1927,
    "month": 5,
    "equity": 0.038724,
    "bond": 0.002783,
    "cpi": 17.4
  },
  {
    "year": 1927,
    "month": 6,
    "equity": 0.017063,
    "bond": 0.002783,
    "cpi": 17.6
  },
  {
    "year": 1927,
    "month": 7,
    "equity": 0.026286,
    "bond": 0.003633,
    "cpi": 17.3
  },
  {
    "year": 1927,
    "month": 8,
    "equity": 0.057289,
    "bond": 0.002775,
    "cpi": 17.2
  },
  {
    "year": 1927,
    "month": 9,
    "equity": 0.060667,
    "bond": 0.002775,
    "cpi": 17.3
  },
  {
    "year": 1927,
    "month": 10,
    "equity": -0.011626,
    "bond": 0.002775,
    "cpi": 17.4
  },
  {
    "year": 1927,
    "month": 11,
    "equity": 0.026595,
    "bond": 0.002775,
    "cpi": 17.3
  },
  {
    "year": 1927,
    "month": 12,
    "equity": 0.027208,
    "bond": 0.002775,
    "cpi": 17.3
  },
  {
    "year": 1928,
    "month": 1,
    "equity": 0.007716,
    "bond": 0.002775,
    "cpi": 17.3
  },
  {
    "year": 1928,
    "month": 2,
    "equity": -0.008256,
    "bond": 0.001078,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 3,
    "equity": 0.057496,
    "bond": 0.000249,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 4,
    "equity": 0.066652,
    "bond": 0.001123,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 5,
    "equity": 0.034378,
    "bond": 0.001141,
    "cpi": 17.2
  },
  {
    "year": 1928,
    "month": 6,
    "equity": -0.045625,
    "bond": 0.00116,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 7,
    "equity": 0.010939,
    "bond": 0.001178,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 8,
    "equity": 0.03594,
    "bond": 0.000354,
    "cpi": 17.1
  },
  {
    "year": 1928,
    "month": 9,
    "equity": 0.07377,
    "bond": 0.001224,
    "cpi": 17.3
  },
  {
    "year": 1928,
    "month": 10,
    "equity": 0.023605,
    "bond": 0.001242,
    "cpi": 17.2
  },
  {
    "year": 1928,
    "month": 11,
    "equity": 0.070846,
    "bond": 0.000421,
    "cpi": 17.2
  },
  {
    "year": 1928,
    "month": 12,
    "equity": 0.006975,
    "bond": 0.001288,
    "cpi": 17.1
  },
  {
    "year": 1929,
    "month": 1,
    "equity": 0.076962,
    "bond": 0.001306,
    "cpi": 17.1
  },
  {
    "year": 1929,
    "month": 2,
    "equity": 0.008146,
    "bond": 0.00552,
    "cpi": 17.1
  },
  {
    "year": 1929,
    "month": 3,
    "equity": 0.020542,
    "bond": 0.004656,
    "cpi": 17.0
  },
  {
    "year": 1929,
    "month": 4,
    "equity": -0.002982,
    "bond": 0.005484,
    "cpi": 16.9
  },
  {
    "year": 1929,
    "month": 5,
    "equity": 0.017998,
    "bond": 0.004619,
    "cpi": 17.0
  },
  {
    "year": 1929,
    "month": 6,
    "equity": 0.022051,
    "bond": 0.005448,
    "cpi": 17.1
  },
  {
    "year": 1929,
    "month": 7,
    "equity": 0.092033,
    "bond": 0.004581,
    "cpi": 17.3
  },
  {
    "year": 1929,
    "month": 8,
    "equity": 0.059603,
    "bond": 0.005413,
    "cpi": 17.3
  },
  {
    "year": 1929,
    "month": 9,
    "equity": 0.04247,
    "bond": 0.005391,
    "cpi": 17.3
  },
  {
    "year": 1929,
    "month": 10,
    "equity": -0.103222,
    "bond": 0.004521,
    "cpi": 17.3
  },
  {
    "year": 1929,
    "month": 11,
    "equity": -0.261879,
    "bond": 0.005356,
    "cpi": 17.3
  },
  {
    "year": 1929,
    "month": 12,
    "equity": 0.043772,
    "bond": 0.004483,
    "cpi": 17.2
  },
  {
    "year": 1930,
    "month": 1,
    "equity": 0.018266,
    "bond": 0.00532,
    "cpi": 17.1
  },
  {
    "year": 1930,
    "month": 2,
    "equity": 0.066374,
    "bond": 0.002742,
    "cpi": 17.0
  },
  {
    "year": 1930,
    "month": 3,
    "equity": 0.041224,
    "bond": 0.001891,
    "cpi": 16.9
  },
  {
    "year": 1930,
    "month": 4,
    "equity": 0.06688,
    "bond": 0.00275,
    "cpi": 17.0
  },
  {
    "year": 1930,
    "month": 5,
    "equity": -0.056513,
    "bond": 0.0019,
    "cpi": 16.9
  },
  {
    "year": 1930,
    "month": 6,
    "equity": -0.097692,
    "bond": 0.002758,
    "cpi": 16.8
  },
  {
    "year": 1930,
    "month": 7,
    "equity": -0.017597,
    "bond": 0.001908,
    "cpi": 16.6
  },
  {
    "year": 1930,
    "month": 8,
    "equity": -0.008956,
    "bond": 0.002767,
    "cpi": 16.5
  },
  {
    "year": 1930,
    "month": 9,
    "equity": 0.003437,
    "bond": 0.002767,
    "cpi": 16.6
  },
  {
    "year": 1930,
    "month": 10,
    "equity": -0.133709,
    "bond": 0.001917,
    "cpi": 16.5
  },
  {
    "year": 1930,
    "month": 11,
    "equity": -0.067991,
    "bond": 0.002775,
    "cpi": 16.4
  },
  {
    "year": 1930,
    "month": 12,
    "equity": -0.061873,
    "bond": 0.001926,
    "cpi": 16.1
  },
  {
    "year": 1931,
    "month": 1,
    "equity": 0.035497,
    "bond": 0.002783,
    "cpi": 15.9
  },
  {
    "year": 1931,
    "month": 2,
    "equity": 0.081317,
    "bond": 0.00024,
    "cpi": 15.7
  },
  {
    "year": 1931,
    "month": 3,
    "equity": 0.02374,
    "bond": 0.000268,
    "cpi": 15.6
  },
  {
    "year": 1931,
    "month": 4,
    "equity": -0.09086,
    "bond": 0.001141,
    "cpi": 15.5
  },
  {
    "year": 1931,
    "month": 5,
    "equity": -0.09167,
    "bond": 0.000316,
    "cpi": 15.3
  },
  {
    "year": 1931,
    "month": 6,
    "equity": -0.026867,
    "bond": 0.000344,
    "cpi": 15.1
  },
  {
    "year": 1931,
    "month": 7,
    "equity": 0.038493,
    "bond": 0.000373,
    "cpi": 15.1
  },
  {
    "year": 1931,
    "month": 8,
    "equity": -0.024928,
    "bond": 0.000402,
    "cpi": 15.1
  },
  {
    "year": 1931,
    "month": 9,
    "equity": -0.143765,
    "bond": 0.00043,
    "cpi": 15.0
  },
  {
    "year": 1931,
    "month": 10,
    "equity": -0.127594,
    "bond": 0.000459,
    "cpi": 14.9
  },
  {
    "year": 1931,
    "month": 11,
    "equity": 0.020433,
    "bond": 0.001324,
    "cpi": 14.7
  },
  {
    "year": 1931,
    "month": 12,
    "equity": -0.181104,
    "bond": 0.000506,
    "cpi": 14.6
  },
  {
    "year": 1932,
    "month": 1,
    "equity": -0.008755,
    "bond": 0.000535,
    "cpi": 14.3
  },
  {
    "year": 1932,
    "month": 2,
    "equity": -0.000736,
    "bond": 0.005577,
    "cpi": 14.1
  },
  {
    "year": 1932,
    "month": 3,
    "equity": 0.011138,
    "bond": 0.005556,
    "cpi": 14.0
  },
  {
    "year": 1932,
    "month": 4,
    "equity": -0.232513,
    "bond": 0.005534,
    "cpi": 13.9
  },
  {
    "year": 1932,
    "month": 5,
    "equity": -0.113499,
    "bond": 0.005513,
    "cpi": 13.7
  },
  {
    "year": 1932,
    "month": 6,
    "equity": -0.124319,
    "bond": 0.005491,
    "cpi": 13.6
  },
  {
    "year": 1932,
    "month": 7,
    "equity": 0.061378,
    "bond": 0.00547,
    "cpi": 13.6
  },
  {
    "year": 1932,
    "month": 8,
    "equity": 0.513085,
    "bond": 0.006294,
    "cpi": 13.5
  },
  {
    "year": 1932,
    "month": 9,
    "equity": 0.103364,
    "bond": 0.00542,
    "cpi": 13.4
  },
  {
    "year": 1932,
    "month": 10,
    "equity": -0.132432,
    "bond": 0.005399,
    "cpi": 13.3
  },
  {
    "year": 1932,
    "month": 11,
    "equity": -0.003667,
    "bond": 0.005377,
    "cpi": 13.2
  },
  {
    "year": 1932,
    "month": 12,
    "equity": -0.026714,
    "bond": 0.005356,
    "cpi": 13.1
  },
  {
    "year": 1933,
    "month": 1,
    "equity": 0.045638,
    "bond": 0.005334,
    "cpi": 12.9
  },
  {
    "year": 1933,
    "month": 2,
    "equity": -0.112717,
    "bond": 0.004461,
    "cpi": 12.7
  },
  {
    "year": 1933,
    "month": 3,
    "equity": 0.003267,
    "bond": 0.003593,
    "cpi": 12.6
  },
  {
    "year": 1933,
    "month": 4,
    "equity": 0.11236,
    "bond": 0.004438,
    "cpi": 12.6
  },
  {
    "year": 1933,
    "month": 5,
    "equity": 0.293118,
    "bond": 0.003569,
    "cpi": 12.6
  },
  {
    "year": 1933,
    "month": 6,
    "equity": 0.17578,
    "bond": 0.004416,
    "cpi": 12.7
  },
  {
    "year": 1933,
    "month": 7,
    "equity": 0.084577,
    "bond": 0.0044,
    "cpi": 13.1
  },
  {
    "year": 1933,
    "month": 8,
    "equity": -0.046453,
    "bond": 0.00353,
    "cpi": 13.2
  },
  {
    "year": 1933,
    "month": 9,
    "equity": -0.004881,
    "bond": 0.004378,
    "cpi": 13.2
  },
  {
    "year": 1933,
    "month": 10,
    "equity": -0.093809,
    "bond": 0.003506,
    "cpi": 13.2
  },
  {
    "year": 1933,
    "month": 11,
    "equity": 0.027967,
    "bond": 0.004355,
    "cpi": 13.2
  },
  {
    "year": 1933,
    "month": 12,
    "equity": 0.023177,
    "bond": 0.003482,
    "cpi": 13.2
  },
  {
    "year": 1934,
    "month": 1,
    "equity": 0.060856,
    "bond": 0.004333,
    "cpi": 13.2
  },
  {
    "year": 1934,
    "month": 2,
    "equity": 0.077496,
    "bond": 0.005178,
    "cpi": 13.3
  },
  {
    "year": 1934,
    "month": 3,
    "equity": -0.047979,
    "bond": 0.005157,
    "cpi": 13.3
  },
  {
    "year": 1934,
    "month": 4,
    "equity": 0.020199,
    "bond": 0.004273,
    "cpi": 13.3
  },
  {
    "year": 1934,
    "month": 5,
    "equity": -0.098259,
    "bond": 0.005121,
    "cpi": 13.3
  },
  {
    "year": 1934,
    "month": 6,
    "equity": 0.017032,
    "bond": 0.0051,
    "cpi": 13.4
  },
  {
    "year": 1934,
    "month": 7,
    "equity": -0.043546,
    "bond": 0.004213,
    "cpi": 13.4
  },
  {
    "year": 1934,
    "month": 8,
    "equity": -0.03514,
    "bond": 0.005064,
    "cpi": 13.4
  },
  {
    "year": 1934,
    "month": 9,
    "equity": -0.020078,
    "bond": 0.005043,
    "cpi": 13.6
  },
  {
    "year": 1934,
    "month": 10,
    "equity": 0.01209,
    "bond": 0.005022,
    "cpi": 13.5
  },
  {
    "year": 1934,
    "month": 11,
    "equity": 0.032115,
    "bond": 0.005001,
    "cpi": 13.5
  },
  {
    "year": 1934,
    "month": 12,
    "equity": 0.010598,
    "bond": 0.004108,
    "cpi": 13.4
  },
  {
    "year": 1935,
    "month": 1,
    "equity": 0.00405,
    "bond": 0.004965,
    "cpi": 13.6
  },
  {
    "year": 1935,
    "month": 2,
    "equity": -0.026188,
    "bond": 0.003197,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 3,
    "equity": -0.059298,
    "bond": 0.003189,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 4,
    "equity": 0.079337,
    "bond": 0.004055,
    "cpi": 13.8
  },
  {
    "year": 1935,
    "month": 5,
    "equity": 0.082627,
    "bond": 0.003166,
    "cpi": 13.8
  },
  {
    "year": 1935,
    "month": 6,
    "equity": 0.041709,
    "bond": 0.003158,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 7,
    "equity": 0.055995,
    "bond": 0.00315,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 8,
    "equity": 0.071049,
    "bond": 0.003142,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 9,
    "equity": 0.024333,
    "bond": 0.003134,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 10,
    "equity": 0.029931,
    "bond": 0.003126,
    "cpi": 13.7
  },
  {
    "year": 1935,
    "month": 11,
    "equity": 0.097176,
    "bond": 0.003995,
    "cpi": 13.8
  },
  {
    "year": 1935,
    "month": 12,
    "equity": 0.003004,
    "bond": 0.003102,
    "cpi": 13.8
  },
  {
    "year": 1936,
    "month": 1,
    "equity": 0.058282,
    "bond": 0.003094,
    "cpi": 13.8
  },
  {
    "year": 1936,
    "month": 2,
    "equity": 0.06038,
    "bond": 0.002208,
    "cpi": 13.8
  },
  {
    "year": 1936,
    "month": 3,
    "equity": 0.02417,
    "bond": 0.001331,
    "cpi": 13.7
  },
  {
    "year": 1936,
    "month": 4,
    "equity": 0.004243,
    "bond": 0.002217,
    "cpi": 13.7
  },
  {
    "year": 1936,
    "month": 5,
    "equity": -0.050105,
    "bond": 0.002217,
    "cpi": 13.7
  },
  {
    "year": 1936,
    "month": 6,
    "equity": 0.045836,
    "bond": 0.002217,
    "cpi": 13.8
  },
  {
    "year": 1936,
    "month": 7,
    "equity": 0.062457,
    "bond": 0.00134,
    "cpi": 13.9
  },
  {
    "year": 1936,
    "month": 8,
    "equity": 0.023083,
    "bond": 0.002225,
    "cpi": 14.0
  },
  {
    "year": 1936,
    "month": 9,
    "equity": 0.014545,
    "bond": 0.002225,
    "cpi": 14.0
  },
  {
    "year": 1936,
    "month": 10,
    "equity": 0.055694,
    "bond": 0.002225,
    "cpi": 14.0
  },
  {
    "year": 1936,
    "month": 11,
    "equity": 0.031199,
    "bond": 0.002225,
    "cpi": 14.0
  },
  {
    "year": 1936,
    "month": 12,
    "equity": -0.013825,
    "bond": 0.001349,
    "cpi": 14.0
  },
  {
    "year": 1937,
    "month": 1,
    "equity": 0.034633,
    "bond": 0.002233,
    "cpi": 14.1
  },
  {
    "year": 1937,
    "month": 2,
    "equity": 0.033068,
    "bond": 0.00311,
    "cpi": 14.1
  },
  {
    "year": 1937,
    "month": 3,
    "equity": 0.002347,
    "bond": 0.003102,
    "cpi": 14.2
  },
  {
    "year": 1937,
    "month": 4,
    "equity": -0.056108,
    "bond": 0.003094,
    "cpi": 14.3
  },
  {
    "year": 1937,
    "month": 5,
    "equity": -0.040711,
    "bond": 0.003086,
    "cpi": 14.4
  },
  {
    "year": 1937,
    "month": 6,
    "equity": -0.033231,
    "bond": 0.003078,
    "cpi": 14.4
  },
  {
    "year": 1937,
    "month": 7,
    "equity": 0.063814,
    "bond": 0.003071,
    "cpi": 14.5
  },
  {
    "year": 1937,
    "month": 8,
    "equity": 0.014249,
    "bond": 0.003063,
    "cpi": 14.5
  },
  {
    "year": 1937,
    "month": 9,
    "equity": -0.137744,
    "bond": 0.003055,
    "cpi": 14.6
  },
  {
    "year": 1937,
    "month": 10,
    "equity": -0.140919,
    "bond": 0.003047,
    "cpi": 14.6
  },
  {
    "year": 1937,
    "month": 11,
    "equity": -0.082587,
    "bond": 0.003039,
    "cpi": 14.5
  },
  {
    "year": 1937,
    "month": 12,
    "equity": -0.010119,
    "bond": 0.003031,
    "cpi": 14.4
  },
  {
    "year": 1938,
    "month": 1,
    "equity": 0.032315,
    "bond": 0.003023,
    "cpi": 14.2
  },
  {
    "year": 1938,
    "month": 2,
    "equity": -0.018076,
    "bond": 0.003898,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 3,
    "equity": -0.060236,
    "bond": 0.002999,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 4,
    "equity": -0.03454,
    "bond": 0.003875,
    "cpi": 14.2
  },
  {
    "year": 1938,
    "month": 5,
    "equity": 0.015448,
    "bond": 0.00386,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 6,
    "equity": 0.029225,
    "bond": 0.00296,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 7,
    "equity": 0.204647,
    "bond": 0.003838,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 8,
    "equity": 0.010394,
    "bond": 0.003823,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 9,
    "equity": -0.041024,
    "bond": 0.00292,
    "cpi": 14.1
  },
  {
    "year": 1938,
    "month": 10,
    "equity": 0.115816,
    "bond": 0.003801,
    "cpi": 14.0
  },
  {
    "year": 1938,
    "month": 11,
    "equity": 0.004339,
    "bond": 0.003786,
    "cpi": 14.0
  },
  {
    "year": 1938,
    "month": 12,
    "equity": -0.025822,
    "bond": 0.002881,
    "cpi": 14.0
  },
  {
    "year": 1939,
    "month": 1,
    "equity": -0.011601,
    "bond": 0.003763,
    "cpi": 14.0
  },
  {
    "year": 1939,
    "month": 2,
    "equity": -0.004556,
    "bond": 0.002857,
    "cpi": 13.9
  },
  {
    "year": 1939,
    "month": 3,
    "equity": 0.002688,
    "bond": 0.003741,
    "cpi": 13.9
  },
  {
    "year": 1939,
    "month": 4,
    "equity": -0.122388,
    "bond": 0.002833,
    "cpi": 13.8
  },
  {
    "year": 1939,
    "month": 5,
    "equity": 0.040987,
    "bond": 0.002825,
    "cpi": 13.8
  },
  {
    "year": 1939,
    "month": 6,
    "equity": 0.021742,
    "bond": 0.002818,
    "cpi": 13.8
  },
  {
    "year": 1939,
    "month": 7,
    "equity": 0.028434,
    "bond": 0.00281,
    "cpi": 13.8
  },
  {
    "year": 1939,
    "month": 8,
    "equity": -0.010603,
    "bond": 0.003696,
    "cpi": 13.8
  },
  {
    "year": 1939,
    "month": 9,
    "equity": 0.11063,
    "bond": 0.002786,
    "cpi": 14.1
  },
  {
    "year": 1939,
    "month": 10,
    "equity": 0.013965,
    "bond": 0.002778,
    "cpi": 14.0
  },
  {
    "year": 1939,
    "month": 11,
    "equity": -0.013953,
    "bond": 0.00277,
    "cpi": 14.0
  },
  {
    "year": 1939,
    "month": 12,
    "equity": -0.0196,
    "bond": 0.003659,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 1,
    "equity": -0.00146,
    "bond": 0.002746,
    "cpi": 13.9
  },
  {
    "year": 1940,
    "month": 2,
    "equity": -0.002258,
    "bond": 0.003636,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 3,
    "equity": -0.001432,
    "bond": 0.003621,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 4,
    "equity": 0.014243,
    "bond": 0.003607,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 5,
    "equity": -0.133365,
    "bond": 0.004493,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 6,
    "equity": -0.080892,
    "bond": 0.003569,
    "cpi": 14.1
  },
  {
    "year": 1940,
    "month": 7,
    "equity": 0.038751,
    "bond": 0.003554,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 8,
    "equity": 0.026554,
    "bond": 0.003539,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 9,
    "equity": 0.047631,
    "bond": 0.003524,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 10,
    "equity": 0.01466,
    "bond": 0.00351,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 11,
    "equity": 0.028503,
    "bond": 0.004402,
    "cpi": 14.0
  },
  {
    "year": 1940,
    "month": 12,
    "equity": -0.035899,
    "bond": 0.003472,
    "cpi": 14.1
  },
  {
    "year": 1941,
    "month": 1,
    "equity": 0.007228,
    "bond": 0.003457,
    "cpi": 14.1
  },
  {
    "year": 1941,
    "month": 2,
    "equity": -0.057214,
    "bond": -0.001999,
    "cpi": 14.1
  },
  {
    "year": 1941,
    "month": 3,
    "equity": 0.011796,
    "bond": -0.002861,
    "cpi": 14.2
  },
  {
    "year": 1941,
    "month": 4,
    "equity": -0.025433,
    "bond": -0.001909,
    "cpi": 14.3
  },
  {
    "year": 1941,
    "month": 5,
    "equity": -0.015848,
    "bond": -0.001868,
    "cpi": 14.4
  },
  {
    "year": 1941,
    "month": 6,
    "equity": 0.041092,
    "bond": -0.001828,
    "cpi": 14.7
  },
  {
    "year": 1941,
    "month": 7,
    "equity": 0.057149,
    "bond": -0.002682,
    "cpi": 14.7
  },
  {
    "year": 1941,
    "month": 8,
    "equity": 0.000785,
    "bond": -0.001737,
    "cpi": 14.9
  },
  {
    "year": 1941,
    "month": 9,
    "equity": 0.008652,
    "bond": -0.001697,
    "cpi": 15.1
  },
  {
    "year": 1941,
    "month": 10,
    "equity": -0.034315,
    "bond": -0.001657,
    "cpi": 15.3
  },
  {
    "year": 1941,
    "month": 11,
    "equity": -0.040805,
    "bond": -0.002504,
    "cpi": 15.4
  },
  {
    "year": 1941,
    "month": 12,
    "equity": -0.058787,
    "bond": -0.001566,
    "cpi": 15.5
  },
  {
    "year": 1942,
    "month": 1,
    "equity": 0.026097,
    "bond": -0.001526,
    "cpi": 15.7
  },
  {
    "year": 1942,
    "month": 2,
    "equity": -0.024854,
    "bond": 0.00205,
    "cpi": 15.8
  },
  {
    "year": 1942,
    "month": 3,
    "equity": -0.047688,
    "bond": 0.00205,
    "cpi": 16.0
  },
  {
    "year": 1942,
    "month": 4,
    "equity": -0.034637,
    "bond": 0.00205,
    "cpi": 16.1
  },
  {
    "year": 1942,
    "month": 5,
    "equity": 0.018601,
    "bond": 0.00205,
    "cpi": 16.3
  },
  {
    "year": 1942,
    "month": 6,
    "equity": 0.057377,
    "bond": 0.00205,
    "cpi": 16.3
  },
  {
    "year": 1942,
    "month": 7,
    "equity": 0.043684,
    "bond": 0.00205,
    "cpi": 16.4
  },
  {
    "year": 1942,
    "month": 8,
    "equity": 0.000321,
    "bond": 0.001165,
    "cpi": 16.5
  },
  {
    "year": 1942,
    "month": 9,
    "equity": 0.016492,
    "bond": 0.002058,
    "cpi": 16.5
  },
  {
    "year": 1942,
    "month": 10,
    "equity": 0.079589,
    "bond": 0.002058,
    "cpi": 16.7
  },
  {
    "year": 1942,
    "month": 11,
    "equity": 0.021459,
    "bond": 0.002058,
    "cpi": 16.8
  },
  {
    "year": 1942,
    "month": 12,
    "equity": 0.010472,
    "bond": 0.002058,
    "cpi": 16.9
  },
  {
    "year": 1943,
    "month": 1,
    "equity": 0.065039,
    "bond": 0.002058,
    "cpi": 16.9
  },
  {
    "year": 1943,
    "month": 2,
    "equity": 0.064338,
    "bond": 0.002058,
    "cpi": 16.9
  },
  {
    "year": 1943,
    "month": 3,
    "equity": 0.040147,
    "bond": 0.002058,
    "cpi": 17.2
  },
  {
    "year": 1943,
    "month": 4,
    "equity": 0.037865,
    "bond": 0.002058,
    "cpi": 17.4
  },
  {
    "year": 1943,
    "month": 5,
    "equity": 0.043633,
    "bond": 0.002058,
    "cpi": 17.5
  },
  {
    "year": 1943,
    "month": 6,
    "equity": 0.021797,
    "bond": 0.002058,
    "cpi": 17.5
  },
  {
    "year": 1943,
    "month": 7,
    "equity": 0.024747,
    "bond": 0.001173,
    "cpi": 17.4
  },
  {
    "year": 1943,
    "month": 8,
    "equity": -0.045367,
    "bond": 0.002067,
    "cpi": 17.3
  },
  {
    "year": 1943,
    "month": 9,
    "equity": 0.025554,
    "bond": 0.002067,
    "cpi": 17.4
  },
  {
    "year": 1943,
    "month": 10,
    "equity": -0.004981,
    "bond": 0.002067,
    "cpi": 17.4
  },
  {
    "year": 1943,
    "month": 11,
    "equity": -0.042041,
    "bond": 0.002067,
    "cpi": 17.4
  },
  {
    "year": 1943,
    "month": 12,
    "equity": 0.017726,
    "bond": 0.002067,
    "cpi": 17.4
  },
  {
    "year": 1944,
    "month": 1,
    "equity": 0.036682,
    "bond": 0.002067,
    "cpi": 17.4
  },
  {
    "year": 1944,
    "month": 2,
    "equity": -0.002414,
    "bond": 0.002952,
    "cpi": 17.4
  },
  {
    "year": 1944,
    "month": 3,
    "equity": 0.032427,
    "bond": 0.002944,
    "cpi": 17.4
  },
  {
    "year": 1944,
    "month": 4,
    "equity": -0.013062,
    "bond": 0.002936,
    "cpi": 17.5
  },
  {
    "year": 1944,
    "month": 5,
    "equity": 0.022054,
    "bond": 0.002928,
    "cpi": 17.5
  },
  {
    "year": 1944,
    "month": 6,
    "equity": 0.051446,
    "bond": 0.00292,
    "cpi": 17.6
  },
  {
    "year": 1944,
    "month": 7,
    "equity": 0.030211,
    "bond": 0.002912,
    "cpi": 17.7
  },
  {
    "year": 1944,
    "month": 8,
    "equity": -0.010534,
    "bond": 0.002017,
    "cpi": 17.7
  },
  {
    "year": 1944,
    "month": 9,
    "equity": -0.01223,
    "bond": 0.002905,
    "cpi": 17.7
  },
  {
    "year": 1944,
    "month": 10,
    "equity": 0.028836,
    "bond": 0.002897,
    "cpi": 17.7
  },
  {
    "year": 1944,
    "month": 11,
    "equity": -0.00284,
    "bond": 0.002889,
    "cpi": 17.7
  },
  {
    "year": 1944,
    "month": 12,
    "equity": 0.026001,
    "bond": 0.002881,
    "cpi": 17.8
  },
  {
    "year": 1945,
    "month": 1,
    "equity": 0.033863,
    "bond": 0.002873,
    "cpi": 17.8
  },
  {
    "year": 1945,
    "month": 2,
    "equity": 0.037353,
    "bond": 0.003756,
    "cpi": 17.8
  },
  {
    "year": 1945,
    "month": 3,
    "equity": 0.003168,
    "bond": 0.002849,
    "cpi": 17.8
  },
  {
    "year": 1945,
    "month": 4,
    "equity": 0.029014,
    "bond": 0.002841,
    "cpi": 17.8
  },
  {
    "year": 1945,
    "month": 5,
    "equity": 0.041608,
    "bond": 0.003726,
    "cpi": 17.9
  },
  {
    "year": 1945,
    "month": 6,
    "equity": 0.021874,
    "bond": 0.003711,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 7,
    "equity": -0.016935,
    "bond": 0.002802,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 8,
    "equity": 0.007085,
    "bond": 0.002794,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 9,
    "equity": 0.071814,
    "bond": 0.003681,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 10,
    "equity": 0.045139,
    "bond": 0.00277,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 11,
    "equity": 0.036061,
    "bond": 0.003659,
    "cpi": 18.1
  },
  {
    "year": 1945,
    "month": 12,
    "equity": 0.020246,
    "bond": 0.002746,
    "cpi": 18.2
  },
  {
    "year": 1946,
    "month": 1,
    "equity": 0.043021,
    "bond": 0.003636,
    "cpi": 18.2
  },
  {
    "year": 1946,
    "month": 2,
    "equity": 0.005889,
    "bond": 0.001825,
    "cpi": 18.1
  },
  {
    "year": 1946,
    "month": 3,
    "equity": -0.026748,
    "bond": 0.000928,
    "cpi": 18.3
  },
  {
    "year": 1946,
    "month": 4,
    "equity": 0.067693,
    "bond": 0.000937,
    "cpi": 18.4
  },
  {
    "year": 1946,
    "month": 5,
    "equity": 0.00518,
    "bond": 0.001842,
    "cpi": 18.5
  },
  {
    "year": 1946,
    "month": 6,
    "equity": -0.003387,
    "bond": 0.001842,
    "cpi": 18.7
  },
  {
    "year": 1946,
    "month": 7,
    "equity": -0.02546,
    "bond": 0.000946,
    "cpi": 19.8
  },
  {
    "year": 1946,
    "month": 8,
    "equity": -0.01622,
    "bond": 0.000954,
    "cpi": 20.2
  },
  {
    "year": 1946,
    "month": 9,
    "equity": -0.144209,
    "bond": 0.001858,
    "cpi": 20.4
  },
  {
    "year": 1946,
    "month": 10,
    "equity": -0.018684,
    "bond": 0.001858,
    "cpi": 20.8
  },
  {
    "year": 1946,
    "month": 11,
    "equity": -9.4e-05,
    "bond": 0.000963,
    "cpi": 21.3
  },
  {
    "year": 1946,
    "month": 12,
    "equity": 0.03398,
    "bond": 0.000972,
    "cpi": 21.5
  },
  {
    "year": 1947,
    "month": 1,
    "equity": 0.009216,
    "bond": 0.001875,
    "cpi": 21.5
  },
  {
    "year": 1947,
    "month": 2,
    "equity": 0.042717,
    "bond": 8.7e-05,
    "cpi": 21.5
  },
  {
    "year": 1947,
    "month": 3,
    "equity": -0.036709,
    "bond": 0.000998,
    "cpi": 21.9
  },
  {
    "year": 1947,
    "month": 4,
    "equity": -0.032908,
    "bond": 0.000115,
    "cpi": 21.9
  },
  {
    "year": 1947,
    "month": 5,
    "equity": -0.013546,
    "bond": 0.001025,
    "cpi": 21.9
  },
  {
    "year": 1947,
    "month": 6,
    "equity": 0.039284,
    "bond": 0.000142,
    "cpi": 22.0
  },
  {
    "year": 1947,
    "month": 7,
    "equity": 0.066992,
    "bond": 0.001051,
    "cpi": 22.2
  },
  {
    "year": 1947,
    "month": 8,
    "equity": -0.015536,
    "bond": 0.00017,
    "cpi": 22.5
  },
  {
    "year": 1947,
    "month": 9,
    "equity": -0.021615,
    "bond": 0.000188,
    "cpi": 23.0
  },
  {
    "year": 1947,
    "month": 10,
    "equity": 0.03036,
    "bond": 0.001095,
    "cpi": 23.0
  },
  {
    "year": 1947,
    "month": 11,
    "equity": -0.00721,
    "bond": 0.000216,
    "cpi": 23.1
  },
  {
    "year": 1947,
    "month": 12,
    "equity": -0.011133,
    "bond": 0.001121,
    "cpi": 23.4
  },
  {
    "year": 1948,
    "month": 1,
    "equity": -0.008631,
    "bond": 0.000244,
    "cpi": 23.7
  },
  {
    "year": 1948,
    "month": 2,
    "equity": -0.044467,
    "bond": 0.00292,
    "cpi": 23.5
  },
  {
    "year": 1948,
    "month": 3,
    "equity": 0.019208,
    "bond": 0.002912,
    "cpi": 23.4
  },
  {
    "year": 1948,
    "month": 4,
    "equity": 0.081876,
    "bond": 0.002905,
    "cpi": 23.8
  },
  {
    "year": 1948,
    "month": 5,
    "equity": 0.053301,
    "bond": 0.002897,
    "cpi": 23.9
  },
  {
    "year": 1948,
    "month": 6,
    "equity": 0.045872,
    "bond": 0.002889,
    "cpi": 24.1
  },
  {
    "year": 1948,
    "month": 7,
    "equity": -0.019537,
    "bond": 0.002881,
    "cpi": 24.4
  },
  {
    "year": 1948,
    "month": 8,
    "equity": -0.024851,
    "bond": 0.003763,
    "cpi": 24.5
  },
  {
    "year": 1948,
    "month": 9,
    "equity": -0.006744,
    "bond": 0.002857,
    "cpi": 24.5
  },
  {
    "year": 1948,
    "month": 10,
    "equity": 0.03199,
    "bond": 0.002849,
    "cpi": 24.4
  },
  {
    "year": 1948,
    "month": 11,
    "equity": -0.050906,
    "bond": 0.002841,
    "cpi": 24.2
  },
  {
    "year": 1948,
    "month": 12,
    "equity": -0.001472,
    "bond": 0.002833,
    "cpi": 24.1
  },
  {
    "year": 1949,
    "month": 1,
    "equity": 0.016385,
    "bond": 0.002825,
    "cpi": 24.0
  },
  {
    "year": 1949,
    "month": 2,
    "equity": -0.033185,
    "bond": 0.001925,
    "cpi": 23.8
  },
  {
    "year": 1949,
    "month": 3,
    "equity": 0.015008,
    "bond": 0.001925,
    "cpi": 23.8
  },
  {
    "year": 1949,
    "month": 4,
    "equity": 0.00421,
    "bond": 0.001925,
    "cpi": 23.9
  },
  {
    "year": 1949,
    "month": 5,
    "equity": -0.001754,
    "bond": 0.001925,
    "cpi": 23.8
  },
  {
    "year": 1949,
    "month": 6,
    "equity": -0.049053,
    "bond": 0.001925,
    "cpi": 23.9
  },
  {
    "year": 1949,
    "month": 7,
    "equity": 0.062674,
    "bond": 0.001925,
    "cpi": 23.7
  },
  {
    "year": 1949,
    "month": 8,
    "equity": 0.041742,
    "bond": 0.001033,
    "cpi": 23.8
  },
  {
    "year": 1949,
    "month": 9,
    "equity": 0.018749,
    "bond": 0.001933,
    "cpi": 23.9
  },
  {
    "year": 1949,
    "month": 10,
    "equity": 0.031597,
    "bond": 0.001933,
    "cpi": 23.7
  },
  {
    "year": 1949,
    "month": 11,
    "equity": 0.019649,
    "bond": 0.001933,
    "cpi": 23.8
  },
  {
    "year": 1949,
    "month": 12,
    "equity": 0.032588,
    "bond": 0.001933,
    "cpi": 23.6
  },
  {
    "year": 1950,
    "month": 1,
    "equity": 0.02635,
    "bond": 0.001933,
    "cpi": 23.5
  },
  {
    "year": 1950,
    "month": 2,
    "equity": 0.025276,
    "bond": 0.000152,
    "cpi": 23.5
  },
  {
    "year": 1950,
    "month": 3,
    "equity": 0.0138,
    "bond": 0.00017,
    "cpi": 23.6
  },
  {
    "year": 1950,
    "month": 4,
    "equity": 0.03391,
    "bond": 0.000188,
    "cpi": 23.6
  },
  {
    "year": 1950,
    "month": 5,
    "equity": 0.039191,
    "bond": 0.000207,
    "cpi": 23.7
  },
  {
    "year": 1950,
    "month": 6,
    "equity": 0.021692,
    "bond": 0.000225,
    "cpi": 23.8
  },
  {
    "year": 1950,
    "month": 7,
    "equity": -0.067043,
    "bond": 0.000244,
    "cpi": 24.1
  },
  {
    "year": 1950,
    "month": 8,
    "equity": 0.066584,
    "bond": -0.000622,
    "cpi": 24.3
  },
  {
    "year": 1950,
    "month": 9,
    "equity": 0.041282,
    "bond": 0.00029,
    "cpi": 24.4
  },
  {
    "year": 1950,
    "month": 10,
    "equity": 0.047417,
    "bond": 0.000308,
    "cpi": 24.6
  },
  {
    "year": 1950,
    "month": 11,
    "equity": 0.003956,
    "bond": 0.000326,
    "cpi": 24.7
  },
  {
    "year": 1950,
    "month": 12,
    "equity": 0.002143,
    "bond": 0.000345,
    "cpi": 25.0
  },
  {
    "year": 1951,
    "month": 1,
    "equity": 0.080197,
    "bond": 0.000363,
    "cpi": 25.4
  },
  {
    "year": 1951,
    "month": 2,
    "equity": 0.043153,
    "bond": 0.001261,
    "cpi": 25.7
  },
  {
    "year": 1951,
    "month": 3,
    "equity": -0.011061,
    "bond": 0.00127,
    "cpi": 25.8
  },
  {
    "year": 1951,
    "month": 4,
    "equity": 0.019315,
    "bond": 0.001279,
    "cpi": 25.8
  },
  {
    "year": 1951,
    "month": 5,
    "equity": 0.006336,
    "bond": 0.001287,
    "cpi": 25.9
  },
  {
    "year": 1951,
    "month": 6,
    "equity": -0.0114,
    "bond": 0.001296,
    "cpi": 25.9
  },
  {
    "year": 1951,
    "month": 7,
    "equity": 0.023614,
    "bond": 0.002183,
    "cpi": 25.9
  },
  {
    "year": 1951,
    "month": 8,
    "equity": 0.049602,
    "bond": 0.001305,
    "cpi": 25.9
  },
  {
    "year": 1951,
    "month": 9,
    "equity": 0.031309,
    "bond": 0.001314,
    "cpi": 26.1
  },
  {
    "year": 1951,
    "month": 10,
    "equity": 0.000154,
    "bond": 0.001322,
    "cpi": 26.2
  },
  {
    "year": 1951,
    "month": 11,
    "equity": -0.022665,
    "bond": 0.001331,
    "cpi": 26.4
  },
  {
    "year": 1951,
    "month": 12,
    "equity": 0.035997,
    "bond": 0.00134,
    "cpi": 26.5
  },
  {
    "year": 1952,
    "month": 1,
    "equity": 0.03835,
    "bond": 0.001349,
    "cpi": 26.5
  },
  {
    "year": 1952,
    "month": 2,
    "equity": -0.013309,
    "bond": 0.001357,
    "cpi": 26.3
  },
  {
    "year": 1952,
    "month": 3,
    "equity": 0.007509,
    "bond": 0.000491,
    "cpi": 26.3
  },
  {
    "year": 1952,
    "month": 4,
    "equity": 0.002065,
    "bond": 0.001384,
    "cpi": 26.4
  },
  {
    "year": 1952,
    "month": 5,
    "equity": 0.004634,
    "bond": 0.001392,
    "cpi": 26.4
  },
  {
    "year": 1952,
    "month": 6,
    "equity": 0.032483,
    "bond": 0.001401,
    "cpi": 26.5
  },
  {
    "year": 1952,
    "month": 7,
    "equity": 0.033668,
    "bond": 0.00141,
    "cpi": 26.7
  },
  {
    "year": 1952,
    "month": 8,
    "equity": 0.008805,
    "bond": 0.000547,
    "cpi": 26.7
  },
  {
    "year": 1952,
    "month": 9,
    "equity": -0.011087,
    "bond": 0.001436,
    "cpi": 26.7
  },
  {
    "year": 1952,
    "month": 10,
    "equity": -0.016153,
    "bond": 0.001445,
    "cpi": 26.7
  },
  {
    "year": 1952,
    "month": 11,
    "equity": 0.036629,
    "bond": 0.000583,
    "cpi": 26.7
  },
  {
    "year": 1952,
    "month": 12,
    "equity": 0.045046,
    "bond": 0.001471,
    "cpi": 26.7
  },
  {
    "year": 1953,
    "month": 1,
    "equity": 0.009889,
    "bond": 0.00148,
    "cpi": 26.6
  },
  {
    "year": 1953,
    "month": 2,
    "equity": -0.007735,
    "bond": 0.004972,
    "cpi": 26.5
  },
  {
    "year": 1953,
    "month": 3,
    "equity": 0.009571,
    "bond": 0.004951,
    "cpi": 26.6
  },
  {
    "year": 1953,
    "month": 4,
    "equity": -0.044718,
    "bond": -0.002912,
    "cpi": 26.6
  },
  {
    "year": 1953,
    "month": 5,
    "equity": 0.010039,
    "bond": -0.016583,
    "cpi": 26.7
  },
  {
    "year": 1953,
    "month": 6,
    "equity": -0.031065,
    "bond": -0.002609,
    "cpi": 26.8
  },
  {
    "year": 1953,
    "month": 7,
    "equity": 0.019137,
    "bond": 0.018178,
    "cpi": 26.8
  },
  {
    "year": 1953,
    "month": 8,
    "equity": 0.008989,
    "bond": 0.000712,
    "cpi": 26.9
  },
  {
    "year": 1953,
    "month": 9,
    "equity": -0.041069,
    "bond": 0.009406,
    "cpi": 26.9
  },
  {
    "year": 1953,
    "month": 10,
    "equity": 0.035203,
    "bond": 0.020813,
    "cpi": 27.0
  },
  {
    "year": 1953,
    "month": 11,
    "equity": 0.027117,
    "bond": 0.000464,
    "cpi": 26.9
  },
  {
    "year": 1953,
    "month": 12,
    "equity": 0.018401,
    "bond": 0.010155,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 1,
    "equity": 0.030261,
    "bond": 0.011892,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 2,
    "equity": 0.026785,
    "bond": 0.002952,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 3,
    "equity": 0.025846,
    "bond": 0.010954,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 4,
    "equity": 0.044484,
    "bond": 0.009119,
    "cpi": 26.8
  },
  {
    "year": 1954,
    "month": 5,
    "equity": 0.044205,
    "bond": -0.005208,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 6,
    "equity": 0.012211,
    "bond": 0.001086,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 7,
    "equity": 0.044592,
    "bond": 0.009124,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 8,
    "equity": 0.023961,
    "bond": -0.003423,
    "cpi": 26.9
  },
  {
    "year": 1954,
    "month": 9,
    "equity": 0.027416,
    "bond": 0.000188,
    "cpi": 26.8
  },
  {
    "year": 1954,
    "month": 10,
    "equity": 0.027168,
    "bond": -0.002452,
    "cpi": 26.8
  },
  {
    "year": 1954,
    "month": 11,
    "equity": 0.043082,
    "bond": -0.002399,
    "cpi": 26.8
  },
  {
    "year": 1954,
    "month": 12,
    "equity": 0.049591,
    "bond": -0.000584,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 1,
    "equity": 0.021701,
    "bond": -0.006701,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 2,
    "equity": 0.037063,
    "bond": -0.001335,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 3,
    "equity": -0.004349,
    "bond": -0.000421,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 4,
    "equity": 0.03809,
    "bond": -0.003881,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 5,
    "equity": -0.00078,
    "bond": 0.001419,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 6,
    "equity": 0.061458,
    "bond": 0.000556,
    "cpi": 26.7
  },
  {
    "year": 1955,
    "month": 7,
    "equity": 0.076476,
    "bond": -0.008089,
    "cpi": 26.8
  },
  {
    "year": 1955,
    "month": 8,
    "equity": -0.002961,
    "bond": -0.003633,
    "cpi": 26.8
  },
  {
    "year": 1955,
    "month": 9,
    "equity": 0.048197,
    "bond": 0.002475,
    "cpi": 26.9
  },
  {
    "year": 1955,
    "month": 10,
    "equity": -0.047236,
    "bond": 0.010287,
    "cpi": 26.9
  },
  {
    "year": 1955,
    "month": 11,
    "equity": 0.070675,
    "bond": 0.001532,
    "cpi": 26.9
  },
  {
    "year": 1955,
    "month": 12,
    "equity": 0.012384,
    "bond": -0.003644,
    "cpi": 26.8
  },
  {
    "year": 1956,
    "month": 1,
    "equity": -0.023823,
    "bond": 0.00767,
    "cpi": 26.8
  },
  {
    "year": 1956,
    "month": 2,
    "equity": 0.009551,
    "bond": 0.007635,
    "cpi": 26.8
  },
  {
    "year": 1956,
    "month": 3,
    "equity": 0.072117,
    "bond": -0.008009,
    "cpi": 26.8
  },
  {
    "year": 1956,
    "month": 4,
    "equity": 0.014869,
    "bond": -0.016357,
    "cpi": 26.9
  },
  {
    "year": 1956,
    "month": 5,
    "equity": -0.028344,
    "bond": 0.012111,
    "cpi": 27.0
  },
  {
    "year": 1956,
    "month": 6,
    "equity": -0.002578,
    "bond": 0.008599,
    "cpi": 27.2
  },
  {
    "year": 1956,
    "month": 7,
    "equity": 0.057513,
    "bond": -0.006943,
    "cpi": 27.4
  },
  {
    "year": 1956,
    "month": 8,
    "equity": -0.002824,
    "bond": -0.016098,
    "cpi": 27.3
  },
  {
    "year": 1956,
    "month": 9,
    "equity": -0.030865,
    "bond": -0.001463,
    "cpi": 27.4
  },
  {
    "year": 1956,
    "month": 10,
    "equity": -0.009595,
    "bond": 0.006213,
    "cpi": 27.5
  },
  {
    "year": 1956,
    "month": 11,
    "equity": -0.007185,
    "bond": -0.009863,
    "cpi": 27.5
  },
  {
    "year": 1956,
    "month": 12,
    "equity": 0.018029,
    "bond": -0.005483,
    "cpi": 27.6
  },
  {
    "year": 1957,
    "month": 1,
    "equity": -0.018632,
    "bond": 0.013968,
    "cpi": 27.6
  },
  {
    "year": 1957,
    "month": 2,
    "equity": -0.039964,
    "bond": 0.013073,
    "cpi": 27.7
  },
  {
    "year": 1957,
    "month": 3,
    "equity": 0.016199,
    "bond": -0.003141,
    "cpi": 27.8
  },
  {
    "year": 1957,
    "month": 4,
    "equity": 0.02644,
    "bond": -0.003063,
    "cpi": 27.9
  },
  {
    "year": 1957,
    "month": 5,
    "equity": 0.041602,
    "bond": -0.007165,
    "cpi": 28.0
  },
  {
    "year": 1957,
    "month": 6,
    "equity": 0.019542,
    "bond": -0.013617,
    "cpi": 28.1
  },
  {
    "year": 1957,
    "month": 7,
    "equity": 0.023239,
    "bond": -0.007569,
    "cpi": 28.3
  },
  {
    "year": 1957,
    "month": 8,
    "equity": -0.052034,
    "bond": 0.003275,
    "cpi": 28.3
  },
  {
    "year": 1957,
    "month": 9,
    "equity": -0.037376,
    "bond": 0.004101,
    "cpi": 28.3
  },
  {
    "year": 1957,
    "month": 10,
    "equity": -0.058947,
    "bond": -0.000855,
    "cpi": 28.3
  },
  {
    "year": 1957,
    "month": 11,
    "equity": -0.017984,
    "bond": 0.024158,
    "cpi": 28.4
  },
  {
    "year": 1957,
    "month": 12,
    "equity": 0.003201,
    "bond": 0.046675,
    "cpi": 28.4
  },
  {
    "year": 1958,
    "month": 1,
    "equity": 0.023273,
    "bond": 0.012987,
    "cpi": 28.6
  },
  {
    "year": 1958,
    "month": 2,
    "equity": 0.007005,
    "bond": 0.006019,
    "cpi": 28.6
  },
  {
    "year": 1958,
    "month": 3,
    "equity": 0.024176,
    "bond": 0.008589,
    "cpi": 28.8
  },
  {
    "year": 1958,
    "month": 4,
    "equity": 0.008938,
    "bond": 0.011163,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 5,
    "equity": 0.035552,
    "bond": -0.001065,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 6,
    "equity": 0.027326,
    "bond": -0.001888,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 7,
    "equity": 0.030708,
    "bond": -0.017186,
    "cpi": 29.0
  },
  {
    "year": 1958,
    "month": 8,
    "equity": 0.040543,
    "bond": -0.025932,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 9,
    "equity": 0.029437,
    "bond": -0.015363,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 10,
    "equity": 0.043601,
    "bond": -0.00019,
    "cpi": 28.9
  },
  {
    "year": 1958,
    "month": 11,
    "equity": 0.033273,
    "bond": 0.008166,
    "cpi": 29.0
  },
  {
    "year": 1958,
    "month": 12,
    "equity": 0.021635,
    "bond": -0.006826,
    "cpi": 28.9
  },
  {
    "year": 1959,
    "month": 1,
    "equity": 0.042557,
    "bond": -0.00994,
    "cpi": 29.0
  },
  {
    "year": 1959,
    "month": 2,
    "equity": -0.01264,
    "bond": 0.008298,
    "cpi": 28.9
  },
  {
    "year": 1959,
    "month": 3,
    "equity": 0.028072,
    "bond": 0.00083,
    "cpi": 28.9
  },
  {
    "year": 1959,
    "month": 4,
    "equity": 0.019374,
    "bond": -0.007315,
    "cpi": 29.0
  },
  {
    "year": 1959,
    "month": 5,
    "equity": 0.017664,
    "bond": -0.01198,
    "cpi": 29.0
  },
  {
    "year": 1959,
    "month": 6,
    "equity": -0.006053,
    "bond": 0.001161,
    "cpi": 29.1
  },
  {
    "year": 1959,
    "month": 7,
    "equity": 0.042285,
    "bond": -0.00123,
    "cpi": 29.2
  },
  {
    "year": 1959,
    "month": 8,
    "equity": -0.003176,
    "bond": 0.001247,
    "cpi": 29.2
  },
  {
    "year": 1959,
    "month": 9,
    "equity": -0.037023,
    "bond": -0.016243,
    "cpi": 29.3
  },
  {
    "year": 1959,
    "month": 10,
    "equity": 0.001777,
    "bond": 0.015944,
    "cpi": 29.4
  },
  {
    "year": 1959,
    "month": 11,
    "equity": 0.006701,
    "bond": 0.003775,
    "cpi": 29.4
  },
  {
    "year": 1959,
    "month": 12,
    "equity": 0.034641,
    "bond": -0.008977,
    "cpi": 29.4
  },
  {
    "year": 1960,
    "month": 1,
    "equity": -0.014806,
    "bond": 0.001521,
    "cpi": 29.3
  },
  {
    "year": 1960,
    "month": 2,
    "equity": -0.03604,
    "bond": 0.022436,
    "cpi": 29.4
  },
  {
    "year": 1960,
    "month": 3,
    "equity": -0.010727,
    "bond": 0.023266,
    "cpi": 29.4
  },
  {
    "year": 1960,
    "month": 4,
    "equity": 0.015848,
    "bond": 0.001105,
    "cpi": 29.5
  },
  {
    "year": 1960,
    "month": 5,
    "equity": -0.00624,
    "bond": -0.002101,
    "cpi": 29.5
  },
  {
    "year": 1960,
    "month": 6,
    "equity": 0.039886,
    "bond": 0.019971,
    "cpi": 29.6
  },
  {
    "year": 1960,
    "month": 7,
    "equity": -0.021961,
    "bond": 0.024132,
    "cpi": 29.6
  },
  {
    "year": 1960,
    "month": 8,
    "equity": 0.014909,
    "bond": 0.011559,
    "cpi": 29.6
  },
  {
    "year": 1960,
    "month": 9,
    "equity": -0.027208,
    "bond": 0.003167,
    "cpi": 29.6
  },
  {
    "year": 1960,
    "month": 10,
    "equity": -0.01674,
    "bond": -0.004279,
    "cpi": 29.8
  },
  {
    "year": 1960,
    "month": 11,
    "equity": 0.035409,
    "bond": -6.2e-05,
    "cpi": 29.8
  },
  {
    "year": 1960,
    "month": 12,
    "equity": 0.026906,
    "bond": 0.010739,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 1,
    "equity": 0.054264,
    "bond": 0.0032,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 2,
    "equity": 0.043737,
    "bond": 0.00819,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 3,
    "equity": 0.033966,
    "bond": 0.006483,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 4,
    "equity": 0.02919,
    "bond": -0.00021,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 5,
    "equity": 0.012634,
    "bond": 0.008991,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 6,
    "equity": -0.010802,
    "bond": -0.01098,
    "cpi": 29.8
  },
  {
    "year": 1961,
    "month": 7,
    "equity": -0.000271,
    "bond": -7.1e-05,
    "cpi": 30.0
  },
  {
    "year": 1961,
    "month": 8,
    "equity": 0.038398,
    "bond": -0.006592,
    "cpi": 29.9
  },
  {
    "year": 1961,
    "month": 9,
    "equity": -0.005409,
    "bond": 0.00831,
    "cpi": 30.0
  },
  {
    "year": 1961,
    "month": 10,
    "equity": 0.013455,
    "bond": 0.008274,
    "cpi": 30.0
  },
  {
    "year": 1961,
    "month": 11,
    "equity": 0.047745,
    "bond": 0.001616,
    "cpi": 30.0
  },
  {
    "year": 1961,
    "month": 12,
    "equity": 0.011654,
    "bond": -0.006566,
    "cpi": 30.0
  },
  {
    "year": 1962,
    "month": 1,
    "equity": -0.034864,
    "bond": 0.001743,
    "cpi": 30.0
  },
  {
    "year": 1962,
    "month": 2,
    "equity": 0.019103,
    "bond": 0.006686,
    "cpi": 30.1
  },
  {
    "year": 1962,
    "month": 3,
    "equity": 0.003418,
    "bond": 0.01245,
    "cpi": 30.1
  },
  {
    "year": 1962,
    "month": 4,
    "equity": -0.029442,
    "bond": 0.010739,
    "cpi": 30.2
  },
  {
    "year": 1962,
    "month": 5,
    "equity": -0.071843,
    "bond": 0.000716,
    "cpi": 30.2
  },
  {
    "year": 1962,
    "month": 6,
    "equity": -0.114119,
    "bond": -8.1e-05,
    "cpi": 30.2
  },
  {
    "year": 1962,
    "month": 7,
    "equity": 0.027184,
    "bond": -0.004969,
    "cpi": 30.3
  },
  {
    "year": 1962,
    "month": 8,
    "equity": 0.03024,
    "bond": 0.005813,
    "cpi": 30.3
  },
  {
    "year": 1962,
    "month": 9,
    "equity": -0.005924,
    "bond": 0.003317,
    "cpi": 30.4
  },
  {
    "year": 1962,
    "month": 10,
    "equity": -0.028539,
    "bond": 0.007446,
    "cpi": 30.4
  },
  {
    "year": 1962,
    "month": 11,
    "equity": 0.072033,
    "bond": 0.004101,
    "cpi": 30.4
  },
  {
    "year": 1962,
    "month": 12,
    "equity": 0.046261,
    "bond": 0.008238,
    "cpi": 30.4
  },
  {
    "year": 1963,
    "month": 1,
    "equity": 0.041476,
    "bond": 0.005706,
    "cpi": 30.4
  },
  {
    "year": 1963,
    "month": 2,
    "equity": 0.015964,
    "bond": -0.004244,
    "cpi": 30.4
  },
  {
    "year": 1963,
    "month": 3,
    "equity": -0.001075,
    "bond": 0.002441,
    "cpi": 30.5
  },
  {
    "year": 1963,
    "month": 4,
    "equity": 0.049803,
    "bond": -2.2e-05,
    "cpi": 30.5
  },
  {
    "year": 1963,
    "month": 5,
    "equity": 0.022716,
    "bond": 0.006612,
    "cpi": 30.5
  },
  {
    "year": 1963,
    "month": 6,
    "equity": 0.002186,
    "bond": -0.001666,
    "cpi": 30.6
  },
  {
    "year": 1963,
    "month": 7,
    "equity": -0.012215,
    "bond": 0.000858,
    "cpi": 30.7
  },
  {
    "year": 1963,
    "month": 8,
    "equity": 0.030315,
    "bond": 0.004996,
    "cpi": 30.7
  },
  {
    "year": 1963,
    "month": 9,
    "equity": 0.02894,
    "bond": -0.003227,
    "cpi": 30.7
  },
  {
    "year": 1963,
    "month": 10,
    "equity": 0.005026,
    "bond": 0.000943,
    "cpi": 30.8
  },
  {
    "year": 1963,
    "month": 11,
    "equity": -0.003039,
    "bond": 0.002607,
    "cpi": 30.8
  },
  {
    "year": 1963,
    "month": 12,
    "equity": 0.02396,
    "bond": 0.002615,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 1,
    "equity": 0.033321,
    "bond": 0.000175,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 2,
    "equity": 0.014817,
    "bond": 0.00511,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 3,
    "equity": 0.020728,
    "bond": -0.002244,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 4,
    "equity": 0.016949,
    "bond": 0.002702,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 5,
    "equity": 0.012221,
    "bond": 0.005971,
    "cpi": 30.9
  },
  {
    "year": 1964,
    "month": 6,
    "equity": -0.003489,
    "bond": 0.00595,
    "cpi": 31.0
  },
  {
    "year": 1964,
    "month": 7,
    "equity": 0.039631,
    "bond": 0.001843,
    "cpi": 31.1
  },
  {
    "year": 1964,
    "month": 8,
    "equity": -0.012237,
    "bond": 0.003492,
    "cpi": 31.0
  },
  {
    "year": 1964,
    "month": 9,
    "equity": 0.019675,
    "bond": 0.002676,
    "cpi": 31.1
  },
  {
    "year": 1964,
    "month": 10,
    "equity": 0.019722,
    "bond": 0.004316,
    "cpi": 31.1
  },
  {
    "year": 1964,
    "month": 11,
    "equity": 0.009389,
    "bond": 0.006761,
    "cpi": 31.2
  },
  {
    "year": 1964,
    "month": 12,
    "equity": -0.014884,
    "bond": 0.00101,
    "cpi": 31.2
  },
  {
    "year": 1965,
    "month": 1,
    "equity": 0.028224,
    "bond": 0.002668,
    "cpi": 31.2
  },
  {
    "year": 1965,
    "month": 2,
    "equity": 0.009767,
    "bond": 0.001862,
    "cpi": 31.2
  },
  {
    "year": 1965,
    "month": 3,
    "equity": 0.003372,
    "bond": 0.003508,
    "cpi": 31.3
  },
  {
    "year": 1965,
    "month": 4,
    "equity": 0.015596,
    "bond": 0.004324,
    "cpi": 31.4
  },
  {
    "year": 1965,
    "month": 5,
    "equity": 0.017345,
    "bond": 0.002685,
    "cpi": 31.4
  },
  {
    "year": 1965,
    "month": 6,
    "equity": -0.045055,
    "bond": 0.003508,
    "cpi": 31.6
  },
  {
    "year": 1965,
    "month": 7,
    "equity": 0.001045,
    "bond": 0.004324,
    "cpi": 31.6
  },
  {
    "year": 1965,
    "month": 8,
    "equity": 0.021202,
    "bond": -0.000568,
    "cpi": 31.6
  },
  {
    "year": 1965,
    "month": 9,
    "equity": 0.035977,
    "bond": 0.000294,
    "cpi": 31.6
  },
  {
    "year": 1965,
    "month": 10,
    "equity": 0.024987,
    "bond": -0.001283,
    "cpi": 31.7
  },
  {
    "year": 1965,
    "month": 11,
    "equity": 0.010778,
    "bond": -0.004435,
    "cpi": 31.7
  },
  {
    "year": 1965,
    "month": 12,
    "equity": -0.002098,
    "bond": -0.009885,
    "cpi": 31.8
  },
  {
    "year": 1966,
    "month": 1,
    "equity": 0.019823,
    "bond": 0.00465,
    "cpi": 31.8
  },
  {
    "year": 1966,
    "month": 2,
    "equity": -0.004286,
    "bond": -0.013579,
    "cpi": 32.0
  },
  {
    "year": 1966,
    "month": 3,
    "equity": -0.038605,
    "bond": 0.000863,
    "cpi": 32.1
  },
  {
    "year": 1966,
    "month": 4,
    "equity": 0.033225,
    "bond": 0.013596,
    "cpi": 32.3
  },
  {
    "year": 1966,
    "month": 5,
    "equity": -0.050061,
    "bond": 0.001577,
    "cpi": 32.3
  },
  {
    "year": 1966,
    "month": 6,
    "equity": -0.005579,
    "bond": 0.001606,
    "cpi": 32.4
  },
  {
    "year": 1966,
    "month": 7,
    "equity": 0.000203,
    "bond": -0.012476,
    "cpi": 32.5
  },
  {
    "year": 1966,
    "month": 8,
    "equity": -0.057675,
    "bond": -0.011372,
    "cpi": 32.7
  },
  {
    "year": 1966,
    "month": 9,
    "equity": -0.032228,
    "bond": 0.007467,
    "cpi": 32.7
  },
  {
    "year": 1966,
    "month": 10,
    "equity": -0.005651,
    "bond": 0.017667,
    "cpi": 32.9
  },
  {
    "year": 1966,
    "month": 11,
    "equity": 0.053153,
    "bond": -0.007524,
    "cpi": 32.9
  },
  {
    "year": 1966,
    "month": 12,
    "equity": 0.007151,
    "bond": 0.029628,
    "cpi": 32.9
  },
  {
    "year": 1967,
    "month": 1,
    "equity": 0.041313,
    "bond": 0.024862,
    "cpi": 32.9
  },
  {
    "year": 1967,
    "month": 2,
    "equity": 0.03731,
    "bond": -0.00018,
    "cpi": 32.9
  },
  {
    "year": 1967,
    "month": 3,
    "equity": 0.026347,
    "bond": 0.011082,
    "cpi": 33.0
  },
  {
    "year": 1967,
    "month": 4,
    "equity": 0.019925,
    "bond": -0.00022,
    "cpi": 33.1
  },
  {
    "year": 1967,
    "month": 5,
    "equity": 0.020577,
    "bond": -0.016745,
    "cpi": 33.2
  },
  {
    "year": 1967,
    "month": 6,
    "equity": -0.009918,
    "bond": -0.009303,
    "cpi": 33.3
  },
  {
    "year": 1967,
    "month": 7,
    "equity": 0.01993,
    "bond": -0.006735,
    "cpi": 33.4
  },
  {
    "year": 1967,
    "month": 8,
    "equity": 0.018522,
    "bond": -0.005008,
    "cpi": 33.5
  },
  {
    "year": 1967,
    "month": 9,
    "equity": 0.016545,
    "bond": 0.00285,
    "cpi": 33.6
  },
  {
    "year": 1967,
    "month": 10,
    "equity": 0.000974,
    "bond": -0.009417,
    "cpi": 33.7
  },
  {
    "year": 1967,
    "month": 11,
    "equity": -0.028817,
    "bond": -0.015931,
    "cpi": 33.8
  },
  {
    "year": 1967,
    "month": 12,
    "equity": 0.031117,
    "bond": 0.008596,
    "cpi": 33.9
  },
  {
    "year": 1968,
    "month": 1,
    "equity": -0.000166,
    "bond": 0.017786,
    "cpi": 34.1
  },
  {
    "year": 1968,
    "month": 2,
    "equity": -0.042561,
    "bond": 0.002311,
    "cpi": 34.2
  },
  {
    "year": 1968,
    "month": 3,
    "equity": -0.015583,
    "bond": -0.009038,
    "cpi": 34.3
  },
  {
    "year": 1968,
    "month": 4,
    "equity": 0.07663,
    "bond": 0.012413,
    "cpi": 34.4
  },
  {
    "year": 1968,
    "month": 5,
    "equity": 0.025589,
    "bond": -0.012666,
    "cpi": 34.5
  },
  {
    "year": 1968,
    "month": 6,
    "equity": 0.029418,
    "bond": 0.016295,
    "cpi": 34.7
  },
  {
    "year": 1968,
    "month": 7,
    "equity": 0.0005,
    "bond": 0.02166,
    "cpi": 34.9
  },
  {
    "year": 1968,
    "month": 8,
    "equity": -0.019328,
    "bond": 0.010749,
    "cpi": 35.0
  },
  {
    "year": 1968,
    "month": 9,
    "equity": 0.035088,
    "bond": 0.00144,
    "cpi": 35.1
  },
  {
    "year": 1968,
    "month": 10,
    "equity": 0.027183,
    "bond": -0.004631,
    "cpi": 35.3
  },
  {
    "year": 1968,
    "month": 11,
    "equity": 0.017868,
    "bond": -0.004481,
    "cpi": 35.4
  },
  {
    "year": 1968,
    "month": 12,
    "equity": 0.012864,
    "bond": -0.019987,
    "cpi": 35.5
  },
  {
    "year": 1969,
    "month": 1,
    "equity": -0.039844,
    "bond": 0.004276,
    "cpi": 35.6
  },
  {
    "year": 1969,
    "month": 2,
    "equity": -0.002377,
    "bond": -0.00613,
    "cpi": 35.8
  },
  {
    "year": 1969,
    "month": 3,
    "equity": -0.01913,
    "bond": -0.002987,
    "cpi": 36.1
  },
  {
    "year": 1969,
    "month": 4,
    "equity": 0.022751,
    "bond": 0.014933,
    "cpi": 36.3
  },
  {
    "year": 1969,
    "month": 5,
    "equity": 0.035143,
    "bond": -0.005956,
    "cpi": 36.4
  },
  {
    "year": 1969,
    "month": 6,
    "equity": -0.049705,
    "bond": -0.013024,
    "cpi": 36.6
  },
  {
    "year": 1969,
    "month": 7,
    "equity": -0.042048,
    "bond": -0.005426,
    "cpi": 36.8
  },
  {
    "year": 1969,
    "month": 8,
    "equity": -0.00283,
    "bond": 0.007783,
    "cpi": 37.0
  },
  {
    "year": 1969,
    "month": 9,
    "equity": 0.006291,
    "bond": -0.027919,
    "cpi": 37.1
  },
  {
    "year": 1969,
    "month": 10,
    "equity": 0.013467,
    "bond": 0.010254,
    "cpi": 37.3
  },
  {
    "year": 1969,
    "month": 11,
    "equity": 0.009978,
    "bond": 0.003064,
    "cpi": 37.5
  },
  {
    "year": 1969,
    "month": 12,
    "equity": -0.050272,
    "bond": -0.029619,
    "cpi": 37.7
  },
  {
    "year": 1970,
    "month": 1,
    "equity": -0.005887,
    "bond": -0.003329,
    "cpi": 37.8
  },
  {
    "year": 1970,
    "month": 2,
    "equity": -0.031958,
    "bond": 0.045549,
    "cpi": 38.0
  },
  {
    "year": 1970,
    "month": 3,
    "equity": 0.020126,
    "bond": 0.018197,
    "cpi": 38.2
  },
  {
    "year": 1970,
    "month": 4,
    "equity": -0.027474,
    "bond": -0.016683,
    "cpi": 38.5
  },
  {
    "year": 1970,
    "month": 5,
    "equity": -0.111987,
    "bond": -0.029698,
    "cpi": 38.6
  },
  {
    "year": 1970,
    "month": 6,
    "equity": -0.002695,
    "bond": 0.011433,
    "cpi": 38.8
  },
  {
    "year": 1970,
    "month": 7,
    "equity": 0.005229,
    "bond": 0.033258,
    "cpi": 39.0
  },
  {
    "year": 1970,
    "month": 8,
    "equity": 0.032561,
    "bond": 0.001309,
    "cpi": 39.0
  },
  {
    "year": 1970,
    "month": 9,
    "equity": 0.063217,
    "bond": 0.016151,
    "cpi": 39.2
  },
  {
    "year": 1970,
    "month": 10,
    "equity": 0.024878,
    "bond": 0.010402,
    "cpi": 39.4
  },
  {
    "year": 1970,
    "month": 11,
    "equity": 0.002051,
    "bond": 0.041528,
    "cpi": 39.6
  },
  {
    "year": 1970,
    "month": 12,
    "equity": 0.071567,
    "bond": 0.038889,
    "cpi": 39.8
  },
  {
    "year": 1971,
    "month": 1,
    "equity": 0.041098,
    "bond": 0.016463,
    "cpi": 39.8
  },
  {
    "year": 1971,
    "month": 2,
    "equity": 0.041502,
    "bond": 0.01491,
    "cpi": 39.9
  },
  {
    "year": 1971,
    "month": 3,
    "equity": 0.02831,
    "bond": 0.036288,
    "cpi": 40.0
  },
  {
    "year": 1971,
    "month": 4,
    "equity": 0.036736,
    "bond": -0.005083,
    "cpi": 40.1
  },
  {
    "year": 1971,
    "month": 5,
    "equity": -0.011081,
    "bond": -0.036444,
    "cpi": 40.3
  },
  {
    "year": 1971,
    "month": 6,
    "equity": -0.015961,
    "bond": -0.004207,
    "cpi": 40.6
  },
  {
    "year": 1971,
    "month": 7,
    "equity": -0.004632,
    "bond": -0.009821,
    "cpi": 40.7
  },
  {
    "year": 1971,
    "month": 8,
    "equity": -0.015174,
    "bond": 0.016578,
    "cpi": 40.8
  },
  {
    "year": 1971,
    "month": 9,
    "equity": 0.024861,
    "bond": 0.038302,
    "cpi": 40.8
  },
  {
    "year": 1971,
    "month": 10,
    "equity": -0.018642,
    "bond": 0.02093,
    "cpi": 40.9
  },
  {
    "year": 1971,
    "month": 11,
    "equity": -0.043721,
    "bond": 0.014027,
    "cpi": 40.9
  },
  {
    "year": 1971,
    "month": 12,
    "equity": 0.07163,
    "bond": -0.004194,
    "cpi": 41.1
  },
  {
    "year": 1972,
    "month": 1,
    "equity": 0.044225,
    "bond": 0.003437,
    "cpi": 41.1
  },
  {
    "year": 1972,
    "month": 2,
    "equity": 0.02087,
    "bond": -0.004764,
    "cpi": 41.3
  },
  {
    "year": 1972,
    "month": 3,
    "equity": 0.026196,
    "bond": 0.005815,
    "cpi": 41.4
  },
  {
    "year": 1972,
    "month": 4,
    "equity": 0.012589,
    "bond": -0.003872,
    "cpi": 41.5
  },
  {
    "year": 1972,
    "month": 5,
    "equity": -0.007759,
    "bond": 0.009636,
    "cpi": 41.6
  },
  {
    "year": 1972,
    "month": 6,
    "equity": 0.005161,
    "bond": 0.006602,
    "cpi": 41.7
  },
  {
    "year": 1972,
    "month": 7,
    "equity": -0.005036,
    "bond": 0.005092,
    "cpi": 41.9
  },
  {
    "year": 1972,
    "month": 8,
    "equity": 0.037839,
    "bond": -0.002344,
    "cpi": 42.0
  },
  {
    "year": 1972,
    "month": 9,
    "equity": -0.012102,
    "bond": -0.019722,
    "cpi": 42.1
  },
  {
    "year": 1972,
    "month": 10,
    "equity": 0.004192,
    "bond": 0.0106,
    "cpi": 42.3
  },
  {
    "year": 1972,
    "month": 11,
    "equity": 0.05256,
    "bond": 0.020224,
    "cpi": 42.4
  },
  {
    "year": 1972,
    "month": 12,
    "equity": 0.023132,
    "bond": -0.000675,
    "cpi": 42.5
  },
  {
    "year": 1973,
    "month": 1,
    "equity": 0.009898,
    "bond": -0.002052,
    "cpi": 42.6
  },
  {
    "year": 1973,
    "month": 2,
    "equity": -0.033247,
    "bond": -0.007744,
    "cpi": 42.9
  },
  {
    "year": 1973,
    "month": 3,
    "equity": -0.013449,
    "bond": 0.000444,
    "cpi": 43.3
  },
  {
    "year": 1973,
    "month": 4,
    "equity": -0.016321,
    "bond": 0.008505,
    "cpi": 43.6
  },
  {
    "year": 1973,
    "month": 5,
    "equity": -0.025685,
    "bond": -0.007447,
    "cpi": 43.9
  },
  {
    "year": 1973,
    "month": 6,
    "equity": -0.019885,
    "bond": 0.002104,
    "cpi": 44.2
  },
  {
    "year": 1973,
    "month": 7,
    "equity": 0.012116,
    "bond": -0.010663,
    "cpi": 44.3
  },
  {
    "year": 1973,
    "month": 8,
    "equity": -0.016341,
    "bond": -0.013097,
    "cpi": 45.1
  },
  {
    "year": 1973,
    "month": 9,
    "equity": 0.019966,
    "bond": 0.028327,
    "cpi": 45.2
  },
  {
    "year": 1973,
    "month": 10,
    "equity": 0.042382,
    "bond": 0.027642,
    "cpi": 45.6
  },
  {
    "year": 1973,
    "month": 11,
    "equity": -0.068501,
    "bond": 0.010017,
    "cpi": 45.9
  },
  {
    "year": 1973,
    "month": 12,
    "equity": -0.068023,
    "bond": 0.004882,
    "cpi": 46.2
  },
  {
    "year": 1974,
    "month": 1,
    "equity": 0.017022,
    "bond": -0.012334,
    "cpi": 46.6
  },
  {
    "year": 1974,
    "month": 2,
    "equity": -0.024711,
    "bond": 0.007982,
    "cpi": 47.2
  },
  {
    "year": 1974,
    "month": 3,
    "equity": 0.045764,
    "bond": -0.011977,
    "cpi": 47.8
  },
  {
    "year": 1974,
    "month": 4,
    "equity": -0.048149,
    "bond": -0.015044,
    "cpi": 48.0
  },
  {
    "year": 1974,
    "month": 5,
    "equity": -0.027039,
    "bond": 0.001361,
    "cpi": 48.6
  },
  {
    "year": 1974,
    "month": 6,
    "equity": 0.004591,
    "bond": 0.00912,
    "cpi": 49.0
  },
  {
    "year": 1974,
    "month": 7,
    "equity": -0.113441,
    "bond": -0.012416,
    "cpi": 49.4
  },
  {
    "year": 1974,
    "month": 8,
    "equity": -0.037616,
    "bond": -0.009262,
    "cpi": 50.0
  },
  {
    "year": 1974,
    "month": 9,
    "equity": -0.100103,
    "bond": 0.0067,
    "cpi": 50.6
  },
  {
    "year": 1974,
    "month": 10,
    "equity": 0.023773,
    "bond": 0.016358,
    "cpi": 51.1
  },
  {
    "year": 1974,
    "month": 11,
    "equity": 0.037438,
    "bond": 0.021907,
    "cpi": 51.5
  },
  {
    "year": 1974,
    "month": 12,
    "equity": -0.060914,
    "bond": 0.024005,
    "cpi": 51.9
  },
  {
    "year": 1975,
    "month": 1,
    "equity": 0.086357,
    "bond": 0.001277,
    "cpi": 52.1
  },
  {
    "year": 1975,
    "month": 2,
    "equity": 0.108102,
    "bond": 0.01401,
    "cpi": 52.5
  },
  {
    "year": 1975,
    "month": 3,
    "equity": 0.049761,
    "bond": -0.017471,
    "cpi": 52.7
  },
  {
    "year": 1975,
    "month": 4,
    "equity": 0.014884,
    "bond": -0.027559,
    "cpi": 52.9
  },
  {
    "year": 1975,
    "month": 5,
    "equity": 0.067139,
    "bond": 0.018504,
    "cpi": 53.2
  },
  {
    "year": 1975,
    "month": 6,
    "equity": 0.028959,
    "bond": 0.020538,
    "cpi": 53.6
  },
  {
    "year": 1975,
    "month": 7,
    "equity": 0.00432,
    "bond": -0.007151,
    "cpi": 54.2
  },
  {
    "year": 1975,
    "month": 8,
    "equity": -0.069963,
    "bond": -0.016234,
    "cpi": 54.3
  },
  {
    "year": 1975,
    "month": 9,
    "equity": -0.008527,
    "bond": 0.004978,
    "cpi": 54.6
  },
  {
    "year": 1975,
    "month": 10,
    "equity": 0.049703,
    "bond": 0.026823,
    "cpi": 54.9
  },
  {
    "year": 1975,
    "month": 11,
    "equity": 0.020408,
    "bond": 0.012952,
    "cpi": 55.3
  },
  {
    "year": 1975,
    "month": 12,
    "equity": -0.011806,
    "bond": 0.010143,
    "cpi": 55.5
  },
  {
    "year": 1976,
    "month": 1,
    "equity": 0.095456,
    "bond": 0.024729,
    "cpi": 55.6
  },
  {
    "year": 1976,
    "month": 2,
    "equity": 0.041784,
    "bond": 0.002984,
    "cpi": 55.8
  },
  {
    "year": 1976,
    "month": 3,
    "equity": 0.008027,
    "bond": 0.010662,
    "cpi": 55.9
  },
  {
    "year": 1976,
    "month": 4,
    "equity": 0.010974,
    "bond": 0.018345,
    "cpi": 56.1
  },
  {
    "year": 1976,
    "month": 5,
    "equity": -0.003814,
    "bond": -0.017155,
    "cpi": 56.5
  },
  {
    "year": 1976,
    "month": 6,
    "equity": 0.009025,
    "bond": 0.009348,
    "cpi": 56.8
  },
  {
    "year": 1976,
    "month": 7,
    "equity": 0.026678,
    "bond": 0.008626,
    "cpi": 57.1
  },
  {
    "year": 1976,
    "month": 8,
    "equity": -0.005582,
    "bond": 0.010688,
    "cpi": 57.4
  },
  {
    "year": 1976,
    "month": 9,
    "equity": 0.024403,
    "bond": 0.019062,
    "cpi": 57.6
  },
  {
    "year": 1976,
    "month": 10,
    "equity": -0.031029,
    "bond": 0.019012,
    "cpi": 57.9
  },
  {
    "year": 1976,
    "month": 11,
    "equity": -0.003612,
    "bond": 0.014678,
    "cpi": 58.0
  },
  {
    "year": 1976,
    "month": 12,
    "equity": 0.03792,
    "bond": 0.036394,
    "cpi": 58.2
  },
  {
    "year": 1977,
    "month": 1,
    "equity": -0.005335,
    "bond": -0.018452,
    "cpi": 58.5
  },
  {
    "year": 1977,
    "month": 2,
    "equity": -0.023649,
    "bond": -0.00669,
    "cpi": 59.1
  },
  {
    "year": 1977,
    "month": 3,
    "equity": -0.000503,
    "bond": 0.001235,
    "cpi": 59.5
  },
  {
    "year": 1977,
    "month": 4,
    "equity": -0.01189,
    "bond": 0.012571,
    "cpi": 60.0
  },
  {
    "year": 1977,
    "month": 5,
    "equity": 0.000693,
    "bond": -0.000188,
    "cpi": 60.3
  },
  {
    "year": 1977,
    "month": 6,
    "equity": 0.009045,
    "bond": 0.018976,
    "cpi": 60.7
  },
  {
    "year": 1977,
    "month": 7,
    "equity": 0.012864,
    "bond": 0.00253,
    "cpi": 61.0
  },
  {
    "year": 1977,
    "month": 8,
    "equity": -0.020747,
    "bond": 0.001172,
    "cpi": 61.2
  },
  {
    "year": 1977,
    "month": 9,
    "equity": -0.011714,
    "bond": 0.010409,
    "cpi": 61.4
  },
  {
    "year": 1977,
    "month": 10,
    "equity": -0.02193,
    "bond": -0.006509,
    "cpi": 61.6
  },
  {
    "year": 1977,
    "month": 11,
    "equity": 0.009862,
    "bond": 0.002069,
    "cpi": 61.9
  },
  {
    "year": 1977,
    "month": 12,
    "equity": -0.000751,
    "bond": -0.001342,
    "cpi": 62.1
  },
  {
    "year": 1978,
    "month": 1,
    "equity": -0.033865,
    "bond": -0.012169,
    "cpi": 62.5
  },
  {
    "year": 1978,
    "month": 2,
    "equity": -0.00968,
    "bond": 0.001832,
    "cpi": 62.9
  },
  {
    "year": 1978,
    "month": 3,
    "equity": 0.002697,
    "bond": 0.006006,
    "cpi": 63.4
  },
  {
    "year": 1978,
    "month": 4,
    "equity": 0.048334,
    "bond": -0.000806,
    "cpi": 63.9
  },
  {
    "year": 1978,
    "month": 5,
    "equity": 0.055076,
    "bond": -0.006738,
    "cpi": 64.5
  },
  {
    "year": 1978,
    "month": 6,
    "equity": 0.006767,
    "bond": -0.000448,
    "cpi": 65.2
  },
  {
    "year": 1978,
    "month": 7,
    "equity": -0.000592,
    "bond": -0.004975,
    "cpi": 65.7
  },
  {
    "year": 1978,
    "month": 8,
    "equity": 0.073313,
    "bond": 0.022719,
    "cpi": 66.0
  },
  {
    "year": 1978,
    "month": 9,
    "equity": 0.004026,
    "bond": 0.006334,
    "cpi": 66.5
  },
  {
    "year": 1978,
    "month": 10,
    "equity": -0.027722,
    "bond": -0.007681,
    "cpi": 67.1
  },
  {
    "year": 1978,
    "month": 11,
    "equity": -0.054363,
    "bond": -0.004075,
    "cpi": 67.4
  },
  {
    "year": 1978,
    "month": 12,
    "equity": 0.019243,
    "bond": -0.00581,
    "cpi": 67.7
  },
  {
    "year": 1979,
    "month": 1,
    "equity": 0.041891,
    "bond": 0.001613,
    "cpi": 68.3
  },
  {
    "year": 1979,
    "month": 2,
    "equity": -0.010533,
    "bond": 0.007583,
    "cpi": 69.1
  },
  {
    "year": 1979,
    "month": 3,
    "equity": 0.023448,
    "bond": 0.006274,
    "cpi": 69.8
  },
  {
    "year": 1979,
    "month": 4,
    "equity": 0.024348,
    "bond": 0.003683,
    "cpi": 70.6
  },
  {
    "year": 1979,
    "month": 5,
    "equity": -0.018892,
    "bond": 0.003094,
    "cpi": 71.5
  },
  {
    "year": 1979,
    "month": 6,
    "equity": 0.024215,
    "bond": 0.030161,
    "cpi": 72.3
  },
  {
    "year": 1979,
    "month": 7,
    "equity": 0.014255,
    "bond": 0.004788,
    "cpi": 73.1
  },
  {
    "year": 1979,
    "month": 8,
    "equity": 0.050189,
    "bond": 0.002202,
    "cpi": 73.8
  },
  {
    "year": 1979,
    "month": 9,
    "equity": 0.015448,
    "bond": -0.011935,
    "cpi": 74.6
  },
  {
    "year": 1979,
    "month": 10,
    "equity": -0.033489,
    "bond": -0.052631,
    "cpi": 75.2
  },
  {
    "year": 1979,
    "month": 11,
    "equity": -0.003187,
    "bond": -0.012898,
    "cpi": 75.9
  },
  {
    "year": 1979,
    "month": 12,
    "equity": 0.044077,
    "bond": 0.025006,
    "cpi": 76.7
  },
  {
    "year": 1980,
    "month": 1,
    "equity": 0.033163,
    "bond": -0.01635,
    "cpi": 77.8
  },
  {
    "year": 1980,
    "month": 2,
    "equity": 0.043996,
    "bond": -0.082989,
    "cpi": 78.9
  },
  {
    "year": 1980,
    "month": 3,
    "equity": -0.087742,
    "bond": -0.008823,
    "cpi": 80.1
  },
  {
    "year": 1980,
    "month": 4,
    "equity": -0.011583,
    "bond": 0.086585,
    "cpi": 81.0
  },
  {
    "year": 1980,
    "month": 5,
    "equity": 0.050399,
    "bond": 0.090295,
    "cpi": 81.8
  },
  {
    "year": 1980,
    "month": 6,
    "equity": 0.068663,
    "bond": 0.033941,
    "cpi": 82.7
  },
  {
    "year": 1980,
    "month": 7,
    "equity": 0.049726,
    "bond": -0.02118,
    "cpi": 82.7
  },
  {
    "year": 1980,
    "month": 8,
    "equity": 0.035077,
    "bond": -0.042669,
    "cpi": 83.3
  },
  {
    "year": 1980,
    "month": 9,
    "equity": 0.028387,
    "bond": -0.015042,
    "cpi": 84.0
  },
  {
    "year": 1980,
    "month": 10,
    "equity": 0.033267,
    "bond": -0.00449,
    "cpi": 84.8
  },
  {
    "year": 1980,
    "month": 11,
    "equity": 0.046166,
    "bond": -0.042776,
    "cpi": 85.5
  },
  {
    "year": 1980,
    "month": 12,
    "equity": -0.012429,
    "bond": 0.00158,
    "cpi": 86.3
  },
  {
    "year": 1981,
    "month": 1,
    "equity": 0.000125,
    "bond": 0.026029,
    "cpi": 87.0
  },
  {
    "year": 1981,
    "month": 2,
    "equity": -0.030677,
    "bond": -0.02387,
    "cpi": 87.9
  },
  {
    "year": 1981,
    "month": 3,
    "equity": 0.041459,
    "bond": 0.01488,
    "cpi": 88.5
  },
  {
    "year": 1981,
    "month": 4,
    "equity": 0.012961,
    "bond": -0.019499,
    "cpi": 89.1
  },
  {
    "year": 1981,
    "month": 5,
    "equity": -0.01615,
    "bond": -0.011055,
    "cpi": 89.8
  },
  {
    "year": 1981,
    "month": 6,
    "equity": 0.008599,
    "bond": 0.046268,
    "cpi": 90.6
  },
  {
    "year": 1981,
    "month": 7,
    "equity": -0.020135,
    "bond": -0.031781,
    "cpi": 91.6
  },
  {
    "year": 1981,
    "month": 8,
    "equity": 0.008054,
    "bond": -0.022268,
    "cpi": 92.3
  },
  {
    "year": 1981,
    "month": 9,
    "equity": -0.082999,
    "bond": -0.006942,
    "cpi": 93.2
  },
  {
    "year": 1981,
    "month": 10,
    "equity": 0.017298,
    "bond": 0.021498,
    "cpi": 93.4
  },
  {
    "year": 1981,
    "month": 11,
    "equity": 0.030463,
    "bond": 0.109358,
    "cpi": 93.7
  },
  {
    "year": 1981,
    "month": 12,
    "equity": 0.011819,
    "bond": -0.006747,
    "cpi": 94.0
  },
  {
    "year": 1982,
    "month": 1,
    "equity": -0.048021,
    "bond": -0.034212,
    "cpi": 94.3
  },
  {
    "year": 1982,
    "month": 2,
    "equity": -0.019118,
    "bond": 0.020605,
    "cpi": 94.6
  },
  {
    "year": 1982,
    "month": 3,
    "equity": -0.027424,
    "bond": 0.042784,
    "cpi": 94.5
  },
  {
    "year": 1982,
    "month": 4,
    "equity": 0.054716,
    "bond": 0.011011,
    "cpi": 94.9
  },
  {
    "year": 1982,
    "month": 5,
    "equity": 0.005718,
    "bond": 0.025176,
    "cpi": 95.8
  },
  {
    "year": 1982,
    "month": 6,
    "equity": -0.052685,
    "bond": -0.024726,
    "cpi": 97.0
  },
  {
    "year": 1982,
    "month": 7,
    "equity": 0.002449,
    "bond": 0.030738,
    "cpi": 97.5
  },
  {
    "year": 1982,
    "month": 8,
    "equity": 0.00795,
    "bond": 0.06118,
    "cpi": 97.7
  },
  {
    "year": 1982,
    "month": 9,
    "equity": 0.120974,
    "bond": 0.052137,
    "cpi": 97.9
  },
  {
    "year": 1982,
    "month": 10,
    "equity": 0.088819,
    "bond": 0.097114,
    "cpi": 98.2
  },
  {
    "year": 1982,
    "month": 11,
    "equity": 0.045003,
    "bond": 0.031279,
    "cpi": 98.0
  },
  {
    "year": 1982,
    "month": 12,
    "equity": 0.013559,
    "bond": 0.009408,
    "cpi": 97.6
  },
  {
    "year": 1983,
    "month": 1,
    "equity": 0.039266,
    "bond": 0.013732,
    "cpi": 97.8
  },
  {
    "year": 1983,
    "month": 2,
    "equity": 0.021308,
    "bond": -0.007195,
    "cpi": 97.9
  },
  {
    "year": 1983,
    "month": 3,
    "equity": 0.038664,
    "bond": 0.021897,
    "cpi": 97.9
  },
  {
    "year": 1983,
    "month": 4,
    "equity": 0.041979,
    "bond": 0.01558,
    "cpi": 98.6
  },
  {
    "year": 1983,
    "month": 5,
    "equity": 0.044245,
    "bond": 0.009908,
    "cpi": 99.2
  },
  {
    "year": 1983,
    "month": 6,
    "equity": 0.01754,
    "bond": -0.019959,
    "cpi": 99.5
  },
  {
    "year": 1983,
    "month": 7,
    "equity": 0.007091,
    "bond": -0.022526,
    "cpi": 99.9
  },
  {
    "year": 1983,
    "month": 8,
    "equity": -0.024062,
    "bond": -0.017982,
    "cpi": 100.2
  },
  {
    "year": 1983,
    "month": 9,
    "equity": 0.033149,
    "bond": 0.021657,
    "cpi": 100.7
  },
  {
    "year": 1983,
    "month": 10,
    "equity": 0.006494,
    "bond": 0.016218,
    "cpi": 101.0
  },
  {
    "year": 1983,
    "month": 11,
    "equity": -0.011399,
    "bond": 0.000794,
    "cpi": 101.2
  },
  {
    "year": 1983,
    "month": 12,
    "equity": -0.001266,
    "bond": 0.001554,
    "cpi": 101.3
  },
  {
    "year": 1984,
    "month": 1,
    "equity": 0.015775,
    "bond": 0.019277,
    "cpi": 101.9
  },
  {
    "year": 1984,
    "month": 2,
    "equity": -0.051107,
    "bond": -0.000213,
    "cpi": 102.4
  },
  {
    "year": 1984,
    "month": 3,
    "equity": 0.004439,
    "bond": -0.017657,
    "cpi": 102.6
  },
  {
    "year": 1984,
    "month": 4,
    "equity": 0.005095,
    "bond": -0.007291,
    "cpi": 103.1
  },
  {
    "year": 1984,
    "month": 5,
    "equity": -0.002503,
    "bond": -0.032312,
    "cpi": 103.4
  },
  {
    "year": 1984,
    "month": 6,
    "equity": -0.01846,
    "bond": 0.002985,
    "cpi": 103.7
  },
  {
    "year": 1984,
    "month": 7,
    "equity": -0.009072,
    "bond": 0.022305,
    "cpi": 104.1
  },
  {
    "year": 1984,
    "month": 8,
    "equity": 0.092078,
    "bond": 0.047251,
    "cpi": 104.5
  },
  {
    "year": 1984,
    "month": 9,
    "equity": 0.014082,
    "bond": 0.021977,
    "cpi": 105.0
  },
  {
    "year": 1984,
    "month": 10,
    "equity": -0.004099,
    "bond": 0.031209,
    "cpi": 105.3
  },
  {
    "year": 1984,
    "month": 11,
    "equity": 0.012884,
    "bond": 0.045004,
    "cpi": 105.3
  },
  {
    "year": 1984,
    "month": 12,
    "equity": -0.007051,
    "bond": 0.013791,
    "cpi": 105.3
  },
  {
    "year": 1985,
    "month": 1,
    "equity": 0.046998,
    "bond": 0.016731,
    "cpi": 105.5
  },
  {
    "year": 1985,
    "month": 2,
    "equity": 0.057895,
    "bond": 0.001781,
    "cpi": 106.0
  },
  {
    "year": 1985,
    "month": 3,
    "equity": -0.004763,
    "bond": -0.010853,
    "cpi": 106.4
  },
  {
    "year": 1985,
    "month": 4,
    "equity": 0.01026,
    "bond": 0.035443,
    "cpi": 106.9
  },
  {
    "year": 1985,
    "month": 5,
    "equity": 0.027369,
    "bond": 0.04483,
    "cpi": 107.3
  },
  {
    "year": 1985,
    "month": 6,
    "equity": 0.025122,
    "bond": 0.052262,
    "cpi": 107.6
  },
  {
    "year": 1985,
    "month": 7,
    "equity": 0.022487,
    "bond": -0.000871,
    "cpi": 107.8
  },
  {
    "year": 1985,
    "month": 8,
    "equity": -0.018439,
    "bond": 0.007348,
    "cpi": 108.0
  },
  {
    "year": 1985,
    "month": 9,
    "equity": -0.018835,
    "bond": 0.006125,
    "cpi": 108.3
  },
  {
    "year": 1985,
    "month": 10,
    "equity": 0.014965,
    "bond": 0.016758,
    "cpi": 108.7
  },
  {
    "year": 1985,
    "month": 11,
    "equity": 0.064214,
    "bond": 0.03781,
    "cpi": 109.0
  },
  {
    "year": 1985,
    "month": 12,
    "equity": 0.052954,
    "bond": 0.041981,
    "cpi": 109.3
  },
  {
    "year": 1986,
    "month": 1,
    "equity": 0.007533,
    "bond": 0.012284,
    "cpi": 109.6
  },
  {
    "year": 1986,
    "month": 2,
    "equity": 0.056988,
    "bond": 0.04031,
    "cpi": 109.3
  },
  {
    "year": 1986,
    "month": 3,
    "equity": 0.061843,
    "bond": 0.071049,
    "cpi": 108.8
  },
  {
    "year": 1986,
    "month": 4,
    "equity": 0.027424,
    "bond": 0.040479,
    "cpi": 108.6
  },
  {
    "year": 1986,
    "month": 5,
    "equity": 0.004928,
    "bond": -0.022436,
    "cpi": 108.9
  },
  {
    "year": 1986,
    "month": 6,
    "equity": 0.031342,
    "bond": 0.000189,
    "cpi": 109.5
  },
  {
    "year": 1986,
    "month": 7,
    "equity": -0.018024,
    "bond": 0.041913,
    "cpi": 109.5
  },
  {
    "year": 1986,
    "month": 8,
    "equity": 0.022824,
    "bond": 0.015344,
    "cpi": 109.7
  },
  {
    "year": 1986,
    "month": 9,
    "equity": -0.024548,
    "bond": -0.013725,
    "cpi": 110.2
  },
  {
    "year": 1986,
    "month": 10,
    "equity": -0.000893,
    "bond": 0.007617,
    "cpi": 110.3
  },
  {
    "year": 1986,
    "month": 11,
    "equity": 0.035335,
    "bond": 0.018968,
    "cpi": 110.4
  },
  {
    "year": 1986,
    "month": 12,
    "equity": 0.017095,
    "bond": 0.016041,
    "cpi": 110.5
  },
  {
    "year": 1987,
    "month": 1,
    "equity": 0.06674,
    "bond": 0.008071,
    "cpi": 111.2
  },
  {
    "year": 1987,
    "month": 2,
    "equity": 0.064625,
    "bond": -0.006167,
    "cpi": 111.6
  },
  {
    "year": 1987,
    "month": 3,
    "equity": 0.04377,
    "bond": 0.006042,
    "cpi": 112.1
  },
  {
    "year": 1987,
    "month": 4,
    "equity": -0.008547,
    "bond": -0.046799,
    "cpi": 112.7
  },
  {
    "year": 1987,
    "month": 5,
    "equity": 0.001746,
    "bond": -0.032784,
    "cpi": 113.1
  },
  {
    "year": 1987,
    "month": 6,
    "equity": 0.045002,
    "bond": 0.021351,
    "cpi": 113.5
  },
  {
    "year": 1987,
    "month": 7,
    "equity": 0.031234,
    "bond": 0.003632,
    "cpi": 113.8
  },
  {
    "year": 1987,
    "month": 8,
    "equity": 0.064553,
    "bond": -0.013562,
    "cpi": 114.4
  },
  {
    "year": 1987,
    "month": 9,
    "equity": -0.030292,
    "bond": -0.035349,
    "cpi": 115.0
  },
  {
    "year": 1987,
    "month": 10,
    "equity": -0.118526,
    "bond": 0.001415,
    "cpi": 115.3
  },
  {
    "year": 1987,
    "month": 11,
    "equity": -0.123019,
    "bond": 0.051612,
    "cpi": 115.4
  },
  {
    "year": 1987,
    "month": 12,
    "equity": -0.01333,
    "bond": -0.001172,
    "cpi": 115.4
  },
  {
    "year": 1988,
    "month": 1,
    "equity": 0.042482,
    "bond": 0.028843,
    "cpi": 115.7
  },
  {
    "year": 1988,
    "month": 2,
    "equity": 0.033301,
    "bond": 0.038533,
    "cpi": 116.0
  },
  {
    "year": 1988,
    "month": 3,
    "equity": 0.032336,
    "bond": -0.003973,
    "cpi": 116.5
  },
  {
    "year": 1988,
    "month": 4,
    "equity": -0.008831,
    "bond": -0.016327,
    "cpi": 117.1
  },
  {
    "year": 1988,
    "month": 5,
    "equity": -0.021853,
    "bond": -0.01698,
    "cpi": 117.5
  },
  {
    "year": 1988,
    "month": 6,
    "equity": 0.060012,
    "bond": 0.018797,
    "cpi": 118.0
  },
  {
    "year": 1988,
    "month": 7,
    "equity": -0.003046,
    "bond": -0.001753,
    "cpi": 118.5
  },
  {
    "year": 1988,
    "month": 8,
    "equity": -0.017161,
    "bond": -0.005462,
    "cpi": 119.0
  },
  {
    "year": 1988,
    "month": 9,
    "equity": 0.019296,
    "bond": 0.026152,
    "cpi": 119.8
  },
  {
    "year": 1988,
    "month": 10,
    "equity": 0.038044,
    "bond": 0.019426,
    "cpi": 120.2
  },
  {
    "year": 1988,
    "month": 11,
    "equity": -0.020175,
    "bond": -0.00321,
    "cpi": 120.3
  },
  {
    "year": 1988,
    "month": 12,
    "equity": 0.023293,
    "bond": -0.002355,
    "cpi": 120.5
  },
  {
    "year": 1989,
    "month": 1,
    "equity": 0.035146,
    "bond": 0.008902,
    "cpi": 121.1
  },
  {
    "year": 1989,
    "month": 2,
    "equity": 0.033023,
    "bond": 0.00235,
    "cpi": 121.6
  },
  {
    "year": 1989,
    "month": 3,
    "equity": -0.001584,
    "bond": -0.004667,
    "cpi": 122.3
  },
  {
    "year": 1989,
    "month": 4,
    "equity": 0.03567,
    "bond": 0.019551,
    "cpi": 123.1
  },
  {
    "year": 1989,
    "month": 5,
    "equity": 0.041182,
    "bond": 0.028828,
    "cpi": 123.8
  },
  {
    "year": 1989,
    "month": 6,
    "equity": 0.033973,
    "bond": 0.046739,
    "cpi": 124.1
  },
  {
    "year": 1989,
    "month": 7,
    "equity": 0.028015,
    "bond": 0.024742,
    "cpi": 124.4
  },
  {
    "year": 1989,
    "month": 8,
    "equity": 0.046939,
    "bond": 0.000531,
    "cpi": 124.6
  },
  {
    "year": 1989,
    "month": 9,
    "equity": 0.004599,
    "bond": 0.001309,
    "cpi": 125.0
  },
  {
    "year": 1989,
    "month": 10,
    "equity": 0.002879,
    "bond": 0.019183,
    "cpi": 125.6
  },
  {
    "year": 1989,
    "month": 11,
    "equity": -0.018105,
    "bond": 0.016346,
    "cpi": 125.9
  },
  {
    "year": 1989,
    "month": 12,
    "equity": 0.027401,
    "bond": 0.008633,
    "cpi": 126.1
  },
  {
    "year": 1990,
    "month": 1,
    "equity": -0.022093,
    "bond": -0.018649,
    "cpi": 127.4
  },
  {
    "year": 1990,
    "month": 2,
    "equity": -0.02525,
    "bond": -0.010656,
    "cpi": 128.0
  },
  {
    "year": 1990,
    "month": 3,
    "equity": 0.027094,
    "bond": -0.000976,
    "cpi": 128.7
  },
  {
    "year": 1990,
    "month": 4,
    "equity": 0.001989,
    "bond": -0.006117,
    "cpi": 128.9
  },
  {
    "year": 1990,
    "month": 5,
    "equity": 0.038538,
    "bond": 0.009319,
    "cpi": 129.2
  },
  {
    "year": 1990,
    "month": 6,
    "equity": 0.031725,
    "bond": 0.026136,
    "cpi": 129.9
  },
  {
    "year": 1990,
    "month": 7,
    "equity": 0.001713,
    "bond": 0.00774,
    "cpi": 130.4
  },
  {
    "year": 1990,
    "month": 8,
    "equity": -0.078599,
    "bond": -0.01156,
    "cpi": 131.6
  },
  {
    "year": 1990,
    "month": 9,
    "equity": -0.043399,
    "bond": -0.001962,
    "cpi": 132.7
  },
  {
    "year": 1990,
    "month": 10,
    "equity": -0.023132,
    "bond": 0.018727,
    "cpi": 133.5
  },
  {
    "year": 1990,
    "month": 11,
    "equity": 0.029862,
    "bond": 0.029552,
    "cpi": 133.8
  },
  {
    "year": 1990,
    "month": 12,
    "equity": 0.045886,
    "bond": 0.02821,
    "cpi": 133.8
  },
  {
    "year": 1991,
    "month": 1,
    "equity": -0.006847,
    "bond": 0.006049,
    "cpi": 134.6
  },
  {
    "year": 1991,
    "month": 2,
    "equity": 0.116069,
    "bond": 0.023334,
    "cpi": 134.8
  },
  {
    "year": 1991,
    "month": 3,
    "equity": 0.030445,
    "bond": -0.011231,
    "cpi": 135.0
  },
  {
    "year": 1991,
    "month": 4,
    "equity": 0.022593,
    "bond": 0.011558,
    "cpi": 135.2
  },
  {
    "year": 1991,
    "month": 5,
    "equity": -0.001787,
    "bond": 0.004646,
    "cpi": 135.6
  },
  {
    "year": 1991,
    "month": 6,
    "equity": 0.003472,
    "bond": -0.007524,
    "cpi": 136.0
  },
  {
    "year": 1991,
    "month": 7,
    "equity": 0.007814,
    "bond": 0.007579,
    "cpi": 136.2
  },
  {
    "year": 1991,
    "month": 8,
    "equity": 0.026799,
    "bond": 0.032416,
    "cpi": 136.6
  },
  {
    "year": 1991,
    "month": 9,
    "equity": -0.003022,
    "bond": 0.024019,
    "cpi": 137.2
  },
  {
    "year": 1991,
    "month": 10,
    "equity": 0.001811,
    "bond": 0.014788,
    "cpi": 137.4
  },
  {
    "year": 1991,
    "month": 11,
    "equity": 0.000152,
    "bond": 0.014025,
    "cpi": 137.8
  },
  {
    "year": 1991,
    "month": 12,
    "equity": 0.009346,
    "bond": 0.029774,
    "cpi": 137.9
  },
  {
    "year": 1992,
    "month": 1,
    "equity": 0.073589,
    "bond": 0.010209,
    "cpi": 138.1
  },
  {
    "year": 1992,
    "month": 2,
    "equity": -0.006,
    "bond": -0.016059,
    "cpi": 138.6
  },
  {
    "year": 1992,
    "month": 3,
    "equity": -0.010116,
    "bond": -0.007899,
    "cpi": 139.3
  },
  {
    "year": 1992,
    "month": 4,
    "equity": 0.002643,
    "bond": 0.010499,
    "cpi": 139.5
  },
  {
    "year": 1992,
    "month": 5,
    "equity": 0.020684,
    "bond": 0.012582,
    "cpi": 139.7
  },
  {
    "year": 1992,
    "month": 6,
    "equity": -0.013291,
    "bond": 0.015382,
    "cpi": 140.2
  },
  {
    "year": 1992,
    "month": 7,
    "equity": 0.019126,
    "bond": 0.036409,
    "cpi": 140.5
  },
  {
    "year": 1992,
    "month": 8,
    "equity": 0.009422,
    "bond": 0.023974,
    "cpi": 140.9
  },
  {
    "year": 1992,
    "month": 9,
    "equity": 0.003789,
    "bond": 0.018013,
    "cpi": 141.3
  },
  {
    "year": 1992,
    "month": 10,
    "equity": -0.011823,
    "bond": -0.007076,
    "cpi": 141.8
  },
  {
    "year": 1992,
    "month": 11,
    "equity": 0.027568,
    "bond": -0.014721,
    "cpi": 142.0
  },
  {
    "year": 1992,
    "month": 12,
    "equity": 0.032713,
    "bond": 0.012976,
    "cpi": 141.9
  },
  {
    "year": 1993,
    "month": 1,
    "equity": 0.001433,
    "bond": 0.018062,
    "cpi": 142.6
  },
  {
    "year": 1993,
    "month": 2,
    "equity": 0.017249,
    "bond": 0.030723,
    "cpi": 143.1
  },
  {
    "year": 1993,
    "month": 3,
    "equity": 0.021508,
    "bond": 0.026253,
    "cpi": 143.6
  },
  {
    "year": 1993,
    "month": 4,
    "equity": -0.013415,
    "bond": 0.005735,
    "cpi": 144.0
  },
  {
    "year": 1993,
    "month": 5,
    "equity": 0.00725,
    "bond": -0.00027,
    "cpi": 144.2
  },
  {
    "year": 1993,
    "month": 6,
    "equity": 0.008654,
    "bond": 0.011049,
    "cpi": 144.4
  },
  {
    "year": 1993,
    "month": 7,
    "equity": 0.00061,
    "bond": 0.016323,
    "cpi": 144.4
  },
  {
    "year": 1993,
    "month": 8,
    "equity": 0.017625,
    "bond": 0.014742,
    "cpi": 144.8
  },
  {
    "year": 1993,
    "month": 9,
    "equity": 0.01355,
    "bond": 0.029463,
    "cpi": 145.1
  },
  {
    "year": 1993,
    "month": 10,
    "equity": 0.012423,
    "bond": 0.006788,
    "cpi": 145.7
  },
  {
    "year": 1993,
    "month": 11,
    "equity": 7.9e-05,
    "bond": -0.025206,
    "cpi": 145.8
  },
  {
    "year": 1993,
    "month": 12,
    "equity": 0.008875,
    "bond": 0.000974,
    "cpi": 145.8
  },
  {
    "year": 1994,
    "month": 1,
    "equity": 0.017367,
    "bond": 0.006327,
    "cpi": 146.2
  },
  {
    "year": 1994,
    "month": 2,
    "equity": -0.000749,
    "bond": -0.011744,
    "cpi": 146.7
  },
  {
    "year": 1994,
    "month": 3,
    "equity": -0.014231,
    "bond": -0.032488,
    "cpi": 147.2
  },
  {
    "year": 1994,
    "month": 4,
    "equity": -0.033456,
    "bond": -0.029815,
    "cpi": 147.4
  },
  {
    "year": 1994,
    "month": 5,
    "equity": 0.010591,
    "bond": -0.009144,
    "cpi": 147.5
  },
  {
    "year": 1994,
    "month": 6,
    "equity": 0.011089,
    "bond": 0.0117,
    "cpi": 148.0
  },
  {
    "year": 1994,
    "month": 7,
    "equity": -0.005183,
    "bond": -0.008248,
    "cpi": 148.4
  },
  {
    "year": 1994,
    "month": 8,
    "equity": 0.030826,
    "bond": 0.010344,
    "cpi": 149.0
  },
  {
    "year": 1994,
    "month": 9,
    "equity": 0.008178,
    "bond": -0.009439,
    "cpi": 149.4
  },
  {
    "year": 1994,
    "month": 10,
    "equity": -0.004423,
    "bond": -0.013235,
    "cpi": 149.5
  },
  {
    "year": 1994,
    "month": 11,
    "equity": -0.003684,
    "bond": -0.008687,
    "cpi": 149.7
  },
  {
    "year": 1994,
    "month": 12,
    "equity": -0.010244,
    "bond": 0.017022,
    "cpi": 149.7
  },
  {
    "year": 1995,
    "month": 1,
    "equity": 0.024514,
    "bond": 0.008589,
    "cpi": 150.3
  },
  {
    "year": 1995,
    "month": 2,
    "equity": 0.038191,
    "bond": 0.028275,
    "cpi": 150.9
  },
  {
    "year": 1995,
    "month": 3,
    "equity": 0.02558,
    "bond": 0.025432,
    "cpi": 151.4
  },
  {
    "year": 1995,
    "month": 4,
    "equity": 0.032168,
    "bond": 0.016021,
    "cpi": 151.9
  },
  {
    "year": 1995,
    "month": 5,
    "equity": 0.033488,
    "bond": 0.037258,
    "cpi": 152.2
  },
  {
    "year": 1995,
    "month": 6,
    "equity": 0.031793,
    "bond": 0.039789,
    "cpi": 152.5
  },
  {
    "year": 1995,
    "month": 7,
    "equity": 0.035487,
    "bond": -0.003011,
    "cpi": 152.5
  },
  {
    "year": 1995,
    "month": 8,
    "equity": 0.005142,
    "bond": -0.010186,
    "cpi": 152.9
  },
  {
    "year": 1995,
    "month": 9,
    "equity": 0.037187,
    "bond": 0.02698,
    "cpi": 153.2
  },
  {
    "year": 1995,
    "month": 10,
    "equity": 0.009136,
    "bond": 0.017155,
    "cpi": 153.7
  },
  {
    "year": 1995,
    "month": 11,
    "equity": 0.023594,
    "bond": 0.013316,
    "cpi": 153.6
  },
  {
    "year": 1995,
    "month": 12,
    "equity": 0.033901,
    "bond": 0.021674,
    "cpi": 153.5
  },
  {
    "year": 1996,
    "month": 1,
    "equity": 0.00164,
    "bond": 0.009334,
    "cpi": 154.4
  },
  {
    "year": 1996,
    "month": 2,
    "equity": 0.059058,
    "bond": -0.007405,
    "cpi": 154.9
  },
  {
    "year": 1996,
    "month": 3,
    "equity": -0.001994,
    "bond": -0.029268,
    "cpi": 155.7
  },
  {
    "year": 1996,
    "month": 4,
    "equity": 0.001978,
    "bond": -0.012381,
    "cpi": 156.3
  },
  {
    "year": 1996,
    "month": 5,
    "equity": 0.023556,
    "bond": -0.011275,
    "cpi": 156.6
  },
  {
    "year": 1996,
    "month": 6,
    "equity": 0.012793,
    "bond": -0.006633,
    "cpi": 156.7
  },
  {
    "year": 1996,
    "month": 7,
    "equity": -0.034749,
    "bond": 0.008646,
    "cpi": 157.0
  },
  {
    "year": 1996,
    "month": 8,
    "equity": 0.030774,
    "bond": 0.022499,
    "cpi": 157.3
  },
  {
    "year": 1996,
    "month": 9,
    "equity": 0.020254,
    "bond": -0.008207,
    "cpi": 157.8
  },
  {
    "year": 1996,
    "month": 10,
    "equity": 0.041205,
    "bond": 0.027679,
    "cpi": 158.3
  },
  {
    "year": 1996,
    "month": 11,
    "equity": 0.05053,
    "bond": 0.029989,
    "cpi": 158.6
  },
  {
    "year": 1996,
    "month": 12,
    "equity": 0.011991,
    "bond": -0.002239,
    "cpi": 158.6
  },
  {
    "year": 1997,
    "month": 1,
    "equity": 0.032581,
    "bond": -0.015226,
    "cpi": 159.1
  },
  {
    "year": 1997,
    "month": 2,
    "equity": 0.043617,
    "bond": 0.017268,
    "cpi": 159.6
  },
  {
    "year": 1997,
    "month": 3,
    "equity": -0.006231,
    "bond": -0.014298,
    "cpi": 160.0
  },
  {
    "year": 1997,
    "month": 4,
    "equity": -0.034049,
    "bond": -0.00885,
    "cpi": 160.2
  },
  {
    "year": 1997,
    "month": 5,
    "equity": 0.092182,
    "bond": 0.018828,
    "cpi": 160.1
  },
  {
    "year": 1997,
    "month": 6,
    "equity": 0.053372,
    "bond": 0.021745,
    "cpi": 160.3
  },
  {
    "year": 1997,
    "month": 7,
    "equity": 0.057365,
    "bond": 0.025475,
    "cpi": 160.5
  },
  {
    "year": 1997,
    "month": 8,
    "equity": 0.003483,
    "bond": -0.000741,
    "cpi": 160.8
  },
  {
    "year": 1997,
    "month": 9,
    "equity": 0.011925,
    "bond": 0.011942,
    "cpi": 161.2
  },
  {
    "year": 1997,
    "month": 10,
    "equity": 0.016459,
    "bond": 0.018668,
    "cpi": 161.6
  },
  {
    "year": 1997,
    "month": 11,
    "equity": -0.011515,
    "bond": 0.016346,
    "cpi": 161.5
  },
  {
    "year": 1997,
    "month": 12,
    "equity": 0.026351,
    "bond": 0.0102,
    "cpi": 161.3
  },
  {
    "year": 1998,
    "month": 1,
    "equity": 0.002375,
    "bond": 0.025536,
    "cpi": 161.6
  },
  {
    "year": 1998,
    "month": 2,
    "equity": 0.064026,
    "bond": 0.00232,
    "cpi": 161.9
  },
  {
    "year": 1998,
    "month": 3,
    "equity": 0.053132,
    "bond": -0.001459,
    "cpi": 162.2
  },
  {
    "year": 1998,
    "month": 4,
    "equity": 0.034065,
    "bond": 0.005471,
    "cpi": 162.5
  },
  {
    "year": 1998,
    "month": 5,
    "equity": -0.002211,
    "bond": 0.003937,
    "cpi": 162.8
  },
  {
    "year": 1998,
    "month": 6,
    "equity": 0.001172,
    "bond": 0.016226,
    "cpi": 163.0
  },
  {
    "year": 1998,
    "month": 7,
    "equity": 0.044682,
    "bond": 0.00766,
    "cpi": 163.2
  },
  {
    "year": 1998,
    "month": 8,
    "equity": -0.069705,
    "bond": 0.013832,
    "cpi": 163.4
  },
  {
    "year": 1998,
    "month": 9,
    "equity": -0.04898,
    "bond": 0.046458,
    "cpi": 163.6
  },
  {
    "year": 1998,
    "month": 10,
    "equity": 0.012911,
    "bond": 0.026491,
    "cpi": 164.0
  },
  {
    "year": 1998,
    "month": 11,
    "equity": 0.109745,
    "bond": -0.019981,
    "cpi": 164.0
  },
  {
    "year": 1998,
    "month": 12,
    "equity": 0.041042,
    "bond": 0.018398,
    "cpi": 163.9
  },
  {
    "year": 1999,
    "month": 1,
    "equity": 0.050483,
    "bond": -0.001696,
    "cpi": 164.3
  },
  {
    "year": 1999,
    "month": 2,
    "equity": -0.000662,
    "bond": -0.018066,
    "cpi": 164.5
  },
  {
    "year": 1999,
    "month": 3,
    "equity": 0.029241,
    "bond": -0.013714,
    "cpi": 165.0
  },
  {
    "year": 1999,
    "month": 4,
    "equity": 0.0425,
    "bond": 0.008254,
    "cpi": 166.2
  },
  {
    "year": 1999,
    "month": 5,
    "equity": -0.000988,
    "bond": -0.023276,
    "cpi": 166.2
  },
  {
    "year": 1999,
    "month": 6,
    "equity": -0.006118,
    "bond": -0.022528,
    "cpi": 166.2
  },
  {
    "year": 1999,
    "month": 7,
    "equity": 0.045228,
    "bond": 0.013252,
    "cpi": 166.7
  },
  {
    "year": 1999,
    "month": 8,
    "equity": -0.03774,
    "bond": -0.006465,
    "cpi": 167.1
  },
  {
    "year": 1999,
    "month": 9,
    "equity": -0.005976,
    "bond": 0.006457,
    "cpi": 167.9
  },
  {
    "year": 1999,
    "month": 10,
    "equity": -0.012724,
    "bond": -0.009258,
    "cpi": 168.2
  },
  {
    "year": 1999,
    "month": 11,
    "equity": 0.071061,
    "bond": 0.011088,
    "cpi": 168.3
  },
  {
    "year": 1999,
    "month": 12,
    "equity": 0.028088,
    "bond": -0.013505,
    "cpi": 168.3
  },
  {
    "year": 2000,
    "month": 1,
    "equity": -0.001188,
    "bond": -0.022456,
    "cpi": 168.8
  },
  {
    "year": 2000,
    "month": 2,
    "equity": -0.024779,
    "bond": 0.015815,
    "cpi": 169.8
  },
  {
    "year": 2000,
    "month": 3,
    "equity": 0.039411,
    "bond": 0.024722,
    "cpi": 171.2
  },
  {
    "year": 2000,
    "month": 4,
    "equity": 0.014245,
    "bond": 0.025492,
    "cpi": 171.3
  },
  {
    "year": 2000,
    "month": 5,
    "equity": -0.028389,
    "bond": -0.028123,
    "cpi": 171.5
  },
  {
    "year": 2000,
    "month": 6,
    "equity": 0.031634,
    "bond": 0.030772,
    "cpi": 172.4
  },
  {
    "year": 2000,
    "month": 7,
    "equity": 0.008497,
    "bond": 0.008828,
    "cpi": 172.8
  },
  {
    "year": 2000,
    "month": 8,
    "equity": 0.009391,
    "bond": 0.021683,
    "cpi": 172.8
  },
  {
    "year": 2000,
    "month": 9,
    "equity": -0.010803,
    "bond": 0.007131,
    "cpi": 173.7
  },
  {
    "year": 2000,
    "month": 10,
    "equity": -0.052144,
    "bond": 0.00939,
    "cpi": 174.0
  },
  {
    "year": 2000,
    "month": 11,
    "equity": -0.007727,
    "bond": 0.006304,
    "cpi": 174.1
  },
  {
    "year": 2000,
    "month": 12,
    "equity": -0.033202,
    "bond": 0.042065,
    "cpi": 174.0
  },
  {
    "year": 2001,
    "month": 1,
    "equity": 0.004544,
    "bond": 0.010606,
    "cpi": 175.1
  },
  {
    "year": 2001,
    "month": 2,
    "equity": -0.021369,
    "bond": 0.008992,
    "cpi": 175.8
  },
  {
    "year": 2001,
    "month": 3,
    "equity": -0.090805,
    "bond": 0.020833,
    "cpi": 176.2
  },
  {
    "year": 2001,
    "month": 4,
    "equity": 0.00448,
    "bond": -0.015441,
    "cpi": 176.9
  },
  {
    "year": 2001,
    "month": 5,
    "equity": 0.068787,
    "bond": -0.01501,
    "cpi": 177.7
  },
  {
    "year": 2001,
    "month": 6,
    "equity": -0.023893,
    "bond": 0.013024,
    "cpi": 178.0
  },
  {
    "year": 2001,
    "month": 7,
    "equity": -0.026601,
    "bond": 0.007508,
    "cpi": 177.5
  },
  {
    "year": 2001,
    "month": 8,
    "equity": -0.020457,
    "bond": 0.025609,
    "cpi": 177.5
  },
  {
    "year": 2001,
    "month": 9,
    "equity": -0.112472,
    "bond": 0.023235,
    "cpi": 178.3
  },
  {
    "year": 2001,
    "month": 10,
    "equity": 0.03184,
    "bond": 0.016765,
    "cpi": 177.7
  },
  {
    "year": 2001,
    "month": 11,
    "equity": 0.050531,
    "bond": -0.00258,
    "cpi": 177.4
  },
  {
    "year": 2001,
    "month": 12,
    "equity": 0.01466,
    "bond": -0.030552,
    "cpi": 176.7
  },
  {
    "year": 2002,
    "month": 1,
    "equity": -0.002977,
    "bond": 0.008163,
    "cpi": 177.1
  },
  {
    "year": 2002,
    "month": 2,
    "equity": -0.033528,
    "bond": 0.014456,
    "cpi": 177.8
  },
  {
    "year": 2002,
    "month": 3,
    "equity": 0.049452,
    "bond": -0.024607,
    "cpi": 178.8
  },
  {
    "year": 2002,
    "month": 4,
    "equity": -0.035137,
    "bond": 0.009847,
    "cpi": 179.8
  },
  {
    "year": 2002,
    "month": 5,
    "equity": -0.028196,
    "bond": 0.008241,
    "cpi": 179.8
  },
  {
    "year": 2002,
    "month": 6,
    "equity": -0.059202,
    "bond": 0.022429,
    "cpi": 179.9
  },
  {
    "year": 2002,
    "month": 7,
    "equity": -0.107592,
    "bond": 0.026466,
    "cpi": 180.1
  },
  {
    "year": 2002,
    "month": 8,
    "equity": 0.011381,
    "bond": 0.035587,
    "cpi": 180.7
  },
  {
    "year": 2002,
    "month": 9,
    "equity": -0.047585,
    "bond": 0.035847,
    "cpi": 181.0
  },
  {
    "year": 2002,
    "month": 10,
    "equity": -0.013662,
    "bond": -0.002553,
    "cpi": 181.3
  },
  {
    "year": 2002,
    "month": 11,
    "equity": 0.066265,
    "bond": -0.005749,
    "cpi": 181.3
  },
  {
    "year": 2002,
    "month": 12,
    "equity": -0.010342,
    "bond": 0.005019,
    "cpi": 180.9
  },
  {
    "year": 2003,
    "month": 1,
    "equity": -0.002221,
    "bond": 0.001716,
    "cpi": 181.7
  },
  {
    "year": 2003,
    "month": 2,
    "equity": -0.064144,
    "bond": 0.015779,
    "cpi": 183.1
  },
  {
    "year": 2003,
    "month": 3,
    "equity": 0.013084,
    "bond": 0.010724,
    "cpi": 184.2
  },
  {
    "year": 2003,
    "month": 4,
    "equity": 0.052857,
    "bond": -0.009194,
    "cpi": 183.8
  },
  {
    "year": 2003,
    "month": 5,
    "equity": 0.053121,
    "bond": 0.036057,
    "cpi": 183.5
  },
  {
    "year": 2003,
    "month": 6,
    "equity": 0.05704,
    "bond": 0.023364,
    "cpi": 183.7
  },
  {
    "year": 2003,
    "month": 7,
    "equity": 0.005971,
    "bond": -0.050776,
    "cpi": 183.9
  },
  {
    "year": 2003,
    "month": 8,
    "equity": -0.001651,
    "bond": -0.034563,
    "cpi": 184.6
  },
  {
    "year": 2003,
    "month": 9,
    "equity": 0.031624,
    "bond": 0.018338,
    "cpi": 185.2
  },
  {
    "year": 2003,
    "month": 10,
    "equity": 0.0203,
    "bond": 0.001934,
    "cpi": 185.0
  },
  {
    "year": 2003,
    "month": 11,
    "equity": 0.012127,
    "bond": 0.002763,
    "cpi": 184.5
  },
  {
    "year": 2003,
    "month": 12,
    "equity": 0.030659,
    "bond": 0.006022,
    "cpi": 184.3
  },
  {
    "year": 2004,
    "month": 1,
    "equity": 0.049366,
    "bond": 0.013366,
    "cpi": 185.2
  },
  {
    "year": 2004,
    "month": 2,
    "equity": 0.010882,
    "bond": 0.009198,
    "cpi": 186.2
  },
  {
    "year": 2004,
    "month": 3,
    "equity": -0.015637,
    "bond": 0.024142,
    "cpi": 187.4
  },
  {
    "year": 2004,
    "month": 4,
    "equity": 0.009696,
    "bond": -0.038914,
    "cpi": 188.0
  },
  {
    "year": 2004,
    "month": 5,
    "equity": -0.025628,
    "bond": -0.025824,
    "cpi": 189.1
  },
  {
    "year": 2004,
    "month": 6,
    "equity": 0.028591,
    "bond": 0.003138,
    "cpi": 189.7
  },
  {
    "year": 2004,
    "month": 7,
    "equity": -0.022374,
    "bond": 0.022435,
    "cpi": 189.4
  },
  {
    "year": 2004,
    "month": 8,
    "equity": -0.013862,
    "bond": 0.021622,
    "cpi": 189.5
  },
  {
    "year": 2004,
    "month": 9,
    "equity": 0.027841,
    "bond": 0.015838,
    "cpi": 189.9
  },
  {
    "year": 2004,
    "month": 10,
    "equity": 0.001033,
    "bond": 0.005899,
    "cpi": 190.9
  },
  {
    "year": 2004,
    "month": 11,
    "equity": 0.047746,
    "bond": -0.003925,
    "cpi": 191.0
  },
  {
    "year": 2004,
    "month": 12,
    "equity": 0.027281,
    "bond": 0.000235,
    "cpi": 190.3
  },
  {
    "year": 2005,
    "month": 1,
    "equity": -0.013474,
    "bond": 0.00434,
    "cpi": 190.7
  },
  {
    "year": 2005,
    "month": 2,
    "equity": 0.016831,
    "bond": 0.007599,
    "cpi": 191.8
  },
  {
    "year": 2005,
    "month": 3,
    "equity": -0.002538,
    "bond": -0.02306,
    "cpi": 193.3
  },
  {
    "year": 2005,
    "month": 4,
    "equity": -0.024073,
    "bond": 0.016711,
    "cpi": 194.6
  },
  {
    "year": 2005,
    "month": 5,
    "equity": 0.013375,
    "bond": 0.019971,
    "cpi": 194.4
  },
  {
    "year": 2005,
    "month": 6,
    "equity": 0.021823,
    "bond": 0.014973,
    "cpi": 194.5
  },
  {
    "year": 2005,
    "month": 7,
    "equity": 0.01809,
    "bond": -0.011358,
    "cpi": 195.4
  },
  {
    "year": 2005,
    "month": 8,
    "equity": 0.003112,
    "bond": -0.003022,
    "cpi": 196.4
  },
  {
    "year": 2005,
    "month": 9,
    "equity": 0.002809,
    "bond": 0.008442,
    "cpi": 198.8
  },
  {
    "year": 2005,
    "month": 10,
    "equity": -0.026225,
    "bond": -0.017445,
    "cpi": 199.2
  },
  {
    "year": 2005,
    "month": 11,
    "equity": 0.039633,
    "bond": -0.002704,
    "cpi": 197.6
  },
  {
    "year": 2005,
    "month": 12,
    "equity": 0.021458,
    "bond": 0.00942,
    "cpi": 196.8
  },
  {
    "year": 2006,
    "month": 1,
    "equity": 0.01468,
    "bond": 0.00776,
    "cpi": 198.3
  },
  {
    "year": 2006,
    "month": 2,
    "equity": -0.000154,
    "bond": -0.008339,
    "cpi": 198.7
  },
  {
    "year": 2006,
    "month": 3,
    "equity": 0.014874,
    "bond": -0.00813,
    "cpi": 199.8
  },
  {
    "year": 2006,
    "month": 4,
    "equity": 0.007997,
    "bond": -0.01729,
    "cpi": 201.5
  },
  {
    "year": 2006,
    "month": 5,
    "equity": -0.007852,
    "bond": -0.005222,
    "cpi": 202.5
  },
  {
    "year": 2006,
    "month": 6,
    "equity": -0.027044,
    "bond": 0.004258,
    "cpi": 202.9
  },
  {
    "year": 2006,
    "month": 7,
    "equity": 0.007215,
    "bond": 0.005823,
    "cpi": 203.5
  },
  {
    "year": 2006,
    "month": 8,
    "equity": 0.022932,
    "bond": 0.020833,
    "cpi": 203.9
  },
  {
    "year": 2006,
    "month": 9,
    "equity": 0.025326,
    "bond": 0.016801,
    "cpi": 202.9
  },
  {
    "year": 2006,
    "month": 10,
    "equity": 0.036176,
    "bond": 0.003138,
    "cpi": 201.8
  },
  {
    "year": 2006,
    "month": 11,
    "equity": 0.020032,
    "bond": 0.014346,
    "cpi": 201.5
  },
  {
    "year": 2006,
    "month": 12,
    "equity": 0.021498,
    "bond": 0.007041,
    "cpi": 201.8
  },
  {
    "year": 2007,
    "month": 1,
    "equity": 0.00694,
    "bond": -0.012089,
    "cpi": 202.42
  },
  {
    "year": 2007,
    "month": 2,
    "equity": 0.015972,
    "bond": 0.00715,
    "cpi": 203.5
  },
  {
    "year": 2007,
    "month": 3,
    "equity": -0.024727,
    "bond": 0.016763,
    "cpi": 205.35
  },
  {
    "year": 2007,
    "month": 4,
    "equity": 0.041816,
    "bond": -0.006561,
    "cpi": 206.69
  },
  {
    "year": 2007,
    "month": 5,
    "equity": 0.03393,
    "bond": -0.00086,
    "cpi": 207.95
  },
  {
    "year": 2007,
    "month": 6,
    "equity": 0.003462,
    "bond": -0.023414,
    "cpi": 208.35
  },
  {
    "year": 2007,
    "month": 7,
    "equity": 0.005761,
    "bond": 0.012107,
    "cpi": 208.3
  },
  {
    "year": 2007,
    "month": 8,
    "equity": -0.041996,
    "bond": 0.030493,
    "cpi": 207.92
  },
  {
    "year": 2007,
    "month": 9,
    "equity": 0.030763,
    "bond": 0.015942,
    "cpi": 208.49
  },
  {
    "year": 2007,
    "month": 10,
    "equity": 0.02993,
    "bond": 0.002964,
    "cpi": 208.94
  },
  {
    "year": 2007,
    "month": 11,
    "equity": -0.04805,
    "bond": 0.034833,
    "cpi": 210.18
  },
  {
    "year": 2007,
    "month": 12,
    "equity": 0.012396,
    "bond": 0.007555,
    "cpi": 210.04
  },
  {
    "year": 2008,
    "month": 1,
    "equity": -0.066341,
    "bond": 0.033412,
    "cpi": 211.08
  },
  {
    "year": 2008,
    "month": 2,
    "equity": -0.015628,
    "bond": 0.003117,
    "cpi": 211.69
  },
  {
    "year": 2008,
    "month": 3,
    "equity": -0.026255,
    "bond": 0.02249,
    "cpi": 213.53
  },
  {
    "year": 2008,
    "month": 4,
    "equity": 0.042447,
    "bond": -0.01128,
    "cpi": 214.82
  },
  {
    "year": 2008,
    "month": 5,
    "equity": 0.025634,
    "bond": -0.013488,
    "cpi": 216.63
  },
  {
    "year": 2008,
    "month": 6,
    "equity": -0.042458,
    "bond": -0.01479,
    "cpi": 218.81
  },
  {
    "year": 2008,
    "month": 7,
    "equity": -0.060782,
    "bond": 0.010821,
    "cpi": 219.96
  },
  {
    "year": 2008,
    "month": 8,
    "equity": 0.021108,
    "bond": 0.01327,
    "cpi": 219.09
  },
  {
    "year": 2008,
    "month": 9,
    "equity": -0.048472,
    "bond": 0.019945,
    "cpi": 218.78
  },
  {
    "year": 2008,
    "month": 10,
    "equity": -0.201946,
    "bond": -0.006891,
    "cpi": 216.57
  },
  {
    "year": 2008,
    "month": 11,
    "equity": -0.086067,
    "bond": 0.026738,
    "cpi": 212.43
  },
  {
    "year": 2008,
    "month": 12,
    "equity": -0.003527,
    "bond": 0.101444,
    "cpi": 210.23
  },
  {
    "year": 2009,
    "month": 1,
    "equity": -0.010991,
    "bond": -0.006815,
    "cpi": 211.14
  },
  {
    "year": 2009,
    "month": 2,
    "equity": -0.067061,
    "bond": -0.028294,
    "cpi": 212.19
  },
  {
    "year": 2009,
    "month": 3,
    "equity": -0.056913,
    "bond": 0.006744,
    "cpi": 212.71
  },
  {
    "year": 2009,
    "month": 4,
    "equity": 0.123156,
    "bond": -0.007175,
    "cpi": 213.24
  },
  {
    "year": 2009,
    "month": 5,
    "equity": 0.066544,
    "bond": -0.0282,
    "cpi": 213.86
  },
  {
    "year": 2009,
    "month": 6,
    "equity": 0.028637,
    "bond": -0.03312,
    "cpi": 215.69
  },
  {
    "year": 2009,
    "month": 7,
    "equity": 0.012726,
    "bond": 0.016545,
    "cpi": 215.35
  },
  {
    "year": 2009,
    "month": 8,
    "equity": 0.081157,
    "bond": 0.000449,
    "cpi": 215.83
  },
  {
    "year": 2009,
    "month": 9,
    "equity": 0.036457,
    "bond": 0.019079,
    "cpi": 215.97
  },
  {
    "year": 2009,
    "month": 10,
    "equity": 0.023991,
    "bond": 0.00368,
    "cpi": 216.18
  },
  {
    "year": 2009,
    "month": 11,
    "equity": 0.020904,
    "bond": 0.001978,
    "cpi": 216.33
  },
  {
    "year": 2009,
    "month": 12,
    "equity": 0.022221,
    "bond": -0.01311,
    "cpi": 215.95
  },
  {
    "year": 2010,
    "month": 1,
    "equity": 0.013557,
    "bond": -0.008679,
    "cpi": 216.69
  },
  {
    "year": 2010,
    "month": 2,
    "equity": -0.028997,
    "bond": 0.006449,
    "cpi": 216.74
  },
  {
    "year": 2010,
    "month": 3,
    "equity": 0.059417,
    "bond": -0.000259,
    "cpi": 217.63
  },
  {
    "year": 2010,
    "month": 4,
    "equity": 0.040883,
    "bond": -0.006839,
    "cpi": 218.01
  },
  {
    "year": 2010,
    "month": 5,
    "equity": -0.058821,
    "bond": 0.039583,
    "cpi": 218.18
  },
  {
    "year": 2010,
    "month": 6,
    "equity": -0.035432,
    "bond": 0.021656,
    "cpi": 217.97
  },
  {
    "year": 2010,
    "month": 7,
    "equity": -0.001583,
    "bond": 0.019056,
    "cpi": 218.01
  },
  {
    "year": 2010,
    "month": 8,
    "equity": 0.008644,
    "bond": 0.029649,
    "cpi": 218.31
  },
  {
    "year": 2010,
    "month": 9,
    "equity": 0.033719,
    "bond": 0.006638,
    "cpi": 218.44
  },
  {
    "year": 2010,
    "month": 10,
    "equity": 0.045784,
    "bond": 0.011913,
    "cpi": 218.71
  },
  {
    "year": 2010,
    "month": 11,
    "equity": 0.024918,
    "bond": -0.017089,
    "cpi": 218.8
  },
  {
    "year": 2010,
    "month": 12,
    "equity": 0.037146,
    "bond": -0.042812,
    "cpi": 219.18
  },
  {
    "year": 2011,
    "month": 1,
    "equity": 0.034638,
    "bond": -0.00573,
    "cpi": 220.22
  },
  {
    "year": 2011,
    "month": 2,
    "equity": 0.031524,
    "bond": -0.013126,
    "cpi": 221.31
  },
  {
    "year": 2011,
    "month": 3,
    "equity": -0.01111,
    "bond": 0.017371,
    "cpi": 223.47
  },
  {
    "year": 2011,
    "month": 4,
    "equity": 0.022229,
    "bond": -0.00138,
    "cpi": 224.91
  },
  {
    "year": 2011,
    "month": 5,
    "equity": 0.006611,
    "bond": 0.027709,
    "cpi": 225.96
  },
  {
    "year": 2011,
    "month": 6,
    "equity": -0.036607,
    "bond": 0.017313,
    "cpi": 225.72
  },
  {
    "year": 2011,
    "month": 7,
    "equity": 0.031035,
    "bond": 0.0025,
    "cpi": 225.92
  },
  {
    "year": 2011,
    "month": 8,
    "equity": -0.103989,
    "bond": 0.06498,
    "cpi": 226.54
  },
  {
    "year": 2011,
    "month": 9,
    "equity": -0.007873,
    "bond": 0.030926,
    "cpi": 226.89
  },
  {
    "year": 2011,
    "month": 10,
    "equity": 0.030219,
    "bond": -0.013634,
    "cpi": 226.42
  },
  {
    "year": 2011,
    "month": 11,
    "equity": 0.0177,
    "bond": 0.014465,
    "cpi": 226.23
  },
  {
    "year": 2011,
    "month": 12,
    "equity": 0.015576,
    "bond": 0.004395,
    "cpi": 225.67
  },
  {
    "year": 2012,
    "month": 1,
    "equity": 0.047846,
    "bond": 0.002557,
    "cpi": 226.66
  },
  {
    "year": 2012,
    "month": 2,
    "equity": 0.041646,
    "bond": 0.001642,
    "cpi": 227.66
  },
  {
    "year": 2012,
    "month": 3,
    "equity": 0.028857,
    "bond": -0.016323,
    "cpi": 229.39
  },
  {
    "year": 2012,
    "month": 4,
    "equity": -0.000363,
    "bond": 0.01265,
    "cpi": 230.09
  },
  {
    "year": 2012,
    "month": 5,
    "equity": -0.03089,
    "bond": 0.024572,
    "cpi": 229.81
  },
  {
    "year": 2012,
    "month": 6,
    "equity": -0.011504,
    "bond": 0.018107,
    "cpi": 229.48
  },
  {
    "year": 2012,
    "month": 7,
    "equity": 0.029238,
    "bond": 0.00969,
    "cpi": 229.1
  },
  {
    "year": 2012,
    "month": 8,
    "equity": 0.033903,
    "bond": -0.012524,
    "cpi": 230.38
  },
  {
    "year": 2012,
    "month": 9,
    "equity": 0.030237,
    "bond": -0.002272,
    "cpi": 231.41
  },
  {
    "year": 2012,
    "month": 10,
    "equity": -0.002139,
    "bond": -0.001317,
    "cpi": 231.32
  },
  {
    "year": 2012,
    "month": 11,
    "equity": -0.028343,
    "bond": 0.010671,
    "cpi": 230.22
  },
  {
    "year": 2012,
    "month": 12,
    "equity": 0.021788,
    "bond": -0.005052,
    "cpi": 229.6
  },
  {
    "year": 2013,
    "month": 1,
    "equity": 0.042704,
    "bond": -0.01585,
    "cpi": 230.28
  },
  {
    "year": 2013,
    "month": 2,
    "equity": 0.023346,
    "bond": -0.004754,
    "cpi": 232.17
  },
  {
    "year": 2013,
    "month": 3,
    "equity": 0.02724,
    "bond": 0.003465,
    "cpi": 232.77
  },
  {
    "year": 2013,
    "month": 4,
    "equity": 0.014559,
    "bond": 0.01996,
    "cpi": 232.53
  },
  {
    "year": 2013,
    "month": 5,
    "equity": 0.045763,
    "bond": -0.013982,
    "cpi": 232.94
  },
  {
    "year": 2013,
    "month": 6,
    "equity": -0.011158,
    "bond": -0.031417,
    "cpi": 233.5
  },
  {
    "year": 2013,
    "month": 7,
    "equity": 0.032564,
    "bond": -0.02274,
    "cpi": 233.6
  },
  {
    "year": 2013,
    "month": 8,
    "equity": 0.002544,
    "bond": -0.011831,
    "cpi": 233.88
  },
  {
    "year": 2013,
    "month": 9,
    "equity": 0.011943,
    "bond": -0.003813,
    "cpi": 234.15
  },
  {
    "year": 2013,
    "month": 10,
    "equity": 0.021185,
    "bond": 0.019041,
    "cpi": 233.55
  },
  {
    "year": 2013,
    "month": 11,
    "equity": 0.038609,
    "bond": -0.006563,
    "cpi": 233.07
  },
  {
    "year": 2013,
    "month": 12,
    "equity": 0.015226,
    "bond": -0.013342,
    "cpi": 233.05
  },
  {
    "year": 2014,
    "month": 1,
    "equity": 0.009697,
    "bond": 0.005892,
    "cpi": 233.92
  },
  {
    "year": 2014,
    "month": 2,
    "equity": -0.001281,
    "bond": 0.01551,
    "cpi": 234.78
  },
  {
    "year": 2014,
    "month": 3,
    "equity": 0.027242,
    "bond": 0.001384,
    "cpi": 236.29
  },
  {
    "year": 2014,
    "month": 4,
    "equity": 0.002034,
    "bond": 0.003142,
    "cpi": 237.07
  },
  {
    "year": 2014,
    "month": 5,
    "equity": 0.015337,
    "bond": 0.01548,
    "cpi": 237.9
  },
  {
    "year": 2014,
    "month": 6,
    "equity": 0.03198,
    "bond": -0.001386,
    "cpi": 238.34
  },
  {
    "year": 2014,
    "month": 7,
    "equity": 0.014974,
    "bond": 0.00746,
    "cpi": 238.25
  },
  {
    "year": 2014,
    "month": 8,
    "equity": -0.004254,
    "bond": 0.012766,
    "cpi": 237.85
  },
  {
    "year": 2014,
    "month": 9,
    "equity": 0.017796,
    "bond": -0.007693,
    "cpi": 238.03
  },
  {
    "year": 2014,
    "month": 10,
    "equity": -0.026453,
    "bond": 0.022637,
    "cpi": 237.43
  },
  {
    "year": 2014,
    "month": 11,
    "equity": 0.05707,
    "bond": -0.000757,
    "cpi": 236.15
  },
  {
    "year": 2014,
    "month": 12,
    "equity": 0.006352,
    "bond": 0.012699,
    "cpi": 234.81
  },
  {
    "year": 2015,
    "month": 1,
    "equity": -0.011082,
    "bond": 0.031904,
    "cpi": 233.71
  },
  {
    "year": 2015,
    "month": 2,
    "equity": 0.028293,
    "bond": -0.007499,
    "cpi": 234.72
  },
  {
    "year": 2015,
    "month": 3,
    "equity": 0.000572,
    "bond": -0.003773,
    "cpi": 236.12
  },
  {
    "year": 2015,
    "month": 4,
    "equity": 0.008797,
    "bond": 0.010783,
    "cpi": 236.6
  },
  {
    "year": 2015,
    "month": 5,
    "equity": 0.009801,
    "bond": -0.021703,
    "cpi": 237.81
  },
  {
    "year": 2015,
    "month": 6,
    "equity": -0.004343,
    "bond": -0.012406,
    "cpi": 238.64
  },
  {
    "year": 2015,
    "month": 7,
    "equity": -0.000786,
    "bond": 0.005533,
    "cpi": 238.65
  },
  {
    "year": 2015,
    "month": 8,
    "equity": -0.024234,
    "bond": 0.015407,
    "cpi": 238.32
  },
  {
    "year": 2015,
    "month": 9,
    "equity": -0.04506,
    "bond": 0.001808,
    "cpi": 237.94
  },
  {
    "year": 2015,
    "month": 10,
    "equity": 0.043184,
    "bond": 0.010834,
    "cpi": 237.84
  },
  {
    "year": 2015,
    "month": 11,
    "equity": 0.029337,
    "bond": -0.015267,
    "cpi": 237.34
  },
  {
    "year": 2015,
    "month": 12,
    "equity": -0.011018,
    "bond": 0.003674,
    "cpi": 236.53
  },
  {
    "year": 2016,
    "month": 1,
    "equity": -0.06419,
    "bond": 0.015392,
    "cpi": 236.92
  },
  {
    "year": 2016,
    "month": 2,
    "equity": -0.005492,
    "bond": 0.03012,
    "cpi": 237.11
  },
  {
    "year": 2016,
    "month": 3,
    "equity": 0.063634,
    "bond": -0.008533,
    "cpi": 238.13
  },
  {
    "year": 2016,
    "month": 4,
    "equity": 0.028321,
    "bond": 0.008888,
    "cpi": 239.26
  },
  {
    "year": 2016,
    "month": 5,
    "equity": -0.003036,
    "bond": 0.001508,
    "cpi": 240.23
  },
  {
    "year": 2016,
    "month": 6,
    "equity": 0.010673,
    "bond": 0.017178,
    "cpi": 241.02
  },
  {
    "year": 2016,
    "month": 7,
    "equity": 0.032982,
    "bond": 0.01436,
    "cpi": 240.63
  },
  {
    "year": 2016,
    "month": 8,
    "equity": 0.012,
    "bond": -0.004302,
    "cpi": 240.85
  },
  {
    "year": 2016,
    "month": 9,
    "equity": -0.004379,
    "bond": -0.005155,
    "cpi": 241.43
  },
  {
    "year": 2016,
    "month": 10,
    "equity": -0.005051,
    "bond": -0.010554,
    "cpi": 241.73
  },
  {
    "year": 2016,
    "month": 11,
    "equity": 0.01202,
    "bond": -0.032715,
    "cpi": 241.35
  },
  {
    "year": 2016,
    "month": 12,
    "equity": 0.039468,
    "bond": -0.029171,
    "cpi": 241.43
  },
  {
    "year": 2017,
    "month": 1,
    "equity": 0.014385,
    "bond": 0.007397,
    "cpi": 242.84
  },
  {
    "year": 2017,
    "month": 2,
    "equity": 0.025773,
    "bond": 0.002912,
    "cpi": 243.6
  },
  {
    "year": 2017,
    "month": 3,
    "equity": 0.017501,
    "bond": -0.003292,
    "cpi": 243.8
  },
  {
    "year": 2017,
    "month": 4,
    "equity": -0.00153,
    "bond": 0.018133,
    "cpi": 244.52
  },
  {
    "year": 2017,
    "month": 5,
    "equity": 0.016934,
    "bond": 0.001917,
    "cpi": 244.73
  },
  {
    "year": 2017,
    "month": 6,
    "equity": 0.017774,
    "bond": 0.011787,
    "cpi": 244.96
  },
  {
    "year": 2017,
    "month": 7,
    "equity": 0.00989,
    "bond": -0.009767,
    "cpi": 244.79
  },
  {
    "year": 2017,
    "month": 8,
    "equity": 0.002489,
    "bond": 0.011795,
    "cpi": 245.52
  },
  {
    "year": 2017,
    "month": 9,
    "equity": 0.016543,
    "bond": 0.002739,
    "cpi": 246.82
  },
  {
    "year": 2017,
    "month": 10,
    "equity": 0.027356,
    "bond": -0.012406,
    "cpi": 246.66
  },
  {
    "year": 2017,
    "month": 11,
    "equity": 0.015904,
    "bond": 0.002857,
    "cpi": 246.67
  },
  {
    "year": 2017,
    "month": 12,
    "equity": 0.028843,
    "bond": -0.002483,
    "cpi": 246.52
  },
  {
    "year": 2018,
    "month": 1,
    "equity": 0.04863,
    "bond": -0.013851,
    "cpi": 247.87
  },
  {
    "year": 2018,
    "month": 2,
    "equity": -0.028856,
    "bond": -0.022177,
    "cpi": 248.99
  },
  {
    "year": 2018,
    "month": 3,
    "equity": 0.000657,
    "bond": 0.004123,
    "cpi": 249.55
  },
  {
    "year": 2018,
    "month": 4,
    "equity": -0.01663,
    "bond": -0.000239,
    "cpi": 250.55
  },
  {
    "year": 2018,
    "month": 5,
    "equity": 0.019627,
    "bond": -0.007111,
    "cpi": 251.59
  },
  {
    "year": 2018,
    "month": 6,
    "equity": 0.02114,
    "bond": 0.008551,
    "cpi": 251.99
  },
  {
    "year": 2018,
    "month": 7,
    "equity": 0.015821,
    "bond": 0.00416,
    "cpi": 252.01
  },
  {
    "year": 2018,
    "month": 8,
    "equity": 0.024521,
    "bond": 0.002408,
    "cpi": 252.15
  },
  {
    "year": 2018,
    "month": 9,
    "equity": 0.016811,
    "bond": -0.007085,
    "cpi": 252.44
  },
  {
    "year": 2018,
    "month": 10,
    "equity": -0.038476,
    "bond": -0.010353,
    "cpi": 252.88
  },
  {
    "year": 2018,
    "month": 11,
    "equity": -0.020747,
    "bond": 0.005199,
    "cpi": 252.04
  },
  {
    "year": 2018,
    "month": 12,
    "equity": -0.055611,
    "bond": 0.027832,
    "cpi": 251.23
  },
  {
    "year": 2019,
    "month": 1,
    "equity": 0.017369,
    "bond": 0.012859,
    "cpi": 251.71
  },
  {
    "year": 2019,
    "month": 2,
    "equity": 0.058302,
    "bond": 0.004887,
    "cpi": 252.78
  },
  {
    "year": 2019,
    "month": 3,
    "equity": 0.019492,
    "bond": 0.011924,
    "cpi": 254.2
  },
  {
    "year": 2019,
    "month": 4,
    "equity": 0.037243,
    "bond": 0.005673,
    "cpi": 255.55
  },
  {
    "year": 2019,
    "month": 5,
    "equity": -0.015307,
    "bond": 0.013656,
    "cpi": 256.09
  },
  {
    "year": 2019,
    "month": 6,
    "equity": 0.014059,
    "bond": 0.032703,
    "cpi": 256.14
  },
  {
    "year": 2019,
    "month": 7,
    "equity": 0.038284,
    "bond": 0.04137,
    "cpi": 256.57
  },
  {
    "year": 2019,
    "month": 8,
    "equity": -0.031334,
    "bond": 0.001358,
    "cpi": 256.56
  },
  {
    "year": 2019,
    "month": 9,
    "equity": 0.030863,
    "bond": -0.005075,
    "cpi": 256.76
  },
  {
    "year": 2019,
    "month": 10,
    "equity": 0.000108,
    "bond": 0.000498,
    "cpi": 257.35
  },
  {
    "year": 2019,
    "month": 11,
    "equity": 0.044346,
    "bond": -0.007716,
    "cpi": 257.21
  },
  {
    "year": 2019,
    "month": 12,
    "equity": 0.024702,
    "bond": -0.003051,
    "cpi": 256.97
  },
  {
    "year": 2020,
    "month": 1,
    "equity": 0.033476,
    "bond": 0.010713,
    "cpi": 257.97
  },
  {
    "year": 2020,
    "month": 2,
    "equity": 0.001232,
    "bond": 0.025597,
    "cpi": 258.68
  },
  {
    "year": 2020,
    "month": 3,
    "equity": -0.189166,
    "bond": 0.061566,
    "cpi": 258.12
  },
  {
    "year": 2020,
    "month": 4,
    "equity": 0.043187,
    "bond": 0.021042,
    "cpi": 256.39
  },
  {
    "year": 2020,
    "month": 5,
    "equity": 0.058875,
    "bond": -0.000417,
    "cpi": 256.39
  },
  {
    "year": 2020,
    "month": 6,
    "equity": 0.065084,
    "bond": -0.005226,
    "cpi": 257.8
  },
  {
    "year": 2020,
    "month": 7,
    "equity": 0.034757,
    "bond": 0.011272,
    "cpi": 259.1
  },
  {
    "year": 2020,
    "month": 8,
    "equity": 0.058928,
    "bond": -0.002387,
    "cpi": 259.92
  },
  {
    "year": 2020,
    "month": 9,
    "equity": -0.006277,
    "bond": -0.002358,
    "cpi": 260.28
  },
  {
    "year": 2020,
    "month": 10,
    "equity": 0.017255,
    "bond": -0.010007,
    "cpi": 260.39
  },
  {
    "year": 2020,
    "month": 11,
    "equity": 0.039537,
    "bond": -0.007001,
    "cpi": 260.23
  },
  {
    "year": 2020,
    "month": 12,
    "equity": 0.042596,
    "bond": -0.005002,
    "cpi": 260.47
  },
  {
    "year": 2021,
    "month": 1,
    "equity": 0.027948,
    "bond": -0.013437,
    "cpi": 261.58
  },
  {
    "year": 2021,
    "month": 2,
    "equity": 0.024911,
    "bond": -0.016004,
    "cpi": 263.01
  },
  {
    "year": 2021,
    "month": 3,
    "equity": 0.008209,
    "bond": -0.031258,
    "cpi": 264.88
  },
  {
    "year": 2021,
    "month": 4,
    "equity": 0.060217,
    "bond": -0.001424,
    "cpi": 267.05
  },
  {
    "year": 2021,
    "month": 5,
    "equity": 0.007604,
    "bond": 0.003212,
    "cpi": 269.19
  },
  {
    "year": 2021,
    "month": 6,
    "equity": 0.018106,
    "bond": 0.010622,
    "cpi": 271.7
  },
  {
    "year": 2021,
    "month": 7,
    "equity": 0.030691,
    "bond": 0.019993,
    "cpi": 273.0
  },
  {
    "year": 2021,
    "month": 8,
    "equity": 0.02186,
    "bond": 0.004853,
    "cpi": 273.57
  },
  {
    "year": 2021,
    "month": 9,
    "equity": -0.000836,
    "bond": -0.00734,
    "cpi": 274.31
  },
  {
    "year": 2021,
    "month": 10,
    "equity": 0.004529,
    "bond": -0.018272,
    "cpi": 276.59
  },
  {
    "year": 2021,
    "month": 11,
    "equity": 0.047455,
    "bond": 0.003167,
    "cpi": 277.95
  },
  {
    "year": 2021,
    "month": 12,
    "equity": 0.002661,
    "bond": 0.009665,
    "cpi": 278.8
  },
  {
    "year": 2022,
    "month": 1,
    "equity": -0.02051,
    "bond": -0.025349,
    "cpi": 281.15
  },
  {
    "year": 2022,
    "month": 2,
    "equity": -0.029016,
    "bond": -0.013982,
    "cpi": 283.72
  },
  {
    "year": 2022,
    "month": 3,
    "equity": -0.008916,
    "bond": -0.016391,
    "cpi": 287.5
  },
  {
    "year": 2022,
    "month": 4,
    "equity": 0.001196,
    "bond": -0.052377,
    "cpi": 289.11
  },
  {
    "year": 2022,
    "month": 5,
    "equity": -0.078714,
    "bond": -0.010716,
    "cpi": 292.3
  },
  {
    "year": 2022,
    "month": 6,
    "equity": -0.03368,
    "bond": -0.018158,
    "cpi": 296.31
  },
  {
    "year": 2022,
    "month": 7,
    "equity": 0.004656,
    "bond": 0.023428,
    "cpi": 296.28
  },
  {
    "year": 2022,
    "month": 8,
    "equity": 0.064483,
    "bond": 0.002417,
    "cpi": 296.17
  },
  {
    "year": 2022,
    "month": 9,
    "equity": -0.072765,
    "bond": -0.049783,
    "cpi": 296.81
  },
  {
    "year": 2022,
    "month": 10,
    "equity": -0.0309,
    "bond": -0.034964,
    "cpi": 298.01
  },
  {
    "year": 2022,
    "month": 11,
    "equity": 0.052863,
    "bond": 0.010763,
    "cpi": 297.71
  },
  {
    "year": 2022,
    "month": 12,
    "equity": 0.00012,
    "bond": 0.025866,
    "cpi": 296.8
  },
  {
    "year": 2023,
    "month": 1,
    "equity": 0.013774,
    "bond": 0.01059,
    "cpi": 299.17
  },
  {
    "year": 2023,
    "month": 2,
    "equity": 0.031479,
    "bond": -0.01538,
    "cpi": 300.84
  },
  {
    "year": 2023,
    "month": 3,
    "equity": -0.025845,
    "bond": 0.010652,
    "cpi": 301.67
  },
  {
    "year": 2023,
    "month": 4,
    "equity": 0.039966,
    "bond": 0.019936,
    "cpi": 303.36
  },
  {
    "year": 2023,
    "month": 5,
    "equity": 0.00738,
    "bond": -0.006356,
    "cpi": 304.13
  },
  {
    "year": 2023,
    "month": 6,
    "equity": 0.049425,
    "bond": -0.012016,
    "cpi": 305.11
  },
  {
    "year": 2023,
    "month": 7,
    "equity": 0.037443,
    "bond": -0.009279,
    "cpi": 305.69
  },
  {
    "year": 2023,
    "month": 8,
    "equity": -0.01125,
    "bond": -0.018797,
    "cpi": 305.98
  },
  {
    "year": 2023,
    "month": 9,
    "equity": 0.013104,
    "bond": 0.010032,
    "cpi": 306.13
  },
  {
    "year": 2023,
    "month": 10,
    "equity": -0.054558,
    "bond": 0.412408,
    "cpi": 0.0
  },
  {
    "year": 2023,
    "month": 11,
    "equity": 0.044657,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2023,
    "month": 12,
    "equity": 0.050446,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 1,
    "equity": 0.025494,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 2,
    "equity": 0.043183,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 3,
    "equity": 0.031646,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 4,
    "equity": -0.011233,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 5,
    "equity": 0.024008,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 6,
    "equity": 0.034365,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 7,
    "equity": 0.022688,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 8,
    "equity": -0.010796,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 9,
    "equity": 0.026113,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 10,
    "equity": 0.030431,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 11,
    "equity": 0.023756,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2024,
    "month": 12,
    "equity": 0.013658,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 1,
    "equity": -0.005222,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 2,
    "equity": 0.009895,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 3,
    "equity": -0.05874,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 4,
    "equity": -0.055327,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 5,
    "equity": 0.082209,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 6,
    "equity": 0.037693,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 7,
    "equity": 0.044204,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 8,
    "equity": 0.017859,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 9,
    "equity": 0.027316,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 10,
    "equity": 0.023036,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 11,
    "equity": 0.000772,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2025,
    "month": 12,
    "equity": 0.016636,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2026,
    "month": 1,
    "equity": 0.011103,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2026,
    "month": 2,
    "equity": -0.005096,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2026,
    "month": 3,
    "equity": -0.034725,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2026,
    "month": 4,
    "equity": 0.045472,
    "bond": 0.0,
    "cpi": 0.0
  },
  {
    "year": 2026,
    "month": 5,
    "equity": 0.065479,
    "bond": 0.0,
    "cpi": 0.0
  }
];
