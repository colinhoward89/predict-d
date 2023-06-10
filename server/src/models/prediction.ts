import { mongoose } from "./index";

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  match: {
    type: Number,
    required: true,
  },
  home: {
    type: Number,
    required: true,
  },
  away: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
  },
  goal: {
    type: Boolean,
  },
  updated: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;