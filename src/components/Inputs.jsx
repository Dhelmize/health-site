import React from 'react'

function Inputs({ formData, setFormData }) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="bg-neutral-850 rounded-2xl border border-neutral-700 p-8 mb-8 shadow-lg">
      <h2 className="text-xl font-bold text-neutral-100 mb-6">Your Information</h2>
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
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-neutral-100 placeholder-neutral-600 transition-all"
            placeholder="e.g., 70"
          />
        </div>

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
      </div>
    </div>
  )
}

export default Inputs
