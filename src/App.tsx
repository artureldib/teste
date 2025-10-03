import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Styleguide from './pages/Styleguide';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="border-b border-muted">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-foreground hover:text-blue-500 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/styleguide"
                className="text-foreground hover:text-blue-500 transition-colors font-medium"
              >
                Styleguide
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/styleguide" element={<Styleguide />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
