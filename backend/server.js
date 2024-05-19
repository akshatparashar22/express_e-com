const app = require("./app")
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({path:'backend/config/config.env'})

app.listen(process.env.PORT,() => {
    console.log(`Server running on localhost http://localhost:${process.env.PORT}`);
})