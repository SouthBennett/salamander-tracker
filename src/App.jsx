import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Videos from "./pages/Videos"
import Preview from "./pages/Preview"

export default function App() {

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-5xl mx-auto p-6">
        <nav className="flex gap-6 mb-8 text-lg">
          <Link 
            to="/"
            className="hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          
          <Link 
            to="/videos"
            className="hover:text-blue-400 transition-colors"
          >
            Videos
          </Link>
        </nav>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/preview/:filename" element={<Preview />} />
        </Routes>
      </div>
    </div>
  )
}

