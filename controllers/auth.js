const bcrypt = require("bcrypt");
const User = require("../models/user");
const mailSender = require("../utills/mail/mailSender");

const pendingUsers = {};

const register = async (req, res) => {
    const { email, password } = req.body;

    if (await User.findOne({ email })) {
        return res.status(409).send({ message: "email already exists" });
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    const code = Math.floor(Math.random() * 89999 + 10000);
    pendingUsers[code] = user;

    mailSender(
        user.email,
        user.name,
        `http://localhost:3001/auth/verify?verification_code=${code}`
    );

    res.status(200).send({ message: "code been sent to mail" });
};

const login = async (req, res) => {};

const verify = async (req, res) => {
    const code = req.query["verification_code"];
    const user = pendingUsers[code];
    delete pendingUsers[code];

    if (!user) return res.status(400).send({ message: "invalid code" });
    await user.save();
    res.status(302).redirect("http://localhost:3000/login");
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = { register, login, verify };
