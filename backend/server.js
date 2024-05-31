const app = require("./app")
const dotenv = require("dotenv");

// config path
dotenv.config({path:'backend/config/config.env'})

const connectDatabase = require("./database/database")
//Connecting to DB
connectDatabase();

app.listen(process.env.PORT,() => {
    console.log(`Server running on localhost http://localhost:${process.env.PORT}`);
})