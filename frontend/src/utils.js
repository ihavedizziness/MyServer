export function fmtSize(mb) {
  if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB'
  return mb.toFixed(0) + ' MB'
}

export function fmtUptime(sec) {
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const parts = []
  if (d) parts.push(d + 'd')
  if (h) parts.push(h + 'h')
  if (m) parts.push(m + 'm')
  parts.push(s + 's')
  return parts.join(' ')
}

export function badgeClass(pct) {
  if (pct < 70) return 'badge-ok'
  if (pct < 90) return 'badge-warn'
  return 'badge-danger'
}
