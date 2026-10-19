import { useState } from 'react'
import Inputs from './components/Inputs'
import BmrCalc from './components/Calculators/BmrCalc'
import BsaCalc from './components/Calculators/BsaCalc'
import WaterCalc from './components/Calculators/WaterCalc'
import ProteinCalc from './components/Calculators/ProteinCalc'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    workoutToday: false
  })

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-100 mb-2">
            Health Metrics Dashboard
          </h1>
          <p className="text-neutral-400">
            Calculate your personalized health metrics based on scientific formulas
          </p>
        </header>

        <Inputs formData={formData} setFormData={setFormData} />

        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-100 mb-6">Your Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BmrCalc formData={formData} />
            <BsaCalc formData={formData} />
            <WaterCalc formData={formData} />
            <ProteinCalc formData={formData} />
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-500 text-center">
            <strong>Disclaimer:</strong> These calculations are estimates based on standard formulas.
            Consult a healthcare professional for personalized medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
