import React, { useState, useEffect } from 'react'
import { mlToOz } from '../utils/conversion'

function HydrationTracker({ formData }) {
  const [hydrationLog, setHydrationLog] = useState(() => {
    const saved = localStorage.getItem('hydration-log')
    return saved ? JSON.parse(saved) : []
  })

  const [todayLog, setTodayLog] = useState(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('hydration-log')
    if (saved) {
      const log = JSON.parse(saved)
      return log.filter(entry => new Date(entry.timestamp).toDateString() === today)
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('hydration-log', JSON.stringify(hydrationLog))
  }, [hydrationLog])

  const calculateDailyGoal = () => {
    const { weight, workoutToday, unitSystem } = formData
    if (!weight) return null

    const weightKg = unitSystem === 'imperial' ? parseFloat(weight) / 2.20462 : parseFloat(weight)
    let water = weightKg * 35

    if (workoutToday) {
      water += 750
    }

    return Math.round(water)
  }

  const dailyGoal = calculateDailyGoal()
  const totalIntake = todayLog.reduce((sum, entry) => sum + entry.amount, 0)
  const progress = dailyGoal ? Math.min((totalIntake / dailyGoal) * 100, 100) : 0

  const addWater = (amount) => {
    const entry = {
      id: Date.now(),
      amount,
      timestamp: new Date().toISOString()
    }
    setHydrationLog(prev => [...prev, entry])
    setTodayLog(prev => [...prev, entry])
  }

  const removeEntry = (id) => {
    setHydrationLog(prev => prev.filter(entry => entry.id !== id))
    setTodayLog(prev => prev.filter(entry => entry.id !== id))
  }

  const clearToday = () => {
    const today = new Date().toDateString()
    setHydrationLog(prev => prev.filter(entry => new Date(entry.timestamp).toDateString() !== today))
    setTodayLog([])
  }

  const isImperial = formData.unitSystem === 'imperial'

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Hydration Tracker
      </h3>

      {dailyGoal ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-neutral-500">Daily Goal</p>
              <p className="text-lg font-bold text-neutral-100">
                {isImperial ? Math.round(mlToOz(dailyGoal)) : dailyGoal} {isImperial ? 'oz' : 'ml'}
              </p>
            </div>

            <div className="w-full bg-neutral-800 rounded-full h-3 mb-2">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-500">Consumed</p>
              <p className="text-sm font-medium text-neutral-100">
                {isImperial ? Math.round(mlToOz(totalIntake)) : totalIntake} {isImperial ? 'oz' : 'ml'} ({Math.round(progress)}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addWater(250)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
            >
              +{isImperial ? Math.round(mlToOz(250)) : 250} {isImperial ? 'oz' : 'ml'}
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
            >
              +{isImperial ? Math.round(mlToOz(500)) : 500} {isImperial ? 'oz' : 'ml'}
            </button>
            <button
              onClick={() => addWater(750)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
            >
              +{isImperial ? Math.round(mlToOz(750)) : 750} {isImperial ? 'oz' : 'ml'}
            </button>
          </div>

          {todayLog.length > 0 && (
            <div className="border-t border-neutral-700 pt-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-neutral-500">Today's Log</p>
                <button
                  onClick={clearToday}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {todayLog.slice().reverse().map(entry => (
                  <div key={entry.id} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-300">
                        {isImperial ? Math.round(mlToOz(entry.amount)) : entry.amount} {isImperial ? 'oz' : 'ml'}
                      </span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your weight to set goal</p>
      )}
    </div>
  )
}

export default HydrationTracker
