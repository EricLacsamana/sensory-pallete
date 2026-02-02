// Common types used across the application

export interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
}

export interface StatCard {
  id: number | string
  title: string
  label: string
  value: string | number
  trend: string
  icon: React.ReactNode
  gradient: string
  color: string
}

export interface Learner {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  progress: number
  lastActive: string
  diagnosis: string[]
  rating: number
}

export interface GameSession {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  players: number
  avgScore: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  battery: number
  signal: number
  location: string
  lastUpdate: string
}

export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'moderator' | 'viewer'
  createdAt: string
  lastLogin: string
  status: 'active' | 'inactive'
}

export interface AuditLog {
  id: string
  action: string
  user: string
  target: string
  timestamp: string
  details: string
}
