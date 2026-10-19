import React from 'react'

function ProteinCalc({ formData }) {
  const calculateProtein = () => {
    const { weight, activityLevel } = formData
    if (!weight) return null

    const weightKg = parseFloat(weight)

    const proteinMultipliers = {
      sedentary: 0.8,
      lightly_active: 1.2,
      moderately_active: 1.4,
      very_active: 1.8,
      extremely_active: 2.0
    }

    const protein = weightKg * proteinMultipliers[activityLevel]
    return Math.round(protein)
  }

  const protein = calculateProtein()

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Protein Requirements
      </h3>
      {protein ? (
        <div>
          <p className="text-xs text-neutral-500 mb-1">Daily Protein Intake</p>
          <p className="text-3xl font-bold text-neutral-100">{protein} <span className="text-lg font-normal text-neutral-400">g/day</span></p>
          <p className="text-xs text-neutral-500 mt-1">Based on activity level</p>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your data to calculate</p>
      )}
    </div>
  )
}

export default ProteinCalc
