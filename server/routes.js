const Player = require('./player.model');

const NO_ID_ERROR_MESSAGE = {
  errorCode: 'invalidRequestBody',
  message: 'Request body must contain id' };

const NO_PLAYER_ATTRIBUTES_ERROR_MESSAGE = {
  errorCode: 'invalidRequestBody',
  message: 'Request body must contain playerName, country, and amount' };

function serveGetPlayers(playerRoutes) {
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

function serveAddPlayer(playerRoutes) {
  playerRoutes.route('/add').post(function (req, res) {
    const { playerName, country, amount } = req.body;
    if (!playerName || !country || !isValidAmount(amount)){
      res.status(400).json(NO_PLAYER_ATTRIBUTES_ERROR_MESSAGE);
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

function serveRemovePlayer(playerRoutes) {
  playerRoutes.route('/remove').delete(function (req, res) {
    const { id } = req.body;
    if (!id || id === 'undefined'){
      res.status(400).json(NO_ID_ERROR_MESSAGE);
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

function serveUpdatePlayer(playerRoutes) {
  playerRoutes.route('/update').post(function (req, res) {
    const { id, playerName, country, amount } = req.body;
    if (!id || id === 'undefined'){
      res.status(400).json(NO_ID_ERROR_MESSAGE);
    }

    if (!playerName || !country || !isValidAmount(amount)){
      res.status(400).json(NO_PLAYER_ATTRIBUTES_ERROR_MESSAGE);
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

module.exports = { serveGetPlayers, serveAddPlayer, serveRemovePlayer, serveUpdatePlayer };
