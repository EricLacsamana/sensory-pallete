import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store';

import AuthenticatedLayout from './components/AuthenticatedLayout';
import DefaultLayout from './components/DefaultLayout';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsDirectory from './pages/StudentsDirectory';
import Activity from './pages/Activity';
import ActivityCenter from './pages/ActivityCenter';
import Devices from './pages/Devices';
import SimpleGame from './pages/SimpleGame';
import StudentDashboard from './pages/StudentDashboard';
import ColorMatchGame from './components/ColorMatch';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <DefaultLayout>
                                        <Login />
                                    </DefaultLayout>
                                }
                            />
                            <Route element={<AuthenticatedLayout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route
                                    path="/students"
                                    element={<StudentsDirectory />}
                                />
                                <Route
                                    path="/students/:id"
                                    element={<StudentDashboard />}
                                />
                                <Route
                                    path="/activities"
                                    element={<ActivityCenter />}
                                />

                                <Route
                                    path="/activities/:id"
                                    element={<Activity />}
                                />
                                <Route
                                    path="/activity-sessions/:id"
                                    element={<ColorMatchGame />}
                                />
                                <Route path="/devices" element={<Devices />} />
                            </Route>

                            <Route
                                path="/"
                                element={<Navigate to="/login" />}
                            />
                            <Route
                                path="*"
                                element={<div>Page Not Found</div>}
                            />
                        </Routes>
                    </Router>
                </PersistGate>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
