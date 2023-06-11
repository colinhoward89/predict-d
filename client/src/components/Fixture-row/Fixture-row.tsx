import React, { FC } from 'react';
import styles from './Fixture-row.module.css';

const FixtureRow: FC<FixtureRowProps> = ({
  fixture,
  homePrediction,
  awayPrediction,
  predictionPoints,
  submitState,
  onPredictionChange,
  onSubmitPrediction,
  past,
}) => {
  const submitStateData = submitState ?? { submitting: false, submitResult: '' };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDate = date.toLocaleString('en-US', options as Intl.DateTimeFormatOptions);

    const [datePart, timePart] = formattedDate.split(', ');
    return (
      <>
        {datePart}
        <br />
        {timePart}
      </>
    );
  };

  // Updates input boxes when inputting predictions
  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>, isHomePrediction: boolean) => {
    const value = e.target.value.trim();
    const prediction = value === '' ? null : parseInt(value, 10);

    if (prediction === null) {
      if (isHomePrediction) {
        onPredictionChange(fixture.fixtureId, null, true);
      } else {
        onPredictionChange(fixture.fixtureId, null, false);
      }
    } else if (!isNaN(prediction)) {
      if (isHomePrediction) {
        onPredictionChange(fixture.fixtureId, prediction, true);
      } else {
        onPredictionChange(fixture.fixtureId, prediction, false);
      }
    }
  };

  return (
    <>
      <tr key={fixture.fixtureId}>
        <td>
          <div className={styles.tableCell}>
            {formatDate(fixture.date)}
          </div>
        </td>
        <td>
          <div className={styles.tableCell}>
            <div>
              <img className={styles.logo} src={fixture.home.logo} alt={`${fixture.home.name} Logo`} />
              {fixture.home.name}
            </div>
            <div>
              <img className={styles.logo} src={fixture.away.logo} alt={`${fixture.away.name} Logo`} />
              {fixture.away.name}
            </div>
          </div>
        </td>
        <td>
          <div className={`${styles.tableCell}`}>
            <div className={styles.centered}> {fixture.score.home}</div>
            <div className={styles.centered}> {fixture.score.away}</div>
          </div>
        </td>
        <td>
          <div>
            <input
              className={styles.predictionInput}
              type="number"
              value={homePrediction === null ? '' : homePrediction}
              disabled={past}
              onChange={(e) => handlePredictionChange(e, true)}
              min="0"
              aria-label="Home Prediction"
            />
          </div>
          <div>
            <input
              className={styles.predictionInput}
              type="number"
              value={awayPrediction === null ? '' : awayPrediction}
              disabled={past}
              onChange={(e) => handlePredictionChange(e, false)}
              min="0"
              aria-label="Away Prediction"
            />
          </div>
        </td>
        <td>
          {past ? (
            <div>{predictionPoints}</div>
          ) : (
            <>
              {submitStateData.submitting ? (
                <button className={styles.SubmitButton} disabled>
                  <i className="fas fa-spinner fa-spin"></i>
                </button>
              ) : (
                <button className={styles.SubmitButton} onClick={(e) => onSubmitPrediction(fixture.fixtureId)}>
                  {submitStateData.submitResult === 'success' ? (
                    <>
                      <i className="fa fa-check"></i>
                    </>
                  ) : submitStateData.submitResult === 'error' ? (
                    <>
                      <i className="fa fa-times"></i>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-save"></i>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </td>
      </tr>

    </>
  );
};

export default FixtureRow;