import React from 'react'
import MacroPie from '../Charts/MacroPie'

function MacroCalc({ formData }) {
  const calculateTDEE = () => {
    const { age, gender, weight, height, heightFeet, heightInches, activityLevel, unitSystem } = formData

    if (!age || !weight) return null

    let weightKg = unitSystem === 'imperial' ? parseFloat(weight) / 2.20462 : parseFloat(weight)
    let heightCm

    if (unitSystem === 'imperial') {
      if (!heightFeet || !heightInches) return null
      heightCm = (parseFloat(heightFeet) * 30.48) + (parseFloat(heightInches) * 2.54)
    } else {
      if (!height) return null
      heightCm = parseFloat(height)
    }

    const ageNum = parseFloat(age)

    let bmr
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageNum) - 161
    }

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }

    return Math.round(bmr * activityMultipliers[activityLevel])
  }

  const calculateMacros = (tdee) => {
    // Default split: 40% carbs, 30% protein, 30% fat
    const carbPercent = 0.40
    const proteinPercent = 0.30
    const fatPercent = 0.30

    return {
      carbs: Math.round((tdee * carbPercent) / 4),
      protein: Math.round((tdee * proteinPercent) / 4),
      fat: Math.round((tdee * fatPercent) / 9)
    }
  }

  const tdee = calculateTDEE()
  const macros = tdee ? calculateMacros(tdee) : null

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Macronutrient Breakdown
      </h3>
      {macros ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500">Carbs</p>
              <p className="text-xl font-bold text-neutral-100">{macros.carbs}g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">40%</p>
              <p className="text-xs text-neutral-600">{Math.round(macros.carbs * 4)} kcal</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500">Protein</p>
              <p className="text-xl font-bold text-neutral-100">{macros.protein}g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">30%</p>
              <p className="text-xs text-neutral-600">{Math.round(macros.protein * 4)} kcal</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500">Fat</p>
              <p className="text-xl font-bold text-neutral-100">{macros.fat}g</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">30%</p>
              <p className="text-xs text-neutral-600">{Math.round(macros.fat * 9)} kcal</p>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-3 mt-3">
            <p className="text-xs text-neutral-500">Total Daily Energy</p>
            <p className="text-lg font-bold text-neutral-100">{tdee} kcal</p>
          </div>

          <MacroPie macros={macros} />
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your data to calculate</p>
      )}
    </div>
  )
}

export default MacroCalc
