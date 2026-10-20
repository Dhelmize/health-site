import React from 'react'
import { kgToLbs } from '../../utils/conversion'

function WeightGauge({ currentWeight, idealRange, unitSystem }) {
  if (!currentWeight || !idealRange) return null

  const min = idealRange.min
  const max = idealRange.max
  const range = max - min

  // Calculate position (0-100%)
  let position
  if (currentWeight < min) {
    position = 0
  } else if (currentWeight > max) {
    position = 100
  } else {
    position = ((currentWeight - min) / range) * 100
  }

  const getStatusColor = () => {
    if (currentWeight < min) return 'bg-yellow-500'
    if (currentWeight > max) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (currentWeight < min) return 'Below Range'
    if (currentWeight > max) return 'Above Range'
    return 'Healthy Range'
  }

  return (
    <div className="mt-4">
      <div className="relative h-4 bg-neutral-800 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-full flex">
            <div className="flex-1 bg-gradient-to-r from-yellow-500 via-green-500 to-orange-500" />
          </div>
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-300"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{unitSystem === 'imperial' ? Math.round(kgToLbs(min)) : min} {unitSystem === 'imperial' ? 'lbs' : 'kg'}</span>
        <span className={`font-semibold ${getStatusColor().replace('bg-', 'text-')}`}>{getStatusText()}</span>
        <span>{unitSystem === 'imperial' ? Math.round(kgToLbs(max)) : max} {unitSystem === 'imperial' ? 'lbs' : 'kg'}</span>
      </div>
    </div>
  )
}

export default WeightGauge
