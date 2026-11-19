import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from '../utils/conversion'

function Inputs({ formData, setFormData }) {
  const change = event => {
    const { name, value, type, checked } = event.target
    setFormData(previous => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleUnits = () => {
    setFormData(previous => {
      const imperial = previous.unitSystem === 'imperial'
      const next = { ...previous, unitSystem: imperial ? 'metric' : 'imperial' }
      if (!imperial) {
        if (previous.weight) next.weight = Math.round(kgToLbs(parseFloat(previous.weight)))
        if (previous.height) {
          const { feet, inches } = cmToFtIn(parseFloat(previous.height))
          next.heightFeet = feet
          next.heightInches = inches
          next.height = ''
        }
        if (previous.targetWeight) next.targetWeight = Math.round(kgToLbs(parseFloat(previous.targetWeight)))
      } else {
        if (previous.weight) next.weight = Math.round(lbsToKg(parseFloat(previous.weight)))
        if (previous.heightFeet !== '' && previous.heightInches !== '') {
          next.height = Math.round(ftInToCm(parseFloat(previous.heightFeet || 0), parseFloat(previous.heightInches || 0)))
          next.heightFeet = ''
          next.heightInches = ''
        }
        if (previous.targetWeight) next.targetWeight = Math.round(lbsToKg(parseFloat(previous.targetWeight)))
      }
      return next
    })
  }

  const isImperial = formData.unitSystem === 'imperial'
  return (
    <section className="input-panel">
      <div className="panel-heading"><h2>Your information</h2><button type="button" className="unit-toggle" onClick={toggleUnits}>{isImperial ? 'Metric' : 'Imperial'} units</button></div>
      <div className="input-grid">
        <label>Age<input type="number" inputMode="numeric" name="age" value={formData.age} onChange={change} placeholder="30"/></label>
        <label>Gender<select name="gender" value={formData.gender} onChange={change}><option value="male">Male</option><option value="female">Female</option></select></label>
        <label>Weight <span>{isImperial ? 'lbs' : 'kg'}</span><input type="number" inputMode="decimal" name="weight" value={formData.weight} onChange={change} placeholder={isImperial ? '154' : '70'}/></label>
        {isImperial ? (
          <div className="height-input"><label>Height <span>ft</span><input type="number" inputMode="numeric" name="heightFeet" value={formData.heightFeet || ''} onChange={change} placeholder="5"/></label><label><span>in</span><input type="number" inputMode="numeric" name="heightInches" value={formData.heightInches || ''} onChange={change} placeholder="9"/></label></div>
        ) : (
          <label>Height <span>cm</span><input type="number" inputMode="decimal" name="height" value={formData.height} onChange={change} placeholder="175"/></label>
        )}
        <label>Activity level<select name="activityLevel" value={formData.activityLevel} onChange={change}><option value="sedentary">Sedentary</option><option value="lightly_active">Lightly active</option><option value="moderately_active">Moderately active</option><option value="very_active">Very active</option><option value="extremely_active">Extremely active</option></select></label>
        <label className="checkbox-label"><input type="checkbox" name="workoutToday" checked={formData.workoutToday} onChange={change}/><span>Worked out today</span></label>
        <label>Resting heart rate <span>bpm</span><input type="number" inputMode="numeric" name="restingHeartRate" value={formData.restingHeartRate || ''} onChange={change} placeholder="70"/></label>
        <label>Target weight <span>{isImperial ? 'lbs' : 'kg'}</span><input type="number" inputMode="decimal" name="targetWeight" value={formData.targetWeight || ''} onChange={change} placeholder={isImperial ? '150' : '68'}/></label>
        <label>Goal timeline <span>weeks</span><input type="number" inputMode="numeric" name="goalTimeline" value={formData.goalTimeline || ''} onChange={change} placeholder="12"/></label>
      </div>
    </section>
  )
}

export default Inputs
