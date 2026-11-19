import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateBmr, calculateTdee, calculateBsa, calculateWater, calculateProtein } from './calculations.js'

const metric = {
  age: '30',
  gender: 'male',
  weight: '70',
  height: '175',
  unitSystem: 'metric',
  activityLevel: 'sedentary',
  workoutToday: false,
}

test('Mifflin-St Jeor male baseline is preserved', () => {
  assert.equal(calculateBmr(metric), 1649)
  assert.equal(calculateTdee(metric), 1979)
})

test('Mosteller BSA baseline is preserved', () => {
  assert.equal(calculateBsa(metric), '1.84')
})

test('water and protein baselines are preserved', () => {
  assert.equal(calculateWater(metric), 2450)
  assert.equal(calculateProtein(metric), 56)
  assert.equal(calculateWater({ ...metric, workoutToday: true }), 3200)
})

test('imperial inputs use the existing conversions', () => {
  const imperial = {
    ...metric,
    unitSystem: 'imperial',
    weight: '154',
    heightFeet: '5',
    heightInches: '9',
  }
  assert.equal(calculateBmr(imperial), 1649)
  assert.equal(calculateBsa(imperial), '1.84')
})
