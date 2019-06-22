import React from 'react';

function Toast({ msg, type, removeToast }) {
  return (
    <li style={{ backgroundColor: 'purple' }}>
      <p style={{ color: type === 'success' ? 'green' : 'red' }}>{msg}</p>
      <button onClick={removeToast}>x</button>
    </li>
  );
}

export default Toast;
