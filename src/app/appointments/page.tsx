'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useAuth } from '@/hooks/useAuth'

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ patientId: '', appointmentDate: '', notes: '' })

  const fetchAppointments = () => {
    const query = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
    fetch(`/api/appointments${query}`)
      .then(r => r.json())
      .then(data => setAppointments(data.appointments || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user) return
    fetchAppointments()
    fetch('/api/patients').then(r => r.json()).then(d => setPatients(d.patients || []))
  }, [user, statusFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, patientId: Number(form.patientId) })
    })
    setSaving(false)
    setShowModal(false)
    setForm({ patientId: '', appointmentDate: '', notes: '' })
    fetchAppointments()
  }

  const handleCancel = async (id: number) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    })
    fetchAppointments()
  }

  const columns = [
    { key: 'appointmentDate', label: 'Date & Time', render: (v: string) => new Date(v).toLocaleString() },
    { key: 'patient', label: 'Patient', render: (_: any, row: any) => `${row.patient.firstName} ${row.patient.lastName}` },
    { key: 'patient', label: 'Student ID', render: (_: any, row: any) => row.patient.studentId },
    { key: 'notes', label: 'Notes', render: (v: string) => v || '—' },
    {
      key: 'status', label: 'Status',
      render: (v: string) => {
        const colors: any = { scheduled: 'badge-info', completed: 'badge-success', cancelled: 'badge-danger' }
        return <span className={`badge ${colors[v] || 'badge-info'}`}>{v}</span>
      }
    },
    {
      key: 'actions', label: 'Actions',
      render: (_: any, row: any) => row.status === 'scheduled' ? (
        <button onClick={() => handleCancel(row.id)} className="text-red-500 hover:text-red-600 font-medium text-sm">Cancel</button>
      ) : null
    }
  ]

  if (authLoading) return null

  return (
    <DashboardLayout title="Appointments" userName={user?.name} userRole={user?.role}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Appointments</h1>
          <p className="text-gray-600">Schedule and track patient appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary w-fit">+ Schedule Appointment</button>
      </div>

      <div className="card mb-6 flex gap-2">
        {['all', 'scheduled', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments ({appointments.length})</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Table columns={columns} data={appointments} />
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Appointment"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Schedule'}</button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="form-label">Patient *</label>
            <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} className="form-select" required>
              <option value="">Select Patient</option>
              {patients.map((p: any) => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.studentId}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Date & Time *</label>
            <input type="datetime-local" value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} className="form-input" required />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="form-textarea" rows={3} />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
