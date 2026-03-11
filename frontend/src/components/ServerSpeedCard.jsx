import { useState } from 'react'

export default function ServerSpeedCard() {
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('')
  const [statusErr, setStatusErr] = useState(false)
  const [result, setResult] = useState(null)

  async function run() {
    setRunning(true)
    setStatus('Running speedtest on server (~30s)...')
    setStatusErr(false)
    setResult(null)

    try {
      const resp = await fetch('/internet-speed')
      const data = await resp.json()
      if (data.error) throw new Error(data.error)
      setStatus('Done')
      setResult(data)
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
        <div className="icon icon-net">🌐</div>
        <div className="card-title">Server Internet Speed</div>
      </div>
      <p className="card-desc">Runs a full speedtest-cli test on the server itself. Measures ping, download, and upload to the nearest test server. Takes ~30 seconds.</p>
      <button className="btn-net" onClick={run} disabled={running}>
        {running ? 'Running…' : 'Run Server Speed Test'}
      </button>
      {running && (
        <div className="progress-wrap">
          <div className="progress-bar bar-net" style={{ width: '100%' }} />
        </div>
      )}
      <div className={`status-text${statusErr ? ' error' : ''}`}>{status}</div>
      {result && (
        <div className="result">
          <span className="result-speed net">{result.download_mbps} / {result.upload_mbps} Mbps</span>
          <div className="result-details">
            <span className="result-unit">Download / Upload</span>
            <br />
            Ping: <strong style={{ color: '#e2e8f0' }}>{result.ping_ms} ms</strong>
            <br />
            Server: {result.server.sponsor} — {result.server.name}, {result.server.country}
            <br />
            ISP: {result.isp} &nbsp;|&nbsp; IP: {result.client_ip}
          </div>
        </div>
      )}
    </div>
  )
}
