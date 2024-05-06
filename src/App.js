import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import LoginPage from './LoginPage';
import SSO_Dashboard from './SSO/SSO_Dashboard';
import AdminDashboard from './Admin/AdminDashboard';
import AdviserDashboard from './Adviser/AdviserDashboard'; // Import your other dashboard components here
import PrincipalDashboard from './Principal/PrincipalDashboard';
import Account from './SSO/Account';
import RegisterPrincipal from './SSO/RegisterPrincipal';
import RegisterAdviser from './SSO/RegisterAdviser';
import RegisterSSO from './SSO/RegisterSSO';
import Student from './Adviser/Student';
import AddStudent from './Adviser/AddStudent';
import UpdateStudent from './Adviser/UpdateStudent';
import Notification from './SSO/Notification';
import Feedback from './SSO/Feedback';
import Case from './SSO/Case';
import Pendings from './SSO/Pendings';



import Report from './SSO/Report';
import AddStudentReport from './SSO/AddStudentReport';
import ViewStudentReport from './Principal/ViewStudentReport';
import Followup from './SSO/Followup';
import Sanction from './SSO/Sanction';
import ViewSanctions from './Principal/ViewSanctions';
import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route path="/SSO_Dashboard" element={<SSO_Dashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/PrincipalDashboard" element={<PrincipalDashboard />} />
          <Route path="/AdviserDashboard" element={<AdviserDashboard />} />
          <Route path="/account" element={<Account  />} />
          <Route path="/register/principal" element={<RegisterPrincipal />} />
          <Route path="/register/adviser" element={<RegisterAdviser />} />
          <Route path="/register/sso" element={<RegisterSSO />} />
          <Route path="/student" element={<Student />} />
          <Route path="/Followup" element={<Followup />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/update-student/:sid" element={<UpdateStudent />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/case" element={<Case />} />
          <Route path="/pendings" element={<Pendings />} />


          <Route path="/sanctions" element={<Sanction />} />
          <Route path="/viewSanctions" element={<ViewSanctions />} />
          <Route path="/report" element={<Report />} /> 
          <Route path="/add-report/:sid" element={<AddStudentReport />} /> {/* Add the route for AddStudentReport */}
          <Route path="/view-student-report/:sid" element={<ViewStudentReport />} /> {/* Add route for ViewStudentReport */}
           {/* Add the route for UpdateStudent */}
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
