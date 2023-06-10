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

  return (
    <tr key={fixture.fixtureId}>
      <td>{fixture.date}</td>
      <td>
        <img className={styles.logo} src={fixture.home.logo} alt="Home Logo" />
        {fixture.home.name}
      </td>
      <td>
        {fixture.away.name}
        <img className={styles.logo} src={fixture.away.logo} alt="Away Logo" />
      </td>
      <td>
        {fixture.score.home} - {fixture.score.away}
      </td>
      <td>{fixture.status}</td>
      <td>
        <input
          type="number"
          value={homePrediction === null ? '' : homePrediction}
          onChange={(e) => onHomePredictionChange(fixture.fixtureId, e.target.value !== '' ? parseInt(e.target.value) : null)}
        />
      </td>
      <td>
        <input
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