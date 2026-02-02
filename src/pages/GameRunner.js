// pages/GameRunner.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GAME_COMPONENTS } from '../components/games';
import { getActivitySession } from '../api/acitivity-session';

const GameRunner = () => {
    const { sessionId } = useParams();

    // 1. Fetch the session data (which contains the activity type)
    const { data: session, isLoading } = useQuery({
        queryKey: ['session', sessionId],
        queryFn: () => getActivitySession(sessionId),
    });

    if (isLoading) return <div>Loading Engine...</div>;

    // 2. Identify which game component to use from CMS data
    // Example: session.activity.gameKey might be "color-match"
    const gameKey = session?.activity?.gameKey;
    const SelectedGame = GAME_COMPONENTS[gameKey];

    if (!SelectedGame) {
        return <div>Game type "{gameKey}" not found.</div>;
    }

    // 3. Render the game and pass session data as props
    return (
        <div className="game-viewport">
            <SelectedGame
                sessionId={sessionId}
                config={session.activity.config}
            />
        </div>
    );
};

export default GameRunner;
