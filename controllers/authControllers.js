const { Op } = require("sequelize");
const db = require("../models");
const user = db.Profile;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs")
const handlebars = require("handlebars")
const transporter = require("../middleware/transporter.js")

module.exports = {
    register: async (req, res) => {
        try {
            const { username, email, phoneNumber, password } = req.body;
            const isEmailexist = await user.findOne({
                where: { email: email }
            });

            if (isEmailexist) throw { message: "Email has been used" }
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt)

            const result = await user.create({ username, email, phoneNumber, password: hashPassword });
            const payload = { username, email, phoneNumber, password }
            const token = jwt.sign(payload, "minproBimo", { expiresIn: "3d" });
            console.log(token);

            res.status(200).send({
                status: true,
                message: "Register success",
                token,
                result
            })
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },
    login: async (req, res) => {
        try {
            const { data, password } = req.body;

            const checkLogin = await user.findOne({
                where: {
                    [Op.or]: [
                        { email: data },
                        { username: data },
                        { phoneNumber: data }
                    ]
                }
            });
            if (!checkLogin) throw { message: "User not Found" }
            if (checkLogin.isVerified == false) throw ({ message: 'Account is not verified' });
            const isValid = await bcrypt.compare(password, checkLogin.password);
            if (!isValid) throw { message: "wrong password" }

            const payload = { id: checkLogin.id, isAdmin: checkLogin.isAdmin }
            const token = jwt.sign(payload, "minproBimo", { expiresIn: "3d" });

            res.status(200).send({
                status: true,
                message: "Login success",
                token
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    keepLogin: async (req, res) => {
        try {
            const result = await user.findOne({
                where: {
                    id: req.user.id
                }
            });
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    verify: async (req, res) => {
        try {
            const result = await user.update(
                { isVerified: true },
                {
                    where: { username: req.user.username },
                }
            );
            res.status(200).send({
                message: true
            })
        } catch (error) {
            res.status(400).send(error);
        }
    },
    changeUsername: async (req, res) => {
        try {
            const { currentUsername, newUsername } = req.body;
            const isAccountExist = await user.findOne({
                where: { id: req.user.id },
            });
            const email = isAccountExist.email;
            console.log(isAccountExist.username);
            if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
            if (currentUsername !== isAccountExist.username)
                throw { message: "Username not found" };
            const result = await user.update(
                { username: newUsername },
                { where: { id: req.user.id } }
            );
            const data = await fs.readFileSync(
                "./index.html",
                "utf-8"
            );
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ username: newUsername });
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "New username",
                html: tempResult,
            });
            res.status(200).send({ result, message: "Username has been changed" });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },
    changeEmail: async (req, res) => {
        try {
            const { currentEmail, newEmail } = req.body;
            const isAccountExist = await user.findOne({
                where: { id: req.user.id },
            });
            const email = isAccountExist.email;
            console.log(email, newEmail);
            if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
            if (currentEmail !== isAccountExist.email)
                throw { message: "Username not found" };
            const result = await user.update(
                { email: newEmail },
                { where: { id: req.user.id } }
            );
            const data = await fs.readFileSync(
                "./index.html",
                "utf-8"
            );
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ email: newEmail });
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "New Email",
                html: tempResult,
            });
            res.status(200).send({ result, message: "Email has been changed" });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },
    changePhone: async (req, res) => {
        try {
            const { currentPhone, newPhone } = req.body;
            const isAccountExist = await user.findOne({
                where: { id: req.user.id },
            });
            const email = isAccountExist.email;
            if (!isAccountExist.isVerified) throw { msg: "Account not verified" };
            if (currentPhone !== isAccountExist.phoneNumber)
                throw { message: "Phone not found" };
            const result = await user.update(
                { phoneNumber: newPhone },
                { where: { id: req.user.id } }
            );
            const data = await fs.readFileSync(
                "./index.html",
                "utf-8"
            );
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ phoneNumber: newPhone });
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "New Phone",
                html: tempResult,
            });
            res.status(200).send({ result, message: "Phone Number has been changed" });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const isAccountExist = await user.findOne({
                where: { id: req.user.id },
            });
            const email = isAccountExist.email;
            if (newPassword !== confirmPassword) throw { message: "Password is not same" }
            const isValid = await bcrypt.compare(currentPassword, isAccountExist.password);
            console.log(isValid);
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(confirmPassword, salt)
            if (isValid == false) throw { message: "Password not found" };
            const result = await user.update(
                { password: hashPassword },
                { where: { id: req.user.id } }
            );
            const data = await fs.readFileSync(
                "./index.html",
                "utf-8"
            );
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile({ password: confirmPassword });
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "New Phone",
                html: tempResult,
            });
            res.status(200).send({ result, message: "Password Number has been changed" });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        }
    },
    updateProfile: async (req, res) => {
        try {
            const result = await user.update({
                imgProfile: req.file.filename,
            }, {
                where: { id: req.user.id }
            });
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send(error)
        }
    },
    forgetPassword: async (req, res) => {

    },
    resetPassword: async (req, res) => {

    },
}