const db = require("../models");
const user = db.Profile;

module.exports = {
    getAll: async (req, res) => {
        try {
            console.log(req.user);
            const result = await user.findAll();
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}