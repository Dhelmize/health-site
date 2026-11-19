import test from 'node:test'
import assert from 'node:assert/strict'
import { exportToText, exportToJSON } from './export.js'

test('text export preserves personal information and disclaimer', () => {
  const text = exportToText({}, {
    age: '30', gender: 'male', weight: '70', height: '175',
    unitSystem: 'metric', activityLevel: 'sedentary',
  })
  assert.match(text, /Health Metrics Report/)
  assert.match(text, /Age: 30 years/)
  assert.match(text, /Height: 175 cm/)
  assert.match(text, /Disclaimer/)
})

test('JSON export preserves the existing schema fields', () => {
  const data = JSON.parse(exportToJSON({}, {
    unitSystem: 'metric', age: '30', gender: 'female', weight: '60',
    height: '165', activityLevel: 'lightly_active',
    restingHeartRate: '68', targetWeight: '58', goalTimeline: '10',
  }))
  assert.equal(data.unitSystem, 'metric')
  assert.equal(data.personalInfo.age, '30')
  assert.equal(data.personalInfo.height, '165 cm')
  assert.equal(data.personalInfo.targetWeight, '58')
})
