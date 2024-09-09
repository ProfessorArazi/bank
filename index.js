const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const appRouter = require("./routes/auth");

dotenv.config("./.env");

const app = express();

app.use(express.json());
app.use(cors());
app.use(appRouter);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.once("open", () => console.log("connected to db"));

app.listen(PORT, (error) => {
    console.log(
        error ||
            `Server is Successfully Running, and App is listening on port ${PORT}`
    );
});
