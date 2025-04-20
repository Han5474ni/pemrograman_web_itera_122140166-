import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import { BookProvider } from './context/BookContext';
import './App.css';

function App() {
  return (
    <Router>
      <BookProvider>
        <div className="app">
          <nav className="nav-menu">
            <Link to="/">Daftar Buku</Link>
            <Link to="/stats">Statistik</Link>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </main>
        </div>
      </BookProvider>
    </Router>
  )
}

export default App
