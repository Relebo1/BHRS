'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AddAppointmentPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [form, setForm] = useState({
    patientId: '',
    appointmentDate: '',
    status: 'scheduled',
    notes: '',
  })

  useEffect(() => {
    if (!user) return
    fetch('/api/patients').then(r => r.json()).then(d => setPatients(d.patients || []))
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, patientId: Number(form.patientId) }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error || 'Failed to create appointment'); return }
    router.push('/appointments')
  }

  if (authLoading) return null

  return (
    <DashboardLayout title="Schedule Appointment" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <Link href="/appointments" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Appointments
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Schedule Appointment</h1>
        <p className="text-gray-600">Book a new patient appointment</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="form-label">Patient *</label>
              <select value={form.patientId}
                onChange={e => setForm({ ...form, patientId: e.target.value })}
                className="form-select" required>
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.studentId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Date & Time *</label>
              <input type="datetime-local" value={form.appointmentDate}
                onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                className="form-input" required />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="form-select">
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="form-label">Notes</label>
              <textarea value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="form-textarea" rows={3} placeholder="Reason for visit or special instructions" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Schedule Appointment'}
              </button>
              <Link href="/appointments" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>

        <div className="card bg-blue-50 border border-blue-100 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Select the correct patient</li>
            <li>• Set the exact date and time</li>
            <li>• Add notes for the attending doctor</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
