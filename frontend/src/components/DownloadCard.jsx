import { useState, useRef } from 'react'

export default function DownloadCard() {
  const [size, setSize] = useState(25)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [statusErr, setStatusErr] = useState(false)
  const [result, setResult] = useState(null)
  const abortRef = useRef(null)

  async function run() {
    setRunning(true)
    setProgress(0)
    setStatus('Connecting...')
    setStatusErr(false)
    setResult(null)

    try {
      const start = performance.now()
      const resp = await fetch(`/download?size_mb=${size}`)
      if (!resp.ok) throw new Error('Server error ' + resp.status)
      const reader = resp.body.getReader()
      let received = 0
      const total = size * 1024 * 1024

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        received += value.length
        const elapsed = (performance.now() - start) / 1000
        setProgress(Math.min(100, (received / total) * 100))
        setStatus(`Downloading… ${(received / 1048576).toFixed(1)} MB — ${((received * 8) / (elapsed * 1e6)).toFixed(1)} Mbps`)
      }

      const elapsed = (performance.now() - start) / 1000
      const mbps = ((received * 8) / (elapsed * 1e6)).toFixed(2)
      const mbps_raw = (received / (elapsed * 1048576)).toFixed(2)
      setStatus('Done')
      setResult({ mbps, mbps_raw, elapsed: elapsed.toFixed(2), size })
    } catch (e) {
      setStatus('Error: ' + e.message)
      setStatusErr(true)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon icon-down">↓</div>
        <div className="card-title">Download Speed</div>
      </div>
      <p className="card-desc">Fetches random data from the server and measures how fast your browser receives it.</p>
      <div className="size-row">
        Test size:
        <select value={size} onChange={e => setSize(+e.target.value)} disabled={running}>
          <option value={10}>10 MB</option>
          <option value={25}>25 MB</option>
          <option value={50}>50 MB</option>
          <option value={100}>100 MB</option>
        </select>
      </div>
      <button className="btn-down" onClick={run} disabled={running}>
        {running ? 'Testing…' : 'Start Download Test'}
      </button>
      {(running || result) && (
        <div className="progress-wrap">
          <div className="progress-bar bar-down" style={{ width: progress + '%' }} />
        </div>
      )}
      <div className={`status-text${statusErr ? ' error' : ''}`}>{status}</div>
      {result && (
        <div className="result">
          <span className="result-speed down">{result.mbps} Mbps</span>
          <div className="result-details">
            <span className="result-unit">Mbps (megabits/sec)</span>
            <br />
            {result.mbps_raw} MB/s &nbsp;|&nbsp; {result.size} MB in {result.elapsed}s
          </div>
        </div>
      )}
    </div>
  )
}
