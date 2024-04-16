import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  return (
    <div>
      <h2>Select your role:</h2>
      <Link to="/register/principal">
        <button>Principal</button>
      </Link>
      <Link to="/register/adviser">
        <button>Adviser</button>
      </Link>
      <Link to="/register/sso">
        <button>SSO</button>
      </Link>
    </div>
  );
}

export default Account;
