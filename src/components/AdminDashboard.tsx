import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTournaments, deleteTournament } from '../features/tournament/tournamentSlice';
import TournamentForm from './TournamentForm';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.tournament);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedTournament(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTournament(id));
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => navigate('/')}>Volver</button>
      <button onClick={handleAdd}>Agregar Torneo</button>
      <button onClick={() => navigate('/manage-users')}>Gestionar Usuarios</button>
      <button onClick={() => navigate('/manage-admins')}>Gestionar Administradores</button>
      {loading ? <p>Loading...</p> : (
        <ul>
          {items.map(tournament => (
            <li key={tournament.id}>
              {tournament.name}
              <button onClick={() => handleEdit(tournament)}>Editar</button>
              <button onClick={() => handleDelete(tournament.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      {isFormOpen && (
        <TournamentForm
          tournament={selectedTournament}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
