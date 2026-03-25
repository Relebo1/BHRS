'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AddPatientPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    phone: '',
    address: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error || 'Failed to save patient')
      return
    }

    router.push(`/patients/${data.patient.id}`)
  }

  if (authLoading) return null

  return (
    <DashboardLayout title="Add Patient" userName={user?.name} userRole={user?.role}>
      <div className="mb-8">
        <Link href="/patients" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Patients
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Patient</h1>
        <p className="text-gray-600">Fill in the student's details to register them as a patient</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Student ID *</label>
                  <input type="text" name="studentId" value={form.studentId} onChange={handleChange}
                    className="form-input" placeholder="STU001" required />
                </div>
                <div>
                  <label className="form-label">Gender *</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">First Name *</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    className="form-input" placeholder="Thabo" required />
                </div>
                <div>
                  <label className="form-label">Last Name *</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    className="form-input" placeholder="Mokoena" required />
                </div>
                <div>
                  <label className="form-label">Date of Birth *</label>
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                    className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="form-input" placeholder="+267 71234567" required />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    className="form-textarea" rows={3} placeholder="Block 8, Gaborone" required />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="card bg-blue-50 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All fields marked with * are required</li>
                <li>• Student ID must be unique</li>
                <li>• Use the international phone format</li>
              </ul>
            </div>
            <div className="card">
              <div className="space-y-3">
                <button type="submit" className="w-full btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Patient'}
                </button>
                <Link href="/patients" className="w-full btn btn-secondary block text-center">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}
