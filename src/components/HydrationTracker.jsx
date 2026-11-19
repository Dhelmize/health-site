import { useEffect, useState } from 'react'
import { mlToOz } from '../utils/conversion'

function HydrationTracker({ formData }) {
  const [hydrationLog, setHydrationLog] = useState(() => {
    try {
      const saved = localStorage.getItem('hydration-log')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [today] = useState(() => new Date().toDateString())
  const todayLog = hydrationLog.filter(entry => new Date(entry.timestamp).toDateString() === today)

  useEffect(() => {
    localStorage.setItem('hydration-log', JSON.stringify(hydrationLog))
  }, [hydrationLog])

  const weight = parseFloat(formData.weight)
  const weightKg = formData.unitSystem === 'imperial' ? weight / 2.20462 : weight
  const goal = weightKg ? Math.round((weightKg * 35) + (formData.workoutToday ? 750 : 0)) : null
  const intake = todayLog.reduce((sum, entry) => sum + entry.amount, 0)
  const progress = goal ? Math.min((intake / goal) * 100, 100) : 0
  const imperial = formData.unitSystem === 'imperial'
  const display = amount => imperial ? `${Math.round(mlToOz(amount))} oz` : `${amount} ml`

  const add = amount => setHydrationLog(previous => [...previous, { id: Date.now(), amount, timestamp: new Date().toISOString() }])
  const remove = id => setHydrationLog(previous => previous.filter(entry => entry.id !== id))
  const clear = () => {
    const today = new Date().toDateString()
    setHydrationLog(previous => previous.filter(entry => new Date(entry.timestamp).toDateString() !== today))
  }

  if (!goal) return <div className="empty-state"><h2>Set a hydration goal</h2><p>Enter your weight in a calculator or profile.</p></div>

  return (
    <div className="hydration-layout">
      <section className="hydration-overview">
        <p className="eyebrow">Today</p><div className="hydration-numbers"><div><strong>{display(intake)}</strong><span>consumed</span></div><div><strong>{display(goal)}</strong><span>daily goal</span></div></div>
        <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }}/></div>
        <p className="progress-label">{Math.round(progress)}% complete</p>
        <div className="quick-add"><button onClick={() => add(250)}>+ {display(250)}</button><button onClick={() => add(500)}>+ {display(500)}</button><button onClick={() => add(750)}>+ {display(750)}</button></div>
      </section>
      <section className="hydration-history">
        <div className="profile-list-heading"><h2>Today’s log</h2>{todayLog.length > 0 && <button onClick={clear}>Clear</button>}</div>
        {todayLog.length === 0 ? <p className="muted">No entries yet.</p> : <div className="history-list">{todayLog.slice().reverse().map(entry => <div key={entry.id}><time>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time><strong>{display(entry.amount)}</strong><button onClick={() => remove(entry.id)} aria-label="Remove entry">×</button></div>)}</div>}
      </section>
    </div>
  )
}

export default HydrationTracker
