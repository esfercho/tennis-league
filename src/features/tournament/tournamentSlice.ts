import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Tournament {
  id: string;
  name: string;
  deadline: string;
  image: string;
  maxParticipants: number;
  participants: string[];
}

interface TournamentState {
  items: Tournament[];
  loading: boolean;
}

const initialState: TournamentState = {
  items: [],
  loading: false,
};

const collectionPath = 'tournaments';

export const fetchTournaments = createAsyncThunk('tournaments/fetchTournaments', async () => {
  const querySnapshot = await getDocs(collection(db, collectionPath));
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Tournament[];
});

export const addTournament = createAsyncThunk('tournaments/addTournament', async (tournament: Omit<Tournament, 'id' | 'participants'>) => {
  const docRef = await addDoc(collection(db, collectionPath), { ...tournament, participants: [] });
  return { ...tournament, id: docRef.id, participants: [] };
});

export const updateTournament = createAsyncThunk('tournaments/updateTournament', async (tournament: Tournament) => {
  const docRef = doc(db, `${collectionPath}/${tournament.id}`);
  await updateDoc(docRef, {
    name: tournament.name,
    deadline: tournament.deadline,
    image: tournament.image,
    maxParticipants: tournament.maxParticipants,
    participants: tournament.participants,
  });
  return tournament;
});

export const deleteTournament = createAsyncThunk('tournaments/deleteTournament', async (id: string) => {
  const docRef = doc(db, `${collectionPath}/${id}`);
  await deleteDoc(docRef);
  return id;
});

export const registerUserInTournament = createAsyncThunk('tournaments/registerUserInTournament', async ({ tournamentId, userId }: { tournamentId: string, userId: string }) => {
  const tournamentRef = doc(db, collectionPath, tournamentId);
  await updateDoc(tournamentRef, {
    participants: arrayUnion(userId),
  });

  const updatedDoc = await getDoc(tournamentRef);
  return { id: tournamentId, ...updatedDoc.data() } as Tournament;
});

const tournamentSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournaments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournaments.fulfilled, (state, action: PayloadAction<Tournament[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTournaments.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addTournament.fulfilled, (state, action: PayloadAction<Tournament>) => {
        state.items.push(action.payload);
      })
      .addCase(updateTournament.fulfilled, (state, action: PayloadAction<Tournament>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTournament.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(registerUserInTournament.fulfilled, (state, action: PayloadAction<Tournament>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default tournamentSlice.reducer;
