import './App.css'
import { Routes, Route } from 'react-router-dom'
import SeasonListPage from './pages/SeasonListPage'
import SeasonDetailsPage from './pages/SeasonDetailsPage'
import { SeasonProvider } from './context/Season/SeasonProvider'

function App() {
  return (
    <SeasonProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<SeasonListPage />} />
          <Route path="/season/:seasonId" element={<SeasonDetailsPage />} />
        </Routes>
      </div>
    </SeasonProvider>
  )
}

export default App
