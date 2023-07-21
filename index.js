const express = require("express");
const PORT = 2000;
const app = express();
require("dotenv").config();
const db = require("./models");

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("This is my API");
});

const { authRouters, blogRouters } = require("./routers");
app.use("/auth", authRouters);
app.use("/blog", blogRouters);

app.listen(PORT, () => {
    // db.sequelize.sync({ alter: true });
    console.log(`Server is running at PORT ${PORT}`);
});