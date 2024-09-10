const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRouter = require("./routes/auth");
const { removeExpired } = require("./utills/db/remove_expired");

dotenv.config("./.env");

const app = express();

app.use(express.json());
app.use(cors());
app.use(authRouter);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("connected to db"));

removeExpired();

app.listen(PORT, (error) => {
    console.log(
        error ||
            `Server is Successfully Running, and App is listening on port ${PORT}`
    );
});
