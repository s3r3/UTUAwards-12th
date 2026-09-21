import type { LucideIcon } from 'lucide-react'

export default function UserMetricCard({ label, value, icon: Icon, tone = 'emerald', hint }: {
  label: string
  value: string
  icon: LucideIcon
  tone?: 'emerald' | 'amber' | 'rose' | 'ocean'
  hint?: string
}) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
    ocean: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  }
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className={`mb-4 inline-flex rounded-xl p-3 ${tones[tone]}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <p className="text-3xl font-bold text-gray-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      {hint && <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  )
}
