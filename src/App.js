import React, { lazy, useEffect, Suspense } from 'react'

import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { themeChange } from 'theme-change'

// 1. ALL Static Imports first
import checkAuth from './app/auth';
import initializeApp from './app/init';
import Login from './features/user/Login';

// 2. ALL Lazy Imports next
const Layout = lazy(() => import('./containers/Layout'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Register = lazy(() => import('./pages/Register'))
const Documentation = lazy(() => import('./pages/Documentation'))

// 3. Execution/Initialization logic last
initializeApp()
const token = checkAuth()

function App() {

  const token = localStorage.getItem("token");

  useEffect(() => {
    
    themeChange(false)
  }, [])

  return (
    <>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/documentation" element={<Documentation />} />
          
          {/* Place new routes over this */}
          <Route path="/app/*" element={<Layout />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to={token ? "/app/welcome" : "/login"} replace />}/>
        </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App