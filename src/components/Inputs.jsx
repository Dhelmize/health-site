import React from 'react'
import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from '../utils/conversion'

function Inputs({ formData, setFormData }) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUnitToggle = () => {
    const newUnitSystem = formData.unitSystem === 'metric' ? 'imperial' : 'metric'

    setFormData(prev => {
      const newData = { ...prev, unitSystem: newUnitSystem }

      if (newUnitSystem === 'imperial') {
        // Convert metric to imperial
        if (prev.weight) {
          newData.weight = Math.round(kgToLbs(parseFloat(prev.weight)))
        }
        if (prev.height) {
          const { feet, inches } = cmToFtIn(parseFloat(prev.height))
          newData.heightFeet = feet
          newData.heightInches = inches
          newData.height = null
        }
        if (prev.targetWeight) {
          newData.targetWeight = Math.round(kgToLbs(parseFloat(prev.targetWeight)))
        }
      } else {
        // Convert imperial to metric
        if (prev.weight) {
          newData.weight = Math.round(lbsToKg(parseFloat(prev.weight)))
        }
        if (prev.heightFeet && prev.heightInches) {
          newData.height = Math.round(ftInToCm(parseFloat(prev.heightFeet), parseFloat(prev.heightInches)))
          newData.heightFeet = null
          newData.heightInches = null
        }
        if (prev.targetWeight) {
          newData.targetWeight = Math.round(lbsToKg(parseFloat(prev.targetWeight)))
        }
      }

      return newData
    })
  }

  const isImperial = formData.unitSystem === 'imperial'

  return (
    <div className="bg-neutral-850 rounded-2xl border border-neutral-700 p-8 mb-8 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-neutral-100">Your Information</h2>
        <button
          onClick={handleUnitToggle}
          className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
        >
          {isImperial ? 'Switch to Metric' : 'Switch to Imperial'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Age (years)
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder="e.g., 30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 transition-all"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Weight ({isImperial ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder={isImperial ? 'e.g., 154' : 'e.g., 70'}
          />
        </div>

        {isImperial ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Height (ft)
              </label>
              <input
                type="number"
                name="heightFeet"
                value={formData.heightFeet || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                Height (in)
              </label>
              <input
                type="number"
                name="heightInches"
                value={formData.heightInches || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
                placeholder="e.g., 9"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
              placeholder="e.g., 175"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Activity Level
          </label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 transition-all"
          >
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="lightly_active">Lightly Active (1-3 days/week)</option>
            <option value="moderately_active">Moderately Active (3-5 days/week)</option>
            <option value="very_active">Very Active (6-7 days/week)</option>
            <option value="extremely_active">Extremely Active (training twice/day)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="workoutToday"
            id="workoutToday"
            checked={formData.workoutToday}
            onChange={handleInputChange}
            className="w-5 h-5 text-neutral-500 border-neutral-700 rounded focus:ring-neutral-500 bg-neutral-900 transition-all"
          />
          <label
            htmlFor="workoutToday"
            className="ml-3 text-sm font-medium text-neutral-400"
          >
            Did you work out today?
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Resting Heart Rate (bpm)
          </label>
          <input
            type="number"
            name="restingHeartRate"
            value={formData.restingHeartRate || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder="e.g., 70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Target Weight ({isImperial ? 'lbs' : 'kg'})
          </label>
          <input
            type="number"
            name="targetWeight"
            value={formData.targetWeight || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder={isImperial ? 'e.g., 150' : 'e.g., 68'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Goal Timeline (weeks)
          </label>
          <input
            type="number"
            name="goalTimeline"
            value={formData.goalTimeline || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder="e.g., 12"
          />
        </div>
      </div>
    </div>
  )
}

export default Inputs
