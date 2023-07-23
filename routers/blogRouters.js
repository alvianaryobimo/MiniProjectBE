const router = require("express").Router();
const { blogControllers } = require("../controllers");
const { verifyToken } = require("../middleware/auth");
const { multerUpload } = require("../middleware/multer");
const { checkCreateBlog } = require("../middleware/validator");

router.get("/", blogControllers.getAllBlogs);
router.post("/createBlog", verifyToken, multerUpload('./Public/Blog', 'Blog').single('file'), checkCreateBlog, blogControllers.createBlog);
router.get("/search", blogControllers.searchBlog);
router.get("/sort", blogControllers.sortBlog);
router.get("/:id", blogControllers.getBlogById);
router.post("/like/:id", verifyToken, blogControllers.likeArticle);

module.exports = router;