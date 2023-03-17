const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //Check if authorization header is available
    const header = req.headers['authorization'];

    if (!header) {
        res.status(400).json({
            data: "Authorization header missing"
        })
    } else {
        //Get token
        const token = header.split(' ')[1];

        if (!token) {
            res.status(401).json({
                data: "Access denied"
            })
        } else {
            //Verify token
            JWT.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    res.status(500).json({
                        data: error.message
                    })
                } else {
                    req.user = decoded.data;
                    next();
                }
            });
        }
    }
} 