const db = require("../models");
// const profile = require("../models/profile");
const blog = db.Blog;
const profile = db.Profile;
const jwt = require("jsonwebtoken");
const likeblogs = db.LikeBlogs

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
    },
    likeArticle: async (req, res) => {
        try {
            const blogId = req.params.id;
            const token = req.headers.authorization.split(' ')[1];
            const decodeUser = jwt.verify(token, "minproBimo");
            const profileId = decodeUser.id;

            if (!profileId) return res.status(400).send({
                status: 401,
                message: "Unauthorized. You need to provide a valid JWT."
            });

            const validUser = await profile.findByPk(profileId);

            if (!validUser) return res.status(400).send({
                status: 404,
                message: "User not found."
            });

            const article = await blog.findByPk(blogId);

            if (!article) return res.status(400).send({
                status: 404,
                message: "Article not found."
            });

            // const existingLike = await likeblogs.findOne({
            //     where: {
            //         profileId,
            //         blogId
            //     }
            // });

            // if (existingLike) return res.status(400).send({
            //     status: 409,
            //     message: "You have already liked this article.",
            // });

            // let usersThatLiked = article.users_that_liked || [];
            // if (article.users_that_liked) usersThatLiked = article.users_that_liked;

            // if (!usersThatLiked.includes(validUser.username)) usersThatLiked.push(validUser.username);

            // await blog.update({
            //     users_that_liked: usersThatLiked
            // });

            await likeblogs.create({
                profileId,
                blogId,
            });

            // await blog.increment('likeCount', {
            //     where: {
            //         id: profileId
            //     }
            // });

            res.status(200).send({
                status: 201,
                profileId: profileId,
                username: validUser.username,
                blogId: blogId,
                title: blog.title,
                message: "Article liked!"
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
}