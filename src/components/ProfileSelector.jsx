import { useState } from 'react'
import { getProfiles, getActiveProfile, setActiveProfile, clearActiveProfile, deleteProfile, saveProfile } from '../utils/storage'

function ProfileSelector({ formData, setFormData }) {
  const [profiles, setProfiles] = useState(() => getProfiles())
  const [activeProfile, setActiveProfileState] = useState(() => getActiveProfile())
  const [profileName, setProfileName] = useState('')

  const refresh = () => {
    setProfiles(getProfiles())
    setActiveProfileState(getActiveProfile())
  }

  const save = () => {
    if (!profileName.trim()) return
    const ok = saveProfile({ ...formData, name: profileName.trim() })
    if (ok) {
      setProfileName('')
      refresh()
    }
  }

  const load = profile => {
    setActiveProfile(profile.id)
    setActiveProfileState(profile)
    setFormData(previous => ({ ...previous, ...profile }))
  }

  const remove = (event, id) => {
    event.stopPropagation()
    deleteProfile(id)
    refresh()
  }

  const clear = () => {
    clearActiveProfile()
    setActiveProfileState(null)
    setFormData({
      age: '', gender: 'male', weight: '', height: '', heightFeet: '', heightInches: '',
      activityLevel: 'sedentary', workoutToday: false, unitSystem: 'metric',
      restingHeartRate: '', targetWeight: '', goalTimeline: '',
    })
  }

  return (
    <div className="profiles-layout">
      <section className="profile-create">
        <h2>Save current information</h2>
        <p>Create a profile for the values entered across the calculators.</p>
        <label>Profile name<input value={profileName} onChange={event => setProfileName(event.target.value)} placeholder="e.g. Everyday profile"/></label>
        <button className="primary-button" onClick={save} disabled={!profileName.trim()}>Save profile</button>
      </section>
      <section className="profile-list">
        <div className="profile-list-heading"><h2>Saved profiles</h2>{activeProfile && <button onClick={clear}>Clear active</button>}</div>
        {profiles.length === 0 ? <div className="empty-state"><h2>No saved profiles</h2><p>Save the current values to create your first profile.</p></div> :
          profiles.map(profile => (
            <button className={`profile-row ${activeProfile?.id === profile.id ? 'active' : ''}`} key={profile.id} onClick={() => load(profile)}>
              <span><strong>{profile.name}</strong><small>{profile.age ? `${profile.age} years` : 'No age saved'} · {profile.unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</small></span>
              <span role="button" tabIndex={0} className="delete-profile" onClick={event => remove(event, profile.id)} aria-label={`Delete ${profile.name}`}>×</span>
            </button>
          ))}
      </section>
    </div>
  )
}

export default ProfileSelector
