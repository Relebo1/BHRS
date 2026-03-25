'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar({ user }: { user: { name: string; role: string } }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold">
              BHRS
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>
              <Link href="/patients" className="hover:bg-blue-700 px-3 py-2 rounded">
                Patients
              </Link>
              <Link href="/medical-records" className="hover:bg-blue-700 px-3 py-2 rounded">
                Medical Records
              </Link>
              <Link href="/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">
                Appointments
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin/users" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
