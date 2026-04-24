'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Table from '@/components/Table'
import { useAuth } from '@/hooks/useAuth'
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function MedicalRecordsPage() {
  const { user, loading: authLoading } = useAuth()
  const [records, setRecords] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch('/api/medical-records')
      .then(r => r.json())
      .then(data => setRecords(data.records || []))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = records.filter((r: any) =>
    `${r.patient.firstName} ${r.patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    r.patient.studentId.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'visitDate', label: 'Visit Date', render: (v: string) => new Date(v).toLocaleDateString() },
    {
      key: 'patient', label: 'Patient',
      render: (_: any, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{row.patient.firstName} {row.patient.lastName}</p>
          <p className="text-sm text-gray-500">{row.patient.studentId}</p>
        </div>
      )
    },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'nurse', label: 'Nurse', render: (_: any, row: any) => row.nurse?.name || '—' },
    {
      key: 'actions', label: 'Actions',
      render: (_: any, row: any) => (
        <button onClick={() => setSelected(row)} className="text-primary-500 hover:text-primary-600 font-medium">View →</button>
      )
    }
  ]

  if (authLoading) return null

  return (
    <DashboardLayout title="Medical Records" userName={user?.name} userRole={user?.role}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Medical Records</h1>
          <p className="text-gray-600">Record and view patient visit history and treatment notes</p>
        </div>
        <Link href="/medical-records/add" className="btn btn-primary w-fit">+ Add Record</Link>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search by patient, student ID, or diagnosis..." value={search}
            onChange={e => setSearch(e.target.value)} className="form-input pl-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Records ({filtered.length})</h3>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Table columns={columns} data={filtered} />
          )}
        </div>

        <div>
          {selected ? (
            <div className="card sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Record Details</h3>
                  <p className="text-sm text-gray-600">{new Date(selected.visitDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patient</p>
                  <p className="font-medium text-gray-900">{selected.patient.firstName} {selected.patient.lastName}</p>
                  <p className="text-sm text-gray-500">{selected.patient.studentId}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">Diagnosis</p>
                  <p className="text-gray-900">{selected.diagnosis}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">Treatment</p>
                  <p className="text-gray-900">{selected.treatment}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">Prescription</p>
                  <p className="text-gray-900">{selected.prescription}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">Nurse</p>
                  <p className="text-gray-900">{selected.nurse?.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a record to view details</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
