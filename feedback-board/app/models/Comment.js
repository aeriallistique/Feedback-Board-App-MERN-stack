const { model, models } = require("mongoose");
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  text: {type: String},
  uploads: {type: [String]},
  userEmail: {type: String, required: true},
  feedbackID: { type: mongoose.Types.ObjectId, required: true},
},{
  timestamps: true
})

export const Comment = models?.Comment || model('Comment', commentSchema);