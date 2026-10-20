import React from 'react'

function BmrCalc({ formData }) {
  const calculateBMR = () => {
    const { age, gender, weight, height, heightFeet, heightInches, unitSystem } = formData

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

    return Math.round(bmr)
  }

  const calculateTDEE = (bmr) => {
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }
    return Math.round(bmr * activityMultipliers[formData.activityLevel])
  }

  const bmr = calculateBMR()
  const tdee = bmr ? calculateTDEE(bmr) : null

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Metabolic Rate
      </h3>
      {bmr ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Basal Metabolic Rate (BMR)</p>
            <p className="text-3xl font-bold text-neutral-100" data-bmr={bmr}>{bmr} <span className="text-lg font-normal text-neutral-400">kcal/day</span></p>
            <p className="text-xs text-neutral-500 mt-1">Mifflin-St Jeor equation</p>
          </div>
          <div className="border-t border-neutral-700 pt-4">
            <p className="text-xs text-neutral-500 mb-1">Total Daily Energy (TDEE)</p>
            <p className="text-3xl font-bold text-neutral-100" data-tdee={tdee}>{tdee} <span className="text-lg font-normal text-neutral-400">kcal/day</span></p>
            <p className="text-xs text-neutral-500 mt-1">Based on activity level</p>
          </div>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your data to calculate</p>
      )}
    </div>
  )
}

export default BmrCalc
