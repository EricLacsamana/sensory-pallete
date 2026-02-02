import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';
import api from '../api';
import ColorMatchGame from './ColorMatchGame';

// --- API Helper Functions ---
const STRAPI_URL = 'http://localhost:1337/api/activity-sessions';

const createActivitySession = async (sessionData) => {
    const { data } = await api.post(ENDPOINTS.ACTIVITY_SESSIONS);
    return data.data; // Returns the newly created session object
};

const fetchSessionById = async (id) => {
    if (!id) return null;
    const { data } = await axios.get(`${STRAPI_URL}/${id}`);
    return data.data;
};

const ActivitySessionPage = ({ studentId, therapistId, activityId }) => {
    const { id } = useParams(); // Get ID from URL (/activity/:id)
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- 1. Mutation: Create the Session ---
    const { data, mutate, isPending, isLoading, isError } = useMutation({
        mutationFn: createActivitySession,
        onSuccess: (newSession) => {
            // After Strapi creates it, put the ID in the URL
            navigate(`/activity-session/${newSession.documentId}`);
            queryClient.invalidateQueries([
                'activity-sessions',
                newSession.documentId,
            ]);
        },
    });

    // --- 2. Query: Retrieve Session Data (Only runs if ID exists in URL) ---
    // const {
    //     data: session,
    //     isLoading,
    //     isError,
    // } = useQuery({
    //     queryKey: ['session', id],
    //     queryFn: () => fetchSessionById(id),
    //     enabled: !!id, // Only fetch if we have an ID
    // });

    const handleStartGame = () => {
        mutate({
            sessionId: crypto.randomUUID(),
            student: studentId,
            therapist: therapistId,
            activity: activityId,
            startTime: new Date().toISOString(),
            activityStatus: 'started',
            actualScore: 0,
            avgLatency: 0,
        });
    };

    // --- UI Logic ---

    // Loading State for Creation
    if (isPending)
        return <div style={styles.loader}>Initializing Session...</div>;

    // View 1: If no ID in URL, show "Start" screen
    if (!id) {
        return (
            <div style={styles.center}>
                <h1>Ready to Play?</h1>
                <button onClick={handleStartGame} style={styles.startBtn}>
                    CREATE SESSION
                </button>
            </div>
        );
    }

    // View 2: Loading current session data
    if (isLoading) return <div>Loading Session {id}...</div>;
    if (isError) return <div>Error loading session. Please restart.</div>;

    // View 3: Active Game View
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h3>Session ID: {data?.attributes?.documentId || id}</h3>
                <div style={styles.timer}>Timer: 60s</div>
            </header>

            <div style={styles.gameArea}>
                {/* Pass session.id to your Game Component for final PUT request */}
                <p>Game Logic Connected to Session #{id}</p>
                <div style={styles.placeholderPad}>TARGET COLOR</div>
            </div>

            <ColorMatchGame />
            <footer style={styles.footer}>
                Status: <strong>{data?.attributes?.activityStatus}</strong>
            </footer>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif' },
    center: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
    },
    startBtn: {
        padding: '20px 40px',
        fontSize: '1.5rem',
        cursor: 'pointer',
        background: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
    },
    gameArea: {
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginTop: '20px',
        borderRadius: '20px',
    },
    placeholderPad: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        backgroundColor: '#FF4D4D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    footer: { marginTop: '20px', opacity: 0.6 },
};

export default ActivitySessionPage;
