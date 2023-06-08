import { mongoose } from "./index";

const leagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  competition: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    predictions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prediction',
      default: 0,
    }],
    points: {
      type: Number,
      default: 0,
    },
    goals: {
      type: Number,
      default: 0,
    },
  }],
  image: {
    type: String,
  },
});

const League = mongoose.model("League", leagueSchema);
export default League;