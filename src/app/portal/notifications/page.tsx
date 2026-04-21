'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalLayout from '../PortalLayout'

const typeIcon: Record<string, string> = {
  appointment: '📅',
  message: '💬',
  patient: '👤',
  info: 'ℹ️',
  alert: '⚠️',
}

export default function PatientNotifications() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUser(d.user)
    })
    fetchNotifications()
  }, [router])

  const fetchNotifications = () => {
    fetch('/api/notifications').then(r => r.json()).then(d => {
      setNotifications(d.notifications || [])
      setLoading(false)
    })
  }

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    fetchNotifications()
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <PortalLayout user={user}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔔 Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-500 mt-1">{unread} unread notification{unread > 1 ? 's' : ''}</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary-600 font-medium hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔔</div>
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n: any) => (
              <div key={n.id} className={`flex items-start gap-4 p-5 transition-colors ${n.read ? '' : 'bg-blue-50/50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${n.read ? 'bg-gray-100' : 'bg-primary-100'}`}>
                  {typeIcon[n.type] || 'ℹ️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
