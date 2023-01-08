import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Movies = mongoose.model(
  "movies",
  new Schema({
    awards: {
      nominations: Number,
      text: String,
      wins: Number,
    },
    cast: Array,
    countries: Array,
    directors: Array,
    fullplot: String,
    genres: Array,
    imdb: {
      id: Number,
      rating: { type: "Decimal128" },
      votes: Number,
    },
    languages: Array,
    metacritic: Number,
    num_mflix_comments: Number,
    plot: String,
    poster: String,
    rated: String,
    released: Date,
    runtime: Number,
    type: String,
    writers: Array,
    year: Number,
    tomatoes: {
      boxOffice: String,
      consensus: String,
      critic: {
        meter: Number,
        numReviews: Number,
        rating: { type: "Decimal128" },
      },
      dvd: Date,
      fresh: Number,
      lastUpdated: Date,
      production: String,
      rotten: Number,
      viewer: {
        meter: Number,
        numReviews: Number,
        rating: { type: "Decimal128" },
      },
      website: String,
    },
  })
);

export default Movies;
