import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Define la interfaz del estado de autenticación
interface AuthState {
  user: string | null;
  loading: boolean;
}

// Estado inicial de autenticación
const initialState: AuthState = {
  user: null,
  loading: false,
};

// Thunk para verificar y crear usuarios predeterminados
export const checkDefaultUsers = createAsyncThunk('auth/checkDefaultUsers', async () => {
  const usersRef = collection(db, 'users');
  const adminsRef = collection(db, 'admins');
  const usersSnapshot = await getDocs(usersRef);
  const adminsSnapshot = await getDocs(adminsRef);

  if (usersSnapshot.empty) {
    await addDoc(usersRef, { username: 'user', password: 'password' });
  }
  if (adminsSnapshot.empty) {
    await addDoc(adminsRef, { username: 'admin', password: 'password' });
  }
});

// Crear el slice de autenticación
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkDefaultUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkDefaultUsers.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

