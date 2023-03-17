const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const saltRounds = 10;


module.exports = (app, connection) => {
    app.post("/register", (req, res) => {
        //Get form inputs
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                data: "Fields cannot be left empty"
            });
        } else {
            //Check if email is valid
            if (!validator.validate(email)) {
                res.status(400).json({
                    data: "Invalid email address"
                })
            } else {
                //Check if user already exists in database
                const checkQuery = `SELECT * FROM users WHERE email = '${email}'`;
                connection.query(checkQuery, (error, result) => {
                    if (error) {
                        req.status(500).json({
                            data: "An eror occured: " + error
                        });
                    } else {
                        if (result.length > 0) {
                            res.status(400).json({
                                data: "User with email address already exists"
                            });
                        } else {
                            //Hash password
                            bcrypt.hash(password, saltRounds, (hashError, hash) => {
                                if (hashError) {
                                    res.status(500).json({
                                        data: "An error occured: " + hashError
                                    });
                                } else {
                                    //Add users information to database
                                    const addQuery = `INSERT INTO users (email, password) VALUES ('${email}', '${hash}')`;
                                    connection.query(addQuery, (error, result) => {
                                        if (error) {
                                            res.status(500).json({
                                                data: "An error occured: " + error
                                            });
                                        } else {
                                            if (result) {
                                                //Login user and generate token
                                                //Compare passwords
                                                bcrypt.compare(password, hash, (compareError, result) => {
                                                    if (compareError) {
                                                        res.status(500).json({
                                                            data: "An error occured " + compareError
                                                        })
                                                    } else {
                                                        if (!result) {
                                                            res.status(400).json({
                                                                data: "Invalid password"
                                                            });
                                                        } else {
                                                            const loginQuery = `SELECT * FROM users WHERE email = '${email}'`;  
                                                            connection.query(loginQuery, (loginError, result) => {
                                                                if (loginError) {
                                                                    res.status(500).json({
                                                                        data: "An error occured: " + loginError
                                                                    });
                                                                } else {
                                                                    //Send token 
                                                                    const token = JWT.sign({ data: result[0] }, process.env.TOKEN_SECRET);

                                                                    res.status(200).json({
                                                                        data: token
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
                            });
                            
                        }
                    }
                });
            }
        }
    });
}
