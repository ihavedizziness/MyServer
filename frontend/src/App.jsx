import './index.css'
import DownloadCard from './components/DownloadCard'
import UploadCard from './components/UploadCard'
import ServerSpeedCard from './components/ServerSpeedCard'
import StatsSection from './components/StatsSection'
import Toasts from './components/Toasts'
import { useStats } from './hooks/useStats'
import { useAlerts } from './hooks/useAlerts'

export default function App() {
  const { stats, updatedAt } = useStats()
  const { toasts, dismiss } = useAlerts(stats)

  return (
    <>
      <h1>Stats Server</h1>
      <p className="subtitle">
        Test download speed from the server, upload speed to the server, and the server's own internet speed.
      </p>

      <div className="section-title">Speed Tests</div>
      <div className="grid">
        <DownloadCard />
        <UploadCard />
        <ServerSpeedCard />
      </div>

      <div className="section-title">Server Stats</div>
      <StatsSection stats={stats} updatedAt={updatedAt} />

      <Toasts toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
