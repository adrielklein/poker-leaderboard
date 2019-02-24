const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Player = new Schema({
  id: {
    type: String
  },
  playerName: {
    type: String
  },
  country: {
    type: String
  },
  amount: {
    type: Number
  }
});
module.exports = mongoose.model('Player', Player);
