import React, { FC, useState, useEffect, useContext } from 'react';
import styles from './Create-league.module.css';
import { createLeague, getAllComps } from '../../Util/ApiService';
import { AuthContext } from './../../AuthContext';
import { useNavigate } from 'react-router-dom';

interface CreateLeagueProps { }

const CreateLeague: FC<CreateLeagueProps> = () => {
  const { currentUser, isAuthenticated, handleGetUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (competitions.length === 0) {
      fetchCompetitions();
    }
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await getAllComps();
      setCompetitions(response);
    } catch (error) {
      console.error('Failed to fetch competitions', error);
    }
  };  

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adminId = currentUser?.id || '';
      await createLeague(name, competitions[0].id, adminId);
      navigate('/leagues');
    } catch (error) {
      console.error('Failed to create league', error);
      throw new Error('League creation failed');
    }
  };
  

  return (
    <div className={styles.CreateLeague}>
      <h2>Create League</h2>
      <form onSubmit={handleCreateLeague}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label>Competition:</label>
          <select>
            {competitions.map((competition, index) => (
              <option key={index} value={competition.id}>
              {competition.countryName} - {competition.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateLeague;