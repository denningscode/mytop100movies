const verifyToken = require("../../middleware/verifyToken");
const api = require("../../axios/api");

module.exports = (app, connection) => {
    app.post("/movie/:id", verifyToken, (req, res) => {

        //Get movie ID
        const movieId = req.params.id;
        //Get user ID
        const userId = req.user.id;
        //Get rating from user
        const { rating } = req.body;

        if (!rating) {
            res.status(400).json({
                data: "You did not rate this movie"
            })
        } else {
            //Check for correct rating: rating should be 0 - 5
            if (rating > 5) {
                res.status(400).json({
                    data: "You cannot rate movies with more than 5 stars"
                })
            } else {
                //Check if movie has been added
                const checkMovie = `SELECT * FROM movies WHERE user_id = '${userId}' AND movie_id = '${movieId}'`;

                connection.query(checkMovie, (checkError, checkResult) => {
                    if (checkError) {
                        res.status(500).json({
                            data: "An error occured: " + checkError
                        })
                    } else {
                        if (checkResult.length > 0) {
                            res.status(400).json({
                                data: "You already added this movie to your list"
                            })
                        } else {
                            //Fetch movie information
                            api.get(`movie/${movieId}?api_key=${process.env.API_KEY}&language=en-US`)
                            .then(response => {
                                //Add movie to movies table
                                const addQuery = `INSERT INTO movies (movie_id, rating, user_id) VALUES ('${movieId}', '${rating}', '${userId}')`;

                                connection.query(addQuery, (addError, addResult) => {
                                    if (addError) {
                                        res.status(500).json({
                                            data: "An error occured: " + addError
                                        })
                                    } else {
                                        res.status(200).json({
                                            data: "Movie added to your list"
                                        })
                                    }
                                });
                            })
                            .catch(error => {
                                res.status(404).json({data: error.response.data.status_message})
                            })
                        }
                    }
                });
            }
            
        }
        
    });
}
