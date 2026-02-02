// components/TextInput.js
import React from 'react';

const TextInput = React.forwardRef(({ label, placeholder, error, ...rest }, ref) => (
    <div className="input-group">
        {label && <label>{label}</label>}
        <input
            type="text"
            className={`custom-input ${error ? 'input-error' : ''}`}
            placeholder={placeholder}
            ref={ref}
            {...rest}
        />
        {error && <p className="error-msg">{error.message}</p>}
    </div>
));

export default TextInput;
