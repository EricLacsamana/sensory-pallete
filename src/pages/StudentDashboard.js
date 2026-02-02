import React, { useState, useMemo } from 'react';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaGamepad,
    FaHistory,
    FaPlay,
    FaBuilding,
    FaPlus,
    FaMapMarkedAlt,
    FaStar,
    FaClock,
    FaChartLine,
    FaCalendarCheck,
    FaClock as FaTimeIcon,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudent, getStudentHistory } from '../api/students';
import { useActivities } from '../hooks/useActivities';
import StudentsTable from '../components/StudentsTable';
import SessionModal from '../components/NewSessionModal';

const StudentDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    // --- 1. DATA FETCHING ---
    const {
        data: learner,
        isLoading: isLoadingStudent,
        isError,
    } = useQuery({
        queryKey: ['student', id],
        queryFn: () => getStudent(id),
    });

    const { data: history = [] } = useQuery({
        queryKey: ['studentHistory', id],
        queryFn: () => getStudentHistory(id),
    });

    const { data: activities = [] } = useActivities();

    // --- 2. SESSION LOGIC & AGGREGATION ---
    const aggregatedHistory = useMemo(() => {
        const groups = {};
        history.forEach((session) => {
            const dateKey = new Date(
                session.completed_at || session.createdAt,
            ).toLocaleDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(session);
        });
        return groups;
    }, [history]);

    const todayStr = new Date().toLocaleDateString();
    const hasSessionToday = !!aggregatedHistory[todayStr];

    // Dummy Scheduled Sessions for Today
    const todaySchedule = [
        {
            id: 1,
            time: '09:00 AM',
            activity: 'Balloon Pop',
            location: 'Main Branch',
            status: 'completed',
        },
        {
            id: 2,
            time: '11:30 AM',
            activity: 'Shape Sort',
            location: 'Satellite Branch',
            status: 'live',
        },
        {
            id: 3,
            time: '02:00 PM',
            activity: 'Memory Match',
            location: 'Satellite Branch',
            status: 'scheduled',
        },
    ];

    const totalTime = history.reduce(
        (a, c) => a + (c.duration_completed || 0),
        0,
    );
    const avgScore =
        history.length > 0
            ? Math.round(
                  history.reduce((a, c) => a + (c.performance_score || 0), 0) /
                      history.length,
              )
            : 0;

    // --- 3. MAP CONFIG ---
    const MAPS_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
    const encodedAddress = encodeURIComponent(learner?.address || '');
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${encodedAddress}`;

    const handleStartSession = (activityName = null) => {
        setIsModalOpen(true);
        // navigate(`/activities?studentId=${learner.documentId}`, {
        //     state: { suggestedActivity: activityName },
        // });
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    if (isLoadingStudent)
        return <div style={centerStyle}>Loading Command Center...</div>;

    return (
        <div className="dashboard-container" style={pageStyle}>
            {/* --- HEADER --- */}
            <div className="dashboard-header" style={headerStyle}>
                <div className="header-left">
                    <div
                        className="back-link"
                        onClick={() => navigate(-1)}
                        style={backButtonStyle}
                    >
                        <FaArrowLeft /> Back
                    </div>
                    <h1 style={nameHeaderStyle}>
                        {learner?.firstName}'s Workspace
                    </h1>
                </div>
                <div style={branchBadge}>
                    <FaBuilding style={{ marginRight: '8px' }} />
                    {learner?.branch_center?.name || 'Main Branch'}
                </div>
            </div>

            {/* --- QUICK STATS --- */}
            <div style={statsRowStyle}>
                <StatCard
                    icon={<FaChartLine color="#3498DB" />}
                    label="Total Sessions"
                    value={history.length}
                />
                <StatCard
                    icon={<FaStar color="#F1C40F" />}
                    label="Avg. Score"
                    value={`${avgScore}%`}
                />
                <StatCard
                    icon={<FaClock color="#2ECC71" />}
                    label="Active Time"
                    value={formatTime(totalTime)}
                />
            </div>

            <div style={mainGrid}>
                {/* --- LEFT: IDENTITY & MAP --- */}
                <div style={leftCol}>
                    <div style={cardStyle}>
                        <h3 style={sectionTitleStyle}>Learner Identity</h3>
                        <div style={infoGridStyle}>
                            <InfoItem
                                label="Full Name"
                                value={learner.fullName}
                            />
                            <InfoItem
                                label="Gender"
                                value={
                                    learner?.gender
                                        ? learner.gender
                                              .charAt(0)
                                              .toUpperCase() +
                                          learner.gender.slice(1).toLowerCase()
                                        : '-'
                                }
                            />
                            <InfoItem
                                label="Diagnosis"
                                value={learner?.diagnosis ?? 'General'}
                            />
                            <InfoItem
                                label="Guardian"
                                value={learner?.guardian_name ?? 'N/A'}
                            />
                            <InfoItem
                                label="Relation"
                                value={learner?.guardian_relation ?? 'Parent'}
                            />
                            <InfoItem
                                label="Contact"
                                value={learner?.guardian_contact}
                            />
                        </div>
                        <div style={infoGridStyle}>
                            <InfoItem
                                label="Address"
                                value={learner?.address}
                            />
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h3 style={sectionTitleStyle}>
                                <FaMapMarkedAlt
                                    style={{ marginRight: '8px' }}
                                />{' '}
                                Residence
                            </h3>
                            <div style={mapWrapper}>
                                <iframe
                                    title="Map"
                                    width="100%"
                                    height="200"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={mapUrl}
                                    allowFullScreen
                                />
                                <div style={addressFooter}>
                                    <FaMapMarkerAlt color="var(--pink)" />
                                    <p style={addressText}>
                                        {learner?.address ||
                                            'Address not provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: COMMAND CENTER (TODAY'S VISIT) --- */}
                <div style={rightCol}>
                    <div
                        style={
                            hasSessionToday ? activeSessionCard : newSessionCard
                        }
                    >
                        {hasSessionToday ? (
                            <div style={flexBetween}>
                                <div>
                                    <h4
                                        style={{
                                            margin: 0,
                                            color: 'white',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        Visit Active
                                    </h4>
                                    <p
                                        style={{
                                            margin: '5px 0 0 0',
                                            fontSize: '0.9rem',
                                            color: 'rgba(255,255,255,0.8)',
                                        }}
                                    >
                                        {aggregatedHistory[todayStr].length}{' '}
                                        activities played today.
                                    </p>
                                </div>
                                <div style={pulseDot} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <h4
                                    style={{
                                        margin: '0 0 15px 0',
                                        color: 'var(--darkBlue)',
                                    }}
                                >
                                    Today's Session
                                </h4>
                                <button
                                    style={primaryActionBtn}
                                    onClick={() => handleStartSession()}
                                >
                                    <FaPlus /> Initialize Visit
                                </button>
                            </div>
                        )}
                    </div>

                    {/* NEW: Today's Schedule List */}
                    <div style={{ ...cardStyle, marginTop: '20px' }}>
                        <h3 style={sectionTitleStyle}>
                            <FaCalendarCheck /> Today's Schedule
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            {todaySchedule.map((item) => (
                                <div
                                    key={item.id}
                                    style={scheduleItemStyle(item.status)}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                        }}
                                    >
                                        <FaTimeIcon
                                            color={
                                                item.status === 'live'
                                                    ? 'white'
                                                    : '#95A5A6'
                                            }
                                        />
                                        <div>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: '700',
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {item.activity}
                                            </p>
                                            <small>{`${item.location} - ${item.time}`}</small>
                                        </div>
                                    </div>
                                    {item.status === 'live' ? (
                                        <button
                                            style={liveActionBtn}
                                            onClick={() =>
                                                handleStartSession(
                                                    item.activity,
                                                )
                                            }
                                        >
                                            LAUNCH
                                        </button>
                                    ) : (
                                        <span style={statusBadge(item.status)}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, marginTop: '20px' }}>
                        <div style={flexBetween}>
                            <h3
                                style={{
                                    ...sectionTitleStyle,
                                    border: 'none',
                                    marginBottom: 0,
                                }}
                            >
                                Quick Launch
                            </h3>
                            <FaGamepad color="var(--blue3)" size={20} />
                        </div>
                        <div style={miniActivityList}>
                            {activities.slice(0, 3).map((act) => (
                                <div
                                    key={act.documentId}
                                    style={miniActivityItem}
                                    onClick={() =>
                                        navigate(
                                            `/activities/${act.documentId}`,
                                            { state: learner },
                                        )
                                    }
                                >
                                    <div style={miniIcon}>
                                        <FaGamepad />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={miniTitle}>{act.name}</p>
                                        <p style={miniStatus}>
                                            {act.activityStatus}
                                        </p>
                                    </div>
                                    <FaPlay color="var(--blue3)" size={10} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: TABLE --- */}
            <div style={{ ...cardStyle, marginTop: '30px' }}>
                <div style={flexBetween}>
                    <h3 style={sectionTitleStyle}>
                        <FaHistory style={{ marginRight: '10px' }} /> Activity
                        History
                    </h3>
                    <div style={recordCountBadge}>{history.length} Records</div>
                </div>
                <StudentsTable students={history} />
            </div>
            <SessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activities={activities}
                learnerName={learner?.firstName}
                onConfirm={() => {}}
            />
        </div>
    );
};

// --- ADDITIONAL SUB-COMPONENTS & STYLES ---

const StatCard = ({ icon, label, value }) => (
    <div style={statCardStyle}>
        <div style={statIconStyle}>{icon}</div>
        <div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--gray)' }}>
                {label}
            </p>
            <h3
                style={{
                    margin: 0,
                    color: 'var(--darkBlue)',
                    fontWeight: '700',
                }}
            >
                {value}
            </h3>
        </div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: '15px' }}>
        <label
            style={{
                fontSize: '12px',
                color: '#95A5A6',
                display: 'block',
                marginBottom: '4px',
            }}
        >
            {label}
        </label>
        <p style={{ margin: 0, fontWeight: '600', color: 'var(--darkBlue)' }}>
            {value || '-'}
        </p>
    </div>
);

const scheduleItemStyle = (status) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '16px',
    background: status === 'live' ? 'var(--blue3)' : 'var(--bg)',
    color: status === 'live' ? 'white' : 'var(--darkBlue)',
    border: status === 'live' ? 'none' : '1px solid var(--blue2)',
});

const statusBadge = (status) => ({
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 8px',
    borderRadius: '8px',
    background: status === 'completed' ? '#D4EFDF' : '#EBEDEF',
    color: status === 'completed' ? '#1E8449' : '#7F8C8D',
});

const liveActionBtn = {
    background: 'white',
    color: 'var(--blue3)',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '11px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

// --- STYLES OBJECTS (Consolidated) ---
const pageStyle = {
    backgroundColor: 'var(--bg)',
    minHeight: '100vh',
    fontFamily: "'Fredoka', sans-serif",
    padding: '30px',
};
const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '30px',
};
const nameHeaderStyle = {
    color: 'var(--darkBlue)',
    fontSize: '2.4rem',
    margin: '0',
    fontWeight: '700',
};
const branchBadge = {
    background: 'var(--yellow)',
    color: 'var(--darkBlue)',
    padding: '12px 20px',
    borderRadius: '16px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
};
const backButtonStyle = {
    cursor: 'pointer',
    color: 'var(--blue3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
};
const statsRowStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
};
const statCardStyle = {
    flex: 1,
    background: 'white',
    padding: '20px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: 'var(--shadow)',
    minWidth: '220px',
};
const statIconStyle = {
    width: '45px',
    height: '45px',
    background: 'var(--bg)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
const mainGrid = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '30px',
    alignItems: 'start',
};
const leftCol = { display: 'flex', flexDirection: 'column' };
const rightCol = { display: 'flex', flexDirection: 'column' };
const cardStyle = {
    background: 'white',
    padding: '30px',
    borderRadius: '32px',
    boxShadow: 'var(--shadow)',
    border: '2px solid var(--blue2)',
};
const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
};
const sectionTitleStyle = {
    borderBottom: '2px solid var(--bg)',
    paddingBottom: '10px',
    marginBottom: '20px',
    color: 'var(--darkBlue)',
    fontSize: '18px',
    fontWeight: '700',
};
const mapWrapper = {
    marginTop: '10px',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid var(--blue1)',
};
const addressFooter = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    background: 'rgba(255, 105, 180, 0.05)',
    gap: '12px',
};
const addressText = {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--darkBlue)',
};
const activeSessionCard = {
    background: 'var(--darkBlue)',
    padding: '25px',
    borderRadius: '28px',
    color: 'white',
};
const newSessionCard = {
    background: 'white',
    padding: '25px',
    borderRadius: '28px',
    border: '2px dashed var(--blue3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
const pulseDot = {
    width: '12px',
    height: '12px',
    backgroundColor: '#2ecc71',
    borderRadius: '50%',
    boxShadow: '0 0 12px #2ecc71',
    animation: 'pulse 2s infinite',
};
const primaryActionBtn = {
    background: 'var(--blue3)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
};
const miniActivityList = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '15px',
};
const miniActivityItem = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    background: 'var(--bg)',
    borderRadius: '20px',
    cursor: 'pointer',
};
const miniIcon = {
    width: '40px',
    height: '40px',
    background: 'var(--blue3)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginRight: '15px',
};
const miniTitle = {
    margin: 0,
    fontWeight: '700',
    color: 'var(--darkBlue)',
    fontSize: '1rem',
};
const miniStatus = { margin: 0, fontSize: '0.8rem', color: 'var(--gray)' };
const recordCountBadge = {
    background: 'var(--blue1)',
    color: 'var(--darkBlue)',
    padding: '6px 16px',
    borderRadius: '12px',
    fontWeight: '700',
};
const flexBetween = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};
const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: "'Fredoka', sans-serif",
    color: 'var(--blue3)',
    fontSize: '1.5rem',
};

export default StudentDashboard;
