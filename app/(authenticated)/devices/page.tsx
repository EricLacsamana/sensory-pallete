'use client'

import { useState } from 'react'
import { FaWifi, FaCheckCircle, FaTimesCircle, FaBatteryFull, FaSignal, FaPlus, FaEllipsisV } from 'react-icons/fa'

interface Device {
  id: number
  name: string
  type: string
  status: 'active' | 'inactive' | 'error'
  battery: number
  signal: number
  lastSeen: string
  location: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([
    { id: 1, name: 'Sensor Pod 01', type: 'Temperature', status: 'active', battery: 95, signal: 5, lastSeen: '2 min ago', location: 'Room A' },
    { id: 2, name: 'Sensor Pod 02', type: 'Humidity', status: 'active', battery: 78, signal: 4, lastSeen: '5 min ago', location: 'Room B' },
    { id: 3, name: 'Sensor Pod 03', type: 'Light Sensor', status: 'active', battery: 62, signal: 5, lastSeen: 'now', location: 'Room C' },
    { id: 4, name: 'Sensor Pod 04', type: 'Sound Level', status: 'inactive', battery: 12, signal: 2, lastSeen: '2 hours ago', location: 'Storage' },
    { id: 5, name: 'Sensor Pod 05', type: 'Motion', status: 'error', battery: 45, signal: 1, lastSeen: '30 min ago', location: 'Room D' },
  ])
  const [hoveredDevice, setHoveredDevice] = useState<number | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-green-400" />
      case 'inactive':
        return <FaTimesCircle className="text-gray-400" />
      case 'error':
        return <FaTimesCircle className="text-red-400" />
      default:
        return null
    }
  }

  const getSignalBars = (signal: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className={`h-full w-1 rounded-sm transition-all ${
          i < signal ? 'bg-green-400' : 'bg-surface-lighter/30'
        }`}
      ></div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-light to-surface-lighter p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 fade-in">
        <div className="flex items-center gap-3 mb-3">
          <FaWifi className="text-accent text-3xl" />
          <h1 className="text-4xl font-bold text-white">Devices & Sensors</h1>
        </div>
        <p className="text-muted text-lg">Monitor connected IoT devices and sensors</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Devices', value: devices.length, color: 'from-blue-500 to-cyan-500', icon: <FaWifi /> },
          { label: 'Active', value: devices.filter(d => d.status === 'active').length, color: 'from-green-500 to-emerald-500', icon: <FaCheckCircle /> },
          { label: 'Inactive', value: devices.filter(d => d.status === 'inactive').length, color: 'from-gray-500 to-slate-500', icon: <FaTimesCircle /> },
          { label: 'Issues', value: devices.filter(d => d.status === 'error').length, color: 'from-red-500 to-pink-500', icon: <FaTimesCircle /> },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color}/20 border border-${stat.color}/30 rounded-xl p-4 shadow-card`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-muted text-sm font-semibold">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Add Device Button */}
      <button className="mb-8 px-6 py-3 bg-gradient-to-r from-accent to-secondary text-white font-semibold rounded-xl hover:shadow-glow-lg transform hover:scale-105 transition-all flex items-center gap-2">
        <FaPlus /> Add New Device
      </button>

      {/* Devices List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            onMouseEnter={() => setHoveredDevice(device.id)}
            onMouseLeave={() => setHoveredDevice(null)}
            className={`game-card rounded-xl p-4 border transition-all duration-300 group ${
              hoveredDevice === device.id
                ? 'bg-accent/5 border-accent shadow-card-hover'
                : 'bg-gradient-to-r from-surface-lighter/50 to-surface/50 border-accent/10'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Device Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    device.status === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <FaWifi className={device.status === 'active' ? 'text-green-400' : 'text-red-400'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                      {device.name}
                    </h3>
                    <p className="text-sm text-muted">{device.type}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-muted">
                    📍 {device.location}
                  </span>
                  <span className="text-muted">
                    ⏱ {device.lastSeen}
                  </span>
                </div>
              </div>

              {/* Status & Metrics */}
              <div className="flex items-center gap-8">
                {/* Status */}
                <div className="flex flex-col items-center gap-1">
                  {getStatusIcon(device.status)}
                  <span className="text-xs text-muted capitalize">{device.status}</span>
                </div>

                {/* Battery */}
                <div className="flex flex-col items-center gap-1">
                  <FaBatteryFull className={`text-lg ${
                    device.battery > 60 ? 'text-green-400' : device.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                  <span className="text-xs font-bold text-white">{device.battery}%</span>
                </div>

                {/* Signal */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-1 h-4">
                    {getSignalBars(device.signal)}
                  </div>
                  <span className="text-xs text-muted">{device.signal}/5</span>
                </div>

                {/* Menu */}
                <button className="px-3 py-2 rounded-lg hover:bg-accent/20 transition-all text-muted hover:text-accent">
                  <FaEllipsisV />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions Card */}
      <div className="mt-12 bg-gradient-to-r from-accent/20 to-secondary/20 border border-accent/30 rounded-2xl p-8 shadow-card">
        <h2 className="text-2xl font-bold text-white mb-4">Device Management Tips</h2>
        <ul className="space-y-3 text-muted">
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Check battery levels regularly and replace sensors when below 20%</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Ensure all devices are placed within WiFi range for optimal performance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-bold">•</span>
            <span>Reset devices if they show persistent connection issues</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
