'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PortalLayout from './PortalLayout'
import Link from 'next/link'

const CalendarIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const BellIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
const BotIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
const ChatIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>

export default function PatientPortal() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/appointments').then(r => r.json()),
      fetch('/api/notifications').then(r => r.json()),
    ]).then(([userData, aptsData, notifData]) => {
      if (!userData.user) { router.push('/login'); return }
      setUser(userData.user)
      setAppointments(aptsData.appointments?.slice(0, 3) || [])
      setNotifications(notifData.notifications?.slice(0, 3) || [])
    }).finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )

  const upcoming = appointments.filter(a => a.status === 'scheduled')

  const statCards = [
    { label: 'Upcoming Appointments', value: upcoming.length, icon: <CalendarIcon />, color: 'blue', href: '/portal/appointments' },
    { label: 'Unread Notifications', value: notifications.filter((n: any) => !n.read).length, icon: <BellIcon />, color: 'purple', href: '/portal/notifications' },
    { label: 'Health Assistant', value: 'Ask Now', icon: <BotIcon />, color: 'green', href: '/portal/ai-chat' },
  ]

  const quickActions = [
    { label: 'Book Appointment', href: '/portal/appointments', icon: <CalendarIcon /> },
    { label: 'Message Nurse', href: '/portal/messages', icon: <ChatIcon /> },
    { label: 'Health Assistant', href: '/portal/ai-chat', icon: <BotIcon /> },
    { label: 'Notifications', href: '/portal/notifications', icon: <BellIcon /> },
  ]

  return (
    <PortalLayout user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">Here's your health portal overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {statCards.map(card => (
          <Link key={card.label} href={card.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-${card.color}-100 rounded-xl flex items-center justify-center text-${card.color}-600`}>
                {card.icon}
              </div>
              <span className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Upcoming Appointments</h3>
            <Link href="/portal/appointments" className="text-sm text-primary-600 font-medium hover:underline">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><CalendarIcon /></div>
              <p className="text-gray-500 text-sm mb-3">No upcoming appointments</p>
              <Link href="/portal/appointments" className="text-primary-600 text-sm font-medium hover:underline">Book one now →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt: any) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0"><CalendarIcon /></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{new Date(apt.appointmentDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <p className="text-xs text-gray-500">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Notifications</h3>
            <Link href="/portal/notifications" className="text-sm text-primary-600 font-medium hover:underline">View all →</Link>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><BellIcon /></div>
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n: any) => (
                <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'bg-gray-50 border-gray-100' : 'bg-purple-50 border-purple-100'}`}>
                  <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href}
              className="bg-white/20 hover:bg-white/30 rounded-xl p-4 text-center transition-all hover:-translate-y-0.5">
              <div className="flex justify-center mb-2">{action.icon}</div>
              <p className="text-xs font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </PortalLayout>
  )
}
