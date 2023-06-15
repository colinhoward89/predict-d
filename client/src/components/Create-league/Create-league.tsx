import React, { FC, useState, useEffect, useContext, useRef } from 'react';
import styles from './Create-league.module.css';
import { createLeague, getAllComps } from '../../Util/ApiService';
import { AuthContext } from './../../AuthContext';

const CreateLeague: FC<CreateLeagueProps> = ({ onJoinLeague }) => {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const competitionSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (competitions.length === 0) {
      fetchCompetitions();
    }
  }, []);

  // Retrieve list of available football competitions 
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

  const handleCompetitionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const competitionId = parseInt(event.target.value);
    setSelectedCompetition(competitionId);
  };

  // Creates league and navigates to My Leagues page
  const handleCreateLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompetition || !name) {
      setShowWarning(true);
      return;
    }
    try {
      const adminId = currentUser?.id || '';
      await createLeague(name, selectedCompetition, adminId);
      onJoinLeague();
    } catch (error) {
      console.error('Failed to create league', error);
      throw new Error('League creation failed');
    }
  };

  return (
    <div className={styles.CreateLeague}>
      <form onSubmit={handleCreateLeague} className={styles.CreateLeagueForm}>
        <div>
          <label htmlFor="leagueName" className={styles.HiddenLabel}>
            League Name
          </label>
          <input
            type="text"
            id="leagueName"
            placeholder="Enter league name"
            value={name}
            onChange={handleNameChange}
            required
            className={styles.CreateLeagueInput}
            ref={nameInputRef}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="competitionSelect" className={styles.HiddenLabel}>
            Select Competition
          </label>
          <select
            id="competitionSelect"
            className={styles.CreateLeagueSelect}
            value={selectedCompetition || ''}
            onChange={handleCompetitionChange}
            ref={competitionSelectRef}
          >
            <option value="">Select Competition</option>
            {competitions.map((competition, index) => (
              <option key={index} value={competition.id.toString()}>
                {competition.countryName} - {competition.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.CreateLeagueButton}>
          Create
        </button>
        {showWarning && (
          <p className={styles.WarningMessage}>Please select a competition and provide a league name.</p>
        )}
      </form>
    </div>
  );
};

export default CreateLeague;