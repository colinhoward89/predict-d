import { mongoose } from "./index";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
export default User;