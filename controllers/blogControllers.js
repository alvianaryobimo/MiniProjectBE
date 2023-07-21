const db = require("../models");
const blog = db.Blog;

module.exports = {
    getBlogById: async (req, res) => {
        try {
            const result = await blog.findOne({
                where: { id: req.params.id }
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(200).send(error)
        }
    },
    getAllBlogs: async (req, res) => {
        try {
            const result = await blog.findAll();
            res.status(400).send(result);
        } catch (error) {
            res.status(400).send(error)
        }
    },
    createBlog: async (req, res) => {
        const { title, content, videoUrl, keywords, country, categories } = req.body;
        // console.log(req);
        try {
            const result = await blog.create({
                title,
                imgUrl: req.file.filename,
                content,
                videoUrl,
                keywords,
                country,
                ProfileId: req.user.id,
                CategoryId: +categories
            });
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    }
}