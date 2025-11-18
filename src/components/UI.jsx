import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const tokens = {
  radius: 'rounded-xl',
  shadow: 'shadow-[0_8px_30px_rgba(2,6,23,0.15)]',
  cardBg: 'bg-white dark:bg-slate-800',
  border: 'border border-slate-200 dark:border-slate-700',
  text: 'text-slate-800 dark:text-slate-100',
  muted: 'text-slate-500 dark:text-slate-400',
  accent: 'text-teal-600 dark:text-teal-400',
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
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  const variants = {
    primary: 'bg-teal-600 hover:bg-teal-700 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
    tertiary: 'bg-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/60 text-teal-700 dark:text-teal-300',
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
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    refunded: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    role: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  }
  return (
    <span className={cx('inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full', colors[color], className)}>
      {children}
    </span>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={cx(tokens.cardBg, tokens.border, tokens.radius, tokens.shadow, 'p-4', className)}>
      {children}
    </div>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={cx('w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500', className)}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={cx('w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500', className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <span className="relative inline-flex h-5 w-9 items-center">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <span className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-full transition" />
        <span className={cx('absolute h-4 w-4 bg-white rounded-full shadow transition', checked ? 'translate-x-5' : 'translate-x-1')} />
      </span>
      {label && <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>}
    </label>
  )
}

export function Table({ columns = [], data = [], onRowClick, empty, loading, error }) {
  return (
    <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
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
                <tr key={idx} className={cx('hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer')}
                  onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
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
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className={cx(tokens.cardBg, tokens.border, tokens.radius, 'relative w-full max-w-lg p-6 mx-4')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <div className="text-slate-700 dark:text-slate-200">{children}</div>
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
      <div className={cx('absolute inset-0 bg-slate-900/60 transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div ref={panelRef} className={cx(tokens.cardBg, tokens.border, 'absolute right-0 top-0 h-full w-full sm:w-[480px] p-6 transition-transform', open ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
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
  return <div className={cx('animate-pulse rounded-md bg-slate-200 dark:bg-slate-700', className)} />
}

export function Toast({ open, type = 'success', message }){
  if(!open) return null
  const styles = type==='success' ? 'bg-teal-600' : 'bg-rose-600'
  return (
    <div className={cx('fixed bottom-6 right-6 px-4 py-3 text-white rounded-lg shadow-lg', styles)}>
      {message}
    </div>
  )
}
