import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Record.module.css'; // Importing CSS module
import tableStyles from './GlobalTable.module.css'; // Importing global table styles
import RecordFilter from './RecordFilter'; // Importing the new RecordFilter component

const RecordTable = ({ records, schoolYears, grades }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = authToken ? JSON.parse(authToken) : null;

  const [sections, setSections] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(
    loggedInUser?.userType === 3 ? parseInt(loggedInUser.grade, 10) : null
  );
  const [selectedSection, setSelectedSection] = useState(
    loggedInUser?.userType === 3 ? loggedInUser.section : ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGrade) {
      fetchSectionsByGrade(selectedGrade);
    }
  }, [selectedGrade]);

  const fetchSectionsByGrade = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const getWeekNumber = (date) => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7);
  };

  const countFrequency = (entity, category, isSection = false) => {
    return records
      .filter((record) => {
        if (selectedSchoolYear && record.student.schoolYear !== selectedSchoolYear) {
          return false;
        }
        if (isSection) {
          return record.student.section === entity && 
                 (record.monitored_record === category || 
                 (category === 'Sanction' && record.sanction));
        } else {
          return record.student.grade === parseInt(entity, 10) && 
                 (record.monitored_record === category || 
                 (category === 'Sanction' && record.sanction)); // Ensure entity is parsed as int
        }
      })
      .filter((record) => {
        if (selectedMonth) {
          const recordMonth = new Date(record.record_date).getMonth() + 1;
          return recordMonth === parseInt(selectedMonth, 10);
        }
        return true;
      })
      .filter((record) => {
        if (selectedWeek) {
          const recordDate = new Date(record.record_date);
          const weekNumber = getWeekNumber(recordDate);
          return weekNumber === parseInt(selectedWeek, 10);
        }
        return true;
      }).length;
  };
  

  const calculateTotalForCategory = (category, isSection = false) => {
    const entities = isSection ? sections : grades;
    return entities.reduce((total, entity) => total + countFrequency(entity, category, isSection), 0);
  };

  const categories = [
    'Absent',
    'Tardy',
    'Cutting Classes',
    'Improper Uniform',
    'Offense',
    'Misbehavior',
    'Clinic',
    
    
  ];

  const countSanctionFrequency = () => {
    return records.filter(record => record.sanction).length;
  };

  // Function to gather unique students based on the selected filters
  const getStudentsBySection = () => {
    const studentMap = {};

    records.forEach((record) => {
      const isInSelectedYear = !selectedSchoolYear || record.student.schoolYear === selectedSchoolYear;
      const isInSelectedGrade = !selectedGrade || record.student.grade === selectedGrade;
      const isInSelectedSection = !selectedSection || record.student.section === selectedSection;

      if (isInSelectedYear && isInSelectedGrade && isInSelectedSection) {
        const studentId = record.student.id; // Assuming each student has a unique ID
        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            name: record.student.name,
            categories: {}, // To hold category counts
          };
        }
        // Count the category occurrences
        const category = record.monitored_record;
        if (!studentMap[studentId].categories[category]) {
          studentMap[studentId].categories[category] = 0;
        }
        studentMap[studentId].categories[category]++;
      }
    });

    return Object.values(studentMap);
  };

  const students = getStudentsBySection();

  // Function to get students for adviser's section only
  const getAdviserStudents = () => {
    const studentMap = {};

    records.forEach((record) => {
      if (loggedInUser?.userType === 3 && record.student.section === loggedInUser.section) {  
        const studentId = record.student.id;
        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            name: record.student.name,
            categories: {}, // To hold category counts
          };
        }
        const category = record.monitored_record;
        if (!studentMap[studentId].categories[category]) {
          studentMap[studentId].categories[category] = 0;
        }
        studentMap[studentId].categories[category]++;
      }
    });

    return Object.values(studentMap);
  };

  const adviserStudents = getAdviserStudents();

  return (
    <>
      <h2 className={styles.RecordTitle}>Table Overview</h2>

      {/* Using RecordFilter to handle all filter logic */}
      <RecordFilter
        schoolYears={schoolYears}
        grades={grades}
        loggedInUser={loggedInUser}
        selectedSchoolYear={selectedSchoolYear}
        setSelectedSchoolYear={setSelectedSchoolYear}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
      />

      {loading ? (
        <p>Loading records...</p>
      ) : (
      <div className={tableStyles['table-container']}>
        <table className={tableStyles['global-table']}>
          <thead>
  <tr>
    <th>Grade</th>
    {selectedGrade && <th>Section</th>}
    {categories.map((category) => (
      <th key={category}>{category}</th>
    ))}
    <th>Sanction</th> {/* Add the Sanction column here */}
  </tr>
</thead>
<tbody>
  {selectedGrade ? (
    sections
      .filter(section => !selectedSection || section === selectedSection)
      .map((section) => (
        <tr key={section}>
          <td>{selectedGrade}</td>
          <td>{section}</td>
          {categories.map((category) => (
            <td key={category}>{countFrequency(section, category, true)}</td>
          ))}
          <td>{countFrequency(section, 'Sanction', true)}</td> {/* Count sanctions for the section */}
        </tr>
      ))
  ) : (
    grades.map((grade) => (
      <tr key={grade}>
        <td>{grade}</td>
        {categories.map((category) => (
          <td key={category}>{countFrequency(grade, category)}</td>
        ))}
        <td>{countFrequency(grade, 'Sanction')}</td> {/* Count sanctions for the grade */}
      </tr>
    ))
  )}
  <tr>
    <td colSpan={selectedGrade ? "2" : "1"} style={{ fontWeight: 'bold' }}>Total</td>
    {categories.map((category) => (
      <td key={category} style={{ fontWeight: 'bold' }}>
        {calculateTotalForCategory(category, !!selectedGrade)}
      </td>
    ))}
    <td style={{ fontWeight: 'bold' }}>
      {calculateTotalForCategory('Sanction', !!selectedGrade)} {/* Calculate total sanctions */}
    </td>
  </tr>
</tbody>

        </table>
      </div>
      )}

      {/* Displaying the Student Details Table */}
      {selectedSchoolYear && selectedGrade && selectedSection && (
        <>
          <h2 className={styles.RecordTitle}>Student Details</h2>
          <div className={tableStyles['table-container']}>
            <table className={tableStyles['global-table']}>
              <thead>
                <tr>
                  <th>Name</th>
                  {categories.map((category) => (
                    <th key={category}>{category}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.name}>
                      <td>{student.name}</td>
                      {categories.map((category) => (
                        <td key={category}>{student.categories[category] || 0}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={categories.length + 1}>No students found for the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Displaying Adviser's Student Details Table */}
      {loggedInUser?.userType === 3 && adviserStudents.length > 0 && (  
        <>
          <h2 className={styles.RecordTitle}>Adviser's Student Details</h2>
          <div className={tableStyles['table-container']}>
            <table className={tableStyles['global-table']}>
              <thead>
                <tr>
                  <th>Name</th>
                  {categories.map((category) => (
                    <th key={category}>{category}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adviserStudents.map((student) => (
                  <tr key={student.name}>
                    <td>{student.name}</td>
                    {categories.map((category) => (
                      <td key={category}>{student.categories[category] || 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default RecordTable;
