import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/LoginForm';
import Signup from './pages/SignupForm';
import ProfileForm from './pages/ProfileForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

export default App;
