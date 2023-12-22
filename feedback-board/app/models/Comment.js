const { model, models } = require("mongoose");
import mongoose, { Schema } from "mongoose";
import { Truculenta } from "next/font/google";
import { User } from "./User";

const commentSchema = new Schema({
  text: {type: String},
  uploads: {type: [String]},
  userEmail: {type: String, required: true },
  feedbackID: { type: mongoose.Types.ObjectId, required: true},
},{
  timestamps: true,
  toObject: {virtuals: true},
  toJSON:{virtuals: true}, //important converting the result to JSON thats why virtuals were not included
})

commentSchema.virtual('user', {
  ref: 'User',
  localField: 'userEmail',
  foreignField: 'email',
  justOne: true,
})

export const Comment = models?.Comment || model('Comment', commentSchema);