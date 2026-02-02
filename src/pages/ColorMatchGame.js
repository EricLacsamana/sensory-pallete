import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import API_BASE_URL from '../config';

// --- CONFIGURATION ---
const ESP_IP = 'http://192.168.68.135';

// AUDIO FILES
const SUCCESS_SOUND = new Audio('/success.mp3');
const FAIL_SOUND = new Audio('/fail.mp3');
const LEVEL_UP_SOUND = new Audio('/levelup.mp3');
const WRONG_SOUND = new Audio('/wrong.mp3');

// ARDUINO MAPPINGS
const ARDUINO_COLORS = {
    RED: 0,
    GREEN: 1,
    BLUE: 2,
    YELLOW: 3,
    CYAN: 4,
    MAGENTA: 5,
};

const ColorMatchGame = ({ learner, therapist, onBack }) => {
    // --- STATE ---
    const [gameState, setGameState] = useState('INTRO');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [levelScore, setLevelScore] = useState(0);
    const [round, setRound] = useState(1);

    // LIVE SENSOR DATA
    const [currentPressure, setCurrentPressure] = useState(0);

    // DATA LOGGING
    const [sessionLogs, setSessionLogs] = useState([]);
    const [levelStatsHistory, setLevelStatsHistory] = useState([]);

    // MODALS
    const [showEndSessionModal, setShowEndSessionModal] = useState(false);

    // GAME TARGETS
    const [targetColor, setTargetColor] = useState(null);
    const [targetPad, setTargetPad] = useState(null);
    const [message, setMessage] = useState('Press Start to Begin');

    // TIMERS
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [levelStartTime, setLevelStartTime] = useState(0);
    const [roundTimeLeft, setRoundTimeLeft] = useState(null);
    const [roundStartTime, setRoundStartTime] = useState(0);

    const isTimerPausedRef = useRef(true);

    // CURRENT LEVEL STATS
    const [reactionTimes, setReactionTimes] = useState([]);
    const [mistakes, setMistakes] = useState(0);
    const [roundMistakes, setRoundMistakes] = useState(0);
    const [mistakeDetails, setMistakeDetails] = useState({
        wrongPad: 0,
        timeout: 0,
    });
    const [pressDurations, setPressDurations] = useState([]);
    const [colorCounts, setColorCounts] = useState({});

    // REFS
    const socketRef = useRef(null);
    const roundTimerRef = useRef(null);

    // --- LEVEL CONFIGURATION ---
    const LEVEL_CONFIG = {
        1: {
            name: 'Association',
            rounds: 10,
            maxPoints: 10,
            passScore: 50,
            allowedMistakes: 2,
            colors: ['RED', 'GREEN', 'BLUE'],
            roundLimit: null,
            minForce: 10,
            desc: 'Practice Mode: You have 3 chances per color.',
            goal: 'Accuracy Focus',
        },
        2: {
            name: 'Pacing',
            rounds: 20,
            maxPoints: 5,
            passScore: 75,
            allowedMistakes: 1,
            colors: ['RED', 'GREEN', 'BLUE', 'YELLOW'],
            roundLimit: 15,
            minForce: 10,
            desc: 'Focus Mode: You have 2 chances per color.',
            goal: 'Sustained Attention',
        },
        3: {
            name: 'Speed',
            rounds: 20,
            maxPoints: 5,
            passScore: 80,
            allowedMistakes: 0,
            colors: ['RED', 'GREEN', 'BLUE', 'YELLOW', 'CYAN', 'MAGENTA'],
            roundLimit: 5,
            minForce: 10,
            desc: 'Precision Mode: One chance only! No mistakes allowed.',
            goal: 'Reaction Time',
        },
        4: {
            name: 'Strength',
            rounds: 10,
            maxPoints: 10,
            passScore: 70,
            allowedMistakes: 0,
            colors: ['RED', 'GREEN', 'BLUE', 'YELLOW', 'CYAN', 'MAGENTA'],
            roundLimit: 8,
            minForce: 80,
            desc: 'Power Mode: Press HARD! One chance only.',
            goal: 'Proprioception (Force Control)',
        },
    };

    // --- HELPERS ---
    const formatTime = (secs) => {
        if (secs === null || isNaN(secs)) return '--:--';
        const m = Math.floor(secs / 60)
            .toString()
            .padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const triggerFullScreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(console.log);
    };
    const exitFullScreen = () => {
        if (document.fullscreenElement && document.exitFullscreen)
            document.exitFullscreen().catch(console.log);
    };

    // --- TIMER LOGIC (SESSION) ---
    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (!isTimerPausedRef.current) {
                setTotalSeconds((prev) => prev + 1);
            }
        }, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    const setTimerPaused = (paused) => {
        isTimerPausedRef.current = paused;
    };

    // --- LOGIC: FINISH LEVEL ---
    const handleLevelComplete = useCallback(
        (passed) => {
            setTimerPaused(true);

            // FIX: Calculate duration correctly
            const levelDurationSeconds = Math.max(
                0,
                (Date.now() - levelStartTime) / 1000,
            );

            const avgReaction =
                reactionTimes.length > 0
                    ? reactionTimes.reduce((a, b) => a + b, 0) /
                      reactionTimes.length
                    : 0;
            const avgDuration =
                pressDurations.length > 0
                    ? pressDurations.reduce((a, b) => a + b, 0) /
                      pressDurations.length
                    : 0;

            const totalMistakes =
                mistakeDetails.wrongPad + mistakeDetails.timeout;
            const totalAttempts = reactionTimes.length + totalMistakes;
            const accuracy =
                totalAttempts > 0
                    ? (reactionTimes.length / totalAttempts) * 100
                    : 0;

            const speedFactor = Math.max(0, 100 - avgReaction * 20);
            const engagementScore = Math.round(
                accuracy * 0.4 + speedFactor * 0.4 + (passed ? 20 : 0),
            );

            const colorFreqString = Object.entries(colorCounts)
                .map(([k, v]) => `${k}:${v}`)
                .join(', ');

            const levelStat = {
                level: level,
                name: LEVEL_CONFIG[level].name,
                score: levelScore,
                maxScore:
                    LEVEL_CONFIG[level].rounds * LEVEL_CONFIG[level].maxPoints,
                duration: levelDurationSeconds, // Store numeric seconds
                avgReaction: avgReaction.toFixed(2),
                avgDuration: avgDuration.toFixed(2),
                mistakesTotal: totalMistakes,
                mistakesWrong: mistakeDetails.wrongPad,
                mistakesTimeout: mistakeDetails.timeout,
                colorFreq: colorFreqString,
                accuracy: accuracy.toFixed(1),
                engagement: engagementScore,
                status: passed ? 'Passed' : 'Failed',
            };

            setLevelStatsHistory((prev) => [...prev, levelStat]);
            setGameState(passed ? 'LEVEL_COMPLETE' : 'FAILED');

            if (passed) LEVEL_UP_SOUND.play().catch(() => {});
            else FAIL_SOUND.play().catch(() => {});
        },
        [
            level,
            levelScore,
            reactionTimes,
            mistakeDetails,
            pressDurations,
            LEVEL_CONFIG,
            levelStartTime,
            colorCounts,
        ],
    );

    // --- LOGIC: FINISH GAME ---
    const handleFinishGame = useCallback(
        (saveData = true, reason = '') => {
            clearInterval(roundTimerRef.current);
            exitFullScreen();
            axios.get(`${ESP_IP}/set-target?pad=-1&color=-1`).catch(() => {});

            if (saveData) {
                const totalEngagement = levelStatsHistory.reduce(
                    (acc, curr) => acc + curr.engagement,
                    0,
                );
                const avgEngagement =
                    levelStatsHistory.length > 0
                        ? Math.round(totalEngagement / levelStatsHistory.length)
                        : 0;

                const sessionData = {
                    learner_id: learner.id,
                    therapist_id: therapist.id,
                    activity_id: 1,
                    performance_score: score,
                    duration: totalSeconds,
                    engagement_level: avgEngagement,
                    detailed_logs: sessionLogs,
                    level_summary: levelStatsHistory,
                };

                axios
                    .post(`${API_BASE_URL}/log-session`, sessionData)
                    .then(() => console.log('Session Saved'))
                    .catch((err) => console.error('Save Failed', err));

                setGameState('FINISHED');
            } else {
                exitFullScreen();
                onBack();
            }
        },
        [
            learner.id,
            therapist.id,
            score,
            totalSeconds,
            sessionLogs,
            levelStatsHistory,
            onBack,
        ],
    );

    const checkLevelPass = useCallback(() => {
        const config = LEVEL_CONFIG[level];
        if (levelScore >= config.passScore) {
            handleLevelComplete(true);
        } else {
            handleLevelComplete(false);
        }
    }, [level, levelScore, LEVEL_CONFIG, handleLevelComplete]);

    // --- CORE LOGIC: NEXT ROUND ---
    const nextRound = useCallback(
        (currentLevel) => {
            const config = LEVEL_CONFIG[currentLevel];

            const nextColor =
                config.colors[Math.floor(Math.random() * config.colors.length)];
            const colorIndex = ARDUINO_COLORS[nextColor];
            const nextPad = Math.floor(Math.random() * 3);

            setColorCounts((prev) => ({
                ...prev,
                [nextColor]: (prev[nextColor] || 0) + 1,
            }));

            setTargetColor(nextColor);
            setTargetPad(nextPad);
            setRoundStartTime(Date.now());
            setRoundMistakes(0);
            setMessage(`Find ${nextColor}!`);
            setCurrentPressure(0);

            axios
                .get(`${ESP_IP}/set-target?pad=${nextPad}&color=${colorIndex}`)
                .catch(() => {});

            setRoundTimeLeft(config.roundLimit);
        },
        [LEVEL_CONFIG],
    );

    const finishRound = useCallback(
        (pointsEarned) => {
            setGameState('FEEDBACK');
            setScore((prev) => prev + pointsEarned);
            setLevelScore((prev) => prev + pointsEarned);

            setTimeout(() => {
                const config = LEVEL_CONFIG[level];
                if (round >= config.rounds) {
                    checkLevelPass();
                } else {
                    setRound((prev) => prev + 1);
                    setGameState('PLAYING');
                    nextRound(level);
                }
            }, 1500);
        },
        [level, round, nextRound, LEVEL_CONFIG, checkLevelPass],
    );

    // --- ROUND TIMEOUT LOGIC ---
    const handleRoundTimeout = useCallback(() => {
        FAIL_SOUND.play();
        setMessage('Too Slow! ⏳ (0 Pts)');

        setMistakes((prev) => prev + 1);
        setMistakeDetails((prev) => ({ ...prev, timeout: prev.timeout + 1 }));
        setReactionTimes((prev) => [...prev, 10]);

        axios.get(`${ESP_IP}/set-target?pad=-1&color=-1`).catch(() => {});

        finishRound(0);
    }, [finishRound]);

    // --- 1. TIMER TICKER ---
    useEffect(() => {
        if (gameState === 'PLAYING') {
            const timer = setInterval(() => {
                setRoundTimeLeft((prev) => {
                    if (prev === null) return null;
                    if (prev <= 0) return 0;
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    // --- 2. TIMER TRIGGER ---
    useEffect(() => {
        if (gameState === 'PLAYING' && roundTimeLeft === 0) {
            handleRoundTimeout();
        }
    }, [gameState, roundTimeLeft, handleRoundTimeout]);

    // --- INPUT HANDLER ---
    const handleInput = useCallback(
        (data) => {
            if (gameState !== 'PLAYING') return;

            if (data.pressure) setCurrentPressure(data.pressure);

            const logEntry = {
                timestamp: new Date().toISOString(),
                level: level,
                target: targetColor,
                pressed_pad: data.pad,
                pressure: data.pressure || 0,
                reaction_time: data.reactionTime,
                mistake: data.mistake,
                duration: data.duration || 0,
            };
            setSessionLogs((prev) => [...prev, logEntry]);

            if (data.mistake === false) {
                const config = LEVEL_CONFIG[level];
                if (config.minForce && (data.pressure || 0) < config.minForce) {
                    setMessage(`Try Pushing Harder! (${data.pressure}%)`);
                    return;
                }

                const rTime =
                    data.reactionTime || (Date.now() - roundStartTime) / 1000;
                setReactionTimes((prev) => [...prev, rTime]);
                if (data.duration)
                    setPressDurations((prev) => [...prev, data.duration]);

                const points = config.maxPoints;

                SUCCESS_SOUND.currentTime = 0;
                SUCCESS_SOUND.play();
                setMessage(`Great! +${points} Pts`);
                finishRound(points);
            } else {
                const config = LEVEL_CONFIG[level];

                setMistakes((prev) => prev + 1);
                setMistakeDetails((prev) => ({
                    ...prev,
                    wrongPad: prev.wrongPad + 1,
                }));

                const newRoundMistakes = roundMistakes + 1;
                setRoundMistakes(newRoundMistakes);

                if (newRoundMistakes > config.allowedMistakes) {
                    WRONG_SOUND.currentTime = 0;
                    WRONG_SOUND.play();
                    setMessage(`Next time!`);
                    finishRound(0);
                } else {
                    WRONG_SOUND.currentTime = 0;
                    WRONG_SOUND.play();
                    const triesLeft =
                        config.allowedMistakes + 1 - newRoundMistakes;
                    setMessage(
                        `Careful! ${triesLeft} Chance${triesLeft > 1 ? 's' : ''} Left`,
                    );
                }
            }
        },
        [
            gameState,
            targetColor,
            level,
            LEVEL_CONFIG,
            roundStartTime,
            finishRound,
            roundMistakes,
        ],
    );

    // --- SETUP ---
    useEffect(() => {
        socketRef.current = io(API_BASE_URL);
        socketRef.current.on('fsr_update', (data) => handleInput(data));
        return () => {
            socketRef.current.disconnect();
        };
    }, [handleInput]);

    // --- ACTIONS ---
    const initGame = () => {
        setScore(0);
        setLevelScore(0);
        setLevel(1);
        setRound(1);
        setTotalSeconds(0);
        setLevelStatsHistory([]);
        setSessionLogs([]);
        setReactionTimes([]);
        setMistakes(0);
        setPressDurations([]);
        setMistakeDetails({ wrongPad: 0, timeout: 0 });
        setColorCounts({});
        setTimerPaused(true);
        setGameState('FULLSCREEN_PROMPT');
    };

    const startLevelAction = () => {
        setGameState('PLAYING');
        setTimerPaused(false);
        setLevelStartTime(Date.now());

        setReactionTimes([]);
        setMistakes(0);
        setPressDurations([]);
        setLevelScore(0);
        setRound(1);
        setMistakeDetails({ wrongPad: 0, timeout: 0 });
        setColorCounts({});
        setRoundMistakes(0);

        nextRound(level);
    };

    const proceedToNextLevel = () => {
        if (level >= 4) {
            handleFinishGame(true, 'All Levels Complete!');
        } else {
            setLevel((prev) => prev + 1);
            setGameState('INSTRUCTIONS');
        }
    };

    const quitEarly = (shouldSave) => {
        setShowEndSessionModal(false);
        handleFinishGame(shouldSave, 'Session Ended Early');
    };

    const getCircleStyle = () => {
        if (gameState === 'FEEDBACK')
            return { background: 'gold', transform: 'scale(1.1)' };
        const map = {
            RED: '#FF5252',
            GREEN: '#69F0AE',
            BLUE: '#448AFF',
            YELLOW: '#FFD700',
            CYAN: '#00BCD4',
            MAGENTA: '#E040FB',
        };
        const colorHex = targetColor ? map[targetColor] : '#eee';
        return {
            background: colorHex,
            boxShadow: `0 0 40px ${colorHex}`,
            border: '4px solid white',
        };
    };

    const renderHearts = () => {
        const config = LEVEL_CONFIG[level];
        const totalLives = config.allowedMistakes + 1;
        const livesLeft = Math.max(0, totalLives - roundMistakes);

        return (
            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    marginTop: '15px',
                }}
            >
                {[...Array(totalLives)].map((_, i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: '24px',
                            color: i < livesLeft ? '#E74C3C' : '#BDC3C7',
                            transition: 'all 0.3s',
                            transform:
                                i < livesLeft ? 'scale(1)' : 'scale(0.8)',
                        }}
                    >
                        {i < livesLeft ? '❤️' : '💔'}
                    </span>
                ))}
            </div>
        );
    };

    // ================= SCREENS =================

    // 0. INTRO
    if (gameState === 'INTRO') {
        return (
            <div
                className="main-content"
                style={{
                    textAlign: 'center',
                    paddingTop: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        maxWidth: '600px',
                        width: '100%',
                    }}
                >
                    <h1 style={{ color: '#3498DB', marginBottom: '10px' }}>
                        Color Match
                    </h1>
                    <p
                        style={{
                            color: '#7f8c8d',
                            fontSize: '18px',
                            marginBottom: '30px',
                        }}
                    >
                        Sensory Integration & Reaction Training
                    </p>
                    <div
                        style={{
                            textAlign: 'left',
                            color: '#555',
                            marginBottom: '40px',
                            lineHeight: '1.6',
                        }}
                    >
                        <p>
                            <strong>📝 Description:</strong> Match the colors on
                            the screen with the haptic pads.
                        </p>
                        <p>
                            <strong>🧠 Skills Targeted:</strong>
                        </p>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>Visual-Motor Integration</li>
                            <li>Reaction Speed</li>
                            <li>Force Control</li>
                        </ul>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            className="action-btn"
                            onClick={onBack}
                            style={{ background: '#95a5a6' }}
                        >
                            ⬅ Back
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => initGame()}
                            style={{
                                background: '#27ae60',
                                fontSize: '1.2rem',
                                padding: '12px 30px',
                            }}
                        >
                            Start Session ▶
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 1. PROMPT
    if (gameState === 'FULLSCREEN_PROMPT') {
        return (
            <div
                className="main-content"
                style={{
                    textAlign: 'center',
                    paddingTop: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                >
                    <h2 style={{ color: '#2C3E50' }}>Enable Focus Mode?</h2>
                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <button
                            className="action-btn"
                            onClick={() => {
                                triggerFullScreen();
                                setGameState('INSTRUCTIONS');
                            }}
                            style={{ background: '#27ae60' }}
                        >
                            Yes
                        </button>
                        <button
                            className="action-btn"
                            onClick={() => {
                                setGameState('INSTRUCTIONS');
                            }}
                            style={{ background: '#95a5a6' }}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. INSTRUCTIONS
    if (gameState === 'INSTRUCTIONS') {
        const config = LEVEL_CONFIG[level];
        return (
            <div
                className="main-content"
                style={{
                    textAlign: 'center',
                    paddingTop: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '50px',
                        borderRadius: '20px',
                        border: '4px solid #3498DB',
                        maxWidth: '600px',
                        width: '100%',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                >
                    <h2 style={{ color: '#3498DB' }}>
                        LEVEL {level}: {config.name.toUpperCase()}
                    </h2>
                    <div
                        style={{
                            textAlign: 'left',
                            margin: '30px 0',
                            fontSize: '1.1rem',
                            color: '#555',
                        }}
                    >
                        <p>
                            <strong>ℹ️ Instructions:</strong> {config.desc}
                        </p>
                        <p>
                            <strong>🎯 Goal:</strong> {config.goal}
                        </p>
                        <p>
                            <strong>🏆 Passing Score:</strong>{' '}
                            {config.passScore} / 100
                        </p>
                        <p>
                            <strong>🔄 Rounds:</strong> {config.rounds}
                        </p>
                    </div>
                    <button
                        className="action-btn"
                        onClick={startLevelAction}
                        style={{
                            fontSize: '1.5rem',
                            padding: '15px 40px',
                            background: '#3498DB',
                        }}
                    >
                        START LEVEL ➡
                    </button>
                </div>
            </div>
        );
    }

    // 3. LEVEL COMPLETE
    if (gameState === 'LEVEL_COMPLETE' || gameState === 'FAILED') {
        const lastStat = levelStatsHistory[levelStatsHistory.length - 1] || {};
        const isPass = gameState === 'LEVEL_COMPLETE';
        const color = isPass ? '#4CAF50' : '#E74C3C';
        const config = LEVEL_CONFIG[level];

        return (
            <div
                className="main-content"
                style={{
                    textAlign: 'center',
                    paddingTop: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <div
                    style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        border: `4px solid ${color}`,
                        minWidth: '600px',
                        display: 'inline-block',
                    }}
                >
                    <h1 style={{ color: color, margin: '0 0 10px 0' }}>
                        {isPass
                            ? `⭐ Level ${level} Complete!`
                            : 'Session Paused'}
                    </h1>
                    {!isPass && (
                        <p style={{ color: '#7f8c8d' }}>
                            Score too low. Practice makes perfect! <br></br>{' '}
                            Passing Score: {config.passScore}/100
                        </p>
                    )}

                    <h2 style={{ color: '#555' }}>
                        Score: {lastStat.score}/100
                    </h2>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            background: '#f9f9f9',
                            padding: '20px',
                            borderRadius: '10px',
                            textAlign: 'left',
                        }}
                    >
                        <div>
                            <strong>⚡ Avg Reaction:</strong>{' '}
                            {lastStat.avgReaction}s
                        </div>
                        <div>
                            <strong>🎯 Accuracy:</strong> {lastStat.accuracy}%
                        </div>
                        <div>
                            <strong>⏱ Duration:</strong>{' '}
                            {formatTime(lastStat.duration)}
                        </div>
                        <div>
                            <strong>❌ Mistakes:</strong>{' '}
                            <span style={{ color: 'red' }}>
                                {lastStat.mistakesTotal}
                            </span>
                        </div>
                        <div style={{ color: '#777', fontSize: '12px' }}>
                            Wrong: {lastStat.mistakesWrong} | Timeout:{' '}
                            {lastStat.mistakesTimeout}
                        </div>
                        <div
                            style={{
                                gridColumn: 'span 2',
                                textAlign: 'center',
                                color: color,
                                fontWeight: 'bold',
                                borderTop: '1px solid #ddd',
                                paddingTop: '10px',
                            }}
                        >
                            Engagement: {lastStat.engagement}/100
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        {isPass && level < 4 ? (
                            <button
                                className="action-btn"
                                onClick={proceedToNextLevel}
                                style={{ background: color }}
                            >
                                Next Level ➡
                            </button>
                        ) : !isPass ? (
                            <button
                                className="action-btn"
                                onClick={startLevelAction}
                                style={{ background: '#3498DB' }}
                            >
                                🔄 Try Again
                            </button>
                        ) : (
                            <button
                                className="action-btn"
                                onClick={() => handleFinishGame(true)}
                                style={{
                                    background: '#F9BF15',
                                    color: 'black',
                                }}
                            >
                                🏆 Finish & View Report
                            </button>
                        )}
                        <button
                            className="action-btn"
                            onClick={() => setShowEndSessionModal(true)}
                            style={{ background: '#95a5a6' }}
                        >
                            End Session
                        </button>
                    </div>
                </div>
                {showEndSessionModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2000,
                        }}
                    >
                        <div
                            style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '15px',
                                width: '350px',
                            }}
                        >
                            <h3>End Session Now?</h3>
                            <p>Save progress?</p>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                <button
                                    className="action-btn"
                                    onClick={() => quitEarly(true)}
                                    style={{ background: '#27ae60' }}
                                >
                                    Of Course
                                </button>
                                <button
                                    className="action-btn"
                                    onClick={() => quitEarly(false)}
                                    style={{ background: '#e74c3c' }}
                                >
                                    No
                                </button>
                            </div>
                            <button
                                onClick={() => setShowEndSessionModal(false)}
                                style={{
                                    marginTop: '15px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 4. FINAL RESULTS (MATCHES DASHBOARD MODAL)
    if (gameState === 'FINISHED') {
        return (
            <div
                className="main-content"
                style={{
                    textAlign: 'center',
                    paddingTop: '30px',
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                {/* Added container style to center the results card */}
                <div
                    style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        maxWidth: '950px',
                        width: '95%',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                >
                    <h1 style={{ color: '#2C3E50', marginBottom: '30px' }}>
                        Session Report
                    </h1>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '30px',
                        }}
                    >
                        <div>
                            <h3>Total Score: {score}</h3>
                        </div>
                        <div>
                            <h3>Session Time: {formatTime(totalSeconds)}</h3>
                        </div>
                    </div>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginBottom: '30px',
                            fontSize: '14px',
                        }}
                    >
                        <thead>
                            <tr
                                style={{ background: '#f1f1f1', color: '#666' }}
                            >
                                <th style={{ padding: '10px' }}>Level</th>
                                <th>Score</th>
                                <th>Time</th>
                                <th>Reaction</th>
                                <th>Duration</th>
                                <th>Mistakes (W/T)</th>
                                <th>Accuracy</th>
                                <th>Engage.</th>
                                <th>Color Freq</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levelStatsHistory.map((stat, idx) => (
                                <tr
                                    key={idx}
                                    style={{ borderBottom: '1px solid #eee' }}
                                >
                                    <td
                                        style={{
                                            padding: '10px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {stat.name}
                                    </td>
                                    <td
                                        style={{
                                            color: '#F9BF15',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {stat.score}/{stat.maxScore}
                                    </td>
                                    <td>{formatTime(stat.duration)}</td>
                                    <td>{stat.avgReaction}s</td>
                                    <td>{formatTime(stat.duration)}</td>
                                    <td>
                                        <span style={{ color: 'red' }}>
                                            {stat.mistakesTotal}
                                        </span>{' '}
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                color: '#999',
                                            }}
                                        >
                                            ({stat.mistakesWrong}/
                                            {stat.mistakesTimeout})
                                        </span>
                                    </td>
                                    <td>{stat.accuracy}%</td>
                                    <td
                                        style={{
                                            fontWeight: 'bold',
                                            color:
                                                stat.engagement > 80
                                                    ? 'green'
                                                    : 'orange',
                                        }}
                                    >
                                        {stat.engagement}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: '11px',
                                            color: '#555',
                                        }}
                                    >
                                        {stat.colorFreq}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className="action-btn"
                        onClick={() => {
                            exitFullScreen();
                            onBack();
                        }}
                        style={{ width: '30%' }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ================= MAIN GAME =================
    return (
        <div
            className="main-content"
            style={{
                textAlign: 'center',
                position: 'relative',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                className="page-header"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    padding: '20px',
                }}
            >
                <div style={{ textAlign: 'left' }}>
                    <h1 className="page-title">Color Match</h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        Level {level} | Round {round}/
                        {LEVEL_CONFIG[level].rounds}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#3498DB',
                        }}
                    >
                        ⏱ {formatTime(totalSeconds)}
                    </div>
                    <div
                        style={{
                            fontSize: '16px',
                            color: '#666',
                            marginTop: '5px',
                        }}
                    >
                        Score: {levelScore} / 100
                    </div>
                    {roundTimeLeft !== null && (
                        <h3
                            style={{
                                color:
                                    roundTimeLeft < 3 ? '#E74C3C' : '#2C3E50',
                                marginTop: '5px',
                            }}
                        >
                            Round: {roundTimeLeft}s
                        </h3>
                    )}
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: '260px',
                        margin: '0 auto',
                    }}
                >
                    <div
                        style={{
                            width: '250px',
                            height: '250px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            ...getCircleStyle(),
                            margin: '0 auto',
                        }}
                    >
                        {gameState === 'PLAYING' && (
                            <h1
                                style={{
                                    color: 'white',
                                    fontSize: '3rem',
                                    textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                                }}
                            >
                                {targetColor}
                            </h1>
                        )}
                    </div>
                    {gameState === 'PLAYING' && renderHearts()}
                    {gameState === 'PLAYING' && (
                        <div
                            style={{
                                marginTop: '20px',
                                background: '#eee',
                                borderRadius: '10px',
                                height: '20px',
                                width: '100%',
                                border: '2px solid #ddd',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${Math.min(currentPressure, 100)}%`,
                                    background:
                                        currentPressure >=
                                        LEVEL_CONFIG[level].minForce
                                            ? '#2ecc71'
                                            : '#f1c40f',
                                    transition: 'width 0.1s ease-out',
                                }}
                            ></div>
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    color: '#333',
                                    fontWeight: 'bold',
                                }}
                            >
                                Force: {currentPressure}%
                            </span>
                        </div>
                    )}
                </div>
                <h1 style={{ marginTop: '20px', minHeight: '50px' }}>
                    {message}
                </h1>
                {targetPad !== null && gameState === 'PLAYING' && (
                    <p style={{ color: '#999' }}>
                        (Hint: Look for light on Pad {targetPad + 1})
                    </p>
                )}
            </div>

            {/* SIMULATOR */}
            {gameState === 'PLAYING' && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100px',
                        left: '20px',
                        background: 'white',
                        padding: '10px',
                        border: '1px solid #ccc',
                        zIndex: 999,
                        borderRadius: '8px',
                        textAlign: 'left',
                    }}
                >
                    <small>SIMULATOR</small>
                    <button
                        onClick={() =>
                            handleInput({
                                pad: targetPad,
                                pressure: 100,
                                mistake: false,
                                reactionTime: 0.5,
                            })
                        }
                        style={{
                            display: 'block',
                            margin: '5px 0',
                            background: '#2ecc71',
                        }}
                    >
                        Win
                    </button>
                    <button
                        onClick={() =>
                            handleInput({
                                pad: (targetPad + 1) % 3,
                                pressure: 50,
                                mistake: true,
                                reactionTime: 0.8,
                            })
                        }
                        style={{
                            display: 'block',
                            margin: '5px 0',
                            background: '#e74c3c',
                        }}
                    >
                        Fail
                    </button>
                </div>
            )}

            {/* END SESSION BTN */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px' }}>
                <button
                    onClick={() => setShowEndSessionModal(true)}
                    style={{
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        padding: '12px 25px',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    End Session
                </button>
            </div>

            {showEndSessionModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '30px',
                            borderRadius: '15px',
                            width: '350px',
                        }}
                    >
                        <h3>End Session Now?</h3>
                        <p>Do you want to save the progress so far?</p>
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                marginTop: '20px',
                            }}
                        >
                            <button
                                className="action-btn"
                                onClick={() => quitEarly(true)}
                                style={{ background: '#27ae60' }}
                            >
                                Of Course
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => quitEarly(false)}
                                style={{ background: '#e74c3c' }}
                            >
                                No
                            </button>
                        </div>
                        <button
                            onClick={() => setShowEndSessionModal(false)}
                            style={{
                                marginTop: '15px',
                                background: 'none',
                                border: 'none',
                                color: '#999',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorMatchGame;
