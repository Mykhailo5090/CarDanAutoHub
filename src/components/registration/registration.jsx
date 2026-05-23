import React from 'react';

const RegistrationPage = () => {
  return (
    <div style={{ padding: '100px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <h1>Registration</h1>
      <input type="text" placeholder="enter your login/email" />
      <input type="password" placeholder="enter your password" />
      <input type="password" placeholder="confirm your password" />
      <label>
        <input type="checkbox" /> I Agree
      </label>
      <button type="submit">Submit</button>
    </div>
  );
};

export default RegistrationPage;