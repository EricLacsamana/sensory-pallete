import React, { useState, useEffect, useRef } from 'react';
import {
    FaCalendarAlt,
    FaTimes,
    FaSearch,
    FaTrash,
    FaPlusCircle,
    FaCoffee,
    FaArrowDown,
    FaClock,
} from 'react-icons/fa';

const SessionModal = ({
    isOpen,
    onClose,
    activities,
    onConfirm,
    learnerName,
}) => {
    const [selectedPlan, setSelectedPlan] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredId, setHoveredId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [startTimeStr, setStartTimeStr] = useState('09:00');

    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            setStartDate(now.toISOString().split('T')[0]);
            setStartTimeStr('09:00');
            setSelectedPlan([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    // Auto-scroll timeline to bottom when new items are added
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedPlan]);

    if (!isOpen) return null;

    const timeOptions = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hour = h.toString().padStart(2, '0');
            const min = m.toString().padStart(2, '0');
            const period = h >= 12 ? 'PM' : 'AM';
            const displayHour = h % 12 === 0 ? 12 : h % 12;
            timeOptions.push({
                value: `${hour}:${min}`,
                label: `${displayHour}:${min} ${period}`,
            });
        }
    }

    const fullStartDateTime = `${startDate}T${startTimeStr}`;

    const filteredActivities = activities.filter((act) =>
        act.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const addActivityToPlan = (activity, isBreak = false) => {
        const newInstance = {
            ...activity,
            isBreak,
            name: isBreak ? 'Rest & Recharge' : activity.name,
            duration: isBreak ? 900 : activity.duration || 1800,
            instanceId: `inst-${Date.now()}-${Math.random()}`,
        };
        setSelectedPlan((prev) => [...prev, newInstance]);
    };

    const removeInstance = (instanceId) => {
        setSelectedPlan((prev) =>
            prev.filter((item) => item.instanceId !== instanceId),
        );
    };

    const calculateTimeline = () => {
        if (!startDate || !startTimeStr) return [];
        let currentPos = new Date(fullStartDateTime).getTime();

        return selectedPlan.map((act) => {
            const startStr = new Date(currentPos).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            currentPos += (act.duration || 1800) * 1000;
            const endStr = new Date(currentPos).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return { ...act, startStr, endStr };
        });
    };

    const timeline = calculateTimeline();
    const totalDurationSeconds = selectedPlan.reduce(
        (a, c) => a + (c.duration || 1800),
        0,
    );
    const finalEndTime =
        timeline.length > 0 ? timeline[timeline.length - 1].endStr : '--:--';

    return (
        <div style={modalOverlay}>
            <div style={largeModalContent}>
                <div style={modalHeader}>
                    <div>
                        <h2 style={modalTitle}>Build Visit Plan</h2>
                        <p style={modalSubtitle}>
                            Planning session for <b>{learnerName}</b>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={closeIconBtn(hoveredId === 'close')}
                        onMouseEnter={() => setHoveredId('close')}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                <div style={modalBodyGrid}>
                    {/* LEFT: Library (Max 2 Columns) */}
                    <div style={leftPane}>
                        <div style={searchBox}>
                            <FaSearch style={{ color: '#94A3B8' }} />
                            <input
                                style={searchInput}
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div style={activityGridTwoCol}>
                            <div
                                style={breakCard(hoveredId === 'brk')}
                                onMouseEnter={() => setHoveredId('brk')}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => addActivityToPlan({}, true)}
                            >
                                <div style={breakIconCircle}>
                                    <FaCoffee />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={activityNameText}>Rest Break</p>
                                    <small>15m</small>
                                </div>
                                <FaPlusCircle
                                    color={
                                        hoveredId === 'brk'
                                            ? '#3B82F6'
                                            : '#CBD5E1'
                                    }
                                    size={20}
                                />
                            </div>

                            {filteredActivities.map((act) => {
                                const isHov = hoveredId === act.id;
                                const img = act?.banner?.url
                                    ? `http://localhost:1337${act.banner.url}`
                                    : 'https://via.placeholder.com/150';
                                return (
                                    <div
                                        key={act.instanceId || act.id}
                                        style={activityCard(isHov)}
                                        onMouseEnter={() =>
                                            setHoveredId(act.id)
                                        }
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => addActivityToPlan(act)}
                                    >
                                        <img
                                            src={img}
                                            style={avatarImg}
                                            alt=""
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={activityNameText}>
                                                {act.name}
                                            </p>
                                            <small>
                                                {Math.floor(
                                                    (act.duration || 1800) / 60,
                                                )}
                                                m
                                            </small>
                                        </div>
                                        <FaPlusCircle
                                            color={
                                                isHov ? '#3B82F6' : '#CBD5E1'
                                            }
                                            size={20}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Scrollable Timeline */}
                    <div style={rightPane}>
                        <div style={rightPaneHeader}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>
                                    <FaCalendarAlt style={{ marginRight: 8 }} />{' '}
                                    Session Start
                                </label>
                                <div style={splitInputContainer}>
                                    <input
                                        type="date"
                                        style={dateInputStyle}
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                    />
                                    <select
                                        style={timeSelectStyle}
                                        value={startTimeStr}
                                        onChange={(e) =>
                                            setStartTimeStr(e.target.value)
                                        }
                                    >
                                        {timeOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={planHeader}>
                                <label style={labelStyle}>
                                    <FaClock style={{ marginRight: 8 }} />{' '}
                                    Timeline Queue
                                </label>
                                {selectedPlan.length > 0 && (
                                    <span
                                        onClick={() => setSelectedPlan([])}
                                        style={clearAllBtn}
                                    >
                                        Clear All
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={timelineScrollArea} ref={scrollRef}>
                            {timeline.length === 0 ? (
                                <div style={emptyState}>
                                    Select activities to build the sequence.
                                </div>
                            ) : (
                                timeline.map((item, index) => (
                                    <React.Fragment key={item.instanceId}>
                                        <div
                                            style={
                                                item.isBreak
                                                    ? timelineBreakItem
                                                    : timelineActivityItem(
                                                          hoveredId ===
                                                              item.instanceId,
                                                      )
                                            }
                                            onMouseEnter={() =>
                                                setHoveredId(item.instanceId)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredId(null)
                                            }
                                        >
                                            <div style={timeTag}>
                                                {item.startStr}
                                            </div>
                                            <div style={timelineContent}>
                                                <b>{item.name}</b>
                                                <small>
                                                    {Math.floor(
                                                        item.duration / 60,
                                                    )}{' '}
                                                    mins
                                                </small>
                                            </div>
                                            <FaTrash
                                                style={trashIcon(
                                                    hoveredId ===
                                                        `tr-${item.instanceId}`,
                                                )}
                                                onClick={() =>
                                                    removeInstance(
                                                        item.instanceId,
                                                    )
                                                }
                                                onMouseEnter={() =>
                                                    setHoveredId(
                                                        `tr-${item.instanceId}`,
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredId(
                                                        item.instanceId,
                                                    )
                                                }
                                            />
                                        </div>
                                        {index < timeline.length - 1 && (
                                            <div style={timelineConnector}>
                                                <FaArrowDown
                                                    size={12}
                                                    color="#CBD5E1"
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </div>

                        <div style={rightPaneFooter}>
                            <div style={summaryBox(selectedPlan.length > 0)}>
                                <div style={summaryRow}>
                                    <span>Total Time:</span>
                                    <b>
                                        {Math.floor(totalDurationSeconds / 60)}{' '}
                                        mins
                                    </b>
                                </div>
                                <div style={summaryRow}>
                                    <span>Finish Time:</span>
                                    <b>{finalEndTime}</b>
                                </div>
                            </div>
                            <button
                                style={confirmBtn(
                                    selectedPlan.length > 0,
                                    hoveredId === 'sub',
                                )}
                                disabled={selectedPlan.length === 0}
                                onClick={() =>
                                    onConfirm({
                                        activities: selectedPlan,
                                        startTime: fullStartDateTime,
                                        endTime: finalEndTime,
                                    })
                                }
                                onMouseEnter={() => setHoveredId('sub')}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                Finalize Visit Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Updated Styles ---
const modalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(10px)',
    padding: '20px',
};
const largeModalContent = {
    background: 'white',
    borderRadius: '40px',
    width: '100%',
    maxWidth: '1100px',
    height: '88vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    fontFamily: "'Fredoka', sans-serif",
};
const modalHeader = {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '25px 40px',
    borderBottom: '1px solid #F1F5F9',
    alignItems: 'center',
};
const modalTitle = {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#1E293B',
};
const modalSubtitle = { margin: '4px 0 0', color: '#64748B' };
const modalBodyGrid = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 400px',
    flex: 1,
    overflow: 'hidden',
};

// Left Pane Scrollable with 2-Column Grid
const leftPane = {
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    overflowY: 'auto',
    background: '#F8FAFC',
};
const activityGridTwoCol = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
};

const rightPane = {
    background: 'white',
    borderLeft: '1px solid #F1F5F9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
};
const rightPaneHeader = { padding: '30px 30px 10px 30px', flexShrink: 0 };
const timelineScrollArea = {
    flex: 1,
    overflowY: 'auto',
    padding: '0 30px',
    scrollbarWidth: 'thin',
};
const rightPaneFooter = { padding: '10px 30px 30px 30px', flexShrink: 0 };

const closeIconBtn = (h) => ({
    background: h ? '#F1F5F9' : 'none',
    border: 'none',
    cursor: 'pointer',
    color: h ? '#EF4444' : '#94A3B8',
    padding: '10px',
    borderRadius: '50%',
    transition: 'all 0.2s',
});
const searchBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'white',
    padding: '14px 20px',
    borderRadius: '18px',
    marginBottom: '20px',
    border: '1px solid #E2E8F0',
};
const searchInput = {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '1rem',
};
const avatarImg = {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    objectFit: 'cover',
};
const activityNameText = {
    margin: 0,
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#1E293B',
};
const breakIconCircle = {
    width: '50px',
    height: '50px',
    background: '#CBD5E1',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#475569',
};
const activityCard = (h) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: 'white',
    borderRadius: '18px',
    cursor: 'pointer',
    border: h ? '2px solid #3B82F6' : '2px solid transparent',
    transition: 'all 0.3s',
    transform: h ? 'translateY(-3px)' : 'none',
    boxShadow: h ? '0 8px 15px rgba(0,0,0,0.08)' : '0 2px 4px rgba(0,0,0,0.03)',
});
const breakCard = (h) => ({
    ...activityCard(h),
    background: h ? '#EFF6FF' : '#F1F5F9',
    border: h ? '2px solid #3B82F6' : '2px dashed #CBD5E1',
});
const splitInputContainer = { display: 'flex', gap: '10px', marginTop: '8px' };
const dateInputStyle = {
    flex: 2,
    padding: '12px',
    borderRadius: '14px',
    border: '2px solid #F1F5F9',
    fontSize: '0.9rem',
    outline: 'none',
};
const timeSelectStyle = {
    flex: 1.5,
    padding: '12px',
    borderRadius: '14px',
    border: '2px solid #F1F5F9',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    background: 'white',
};
const timelineActivityItem = (h) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: h ? '#DBEAFE' : '#EFF6FF',
    padding: '14px',
    borderRadius: '18px',
    borderLeft: '6px solid #3B82F6',
    transition: 'all 0.2s',
    transform: h ? 'scale(1.02)' : 'none',
});
const timelineBreakItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#F8FAFC',
    padding: '12px',
    borderRadius: '18px',
    borderLeft: '6px solid #94A3B8',
};
const timeTag = {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#64748B',
    minWidth: '65px',
};
const timelineContent = { flex: 1, display: 'flex', flexDirection: 'column' };
const timelineConnector = {
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
};
const trashIcon = (h) => ({
    cursor: 'pointer',
    color: h ? '#EF4444' : '#CBD5E1',
    transition: 'all 0.2s',
});
const summaryBox = (a) => ({
    padding: '18px',
    borderRadius: '22px',
    background: a ? '#1E293B' : '#F1F5F9',
    color: a ? 'white' : '#94A3B8',
    transition: 'all 0.4s',
    margin: '10px 0',
});
const summaryRow = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '0.85rem',
};
const confirmBtn = (a, h) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: 'none',
    fontWeight: '800',
    background: a ? (h ? '#2563EB' : '#3B82F6') : '#E2E8F0',
    color: a ? 'white' : '#94A3B8',
    cursor: a ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s',
});
const inputGroup = { marginBottom: '15px' };
const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
};
const planHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
};
const clearAllBtn = {
    color: '#EF4444',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
    textTransform: 'uppercase',
};
const emptyState = {
    textAlign: 'center',
    color: '#94A3B8',
    padding: '40px 20px',
    fontSize: '0.85rem',
    fontStyle: 'italic',
};

export default SessionModal;
