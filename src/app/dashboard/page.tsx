'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({ totalPatients: 0, todayAppointments: 0, totalRecords: 0, pendingAppointments: 0 })
  const [recentPatients, setRecentPatients] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch('/api/reports?type=overview').then(r => r.json()),
      fetch('/api/patients?limit=5').then(r => r.json()),
      fetch('/api/appointments?status=scheduled&limit=5').then(r => r.json()),
    ]).then(([reportData, patientsData, aptsData]) => {
      if (reportData?.overview) setStats({
        totalPatients: reportData.overview.totalPatients,
        todayAppointments: reportData.overview.todayAppointments,
        totalRecords: reportData.overview.totalRecords,
        pendingAppointments: reportData.overview.pendingAppointments,
      })
      if (patientsData?.patients) setRecentPatients(
        patientsData.patients.slice(0, 5).map((p: any) => ({
          id: p.id,
          studentId: p.studentId,
          name: `${p.firstName} ${p.lastName}`,
          gender: p.gender,
          phone: p.phone,
          date: p.createdAt,
        }))
      )
      if (aptsData?.appointments) setUpcomingAppointments(
        aptsData.appointments.slice(0, 5).map((a: any) => ({
          id: a.id,
          patient: `${a.patient.firstName} ${a.patient.lastName}`,
          date: a.appointmentDate,
          status: a.status,
          notes: a.notes || '—',
        }))
      )
    }).finally(() => setLoading(false))
  }, [user])

  const patientColumns = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'name', label: 'Patient Name' },
    { key: 'gender', label: 'Gender', render: (v: string) => <span className={`badge ${v === 'Male' ? 'badge-info' : 'badge-primary'}`}>{v}</span> },
    { key: 'phone', label: 'Phone' },
    { key: 'date', label: 'Registered', render: (v: string) => new Date(v).toLocaleDateString() },
  ]

  const appointmentColumns = [
    { key: 'date', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'patient', label: 'Patient' },
    { key: 'notes', label: 'Notes' },
    { key: 'status', label: 'Status', render: (v: string) => <span className="badge badge-info">{v}</span> },
  ]

  if (authLoading || loading) return (
    <DashboardLayout title="Dashboard" userName="Loading..." userRole="">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Dashboard" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 text-lg">Here's an overview of the clinic's activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={stats.totalPatients.toString()} color="blue"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard title="Today's Appointments" value={stats.todayAppointments.toString()} color="green"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard title="Medical Records" value={stats.totalRecords.toString()} color="purple"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard title="Pending Appointments" value={stats.pendingAppointments.toString()} color="orange"
          icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Patients</h3>
            <a href="/patients" className="text-sm text-primary-600 hover:text-primary-700 font-bold">View All →</a>
          </div>
          <Table columns={patientColumns} data={recentPatients} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Appointments</h3>
            <a href="/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-bold">View All →</a>
          </div>
          <Table columns={appointmentColumns} data={upcomingAppointments} />
        </div>
      </div>
    </DashboardLayout>
  )
}
