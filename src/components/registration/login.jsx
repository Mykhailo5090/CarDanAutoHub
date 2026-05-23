import React from 'react';

const LoginPage = () => {
  return (
    <div style={{ padding: '100px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h1>Login</h1>
      <input type="text" placeholder="enter your login/email" />
      <input type="password" placeholder="enter your password" />
      <label>
        <input type="checkbox" /> I Agree
      </label>
      <button type="submit">Submit</button>
    </div>
  );
};

export default LoginPage;