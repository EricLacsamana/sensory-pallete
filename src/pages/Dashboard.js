import React, { useState } from 'react';
import {
    FaUserFriends,
    FaChalkboardTeacher,
    FaChartLine,
    FaCheckCircle,
    FaChevronRight,
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../api/students';
import { me } from '../api/users';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);

    const { data: user } = useQuery({ queryKey: ['me'], queryFn: me });
    const { data: learners = [], isLoading } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    const totalStudents = learners.length;
    const newThisWeek = learners.filter((l) => {
        const date = new Date(l.createdAt || l.publishedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date > weekAgo;
    }).length;

    if (isLoading) return <div style={centerStyle}>Loading Dashboard...</div>;

    // Helper for Card Hover Styles
    const getCardStyle = (id, baseGradient) => ({
        ...statCardBase,
        background: baseGradient,
        transform:
            hoveredCard === id
                ? 'translateY(-8px) scale(1.02)'
                : 'translateY(0) scale(1)',
        boxShadow:
            hoveredCard === id
                ? '0 20px 30px rgba(0,0,0,0.15)'
                : '0 10px 20px rgba(0,0,0,0.05)',
        cursor: 'pointer',
    });

    return (
        <div
            className="main-content"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
            {/* --- GREETING --- */}
            <div className="page-header" style={{ marginBottom: '40px' }}>
                <h1
                    className="page-title"
                    style={{ color: 'var(--darkBlue)', fontSize: '2.5rem' }}
                >
                    Hello, {user?.firstName || user?.username || 'Therapist'}!
                    👋
                </h1>
                <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>
                    Here is what's happening with your learners today.
                </p>
            </div>

            {/* --- STATS GRID --- */}
            <div className="overview-section">
                <div className="stats-grid" style={customGridStyle}>
                    <div
                        onMouseEnter={() => setHoveredCard(1)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={getCardStyle(
                            1,
                            'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
                        )}
                    >
                        <FaUserFriends className="stat-icon-bg" />
                        <div className="stat-header">
                            <span className="stat-label">Learners</span>
                            <span className="stat-sublabel">
                                Enrolled Students
                            </span>
                        </div>
                        <div className="stat-number">{totalStudents}</div>
                        <div className="stat-footer">
                            +{newThisWeek} new this week
                        </div>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredCard(2)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={getCardStyle(
                            2,
                            'linear-gradient(135deg, #FE7EAA 0%, #FF69B4 100%)',
                        )}
                    >
                        <FaChalkboardTeacher className="stat-icon-bg" />
                        <div className="stat-header">
                            <span className="stat-label">Sessions</span>
                            <span className="stat-sublabel">Today's Goal</span>
                        </div>
                        <div className="stat-number">12</div>
                        <div className="stat-footer">4 remaining</div>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredCard(3)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={getCardStyle(
                            3,
                            'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
                        )}
                    >
                        <FaCheckCircle className="stat-icon-bg" />
                        <div className="stat-header">
                            <span className="stat-label">Accuracy</span>
                            <span className="stat-sublabel">
                                Avg. Success Rate
                            </span>
                        </div>
                        <div className="stat-number">84%</div>
                        <div className="stat-footer">↑ 5% from last week</div>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredCard(4)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={getCardStyle(
                            4,
                            'linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)',
                        )}
                    >
                        <FaChartLine className="stat-icon-bg" />
                        <div className="stat-header">
                            <span className="stat-label">Activity</span>
                            <span className="stat-sublabel">
                                Total Play Time
                            </span>
                        </div>
                        <div className="stat-number">
                            320<small style={{ fontSize: '1rem' }}>m</small>
                        </div>
                        <div className="stat-footer">Across all activities</div>
                    </div>
                </div>
            </div>

            <div style={flexContainer}>
                {/* TABLE SECTION */}
                <div style={tableWrapper}>
                    <div style={tableHeader}>
                        <h3 style={{ margin: 0, color: 'var(--darkBlue)' }}>
                            Recent Learners
                        </h3>
                        <button
                            onClick={() => navigate('/students')}
                            style={viewAllBtn}
                        >
                            View All <FaChevronRight size={10} />
                        </button>
                    </div>

                    <table
                        className="custom-table"
                        style={{
                            borderCollapse: 'separate',
                            borderSpacing: '0 8px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={thStyle}>Learner</th>
                                <th style={thStyle}>Diagnosis</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learners.slice(0, 5).map((l, index) => (
                                <tr
                                    key={l.id}
                                    onMouseEnter={() => setHoveredRow(index)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    onClick={() =>
                                        navigate(`/students/${l.documentId}`)
                                    }
                                    style={{
                                        ...tableRowStyle,
                                        backgroundColor:
                                            hoveredRow === index
                                                ? '#F1F9FF'
                                                : 'white',
                                        transform:
                                            hoveredRow === index
                                                ? 'scale(1.01)'
                                                : 'scale(1)',
                                    }}
                                >
                                    <td
                                        style={{
                                            fontWeight: '700',
                                            color: 'var(--darkBlue)',
                                            borderRadius: '12px 0 0 12px',
                                        }}
                                    >
                                        {l.firstName} {l.lastName}
                                    </td>
                                    <td>
                                        <span
                                            style={getDiagnosisStyle(
                                                l.diagnosis,
                                            )}
                                        >
                                            {l.diagnosis || 'General'}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            borderRadius: '0 12px 12px 0',
                                        }}
                                    >
                                        <div style={activeStatusDot}>
                                            <div style={dot}></div> Active
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* SIDEBAR TIPS */}
                <div style={sideInfoBox}>
                    <h3
                        style={{
                            color: 'var(--darkBlue)',
                            marginBottom: '15px',
                        }}
                    >
                        Therapist Tips
                    </h3>
                    <div className="tip-item" style={tipCard}>
                        <strong>Color Match Pro:</strong>
                        <p
                            style={{
                                margin: '5px 0 0',
                                fontSize: '0.9rem',
                                color: '#636e72',
                            }}
                        >
                            Morning sessions show higher focus.
                        </p>
                    </div>
                    <div className="tip-item" style={tipCard}>
                        <strong>New Log:</strong>
                        <p
                            style={{
                                margin: '5px 0 0',
                                fontSize: '0.9rem',
                                color: '#636e72',
                            }}
                        >
                            Sound Scape update available.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---

const customGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
};

const statCardBase = {
    borderRadius: '24px',
    padding: '25px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '180px',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy effect
};

const flexContainer = { display: 'flex', gap: '30px', flexWrap: 'wrap' };

const tableWrapper = {
    flex: '2',
    minWidth: '500px',
    background: 'white',
    padding: '30px',
    borderRadius: '32px',
    boxShadow: 'var(--shadow)',
    border: '2px solid var(--blue1)',
};

const thStyle = {
    padding: '12px',
    textAlign: 'left',
    color: 'var(--gray)',
    fontSize: '0.85rem',
};

const tableRowStyle = {
    transition: 'all 0.2s ease',
    cursor: 'pointer',
};

const tableHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
};

const viewAllBtn = {
    background: 'none',
    border: 'none',
    color: 'var(--blue3)',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'transform 0.2s ease',
};

const sideInfoBox = {
    flex: '1',
    minWidth: '280px',
    background: 'var(--blue2)',
    padding: '30px',
    borderRadius: '32px',
    color: 'var(--darkBlue)',
    height: 'fit-content',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
};

const tipCard = {
    background: 'var(--white)',
    padding: '15px',
    borderRadius: '18px',
    marginBottom: '15px',
    border: '1px solid var(--blue1)',
    transition: 'transform 0.2s ease',
    cursor: 'default',
};

const activeStatusDot = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    color: '#4CAF50',
    fontWeight: '600',
};
const dot = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
};

const getDiagnosisStyle = (diagnosis) => ({
    backgroundColor: diagnosis?.includes('ASD') ? '#E3F2FD' : '#F3E5F5',
    color: diagnosis?.includes('ASD') ? '#1E88E5' : '#8E24AA',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
});

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '1.5rem',
    color: 'var(--blue3)',
};

export default Dashboard;
