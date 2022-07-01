const mongoose = require("mongoose");

const connection = async () => {
  await mongoose.connect(process.env.DB_URL);
};

connection()
  .then(() => console.log("db connection successful"))
  .catch((e) => console.log({ Error: e.message }));
