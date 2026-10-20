import React from 'react'

function MacroPie({ macros }) {
  if (!macros) return null

  const carbs = macros.carbs * 4
  const protein = macros.protein * 4
  const fat = macros.fat * 9
  const total = carbs + protein + fat

  const carbPercent = (carbs / total) * 100
  const proteinPercent = (protein / total) * 100
  const fatPercent = (fat / total) * 100

  // Calculate conic gradient
  const gradient = `conic-gradient(
    #3b82f6 0% ${carbPercent}%,
    #22c55e ${carbPercent}% ${carbPercent + proteinPercent}%,
    #f59e0b ${carbPercent + proteinPercent}% 100%
  )`

  return (
    <div className="flex items-center gap-4 mt-4">
      <div
        className="w-20 h-20 rounded-full"
        style={{ background: gradient }}
      />

      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-neutral-400">Carbs: {Math.round(carbPercent)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-neutral-400">Protein: {Math.round(proteinPercent)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-neutral-400">Fat: {Math.round(fatPercent)}%</span>
        </div>
      </div>
    </div>
  )
}

export default MacroPie
