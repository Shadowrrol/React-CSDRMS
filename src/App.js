import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import LoginPage from './LoginPage';
import './App.css';
import Student from './Student';
import Notification from './Notification';
import Record from './Record';
import Report from './Report';

import Feedback from './SSO/Feedback';
import Case from './SSO/Case';
import AddStudentRecord from './SSO/AddStudentRecord';
import Sanction from './SSO/Sanction';
import TimeLog from './SSO/TimeLog'


import ViewStudentReports from './ViewStudentReports';
import ViewStudentSuspensions from './ViewStudentSuspensions';
import ViewSuspensions from './Principal/ViewSuspensions';

import Followup from './Adviser/Followup';
import AddStudent from './Adviser/AddStudent';
import UpdateStudent from './Adviser/UpdateStudent';
import ViewStudentRecord from './Adviser/ViewStudentRecord';
import AdvivserCase from './Adviser/AdviserCase';
import UpdateAccount from './UpdateAccount';

import AdminDashboard from './Admin/AdminDashboard';
import Class from './Admin/Class'


import PrivateRoute from './PrivateRoute';
import { AuthContext, AuthProvider } from './AuthContext';


function App() {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />

          {loggedInUser && (
            <>
             <Route path="/record" element={<Record />} />
             <Route path="/view-student-record/:id" element={<ViewStudentRecord />} />
             <Route path="/UpdateAccount" element={<UpdateAccount />} /> 
            </>

          )}

          {loggedInUser && loggedInUser.userType === 1 && (
            <>
           <Route path="/case" element={<Case />} />
           <Route path="/sanctions" element={<Sanction />} />
           <Route path="/timelog" element={<TimeLog />} />
            </>

          )}

          {loggedInUser && loggedInUser.userType === 2 && (
            <>
             <Route path="/viewSuspensions" element={<ViewSuspensions />} />
             <Route path="/view-student-reports/:sid" element={<ViewStudentReports />} /> 
             <Route path="/view-student-suspensions/:sid" element={<ViewStudentSuspensions />} /> 
            </>

          )}

          {loggedInUser && loggedInUser.userType === 3 && (
            <>
            <Route path="/Followup" element={<Followup />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/update-student/:sid" element={<UpdateStudent />} />
            <Route path="/feedback" element={<Feedback />} />
            
            </>
          )}

          {loggedInUser && loggedInUser.userType === 4 && (
            <>
              <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
              <Route path="/Class" element={<PrivateRoute element={<Class />} />} />
            </>
          )}

          {(loggedInUser && (loggedInUser.userType === 1 || loggedInUser.userType === 3)) && (
            <>
            <Route path="/notification" element={<Notification />} />
            <Route path="/student" element={<PrivateRoute element={<Student />} />}  />
            <Route path="/add-record/:sid" element={<AddStudentRecord />} /> 
            </>

          )}

          {(loggedInUser && (loggedInUser.userType === 1 || loggedInUser.userType === 3 || loggedInUser.userType === 5 || loggedInUser.userType === 6)) && (
            <>
            <Route path="/report" element={<Report />} /> 
            </>

          )}

        </Routes>
      </div>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
