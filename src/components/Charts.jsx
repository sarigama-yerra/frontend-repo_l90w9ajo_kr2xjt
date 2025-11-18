import { useEffect, useState, useMemo } from 'react'

// Lightweight runtime loader for ApexCharts via UMD builds.
// This avoids bundling issues if the npm packages aren't present yet.
function useApexCharts() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    // If already present, mark ready
    if (window.ApexCharts && window.ReactApexCharts) {
      setReady(true)
      return
    }

    const ensureScript = (src) =>
      new Promise((resolve, reject) => {
        // Already loaded?
        const existing = Array.from(document.scripts).find((s) => s.src.includes(src))
        if (existing) {
          existing.addEventListener('load', () => resolve())
          if (existing.readyState === 'complete') resolve()
          return
        }
        const el = document.createElement('script')
        el.src = src
        el.async = true
        el.crossOrigin = 'anonymous'
        el.onload = () => resolve()
        el.onerror = (e) => reject(e)
        document.head.appendChild(el)
      })

    ;(async () => {
      try {
        // 1) Core ApexCharts
        await ensureScript('https://unpkg.com/apexcharts@3.53.0/dist/apexcharts.min.js')
        // 2) React wrapper (UMD exposes window.ReactApexCharts)
        await ensureScript('https://unpkg.com/react-apexcharts@1.6.0/dist/react-apexcharts.min.js')
        if (!cancelled) setReady(true)
      } catch (e) {
        console.error('Failed to load chart libraries', e)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return ready && window.ReactApexCharts ? window.ReactApexCharts : null
}

export function SalesLineChart({ mode = 'Gross' }) {
  const ReactApexChart = useApexCharts()

  const { series, options } = useMemo(() => {
    const colors = {
      Gross: ['#F24AA7'],
      Net: ['#A9D5F9'],
      Unit: ['#A9F9CD'],
    }
    const data = Array.from({ length: 30 }, (_, i) =>
      Math.round(50 + 30 * Math.sin(i / 3) + Math.random() * 20)
    )

    return {
      series: [{ name: mode, data }],
      options: {
        chart: { id: 'sales-line', animations: { enabled: true, easing: 'easeinout', speed: 600 } },
        stroke: { curve: 'smooth', width: 3 },
        colors: colors[mode],
        fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.4, opacityTo: 0.1 } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' },
        grid: { borderColor: '#ECDFF2' },
        xaxis: { categories: Array.from({ length: 30 }, (_, i) => `D${i + 1}`), labels: { style: { colors: '#64748b' } } },
        yaxis: { labels: { style: { colors: '#64748b' } } },
      },
    }
  }, [mode])

  return (
    <div className="rounded-2xl border border-[#ECDFF2] bg-white p-3">
      {ReactApexChart ? (
        <ReactApexChart options={options} series={series} type="line" height={220} />
      ) : (
        <div className="h-[220px] animate-pulse rounded-xl bg-[#F7F2FA]" aria-busy="true" aria-live="polite" />
      )}
    </div>
  )
}

export function CandlesChart() {
  const ReactApexChart = useApexCharts()

  const { series, options } = useMemo(() => {
    const data = Array.from({ length: 30 }, (_, i) => {
      const base = 100 + i
      const open = base + (Math.random() * 4 - 2)
      const close = base + (Math.random() * 4 - 2)
      const high = Math.max(open, close) + Math.random() * 3
      const low = Math.min(open, close) - Math.random() * 3
      return { x: `D${i + 1}`, y: [open, high, low, close].map((v) => Math.round(v * 100) / 100) }
    })

    return {
      series: [{ data }],
      options: {
        chart: { type: 'candlestick', animations: { enabled: true } },
        plotOptions: { candlestick: { colors: { upward: '#A9F9CD', downward: '#F9A8D4' } } },
        xaxis: { type: 'category', labels: { style: { colors: '#64748b' } } },
        yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#64748b' } } },
        grid: { borderColor: '#ECDFF2' },
        tooltip: { theme: 'light' },
      },
    }
  }, [])

  return (
    <div className="rounded-2xl border border-[#ECDFF2] bg-white p-3">
      {ReactApexChart ? (
        <ReactApexChart options={options} series={series} type="candlestick" height={220} />
      ) : (
        <div className="h-[220px] animate-pulse rounded-xl bg-[#F7F2FA]" aria-busy="true" aria-live="polite" />
      )}
    </div>
  )
}
