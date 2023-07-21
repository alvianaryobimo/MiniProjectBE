const router = require("express").Router()
const { userControllers } = require("../controllers");

router.get("/" ,userControllers.getAll);

module.exports = router;