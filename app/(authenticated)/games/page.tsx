'use client'

import { useState } from 'react'
import { FaGamepad, FaPlayCircle, FaUsers, FaTrophy, FaClock, FaArrowRight } from 'react-icons/fa'

interface Game {
  id: number
  title: string
  description: string
  players: number
  avgScore: number
  duration: string
  icon: React.ReactNode
  color: string
  gradient: string
}

export default function GamesPage() {
  const [hoveredGame, setHoveredGame] = useState<number | null>(null)

  const games: Game[] = [
    {
      id: 1,
      title: 'Color Match Pro',
      description: 'Match colors and patterns to develop visual recognition',
      players: 156,
      avgScore: 87,
      duration: '10-15 min',
      icon: '🎨',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 2,
      title: 'Sound Scape',
      description: 'Explore audio patterns and sound sequencing challenges',
      players: 128,
      avgScore: 82,
      duration: '8-12 min',
      icon: '🎵',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      id: 3,
      title: 'Texture Explorer',
      description: 'Sensory experience through touch and tactile recognition',
      players: 94,
      avgScore: 84,
      duration: '12-18 min',
      icon: '✋',
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      id: 4,
      title: 'Flavor Quest',
      description: 'Gustatory and olfactory identification games',
      players: 112,
      avgScore: 79,
      duration: '15-20 min',
      icon: '👅',
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-500/20 to-red-500/20',
    },
    {
      id: 5,
      title: 'Motion Master',
      description: 'Kinesthetic awareness and movement coordination',
      players: 138,
      avgScore: 88,
      duration: '10-15 min',
      icon: '🚀',
      color: 'from-yellow-500 to-orange-500',
      gradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      id: 6,
      title: 'Spatial Solver',
      description: 'Spatial reasoning and 3D environment navigation',
      players: 105,
      avgScore: 85,
      duration: '12-16 min',
      icon: '🧩',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'from-indigo-500/20 to-purple-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-surface-lighter p-4 md:p-8">
      {/* Header */}
      <div className="mb-10 fade-in">
        <div className="flex items-center gap-3 mb-3">
          <FaGamepad className="text-accent text-3xl" />
          <h1 className="text-4xl font-bold text-white">Game Center</h1>
        </div>
        <p className="text-muted text-lg">Educational games and interactive activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <FaGamepad className="text-accent text-2xl" />
            <span className="text-muted text-sm font-semibold">Total Games</span>
          </div>
          <p className="text-3xl font-bold text-white">{games.length}</p>
        </div>
        <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-secondary text-2xl" />
            <span className="text-muted text-sm font-semibold">Active Players</span>
          </div>
          <p className="text-3xl font-bold text-white">{games.reduce((sum, g) => sum + g.players, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-surface-lighter/50 to-surface/50 backdrop-blur-sm border border-accent/10 rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <FaTrophy className="text-yellow-400 text-2xl" />
            <span className="text-muted text-sm font-semibold">Avg. Score</span>
          </div>
          <p className="text-3xl font-bold text-white">{Math.round(games.reduce((sum, g) => sum + g.avgScore, 0) / games.length)}%</p>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            className={`game-card group rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
              hoveredGame === game.id
                ? `bg-gradient-to-br ${game.gradient} border-accent shadow-glow-lg transform scale-105`
                : 'bg-gradient-to-br from-surface-lighter/50 to-surface/50 border-accent/10 hover:border-accent/50'
            }`}
          >
            {/* Game Icon */}
            <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110">
              {game.icon}
            </div>

            {/* Game Title */}
            <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>

            {/* Description */}
            <p className="text-muted text-sm mb-4">{game.description}</p>

            {/* Stats */}
            <div className="space-y-2 mb-6 py-4 border-t border-accent/10 border-b">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted flex items-center gap-2">
                  <FaUsers size={12} /> Players
                </span>
                <span className="font-bold text-accent">{game.players}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted flex items-center gap-2">
                  <FaTrophy size={12} /> Avg Score
                </span>
                <span className="font-bold text-accent">{game.avgScore}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted flex items-center gap-2">
                  <FaClock size={12} /> Duration
                </span>
                <span className="font-bold text-accent">{game.duration}</span>
              </div>
            </div>

            {/* Launch Button */}
            <button className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              hoveredGame === game.id
                ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-glow'
                : 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30'
            }`}>
              <FaPlayCircle /> Launch Game
            </button>
          </div>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12 bg-gradient-to-r from-accent/20 to-secondary/20 border border-accent/30 rounded-2xl p-8 shadow-card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Start a New Session</h2>
            <p className="text-muted">Select learners and games to begin an interactive session</p>
          </div>
          <button className="px-8 py-4 bg-gradient-to-r from-accent to-secondary text-white font-bold rounded-xl hover:shadow-glow-lg transform hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
            Create Session <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
