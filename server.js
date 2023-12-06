const express = require("express");

const mongoose = require("mongoose");

require("dotenv").config();


const api = require("./routes/api");

const app = express();

app.use(express.json());

app.use("/api", api);

app.use((error, req, res, next) => {
  console.log(error.statusCode);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});
// const childPython = spawn('python', [ 'Get_10_Recommendation.py']);


const mongodb_URI = `mongodb+srv://saif:${process.env.MONGODB_PASSWORD}@cluster0.6zbtdaz.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
//connecting  to the database
mongoose
  .connect(mongodb_URI)
  .then((result) => {
    //when the connection is successful listen to the port
    app.listen(process.env.PORT || 8080, function () {
      console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
      );
    });
  })
  .catch((err) => console.log(err));
