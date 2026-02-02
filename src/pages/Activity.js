import React, { useState } from 'react'; // Added useState
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    FaBookOpen,
    FaCrosshairs,
    FaPlayCircle,
    FaUser,
    FaChevronLeft,
} from 'react-icons/fa';
import { getActivity } from '../api/activity';

const DUMMY_CONFIG = {
    studentId: 'STUDENT_99',
    therapistId: 'THERAPIST_04',
};

const createActivitySession = async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
        id: 55,
        documentId: 'session-xyz-123',
        attributes: { ...payload },
    };
};

const Activity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Hover States
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [isStartHovered, setIsStartHovered] = useState(false);

    const {
        data: activity,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['activity', id],
        queryFn: () => getActivity(id),
        enabled: !!id,
    });

    const { studentId, therapistId } = DUMMY_CONFIG;

    const { mutate, isPending } = useMutation({
        mutationFn: createActivitySession,
        onSuccess: (newSession) => {
            navigate(`/activity-sessions/${newSession.documentId}`);
            queryClient.invalidateQueries([
                'activity-sessions',
                newSession.documentId,
            ]);
        },
    });

    const handleStart = () => {
        mutate({
            sessionId: crypto.randomUUID(),
            student: studentId,
            therapist: therapistId,
            activity: activity?.documentId,
            startTime: new Date().toISOString(),
            activityStatus: 'started',
            promptLevel: 'independent',
            actualScore: 0,
        });
    };

    if (isLoading) return <div style={centerStyle}>Loading Activity...</div>;
    if (isError) return <div style={centerStyle}>Activity not found.</div>;

    console.log('activity', activity);
    const imageUrl = activity?.banner?.url
        ? `http://localhost:1337${activity.banner.url}`
        : 'https://via.placeholder.com/800x400?text=Activity+Preview';

    return (
        <div style={styles.page}>
            {/* Nav Header */}
            <div style={styles.navHeader}>
                <button
                    onClick={() => navigate(-1)}
                    onMouseEnter={() => setIsBackHovered(true)}
                    onMouseLeave={() => setIsBackHovered(false)}
                    style={{
                        ...styles.backBtn,
                        transform: isBackHovered
                            ? 'translateX(-5px)'
                            : 'translateX(0)',
                        backgroundColor: isBackHovered
                            ? 'var(--blue2)'
                            : 'var(--blue3)',
                    }}
                >
                    <FaChevronLeft /> BACK
                </button>
            </div>

            <div
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
                style={{
                    ...styles.card,
                    transform: isCardHovered
                        ? 'translateY(-5px)'
                        : 'translateY(0)',
                    boxShadow: isCardHovered
                        ? '0 20px 40px rgba(0,0,0,0.12)'
                        : 'var(--shadow)',
                }}
            >
                {/* Banner with Theme Overlays */}
                <div style={styles.bannerContainer}>
                    <img
                        src={imageUrl}
                        alt={activity?.name}
                        style={{
                            ...styles.bannerImg,
                            transform: isCardHovered
                                ? 'scale(1.02)'
                                : 'scale(1)',
                        }}
                    />
                    <div style={styles.bannerOverlay} />
                    <div
                        style={{
                            ...styles.iconFloating,
                            transform: isCardHovered
                                ? 'rotate(10deg) scale(1.1)'
                                : 'rotate(0deg) scale(1)',
                        }}
                    >
                        <FaPlayCircle size={35} color="var(--white)" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>{activity?.name}</h1>
                        <div style={styles.badgeRow}>
                            <span style={styles.badge}>
                                <FaUser size={12} color="var(--darkBlue)" />{' '}
                                {studentId}
                            </span>
                            <span
                                style={{
                                    ...styles.badge,
                                    backgroundColor: 'var(--pink)',
                                    color: 'white',
                                }}
                            >
                                Beginner
                            </span>
                        </div>
                    </div>

                    <p style={styles.description}>
                        {activity?.description ||
                            'No description provided for this activity.'}
                    </p>

                    <div style={styles.infoGrid}>
                        <div style={styles.infoBox}>
                            <div style={styles.boxHeader}>
                                <FaCrosshairs color="var(--pink)" />
                                <h3 style={styles.label}>Goal</h3>
                            </div>
                            <p style={styles.text}>
                                Improve reaction speed and hand-eye
                                coordination.
                            </p>
                        </div>

                        <div style={styles.infoBox}>
                            <div style={styles.boxHeader}>
                                <FaPlayCircle color="var(--darkGreen)" />
                                <h3 style={styles.label}>How to Play</h3>
                            </div>
                            <ul style={styles.list}>
                                <li>Wait for the visual cue.</li>
                                <li>Tap the matching LED pad.</li>
                                <li>Beat your high score!</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer / Launch Section */}
                    <div style={styles.footer}>
                        <button
                            onClick={handleStart}
                            onMouseEnter={() => setIsStartHovered(true)}
                            onMouseLeave={() => setIsStartHovered(false)}
                            disabled={isPending}
                            style={{
                                ...styles.startBtn,
                                backgroundColor: isPending
                                    ? 'var(--blue1)'
                                    : isStartHovered
                                      ? 'var(--darkBlue)'
                                      : 'var(--blue3)',
                                transform:
                                    isPending || isStartHovered
                                        ? 'translateY(2px)'
                                        : 'translateY(0)',
                                boxShadow: isPending
                                    ? 'none'
                                    : isStartHovered
                                      ? '0 4px 0px #154a61'
                                      : '0 6px 0px #154a61',
                                cursor: isPending ? 'wait' : 'pointer',
                            }}
                        >
                            {isPending ? 'SETTING UP...' : 'START ACTIVITY'}
                        </button>
                        <p style={styles.note}>
                            Signed in as: <strong>{therapistId}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Fredoka', sans-serif",
    },
    navHeader: {
        width: '100%',
        maxWidth: '700px',
        marginBottom: '15px',
        display: 'flex',
    },
    backBtn: {
        background: 'var(--blue3)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '15px',
        color: 'white',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 0px var(--darkBlue)',
        transition: 'all 0.2s ease',
    },
    card: {
        maxWidth: '700px',
        width: '100%',
        backgroundColor: 'var(--white)',
        borderRadius: '40px',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        border: '3px solid var(--blue2)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    bannerContainer: {
        position: 'relative',
        height: '240px',
        backgroundColor: 'var(--blue1)',
        overflow: 'hidden',
    },
    bannerImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease',
    },
    bannerOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))',
    },
    iconFloating: {
        position: 'absolute',
        bottom: '-25px',
        right: '40px',
        width: '70px',
        height: '70px',
        backgroundColor: 'var(--yellow)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 15px rgba(254, 185, 49, 0.4)',
        border: '5px solid var(--white)',
        transition: 'transform 0.3s ease',
    },
    content: {
        padding: '50px 40px 40px',
    },
    header: {
        textAlign: 'left',
        marginBottom: '20px',
    },
    title: {
        fontSize: '2.4rem',
        color: 'var(--darkBlue)',
        margin: '0 0 10px 0',
        fontWeight: '700',
    },
    badgeRow: { display: 'flex', gap: '10px' },
    badge: {
        backgroundColor: 'var(--blue1)',
        padding: '6px 16px',
        borderRadius: '100px',
        fontSize: '0.9rem',
        color: 'var(--darkBlue)',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    description: {
        fontSize: '1.1rem',
        color: 'var(--darkGray)',
        lineHeight: '1.5',
        textAlign: 'left',
        marginBottom: '30px',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
    },
    infoBox: {
        padding: '20px',
        backgroundColor: 'var(--bg)',
        borderRadius: '25px',
        border: '2px solid var(--blue2)',
        textAlign: 'left',
    },
    boxHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
    },
    label: {
        fontSize: '1rem',
        color: 'var(--darkBlue)',
        fontWeight: '700',
        margin: 0,
    },
    text: {
        fontSize: '0.95rem',
        color: 'var(--darkGray)',
        margin: 0,
    },
    list: {
        paddingLeft: '18px',
        margin: 0,
        fontSize: '0.9rem',
        color: 'var(--darkGray)',
        lineHeight: '1.6',
    },
    footer: {
        paddingTop: '20px',
        textAlign: 'center',
    },
    startBtn: {
        width: '100%',
        padding: '20px',
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--white)',
        border: 'none',
        borderRadius: '20px',
        transition: 'all 0.15s ease',
    },
    note: { marginTop: '15px', fontSize: '0.85rem', color: 'var(--gray)' },
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

export default Activity;
