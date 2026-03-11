import { useState, useEffect, useRef } from 'react'

const RULES = [
  {
    key: 'cpu',
    check: s => s.cpu_percent >= 90,
    message: s => `CPU usage critical: ${s.cpu_percent.toFixed(1)}%`,
    level: 'danger',
  },
  {
    key: 'ram',
    check: s => s.ram_percent >= 90,
    message: s => `Memory usage critical: ${s.ram_percent.toFixed(1)}%`,
    level: 'danger',
  },
  {
    key: 'disk',
    check: s => s.disk_percent >= 90,
    message: s => `Disk almost full: ${s.disk_percent.toFixed(1)}%`,
    level: 'warn',
  },
]

function gpuRules(gpus = []) {
  return gpus.flatMap(gpu => [
    {
      key: `gpu-load-${gpu.index}`,
      check: () => gpu.load_percent >= 90,
      message: () => `GPU ${gpu.index} load critical: ${gpu.load_percent.toFixed(1)}%`,
      level: 'danger',
    },
    {
      key: `gpu-temp-${gpu.index}`,
      check: () => gpu.temperature_c >= 80,
      message: () => `GPU ${gpu.index} temperature high: ${gpu.temperature_c}°C`,
      level: 'warn',
    },
  ])
}

let nextId = 0

export function useAlerts(stats) {
  const [toasts, setToasts] = useState([])
  const activeKeys = useRef(new Set())

  useEffect(() => {
    if (!stats) return

    const rules = [...RULES, ...gpuRules(stats.gpus)]

    rules.forEach(rule => {
      const triggered = rule.check(stats)
      if (triggered && !activeKeys.current.has(rule.key)) {
        activeKeys.current.add(rule.key)
        const id = ++nextId
        setToasts(prev => [...prev, { id, message: rule.message(stats), level: rule.level }])
        setTimeout(() => dismiss(id), 5000)
      } else if (!triggered) {
        activeKeys.current.delete(rule.key)
      }
    })
  }, [stats])

  function dismiss(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, dismiss }
}
