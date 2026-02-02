import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from '../redux/auth/authSlice';
import studentImg from '../assets/student.png';
import LoginForm from '../components/LoginForm';

const Login = () => {
    const [isForceChange, setIsForceChange] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: (data) => loginUser(data.username, data.password),
        onMutate: () => {
            dispatch(loginStart());
        },
        onSuccess: (data) => {
            if (data?.forcePasswordChange) {
                setIsForceChange(true);
            } else {
                dispatch(loginSuccess(data));
            }
        },
        onError: (error) => {
            if (error.response) {
                const errorMessage =
                    error.response?.data?.error?.message || 'An error occurred';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            } else {
                dispatch(loginFailure('An unknown error occurred'));
                setError('An unknown error occurred');
            }
        },
    });

    const handleLogin = (data) => {
        mutation.mutate({ username: data.username, password: data.password });
    };

    return (
        <div className="login-wrapper">
            {/* <img src={teacherImg} alt="Teacher" className="teacher-char" /> */}
            <div className="login-content-container">
                <img
                    src={studentImg}
                    alt="Student"
                    className="char-img student-char"
                />
                <div className="login-card">
                    <p className="login-title">
                        {isForceChange ? 'Setup Account' : 'Welcome Back!'}
                    </p>
                    <p className="login-subtitle">
                        {isForceChange
                            ? 'First-time login? Please set a new password.'
                            : 'Please enter your details...'}
                    </p>

                    {error && <p className="error-message">{error}</p>}
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </div>
        </div>
    );
};

export default Login;
