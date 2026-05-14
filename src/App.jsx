import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Videos from "./pages/Videos"

export default function App() {

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/videos">Videos</Link>
      </nav>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </div>
  )
}

