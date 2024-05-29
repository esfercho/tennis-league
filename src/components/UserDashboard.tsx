import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store'; // Importa AppDispatch
import { fetchTournaments, registerUserInTournament } from '../features/tournament/tournamentSlice';

const UserDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Usa AppDispatch para tipar dispatch
  const { items, loading } = useSelector((state: RootState) => state.tournament);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  const handleRegister = (id: string) => {
    console.log(user);
    
    if (user) {
      dispatch(registerUserInTournament({ tournamentId: id, userId: user }));
    } else {
      console.log('User is not logged in');
    }
  };

  return (
    <div>
      <h1>Lista de Torneos</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {items.map(tournament => (
            <li key={tournament.id}>
              {tournament.name}
              <button onClick={() => handleRegister(tournament.id)}>Registrarse</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;