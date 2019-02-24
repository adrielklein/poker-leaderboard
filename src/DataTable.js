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
import { rows, columns } from './data.js'

import { HighlightedCell } from './highlighted-cell';
import { CurrencyTypeProvider } from './currency-type-provider';


const possibleValues = {
    country: ['USA', 'Mexico', 'Canada'],
};


const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <Button
            color="primary"
            onClick={onExecute}
            title="Create new row"
        >
            New
        </Button>
    </div>
);

const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit row">
        <EditIcon />
    </IconButton>
);

const DeleteButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Remove Player">
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

const LookupEditCellBase = ({
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
export const LookupEditCell = LookupEditCellBase;

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

const getRowId = row => row.id;

class DemoBase extends React.PureComponent {
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
        this.commitChanges = ({ added, changed, deleted }) => {
            let { rows } = this.state;
            if (added) {
                const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
                rows = [
                    ...rows,
                    ...added.map((row, index) => ({
                        id: startingAddedId + index,
                        ...row,
                    })),
                ];
            }
            if (changed) {
                rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            }
            this.setState({ rows, deletingRows: deleted || getStateDeletingRows() });
        };
        this.cancelDelete = () => this.setState({ deletingRows: [] });
        this.deleteRows = () => {
            const rows = getStateRows().slice();
            getStateDeletingRows().forEach((rowId) => {
                const index = rows.findIndex(row => row.id === rowId);
                if (index > -1) {
                    rows.splice(index, 1);
                }
            });
            this.setState({ rows, deletingRows: [] });
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
                      rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
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
        return (
            <Paper>
                { this.getGrid() }
                { this.getDialog() }
            </Paper>
        );
    }
}

export default DemoBase;
