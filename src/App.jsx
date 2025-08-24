import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import BiographyBuilder from './infoboxes/biography/BiographyBuilder'
import ElectionBuilder from './infoboxes/election/ElectionBuilder'

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
          <Link to="/biography" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff' }}>
            Biography Builder
          </Link>
          <Link to="/election" style={{ textDecoration: 'none', color: '#007bff' }}>
            Election Builder
          </Link>
        </nav>

        <Routes>
          <Route path="/biography" element={<BiographyBuilder />} />
          <Route path="/election" element={<ElectionBuilder />} />
          <Route path="/" element={<BiographyBuilder />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App