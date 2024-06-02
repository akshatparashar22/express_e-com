const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDatabase = () => {
    console.log("db uri found!!",process.env.DB_URI);
    mongoose.connect(process.env.DB_URI, {})
    .then((data) => {
        console.log(`MongoDB connected with Server ${data.connection.host}`);
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
};

module.exports = connectDatabase;
