import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<SeasonListPage />} />
        <Route path="/season/:seasonId" element={<SeasonDetailsPage />} />
      </Routes>
    </div>
  )
}

function SeasonListPage() {
  return (
    <h1 className="text-3xl font-bold text-blue-600 dark:text-yellow-400">Season List Page (placeholder)</h1>
  );
}

function SeasonDetailsPage() {
  return (
    <h1 className="text-3xl font-bold text-green-600 dark:text-yellow-400">Season Details Page (placeholder)</h1>
  );
}

export default App
