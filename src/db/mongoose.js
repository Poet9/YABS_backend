const mongoose = require("mongoose");
mongoose
  .connect(`${process.env.DB_URL}/YABS_DB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  })
  .then(() => console.log("db connection successful"))
  .catch((e) => console.log({ Error: e.message }));
