import React, { useState, useEffect } from 'react'
import { getProfiles, getActiveProfile, setActiveProfile, clearActiveProfile, deleteProfile, saveProfile } from '../utils/storage'

function ProfileSelector({ formData, setFormData }) {
  const [profiles, setProfiles] = useState([])
  const [activeProfile, setActiveProfileState] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = () => {
    const allProfiles = getProfiles()
    const active = getActiveProfile()
    setProfiles(allProfiles)
    setActiveProfileState(active)

    if (active) {
      setFormData(prev => ({ ...prev, ...active }))
    }
  }

  const handleSaveProfile = () => {
    if (!profileName.trim()) return

    const profileData = {
      ...formData,
      name: profileName.trim()
    }

    saveProfile(profileData)
    setProfileName('')
    loadProfiles()
  }

  const handleLoadProfile = (profile) => {
    setActiveProfile(profile.id)
    setActiveProfileState(profile)
    setFormData(prev => ({ ...prev, ...profile }))
    setShowDropdown(false)
  }

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation()
    deleteProfile(profileId)
    loadProfiles()
  }

  const handleClearProfile = () => {
    clearActiveProfile()
    setActiveProfileState(null)
    setFormData({
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      activityLevel: 'sedentary',
      workoutToday: false,
      unitSystem: 'metric',
      restingHeartRate: '',
      targetWeight: '',
      goalTimeline: ''
    })
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:border-neutral-600 transition-all flex items-center gap-2"
        >
          {activeProfile ? activeProfile.name : 'Select Profile'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10">
            <div className="p-3 border-b border-neutral-700">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Profile name..."
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-sm text-neutral-100 placeholder-neutral-500"
              />
              <button
                onClick={handleSaveProfile}
                className="w-full mt-2 px-3 py-2 bg-neutral-700 text-sm text-neutral-100 rounded hover:bg-neutral-600 transition-all"
              >
                Save Current as Profile
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {profiles.length === 0 ? (
                <p className="p-3 text-sm text-neutral-500 text-center">No saved profiles</p>
              ) : (
                profiles.map(profile => (
                  <div
                    key={profile.id}
                    onClick={() => handleLoadProfile(profile)}
                    className="flex justify-between items-center px-3 py-2 hover:bg-neutral-800 cursor-pointer group"
                  >
                    <span className="text-sm text-neutral-300">{profile.name}</span>
                    <button
                      onClick={(e) => handleDeleteProfile(e, profile.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {activeProfile && (
        <button
          onClick={handleClearProfile}
          className="px-3 py-2 text-sm text-neutral-500 hover:text-neutral-300 transition-all"
        >
          Clear Profile
        </button>
      )}
    </div>
  )
}

export default ProfileSelector
