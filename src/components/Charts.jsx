import ReactApexChart from 'react-apexcharts'

export function SalesLineChart({ mode = 'Gross' }){
  const colors = {
    Gross: ['#F24AA7'],
    Net: ['#A9D5F9'],
    Unit: ['#A9F9CD']
  }
  const series = [{
    name: mode,
    data: Array.from({length:30}, (_,i)=> Math.round(50 + 30*Math.sin(i/3) + (Math.random()*20)))
  }]
  const options = {
    chart: { id: 'sales-line', animations: { enabled: true, easing: 'easeinout', speed: 600 } },
    stroke: { curve: 'smooth', width: 3 },
    colors: colors[mode],
    fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.4, opacityTo: 0.1 }},
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' },
    grid: { borderColor: '#ECDFF2' },
    xaxis: { categories: Array.from({length:30}, (_,i)=> `D${i+1}`), labels: { style: { colors: '#64748b' } } },
    yaxis: { labels: { style: { colors: '#64748b' } } }
  }
  return (
    <div className="rounded-2xl border border-[#ECDFF2] bg-white p-3">
      <ReactApexChart options={options} series={series} type="line" height={220} />
    </div>
  )
}

export function CandlesChart(){
  const data = Array.from({length:30}, (_,i)=>{
    const base = 100 + i
    const open = base + (Math.random()*4-2)
    const close = base + (Math.random()*4-2)
    const high = Math.max(open, close) + Math.random()*3
    const low = Math.min(open, close) - Math.random()*3
    return { x: `D${i+1}` , y: [open, high, low, close].map(v=>Math.round(v*100)/100) }
  })
  const series = [{ data }]
  const options = {
    chart: { type: 'candlestick', animations: { enabled: true } },
    plotOptions: { candlestick: { colors: { upward: '#A9F9CD', downward: '#F9A8D4' } } },
    xaxis: { type: 'category', labels: { style: { colors: '#64748b' } } },
    yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#64748b' } } },
    grid: { borderColor: '#ECDFF2' },
    tooltip: { theme: 'light' }
  }
  return (
    <div className="rounded-2xl border border-[#ECDFF2] bg-white p-3">
      <ReactApexChart options={options} series={series} type="candlestick" height={220} />
    </div>
  )
}
