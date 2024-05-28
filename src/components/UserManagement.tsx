import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUsers, addUser, updateUser, deleteUser } from '../features/user/userSlice';
import { User } from '../features/user/userSlice';

const UserManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.user);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSave = () => {
    if (editingUser) {
      dispatch(updateUser({ ...editingUser, username, password }));
    } else {
      dispatch(addUser({ username, password }));
    }
    setEditingUser(null);
    setUsername('');
    setPassword('');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setPassword(user.password);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  return (
    <div>
      <h1>User Management</h1>
      {loading ? <p>Loading...</p> : (
        <div>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.username}
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSave}>Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
