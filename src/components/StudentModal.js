import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTimes } from 'react-icons/fa';
import StudentForm from './StudentForm';
import { createStudent, updateStudent } from '../api/students';

const StudentModal = ({ isOpen, onClose, mode, initialData }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data) => {
            return mode === 'edit'
                ? updateStudent(initialData.documentId, data)
                : createStudent(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            onClose();
        },
    });

    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div className="login-card" style={modalCardStyle}>
                <div style={modalHeader}>
                    <h2 style={{ color: 'var(--darkBlue)', margin: 0 }}>
                        {mode === 'edit' ? 'Edit Learner' : 'Add New Learner'}
                    </h2>
                    <FaTimes
                        onClick={onClose}
                        style={{ cursor: 'pointer', color: 'var(--gray)' }}
                    />
                </div>

                <StudentForm
                    mode={mode}
                    initialData={initialData}
                    onSubmit={(data) => mutation.mutate(data)}
                    isPending={mutation.isPending}
                />
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
};
const modalCardStyle = { width: '100%', maxWidth: '600px', padding: '40px' };
const modalHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
};

export default StudentModal;
