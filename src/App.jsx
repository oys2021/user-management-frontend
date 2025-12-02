import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import Signup from './pages/SignupForm'
import ProfileForm from './pages/ProfileForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginForm />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<ProfileForm />}/>

      </Routes>
    </Router>
  )
}

export default App
