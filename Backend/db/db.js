const mongoose = require("mongoose");

const connectToDb = async () => {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => console.log(error));
}

module.exports = connectToDb;