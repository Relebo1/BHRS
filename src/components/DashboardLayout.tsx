import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  userName?: string
  userRole?: string
}

export default function DashboardLayout({ children, title, userName, userRole }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar userRole={userRole} />
      <Header title={title} userName={userName} userRole={userRole} />
      <main className="ml-72 pt-20">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
