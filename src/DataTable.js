import * as React from 'react';
import {
    SortingState, EditingState, SummaryState, IntegratedSorting, IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table, TableHeaderRow, TableEditRow, TableEditColumn, TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { columns } from './data.js'
import { HighlightedCell } from './highlighted-cell';
import { CurrencyTypeProvider } from './currency-type-provider';
import LoadingOverlay from 'react-loading-overlay';
import querystring from 'querystring';
import axios from 'axios';


const possibleValues = {
    country: ['USA', 'Mexico', 'Canada'],
};


const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new player"
        >
            New
        </Button>
    </div>
);

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit player">
        <EditIcon />
    </IconButton>
);

const DeleteButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Remove player">
        <DeleteIcon />
    </IconButton>
);

const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Save changes">
        <SaveIcon />
    </IconButton>
);

const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
        <CancelIcon />
    </IconButton>
);

const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
        <CommandButton
            onExecute={onExecute}
        />
    );
};

const availableValues = {
    country: possibleValues.country,
};

const LookupEditCell = ({
                                availableColumnValues, value, onValueChange,
                            }) => (
    <TableCell
    >
        <Select
            value={value}
            onChange={event => onValueChange(event.target.value)}
            input={(
                <Input
                />
            )}
        >
            {availableColumnValues.map(item => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </Select>
    </TableCell>
);

const Cell = (props) => {
    const { column } = props;
    if (column.name === 'amount') {
        return <HighlightedCell {...props} />;
    }
    return <Table.Cell {...props} />;
};

const EditCell = (props) => {
    const { column } = props;
    const availableColumnValues = availableValues[column.name];
    if (availableColumnValues) {
        return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
    }
    return <TableEditRow.Cell {...props} />;
};

const getRowId = row => row._id;

class DataTable extends React.PureComponent {

    async componentDidMount() {
        this.setState({loading : true})
        const response = await axios.get('http://localhost:4000/api/players');
        this.setState({rows : response.data, loading: false })
    }

    constructor(props) {
        super(props);
        this.state = {
            columns,
            rows: [],
            sorting: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            deletingRows: [],
            columnOrder: ['playerName', 'country', 'amount'],
            currencyColumns: ['amount'],
            totalSummaryItems: [
                { columnName: 'amount', type: 'sum' },
            ],
        };
        const getStateDeletingRows = () => {
            const { deletingRows } = this.state;
            return deletingRows;
        };
        const getStateRows = () => {
            const { rows } = this.state;
            return rows;
        };

        this.changeSorting = sorting => this.setState({ sorting });
        this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
        this.changeAddedRows = addedRows => this.setState({
            addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
                amount: 0,
                playerName: '',
                country: availableValues.country[0],
            })),
        });
        this.changeRowChanges = rowChanges => this.setState({ rowChanges });
        this.commitChanges = async ({ added, changed, deleted }) => {
            let { rows } = this.state;
            this.setState({loading : true});
            if (added) {
                const newRow = added[0];
                const { amount, country, playerName } = newRow;
                const response = await axios.post('http://localhost:4000/api/players/add', querystring.stringify({ amount, country, playerName }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded' }
                });
                rows = [
                    { _id : response.data.id, ...newRow},
                    ...rows,
                ];
            }
            if (changed) {
                const changedRowId = Object.keys(changed)[0];
                const oldRow = rows.find(row => row._id === changedRowId);
                const newRow = { ...oldRow , ...changed[changedRowId] };
                const { _id, amount, country, playerName } = newRow;
                await axios.post('http://localhost:4000/api/players/update', querystring.stringify({ id: _id, amount, country, playerName }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded' }
                });
                rows = rows.map(row => (changed[row._id] ? newRow : row));
            }
            this.setState({ rows, deletingRows: deleted || getStateDeletingRows() });
            this.setState({loading : false});
        };
        this.cancelDelete = () => this.setState({ deletingRows: [] });
        this.deleteRows = async () => {
            const rows = getStateRows().slice();
            await getStateDeletingRows().forEach(async (rowId) => {
                this.setState({loading : true});
                await axios.delete('http://localhost:4000/api/players/remove', { headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }, data: querystring.stringify({ id: rowId }) });
                this.setState({ loading: false });
                const index = rows.findIndex(row => row._id === rowId);
                if (index > -1) {
                    rows.splice(index, 1);
                }
                this.setState({ rows, deletingRows: [] })
            });
        };
    }

    getDialog(){
        const {
            rows,
            columns,
            deletingRows,
            currencyColumns,
        } = this.state;
        return <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
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
                <Button onClick={this.cancelDelete} color="primary">
                    Cancel
                </Button>
                <Button onClick={this.deleteRows} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>;
    }

    getGrid(){
        const {
            rows,
            columns,
            sorting,
            editingRowIds,
            addedRows,
            rowChanges,
            currencyColumns,
            totalSummaryItems,
        } = this.state;
        return <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
            <SortingState
              sorting={sorting}
              onSortingChange={this.changeSorting}
            />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={this.changeAddedRows}
              onCommitChanges={this.commitChanges}
            />
            <SummaryState
              totalItems={totalSummaryItems}
            />

            <IntegratedSorting />
            <IntegratedSummary />

            <CurrencyTypeProvider for={currencyColumns} />

            <Table
              cellComponent={Cell}
            />
            <TableHeaderRow showSortingControls />
            <TableEditRow
              cellComponent={EditCell}
            />
            <TableEditColumn
              showAddCommand={!addedRows.length}
              showEditCommand
              showDeleteCommand
              commandComponent={Command}
            />
            <TableSummaryRow />
        </Grid>;
    }

    render() {
        const { loading } = this.state;
        return (
          <LoadingOverlay
            active={ loading }
            spinner
            text='Loading players...'
          >
            <Paper>
                { this.getGrid() }
                { this.getDialog() }
            </Paper>
          </LoadingOverlay>
        );
    }
}

export default DataTable;
