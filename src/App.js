import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import LoginPage from './LoginPage';
import SSO_Dashboard from './SSO_Dashboard';
import AdminDashboard from './AdminDashboard';
import AdviserDashboard from './AdviserDashboard'; // Import your other dashboard components here
import PrincipalDashboard from './PrincipalDashboard';
import Account from './Account';
import RegisterPrincipal from './RegisterPrincipal';
import RegisterAdviser from './RegisterAdviser';
import RegisterSSO from './RegisterSSO';
import Student from './Student';
import AddStudent from './AddStudent';
import UpdateStudent from './UpdateStudent';
import SSORegister from './pages/SSORegister';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage setLoggedIn={setLoggedIn} />} />
          <Route path="/SSO_Dashboard" element={<SSO_Dashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/PrincipalDashboard" element={<PrincipalDashboard />} />
          <Route path="/AdviserDashboard" element={<AdviserDashboard />} />
          <Route path="/account" element={<SSORegister  />} />
          <Route path="/register/principal" element={<RegisterPrincipal />} />
          <Route path="/register/adviser" element={<RegisterAdviser />} />
          <Route path="/register/sso" element={<RegisterSSO />} />
          <Route path="/student" element={<Student />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/update-student/:sid" element={<UpdateStudent />} /> {/* Add the route for UpdateStudent */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
