import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaChartPie,
    FaUsers,
    FaSignOutAlt,
    FaUserCircle,
    FaWifi,
    FaGamepad,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import { me } from '../api/users';
import { useQuery } from '@tanstack/react-query';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const { data: user = {} } = useQuery({
        queryKey: ['me'],
        queryFn: me,
        initialData: {
            username: '',
            fullName: '',
            role: { name: '', type: '' },
        },
    });

    console.log('user', user);

    const handleLogout = () => dispatch(logout());

    // Check if path is active (handling sub-routes for students)
    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: <FaChartPie /> },
        { path: '/students', label: 'Learners', icon: <FaUsers /> },
        { path: '/activities', label: 'Game Center', icon: <FaGamepad /> },
        { path: '/devices', label: 'Sensors', icon: <FaWifi /> },
    ];

    return (
        <div className="sidebar" style={sidebarStyle}>
            {/* LOGO AREA */}
            <div style={logoContainerStyle}>
                <img
                    src="/Logo.png"
                    alt="Logo"
                    style={logoImgStyle}
                    onClick={() => navigate('/dashboard')}
                />
            </div>

            {/* USER CARD */}
            <div style={userCardStyle}>
                <div style={avatarWrapper}>
                    <FaUserCircle size={38} />
                </div>
                <div style={userTextWrapper}>
                    <p style={userNameStyle}>{user.fullName || 'Guest'}</p>
                    <span style={userRoleStyle}>{user?.role?.name}</span>
                </div>
            </div>

            {/* NAVIGATION */}
            <div style={navWrapperStyle}>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const hovered = hoveredItem === item.path;

                    return (
                        <div
                            key={item.path}
                            onMouseEnter={() => setHoveredItem(item.path)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => navigate(item.path)}
                            style={{
                                ...navItemStyle,
                                backgroundColor: active
                                    ? 'rgba(255,255,255,0.15)'
                                    : hovered
                                      ? 'rgba(255,255,255,0.08)'
                                      : 'transparent',
                                color: active
                                    ? 'var(--white)'
                                    : 'rgba(255,255,255,0.8)',
                                transform: hovered
                                    ? 'translateX(8px)'
                                    : 'translateX(0)',
                            }}
                        >
                            {/* Active Vertical Pill */}
                            {active && <div style={activePillStyle} />}

                            <span
                                style={{
                                    ...navIconStyle,
                                    color: active ? 'var(--yellow)' : 'inherit',
                                }}
                            >
                                {item.icon}
                            </span>
                            <span
                                style={{ fontWeight: active ? '700' : '500' }}
                            >
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* LOGOUT SECTION */}
            <div style={logoutWrapperStyle}>
                <div
                    onClick={handleLogout}
                    onMouseEnter={() => setHoveredItem('logout')}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                        ...navItemStyle,
                        marginTop: '0',
                        color:
                            hoveredItem === 'logout' ? 'var(--pink)' : 'white',
                    }}
                >
                    <FaSignOutAlt style={navIconStyle} />
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---

const sidebarStyle = {
    width: '280px',
    backgroundColor: 'var(--blue3)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 20px',
    fontFamily: "'Fredoka', sans-serif",
    position: 'sticky',
    top: 0,
    boxShadow: '10px 0 30px rgba(0,0,0,0.05)',
};

const logoContainerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
};

const logoImgStyle = {
    width: '140px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
};

const userCardStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.12)',
    padding: '15px',
    borderRadius: '24px',
    marginBottom: '40px',
    border: '1px solid rgba(255,255,255,0.1)',
};

const avatarWrapper = {
    backgroundColor: 'var(--blue2)',
    width: '45px',
    height: '45px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginRight: '12px',
};

const userTextWrapper = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
};

const userNameStyle = {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
};

const userRoleStyle = {
    fontSize: '0.75rem',
    opacity: 0.7,
    fontWeight: '400',
};

const navWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};

const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    fontSize: '1.05rem',
};

const activePillStyle = {
    position: 'absolute',
    left: '-10px',
    width: '6px',
    height: '24px',
    backgroundColor: 'var(--yellow)',
    borderRadius: '0 10px 10px 0',
    boxShadow: '0 0 10px rgba(254, 185, 49, 0.5)',
};

const navIconStyle = {
    marginRight: '15px',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
};

const logoutWrapperStyle = {
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
};

export default Sidebar;
