import Movies from "../Models/movie.js";

export const totalMoviesWithPoster = async (req, res) => {
  try {
    const totalPosterMovies = [
      {
        $match: {
          poster: {
            $ne: null,
          },
        },
      },
      {
        $count: "Count",
      },
    ];
    const totalMoviesWithPoster = await Movies.aggregate(totalPosterMovies);
    res.status(200).json({
      data: {
        count: totalMoviesWithPoster[0].Count,
      },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const dashBoardPrimaryDetails = async (req, res) => {
  try {
    const awardsAggregate = [
      {
        $match: {
          "awards.text": new RegExp("Won ([0-9]|[0-9][0-9]) Oscar"),
        },
      },
      {
        $project: {
          title: 1,
          awardWins: "$awards.wins",
          awardNominations: "$awards.nominations",
          awardsTest: "$awards.text",
          oscarWins: {
            $toInt: {
              $arrayElemAt: [
                {
                  $split: ["$awards.text", " "],
                },
                1,
              ],
            },
          },
        },
      },
      {
        $sort: {
          oscarWins: -1,
        },
      },
      {
        $group: {
          _id: "Oscars",
          totalOscars: {
            $sum: "$oscarWins",
          },
          totalAwards: {
            $sum: "$awardWins",
          },
        },
      },
    ];
    const collectionsAggregate = [
      {
        $match: {
          "tomatoes.boxOffice": {
            $ne: null,
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          year: 1,
          meter: {
            $substr: [
              "$tomatoes.boxOffice",
              {
                $add: [
                  {
                    $strLenCP: "$tomatoes.boxOffice",
                  },
                  -1,
                ],
              },
              1,
            ],
          },
          collection: {
            $toDouble: {
              $substr: [
                "$tomatoes.boxOffice",
                1,
                {
                  $add: [
                    {
                      $strLenCP: "$tomatoes.boxOffice",
                    },
                    -2,
                  ],
                },
              ],
            },
          },
          collectionResult: {
            $cond: {
              if: {
                $eq: [
                  "M",
                  {
                    $substr: [
                      "$tomatoes.boxOffice",
                      {
                        $add: [
                          {
                            $strLenCP: "$tomatoes.boxOffice",
                          },
                          -1,
                        ],
                      },
                      1,
                    ],
                  },
                ],
              },
              then: {
                $multiply: [
                  {
                    $toDouble: {
                      $substr: [
                        "$tomatoes.boxOffice",
                        1,
                        {
                          $add: [
                            {
                              $strLenCP: "$tomatoes.boxOffice",
                            },
                            -2,
                          ],
                        },
                      ],
                    },
                  },
                  1000000,
                ],
              },
              else: {
                $multiply: [
                  {
                    $toDouble: {
                      $substr: [
                        "$tomatoes.boxOffice",
                        1,
                        {
                          $add: [
                            {
                              $strLenCP: "$tomatoes.boxOffice",
                            },
                            -2,
                          ],
                        },
                      ],
                    },
                  },
                  1000,
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "collections",
          totalCollectionInMillion: {
            $sum: "$collection",
          },
          totalCollectionInThousands: {
            $sum: "$collectionResult",
          },
        },
      },
    ];

    const totalMovies = await Movies.count();
    const totalAwards = await Movies.aggregate(awardsAggregate);
    const totalCollections = await Movies.aggregate(collectionsAggregate);

    res.status(200).json({
      data: {
        totalMovies,
        totalAwardsData: {
          totalOscars: totalAwards[0].totalOscars,
          totalAwards: totalAwards[0].totalAwards,
        },
        totalCollectionsData: {
          totalCollectionInMillion:
            totalCollections[0].totalCollectionInMillion,
          totalCollectionInThousands:
            totalCollections[0].totalCollectionInThousands,
        },
      },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const dashBoardSecondaryDetails = async (req, res) => {
  try {
    const movieGenresAggregate = [
      {
        $unwind: {
          path: "$genres",
        },
      },
      {
        $group: {
          _id: "$genres",
          count: {
            $count: {},
          },
        },
      },
      {
        $project: {
          genre: "$_id",
          count: "$count",
          _id: 0,
        },
      },
      {
        $sort: {
          genre: 1,
        },
      },
    ];

    const imdbRatingAggregate = [
      {
        $match: {
          "imdb.votes": {
            $ne: "",
          },
          "imdb.rating": {
            $ne: "",
          },
          type: {
            $eq: "movie",
          },
          poster: {
            $ne: null,
          },
        },
      },
      {
        $project: {
          title: 1,
          year: 1,
          votes: "$imdb.votes",
          rating: "$imdb.rating",
          poster: 1,
          type: 1,
        },
      },
      {
        $sort: {
          rating: -1,
        },
      },
      {
        $limit: 10,
      },
    ];

    const tomatoRatingAggregate = [
      {
        $match: {
          "tomatoes.rotten": {
            $ne: null,
          },
          "tomatoes.fresh": {
            $ne: null,
          },
        },
      },
      {
        $project: {
          title: 1,
          year: 1,
          rotten: "$tomatoes.rotten",
          fresh: "$tomatoes.fresh",
          poster: 1,
          viewerMeter: "$tomatoes.viewer.meter",
          viewerRating: "$tomatoes.viewer.rating",
          viewerReviews: "$tomatoes.viewer.numReviews",
          criticsMeter: "$tomatoes.critic.meter",
          criticsRating: "$tomatoes.critic.rating",
          criticsReviews: "$tomatoes.critic.numReviews",
        },
      },
      {
        $sort: {
          criticsMeter: -1,
          criticsReviews: -1,
        },
      },
      {
        $limit: 10,
      },
    ];

    const movieGenres = await Movies.aggregate(movieGenresAggregate);
    const topImdbMovies = await Movies.aggregate(imdbRatingAggregate);
    const topTomatoMovies = await Movies.aggregate(tomatoRatingAggregate);

    res.status(200).json({
      data: {
        movieGenres,
        topImdbMovies,
        topTomatoMovies,
      },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
