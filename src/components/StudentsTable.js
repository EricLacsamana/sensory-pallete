import React from 'react';
import StudentsRow from './StudentsTableRow';

const StudentsTable = ({ students }) => (
    <div style={{ width: '100%', overflowX: 'auto' }}>
        <table className="custom-table" style={tableStyle}>
            <thead>
                <tr style={headerRowStyle}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Age</th>
                    <th style={thStyle}>Diagnosis</th>
                    <th style={thStyle}>Action</th>
                </tr>
            </thead>
            <tbody style={{ border: 'none' }}>
                {students.map((student) => (
                    <StudentsRow key={student.id} student={student} />
                ))}
            </tbody>
        </table>
    </div>
);

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    border: 'none',
    fontFamily: 'inherit',
};

const headerRowStyle = {
    borderBottom: '2px solid var(--blue1)',
};

const thStyle = {
    textAlign: 'left',
    padding: '16px 12px',
    color: 'var(--gray)',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

export default StudentsTable;
