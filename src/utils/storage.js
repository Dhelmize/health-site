const STORAGE_KEY = 'health-site-profiles'
const ACTIVE_PROFILE_KEY = 'health-site-active-profile'

export const saveProfile = (profileData) => {
  try {
    const profiles = getProfiles()
    const existingIndex = profiles.findIndex(p => p.id === profileData.id)

    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...profileData, updatedAt: Date.now() }
    } else {
      profiles.push({ ...profileData, id: profileData.id || Date.now().toString(), createdAt: Date.now(), updatedAt: Date.now() })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    return true
  } catch (error) {
    console.error('Error saving profile:', error)
    return false
  }
}

export const getProfiles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error getting profiles:', error)
    return []
  }
}

export const deleteProfile = (profileId) => {
  try {
    const profiles = getProfiles()
    const filtered = profiles.filter(p => p.id !== profileId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))

    const activeProfile = getActiveProfile()
    if (activeProfile?.id === profileId) {
      localStorage.removeItem(ACTIVE_PROFILE_KEY)
    }

    return true
  } catch (error) {
    console.error('Error deleting profile:', error)
    return false
  }
}

export const setActiveProfile = (profileId) => {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
    return true
  } catch (error) {
    console.error('Error setting active profile:', error)
    return false
  }
}

export const getActiveProfile = () => {
  try {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY)
    if (!activeId) return null

    const profiles = getProfiles()
    return profiles.find(p => p.id === activeId) || null
  } catch (error) {
    console.error('Error getting active profile:', error)
    return null
  }
}

export const clearActiveProfile = () => {
  try {
    localStorage.removeItem(ACTIVE_PROFILE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing active profile:', error)
    return false
  }
}
