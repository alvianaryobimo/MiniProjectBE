const { body, validationResult } = require("express-validator")

module.exports = {
    checkRegsiter: async (req, res, next) => {
        try {
            await body("username").notEmpty().isAlphanumeric().run(req);
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
    }
}