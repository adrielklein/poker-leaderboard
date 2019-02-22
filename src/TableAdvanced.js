import * as React from 'react';
import {
    SortingState, EditingState, SummaryState, IntegratedSorting, IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table, TableHeaderRow, TableEditRow, TableEditColumn,
    TableFixedColumns, TableSummaryRow,
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
import { withStyles } from '@material-ui/core/styles';

import { ProgressBarCell } from './progress-bar-cell';
import { HighlightedCell } from './highlighted-cell';
import { CurrencyTypeProvider } from './currency-type-provider';


const possibleValues = {
    country: ['USA', 'Mexico', 'Canada'],
    player: ['playerA', 'playerB', 'playerC'],
    amount: ({ random }) => Math.floor(random() * 10000) + 1000,
};

const styles = theme => ({
    lookupEditCell: {
        paddingTop: theme.spacing.unit * 0.875,
        paddingRight: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
    },
    dialog: {
        width: 'calc(100% - 16px)',
    },
    inputRoot: {
        width: '100%',
    },
});

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
    <IconButton onClick={onExecute} title="Delete row">
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
    player: possibleValues.player,
    country: possibleValues.country,
};

const LookupEditCellBase = ({
                                availableColumnValues, value, onValueChange, classes,
                            }) => (
    <TableCell
        className={classes.lookupEditCell}
    >
        <Select
            value={value}
            onChange={event => onValueChange(event.target.value)}
            input={(
                <Input
                    classes={{ root: classes.inputRoot }}
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
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);

const Cell = (props) => {
    const { column } = props;
    if (column.name === 'discount') {
        return <ProgressBarCell {...props} />;
    }
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

        const data = [
            {
                "id": 0,
                "country": "USA",
                "player": "playerA",
                "amount": 9882,
            },
            {
                "id": 1,
                "country": "Canada",
                "player": "playerC",
                "amount": 6402,
            },
            {
                "id": 2,
                "country": "Mexico",
                "player": "playerC",
                "amount": 5530,
            }];
        this.state = {
            columns: [
                { name: 'player', title: 'Player' },
                { name: 'country', title: 'Country' },
                { name: 'amount', title: 'Winnings' },
            ],
            tableColumnExtensions: [
                { columnName: 'player', width: 180 },
                { columnName: 'country', width: 180 },
                { columnName: 'amount', width: 120, align: 'right' },
            ],
            rows: data,
            sorting: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            currentPage: 0,
            deletingRows: [],
            pageSize: 0,
            pageSizes: [5, 10, 0],
            columnOrder: ['player', 'country', 'amount'],
            currencyColumns: ['amount'],
            leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
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
                player: availableValues.player[0],
                country: availableValues.country[0],
            })),
        });
        this.changeRowChanges = rowChanges => this.setState({ rowChanges });
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
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

    render() {
        const {
            classes,
        } = this.props;
        const {
            rows,
            columns,
            tableColumnExtensions,
            sorting,
            editingRowIds,
            addedRows,
            rowChanges,
            currentPage,
            deletingRows,
            pageSize,
            pageSizes,
            currencyColumns,
            leftFixedColumns,
            totalSummaryItems,
        } = this.state;

        return (
            <Paper>
                <Grid
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
                        columnExtensions={tableColumnExtensions}
                        cellComponent={Cell}
                    />
                    <TableHeaderRow showSortingControls />
                    <TableEditRow
                        cellComponent={EditCell}
                    />
                    <TableEditColumn
                        width={170}
                        showAddCommand={!addedRows.length}
                        showEditCommand
                        showDeleteCommand
                        commandComponent={Command}
                    />
                    <TableSummaryRow />
                    <TableFixedColumns
                        leftColumns={leftFixedColumns}
                    />
                </Grid>

                <Dialog
                    open={!!deletingRows.length}
                    onClose={this.cancelDelete}
                    classes={{ paper: classes.dialog }}
                >
                    <DialogTitle>
                        Delete Row
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the following row?
                        </DialogContentText>
                        <Paper>
                            <Grid
                                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                                columns={columns}
                            >
                                <CurrencyTypeProvider for={currencyColumns} />
                                <Table
                                    columnExtensions={tableColumnExtensions}
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
                </Dialog>
            </Paper>
        );
    }
}

export default withStyles(styles, { name: 'ControlledModeDemo' })(DemoBase);