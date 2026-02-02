'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaUsers, FaGamepad, FaTrophy, FaChartLine, FaArrowRight, FaClock, FaStar } from 'react-icons/fa'

interface StatCard {
  id: number
  title: string
  label: string
  value: string | number
  trend: string
  icon: React.ReactNode
  gradient: string
  color: string
}

const StatCard = ({ stat, isHovered, onHover }: { stat: StatCard; isHovered: boolean; onHover: (id: number | null) => void }) => {
  return (
    <div
      onMouseEnter={() => onHover(stat.id)}
      onMouseLeave={() => onHover(null)}
      className={`game-card group p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
        isHovered
          ? `${stat.gradient} border-accent shadow-glow-lg transform scale-105`
          : `bg-surface-lighter/40 border-accent/20 hover:border-accent/50`
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted text-sm font-semibold uppercase tracking-widest">{stat.label}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
        </div>
        <div className={`p-3 rounded-xl transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <span className="text-2xl">{stat.icon}</span>
        </div>
      </div>
      <p className={`text-sm font-semibold ${isHovered ? 'text-white' : 'text-accent'}`}>{stat.trend}</p>
    </div>
  )
}

export default function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const stats: StatCard[] = [
    {
      id: 1,
      title: 'Learners',
      label: 'Total Students',
      value: 24,
      trend: '+6 new this month',
      icon: <FaUsers className="text-blue-400" />,
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      color: 'text-blue-400',
    },
    {
      id: 2,
      title: 'Sessions',
      label: "Today's Goals",
      value: 12,
      trend: '4 remaining',
      icon: <FaClock className="text-amber-400" />,
      gradient: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
      color: 'text-amber-400',
    },
    {
      id: 3,
      title: 'Accuracy',
      label: 'Avg. Success Rate',
      value: '84%',
      trend: '↑ 5% from last week',
      icon: <FaTrophy className="text-green-400" />,
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      color: 'text-green-400',
    },
    {
      id: 4,
      title: 'Activity',
      label: 'Total Play Time',
      value: '320m',
      trend: 'Across all activities',
      icon: <FaChartLine className="text-orange-400" />,
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      color: 'text-orange-400',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-surface-lighter p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-10 fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-muted text-lg">
          Here's what's happening with your learners today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            isHovered={hoveredCard === stat.id}
            onHover={setHoveredCard}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learners Table - takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all game-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUsers className="text-accent" /> Recent Learners
              </h2>
              <Link
                href="/learners"
                className="text-accent hover:text-secondary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <FaArrowRight size={14} />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-3 px-4 text-accent text-sm font-semibold">Learner</th>
                    <th className="text-left py-3 px-4 text-accent text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-accent text-sm font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Alex Johnson', status: 'Active', progress: 78 },
                    { name: 'Sarah Williams', status: 'Active', progress: 92 },
                    { name: 'Marcus Brown', status: 'Idle', progress: 45 },
                    { name: 'Emma Davis', status: 'Active', progress: 88 },
                    { name: 'James Wilson', status: 'Active', progress: 65 },
                  ].map((learner, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-accent/10 hover:bg-accent/5 transition-all group"
                    >
                      <td className="py-4 px-4 text-white font-semibold group-hover:text-accent">
                        {learner.name}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          learner.status === 'Active'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-muted/20 text-muted border border-muted/30'
                        }`}>
                          {learner.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-surface-lighter rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-300"
                              style={{ width: `${learner.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-accent">{learner.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="space-y-6">
          {/* Tips Card */}
          <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-6 shadow-card game-card">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-400" /> Quick Tips
            </h3>
            <div className="space-y-3">
              {[
                'Morning sessions show 23% higher focus',
                'Sound activities boost retention rates',
                'Weekly reviews improve outcomes',
              ].map((tip, idx) => (
                <div key={idx} className="p-3 bg-accent/5 border border-accent/20 rounded-lg hover:border-accent/50 hover:bg-accent/10 transition-all">
                  <p className="text-sm text-white leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Games Card */}
          <Link href="/games" className="block">
            <div className="bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent/30 rounded-2xl p-6 shadow-card hover:shadow-glow-lg hover:border-accent transition-all cursor-pointer transform hover:scale-105">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <FaGamepad className="text-accent" /> Game Center
              </h3>
              <p className="text-muted text-sm mb-4">
                Access all educational games and activities
              </p>
              <div className="flex items-center gap-2 text-accent font-semibold hover:text-secondary transition-colors">
                Launch <FaArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
