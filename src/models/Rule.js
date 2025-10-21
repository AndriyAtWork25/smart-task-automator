import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  triggerType: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Rule = mongoose.model("Rule", ruleSchema);
export default Rule;
