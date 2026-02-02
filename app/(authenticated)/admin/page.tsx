'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShield, FaTrash2, FaPlus, FaHistory, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { InputForward as Input } from '@/components/ui/Input'
import type { AdminUser, AuditLog as AuditLogType } from '@/lib/types'

interface User extends AdminUser {
  created_at: string
}

interface AuditLog extends AuditLogType {
  therapist_name: string
  activity_name: string
  first_name: string
  last_name: string
  performance_score: number
  completed_at: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [newUser, setNewUser] = useState('')
  const [newPass, setNewPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Mock data for demo
  useEffect(() => {
    setUsers([
      { id: 1, username: 'therapist_1', role: 'therapist', created_at: '2024-01-15' },
      { id: 2, username: 'therapist_2', role: 'therapist', created_at: '2024-01-20' },
      { id: 3, username: 'admin_user', role: 'admin', created_at: '2023-12-01' },
    ])
    setAuditLogs([
      { id: 1, therapist_name: 'Dr. Smith', activity_name: 'Color Match', first_name: 'John', last_name: 'Doe', performance_score: 92, completed_at: '2024-02-01 10:30' },
      { id: 2, therapist_name: 'Dr. Johnson', activity_name: 'Sound Scape', first_name: 'Jane', last_name: 'Smith', performance_score: 87, completed_at: '2024-02-01 14:15' },
    ])
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser || !newPass) {
      setMessage('Please fill all fields')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newUserObj: User = {
        id: users.length + 1,
        username: newUser,
        role: 'therapist',
        created_at: new Date().toISOString().split('T')[0],
      }
      setUsers([...users, newUserObj])
      setNewUser('')
      setNewPass('')
      setMessage('Therapist created successfully!')
      setLoading(false)
      setTimeout(() => setMessage(''), 3000)
    }, 1000)
  }

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to remove this access?')) {
      setUsers(users.filter(u => u.id !== id))
      setMessage('Access revoked successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-surface-lighter p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-3 mb-3">
          <FaShield className="text-accent text-3xl" />
          <h1 className="text-4xl font-bold text-white">Admin Control Center</h1>
        </div>
        <p className="text-muted text-lg">Security & User Management</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className="mb-6 p-4 bg-secondary/20 border border-secondary rounded-lg text-secondary animate-bounce-subtle">
          {message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 flex-wrap">
        {['users', 'audit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'users' | 'audit')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-glow-lg transform scale-105'
                : 'bg-surface-lighter text-muted hover:text-white hover:bg-surface-lighter/80 hover:translate-y-[-2px]'
            }`}
          >
            {tab === 'users' ? <FaUser /> : <FaHistory />}
            {tab === 'users' ? 'Manage Therapists' : 'Audit Logs'}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 game-card">
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Create User Form */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-accent" /> Add New Therapist
              </h2>
              <form onSubmit={handleCreateUser} className="bg-surface/50 p-6 rounded-xl border border-accent/10 backdrop-blur">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-accent mb-2">Username</label>
                    <input
                      type="text"
                      value={newUser}
                      onChange={(e) => setNewUser(e.target.value)}
                      placeholder="e.g. therapist_001"
                      className="px-4 py-3 bg-surface-lighter border border-accent/20 rounded-lg text-white placeholder-muted/50 focus:border-accent focus:shadow-glow transition-all"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-accent mb-2">Initial Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="e.g. temp1234"
                      className="px-4 py-3 bg-surface-lighter border border-accent/20 rounded-lg text-white placeholder-muted/50 focus:border-accent focus:shadow-glow transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-accent to-secondary text-white font-semibold rounded-lg hover:shadow-glow-lg transform hover:scale-105 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <FaPlus /> {loading ? 'Creating...' : 'Add Therapist'}
                  </button>
                </div>
              </form>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <h2 className="text-xl font-bold text-white mb-4">Active Therapists</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-4 px-4 text-accent font-semibold">ID</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Username</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Role</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Created</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="border-b border-accent/10 hover:bg-accent/5 transition-all duration-200 group"
                    >
                      <td className="py-4 px-4 text-white font-mono">#{user.id}</td>
                      <td className="py-4 px-4 text-white font-semibold group-hover:text-accent transition-colors">{user.username}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${
                          user.role === 'admin'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-secondary/20 text-secondary border border-secondary/30'
                        }`}>
                          {user.role === 'admin' ? <FaShield size={12} /> : <FaUser size={12} />}
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted">{user.created_at}</td>
                      <td className="py-4 px-4">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/40 hover:shadow-glow transition-all flex items-center gap-2 text-sm font-semibold"
                          >
                            <FaTrash2 size={12} /> Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaHistory className="text-accent" /> System Activity Log
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-4 px-4 text-accent font-semibold">Date/Time</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Therapist</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Activity</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Student</th>
                    <th className="text-left py-4 px-4 text-accent font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-accent/10 hover:bg-accent/5 transition-all duration-200 group"
                    >
                      <td className="py-4 px-4 text-white text-sm font-mono">{log.completed_at}</td>
                      <td className="py-4 px-4 text-secondary font-semibold group-hover:text-accent transition-colors">{log.therapist_name}</td>
                      <td className="py-4 px-4 text-white">
                        <span className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg text-sm">
                          {log.activity_name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">{log.first_name} {log.last_name}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {log.performance_score >= 85 ? (
                            <FaCheckCircle className="text-green-400" />
                          ) : (
                            <FaExclamationCircle className="text-yellow-400" />
                          )}
                          <span className="font-bold text-white">{log.performance_score}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
