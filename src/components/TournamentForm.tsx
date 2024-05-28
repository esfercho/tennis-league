import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTournament, updateTournament } from '../features/tournament/tournamentSlice';
import { AppDispatch } from '../store';

interface Tournament {
  id: string;
  name: string;
  deadline: string;
  image: string;
  maxParticipants: number;
  participants: string[];
}

interface TournamentFormProps {
  tournament?: Tournament | null;
  onClose: () => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({ tournament, onClose }) => {
  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState(tournament?.name || '');
  const [deadline, setDeadline] = useState(tournament?.deadline || '');
  const [image, setImage] = useState(tournament?.image || '');
  const [maxParticipants, setMaxParticipants] = useState(tournament?.maxParticipants || 0);

  useEffect(() => {
    if (tournament) {
      setName(tournament.name);
      setDeadline(tournament.deadline);
      setImage(tournament.image);
      setMaxParticipants(tournament.maxParticipants);
    }
  }, [tournament]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTournament = {
      name,
      deadline,
      image,
      maxParticipants,
      participants: tournament?.participants || [],
    };

    if (tournament && tournament.id) {
      dispatch(updateTournament({ ...newTournament, id: tournament.id }));
    } else {
      dispatch(addTournament(newTournament));
    }
    onClose();
  };

  return (
    <div>
      <h2>{tournament ? 'Editar Torneo' : 'Agregar Torneo'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha Límite de Inscripción</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagen</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cantidad Máxima de Participantes</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">{tournament ? 'Actualizar' : 'Agregar'}</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default TournamentForm;
