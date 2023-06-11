import { FC, useEffect, useState, useMemo } from 'react';
import styles from './Predictions-list.module.css';
import { getMyLeagues, getAllFixtures, submitPrediction, getPrediction, editPrediction } from '../../Util/ApiService';
import { useAuth } from '../../AuthContext';
import FixtureRow from '../Fixture-row/Fixture-row';
import Pagination from '../Pagination/Pagination';

const PredictionsList: FC<PredictionsListProps> = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'past' | 'future'>('future');
  const { currentUser } = useAuth();
  const [homePredictions, setHomePredictions] = useState<{ [fixtureId: number]: number | null }>({});
  const [awayPredictions, setAwayPredictions] = useState<{ [fixtureId: number]: number | null }>({});
  const [predictionPoints, setPredictionPoints] = useState<{ [fixtureId: number]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);
  const [submitState, setSubmitState] = useState<{ [fixtureId: number]: { submitting: boolean; submitResult: string } }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fixturesPerPage] = useState<number>(10);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    fetchFixtures();
  }, []);

  // Retrieves predictions for fixtures on screen
  const fetchPredictions = async (fixtureIds: number[]) => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const updatedHomePredictions = { ...homePredictions };
        const updatedAwayPredictions = { ...awayPredictions };
        const updatedPredictionPoints = { ...predictionPoints };

        for (const fixtureId of fixtureIds) {
          const response = await getPrediction(userId, fixtureId);
          if (response.length > 0) {
            const prediction = response[0];
            updatedHomePredictions[fixtureId] = prediction.home;
            updatedAwayPredictions[fixtureId] = prediction.away;
            updatedPredictionPoints[fixtureId] = prediction.points;
          }
        }

        setHomePredictions(updatedHomePredictions);
        setAwayPredictions(updatedAwayPredictions);
        setPredictionPoints(updatedPredictionPoints);
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch predictions', error);
    }
  };

  // Retrieves fixture list for all your leagues
  const fetchFixtures = async () => {
    try {
      const userId = currentUser?.id;
      if (userId) {
        const leagues = await getMyLeagues(userId);
        console.log(leagues)
        const fixturesPromises = leagues.map(async (league: League) => {
          try {
            const response = await getAllFixtures(league.competition);
            return response;
          } catch (error) {
            console.error(`Failed to fetch fixtures for league ${league._id}`, error);
            return []; // Return an empty array if there is an error to avoid breaking Promise.all
          }
        });
        const fixturesArray = await Promise.all(fixturesPromises);
        const allFixtures = fixturesArray.flat();
        setFixtures(allFixtures);
        fetchPredictions(allFixtures.map((fixture: Fixture) => fixture.fixtureId));
      }
    } catch (error) {
      console.error('Failed to fetch fixtures', error);
    }
  };

  // Filter for showing past or upcoming fixtures
  const handleFilterChange = (selectedFilter: 'past' | 'future') => {
    setFilter(selectedFilter);
  };

  // Updates input boxes when inputting predictions
  // TODO clean up these any types
  const handlePredictionChange = (fixtureId: number, value: number | null, isHomePrediction: boolean) => {
    const setPredictionsFn = isHomePrediction ? setHomePredictions : setAwayPredictions;
    const setPredictionValueFn = isHomePrediction ? (prevValue: any) => ({ ...prevValue, [fixtureId]: value }) : (prevValue: any) => ({ ...prevValue, [fixtureId]: value });

    setPredictionsFn((prevState: any) => setPredictionValueFn(prevState));

    setPredictions((prevState: any) =>
      prevState.map((prediction: any) => {
        if (prediction.match === fixtureId) {
          const updatedPrediction = isHomePrediction ? { ...prediction, home: value } : { ...prediction, away: value };
          return updatedPrediction;
        }
        return prediction;
      })
    );
  };

  // TODO this can probably be combined
  // For editing or submitting one prediction
  const handleSubmitPrediction = async (fixtureId: number) => {
    setSubmitState((prevState) => ({
      ...prevState,
      [fixtureId]: { submitting: true, submitResult: '' },
    }));

    try {
      const userId = currentUser?.id;
      if (userId) {
        const existingPrediction = await getPrediction(userId, fixtureId);
        if (existingPrediction.length > 0) {
          const response = await editPrediction(userId, fixtureId, homePredictions[fixtureId], awayPredictions[fixtureId]);
        } else {
          const response = await submitPrediction(userId, fixtureId, homePredictions[fixtureId], awayPredictions[fixtureId]);
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

  // For editing or submitting multiple predictions
  const handleSubmitAllPredictions = async () => {
    const selectedFixtures = filteredFixtures.filter((fixture: Fixture) => {
      return (
        (homePredictions[fixture.fixtureId] !== null && homePredictions[fixture.fixtureId] !== undefined) ||
        (awayPredictions[fixture.fixtureId] !== null && awayPredictions[fixture.fixtureId] !== undefined)
      );
    });
    if (selectedFixtures.length > 0) {
      setSubmitting(true);
      setSubmitResult(null);

      try {
        const userId = currentUser?.id;
        if (userId) {
          const submissionPromises = selectedFixtures.map(async (fixture: Fixture) => {
            try {
              const existingPrediction = await getPrediction(userId, fixture.fixtureId);
              if (existingPrediction.length > 0) {
                const response = await editPrediction(userId, fixture.fixtureId, homePredictions[fixture.fixtureId], awayPredictions[fixture.fixtureId]);
                return response;
              } else {
                const response = await submitPrediction(userId, fixture.fixtureId, homePredictions[fixture.fixtureId], awayPredictions[fixture.fixtureId]);
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

  // sorting the fixtures into past and future
  const filteredFixtures = useMemo(() => {
    const currentDate = new Date().getTime();

    return fixtures.filter((fixture: Fixture) => {
      const fixtureDate = new Date(fixture.date).getTime();
      if (filter === 'past') {
        return fixtureDate < currentDate;
      } else {
        return fixtureDate >= currentDate;
      }
    });
  }, [fixtures, filter]);

  // logic for pagination
  const indexOfLastFixture = currentPage * fixturesPerPage;
  const indexOfFirstFixture = indexOfLastFixture - fixturesPerPage;
  const currentFixtures = filteredFixtures.slice(indexOfFirstFixture, indexOfLastFixture);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className={styles.PredictionsList} aria-labelledby="predictions-heading">
      <div className={styles.Container}>
        <h2 id="predictions-heading">Predictions List</h2>
        <div className={styles.ButtonsContainer}>
          <button
            type="button"
            className={filter === 'future' ? styles.ActiveButton : styles.Button}
            onClick={() => handleFilterChange('future')}
            aria-pressed={filter === 'future'}
            aria-label="Show future fixtures"
          >
            Future
          </button>

          <button
            type="button"
            className={filter === 'past' ? styles.ActiveButton : styles.Button}
            onClick={() => handleFilterChange('past')}
            aria-pressed={filter === 'past'}
            aria-label="Show past fixtures"
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
                  <th scope="col">Date</th>
                  <th scope="col">Fixture</th>
                  {filter === 'past' && (
                    <th scope="col" className={styles.leftAligned}>
                      FT
                    </th>
                  )}
                  <th scope="col" colSpan={2}>Prediction</th>
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
                  const points = predictionPoints[fixture.fixtureId]
                  return (
                    <FixtureRow
                      key={fixture.fixtureId}
                      fixture={fixture}
                      homePrediction={homePrediction}
                      awayPrediction={awayPrediction}
                      predictionPoints={points}
                      onPredictionChange={handlePredictionChange}
                      onSubmitPrediction={handleSubmitPrediction}
                      submitState={submitState[fixture.fixtureId]}
                      past={filter === 'past'}
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
            {filter === 'future' && (
              <button
                type="button"
                className={styles.SubmitAllButton}
                onClick={handleSubmitAllPredictions}
                disabled={submitting}
                aria-describedby="submit-all-info"
              >
                {submitting ? 'Submitting...' : 'Submit All'}
              </button>
            )}
            {submitResult === 'success' && <p>All predictions submitted successfully!</p>}
            {submitResult === 'error' && <p>Failed to submit one or more predictions. Please try again.</p>}
          </>
        )}
      </div>
    </section>
  );
};

export default PredictionsList;