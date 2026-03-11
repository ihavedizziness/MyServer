export default function Toasts({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.level}`}>
          <span className="toast-icon">{t.level === 'danger' ? '⚠' : '!'}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => onDismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
