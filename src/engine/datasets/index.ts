import { HistoricalDataset } from '../types'
import { dataset as usShiller } from './us_shiller'
import { dataset as canadaCia } from './canada_cia'
import { dataset as ukLbs } from './uk_lbs'
import { dataset as japanMsci } from './japan_msci'
import { dataset as globalJst } from './global_jst'

export const DATASETS: HistoricalDataset[] = [
  usShiller,
  canadaCia,
  ukLbs,
  japanMsci,
  globalJst
]

export const DEFAULT_DATASET_ID = 'us_shiller'

export function getDatasetById(id: string): HistoricalDataset {
  const found = DATASETS.find(d => d.id === id)
  if (!found) {
    return usShiller // fallback
  }
  return found
}
