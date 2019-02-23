import React, { Component } from 'react';
import DataTable from './DataTable.js';
import Typography from '@material-ui/core/Typography';
import DummyTable from './DummyTable.js';

class App extends Component {
  render() {
    return <div>
      <Typography variant="h3" align="center">
        🃏 Poker Leaderboard 🃏
      </Typography>
      <div style={ { padding: '45px', paddingTop: '20px' } }>
        <DataTable />
        {/*<DummyTable />*/}
      </div>
    </div>;
  }
}

export default App;
