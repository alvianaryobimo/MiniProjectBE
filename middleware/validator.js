const { body, validationResult } = require("express-validator")

module.exports = {
    checkRegsiter: async (req, res, next) => {
        try {
            await body("username").notEmpty().isAlphanumeric().withMessage("You have to fill the username").run(req);
            await body("email").notEmpty().isEmail().run(req);
            await body("phoneNumber").notEmpty().isMobilePhone().run(req);
            await body("password").notEmpty().isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).run(req);

            const validation = validationResult(req);
            if (validation.isEmpty()) next();
            else return res.status(400).send({
                status: false,
                message: "Validation invalid",
                error: validation.array()
            })

        } catch (error) {
            console.log(error);
        }
    },
    checkCreateBlog: async (req, res, next) => {
        await body('title').notEmpty().withMessage("You have to fill the title").run(req)
        await body('content').notEmpty().withMessage("You have to fill the content").run(req)
        await body('keywords').notEmpty().withMessage("You have to fill the keywords").run(req)
        await body('country').notEmpty().withMessage("You have to fill the country").run(req)

        const validation = validationResult(req)

        if (req.file === undefined) res.status(400).send({
            message: "You Have to upload A Picture"
        });
        else {
            if (validation.isEmpty()) next();
            else return res.status(400).send({
                error: validation.array()
            });
        }
    },
    checkUsername: async (req, res, next) => {
        await body('newUsername').notEmpty().withMessage('Write your new Username').isAlphanumeric().run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) next();
        else return res.status(400).send({
            error: validation.array()
        });
    },
    checkEmail: async (req, res, next) => {
        await body('newEmail').notEmpty().withMessage('Write your new Email').isEmail().run(req)

        const validation = validationResult(req)

        if (validation.isEmpty()) {
            next()
        }
        else {
            return res.status(400).send({
                error: validation.array()
            })
        }
    },
    checkPhone: async (req, res, next) => {
        await body('newPhone').notEmpty().withMessage('Write your new Number').isMobilePhone().run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) next();
        else return res.status(400).send({
            error: validation.array()
        });
    },
    checkPassword: async (req, res, next) => {
        await body('newPassword').notEmpty().isStrongPassword({
            minLength: 5,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1
        }).run(req)
        const validation = validationResult(req)

        if (validation.isEmpty()) next();
        else res.status(400).send({
            status: false,
            message: 'Password To Weak',
            error: validation.array()
        });
    },
}