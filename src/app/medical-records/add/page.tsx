'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function AddMedicalRecordForm() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [form, setForm] = useState({
    patientId: searchParams.get('patientId') || '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    visitDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (!user) return
    fetch('/api/patients').then(r => r.json()).then(d => setPatients(d.patients || []))
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/medical-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, patientId: Number(form.patientId) }),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error || 'Failed to save record'); return }
    router.push('/medical-records')
  }

  if (authLoading) return null

  return (
    <DashboardLayout title="Add Medical Record" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <Link href="/medical-records" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Medical Records
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Medical Record</h1>
        <p className="text-gray-600">Record a new patient visit</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="form-label">Patient *</label>
              <select name="patientId" value={form.patientId}
                onChange={e => setForm({ ...form, patientId: e.target.value })}
                className="form-select" required>
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} — {p.studentId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Visit Date *</label>
              <input type="date" value={form.visitDate}
                onChange={e => setForm({ ...form, visitDate: e.target.value })}
                className="form-input" required />
            </div>
            <div>
              <label className="form-label">Diagnosis *</label>
              <textarea value={form.diagnosis}
                onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                className="form-textarea" rows={3} required />
            </div>
            <div>
              <label className="form-label">Treatment *</label>
              <textarea value={form.treatment}
                onChange={e => setForm({ ...form, treatment: e.target.value })}
                className="form-textarea" rows={3} required />
            </div>
            <div>
              <label className="form-label">Prescription</label>
              <textarea value={form.prescription}
                onChange={e => setForm({ ...form, prescription: e.target.value })}
                className="form-textarea" rows={3} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Record'}
              </button>
              <Link href="/medical-records" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>

        <div className="card bg-blue-50 border border-blue-100 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Select the correct patient before saving</li>
            <li>• Diagnosis and treatment are required</li>
            <li>• Prescription can be left blank if none given</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AddMedicalRecordPage() {
  return (
    <Suspense>
      <AddMedicalRecordForm />
    </Suspense>
  )
}
