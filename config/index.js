const mongoose = require("mongoose");
const ConnectDB = async () => {
  // Connect to the MongoDB cluster
  const option = {
    dbName: "movies",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("connect success");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = ConnectDB;
