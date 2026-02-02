import axios from 'axios';

import { loginFailure } from '../redux/auth/authSlice';
import { store } from '../redux/store';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:1337',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const state = store.getState();

        const token = state.auth?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Session expired. Logging out...');

            store.dispatch(
                loginFailure('Session expired. Please log in again.'),
            );
        }
        return Promise.reject(error);
    },
);

export default api;
