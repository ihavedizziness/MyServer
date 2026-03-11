import { useState, useEffect } from 'react'

export function useStats(intervalMs = 2000) {
  const [stats, setStats] = useState(null)
  const [updatedAt, setUpdatedAt] = useState('Connecting...')

  useEffect(() => {
    async function fetchStats() {
      try {
        const resp = await fetch('/stats')
        if (!resp.ok) return
        const data = await resp.json()
        setStats(data)
        setUpdatedAt('Updated: ' + new Date().toLocaleTimeString())
      } catch (_) {}
    }

    fetchStats()
    const id = setInterval(fetchStats, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return { stats, updatedAt }
}
