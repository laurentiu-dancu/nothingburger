import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Record from './pages/Record'
import Match from './pages/Match'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <Routes>
          <Route path="/" element={<Record />} />
          <Route path="/match" element={<Match />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App