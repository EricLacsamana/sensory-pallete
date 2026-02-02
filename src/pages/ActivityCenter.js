import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useStudent } from '../hooks/useStudents';
import {
    FaLock,
    FaPlay,
    FaSearch,
    FaGamepad,
    FaArrowLeft,
    FaBrain,
    FaTags,
    FaAudible,
    FaWalking,
} from 'react-icons/fa'; // Using FontAwesome 6 for cleaner therapy icons

// --- Category Icon Mapper ---
const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'cognitive':
            return <FaBrain style={{ marginRight: '8px' }} />;
        case 'motor':
            return <FaWalking style={{ marginRight: '8px' }} />;
        case 'auditory':
            return <FaAudible style={{ marginRight: '8px' }} />;
        default:
            return <FaTags style={{ marginRight: '8px' }} />;
    }
};

const ActivityCenter = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState(null);

    const {
        data: activities,
        isLoading: actLoading,
        isError: actError,
    } = useActivities();
    const { data: student, isLoading: stuLoading } = useStudent(studentId);

    const filteredActivities = useMemo(() => {
        return activities?.filter((activity) => {
            const matchesSearch = activity.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesCategory =
                activeCategory === 'All' ||
                activity.categories?.some((cat) => cat.name === activeCategory);
            return matchesSearch && matchesCategory;
        });
    }, [activities, searchTerm, activeCategory]);

    const categoryButtons = useMemo(() => {
        if (!activities) return ['All'];
        const allNames = activities.flatMap(
            (a) => a.categories?.map((c) => c.name) || [],
        );
        return ['All', ...new Set(allNames.filter(Boolean))];
    }, [activities]);

    if (actLoading || (studentId && stuLoading))
        return <div style={centerStyle}>Loading Activities...</div>;
    if (actError)
        return <div style={centerStyle}>Error connecting to server.</div>;

    return (
        <div className="main-content" style={pageContainerStyle}>
            {/* Header Section */}
            <div style={headerSectionStyle}>
                <div style={headerTopStyle}>
                    <button
                        onClick={() => navigate(-1)}
                        style={backButtonStyle}
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 style={titleHeaderStyle}>
                        {studentId
                            ? `Activities for ${student.firstName}`
                            : 'Game Library'}
                    </h1>
                </div>
                <p style={subtitleStyle}>
                    Choose an activity to begin the session.
                </p>
            </div>

            {/* Controls */}
            <div style={libraryControlsStyle}>
                <div style={searchWrapperStyle}>
                    <FaSearch style={searchIconStyle} />
                    <input
                        type="text"
                        placeholder="Search activities..."
                        style={searchInputStyle}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={categoryListStyle}>
                    {categoryButtons.map((catName) => (
                        <button
                            key={catName}
                            onClick={() => setActiveCategory(catName)}
                            style={{
                                ...categoryBtnStyle,
                                background:
                                    activeCategory === catName
                                        ? 'var(--blue3)'
                                        : 'var(--white)',
                                color:
                                    activeCategory === catName
                                        ? 'var(--white)'
                                        : 'var(--darkBlue)',
                                boxShadow:
                                    activeCategory === catName
                                        ? '0 4px 0px #154a61'
                                        : '0 4px 0px var(--blue1)',
                                transform:
                                    activeCategory === catName
                                        ? 'translateY(2px)'
                                        : 'translateY(0)',
                            }}
                        >
                            {catName === 'All' ? (
                                <FaGamepad style={{ marginRight: '8px' }} />
                            ) : (
                                <FaTags style={{ marginRight: '8px' }} />
                            )}
                            {catName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div style={gridStyle}>
                {filteredActivities?.map((activity) => {
                    const id = activity.documentId || activity.id;
                    const isAvailable = activity.activityStatus === 'active';
                    const isHovered = hoveredId === id;

                    return (
                        <div
                            key={id}
                            onMouseEnter={() => setHoveredId(id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() =>
                                isAvailable &&
                                navigate(
                                    `/activities/${id}?studentId=${studentId}`,
                                )
                            }
                            style={{
                                ...cardBaseStyle,
                                opacity: isAvailable ? 1 : 0.85,
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                transform:
                                    isHovered && isAvailable
                                        ? 'translateY(-10px)'
                                        : 'translateY(0)',
                                boxShadow:
                                    isHovered && isAvailable
                                        ? '0 20px 40px rgba(0,0,0,0.12)'
                                        : 'var(--shadow)',
                                border:
                                    isHovered && isAvailable
                                        ? '2px solid var(--blue3)'
                                        : '2px solid var(--blue1)',
                            }}
                        >
                            <div style={imageContainerStyle}>
                                <img
                                    src={
                                        activity.banner?.url
                                            ? `http://localhost:1337${activity.banner.url}`
                                            : 'https://via.placeholder.com/400x225'
                                    }
                                    alt={activity.name}
                                    style={{
                                        ...imageStyle,
                                        transform:
                                            isHovered && isAvailable
                                                ? 'scale(1.08)'
                                                : 'scale(1)',
                                    }}
                                />
                                {!isAvailable && (
                                    <div style={statusOverlayStyle}>
                                        <FaLock
                                            size={24}
                                            style={{ marginBottom: '10px' }}
                                        />
                                        <span>
                                            {activity.activityStatus?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={contentStyle}>
                                <div style={tagWrapperStyle}>
                                    {activity.categories?.map((cat, index) => (
                                        <span key={index} style={miniTagStyle}>
                                            {getCategoryIcon(cat.type)}
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                                <h2 style={titleStyle}>{activity.name}</h2>
                                <p style={descStyle}>{activity.description}</p>

                                <div style={footerStyle}>
                                    <div
                                        style={{
                                            ...activeBadgeStyle,
                                            backgroundColor: isAvailable
                                                ? 'var(--darkBlue)'
                                                : 'var(--gray)',
                                            width:
                                                isHovered && isAvailable
                                                    ? '140px'
                                                    : '50px',
                                            borderRadius: '20px',
                                        }}
                                    >
                                        {isAvailable ? (
                                            <div style={buttonInnerStyle}>
                                                <FaPlay size={14} />
                                                {isHovered && (
                                                    <span style={playTextStyle}>
                                                        PLAY NOW
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <FaLock size={14} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredActivities?.length === 0 && (
                <div style={emptyStateStyle}>
                    <FaGamepad
                        size={50}
                        style={{ marginBottom: '20px', color: 'var(--blue2)' }}
                    />
                    <h2>No activities found</h2>
                </div>
            )}
        </div>
    );
};

// --- STYLES ---

const pageContainerStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Fredoka', sans-serif",
};
const headerSectionStyle = { marginBottom: '30px' };
const headerTopStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
};
const backButtonStyle = {
    background: 'var(--blue1)',
    border: 'none',
    padding: '12px',
    borderRadius: '50%',
    color: 'var(--darkBlue)',
    cursor: 'pointer',
    display: 'flex',
};
const titleHeaderStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--darkBlue)',
    margin: 0,
};
const subtitleStyle = { color: '#7f8c8d', fontSize: '1.1rem', margin: 0 };
const libraryControlsStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
};
const searchWrapperStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
};
const searchInputStyle = {
    width: '100%',
    padding: '14px 20px 14px 45px',
    borderRadius: '15px',
    border: '2px solid var(--blue2)',
    fontFamily: 'inherit',
    outline: 'none',
};
const searchIconStyle = {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--blue3)',
};
const categoryListStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
};
const categoryBtnStyle = {
    padding: '10px 20px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
};
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
    marginTop: '1rem',
};
const cardBaseStyle = {
    background: 'var(--white)',
    borderRadius: '32px',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
};
const imageContainerStyle = {
    position: 'relative',
    height: '210px',
    width: '100%',
    backgroundColor: 'var(--bg)',
    overflow: 'hidden',
};
const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
};
const statusOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(44, 62, 80, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: 'white',
    letterSpacing: '1.5px',
    fontSize: '1rem',
};
const contentStyle = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
};
const tagWrapperStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '10px',
};
const miniTagStyle = {
    fontSize: '0.7rem',
    color: 'white',
    background: 'var(--blue3)',
    padding: '4px 10px',
    borderRadius: '8px',
    fontWeight: '800',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
};
const titleStyle = {
    margin: '0 0 12px 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--darkBlue)',
};
const descStyle = {
    color: 'var(--darkGray)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '4.8em',
};
const footerStyle = {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid var(--bg)',
};
const activeBadgeStyle = {
    color: 'var(--white)',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};
const buttonInnerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
};
const playTextStyle = {
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
};
const emptyStateStyle = { padding: '80px 20px', color: 'var(--gray)' };
const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    fontSize: '1.5rem',
    color: 'var(--blue3)',
    fontFamily: "'Fredoka', sans-serif",
};

export default ActivityCenter;
