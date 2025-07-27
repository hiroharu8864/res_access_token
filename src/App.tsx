import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './router/Navigation'
import AppRouter from './router/AppRouter'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <AppRouter />
      </div>
    </Router>
  )
}

export default App
