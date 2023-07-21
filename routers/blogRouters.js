const router = require("express").Router();
const { blogControllers } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");

router.get("/", blogControllers.getAllBlogs);
router.post("/createBlog", verifyToken, multerUpload('./Public/Blog', 'Blog').single('file'), blogControllers.createBlog);
router.get("/:id", blogControllers.getBlogById);

module.exports = router;