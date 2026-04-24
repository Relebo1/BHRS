'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
  const { user, loading: authLoading } = useAuth()
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Botho University Clinic - Report', 14, 20)
    doc.setFontSize(11)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28)

    doc.setFontSize(14)
    doc.text('Overview Statistics', 14, 40)
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Patients', reportData?.overview?.totalPatients || 0],
        ['Total Appointments', reportData?.overview?.totalAppointments || 0],
        ['Medical Records', reportData?.overview?.totalRecords || 0],
        ['Patients This Month', reportData?.overview?.patientsThisMonth || 0],
        ['Appointments This Month', reportData?.overview?.appointmentsThisMonth || 0],
      ],
    })

    doc.text('Demographics', 14, (doc as any).lastAutoTable.finalY + 10)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Gender', 'Count']],
      body: [
        ['Male', reportData?.demographics?.male || 0],
        ['Female', reportData?.demographics?.female || 0],
      ],
    })

    doc.text('Appointment Status', 14, (doc as any).lastAutoTable.finalY + 10)
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Status', 'Count']],
      body: [
        ['Scheduled', reportData?.appointments?.scheduled || 0],
        ['Completed', reportData?.appointments?.completed || 0],
        ['Cancelled', reportData?.appointments?.cancelled || 0],
      ],
    })

    doc.save(`BHRS-Report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const exportExcel = () => {
    const wb = XLSX.utils.book_new()

    const overviewData = [
      ['Metric', 'Value'],
      ['Total Patients', reportData?.overview?.totalPatients || 0],
      ['Total Appointments', reportData?.overview?.totalAppointments || 0],
      ['Medical Records', reportData?.overview?.totalRecords || 0],
      ['Patients This Month', reportData?.overview?.patientsThisMonth || 0],
      ['Appointments This Month', reportData?.overview?.appointmentsThisMonth || 0],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData)
    XLSX.utils.book_append_sheet(wb, ws1, 'Overview')

    const demographicsData = [
      ['Gender', 'Count'],
      ['Male', reportData?.demographics?.male || 0],
      ['Female', reportData?.demographics?.female || 0],
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(demographicsData)
    XLSX.utils.book_append_sheet(wb, ws2, 'Demographics')

    const appointmentsData = [
      ['Status', 'Count'],
      ['Scheduled', reportData?.appointments?.scheduled || 0],
      ['Completed', reportData?.appointments?.completed || 0],
      ['Cancelled', reportData?.appointments?.cancelled || 0],
    ]
    const ws3 = XLSX.utils.aoa_to_sheet(appointmentsData)
    XLSX.utils.book_append_sheet(wb, ws3, 'Appointments')

    XLSX.writeFile(wb, `BHRS-Report-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  useEffect(() => {
    if (!user) return
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => setReportData(data))
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading || loading) {
    return (
      <DashboardLayout title="Reports & Analytics" userName={user?.name} userRole={user?.role}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Reports & Analytics" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600 text-lg">Patient visits, appointments, and clinic statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-l-4 border-primary-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Patients</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{reportData?.overview?.totalPatients || 0}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">+{reportData?.overview?.patientsThisMonth || 0}</span> this month
          </p>
        </div>

        <div className="card border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Appointments</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{reportData?.overview?.totalAppointments || 0}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">+{reportData?.overview?.appointmentsThisMonth || 0}</span> this month
          </p>
        </div>

        <div className="card border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Medical Records</h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">{reportData?.overview?.totalRecords || 0}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-purple-600">+{reportData?.overview?.recordsThisMonth || 0}</span> this month
          </p>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Demographics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Male Patients</span>
                <span className="text-sm font-bold text-gray-900">{reportData?.demographics?.male || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((reportData?.demographics?.male || 0) / (reportData?.overview?.totalPatients || 1) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Female Patients</span>
                <span className="text-sm font-bold text-gray-900">{reportData?.demographics?.female || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((reportData?.demographics?.female || 0) / (reportData?.overview?.totalPatients || 1) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Scheduled</span>
                <span className="text-sm font-bold text-gray-900">{reportData?.appointments?.scheduled || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((reportData?.appointments?.scheduled || 0) / (reportData?.overview?.totalAppointments || 1) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Completed</span>
                <span className="text-sm font-bold text-gray-900">{reportData?.appointments?.completed || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((reportData?.appointments?.completed || 0) / (reportData?.overview?.totalAppointments || 1) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cancelled</span>
                <span className="text-sm font-bold text-gray-900">{reportData?.appointments?.cancelled || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((reportData?.appointments?.cancelled || 0) / (reportData?.overview?.totalAppointments || 1) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Patient Growth</h4>
              <span className={`badge ${reportData?.overview?.trends?.patients?.isPositive ? 'badge-success' : 'badge-danger'}`}>
                {reportData?.overview?.trends?.patients?.isPositive ? '↑' : '↓'} {reportData?.overview?.trends?.patients?.value}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{reportData?.overview?.patientsThisMonth || 0}</p>
            <p className="text-sm text-gray-600 mt-2">New patients this month</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Appointment Growth</h4>
              <span className={`badge ${reportData?.overview?.trends?.appointments?.isPositive ? 'badge-success' : 'badge-danger'}`}>
                {reportData?.overview?.trends?.appointments?.isPositive ? '↑' : '↓'} {reportData?.overview?.trends?.appointments?.value}%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{reportData?.overview?.appointmentsThisMonth || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Appointments this month</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 flex gap-4">
        <button onClick={exportPDF} className="btn btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export PDF
        </button>
        <button onClick={exportExcel} className="btn btn-secondary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Excel
        </button>
      </div>
    </DashboardLayout>
  )
}
