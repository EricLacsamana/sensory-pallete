import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const DIAGNOSIS_THEMES = {
    ASD: { bg: '#e3f2fd', text: '#1976d2' },
    DEFAULT: { bg: '#fce4ec', text: '#c2185b' },
};

const StudentTableRow = React.memo(({ student }) => {
    const navigate = useNavigate();

    const handleViewProfile = useCallback(() => {
        navigate(`/students/${student.id}`);
    }, [navigate, student.id]);

    const badgeStyle = useMemo(() => {
        const isASD = student.diagnosis?.includes('ASD');
        const theme = isASD ? DIAGNOSIS_THEMES.ASD : DIAGNOSIS_THEMES.DEFAULT;
        return {
            background: theme.bg,
            color: theme.text,
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'inline-block',
        };
    }, [student.diagnosis]);

    return (
        <tr style={rowStyle} className="student-row">
            <td style={tdStyle}>{student.id}</td>
            <td
                style={{
                    ...tdStyle,
                    fontWeight: '700',
                    color: 'var(--darkBlue)',
                }}
            >
                {student.firstName} {student.lastName}
            </td>
            <td style={{ ...tdStyle, textTransform: 'capitalize' }}>
                {student.gender}
            </td>
            <td style={tdStyle}>{student.age}</td>
            <td style={tdStyle}>
                <span style={badgeStyle}>{student.diagnosis}</span>
            </td>
            <td style={tdStyle}>
                <button
                    style={viewBtnStyle}
                    onClick={handleViewProfile}
                    aria-label={`View profile for ${student.firstName}`}
                >
                    View Profile
                </button>
            </td>
        </tr>
    );
});

// --- STYLES ---

const rowStyle = {
    borderBottom: '1px solid var(--blue1)', // Light horizontal line only
    transition: 'background-color 0.2s ease',
};

const tdStyle = {
    padding: '16px 12px',
    fontSize: '0.95rem',
    color: 'var(--darkGray)',
};

const viewBtnStyle = {
    background: 'var(--blue1)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '10px',
    color: 'var(--darkBlue)',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
};

StudentTableRow.displayName = 'StudentTableRow';

export default StudentTableRow;
