import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Record from './pages/Record'
import Match from './pages/Match'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Record />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </div>
  )
}

export default App