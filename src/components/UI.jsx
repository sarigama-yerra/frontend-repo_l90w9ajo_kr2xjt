import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Soft, creamy, cute theme tokens
export const tokens = {
  radius: 'rounded-2xl',
  shadow: 'shadow-[0_10px_30px_rgba(242,74,167,0.12)]', // soft pink glow
  cardBg: 'bg-[#F7F2FA]',
  border: 'border border-[#ECDFF2]',
  text: 'text-slate-800',
  muted: 'text-slate-500',
  accent: 'text-[#F24AA7]', // hot pink accent
  ring: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F24AA7] focus-visible:ring-offset-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const base = cx('inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed', tokens.radius, tokens.ring)
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  const variants = {
    primary: 'bg-[#F24AA7] hover:bg-[#e04698] text-white',
    secondary: 'bg-[#F7F2FA] hover:bg-[#efe6f6] text-slate-800 border border-[#ECDFF2]',
    tertiary: 'bg-transparent hover:bg-[#F7F2FA] text-[#F24AA7]',
    destructive: 'bg-rose-600 hover:bg-rose-700 text-white',
  }
  return (
    <button
      className={cx(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Badge({ color = 'default', children, className = '' }) {
  const colors = {
    default: 'bg-[#F7F2FA] text-slate-700 border border-[#ECDFF2]',
    paid: 'bg-[#D5F9A9] text-emerald-800',
    pending: 'bg-[#A9D5F9] text-sky-800',
    refunded: 'bg-[#F9A8D4] text-rose-800',
    failed: 'bg-rose-100 text-rose-700',
    role: 'bg-[#A9F9CD] text-emerald-900',
  }
  return (
    <span className={cx('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full', colors[color], className)}>
      {children}
    </span>
  )
}

// Bento-ready Card with tone support
export function Card({ className = '', children, variant = 'default', tone = 'none' }) {
  const toneBg = {
    none: tokens.cardBg,
    pink: 'bg-[#F9A8D4]',
    mint: 'bg-[#A9F9CD]',
    lime: 'bg-[#D5F9A9]',
    blue: 'bg-[#A9D5F9]',
    cream: 'bg-[#F7F2FA]',
    hotpink: 'bg-[#F24AA7] text-white',
  }
  const base = variant === 'bento'
    ? cx(toneBg[tone] || toneBg.none, tokens.radius, tokens.shadow, 'p-4')
    : cx(tokens.cardBg, tokens.border, tokens.radius, tokens.shadow, 'p-4')
  return (
    <div className={cx(base, className)}>
      {children}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={cx('w-full px-3 py-2 text-sm bg-[#F7F2FA] border border-[#ECDFF2] rounded-xl placeholder:text-slate-400', tokens.ring, className)}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={cx('w-full px-3 py-2 text-sm bg-[#F7F2FA] border border-[#ECDFF2] rounded-xl', tokens.ring, className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="relative inline-flex h-6 w-11 items-center">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <span className="absolute inset-0 rounded-full transition" style={{ background: checked ? '#A9F9CD' : '#ECDFF2' }} />
        <span className={cx('absolute h-5 w-5 bg-white rounded-full shadow transition', checked ? 'translate-x-6' : 'translate-x-1')} />
      </span>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  )
}

export function Table({ columns = [], data = [], onRowClick, empty, loading, error }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ECDFF2]">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-[#ECDFF2]">
          <thead className="sticky top-0 z-10" style={{ background: '#F7F2FA' }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E7F6] bg-white">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length} className="px-4 py-6">
                    <Skeleton className="h-4 w-full" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-rose-600">{error}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-slate-500">{empty || 'No data'}</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className={cx('cursor-pointer transition-colors', 'hover:bg-[#FFF6FB]')}
                  onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className={cx('relative w-full max-w-lg p-6 mx-4', tokens.cardBg, tokens.border, tokens.radius, tokens.shadow)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <div className="text-slate-700">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, title, children }) {
  const panelRef = useRef(null)
  useEffect(() => {
    function onKey(e){ if(e.key==='Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className={cx('fixed inset-0 z-40', open ? '' : 'pointer-events-none')}
      aria-hidden={!open}>
      <div className={cx('absolute inset-0 bg-slate-900/30 transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div ref={panelRef} className={cx(tokens.cardBg, tokens.border, 'absolute right-0 top-0 h-full w-full sm:w-[480px] p-6 transition-transform', open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)] pr-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Skeleton({ className='' }){
  return <div className={cx('animate-pulse rounded-xl', 'bg-[#F0E7F6]', className)} />
}

export function Toast({ open, type = 'success', message }){
  if(!open) return null
  const styles = type==='success' ? 'bg-[#A9F9CD] text-emerald-900' : 'bg-rose-200 text-rose-900'
  return (
    <div className={cx('fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg border border-[#ECDFF2]', styles)}>
      {message}
    </div>
  )
}
