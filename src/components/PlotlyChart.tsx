import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyData = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyLayout = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyConfig = any

// Re-export the plotly Data type for use in other files via a compatible alias
export type { PlotlyData as Data }

/**
 * Injects per-year bar totals into each bar series as customdata so hovertemplates
 * can display both the segment value and the full stack total.
 * Apply to any stacked bar chart data array before passing to PlotlyChart.
 */
export function withTotals(series: PlotlyData[]): PlotlyData[] {
  const barSeries = series.filter((s: PlotlyData) => s.type === 'bar')
  const n = (barSeries[0]?.x as number[] | undefined)?.length ?? 0
  const totals = Array.from({ length: n }, (_, i) =>
    barSeries.reduce((sum: number, s: PlotlyData) => sum + ((s.y as number[])[i] || 0), 0)
  )
  return series.map((s: PlotlyData) =>
    s.type !== 'bar' ? s : {
      ...s,
      customdata: totals,
      hovertemplate: '%{fullData.name}: $%{y:,.0f}<br>Total: $%{customdata:,.0f}<extra></extra>',
    }
  )
}

interface Props {
  data: PlotlyData[]
  layout?: Partial<PlotlyLayout>
  config?: Partial<PlotlyConfig>
  className?: string
  style?: React.CSSProperties
  forceZeroY?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let plotlyPromise: Promise<any> | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPlotly(): Promise<any> {
  if (!plotlyPromise) {
    plotlyPromise = import('plotly.js-dist-min') as Promise<unknown> as Promise<any>
  }
  return plotlyPromise
}

export function PlotlyChart({ data, layout, config, className, style, forceZeroY = false }: Props) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return
    const el = divRef.current
    let cancelled = false

    getPlotly().then((Plotly) => {
      if (cancelled || !el) return

      let hasNegativeY = false
      if (Array.isArray(data)) {
        for (const trace of data) {
          if (Array.isArray(trace?.y)) {
            for (const val of trace.y) {
              if (typeof val === 'number' && val < -0.01) {
                hasNegativeY = true
                break
              }
            }
          }
          if (hasNegativeY) break
        }
      }

      const showXAxisLine = layout?.xaxis?.visible !== false
      const mergedLayout = {
        margin: { t: 20, r: 10, b: 36, l: 70 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#f8fafc',
        font: { family: 'system-ui, sans-serif', size: 11, color: '#475569' },
        showlegend: false,
        ...layout,
        xaxis: {
          ...(showXAxisLine ? {
            showline: true,
            linecolor: '#cbd5e1',
            linewidth: 1.2,
          } : {}),
          zeroline: false,
          ...layout?.xaxis,
        },
        yaxis: {
          ...(!hasNegativeY && forceZeroY ? { range: [0, null] } : {}),
          ...(!hasNegativeY ? { rangemode: 'nonnegative' as const } : {}),
          zeroline: true,
          zerolinecolor: '#cbd5e1',
          zerolinewidth: 1.2,
          ...layout?.yaxis,
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(Plotly as any).react(
        el,
        data,
        mergedLayout,
        {
          responsive: true,
          displayModeBar: false,
          ...config,
        },
      )
    })

    return () => { cancelled = true }
  }, [data, layout, config])

  // Handle resize
  useEffect(() => {
    if (!divRef.current) return
    const el = divRef.current
    const ro = new ResizeObserver(() => {
      getPlotly().then((Plotly) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (el) (Plotly as any).Plots.resize(el)
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return <div ref={divRef} className={className} style={style} />
}
