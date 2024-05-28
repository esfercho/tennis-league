import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login/user">Usuario</Link></li>
          <li><Link to="/login/admin">Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
