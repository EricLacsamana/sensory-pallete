import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api/students';
import { FaPlus, FaSearch, FaUserGraduate } from 'react-icons/fa';
import StudentsTable from '../components/StudentsTable';
import StudentModal from '../components/StudentModal';

const StudentsDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        mode: 'add',
        data: null,
    });
    const {
        data: students = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    console.log('students', students);
    const filteredStudents = students.filter(
        (s) =>
            `${s.firstName} ${s.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            s.id.toString().includes(searchTerm),
    );

    const openAddModal = () =>
        setModalConfig({ isOpen: true, mode: 'add', data: null });
    const openEditModal = (student) =>
        setModalConfig({ isOpen: true, mode: 'edit', data: student });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

    if (isLoading)
        return <div style={centerStyle}>Gathering Learner Records...</div>;
    if (isError) return <div style={centerStyle}>Error: {error.message}</div>;

    return (
        <div className="main-content" style={pageStyle}>
            {/* --- HEADER SECTION --- */}
            <div className="page-header" style={headerStyle}>
                <div>
                    <h1 className="page-title" style={titleStyle}>
                        <FaUserGraduate
                            size={28}
                            style={{ marginRight: '12px' }}
                        />
                        Learner Directory
                    </h1>
                    <p style={subtitleStyle}>
                        Manage and track records for {students.length} students.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="action-btn"
                    style={{
                        ...addBtnStyle,
                        transform: isHovered
                            ? 'translateY(2px)'
                            : 'translateY(0)',
                        boxShadow: isHovered
                            ? '0 4px 0px #C79A10'
                            : '0 6px 0px #C79A10',
                    }}
                >
                    <FaPlus style={{ marginRight: '8px' }} /> Add New Learner
                </button>
            </div>

            {/* --- SEARCH & FILTERS --- */}
            <div style={filterBarStyle}>
                <div style={searchWrapperStyle}>
                    <FaSearch style={searchIconStyle} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={countBadgeStyle}>
                    Showing {filteredStudents.length} Students
                </div>
            </div>

            {/* --- TABLE CARD --- */}
            <div style={tableContainerStyle}>
                {filteredStudents.length > 0 ? (
                    <StudentsTable students={filteredStudents} />
                ) : (
                    <div style={emptyStateStyle}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>
                            🔍
                        </div>
                        <p>No students found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
            <StudentModal
                isOpen={modalConfig.isOpen}
                mode={modalConfig.mode}
                initialData={modalConfig.data}
                onClose={closeModal}
            />
        </div>
    );
};

// --- STYLES ---

const pageStyle = {
    fontFamily: "'Fredoka', sans-serif",
    padding: '40px',
    backgroundColor: 'var(--bg)',
    minHeight: '100vh',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
};

const titleStyle = {
    fontSize: '2.4rem',
    color: 'var(--darkBlue)',
    margin: 0,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
};

const subtitleStyle = {
    color: 'var(--gray)',
    marginTop: '8px',
    fontSize: '1.1rem',
};

const addBtnStyle = {
    background: 'var(--yellow)',
    border: 'none',
    padding: '16px 28px',
    borderRadius: '18px',
    color: 'var(--darkBlue)',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.1s ease',
};

const filterBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    gap: '20px',
};

const searchWrapperStyle = {
    position: 'relative',
    flex: 1,
    maxWidth: '400px',
};

const searchIconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--gray)',
};

const searchInputStyle = {
    width: '100%',
    padding: '14px 14px 14px 45px',
    borderRadius: '15px',
    border: '2px solid var(--blue2)',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    color: 'var(--darkBlue)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
};

const countBadgeStyle = {
    backgroundColor: 'var(--blue1)',
    color: 'var(--darkBlue)',
    padding: '8px 16px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
};

const tableContainerStyle = {
    backgroundColor: 'var(--white)',
    borderRadius: '32px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
    border: '2px solid var(--blue2)',
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px',
    color: 'var(--gray)',
};

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '1.5rem',
    color: 'var(--blue3)',
};

export default StudentsDirectory;
