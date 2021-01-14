const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  question:[{type: Schema.Types.ObjectId, ref: "questions"}]
});

const questionSchema = Schema({
  uploadedBy: {
    type: Schema.Types.ObjectId, ref: "user"
  },
  questionImageLink: {
    type: String,
  },
  answerImageLink: String,
  correctAnswer: {
    type: String,
    required: true,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:"topic"
  }
});

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true
  },
  password: {
    type: String,
    required: true,
  },
  contributions: [{ type: Schema.Types.ObjectId, ref: "questions" }],
  reports: [{type: Schema.Types.ObjectId, ref: "report"}]
});

const reportSchema = Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  totalQuestion: {
    type: Number,
  },
  totalAnswered: {
    type: Number,
  },
  incorrectAnswers: {
    //array of questionId with incorrect answers
    type: Array,
    required: true,
  },
  correctAnswers: {
    //array of questionId with correct answers
    type: Array,
    required: true,
  },
});

const reportModel = mongoose.model("report", reportSchema);
const topicModal = mongoose.model("topic", topicSchema);
const questionModel = mongoose.model("questions", questionSchema);
const userModel = mongoose.model("user", userSchema);

module.exports = {
  topicModal,
  questionModel,
  userModel,
  reportModel,
};
