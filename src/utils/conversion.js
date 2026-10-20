// Weight conversions
export const kgToLbs = (kg) => kg * 2.20462
export const lbsToKg = (lbs) => lbs / 2.20462

// Height conversions
export const cmToFt = (cm) => cm / 30.48
export const ftToCm = (ft) => ft * 30.48

export const cmToFtIn = (cm) => {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

export const ftInToCm = (feet, inches) => {
  const totalInches = (feet * 12) + inches
  return totalInches * 2.54
}

// Water conversion
export const mlToOz = (ml) => ml / 29.5735
export const ozToMl = (oz) => oz * 29.5735

// Format helpers
export const formatHeightImperial = (feet, inches) => {
  return `${feet}'${inches}"`
}

export const formatHeightMetric = (cm) => {
  return `${cm} cm`
}

export const formatWeightImperial = (lbs) => {
  return `${Math.round(lbs)} lbs`
}

export const formatWeightMetric = (kg) => {
  return `${kg} kg`
}
