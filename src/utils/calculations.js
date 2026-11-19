import { lbsToKg, ftInToCm } from './conversion.js'

export const heightToCm = (formData) =>
  formData.unitSystem === 'imperial'
    ? ftInToCm(parseFloat(formData.heightFeet || 0), parseFloat(formData.heightInches || 0))
    : parseFloat(formData.height || 0)

export const weightToKg = (formData) =>
  formData.unitSystem === 'imperial'
    ? lbsToKg(parseFloat(formData.weight || 0))
    : parseFloat(formData.weight || 0)

export const calculateBmr = (formData) => {
  const age = parseFloat(formData.age)
  const weightKg = weightToKg(formData)
  const heightCm = heightToCm(formData)
  if (!age || !weightKg || !heightCm) return null
  const value = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + (formData.gender === 'male' ? 5 : -161)
  return Math.round(value)
}

export const calculateTdee = (formData) => {
  const bmr = calculateBmr(formData)
  if (!bmr) return null
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  }
  return Math.round(bmr * (multipliers[formData.activityLevel] || 1.2))
}

export const calculateBsa = (formData) => {
  const weightKg = weightToKg(formData)
  const heightCm = heightToCm(formData)
  if (!weightKg || !heightCm) return null
  return Math.sqrt((heightCm * weightKg) / 3600).toFixed(2)
}

export const calculateWater = (formData) => {
  const weightKg = weightToKg(formData)
  if (!weightKg) return null
  return Math.round((weightKg * 35) + (formData.workoutToday ? 750 : 0))
}

export const calculateProtein = (formData) => {
  const weightKg = weightToKg(formData)
  if (!weightKg) return null
  const multipliers = {
    sedentary: 0.8,
    lightly_active: 1.2,
    moderately_active: 1.4,
    very_active: 1.8,
    extremely_active: 2.0,
  }
  return Math.round(weightKg * (multipliers[formData.activityLevel] || 0.8))
}
