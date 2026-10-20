import React from 'react'
import { mlToOz } from '../../utils/conversion'

function WaterCalc({ formData }) {
  const calculateWater = () => {
    const { weight, workoutToday, unitSystem } = formData
    if (!weight) return null

    const weightKg = unitSystem === 'imperial' ? parseFloat(weight) / 2.20462 : parseFloat(weight)
    let water = weightKg * 35

    if (workoutToday) {
      water += 750
    }

    return Math.round(water)
  }

  const water = calculateWater()
  const isImperial = formData.unitSystem === 'imperial'

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Daily Water Intake
      </h3>
      {water ? (
        <div>
          <p className="text-xs text-neutral-500 mb-1">Recommended Water Intake</p>
          <p className="text-3xl font-bold text-neutral-100" data-water={water}>
            {isImperial ? Math.round(mlToOz(water)) : water} <span className="text-lg font-normal text-neutral-400">{isImperial ? 'oz/day' : 'ml/day'}</span>
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            35ml per kg {formData.workoutToday ? '+ 750ml for workout' : ''}
          </p>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your data to calculate</p>
      )}
    </div>
  )
}

export default WaterCalc
