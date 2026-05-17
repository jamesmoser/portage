import { useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyData = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyLayout = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlotlyConfig = any

// Re-export the plotly Data type for use in other files via a compatible alias
export type { PlotlyData as Data }

interface Props {
  data: PlotlyData[]
  layout?: Partial<PlotlyLayout>
  config?: Partial<PlotlyConfig>
  className?: string
  style?: React.CSSProperties
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

export function PlotlyChart({ data, layout, config, className, style }: Props) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return
    const el = divRef.current
    let cancelled = false

    getPlotly().then((Plotly) => {
      if (cancelled || !el) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(Plotly as any).react(
        el,
        data,
        {
          margin: { t: 20, r: 10, b: 60, l: 70 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#f8fafc',
          font: { family: 'system-ui, sans-serif', size: 11, color: '#475569' },
          legend: { orientation: 'h', y: -0.25, font: { size: 10 } },
          ...layout,
        },
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
