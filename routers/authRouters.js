const router = require("express").Router()
const { authControllers } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.post("/", authControllers.register);
router.post("/login", authControllers.login);
router.get("/keepLogin", verifyToken, authControllers.keepLogin);
router.patch("/verify", verifyToken, authControllers.verify);
router.patch("/changeUsername", verifyToken, authControllers.changeUsername);
router.patch("/changeEmail", verifyToken, authControllers.changeEmail);
router.patch("/changePhone", verifyToken, authControllers.changePhone);
router.patch("/changePassword", verifyToken, authControllers.changePassword);
router.put("/forgetPassword", authControllers.forgetPassword);
router.patch("/resetPassword", verifyToken, authControllers.resetPassword);
router.post("/updateProfile", verifyToken, multerUpload(`./Public/Avatar`, 'Avatar').single('file'), authControllers.updateProfile);

module.exports = router;