import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Comments = mongoose.model(
  "comments",
  new Schema({
    date: Date,
    email: String,
    name: String,
    text: String,
    movie_id: mongoose.Types.ObjectId,
  })
);

export default Comments;
