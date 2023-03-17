const verifyToken = require("../../middleware/verifyToken");

module.exports = (app, conection) => {
    app.patch("/movie/:id", verifyToken, (req, res) => {

        //Get movie ID
        const movieId = req.params.id;
        //Get user ID
        const userId = req.user.id;

        const { newRating } = req.body;

        //Get new movie rating
        if (!newRating) {
            res.status(400).json({
                data: "You did not rate this movie"
            })
        } else {
            //Check for correct rating: rating should be 0 - 5
            if (newRating > 5) {
                res.status(400).json({
                    data: "You cannot rate movies with more than 5 stars"
                })
            } else {
                //Check if movie is in database
                const checkMovie = `SELECT * FROM movies WHERE user_id = '${userId}' AND movie_id = '${movieId}'`;
                conection.query(checkMovie, (checkError, checkresult) => {
                    if (checkError) {
                        res.status(500).json({
                            data: "An error occured: " + checkError
                        })
                    } else {
                        if (checkresult.length < 1) {
                            res.status(404).json({
                                data: "Movie not in your list"
                            })
                        } else {
                            //Update movie rating
                            const updateRating = `UPDATE movies SET rating='${newRating}' WHERE user_id = '${userId}' AND movie_id = '${movieId}'`;
                            conection.query(updateRating, (updateError, updateResult) => {
                                if (updateError) {
                                    res.status(500).json({
                                        data: "An error occured: " + updateError
                                    })
                                } else {
                                    res.status(200).json({
                                        data: "Movie rating updated"
                                    })
                                }
                            })
                        }
                    }
                });
            }
        }
    })
}