const bcrypt = require("bcrypt");
const User = require("../models/user");
const mailSender = require("../utills/mail/mailSender");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { password } = req.body;

    const user = new User(req.body);
    user.password = await hashPassword(password);

    try {
        await user.save();
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).send({ message: "email already exists" });
        }

        return res.status(400).send({ message: "invalid fields" });
    }

    mailSender(
        user.email,
        user.name,
        `http://localhost:3001/api/auth/verify?id=${user.id}`
    );

    res.status(200).send({ id: user.id });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
        !user ||
        user.status != "Active" ||
        !(await bcrypt.compare(password, user.password))
    ) {
        return res.status(400).send({ message: "wrong credentials" });
    }

    const token = generateToken(user);
    setCookie(res, token);

    return res.status(200).send({ message: "success" });
};

const verify = async (req, res) => {
    const { id } = req.query;

    if (
        !(await User.findOneAndUpdate(
            { _id: id, status: "Pending" },
            { status: "Active" }
        ))
    ) {
        return res.status(410).send({ message: "expired code" });
    }

    res.status(303).redirect("http://localhost:3000/login");
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const generateToken = (user) => {
    const data = { email: user.email, id: user.id, role: user.role };
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn: "3h" });
};

const setCookie = (res, token) => {
    res.cookie("Authorization", token, {
        httpOnly: true,
        maxAge: 60 * 180 * 1000,
    });
};

module.exports = { register, login, verify };
