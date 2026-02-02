import React, { useState, useEffect, useCallback, useRef } from 'react';

const HARDWARE_IP = '192.168.68.140';
const WS_PORT = '81';

const ColorMatchGame = () => {
    const [score, setScore] = useState(0);
    const [targetColor, setTargetColor] = useState('red');
    const [hardwarePads, setHardwarePads] = useState(['gray', 'gray', 'gray']);
    const [activePad, setActivePad] = useState(null);
    const [isConnected, setConnected] = useState(false);

    // PERSISTENT REFS: These stay the same even when the component re-renders
    const wsRef = useRef(null);
    const targetRef = useRef('red');

    // Keep the Ref in sync with state so the listener always has the right target
    useEffect(() => {
        targetRef.current = targetColor;
    }, [targetColor]);

    const nextRound = useCallback(() => {
        const COLORS = ['red', 'blue', 'green', 'yellow'];
        const next = COLORS[Math.floor(Math.random() * COLORS.length)];
        const others = COLORS.filter((c) => c !== next).sort(
            () => 0.5 - Math.random(),
        );
        const assignment = [next, others[0], others[1]].sort(
            () => 0.5 - Math.random(),
        );

        setTargetColor(next);
        setHardwarePads(assignment);

        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: 'TARGET_ALL',
                    target: next.toUpperCase(),
                    pads: assignment.map((c) => c.toUpperCase()),
                }),
            );
        }
    }, []);

    const onHardwareHit = useCallback(
        (data) => {
            setActivePad(data.pad);
            setTimeout(() => setActivePad(null), 150);

            if (data.color.toLowerCase() === targetRef.current) {
                setScore((s) => s + 100);
                nextRound();
            } else {
                setScore((s) => Math.max(0, s - 50));
            }
        },
        [nextRound],
    );

    useEffect(() => {
        let socket;
        let reconnectTimeout;

        const connect = () => {
            // Close existing if any
            if (wsRef.current) wsRef.current.close();

            socket = new WebSocket(`ws://${HARDWARE_IP}:${WS_PORT}`);

            socket.onopen = () => {
                console.log('✅ WebSocket Connected');
                setConnected(true);
            };

            socket.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.color !== undefined) onHardwareHit(data);
                } catch (err) {
                    console.error('Malformed JSON:', e.data);
                }
            };

            socket.onclose = () => {
                console.warn('❌ WebSocket Disconnected. Retrying...');
                setConnected(false);
                // Wait 3 seconds before reconnecting to prevent "looping"
                reconnectTimeout = setTimeout(connect, 3000);
            };

            socket.onerror = (err) => {
                console.error('WebSocket Error:', err);
            };

            wsRef.current = socket;
        };

        connect();

        // CLEANUP: If you leave the page or it refreshes, kill the socket
        return () => {
            if (wsRef.current) wsRef.current.close();
            clearTimeout(reconnectTimeout);
        };
    }, [onHardwareHit]);

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.statusBadge,
                    backgroundColor: isConnected ? '#4CAF50' : '#F44336',
                }}
            >
                {isConnected ? 'HARDWARE SYNCED' : 'RECONNECTING...'}
            </div>

            <h1 style={styles.scoreText}>{score}</h1>

            <div style={{ ...styles.targetCircle, borderColor: targetColor }}>
                {targetColor.toUpperCase()}
            </div>

            <div style={styles.mirrorContainer}>
                {hardwarePads.map((c, i) => (
                    <div key={i} style={styles.padWrapper}>
                        <div
                            style={{
                                ...styles.padIndicator,
                                backgroundColor: c,
                                transform:
                                    activePad === i ? 'scale(1.2)' : 'scale(1)',
                                boxShadow:
                                    activePad === i ? `0 0 20px ${c}` : 'none',
                            }}
                        />
                        <span style={styles.padLabel}>PAD {i + 1}</span>
                    </div>
                ))}
            </div>

            <button style={styles.startBtn} onClick={nextRound}>
                START SESSION
            </button>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0F172A',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'monospace',
    },
    statusBadge: {
        position: 'absolute',
        top: 20,
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: '4rem',
        margin: '20px 0',
        textShadow: '0 0 10px rgba(255,255,255,0.2)',
    },
    targetCircle: {
        padding: '40px 60px',
        border: '10px solid',
        borderRadius: '30px',
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '40px',
        transition: 'all 0.3s',
    },
    mirrorContainer: {
        display: 'flex',
        gap: '40px',
        background: '#1E293B',
        padding: '20px',
        borderRadius: '20px',
        border: '1px solid #334155',
    },
    padWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    padIndicator: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        transition: '0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    padLabel: { marginTop: '10px', fontSize: '0.7rem', opacity: 0.6 },
    startBtn: {
        marginTop: '50px',
        padding: '15px 40px',
        fontSize: '1.2rem',
        background: '#38BDF8',
        color: '#0F172A',
        border: 'none',
        borderRadius: '50px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default ColorMatchGame;
