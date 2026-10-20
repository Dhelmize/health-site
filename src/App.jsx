import { useState } from 'react'
import Inputs from './components/Inputs'
import ProfileSelector from './components/ProfileSelector'
import BmrCalc from './components/Calculators/BmrCalc'
import BsaCalc from './components/Calculators/BsaCalc'
import WaterCalc from './components/Calculators/WaterCalc'
import ProteinCalc from './components/Calculators/ProteinCalc'
import IdealWeightCalc from './components/Calculators/IdealWeightCalc'
import MacroCalc from './components/Calculators/MacroCalc'
import HeartRateCalc from './components/Calculators/HeartRateCalc'
import GoalCalc from './components/Calculators/GoalCalc'
import HydrationTracker from './components/HydrationTracker'
import { exportToText, exportToJSON, downloadFile, copyToClipboard } from './utils/export'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    heightFeet: '',
    heightInches: '',
    activityLevel: 'sedentary',
    workoutToday: false,
    unitSystem: 'metric',
    restingHeartRate: '',
    targetWeight: '',
    goalTimeline: ''
  })

  const handleExportText = () => {
    const text = exportToText({}, formData)
    downloadFile(text, 'health-metrics.txt')
  }

  const handleExportJSON = () => {
    const json = exportToJSON({}, formData)
    downloadFile(json, 'health-metrics.json', 'application/json')
  }

  const handleCopyToClipboard = async () => {
    const text = exportToText({}, formData)
    const success = await copyToClipboard(text)
    if (success) {
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-neutral-100 mb-2">
                Health Metrics Dashboard
              </h1>
              <p className="text-neutral-400">
                Calculate your personalized health metrics based on scientific formulas
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
              >
                Copy
              </button>
              <button
                onClick={handleExportText}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
              >
                Export TXT
              </button>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all"
              >
                Export JSON
              </button>
            </div>
          </div>
          <ProfileSelector formData={formData} setFormData={setFormData} />
        </header>

        <Inputs formData={formData} setFormData={setFormData} />

        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-100 mb-6">Core Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BmrCalc formData={formData} />
            <BsaCalc formData={formData} />
            <WaterCalc formData={formData} />
            <ProteinCalc formData={formData} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-100 mb-6">Advanced Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <IdealWeightCalc formData={formData} />
            <MacroCalc formData={formData} />
            <HeartRateCalc formData={formData} />
            <GoalCalc formData={formData} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-100 mb-6">Daily Tracking</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HydrationTracker formData={formData} />
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
