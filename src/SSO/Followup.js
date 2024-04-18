import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Followup.css';

const Followup = () => {
  const location = useLocation();
  const userInfo = location.state ? location.state.userInfo : null;

  const [formState, setFormState] = useState({
    date: '',
    time: '',
    violation: '',
    name: '',
    reasoning: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    fetch('http://localhost:8080/followup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('Success:', data);
      // Handle the success scenario here
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors here
    });
  };

  return (
    <div className='wrapper'>
        <div className="sidenav">
            {/* Navigation links */}
            <Link to="/account">Account</Link>
            <Link to="/student">Student</Link>
            <Link to="/notification">Notification</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/case">Case</Link>
            <Link to="/pendings">Pendings</Link>
            <Link to="/sanctions">Sanctions</Link>
            <Link to="/report">Report</Link>
            <Link to="/Followup">Followup</Link>
        </div>
        <div className='content'>
            <h1>Appointment Form</h1>
            <form onSubmit={handleSubmit}>
                <input 
                  type="date" 
                  name="date" 
                  value={formState.date} 
                  onChange={handleInputChange} 
                  placeholder="Select Date" 
                />
                <input 
                  type="time" 
                  name="time" 
                  value={formState.time} 
                  onChange={handleInputChange} 
                  placeholder="Select Time" 
                />
                <input 
                  type="text" 
                  name="violation" 
                  value={formState.violation} 
                  onChange={handleInputChange} 
                  placeholder="Violation" 
                />
                <input 
                  type="text" 
                  name="name" 
                  value={formState.name} 
                  onChange={handleInputChange} 
                  placeholder="Name" 
                />
                <textarea 
                  name="reasoning" 
                  value={formState.reasoning} 
                  onChange={handleInputChange} 
                  placeholder="More Reasoning (Optional)"
                ></textarea>
                <div className="form-buttons">
                    <button type="button" onClick={() => {}}>Prev/Cancel</button>
                    <button type="submit">Add/Next</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default Followup;
