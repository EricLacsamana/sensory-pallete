import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordInput from './PasswordInput';

const LoginForm = ({ onSubmit, }) => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showLoginPass, setShowLoginPass] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group">
        <label>Username</label>
        <input
          className="custom-input"
          placeholder="Enter username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && <p className="error-message">{errors.username.message}</p>}
      </div>

      <div className="input-group">
        <label>Password</label>
        <PasswordInput
          {...register('password', { required: 'Password is required' })}
          placeholder="Enter password"
          show={showLoginPass}
          setShow={setShowLoginPass}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
      </div>

      {errors.username && <p className="error-message">Form is invalid</p>}
 
      <p className="login-subtitle2">
        “Accounts are provided by the Administrator. Please contact your Admin if you don’t have an account.”
      </p>


      <button className="login-btn" type="submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
