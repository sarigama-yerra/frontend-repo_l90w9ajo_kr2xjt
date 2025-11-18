import { useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Search, Bell, Menu, ChevronDown, Download, Plus, Settings, Banknote, Wallet2, LineChart, Activity, Server, Clock, Zap, CheckCircle2 } from 'lucide-react'
import { Button, Badge, Card, Input, Select, Toggle, Table, Modal, Drawer, Toast, cx } from './UI'

const ROLES = ['Reseller','Admin','Investor','Engineer','High Admin','Owner']

const products = [
  { id: 'prd-1', name: 'VPS 2vCPU/4GB/40GB SSD', price: 120000, cycle: 'bulan' },
  { id: 'prd-2', name: 'VPS 4vCPU/8GB/80GB SSD', price: 230000, cycle: 'bulan' },
  { id: 'prd-3', name: 'Domain .com', price: 150000, cycle: 'tahun' },
  { id: 'prd-4', name: 'Add-on IP', price: 20000, cycle: 'bulan' },
]

const transactions = [
  { datetime: '16 Nov 2025 14:03', product: 'VPS 2/4/40', reseller: 'Muhammad Ilham', buyer: 'user****91', price: 120000, discount: 0, status: 'Paid', method: 'QRIS', trx: 'TRX#A9F32' },
  { datetime: '16 Nov 2025 12:41', product: 'Domain .com', reseller: '-', buyer: 'user****77', price: 150000, discount: 0, status: 'Pending', method: 'VA', trx: 'TRX#B2K10' },
  { datetime: '15 Nov 2025 20:09', product: 'VPS 4/8/80', reseller: 'Siti A', buyer: 'user****55', price: 230000, discount: 0, status: 'Paid', method: 'e-Wallet', trx: 'TRX#C7P88' },
  { datetime: '14 Nov 2025 09:17', product: 'VPS 2/4/40', reseller: 'Muhammad Ilham', buyer: 'user****12', price: 120000, discount: 0, status: 'Refunded', method: 'CC', trx: 'TRX#D4Q12' },
  { datetime: '13 Nov 2025 18:22', product: 'Add-on IP', reseller: '-', buyer: 'user****33', price: 20000, discount: 0, status: 'Paid', method: 'QRIS', trx: 'TRX#E1M03' },
]

const logs = [
  { time: '16 Nov 2025 14:03', cat: 'Sale', actor: 'Muhammad Ilham', desc: 'menjual VPS (2 vCPU, 4GB RAM, 40GB SSD) seharga Rp120.000.', ref: 'TRX#A9F32' },
  { time: '16 Nov 2025 14:03', cat: 'Payment', actor: 'System', desc: 'Auto payment berhasil (QRIS), captured 2.1s.', ref: 'TRX#A9F32' },
  { time: '15 Nov 2025 20:11', cat: 'System', actor: 'Engineer', desc: 'Provisioning sukses untuk TRX#C7P88 (server-01).', ref: 'TRX#C7P88' },
  { time: '14 Nov 2025 09:25', cat: 'Refund', actor: 'High Admin', desc: 'Refund untuk TRX#D4Q12, alasan: double charge.', ref: 'TRX#D4Q12' },
]

const payouts = [
  { id: '#WD-1023', reseller:'Muhammad Ilham', amount: 500000, submitted: '11 Nov 2025', eta: '16 Nov 2025', policy: 'T+5', status: 'Scheduled', proof: '' },
  { id: '#WD-1024', reseller:'Siti A', amount: 300000, submitted: '13 Nov 2025', eta: '18 Nov 2025', policy: 'T+5', status: 'Pending', proof: '' },
]

function formatRp(n){
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function can(role, feature){
  const map = {
    viewLogs: ['Admin','Investor','Engineer','High Admin','Owner'],
    manageProducts: ['Admin','High Admin','Owner'],
    systemView: ['Engineer','High Admin','Owner'],
    instantPayout: ['High Admin','Owner'],
    manageUsers: ['High Admin','Owner'],
    settings: ['High Admin','Owner'],
    financeMetrics: ['Investor','High Admin','Owner'],
  }
  return map[feature]?.includes(role)
}

export default function Dashboard(){
  const [role, setRole] = useState('Reseller')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [autoCapture, setAutoCapture] = useState(true)
  const [drawerTx, setDrawerTx] = useState(null)
  const [modalPayout, setModalPayout] = useState(false)
  const [toast, setToast] = useState({ open:false, type:'success', message:'' })

  const metrics = useMemo(() => {
    const todaySales = transactions.filter(t => t.status==='Paid').reduce((a,b)=>a+b.price,0)
    const mrr = 120000 + 230000 + 20000
    const revenue = transactions.reduce((a,b)=>a+b.price,0)
    return { today: todaySales, month: revenue, mrr }
  }, [])

  const navItems = [
    { key:'overview', label:'Overview', roles: ROLES },
    { key:'sales', label:'Penjualan', roles: ROLES },
    { key:'payments', label:'Pembayaran', roles: ROLES },
    { key:'payouts', label:'Pencairan', roles: ROLES },
    { key:'products', label:'Produk', roles: ['Admin','High Admin','Owner'] },
    { key:'system', label:'Sistem', roles: ['Engineer','High Admin','Owner'] },
    { key:'users', label:'Pengguna/Roles', roles: ['High Admin','Owner'] },
    { key:'logs', label:'Logs', roles: ['Admin','Investor','Engineer','High Admin','Owner'] },
    { key:'settings', label:'Settings', roles: ['High Admin','Owner','Reseller'] },
  ]

  const [current, setCurrent] = useState('overview')

  function Section({ when, children }){
    if(!when) return null
    return children
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7F2FA,white)] text-slate-900">
      <div className="relative h-[88px] sm:h-[120px] md:h-[160px]">
        <Spline scene="https://prod.spline.design/8nsoLg1te84JZcE9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0" style={{background:'linear-gradient(180deg, rgba(247,242,250,0.9) 0%, rgba(247,242,250,0.85) 50%, rgba(255,255,255,1) 100%)'}} />
        <header className="absolute top-0 left-0 right-0 p-2 md:p-4">
          <div className="mx-auto max-w-[1280px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button className="p-2 md:hidden" aria-label="Toggle Sidebar" onClick={()=>setSidebarOpen(s=>!s)}><Menu /></button>
              <div className="font-extrabold text-base md:text-xl tracking-tight text-[#F24AA7]">DigitalPay</div>
              <Badge color="role" className="hidden sm:inline-flex">{role}</Badge>
            </div>
            <div className="hidden md:flex items-center gap-3 w-[560px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
                <Input placeholder="Cari transaksi, produk, pengguna..." className="pl-9" aria-label="Search" />
              </div>
              <Button variant="secondary" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
              <div className="flex items-center gap-2 px-2 py-1.5 bg-[#F7F2FA] border border-[#ECDFF2] rounded-2xl">
                <div className="h-7 w-7 rounded-full" style={{background:'linear-gradient(135deg,#F24AA7,#A9D5F9)'}} aria-hidden />
                <span className="text-sm">Akun</span>
                <ChevronDown className="h-4 w-4" aria-hidden />
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-6 -mt-8 md:-mt-12 pb-24">
        {/* Compact toolbar below header to avoid oversized navbar */}
        <div className="mb-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-slate-600">Peran:</span>
            <Select value={role} onChange={e=>setRole(e.target.value)} aria-label="Role Switcher">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Badge color="default" className="hidden sm:inline-flex">Prototype — sections berubah sesuai role</Badge>
          </div>
          {/* Quick search for small screens */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
              <Input placeholder="Cari…" className="pl-9" aria-label="Search mobile" />
            </div>
            <Button variant="secondary" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={cx('hidden md:block w-64 flex-shrink-0')}
            aria-label="Sidebar">
            <Card variant="bento" tone="cream" className="p-2">
              {navItems.filter(i=>i.roles.includes(role)).map(i => (
                <button key={i.key} onClick={()=>setCurrent(i.key)}
                  className={cx('w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-[#FFF6FB]', current===i.key && 'bg-[#F9A8D4]/60 font-semibold')}>{i.label}</button>
              ))}
            </Card>
          </aside>

          <main className="flex-1 min-w-0">
            <Section when={current==='overview'}>
              {/* Bento grid */}
              <div className="grid grid-cols-12 gap-4">
                <Card variant="bento" tone="pink" className="col-span-12 lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-slate-700 text-sm">Total Penjualan Hari Ini</h2>
                      <div className="text-2xl font-bold">{formatRp(metrics.today)}</div>
                    </div>
                    <LineChart className="text-rose-700" />
                  </div>
                  <div className="mt-3 text-sm text-slate-700">Bulan ini: {formatRp(metrics.month)}</div>
                </Card>

                {can(role,'financeMetrics') && (
                  <Card variant="bento" tone="mint" className="col-span-12 lg:col-span-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-slate-700 text-sm">MRR</h2>
                        <div className="text-2xl font-bold">{formatRp(metrics.mrr)}</div>
                      </div>
                      <Activity className="text-emerald-700" />
                    </div>
                    <div className="mt-3 text-sm text-slate-700">Revenue bulan ini: {formatRp(metrics.month)}</div>
                  </Card>
                )}

                <Card variant="bento" tone="blue" className="col-span-12 lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-slate-700 text-sm">Saldo Tersedia</h2>
                      <div className="text-2xl font-bold">{role==='Reseller' ? formatRp(1250000) : formatRp(42800000)}</div>
                    </div>
                    <Wallet2 className="text-sky-800" />
                  </div>
                  {role==='Reseller' ? (
                    <div className="mt-3">
                      <Button onClick={()=>setModalPayout(true)}>Ajukan Pencairan</Button>
                      <p className="text-xs text-slate-700 mt-2">Dana tersedia 5 hari setelah pengajuan untuk mitigasi chargeback.</p>
                    </div>
                  ) : can(role,'instantPayout') ? (
                    <div className="mt-3">
                      <Button variant="secondary">Kelola Pencairan</Button>
                    </div>
                  ) : null}
                </Card>

                {can(role,'systemView') && (
                  <Card variant="bento" tone="lime" className="col-span-12 lg:col-span-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-slate-700 text-sm">Incident Open</h2>
                        <div className="text-2xl font-bold">2</div>
                      </div>
                      <Server className="text-emerald-800" />
                    </div>
                    <div className="mt-3 text-sm text-slate-700">Queue provisioning: 3, Webhook: Normal</div>
                  </Card>
                )}

                <Card variant="bento" tone="cream" className="col-span-12 lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-slate-700 text-sm">Auto Payment</h2>
                      <div className="text-2xl font-bold">Operational</div>
                    </div>
                    <Zap className="text-rose-700" />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Badge color="paid">Uptime 99.97%</Badge>
                    <Badge color="default">Latency p95: 2.3s</Badge>
                  </div>
                </Card>

                <Card variant="bento" tone="hotpink" className="col-span-12 lg:col-span-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-white/90 text-sm">Funnel Konversi</h2>
                      <div className="text-2xl font-bold text-white">3.2%</div>
                    </div>
                    <LineChart className="text-white" />
                  </div>
                  <div className="mt-3 text-sm text-white/90">Trial → Paid ratio 1:5</div>
                </Card>
              </div>
            </Section>

            <Section when={current==='sales'}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Select aria-label="Toggle Metric">
                    <option>Gross</option>
                    <option>Net</option>
                    <option>Unit</option>
                  </Select>
                  <Input type="date" aria-label="Start date" />
                  <Input type="date" aria-label="End date" />
                  <Select aria-label="Filter Reseller">
                    <option>Semua Reseller</option>
                    <option>Muhammad Ilham</option>
                    <option>Siti A</option>
                  </Select>
                  <Select aria-label="Status">
                    <option>Semua Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Refunded</option>
                  </Select>
                  <Select aria-label="Metode Bayar">
                    <option>Semua Metode</option>
                    <option>QRIS</option>
                    <option>VA</option>
                    <option>e-Wallet</option>
                    <option>CC</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  {role==='Reseller' && <Button><Plus className="h-4 w-4" /> Tambah Penjualan</Button>}
                  {role==='Reseller' && <Button variant="secondary" onClick={()=>setModalPayout(true)}><Banknote className="h-4 w-4" /> Ajukan Pencairan</Button>}
                  {role!=='Reseller' && <Button variant="secondary"><Download className="h-4 w-4" /> Export CSV</Button>}
                  {can(role,'manageProducts') && <Button variant="tertiary"><Settings className="h-4 w-4" /> Kelola Harga</Button>}
                </div>
              </div>
              <Card variant="bento" tone="cream">
                <div className="h-40 rounded-2xl mb-4 flex items-center justify-center text-slate-500" style={{background:'linear-gradient(90deg,#F9A8D4 0%, #A9D5F9 100%)',opacity:0.25}}>
                  Chart (30 hari)
                </div>
                <Table
                  columns={[
                    {key:'datetime', header:'Tanggal/Waktu'},
                    {key:'product', header:'Produk'},
                    {key:'reseller', header:'Reseller'},
                    {key:'buyer', header:'Pembeli'},
                    {key:'price', header:'Harga (Rp)', render:(v)=>formatRp(v)},
                    {key:'discount', header:'Diskon', render:(v)=>v?formatRp(v):'-'},
                    {key:'status', header:'Status', render:(v)=>{
                      const map = { Paid: 'paid', Pending: 'pending', Refunded: 'refunded', Failed: 'failed' }
                      return <Badge color={map[v] || 'default'}>{v}</Badge>
                    }},
                    {key:'method', header:'Metode'},
                    {key:'trx', header:'Aksi', render:()=> <span className="text-[#F24AA7] hover:underline">Detail</span> },
                  ]}
                  data={transactions}
                  onRowClick={(row)=>setDrawerTx(row)}
                  empty="Belum ada penjualan. Mulai dengan tambah produk atau undang reseller."
                />
              </Card>
            </Section>

            <Section when={current==='payments'}>
              <div className="grid grid-cols-12 gap-4">
                {[
                  { name:'QRIS', uptime:'99.98%', latency:'2.1s' },
                  { name:'VA', uptime:'99.90%', latency:'2.9s' },
                  { name:'e-Wallet', uptime:'99.95%', latency:'2.4s' },
                  { name:'CC', uptime:'99.87%', latency:'3.1s' },
                ].map(g => (
                  <Card key={g.name} variant="bento" tone="cream" className="col-span-12 md:col-span-6 xl:col-span-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{g.name}</h3>
                        <p className="text-sm text-slate-600">Uptime {g.uptime} • p95 {g.latency}</p>
                      </div>
                      <CheckCircle2 className="text-emerald-700" />
                    </div>
                  </Card>
                ))}
              </div>
              <Card variant="bento" tone="blue" className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Toggle checked={autoCapture} onChange={()=>setAutoCapture(v=>!v)} label="Auto-capture" />
                    <span className="text-slate-600 text-sm" title="Pembayaran otomatis menandai transaksi ‘Paid’ saat gateway konfirmasi.">ⓘ Pembayaran otomatis menandai transaksi ‘Paid’ saat gateway konfirmasi.</span>
                  </div>
                  {can(role,'systemView') && <Button variant="secondary">Webhook Retry</Button>}
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Pembayaran Terakhir</h4>
                  <Table
                    columns={[
                      {key:'trx', header:'ID Transaksi'},
                      {key:'method', header:'Metode'},
                      {key:'price', header:'Amount', render:(v)=>formatRp(v)},
                      {key:'status', header:'Status'},
                      {key:'datetime', header:'Waktu'},
                    ]}
                    data={transactions.slice(0,4)}
                  />
                </div>
              </Card>
            </Section>

            <Section when={current==='payouts'}>
              {role==='Reseller' && (
                <Card variant="bento" tone="cream" className="mb-4">
                  <div className="flex items-start gap-3">
                    <Clock className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Pencairan diproses setelah 5 hari dari tanggal pengajuan (T+5).</p>
                      <p className="text-sm text-slate-600">Dana tersedia 5 hari setelah pengajuan untuk mitigasi chargeback.</p>
                    </div>
                  </div>
                </Card>
              )}

              {role==='Reseller' ? (
                <div className="grid grid-cols-12 gap-4">
                  <Card variant="bento" tone="mint" className="col-span-12 md:col-span-5">
                    <h3 className="font-semibold mb-3">Ajukan Pencairan</h3>
                    <div className="space-y-3">
                      <Input type="number" placeholder="Amount (Rp)" aria-label="Amount" />
                      <Input placeholder="Rekening/e-Wallet" aria-label="Rekening" />
                      <Input placeholder="Catatan (opsional)" aria-label="Catatan" />
                      <Button onClick={()=>setToast({open:true, type:'success', message:'Pengajuan terkirim'})}>Ajukan</Button>
                      <p className="text-xs text-slate-700">Minimal Rp50.000. Pastikan saldo cukup dan rekening valid.</p>
                    </div>
                  </Card>
                  <Card variant="bento" tone="cream" className="col-span-12 md:col-span-7">
                    <h3 className="font-semibold mb-3">Daftar Pengajuan</h3>
                    <Table
                      columns={[
                        {key:'id', header:'ID'},
                        {key:'submitted', header:'Tanggal Ajukan'},
                        {key:'amount', header:'Amount', render:(v)=>formatRp(v)},
                        {key:'eta', header:'Estimasi Cair'},
                        {key:'status', header:'Status'},
                      ]}
                      data={payouts.filter(p=>p.reseller!=='Siti A' || true)}
                    />
                  </Card>
                </div>
              ) : (
                <Card variant="bento" tone="cream">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Select aria-label="Filter Role">
                        <option>Semua</option>
                        <option>Reseller</option>
                        <option>Admin</option>
                      </Select>
                      <Select aria-label="Filter Status">
                        <option>Semua Status</option>
                        <option>Pending</option>
                        <option>Scheduled</option>
                        <option>Paid</option>
                      </Select>
                    </div>
                  </div>
                  <Table
                    columns={[
                      {key:'id', header:'ID'},
                      {key:'reseller', header:'Reseller'},
                      {key:'amount', header:'Amount', render:(v)=>formatRp(v)},
                      {key:'submitted', header:'Diajukan'},
                      {key:'eta', header:'Estimasi'},
                      {key:'status', header:'Status'},
                      {key:'proof', header:'Bukti', render:(v)=> v? <a href="#" className="text-[#F24AA7]">Lihat</a> : '-' },
                      {key:'action', header:'Aksi', render:(_,row)=> can(role,'instantPayout') ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={()=>setToast({open:true,type:'success',message:'Dibayar instan'})}>Cairkan Sekarang</Button>
                          <Button size="sm" variant="secondary">Approve</Button>
                          <Button size="sm" variant="tertiary">Reject</Button>
                        </div>
                      ) : '-'},
                    ]}
                    data={payouts}
                  />
                </Card>
              )}
            </Section>

            <Section when={current==='products' && can(role,'manageProducts')}>
              <Card variant="bento" tone="cream">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Kelola Produk</h3>
                  <Button><Plus className="h-4 w-4" /> Tambah Produk</Button>
                </div>
                <Table
                  columns={[
                    {key:'name', header:'Produk'},
                    {key:'price', header:'Harga', render:(v,row)=> `${formatRp(row.price)}/${row.cycle}`},
                    {key:'action', header:'Aksi', render:()=> <Button size="sm" variant="secondary">Edit</Button> },
                  ]}
                  data={products}
                />
              </Card>
            </Section>

            <Section when={current==='system' && can(role,'systemView')}>
              <div className="grid grid-cols-12 gap-4">
                <Card variant="bento" tone="mint" className="col-span-12 md:col-span-4">
                  <h3 className="font-semibold mb-1">Uptime</h3>
                  <p className="text-sm text-slate-700">99.97% 30 hari</p>
                </Card>
                <Card variant="bento" tone="pink" className="col-span-12 md:col-span-4">
                  <h3 className="font-semibold mb-1">Incidents</h3>
                  <p className="text-sm text-slate-700">2 open • 14 resolved</p>
                </Card>
                <Card variant="bento" tone="blue" className="col-span-12 md:col-span-4">
                  <h3 className="font-semibold mb-1">Webhook Status</h3>
                  <p className="text-sm text-slate-700">Normal • 0 retry queued</p>
                </Card>
              </div>
            </Section>

            <Section when={current==='logs' && can(role,'viewLogs')}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Select aria-label="Kategori">
                    <option>Semua</option>
                    <option>Sale</option>
                    <option>Payment</option>
                    <option>Refund</option>
                    <option>System</option>
                  </Select>
                  <Input placeholder="Keyword" />
                  <Input type="date" />
                  <Input type="date" />
                </div>
                <div className="flex items-center gap-2">
                  {(role!=='Reseller') && <Button variant="secondary"><Download className="h-4 w-4" /> Export</Button>}
                </div>
              </div>
              <Card variant="bento" tone="cream">
                <div className="space-y-3">
                  {logs.map((l,idx)=> (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="text-xs text-slate-600 w-44">{l.time}</div>
                      <Badge color="default">{l.cat}</Badge>
                      <div className="flex-1">
                        <span className="font-medium">{l.actor}</span> — <span className="text-slate-700">{l.desc}</span> <a href="#" className="text-[#F24AA7]">{l.ref}</a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Table
                    columns={[
                      {key:'time', header:'Waktu'},
                      {key:'cat', header:'Kategori'},
                      {key:'actor', header:'Aktor'},
                      {key:'desc', header:'Deskripsi'},
                      {key:'ref', header:'Terkait'},
                    ]}
                    data={logs}
                  />
                </div>
              </Card>
            </Section>

            <Section when={current==='users' && can(role,'manageUsers')}>
              <Card variant="bento" tone="cream">
                <h3 className="font-semibold mb-2">Role & Permissions</h3>
                <p className="text-sm text-slate-600">Kelola akses peran dan kebijakan pencairan (default T+5).</p>
                <div className="mt-3 flex items-center gap-2">
                  <Select>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </Select>
                  <Select>
                    <option>Kebijakan Pencairan: T+5</option>
                    <option>Instant</option>
                  </Select>
                  <Button variant="secondary">Simpan</Button>
                </div>
              </Card>
            </Section>

            <Section when={current==='settings' && (can(role,'settings') || role==='Reseller')}>
              <Card variant="bento" tone="cream">
                <h3 className="font-semibold mb-2">Settings</h3>
                <p className="text-sm text-slate-600">Preferensi akun dan kebijakan platform.</p>
              </Card>
            </Section>
          </main>
        </div>
      </div>

      <Drawer open={!!drawerTx} onClose={()=>setDrawerTx(null)} title="Detail Transaksi">
        {drawerTx && (
          <div>
            <div className="mb-4">
              <div className="font-semibold">{drawerTx.product} — {drawerTx.trx}</div>
              <div className="text-sm text-slate-600">{drawerTx.datetime} • {drawerTx.method}</div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Ringkasan</h4>
                <p className="text-sm">Reseller: {drawerTx.reseller || '-'} • Pembeli: {drawerTx.buyer}</p>
                <p className="text-sm">Harga: {formatRp(drawerTx.price)} • Status: {drawerTx.status}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pembayaran</h4>
                <p className="text-sm">Auto payment: sukses (QRIS), captured 2.1s.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Log</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Order dibuat</li>
                  <li>Gateway QRIS dikirim</li>
                  <li>Webhook diterima • status Paid</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={modalPayout} onClose={()=>setModalPayout(false)} title="Ajukan Pencairan">
        <div className="space-y-3">
          <Input type="number" placeholder="Amount (Rp)" />
          <Input placeholder="Rekening/e-Wallet" />
          <Input placeholder="Catatan (opsional)" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={()=>setModalPayout(false)}>Batal</Button>
          <Button onClick={()=>{ setModalPayout(false); setToast({open:true,type:'success',message:'Pengajuan dikirim. Pastikan detail rekening benar. Tindakan ini tidak dapat dibatalkan.'}) }}>Kirim</Button>
        </div>
      </Modal>

      <Toast open={toast.open} type={toast.type} message={toast.message} />
    </div>
  )
}
