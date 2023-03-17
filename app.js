require("dotenv").config();
const express = require("express");
const mysql = require("mysql");


const register = require("./routes/auth/register");
const login = require("./routes/auth/login");
const getUser = require("./routes/user/getUser");

const getMyTopMovies = require("./routes/movies/getMyTopMovies");
const addMovie = require("./routes/movies/addMovie");
const editRating = require("./routes/movies/editRating");

const app = express();
app.use(express.json());
const port = 3000;

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});
   
connection.connect((error) => {
    if (error) {
        console.log(error.sqlMessage)
    } else {
        console.log("connected to database")
    }
});


//Auth
register(app, connection);
login(app, connection);
getUser(app);

//Movie
getMyTopMovies(app, connection);
addMovie(app, connection);
editRating(app, connection);


app.listen(port, () => console.log("Server running"));
