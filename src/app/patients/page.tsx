'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Table from '@/components/Table'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function PatientsPage() {
  const { user, loading: authLoading } = useAuth()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetch(`/api/patients?search=${search}`)
      .then(r => r.json())
      .then(data => setPatients(data.patients || []))
      .finally(() => setLoading(false))
  }, [user, search])

  const filtered = patients.filter((p: any) =>
    genderFilter === 'all' || p.gender.toLowerCase() === genderFilter
  )

  const columns = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'gender', label: 'Gender', render: (v: string) => <span className={`badge ${v === 'Male' ? 'badge-info' : 'badge-primary'}`}>{v}</span> },
    { key: 'phone', label: 'Phone' },
    { key: 'dateOfBirth', label: 'Date of Birth', render: (v: string) => new Date(v).toLocaleDateString() },
    {
      key: 'actions', label: 'Actions',
      render: (_: any, row: any) => (
        <Link href={`/patients/${row.id}`} className="text-primary-500 hover:text-primary-600 font-medium">View →</Link>
      )
    }
  ]

  if (authLoading) return null

  return (
    <DashboardLayout title="Patients" userName={user?.name} userRole={user?.role}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Patient Management</h1>
          <p className="text-gray-600">Register and manage clinic patients</p>
        </div>
        <Link href="/patients/add" className="btn btn-primary w-fit">+ Add New Patient</Link>
      </div>

      <div className="card mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or student ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input flex-1"
        />
        <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)} className="form-select">
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Patients ({filtered.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(row: any) => window.location.href = `/patients/${row.id}`} />
        )}
      </div>
    </DashboardLayout>
  )
}
