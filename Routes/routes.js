import express from "express";


import {
  dashBoardPrimaryDetails,
  dashBoardSecondaryDetails,
  totalMoviesWithPoster,
} from "../Controllers/dashboardController.js";
import { allMovies, getMovie, getSimilarMovies, searchMovie } from "../Controllers/moviesController.js";
import { getComments } from "../Controllers/commentsController.js";

const router = express.Router();

//Dashboard
router.get("/primarydashboard", dashBoardPrimaryDetails);
router.get("/secondarydashboard", dashBoardSecondaryDetails);
router.get("/moviescount", totalMoviesWithPoster);


//Movies
router.get("/allmovies", allMovies);
router.get("/movie/:id",getMovie)
router.get("/similarmovies",getSimilarMovies)
router.get("/searchmovies",searchMovie)

//Comments
router.get("/comments/:id",getComments)

export default router;
