import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export interface User {
  id: string;
  username: string;
  password: string;
}

interface UserState {
  users: User[];
  admins: User[];
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  admins: [],
  loading: false,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
});

export const fetchAdmins = createAsyncThunk('admins/fetchAdmins', async () => {
  const adminsSnapshot = await getDocs(collection(db, 'admins'));
  return adminsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
});

export const addUser = createAsyncThunk('users/addUser', async (user: Omit<User, 'id'>) => {
  const docRef = await addDoc(collection(db, 'users'), user);
  return { ...user, id: docRef.id };
});

export const addAdmin = createAsyncThunk('admins/addAdmin', async (admin: Omit<User, 'id'>) => {
  const docRef = await addDoc(collection(db, 'admins'), admin);
  return { ...admin, id: docRef.id };
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
  const userRef = doc(db, 'users', user.id);
  await updateDoc(userRef, { username: user.username, password: user.password });
  return user;
});

export const updateAdmin = createAsyncThunk('admins/updateAdmin', async (admin: User) => {
  const adminRef = doc(db, 'admins', admin.id);
  await updateDoc(adminRef, { username: admin.username, password: admin.password });
  return admin;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
  return id;
});

export const deleteAdmin = createAsyncThunk('admins/deleteAdmin', async (id: string) => {
  const adminRef = doc(db, 'admins', id);
  await deleteDoc(adminRef);
  return id;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.admins = action.payload;
        state.loading = false;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(addAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        state.admins.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateAdmin.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.admins.findIndex(admin => admin.id === action.payload.id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteAdmin.fulfilled, (state, action: PayloadAction<string>) => {
        state.admins = state.admins.filter(admin => admin.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
