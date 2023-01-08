import Movies from "../Models/movie.js";

export const allMovies = async (req, res) => {
  const { limit } = req.query;
  try {
    const movies = [
      {
        $match: {
          poster: {
            $ne: null,
          },
        },
      },
      {
        $skip: (limit - 1) * 100,
      },
      {
        $limit: 100,
      },
    ];

    const fetchMovies = await Movies.aggregate(movies);
    res.status(200).json({ data: { moviesList: fetchMovies } });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movies.findById(id);
    if (!movie) return res.status(404).json({ error: "Something went wrong" });
    res.status(200).json({ data: { movie } });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const searchMovie = async (req, res) => {
  const { search } = req.query;
  try {
    const searchParameter = [
      {
        $project: {
          title: 1,
          poster: 1,
        },
      },
      {
        $match: {
          poster: {
            $ne: null,
          },
          title: {
            $regex: new RegExp(search),
            $options: "i",
          },
        },
      },
      {
        $limit: 4,
      },
    ];
    const moviesList = await Movies.aggregate(searchParameter);
    if (!moviesList)
      return res.status(404).json({ error: "Something went wrong" });
    if (moviesList.length === 0)
      return res
        .status(202)
        .json({ data: { message: "No movies with provided search" } });
    res.status(200).json({ data: { moviesList } });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getSimilarMovies = async (req, res) => {
  const { genres, year, title } = req.query;
  let genresData = genres.split(" ");
  let startYear = Number(year.slice(0, 3) + 0);
  let endYear = startYear + 10;
  try {
    const similarMovies = [
      {
        $match: {
          genres: {
            $in: genresData,
          },
          year: {
            $gt: startYear,
            $lt: endYear,
          },
          poster: {
            $ne: null,
          },
          title: {
            $ne: title,
          },
        },
      },
      {
        $project: {
          poster: 1,
          title: 1,
        },
      },
      {
        $limit: 4,
      },
    ];
    const similarMoviesList = await Movies.aggregate(similarMovies);
    if (!similarMoviesList)
      return res.status(404).json({ error: "Something went wrong" });
    res.status(200).json({ data: { similarMoviesList } });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
