import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface LoginProps {
  userType: 'admin' | 'user';
}

const Login: React.FC<LoginProps> = ({ userType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const collectionRef = collection(db, userType === 'admin' ? 'admins' : 'users');
    const querySnapshot = await getDocs(collectionRef);

    const userExists = querySnapshot.docs.some(
      (doc) => doc.data().username === username && doc.data().password === password
    );

    if (userExists) {
      dispatch(login(username));
      navigate(userType === 'admin' ? '/admin' : '/user');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>{userType === 'admin' ? 'Login Admin' : 'Login Usuario'}</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;