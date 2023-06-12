import { createContext } from 'react';

interface PredictionContextType {
  updatedPredictions: string[];
  setUpdatedPredictions: React.Dispatch<React.SetStateAction<string[]>>;
}

const PredictionContext = createContext<PredictionContextType>({
  updatedPredictions: [],
  setUpdatedPredictions: () => {}
});

export default PredictionContext;