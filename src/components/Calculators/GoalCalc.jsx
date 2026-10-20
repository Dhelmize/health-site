import React from 'react'
import { kgToLbs, lbsToKg } from '../../utils/conversion'

function GoalCalc({ formData }) {
  const calculateGoal = () => {
    const { weight, targetWeight, goalTimeline, unitSystem } = formData

    if (!weight || !targetWeight || !goalTimeline) return null

    const currentWeightKg = unitSystem === 'imperial' ? lbsToKg(parseFloat(weight)) : parseFloat(weight)
    const targetWeightKg = unitSystem === 'imperial' ? lbsToKg(parseFloat(targetWeight)) : parseFloat(targetWeight)
    const weeks = parseFloat(goalTimeline)

    const weightDifferenceKg = targetWeightKg - currentWeightKg
    const weeklyChangeKg = weightDifferenceKg / weeks

    // 1 kg = ~7700 calories
    const dailyCalorieChange = Math.round((weeklyChangeKg * 7700) / 7)

    // Calculate current TDEE (simplified - needs full calculation)
    const { age, gender, height, heightFeet, heightInches, activityLevel } = formData
    if (!age || !height || (unitSystem === 'imperial' && (!heightFeet || !heightInches))) return null

    let heightCm
    if (unitSystem === 'imperial') {
      heightCm = (parseFloat(heightFeet) * 30.48) + (parseFloat(heightInches) * 2.54)
    } else {
      heightCm = parseFloat(height)
    }

    const ageNum = parseFloat(age)
    let bmr
    if (gender === 'male') {
      bmr = (10 * currentWeightKg) + (6.25 * heightCm) - (5 * ageNum) + 5
    } else {
      bmr = (10 * currentWeightKg) + (6.25 * heightCm) - (5 * ageNum) - 161
    }

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    }

    const tdee = Math.round(bmr * activityMultipliers[activityLevel])
    const targetDailyCalories = tdee + dailyCalorieChange

    const goalDate = new Date()
    goalDate.setDate(goalDate.getDate() + (weeks * 7))

    return {
      weightDifference: Math.round(weightDifferenceKg),
      weeklyChange: Math.round(weeklyChangeKg * 10) / 10,
      dailyCalorieChange,
      tdee,
      targetDailyCalories,
      goalDate: goalDate.toLocaleDateString()
    }
  }

  const goalData = calculateGoal()

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl hover:border-neutral-600 transition-all">
      <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wide">
        Weight Goal
      </h3>
      {goalData ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Target Date</p>
            <p className="text-lg font-bold text-neutral-100">{goalData.goalDate}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500">Weight Change</p>
              <p className={`text-lg font-bold ${goalData.weightDifference < 0 ? 'text-green-400' : 'text-orange-400'}`}>
                {goalData.weightDifference > 0 ? '+' : ''}{formData.unitSystem === 'imperial' ? Math.round(kgToLbs(goalData.weightDifference)) : goalData.weightDifference} {formData.unitSystem === 'imperial' ? 'lbs' : 'kg'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Weekly</p>
              <p className="text-sm font-medium text-neutral-100">
                {goalData.weeklyChange > 0 ? '+' : ''}{goalData.weeklyChange} {formData.unitSystem === 'imperial' ? Math.round(kgToLbs(goalData.weeklyChange)) : goalData.weeklyChange} {formData.unitSystem === 'imperial' ? 'lbs' : 'kg'}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-3">
            <p className="text-xs text-neutral-500 mb-1">Daily Calorie {goalData.dailyCalorieChange < 0 ? 'Deficit' : 'Surplus'}</p>
            <p className={`text-2xl font-bold ${goalData.dailyCalorieChange < 0 ? 'text-green-400' : 'text-orange-400'}`}>
              {goalData.dailyCalorieChange > 0 ? '+' : ''}{goalData.dailyCalorieChange} kcal
            </p>
          </div>

          <div className="border-t border-neutral-700 pt-3">
            <p className="text-xs text-neutral-500 mb-1">Target Daily Calories</p>
            <p className="text-xl font-bold text-neutral-100">{goalData.targetDailyCalories} kcal</p>
            <p className="text-xs text-neutral-500 mt-1">Based on TDEE: {goalData.tdee} kcal</p>
          </div>
        </div>
      ) : (
        <p className="text-neutral-500 text-sm">Enter target weight and timeline</p>
      )}
    </div>
  )
}

export default GoalCalc
