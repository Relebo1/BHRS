'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  title: string
  userName?: string
  userRole?: string
}

export default function Header({ title, userName = '', userRole = '' }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/appointments?status=scheduled')
      .then(r => r.json())
      .then(data => setNotifications((data.appointments || []).slice(0, 5)))
      .catch(() => {})
  }, [])

  return (
    <header className="h-20 bg-white border-b-2 border-gray-100 fixed top-0 right-0 left-72 z-30 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">Botho University Clinic — Electronic Medical Records</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Upcoming Appointments</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{notifications.length} scheduled</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No upcoming appointments</p>
                  ) : (
                    notifications.map((apt: any) => (
                      <div key={apt.id} className="p-4 hover:bg-primary-50 transition-all cursor-pointer border-b border-gray-50">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(apt.appointmentDate).toLocaleString()}
                            </p>
                            {apt.notes && <p className="text-xs text-gray-400 mt-0.5">{apt.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <a href="/appointments" className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 py-1">
                    View All Appointments →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
