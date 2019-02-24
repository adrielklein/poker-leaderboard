const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Player = require('./player.model');
const PORT = process.env.PORT || 4000;
const playerRoutes = express.Router();
const path = require('path');

function setUpServer() {
  app.use(cors());
  app.use(express.static(path.join(__dirname, '../build')));
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

function serveGetPlayers() {
  playerRoutes.route('/').get(async function (req, res) {
    Player.find(function (err, players) {
      if (err) {
        console.log(err);
      } else {
        res.json(players);
      }
    });
  });
}

function isValidAmount(amount){
  return !isNaN(amount);
}

function serveAddPlayer() {
  playerRoutes.route('/add').post(function (req, res) {
    const { playerName, country, amount } = req.body;
    if (!playerName || !country || !isValidAmount(amount)){
      res.status(400).json({
        errorCode: 'invalidRequestBody',
        message: 'Request body must contain playerName, country, and amount' });
    }
    const player = new Player({ playerName, country, amount });
    player.save()
      .then(player => {
        res.status(200).json({message: 'player added successfully', id: player._id });
      })
      .catch(err => {
        res.status(400).send('adding new player failed');
      });
  });
}

function serveRemovePlayer() {
  playerRoutes.route('/remove').delete(function (req, res) {
    const { id } = req.body;
    if (!id || id === 'undefined'){
      res.status(400).json({
        errorCode: 'invalidRequestBody',
        message: 'Request body must contain id' });
    }
    Player.findByIdAndRemove(id, function (err) {
      if (err) {
        res.status(400).json({message: 'removing player failed'});
        console.log(err);
      } else {
        res.json({message: 'player removed successfully'})
      }
    });

  });
}

function serveUpdatePlayer() {
  playerRoutes.route('/update').post(function (req, res) {
    const { id, playerName, country, amount } = req.body;
    if (!id || id === 'undefined'){
      res.status(400).json({
        errorCode: 'invalidRequestBody',
        message: 'Request body must contain id' });
    }

    if (!playerName || !country || !isValidAmount(amount)){
      res.status(400).json({
        errorCode: 'invalidRequestBody',
        message: 'Request body must contain playerName, country, and amount' });
    }

    Player.findByIdAndUpdate(id, { playerName, country, amount }, { new: false }, function (err) {
      if (err) {
        res.status(400).json({message: 'updating player failed'});
        console.log(err);
      } else {
        res.json({message: 'player updated successfully'})
      }
    });

  });
}

function setUpRoutes() {
  serveGetPlayers();
  serveAddPlayer();
  serveRemovePlayer();
  serveUpdatePlayer();
  console.log('Routes set up successfully')
}

setUpServer();


setUpRoutes();
