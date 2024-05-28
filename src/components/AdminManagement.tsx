import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin, User } from '../features/user/userSlice';

const AdminManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { admins, loading } = useSelector((state: RootState) => state.user);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleSave = () => {
    if (editingAdmin) {
      dispatch(updateAdmin({ ...editingAdmin, username, password }));
    } else {
      dispatch(addAdmin({username, password }));
    }
    setEditingAdmin(null);
    setUsername('');
    setPassword('');
  };

  const handleEdit = (admin: User) => {
    setEditingAdmin(admin);
    setUsername(admin.username);
    setPassword(admin.password);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteAdmin(id));
  };

  return (
    <div>
      <h1>Admin Management</h1>
      {loading ? <p>Loading...</p> : (
        <div>
          <ul>
            {admins.map(admin => (
              <li key={admin.id}>
                {admin.username}
                <button onClick={() => handleEdit(admin)}>Edit</button>
                <button onClick={() => handleDelete(admin.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            <h2>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</h2>
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
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
