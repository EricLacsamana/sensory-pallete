import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const StudentForm = ({ onSubmit, initialData, mode = 'add', isPending }) => {
    const isEdit = mode === 'edit';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: initialData || {},
    });

    // Reset form whenever initialData changes (critical for edit mode)
    useEffect(() => {
        reset(
            initialData || {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                sex: '',
                diagnosis: '',
                guardian_name: '',
                guardian_contact: '',
            },
        );
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={formStyles}>
            <div style={formGrid}>
                {/* --- Learner Details --- */}
                <div className="input-group">
                    <label>First Name</label>
                    <input
                        className="custom-input"
                        {...register('firstName', { required: 'Required' })}
                    />
                    {errors.firstName && (
                        <p className="error-message">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div className="input-group">
                    <label>Last Name</label>
                    <input
                        className="custom-input"
                        {...register('lastName', { required: 'Required' })}
                    />
                </div>

                <div className="input-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        className="custom-input"
                        {...register('dateOfBirth', { required: 'Required' })}
                    />
                </div>

                <div className="input-group">
                    <label>Gender</label>
                    <select
                        className="custom-input"
                        {...register('sex', { required: 'Required' })}
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Diagnosis</label>
                    <input
                        className="custom-input"
                        {...register('diagnosis')}
                    />
                </div>

                {/* --- Guardian Section --- */}
                <div style={dividerStyle}>
                    <h4 style={{ color: 'var(--darkBlue)', margin: 0 }}>
                        Guardian Info
                    </h4>
                </div>

                <div className="input-group">
                    <label>Guardian Name</label>
                    <input
                        className="custom-input"
                        {...register('guardian_name', { required: 'Required' })}
                    />
                </div>

                <div className="input-group">
                    <label>Contact Number</label>
                    <input
                        className="custom-input"
                        {...register('guardian_contact', {
                            required: 'Required',
                        })}
                    />
                </div>
            </div>

            <button
                className="login-btn"
                type="submit"
                disabled={isPending}
                style={{
                    marginTop: '30px',
                    backgroundColor: isPending
                        ? 'var(--gray)'
                        : 'var(--darkBlue)',
                }}
            >
                {isPending
                    ? 'Saving...'
                    : isEdit
                      ? 'Update Learner'
                      : 'Add Learner'}
            </button>
        </form>
    );
};

const formStyles = { display: 'flex', flexDirection: 'column' };
const formGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    textAlign: 'left',
};
const dividerStyle = {
    gridColumn: 'span 2',
    marginTop: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
};

export default StudentForm;
