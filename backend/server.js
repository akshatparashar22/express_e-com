const app = require("./app")
const dotenv = require("dotenv");

//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting Down Server, Uncaught Exception");

    server.close(() => {
        process.exit(1);
    })
})

// config path
dotenv.config({path:'backend/config/config.env'})

const connectDatabase = require("./database/database")
//Connecting to DB
connectDatabase();

const server = app.listen(process.env.PORT,() => {
    console.log(`Server running on localhost http://localhost:${process.env.PORT}`);
})


//Unhandled Promise Rejection
process.on("unhandledRejection",(err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting Down Server, Unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    })
})