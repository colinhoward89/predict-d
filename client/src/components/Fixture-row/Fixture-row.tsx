import React, { FC } from 'react';
import styles from './Fixture-row.module.css';

const FixtureRow: FC<FixtureRowProps> = ({
  fixture,
  homePrediction,
  awayPrediction,
  submitState,
  onHomePredictionChange,
  onAwayPredictionChange,
  onSubmitPrediction,
}) => {
  const submitStateData = submitState ?? { submitting: false, submitResult: '' };

  const formatDate = (dateString: any) => {
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

  return (
    <tr key={fixture.fixtureId}>
      <td className={styles.MultiLineCell}>{formatDate(fixture.date)}</td>
      <td>
        <div>
          <img className={styles.logo} src={fixture.home.logo} alt="Home Logo" />
          {fixture.home.name}
        </div>
        <div>
          <img className={styles.logo} src={fixture.away.logo} alt="Away Logo" />
          {fixture.away.name}
        </div>
      </td>
      <td>
        <div>
          {fixture.score.home}
        </div>
        <div>
          {fixture.score.away}
        </div>
      </td>
      <td>{fixture.status}</td>
      <td>
        <input
          className={styles.predictionInput}
          type="number"
          value={homePrediction === null ? '' : homePrediction}
          onChange={(e) => onHomePredictionChange(fixture.fixtureId, e.target.value !== '' ? parseInt(e.target.value) : null)}
        />
      </td>
      <td>
        <input
          className={styles.predictionInput}
          type="number"
          value={awayPrediction === null ? '' : awayPrediction}
          onChange={(e) => onAwayPredictionChange(fixture.fixtureId, e.target.value !== '' ? parseInt(e.target.value) : null)}
        />
      </td>
      <td>
        {submitStateData.submitting ? (
          <button className={styles.SubmitButton} disabled>
            {/* need to add the spinning wheel icon */}
            <i className="fa fa-spinner fa-spin"></i> Submitting...
          </button>
        ) : (
          <button className={styles.SubmitButton} onClick={(e) => onSubmitPrediction(fixture.fixtureId)}>
            {submitStateData.submitResult === 'success' ? (
              <>
                {/* need to add the tick icon */}
                <i className="fa fa-check"></i> Submitted
              </>
            ) : submitStateData.submitResult === 'error' ? (
              <>
                {/* need to add the X icon */}
                <i className="fa fa-times"></i> Error
              </>
            ) : (
              <>
                {/* need to add the edit symbol icon */}
                <i className="fa fa-edit"></i> Submit
              </>
            )}
          </button>
        )}
      </td>
    </tr>
  );
};

export default FixtureRow;