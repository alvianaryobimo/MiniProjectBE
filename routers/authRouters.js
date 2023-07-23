const router = require("express").Router()
const { authControllers } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const { checkRegsiter, checkUsername, checkEmail, checkPhone, checkPassword } = require("../middleware/validator");

router.post("/", checkRegsiter, authControllers.register);
router.post("/login", authControllers.login);
router.get("/keepLogin", verifyToken, authControllers.keepLogin);
router.patch("/verify", verifyToken, authControllers.verify);
router.patch("/changeUsername", verifyToken, checkUsername, authControllers.changeUsername);
router.patch("/changeEmail", verifyToken, checkEmail, authControllers.changeEmail);
router.patch("/changePhone", verifyToken, checkPhone, authControllers.changePhone);
router.patch("/changePassword", verifyToken, checkPassword, authControllers.changePassword);
router.put("/forgetPassword", authControllers.forgetPassword);
router.patch("/resetPassword", verifyToken, authControllers.resetPassword);
router.post("/updateProfile", verifyToken, multerUpload(`./Public/Avatar`, 'Avatar').single('file'), authControllers.updateProfile);

module.exports = router;