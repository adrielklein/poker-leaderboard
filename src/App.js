import React, { Component } from 'react';
import DataTable from './DataTable.js';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  render() {
    return <div style={ { padding: '20px' } }>
      <Typography variant="h3" align="center">
        Poker Leaderboard
      </Typography>
      <div style={ { padding: '45px', paddingTop: '20px' } }>
        <DataTable />
      </div>
    </div>;
  }
}

export default App;
