const db = require("../models");
const { Op } = require("sequelize");
const blog = db.Blog;
const profile = db.Profile;
const jwt = require("jsonwebtoken");
const categories = require("../models/categories");
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

            await blog.increment('likesCount', {
                where: {
                    id: profileId
                }
            });

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
    searchBlog: async (req, res) => {
        try {
            const { CategoryId, title, keywords } = req.query
            const clause = []
            if (CategoryId) {
                clause.push({ CategoryId: CategoryId })
            }
            if (title) {
                clause.push({ title: title })
            }
            if (keywords) {
                clause.push({ keywords: keywords })
            }
            const result = await blog.findAll(
                {
                    where: { [Op.or]: clause }
                },
            )
            res.status(200).send({
                result
            })
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    sortBlog: async (req, res) => {
        try {
            const sort = req.query.sort || "DESC";
            const sortBy = req.query.sortBy || "createdAt";
            const result = await blog.findAll(
                {
                    order: [[sortBy, sort]],
                });
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send(error)
        }
    }
}