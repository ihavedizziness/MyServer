import { useState } from 'react'

export default function UploadCard() {
  const [size, setSize] = useState(10)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [statusErr, setStatusErr] = useState(false)
  const [result, setResult] = useState(null)

  async function run() {
    const totalBytes = size * 1024 * 1024
    setRunning(true)
    setProgress(10)
    setStatus('Generating data...')
    setStatusErr(false)
    setResult(null)

    try {
      const buf = new Uint8Array(totalBytes)
      crypto.getRandomValues(buf.subarray(0, Math.min(totalBytes, 65536)))
      for (let i = 65536; i < totalBytes; i++) buf[i] = buf[i % 65536]

      setProgress(20)
      setStatus('Uploading...')
      const start = performance.now()

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/upload')
        xhr.setRequestHeader('Content-Type', 'application/octet-stream')

        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return
          const pct = 20 + (e.loaded / e.total) * 78
          setProgress(pct)
          const elapsed = (performance.now() - start) / 1000
          const mbps = ((e.loaded * 8) / (elapsed * 1e6)).toFixed(1)
          setStatus(`Uploading… ${(e.loaded / 1048576).toFixed(1)} MB — ${mbps} Mbps`)
        }

        xhr.onload = () => xhr.status < 400 ? resolve() : reject(new Error('Server error ' + xhr.status))
        xhr.onerror = () => reject(new Error('Network error'))
        xhr.send(buf.buffer)
      })

      const elapsed = (performance.now() - start) / 1000
      const mbps = ((totalBytes * 8) / (elapsed * 1e6)).toFixed(2)
      const mbps_raw = (totalBytes / (elapsed * 1048576)).toFixed(2)
      setProgress(100)
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
        <div className="icon icon-up">↑</div>
        <div className="card-title">Upload Speed</div>
      </div>
      <p className="card-desc">Sends random data to the server. Speed is measured client-side (time from first byte sent to response received).</p>
      <div className="size-row">
        Test size:
        <select value={size} onChange={e => setSize(+e.target.value)} disabled={running}>
          <option value={5}>5 MB</option>
          <option value={10}>10 MB</option>
          <option value={25}>25 MB</option>
          <option value={50}>50 MB</option>
        </select>
      </div>
      <button className="btn-up" onClick={run} disabled={running}>
        {running ? 'Testing…' : 'Start Upload Test'}
      </button>
      {(running || result) && (
        <div className="progress-wrap">
          <div className="progress-bar bar-up" style={{ width: progress + '%' }} />
        </div>
      )}
      <div className={`status-text${statusErr ? ' error' : ''}`}>{status}</div>
      {result && (
        <div className="result">
          <span className="result-speed up">{result.mbps} Mbps</span>
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
