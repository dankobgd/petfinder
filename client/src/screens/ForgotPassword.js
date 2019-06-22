import React, { useState } from 'react';
import ForgotForm from './ForgotForm';

function ForgotPassword() {
  const [success, setSuccess] = useState(false);

  return <div>{success ? <div>Email has been sent</div> : <ForgotForm setSuccess={setSuccess} />}</div>;
}

export default ForgotPassword;
