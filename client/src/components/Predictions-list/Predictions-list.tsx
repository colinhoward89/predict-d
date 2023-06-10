import React, { FC, useEffect, useState, useMemo } from 'react';
import styles from './Predictions-list.module.css';
import { getMyLeagues, getAllFixtures, submitPrediction, getPrediction, editPrediction } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';
import FixtureRow from '../Fixture-row/Fixture-row';
import Pagination from '../Pagination/Pagination';

interface PredictionsListProps { }

const PredictionsList: FC<PredictionsListProps> = () => {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'past' | 'future'>('future');
  const { currentUser } = useAuth();
  const [homePredictions, setHomePredictions] = useState<{ [fixtureId: number]: number | null }>({});
  const [awayPredictions, setAwayPredictions] = useState<{ [fixtureId: number]: number | null }>({});  
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [submitState, setSubmitState] = useState<{ [fixtureId: number]: { submitting: boolean; submitResult: string } }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fixturesPerPage] = useState<number>(20);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchPredictions = async (fixtureIds: number[]) => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const updatedHomePredictions = { ...homePredictions };
        const updatedAwayPredictions = { ...awayPredictions };
  
        for (const fixtureId of fixtureIds) {
          const response = await getPrediction(userId, fixtureId);
          if (response.length > 0) {
            const prediction = response[0];
            updatedHomePredictions[fixtureId] = prediction.home;
            updatedAwayPredictions[fixtureId] = prediction.away;
          }
        }
  
        setHomePredictions(updatedHomePredictions);
        setAwayPredictions(updatedAwayPredictions);
      }
    } catch (error) {
      console.error('Failed to fetch predictions', error);
    }
  };  

  const fetchFixtures = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const leagues = await getMyLeagues(userId);
        const fixturesPromises = leagues.map(async (league: any) => {
          try {
            const response = await getAllFixtures(league.competition);
            return response;
          } catch (error) {
            console.error(`Failed to fetch fixtures for league ${league.id}`, error);
            return []; // Return an empty array if there is an error to avoid breaking Promise.all
          }
        });
        const fixturesArray = await Promise.all(fixturesPromises);
        const allFixtures = fixturesArray.flat();
        setFixtures(allFixtures);
        setLoading(false);
        fetchPredictions(allFixtures.map((fixture: any) => fixture.fixtureId));
      }
    } catch (error) {
      console.error('Failed to fetch fixtures', error);
    }
  };

  const handleFilterChange = (selectedFilter: 'past' | 'future') => {
    setFilter(selectedFilter);
  };

  const handleHomePredictionChange = (fixtureId: number, value: number | null) => {
    setHomePredictions((prevState) => ({
      ...prevState,
      [fixtureId]: value,
    }));

    setPredictions((prevState) =>
      prevState.map((prediction) => {
        if (prediction.match === fixtureId) {
          return {
            ...prediction,
            home: value,
          };
        }
        return prediction;
      })
    );
  };

  const handleAwayPredictionChange = (fixtureId: number, value: number | null) => {
    setAwayPredictions((prevState) => ({
      ...prevState,
      [fixtureId]: value,
    }));

    setPredictions((prevState) =>
      prevState.map((prediction) => {
        if (prediction.match === fixtureId) {
          return {
            ...prediction,
            away: value,
          };
        }
        return prediction;
      })
    );
  };

  const handleSubmitPrediction = async (fixtureId: number) => {
    setSubmitState((prevState) => ({
      ...prevState,
      [fixtureId]: { submitting: true, submitResult: '' },
    }));
  
    const homePrediction = homePredictions[fixtureId];
    const awayPrediction = awayPredictions[fixtureId];
    try {
      const userId = currentUser?.id;
      if (userId) {
        const existingPrediction = await getPrediction(userId, fixtureId);
        if (existingPrediction.length > 0) {
          const response = await editPrediction(userId, fixtureId, homePrediction, awayPrediction);
        } else {
          const response = await submitPrediction(userId, fixtureId, homePrediction, awayPrediction);
        }
        setSubmitState((prevState) => ({
          ...prevState,
          [fixtureId]: { submitting: false, submitResult: 'success' },
        }));
      }
    } catch (error) {
      console.error(`Failed to submit prediction for fixture ${fixtureId}`, error);
      setSubmitState((prevState) => ({
        ...prevState,
        [fixtureId]: { submitting: false, submitResult: 'error' },
      }));
    }
  };  

  const handleSubmitAllPredictions = async () => {
    const selectedFixtures = filteredFixtures.filter((fixture: any) => {
      const homePrediction = homePredictions[fixture.fixtureId];
      const awayPrediction = awayPredictions[fixture.fixtureId];
      return (
        (homePrediction !== null && homePrediction !== undefined) ||
        (awayPrediction !== null && awayPrediction !== undefined)
      );
    });
    if (selectedFixtures.length > 0) {
      setSubmitting(true);
      setSubmitResult(null);
  
      try {
        const userId = currentUser?.id;
        if (userId) {
          const submissionPromises = selectedFixtures.map(async (fixture: any) => {
            const homePrediction = homePredictions[fixture.fixtureId];
            const awayPrediction = awayPredictions[fixture.fixtureId];
            try {
              const existingPrediction = await getPrediction(userId, fixture.fixtureId);
              if (existingPrediction.length > 0) {
                const response = await editPrediction(userId, fixture.fixtureId, homePrediction, awayPrediction);
                return response;
              } else {
                const response = await submitPrediction(userId, fixture.fixtureId, homePrediction, awayPrediction);
                return response;
              }
            } catch (error) {
              console.error(`Failed to submit/edit prediction for fixture ${fixture.fixtureId}`, error);
              return null;
            }
          });
          const submissionResults = await Promise.all(submissionPromises);
  
          const hasError = submissionResults.some((result) => result === null);
          if (hasError) {
            setSubmitResult('error');
          } else {
            setSubmitResult('success');
          }
        }
      } catch (error) {
        console.error('Failed to submit/edit predictions', error);
        setSubmitResult('error');
      } finally {
        setSubmitting(false);
      }
    }
  };  

  const filteredFixtures = useMemo(() => {
    const currentDate = new Date().getTime();

    return fixtures.filter((fixture: any) => {
      const fixtureDate = new Date(fixture.date).getTime();
      if (filter === 'past') {
        return fixtureDate < currentDate;
      } else {
        return fixtureDate >= currentDate;
      }
    });
  }, [fixtures, filter]);

  const indexOfLastFixture = currentPage * fixturesPerPage;
  const indexOfFirstFixture = indexOfLastFixture - fixturesPerPage;
  const currentFixtures = filteredFixtures.slice(indexOfFirstFixture, indexOfLastFixture);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.PredictionsList}>
      <div className={styles.ButtonsContainer}>
        <button
          className={filter === 'future' ? styles.ActiveButton : styles.Button}
          onClick={() => handleFilterChange('future')}
        >
          Future
        </button>
        <button
          className={filter === 'past' ? styles.ActiveButton : styles.Button}
          onClick={() => handleFilterChange('past')}
        >
          Past
        </button>
      </div>
      {loading ? (
        <p>Loading fixtures...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Home</th>
                <th>Away</th>
                <th>Score</th>
                <th>Status</th>
                <th>H Pred</th>
                <th>A Pred</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentFixtures.map((fixture) => {
                const prediction = Array.isArray(predictions)
                  ? predictions.find((p) => p.match === fixture.fixtureId)
                  : null;
                const homePrediction =
                  homePredictions[fixture.fixtureId] !== undefined
                    ? homePredictions[fixture.fixtureId]
                    : prediction
                      ? prediction.home
                      : null;
                const awayPrediction =
                  awayPredictions[fixture.fixtureId] !== undefined
                    ? awayPredictions[fixture.fixtureId]
                    : prediction
                      ? prediction.away
                      : null;
                return (
                  <FixtureRow
                    key={fixture.fixtureId}
                    fixture={fixture}
                    homePrediction={homePrediction}
                    awayPrediction={awayPrediction}
                    onHomePredictionChange={handleHomePredictionChange}
                    onAwayPredictionChange={handleAwayPredictionChange}
                    onSubmitPrediction={handleSubmitPrediction}
                    submitState={submitState[fixture.fixtureId]}
                  />
                );
              })}
            </tbody>
          </table>
          <Pagination
            fixturesPerPage={fixturesPerPage}
            totalFixtures={filteredFixtures.length}
            paginate={paginate}
            currentPage={currentPage}
          />
          <button className={styles.SubmitAllButton} onClick={handleSubmitAllPredictions} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit All'}
          </button>
          {submitResult === 'success' && <p>All predictions submitted successfully!</p>}
          {submitResult === 'error' && <p>Failed to submit one or more predictions. Please try again.</p>}
        </>
      )}
    </div>
  );
};

export default PredictionsList;