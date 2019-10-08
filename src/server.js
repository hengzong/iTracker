// Get the packages we need
import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import secrets from "./config/secrets";

var router = express.Router();

// Create our Express application
var app = express();

// Use environment defined port or 5000
var port = process.env.PORT || 5000;

// Connect to a MongoDB
mongoose.connect(secrets.mongo_connection, { useNewUrlParser: true });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('database connected');
// });

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require("./routes").default(app, router);

// need to put at the last
app.use(express.static("public"));

// Start the server
app.listen(port);
console.log("Server running on port " + port);
