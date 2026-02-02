'use client'

import { useState } from 'react'
import { FaUsers, FaSearch, FaFilter, FaStar, FaUserPlus } from 'react-icons/fa'

interface Learner {
  id: number
  name: string
  diagnosis: string
  status: 'active' | 'idle' | 'inactive'
  progress: number
  joinDate: string
  rating: number
}

export default function LearnersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle'>('all')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const learners: Learner[] = [
    { id: 1, name: 'Alex Johnson', diagnosis: 'ASD', status: 'active', progress: 78, joinDate: '2024-01-15', rating: 4.5 },
    { id: 2, name: 'Sarah Williams', diagnosis: 'ADHD', status: 'active', progress: 92, joinDate: '2024-01-10', rating: 4.8 },
    { id: 3, name: 'Marcus Brown', diagnosis: 'Dyslexia', status: 'idle', progress: 45, joinDate: '2024-02-01', rating: 3.9 },
    { id: 4, name: 'Emma Davis', diagnosis: 'ASD', status: 'active', progress: 88, joinDate: '2023-12-20', rating: 4.7 },
    { id: 5, name: 'James Wilson', diagnosis: 'ADHD', status: 'active', progress: 65, joinDate: '2024-01-25', rating: 4.2 },
    { id: 6, name: 'Olivia Martinez', diagnosis: 'Dyspraxia', status: 'active', progress: 81, joinDate: '2024-01-12', rating: 4.6 },
  ]

  const filteredLearners = learners.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getDiagnosisColor = (diagnosis: string) => {
    const colors: Record<string, string> = {
      'ASD': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'ADHD': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Dyslexia': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Dyspraxia': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    }
    return colors[diagnosis] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-surface-lighter p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-3 mb-3">
          <FaUsers className="text-accent text-3xl" />
          <h1 className="text-4xl font-bold text-white">Learners Directory</h1>
        </div>
        <p className="text-muted text-lg">Manage and monitor all enrolled students</p>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-6 mb-8 shadow-card">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search */}
          <div className="flex-1 relative group">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent/50 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search learners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface/50 border-2 border-accent/20 rounded-xl text-white placeholder-muted/30 focus:border-accent focus:shadow-glow focus:outline-none transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-3">
            {(['all', 'active', 'idle'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-glow'
                    : 'bg-surface-lighter/50 text-muted hover:text-accent border border-accent/20'
                }`}
              >
                <FaFilter size={14} /> {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <button className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-white font-semibold rounded-xl hover:shadow-glow-lg transform hover:scale-105 transition-all flex items-center gap-2">
            <FaUserPlus /> Add Learner
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-6 shadow-card game-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-accent/20">
              <th className="text-left py-4 px-4 text-accent font-semibold">Name</th>
              <th className="text-left py-4 px-4 text-accent font-semibold">Diagnosis</th>
              <th className="text-left py-4 px-4 text-accent font-semibold">Status</th>
              <th className="text-left py-4 px-4 text-accent font-semibold">Progress</th>
              <th className="text-left py-4 px-4 text-accent font-semibold">Rating</th>
              <th className="text-left py-4 px-4 text-accent font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredLearners.map((learner) => (
              <tr
                key={learner.id}
                onMouseEnter={() => setHoveredRow(learner.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`border-b border-accent/10 transition-all duration-200 cursor-pointer group ${
                  hoveredRow === learner.id ? 'bg-accent/5' : ''
                }`}
              >
                <td className="py-4 px-4 text-white font-semibold group-hover:text-accent transition-colors">
                  {learner.name}
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getDiagnosisColor(learner.diagnosis)}`}>
                    {learner.diagnosis}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
                    learner.status === 'active'
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {learner.status.charAt(0).toUpperCase() + learner.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-secondary"
                        style={{ width: `${learner.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-accent">{learner.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={i < Math.floor(learner.rating) ? 'text-yellow-400' : 'text-muted/30'}
                      />
                    ))}
                    <span className="text-sm text-accent ml-2">{learner.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-muted text-sm">{learner.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
