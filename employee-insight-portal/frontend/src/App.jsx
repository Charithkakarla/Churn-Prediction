import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="w-full">
          <div className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employee/:id" element={<EmployeeDetail />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
