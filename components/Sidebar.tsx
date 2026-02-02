'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaChartPie, FaUsers, FaGamepad, FaWifi, FaSignOutAlt, FaUserCircle, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Overview', icon: <FaChartPie /> },
    { path: '/learners', label: 'Learners', icon: <FaUsers /> },
    { path: '/games', label: 'Game Center', icon: <FaGamepad /> },
    { path: '/devices', label: 'Sensors', icon: <FaWifi /> },
  ]

  const isActive = (path: string) => pathname.startsWith(path)

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-accent rounded-lg text-white hover:bg-secondary transition-all"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-surface-light to-surface border-r border-accent/10 flex flex-col transition-all duration-300 z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-8 border-b border-accent/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <FaChartPie className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sensory</h1>
              <p className="text-xs text-accent font-semibold">PALETTE</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-accent/10">
          <div className="bg-surface-lighter/50 border border-accent/20 rounded-lg p-4 backdrop-blur-sm hover:bg-surface-lighter/70 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <FaUserCircle className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Admin User</p>
                <p className="text-xs text-accent">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.path)
              const hovered = hoveredItem === item.path

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setIsOpen(false)}
                  className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-glow'
                      : 'text-muted hover:text-white hover:bg-surface-lighter/50'
                  }`}
                >
                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-accent to-secondary rounded-r-lg shadow-glow"></div>
                  )}

                  {/* Icon */}
                  <span className={`text-lg transition-transform ${active ? 'text-white scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className={`font-semibold transition-all ${active ? 'font-bold' : 'group-hover:translate-x-1'}`}>
                    {item.label}
                  </span>

                  {/* Hover Indicator */}
                  {hovered && !active && (
                    <div className="absolute right-0 w-1 h-4 bg-accent rounded-l-lg opacity-50"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Admin Section */}
        <div className="p-6 border-t border-accent/10 space-y-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-accent transition-all hover:bg-surface-lighter/50"
          >
            <FaUserCircle /> Admin Panel
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all font-semibold"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        ></button>
      )}

      {/* Main Content Offset */}
      <div className="hidden md:block md:w-80"></div>
    </>
  )
}
