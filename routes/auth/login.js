const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("email-validator");

module.exports = (app, connection) => {
    app.post("/login", (req, res) => {
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
                //Check if user exists
                const checkQuery = `SELECT * FROM users WHERE email = '${email}'`;

                connection.query(checkQuery, (checkError, result) => {
                    if (checkError) {
                        res.status(500).json({
                            data: "An error occured " + checkError
                        });
                    } else {
                        if (result.length < 1) {
                            res.status(404).json({
                                data: "User does not exist"
                            })
                        } else {
                            
                            //Compare passwords
                            bcrypt.compare(password, result[0].password, (compareError, compareResult) => {
                                if (compareError) {
                                    res.status(500).json({
                                        data: "An error occured " + compareError
                                    })
                                } else {
                                    if (!compareResult) {
                                        res.status(400).json({
                                            data: "Invalid password"
                                        });
                                    } else {
                                        //Send token
                                        const token = JWT.sign({ data: result[0] }, process.env.TOKEN_SECRET);

                                        res.status(200).json({
                                            data: token
                                        })
                                    }
                                    
                                }
                            });  
                        }
                    }
                })
            }
        }
    });
}