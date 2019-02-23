import React, { Component } from 'react';
import TableAdvanced from './TableAdvanced.js';

class App extends Component {
  render() {
    return <div>
      <h1 style={ { textAlign: 'center' } }>Poker Leaderboard</h1>
      <div style={ { padding: '25px' } }>
        <TableAdvanced />
      </div>
    </div>;
  }
}

export default App;
