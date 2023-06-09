import React, { FC } from 'react';
import styles from './Predictions-list.module.css';

interface PredictionsListProps {}

const PredictionsList: FC<PredictionsListProps> = () => (
  <div className={styles.PredictionsList}>
    PredictionsList Component
  </div>
);

export default PredictionsList;
