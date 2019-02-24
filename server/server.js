const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const playerRoutes = express.Router();
const path = require('path');
const { serveGetPlayers, serveAddPlayer, serveRemovePlayer, serveUpdatePlayer } = require('./routes');

function setUpServer() {
  app.use(express.static(path.join(__dirname, '..' ,'build')));
  app.use(cors());
  app.use(bodyParser.urlencoded());
  app.use('/api/players', playerRoutes);
  mongoose.connect('mongodb://adrielDb:fl8tIsGr8t@ds149365.mlab.com:49365/poker-tournament', { useNewUrlParser: true });
  mongoose.set('debug', true);

  const connection = mongoose.connection;
  connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
  });

  app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
  });
}

function setUpRoutes() {
  serveGetPlayers(playerRoutes);
  serveAddPlayer(playerRoutes);
  serveRemovePlayer(playerRoutes);
  serveUpdatePlayer(playerRoutes);
  console.log('Routes set up successfully')
}

setUpServer();


setUpRoutes();
