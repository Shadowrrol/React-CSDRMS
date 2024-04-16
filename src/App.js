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
          <Route path="/account" element={<Account />} />
          <Route path="/register/principal" element={<RegisterSSO />} />
          <Route path="/register/adviser" component={RegisterAdviser} />
          <Route path="/register/sso" element={<RegisterSSO />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
