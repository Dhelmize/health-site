import React from 'react'
import { kgToLbs, lbsToKg } from '../../utils/conversion'
import WeightGauge from '../Charts/WeightGauge'

function IdealWeightCalc({ formData }) {
  const calculateIdealWeight = () => {
    const { gender, height, heightFeet, heightInches, unitSystem } = formData

    let heightCm
    if (unitSystem === 'imperial') {
      if (!heightFeet || !heightInches) return null
      heightCm = (parseFloat(heightFeet) * 30.48) + (parseFloat(heightInches) * 2.54)
    } else {
      if (!height) return null
      heightCm = parseFloat(height)
    }

    const totalHeightInches = heightCm / 2.54
    const inchesOver5ft = totalHeightInches - 60

    let idealWeightKg
    if (gender === 'male') {
      idealWeightKg = 50 + (2.3 * inchesOver5ft)
    } else {
      idealWeightKg = 45.5 + (2.3 * inchesOver5ft)
    }

    // Calculate range (±10%)
    const minWeight = idealWeightKg * 0.9
    const maxWeight = idealWeightKg * 1.1

    return {
      ideal: Math.round(idealWeightKg),
      min: Math.round(minWeight),
      max: Math.round(maxWeight)
    }
  }

  const idealWeight = calculateIdealWeight()

  const getCurrentWeightInKg = () => {
    const { weight, unitSystem } = formData
    if (!weight) return null
    return unitSystem === 'imperial' ? lbsToKg(parseFloat(weight)) : parseFloat(weight)
  }

  const currentWeightKg = getCurrentWeightInKg()

  const getWeightStatus = () => {
    if (!idealWeight || !currentWeightKg) return null

    if (currentWeightKg < idealWeight.min) return 'below'
    if (currentWeightKg > idealWeight.max) return 'above'
    return 'within'
  }

  const weightStatus = getWeightStatus()

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Ideal Body Weight
      </h3>
      {idealWeight ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Ideal Weight Range</p>
            <p className="text-2xl font-bold text-neutral-100">
              {formData.unitSystem === 'imperial' ? `${Math.round(kgToLbs(idealWeight.min))}-${Math.round(kgToLbs(idealWeight.max))} lbs` : `${idealWeight.min}-${idealWeight.max} kg`}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Devine formula (±10%)</p>
          </div>

          {weightStatus && (
            <div className="border-t border-neutral-700 pt-4">
              <p className="text-xs text-neutral-500 mb-1">Your Status</p>
              <p className={`text-lg font-semibold ${
                weightStatus === 'within' ? 'text-green-400' :
                weightStatus === 'below' ? 'text-yellow-400' :
                'text-orange-400'
              }`}>
                {weightStatus === 'within' ? 'Within healthy range' :
                 weightStatus === 'below' ? 'Below ideal range' :
                 'Above ideal range'}
              </p>
              <WeightGauge
                currentWeight={currentWeightKg}
                idealRange={idealWeight}
                unitSystem={formData.unitSystem}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your height to calculate</p>
      )}
    </div>
  )
}

export default IdealWeightCalc
