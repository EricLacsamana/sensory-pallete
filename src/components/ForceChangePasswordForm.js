import React from 'react';
import PasswordInput from './PasswordInput';

const ForceChangePasswordForm = ({
    newPassword, confirmPassword,
    showNewPass, setShowNewPass,
    showConfirmPass, setShowConfirmPass,
    error
}) => (
    <>
        <div className="input-group">
            <label>New Password</label>
            <PasswordInput
                value={newPassword}
                onChange={() => {}}
                placeholder="Min 8 characters"
                show={showNewPass}
                setShow={setShowNewPass}
            />
        </div>

        <div className="input-group">
            <label>Confirm Password</label>
            <PasswordInput
                value={confirmPassword}
                onChange={() => {}}
                placeholder="Retype password"
                show={showConfirmPass}
                setShow={setShowConfirmPass}
            />
        </div>

        {error && (
            <p style={{
                color: '#ff6b6b',
                fontWeight: 'bold',
                fontSize: '14px',
                margin: '10px 0'
            }}>
                {error}
            </p>
        )}

        <button className="login-btn" style={{ background: '#27ae60' }}>
            Update Password
        </button>
    </>
);

export default ForceChangePasswordForm;
