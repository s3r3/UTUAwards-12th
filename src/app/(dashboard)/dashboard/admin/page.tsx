'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Users, Shield, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useSession } from 'next-auth/react'
import RevenueTrendChart from '@/components/admin/RevenueTrendChart'

// Metric Card Component
function MetricCard({
  value,
  label,
  icon: Icon,
  trend = 0,
  loading = false,
  accent = 'emerald'
}: {
  value: string | number
  label: string
  icon: React.ElementType
  trend?: number
  loading?: boolean
  accent?: 'emerald' | 'ocean' | 'amber' | 'rose'
}) {
  const colors = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    ocean: 'text-ocean-600 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-900/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
  }
  const colorClass = colors[accent] || colors.emerald

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-xl p-3 ${colorClass}`}>
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Icon size={24} />}
        </div>
        {trend !== 0 && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
            'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
          }`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {loading ? '--' : value}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  )
}

// Action Card Component
function ActionCard({
  title,
  count,
  href,
  icon: Icon,
  loading = false
}: {
  title: string
  count: number
  href: string
  icon: React.ElementType
  loading?: boolean
}) {
  const t = useTranslations()
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 transition-shadow hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 group"
    >
      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{loading ? '--' : count} {t.admin.pendingSuffix}</p>
      </div>
      <ArrowRight size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
    </Link>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    PROCESSING: 'bg-ocean-100 text-ocean-800 dark:bg-ocean-900/20 dark:text-ocean-300',
    SHIPPING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    CANCELLED: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
  }

  const statusMap: Record<string, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPING: 'Shipping',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    FAILED: 'Failed',
    COMPLETED: 'Completed',
  }

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
      {statusMap[status] || status}
    </span>
  )
}

// Recent Order Row Component
function OrderRow({ order }: { order: RecentOrder }) {
  const t = useTranslations()

  return (
    <tr className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">
        {order.id?.slice(0, 8) || '--'}
      </td>
      <td className="p-4 text-gray-900 dark:text-gray-100">
        {order.user?.name || order.customerName || 'Unknown'}
      </td>
      <td className="p-4 text-gray-600 dark:text-gray-400">
        {order.items?.length || 0} items
      </td>
      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
        {t.common.currency} {order.total?.toLocaleString() || '0'}
      </td>
      <td className="p-4">
        <StatusBadge status={order.status || 'PENDING'} />
      </td>
      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
      </td>
      <td className="p-4">
        <Link
          href={`/dashboard/admin/orders/${order.id}`}
          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          View
        </Link>
      </td>
    </tr>
  )
}

// Empty State Component
function EmptyState({ message, description }: { message: string; description?: string }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="mb-4">
        <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{message}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  )
}

// Loading Skeleton for Table
function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-200 dark:border-gray-800">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Main Admin Dashboard Component
interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingProducts: number
  pendingPartners: number
  pendingOrders: number
}

interface AdminOrderItem {
  quantity?: number
  price?: number
  product?: { name?: string; image?: string | null } | null
}

interface AdminOrderLike {
  id: string
  user?: { name: string } | null
  address?: { name: string } | null
  customerName?: string
  items?: AdminOrderItem[]
  total?: number
  status: string
  createdAt: string
}

interface RecentOrder {
  id: string
  user?: { name: string }
  customerName?: string
  items?: AdminOrderItem[]
  total: number
  status: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all necessary data in parallel
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch('/api/orders?status='),
          fetch('/api/products?status=PENDING'),
          fetch('/api/users'),
        ])

        // Parse responses
        const ordersData = (await ordersRes.json()) as { success: boolean; data: AdminOrderLike[] }
        const productsData = (await productsRes.json()) as { success: boolean; data: unknown[] }

        const allOrders: AdminOrderLike[] = ordersData.success ? ordersData.data : []
        const pendingProducts = productsData.success ? productsData.data.length : 0

        // Calculate stats
        const totalRevenue = allOrders.reduce((sum: number, order) => sum + (order.total || 0), 0)
        const totalOrders = allOrders.length

        // Get recent 5 orders
        const recent: RecentOrder[] = allOrders.slice(0, 5).map((order) => ({
          id: order.id,
          user: order.user ?? undefined,
          customerName: order.address?.name || order.user?.name,
          items: order.items,
          total: order.total || 0,
          status: order.status,
          createdAt: order.createdAt,
        }))

        // Mock data for users and partners (to be replaced with real API)
        // TODO: Implement /api/admin/stats for real counts
        const mockTotalProducts = 150
        const mockTotalUsers = 2450
        const mockPendingPartners = 12
        const mockPendingOrders = allOrders.filter((o) => o.status === 'PENDING').length

        setStats({
          totalRevenue,
          totalOrders,
          totalProducts: mockTotalProducts,
          totalUsers: mockTotalUsers,
          pendingProducts,
          pendingPartners: mockPendingPartners,
          pendingOrders: mockPendingOrders,
        })
        setRecentOrders(recent)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError(t.admin.loadFailed)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  // Navigation items for quick access
  const navItems = [
    { href: '/dashboard/admin/orders', label: t.dashboard.adminOrders, icon: ShoppingBag },
    { href: '/dashboard/admin/products', label: t.dashboard.adminProducts, icon: Package },
    { href: '/dashboard/admin/users', label: t.dashboard.adminUsers, icon: Users },
  ]

  if (!isAdmin) {
    return (
      <div className="py-12">
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100"> {t.admin.accessDenied}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t.admin.accessDeniedDesc}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between min-w-0">
        <div className="flex items-center min-w-0">
          <h1 className="text-2xl font-bold truncate min-w-0 text-gray-900 dark:text-gray-100">
            <Shield size={24} className="mr-2 inline-block shrink-0 text-emerald-600 dark:text-emerald-400" />
            {t.dashboard.adminPanel}
          </h1>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.admin.welcomeBack} {session?.user?.name || 'Admin'}
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
          <p className="text-rose-700 dark:text-rose-300 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
          >
            {t.admin.retry}
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          value={loading ? '--' : (stats?.totalRevenue?.toLocaleString() || '0')}
          label={t.admin.metricRevenue}
          icon={TrendingUp}
          trend={24}
          loading={loading}
          accent="emerald"
        />
        <MetricCard
          value={loading ? '--' : (stats?.totalOrders?.toLocaleString() || '0')}
          label={t.admin.metricOrders}
          icon={ShoppingBag}
          trend={12}
          loading={loading}
          accent="ocean"
        />
        <MetricCard
          value={loading ? '--' : (stats?.totalProducts?.toLocaleString() || '0')}
          label={t.admin.metricProducts}
          icon={Package}
          trend={8}
          loading={loading}
          accent="amber"
        />
        <MetricCard
          value={loading ? '--' : (stats?.totalUsers?.toLocaleString() || '0')}
          label={t.admin.metricUsers}
          icon={Users}
          trend={18}
          loading={loading}
          accent="rose"
        />
      </div>

      {/* Action Center */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.admin.actionRequired}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title={t.admin.pendingProducts}
            count={loading ? 0 : (stats?.pendingProducts || 0)}
            href="/dashboard/admin/products?status=PENDING"
            icon={Package}
            loading={loading}
          />
          <ActionCard
            title={t.admin.pendingPartners}
            count={loading ? 0 : (stats?.pendingPartners || 0)}
            href="/dashboard/admin/partners"
            icon={Shield}
            loading={loading}
          />
          <ActionCard
            title={t.admin.ordersAttention}
            count={loading ? 0 : (stats?.pendingOrders || 0)}
            href="/dashboard/admin/orders?status=PENDING"
            icon={AlertTriangle}
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.admin.quickAccess}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 transition-shadow hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 group min-w-0"
            >
              <div className="rounded-xl bg-primary-100 dark:bg-primary-900/20 p-3 text-primary-600 dark:text-primary-400 shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30 transition-colors">
                <item.icon size={24} />
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.admin.recentOrders}</h2>
          <Link
            href="/dashboard/admin/orders"
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            {t.admin.viewAll}
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : recentOrders.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              message={t.admin.noRecentOrders}
              description={t.admin.noRecentOrdersDesc}
            />
          )}
        </div>
      </div>

      {/* Business Overview Chart Placeholder */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t.admin.businessOverview}</h2>
        </div>
        <RevenueTrendChart loading={loading} />
      </div>

    </div>
  )
}
