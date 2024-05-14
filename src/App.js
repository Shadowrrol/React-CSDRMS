import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import LoginPage from './LoginPage';
import './App.css';
import Student from './Student';
import Notification from './Notification';

import SSODashboard from './SSO/SSODashboard';
import Account from './SSO/Account';
import RegisterPrincipal from './SSO/RegisterPrincipal';
import RegisterAdviser from './SSO/RegisterAdviser';
import RegisterSSO from './SSO/RegisterSSO';
import Feedback from './SSO/Feedback';
import Case from './SSO/Case';
import Pendings from './SSO/Pendings';
import Report from './SSO/Report';
import AddStudentReport from './SSO/AddStudentReport';
import Sanction from './SSO/Sanction';


import ViewStudentCases from './ViewStudentCases';
import ViewStudentSanctions from './ViewStudentSanctions';
import PrincipalDashboard from './Principal/PrincipalDashboard';
import ViewSanctions from './Principal/ViewSanctions';

import Followup from './Adviser/Followup';
import AdviserDashboard from './Adviser/AdviserDashboard'; 
import AddStudent from './Adviser/AddStudent';
import UpdateStudent from './Adviser/UpdateStudent';
import ViewStudentReport from './Adviser/ViewStudentReport';
import AdvivserCase from './Adviser/AdviserCase';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route path="/SSODashboard" element={<SSODashboard />} />
          <Route path="/PrincipalDashboard" element={<PrincipalDashboard />} />
          <Route path="/AdviserDashboard" element={<AdviserDashboard />} />
          <Route path="/account" element={<Account  />} />
          <Route path="/register/principal" element={<RegisterPrincipal />} />
          <Route path="/register/adviser" element={<RegisterAdviser />} />
          <Route path="/register/sso" element={<RegisterSSO />} />
          <Route path="/Followup" element={<Followup />} />
          <Route path="/student" element={<Student />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/update-student/:sid" element={<UpdateStudent />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/case" element={<Case />} />
          <Route path="/pendings" element={<Pendings />} />
          <Route path="/sanctions" element={<Sanction />} />
          <Route path="/viewSanctions" element={<ViewSanctions />} />
          <Route path="/report" element={<Report />} /> 
          <Route path="/add-report/:sid" element={<AddStudentReport />} /> 
          <Route path="/view-student-report/:sid" element={<ViewStudentReport />} />
          <Route path="/view-student-cases/:sid" element={<ViewStudentCases />} /> 
          <Route path="/view-student-sanctions/:sid" element={<ViewStudentSanctions />} /> 
          <Route path="/adviserCase" element={<AdvivserCase />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
