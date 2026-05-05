'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function RatingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [ratings, setRatings] = useState<any[]>([])
  const [average, setAverage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/ratings')
      .then(r => r.json())
      .then(data => {
        setRatings(data.ratings || [])
        setAverage(data.average || 0)
        setTotal(data.total || 0)
      })
      .finally(() => setLoading(false))
  }, [user])

  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratings.filter(r => r.score === star).length,
    pct: total ? Math.round((ratings.filter(r => r.score === star).length / total) * 100) : 0,
  }))

  if (authLoading) return null

  return (
    <DashboardLayout title="System Ratings" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">System Ratings</h1>
        <p className="text-gray-600">User feedback and satisfaction scores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-l-4 border-yellow-400 flex items-center gap-4">
          <div className="text-5xl font-bold text-yellow-500">{average || '—'}</div>
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-lg ${s <= Math.round(average) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-primary-500">
          <p className="text-sm text-gray-500 mb-1">Total Ratings</p>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="card border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Positive (4–5 ★)</p>
          <p className="text-3xl font-bold text-gray-900">
            {total ? Math.round((ratings.filter(r => r.score >= 4).length / total) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">{star} ★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-yellow-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm text-gray-500 w-16 text-right">{count} ({pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : ratings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No ratings yet</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {ratings.map(r => (
                <div key={r.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{r.user?.name || 'Unknown'}</span>
                      <span className="text-xs text-gray-400 capitalize">{r.user?.role}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-sm ${s <= r.score ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-xs text-gray-600 mt-1">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
