import React, { useEffect, useState } from 'react';

const H5PGamePage = ({ gameUrl }) => {
    const [gameResult, setGameResult] = useState(null);

    useEffect(() => {
        // 1. Listen for messages from the H5P iframe
        const handleMessage = (event) => {
            // Security check: Ensure the message comes from your trusted H5P host
            // if (event.origin !== "https://your-h5p-host.com") return;

            if (event.data && event.data.context) {
                const statement = event.data;

                // 2. Check for "completed" or "answered" verbs in xAPI
                if (
                    statement.verb.display['en-US'] === 'completed' ||
                    statement.verb.display['en-US'] === 'answered'
                ) {
                    const score = statement.result.score.scaled * 100; // Convert to percentage
                    setGameResult({
                        score: score,
                        success: statement.result.success,
                        duration: statement.result.duration,
                    });

                    // 3. You can now save this to your database
                    saveToDatabase(score);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const saveToDatabase = (score) => {
        console.log('Saving score to backend:', score);
        // fetch('/api/save-score', { method: 'POST', body: JSON.stringify({ score }) });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h2>Educational Challenge</h2>

            {/* The H5P Player Container */}
            <div
                className="game-container"
                style={{
                    border: '2px solid #eee',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <iframe
                    id="h5p-iframe"
                    src={gameUrl} // Link to your hosted H5P content
                    width="100%"
                    height="600px"
                    frameBorder="0"
                    allowFullScreen
                    allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; magnetism"
                    title="H5P Content"
                ></iframe>
            </div>

            {/* Result Display */}
            {gameResult && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#e6f7ff',
                        borderRadius: '5px',
                    }}
                >
                    <h3>Game Results Captured!</h3>
                    <p>
                        Final Score: <strong>{gameResult.score}%</strong>
                    </p>
                    <p>
                        Status:{' '}
                        {gameResult.success ? '✅ Passed' : '❌ Try Again'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default H5PGamePage;
