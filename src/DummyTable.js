import * as React from 'react';
import { Grid, Table, TableHeaderRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import {
    EditingState,
} from '@devexpress/dx-react-grid';
import Paper from '@material-ui/core/Paper';
import { columns, rows } from './data.js'



class DummyTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns,
            rows,
            sorting: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            deletingRows: [],
            columnOrder: ['player', 'country', 'amount'],
        };
    }
    editRow(){
        console.log('hello world')
    }

    getGrid(){
        const {
            rows,
            columns,
        } = this.state;
        return <Grid
          rows={rows}
          columns={columns}
        >
            <Table/>
            <TableHeaderRow />
            <EditingState
              // editingRowIds={editingRowIds}
              // onEditingRowIdsChange={this.changeEditingRowIds}
              // rowChanges={rowChanges}
              // onRowChangesChange={this.changeRowChanges}
              // addedRows={addedRows}
              // onAddedRowsChange={this.changeAddedRows}
              onCommitChanges={this.editRow}
            />
            <TableEditColumn  showDeleteCommand />
        </Grid>;
    }

    render() {
        return (
            <Paper>
                { this.getGrid() }
            </Paper>
        );
    }
}

export default DummyTable;
