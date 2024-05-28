import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import tournamentReducer from './features/tournament/tournamentSlice';
import authReducer from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tournament: tournamentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;