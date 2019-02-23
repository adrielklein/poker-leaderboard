import React, { Component } from 'react';
import DataTable from './DataTable.js';
import DummyTable from './DummyTable.js';

class App extends Component {
  render() {
    return <div>
      <h1 style={ { textAlign: 'center' } }>Poker Leaderboard</h1>
      <div style={ { padding: '45px' } }>
        <DataTable />
        {/*<DummyTable />*/}
      </div>
    </div>;
  }
}

export default App;
