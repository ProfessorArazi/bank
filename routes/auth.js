const express = require("express");
const { register, login, verify } = require("../controllers/auth");
const authRouter = express.Router();

authRouter.post("/api/auth/signup", (req, res) => register(req, res));
authRouter.post("/api/auth/signin", (req, res) => login(req, res));
authRouter.get("/api/auth/verify", (req, res) => verify(req, res));

module.exports = authRouter;
