import * as React from 'react';
import { Grid, Table, TableHeaderRow, } from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { CurrencyTypeProvider } from './CurrencyTypeProvider';
import { Cell } from './Cell.js';


export default class DataTableDialog extends React.PureComponent {

    render(){
        const {
            rows,
            columns,
            deletingRows,
            currencyColumns,
            cancelDelete,
            deleteRows,
        } = this.props;
        return <Dialog
          open={!!deletingRows.length}
          onClose={cancelDelete}
        >
            <DialogTitle>
                Remove Player
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to remove the following player?
                </DialogContentText>
                <Paper>
                    <Grid
                      rows={rows.filter(row => deletingRows.indexOf(row._id) > -1)}
                      columns={columns}
                    >
                        <CurrencyTypeProvider for={currencyColumns} />
                        <Table
                          cellComponent={Cell}
                        />
                        <TableHeaderRow />
                    </Grid>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelDelete} color="primary">
                    Cancel
                </Button>
                <Button onClick={deleteRows} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>;
    }
}
