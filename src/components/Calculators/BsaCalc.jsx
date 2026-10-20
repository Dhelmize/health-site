import React from 'react'

function BsaCalc({ formData }) {
  const calculateBSA = () => {
    const { weight, height, heightFeet, heightInches, unitSystem } = formData

    if (!weight) return null

    let weightKg = unitSystem === 'imperial' ? parseFloat(weight) / 2.20462 : parseFloat(weight)
    let heightCm

    if (unitSystem === 'imperial') {
      if (!heightFeet || !heightInches) return null
      heightCm = (parseFloat(heightFeet) * 30.48) + (parseFloat(heightInches) * 2.54)
    } else {
      if (!height) return null
      heightCm = parseFloat(height)
    }

    // Mosteller formula
    const bsa = Math.sqrt((heightCm * weightKg) / 3600)
    return bsa.toFixed(2)
  }

  const bsa = calculateBSA()

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Body Surface Area
      </h3>
      {bsa ? (
        <div>
          <p className="text-xs text-neutral-500 mb-1">Body Surface Area (BSA)</p>
          <p className="text-3xl font-bold text-neutral-100" data-bsa={bsa}>{bsa} <span className="text-lg font-normal text-neutral-400">m²</span></p>
          <p className="text-xs text-neutral-500 mt-1">Mosteller formula</p>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter your data to calculate</p>
      )}
    </div>
  )
}

export default BsaCalc
