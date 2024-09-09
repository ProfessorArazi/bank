const express = require("express");
const { register, login, verify } = require("../controllers/auth");
const appRouter = express.Router();

appRouter.post("/auth/signup", (req, res) => register(req, res));
appRouter.post("/auth/signin", (req, res) => login(req, res));
appRouter.get("/auth/verify", (req, res) => verify(req, res));

module.exports = appRouter;
