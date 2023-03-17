const verifyToken = require("../../middleware/verifyToken");

module.exports = (app) => {
    app.get("/current-user", verifyToken, (req, res) => {
        res.status(200).json({
            data: req.user
        })
    });
}