// import { useState } from 'react'

import './App.css'
import { AuthCallback } from './Auth/AuthCallback';
import { useTokenAutoRefresh } from './Auth/UseAuthAutoRefreshOptions'
import { Dashboard } from './components/dashboard';
import { LoginForm } from './components/login-form'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
function App() {
  // const [count, setCount] = useState(0)
  useTokenAutoRefresh();
  return (
    <>
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback></AuthCallback>}></Route>
        <Route path="/login" element={<LoginForm></LoginForm>}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    
      <LoginForm></LoginForm>
      
    </>
  )
}

export default App
