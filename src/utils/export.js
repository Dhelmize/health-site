export const exportToText = (results, formData) => {
  const date = new Date().toLocaleDateString()
  const unitSystem = formData.unitSystem === 'imperial' ? 'Imperial' : 'Metric'

  let text = `Health Metrics Report\n`
  text += `Generated: ${date}\n`
  text += `Unit System: ${unitSystem}\n\n`

  text += `--- Personal Information ---\n`
  text += `Age: ${formData.age} years\n`
  text += `Gender: ${formData.gender}\n`
  text += `Weight: ${formData.weight} ${formData.unitSystem === 'imperial' ? 'lbs' : 'kg'}\n`
  if (formData.unitSystem === 'imperial') {
    text += `Height: ${formData.heightFeet}'${formData.heightInches}"\n`
  } else {
    text += `Height: ${formData.height} cm\n`
  }
  text += `Activity Level: ${formData.activityLevel}\n`
  if (formData.restingHeartRate) {
    text += `Resting Heart Rate: ${formData.restingHeartRate} bpm\n`
  }
  text += `\n`

  text += `--- Disclaimer ---\n`
  text += `These calculations are estimates based on standard formulas.\n`
  text += `Consult a healthcare professional for personalized medical advice.\n`

  return text
}

export const exportToJSON = (results, formData) => {
  const data = {
    generated: new Date().toISOString(),
    unitSystem: formData.unitSystem,
    personalInfo: {
      age: formData.age,
      gender: formData.gender,
      weight: formData.weight,
      height: formData.unitSystem === 'imperial' ? `${formData.heightFeet}'${formData.heightInches}"` : `${formData.height} cm`,
      activityLevel: formData.activityLevel,
      restingHeartRate: formData.restingHeartRate,
      targetWeight: formData.targetWeight,
      goalTimeline: formData.goalTimeline
    }
  }

  return JSON.stringify(data, null, 2)
}

export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}
