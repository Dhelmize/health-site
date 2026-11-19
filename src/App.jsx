import { useEffect, useState } from 'react'
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
import { getActiveProfile } from './utils/storage'
import { exportToText, exportToJSON, downloadFile, copyToClipboard } from './utils/export'
import { kgToLbs, lbsToKg, cmToFtIn, ftInToCm } from './utils/conversion'
import './App.css'

const calculators = [
  { id: 'bmr', name: 'Basal metabolic rate', short: 'Estimate resting and daily energy needs.', category: 'Metabolism & Energy', icon: 'pulse', component: BmrCalc },
  { id: 'bsa', name: 'Body surface area', short: 'Calculate body surface area using Mosteller.', category: 'Body Measurements', icon: 'body', component: BsaCalc },
  { id: 'water', name: 'Daily water intake', short: 'Estimate a daily water target from body weight.', category: 'Nutrition & Hydration', icon: 'droplet', component: WaterCalc },
  { id: 'protein', name: 'Protein requirements', short: 'Estimate daily protein needs by activity level.', category: 'Nutrition & Hydration', icon: 'nutrition', component: ProteinCalc },
  { id: 'ideal-weight', name: 'Ideal body weight', short: 'Review a body weight range using the Devine method.', category: 'Weight & Goals', icon: 'scale', component: IdealWeightCalc },
  { id: 'macros', name: 'Macronutrient breakdown', short: 'Divide daily energy into carb, protein, and fat.', category: 'Nutrition & Hydration', icon: 'pie', component: MacroCalc },
  { id: 'heart-rate', name: 'Heart rate zones', short: 'Estimate training ranges with the Karvonen method.', category: 'Fitness & Cardiovascular', icon: 'heart', component: HeartRateCalc },
  { id: 'goal', name: 'Weight goal', short: 'Plan weekly change and target daily calories.', category: 'Weight & Goals', icon: 'target', component: GoalCalc },
]

const initialFormData = {
  age: '', gender: 'male', weight: '', height: '', heightFeet: '', heightInches: '',
  activityLevel: 'sedentary', workoutToday: false, unitSystem: 'metric',
  restingHeartRate: '', targetWeight: '', goalTimeline: '',
}

function Icon({ name, size = 20 }) {
  const paths = {
    discover: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    droplet: <path d="M12 2.5S5.5 9.2 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 9.2 12 2.5 12 2.5Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2H11V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L6.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 5 14H4.8v-2.5H5a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L6.2 8.5 8 6.7l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 11 5.5v-.2H14v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    pulse: <path d="M3 12h4l2.5-5 4 10 2.5-5H21"/>,
    body: <><circle cx="12" cy="5" r="2"/><path d="M8 21l1-7-3-2 2-5h8l2 5-3 2 1 7"/></>,
    nutrition: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M17 3v18M17 3c3 2 4 5 4 8h-4"/></>,
    scale: <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M12 8v4"/></>,
    pie: <><path d="M12 3a9 9 0 1 0 9 9h-9Z"/><path d="M12 3v9h9a9 9 0 0 0-9-9Z"/></>,
    heart: <path d="M20.8 8.5c0 5.5-8.8 10.5-8.8 10.5S3.2 14 3.2 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.8 1.5Z"/>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>
}

function getInitialPath() {
  return window.location.pathname === '/' ? '/discover' : window.location.pathname
}

function App() {
  const [path, setPath] = useState(getInitialPath)
  const [query, setQuery] = useState('')
  const [formData, setFormData] = useState(() => ({ ...initialFormData, ...(getActiveProfile() || {}) }))
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  useEffect(() => {
    const onPop = () => setPath(getInitialPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('health-site-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121318' : '#F7F7F5')
  }, [theme])

  const navigate = (next) => {
    if (window.location.pathname !== next) window.history.pushState({}, '', next)
    setPath(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(exportToText({}, formData))
    if (ok) window.dispatchEvent(new CustomEvent('health-toast', { detail: 'Report copied' }))
  }
  const handleExportText = () => downloadFile(exportToText({}, formData), 'health-metrics.txt')
  const handleExportJSON = () => downloadFile(exportToJSON({}, formData), 'health-metrics.json', 'application/json')

  const navItems = [
    ['discover', 'Discover', '/discover'],
    ['grid', 'Calculators', '/calculators'],
    ['droplet', 'Tracking', '/tracking'],
    ['user', 'Profiles', '/profiles'],
  ]

  const activeCalculator = calculators.find(item => `/calculator/${item.id}` === path)
  const filtered = calculators.filter(item =>
    `${item.name} ${item.short} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('/discover')} aria-label="Go to Discover">
          <span className="brand-mark"><span /></span>
          <span>Health</span>
        </button>
        <nav className="side-nav" aria-label="Primary navigation">
          {navItems.map(([icon, label, url]) => (
            <button key={url} className={path.startsWith(url) ? 'active' : ''} onClick={() => navigate(url)}>
              <Icon name={icon}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <nav className="side-nav side-nav-bottom" aria-label="Secondary navigation">
          <button className={path === '/about' ? 'active' : ''} onClick={() => navigate('/about')}><Icon name="info"/><span>About</span></button>
          <button className={path === '/settings' ? 'active' : ''} onClick={() => navigate('/settings')}><Icon name="settings"/><span>Settings</span></button>
        </nav>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => navigate('/discover')} aria-label="Go to Discover">
            <span className="brand-mark"><span /></span><span>Health</span>
          </button>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
              <Icon name={theme === 'light' ? 'target' : 'sun'} />
            </button>
          </div>
        </header>

        <main className="content">
          {path === '/discover' && (
            <section className="page discover-page">
              <div className="intro">
                <p className="eyebrow">Personal health tools</p>
                <h1>Understand your numbers.</h1>
                <p>Clear estimates for metabolism, body composition, nutrition, and daily habits.</p>
              </div>
              <label className="search-box">
                <Icon name="search" />
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search calculators" aria-label="Search calculators" />
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
              </label>
              <SectionHeading title="Featured calculators" action="View all" onAction={() => navigate('/calculators')} />
              <div className="calculator-grid">{calculators.slice(0, 4).map(item => <CalculatorCard key={item.id} item={item} navigate={navigate} />)}</div>
              <SectionHeading title="Browse by category" />
              <div className="category-grid">
                {[...new Set(calculators.map(item => item.category))].map(category => (
                  <button key={category} onClick={() => { setQuery(category); navigate('/calculators') }}>
                    <span>{category}</span><Icon name="arrow" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {path === '/calculators' && (
            <section className="page">
              <SectionHeading title="Calculator directory" />
              <label className="search-box">
                <Icon name="search" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name or category" aria-label="Search calculators" />
              </label>
              <p className="result-count">{filtered.length} calculators</p>
              {filtered.length ? <div className="calculator-grid">{filtered.map(item => <CalculatorCard key={item.id} item={item} navigate={navigate} />)}</div> :
                <div className="empty-state"><Icon name="search" /><h2>No calculators found</h2><p>Try a different name or category.</p></div>}
            </section>
          )}

          {activeCalculator && (
            <section className="page calculator-page">
              <button className="back-link" onClick={() => navigate('/calculators')}>← All calculators</button>
              <div className="calculator-heading">
                <div>
                  <p className="eyebrow">{activeCalculator.category}</p>
                  <h1>{activeCalculator.name}</h1>
                  <p>{activeCalculator.short}</p>
                </div>
                <div className="result-actions">
                  <button onClick={handleCopy}>Copy</button><button onClick={handleExportText}>TXT</button><button onClick={handleExportJSON}>JSON</button>
                </div>
              </div>
              <div className="calculator-layout">
                <Inputs formData={formData} setFormData={setFormData} />
                <div className="calculator-result-column">
                  <activeCalculator.component formData={formData} />
                  <Methodology calculator={activeCalculator} />
                </div>
              </div>
            </section>
          )}

          {path === '/profiles' && (
            <section className="page"><SectionHeading title="Saved profiles" /><ProfileSelector formData={formData} setFormData={setFormData} /></section>
          )}

          {path === '/tracking' && (
            <section className="page"><SectionHeading title="Daily tracking" /><HydrationTracker formData={formData} /></section>
          )}

          {path === '/about' && <About />}
          {path === '/settings' && (
            <Settings theme={theme} setTheme={setTheme} formData={formData} setFormData={setFormData}
              onCopy={handleCopy} onText={handleExportText} onJSON={handleExportJSON} navigate={navigate} />
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(([icon, label, url]) => (
          <button key={url} className={path.startsWith(url) ? 'active' : ''} onClick={() => navigate(url)}>
            <Icon name={icon}/><span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function SectionHeading({ title, action, onAction }) {
  return <div className="section-heading"><h2>{title}</h2>{action && <button onClick={onAction}>{action}<Icon name="arrow" size={16}/></button>}</div>
}

function CalculatorCard({ item, navigate }) {
  return (
    <button className="calculator-card" onClick={() => navigate(`/calculator/${item.id}`)}>
      <span className="calculator-icon"><Icon name={item.icon} /></span>
      <span className="calculator-card-copy"><span className="calculator-category">{item.category}</span><strong>{item.name}</strong><span>{item.short}</span></span>
      <span className="card-arrow"><Icon name="arrow" size={18}/></span>
    </button>
  )
}

function Methodology({ calculator }) {
  const methods = {
    bmr: ['Mifflin-St Jeor equation', 'Age, sex, weight, and height are used to estimate resting energy expenditure.'],
    bsa: ['Mosteller formula', 'A surface-area estimate derived from weight and height.'],
    water: ['35 mL per kilogram', 'A general estimate; adds 750 mL when a workout is selected.'],
    protein: ['Activity-based weight multiplier', 'A general estimate, not a prescription for medical or athletic conditions.'],
    'ideal-weight': ['Devine formula with a ±10% range', 'An estimate that can be less useful outside broad adult populations.'],
    macros: ['40% carbohydrate, 30% protein, 30% fat', 'The existing TDEE split is used to estimate gram targets.'],
    'heart-rate': ['220 minus age and Karvonen formula', 'Training zones are estimates and may not suit every health condition.'],
    goal: ['7700 kcal per kilogram approximation', 'A planning estimate; real weight change varies over time.'],
  }
  const [title, copy] = methods[calculator.id]
  return <aside className="methodology"><p className="eyebrow">Methodology</p><h2>{title}</h2><p>{copy}</p><p className="methodology-note">Estimates are not diagnoses or personalized medical advice.</p></aside>
}

function About() {
  return (
    <section className="page about-page">
      <p className="eyebrow">Information</p><h1>About these calculators</h1>
      <div className="info-grid">
        <article><h2>Estimates, not measurements</h2><p>These tools use common equations to turn a small set of inputs into useful planning estimates. Real physiology varies between people.</p></article>
        <article><h2>Formula limitations</h2><p>Most formulas were designed for broad populations. Pregnancy, chronic illness, medication, athletic training, and unusual body composition can limit their relevance.</p></article>
        <article><h2>Health disclaimer</h2><p>For individual dietary, exercise, or medical decisions, consult a qualified healthcare professional.</p></article>
      </div>
      <aside className="sources-panel"><p className="eyebrow">Scientific sources</p><h2>Verified formula references</h2><p>Mifflin MD, St Jeor ST, et al. “A new predictive equation for resting energy expenditure in healthy individuals.” American Journal of Clinical Nutrition. 1990.</p><p>Mosteller RD. “Simplified calculation of body-surface area.” New England Journal of Medicine. 1987.</p></aside>
    </section>
  )
}

function Settings({ theme, setTheme, formData, setFormData, onCopy, onText, onJSON, navigate }) {
  const setUnitSystem = unitSystem => {
    if (unitSystem === formData.unitSystem) return
    setFormData(previous => {
      const next = { ...previous, unitSystem }
      if (unitSystem === 'imperial') {
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
        if (previous.heightFeet !== '' || previous.heightInches !== '') {
          next.height = Math.round(ftInToCm(parseFloat(previous.heightFeet || 0), parseFloat(previous.heightInches || 0)))
          next.heightFeet = ''
          next.heightInches = ''
        }
        if (previous.targetWeight) next.targetWeight = Math.round(lbsToKg(parseFloat(previous.targetWeight)))
      }
      return next
    })
  }
  return (
    <section className="page settings-page">
      <SectionHeading title="Settings" />
      <div className="settings-list">
        <div className="setting-row"><div><h2>Appearance</h2><p>Choose your preferred theme.</p></div><div className="segmented"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Light</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Dark</button></div></div>
        <div className="setting-row"><div><h2>Units</h2><p>Used across calculators and reports.</p></div><div className="segmented"><button className={formData.unitSystem === 'metric' ? 'active' : ''} onClick={() => setUnitSystem('metric')}>Metric</button><button className={formData.unitSystem === 'imperial' ? 'active' : ''} onClick={() => setUnitSystem('imperial')}>Imperial</button></div></div>
        <div className="setting-row"><div><h2>Data export</h2><p>Browser data is not automatically synchronized across devices.</p></div><div className="button-row"><button onClick={onCopy}>Copy</button><button onClick={onText}>TXT</button><button onClick={onJSON}>JSON</button></div></div>
        <div className="setting-row"><div><h2>Saved profiles</h2><p>Manage profiles stored in this browser.</p></div><button className="setting-link" onClick={() => navigate('/profiles')}>Manage</button></div>
      </div>
    </section>
  )
}

export default App
