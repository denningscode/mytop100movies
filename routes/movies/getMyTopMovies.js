const verifyToken = require("../../middleware/verifyToken");
const api = require("../../axios/api");

module.exports = (app, connection) => {
    app.get("/movies", verifyToken, (req, res) => {
        //Get top movies for current user
        const userId = req.user.id;

        const getMyMovies = `SELECT * FROM movies WHERE user_id = '${userId}'`;

        connection.query(getMyMovies, async (getError, getResult) => {
            if (getError) {
                res.status(500).json({
                    data: "An error occured: " + getError
                });
            } else {
                if (getResult.length < 1) {
                    res.status(200).json({
                        data: "You have not added any movie yet"
                    })
                } else {
                    //Get movie info with movieID
                    //Then map through movies to get movie info and ratings
                    const myMovieList = await Promise.all(getResult.map(async element => {
                        const movie = await api.get(`movie/${element.movie_id}?api_key=${process.env.API_KEY}&language=en-US`);

                        const movieObj = {
                            movieInfo: movie.data,
                            myRating: element.rating
                        }

                        return movieObj;
                    
                    }));  
                    
                    res.status(200).json({
                        data: myMovieList
                    })
                }
            }
        });


    })
}

//no need to check for error here because the movies here are all valid movies