import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, placeholder, show, setShow, ...props }) => (
    <div style={{ position: 'relative', width: '100%' }}>
        <input
            type={show ? "text" : "password"}
            className="custom-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ paddingRight: '40px' }}
            {...props} 
        />
        <span
            onClick={() => setShow(!show)}
            style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#95A5A6',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </span>
    </div>
);

export default PasswordInput;
