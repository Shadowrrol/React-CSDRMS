import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewStudentCases = () => {
    const { sid } = useParams();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    document.title = "Student Cases";
    const fetchCases = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/cases/student/${sid}`);
        setCases(response.data);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    fetchCases();
  }, [sid]);

  return (
    <div>
      <h2>Cases for Student ID: {sid}</h2>
      <ul>
        {cases.map(singleCase => (
          <li key={singleCase.cid}>
            <div>Case Name: {singleCase.case_name}</div>
            <div>Investigator: {singleCase.investigator}</div>
            <div>Violation: {singleCase.violation}</div>
            <div>Description: {singleCase.description}</div>
            <div>Status: {singleCase.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewStudentCases;
