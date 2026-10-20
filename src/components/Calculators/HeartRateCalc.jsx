import React from 'react'

function HeartRateCalc({ formData }) {
  const calculateHeartRateZones = () => {
    const { age, restingHeartRate } = formData

    if (!age || !restingHeartRate) return null

    const ageNum = parseFloat(age)
    const restingHR = parseFloat(restingHeartRate)
    const maxHR = 220 - ageNum

    // Karvonen formula: Target HR = ((maxHR - restingHR) × intensity) + restingHR
    const zones = [
      { name: 'Rest', intensity: 0.5, min: 0, max: Math.round((maxHR - restingHR) * 0.5 + restingHR), color: 'text-blue-400' },
      { name: 'Fat Burn', intensity: 0.6, min: Math.round((maxHR - restingHR) * 0.5 + restingHR), max: Math.round((maxHR - restingHR) * 0.6 + restingHR), color: 'text-green-400' },
      { name: 'Cardio', intensity: 0.7, min: Math.round((maxHR - restingHR) * 0.6 + restingHR), max: Math.round((maxHR - restingHR) * 0.7 + restingHR), color: 'text-yellow-400' },
      { name: 'Peak', intensity: 0.85, min: Math.round((maxHR - restingHR) * 0.7 + restingHR), max: Math.round((maxHR - restingHR) * 0.85 + restingHR), color: 'text-orange-400' },
      { name: 'Extreme', intensity: 0.95, min: Math.round((maxHR - restingHR) * 0.85 + restingHR), max: Math.round((maxHR - restingHR) * 0.95 + restingHR), color: 'text-red-400' }
    ]

    return { maxHR, zones }
  }

  const heartRateData = calculateHeartRateZones()

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Heart Rate Zones
      </h3>
      {heartRateData ? (
        <div className="space-y-3">
          <div className="border-b border-neutral-700 pb-3">
            <p className="text-xs text-neutral-500 mb-1">Max Heart Rate</p>
            <p className="text-2xl font-bold text-neutral-100">{heartRateData.maxHR} <span className="text-sm font-normal text-neutral-400">bpm</span></p>
          </div>

          {heartRateData.zones.map((zone, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className={`text-xs font-semibold ${zone.color}`}>{zone.name}</p>
                <p className="text-xs text-neutral-500">{Math.round(zone.intensity * 100)}% intensity</p>
              </div>
              <p className="text-sm font-medium text-neutral-100">
                {zone.min === 0 ? `≤${zone.max}` : `${zone.min}-${zone.max}`} bpm
              </p>
            </div>
          ))}

          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-700">
            Karvonen formula
          </p>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter age and resting heart rate</p>
      )}
    </div>
  )
}

export default HeartRateCalc
