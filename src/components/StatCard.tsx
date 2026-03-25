import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'border-primary-500 from-primary-50 to-blue-50',
  green: 'border-green-500 from-green-50 to-emerald-50',
  purple: 'border-purple-500 from-purple-50 to-pink-50',
  orange: 'border-orange-500 from-orange-50 to-yellow-50',
}

const iconColorClasses = {
  blue: 'from-primary-500 to-primary-600',
  green: 'from-green-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
}

export default function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <div className={`stat-card bg-gradient-to-br ${colorClasses[color]} ${colorClasses[color].split(' ')[0]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-3">{value}</p>
          {trend && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${
                trend.isPositive 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {trend.isPositive ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {trend.value}
              </span>
              <span className="text-xs text-gray-500 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${iconColorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
