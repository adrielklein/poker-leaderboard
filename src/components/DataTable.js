import * as React from 'react';
import {
    SortingState, EditingState, SummaryState, IntegratedSorting, IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table, TableHeaderRow, TableEditRow, TableEditColumn, TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import { CurrencyTypeProvider } from './CurrencyTypeProvider.js';
import { AddButton, EditButton, DeleteButton, CommitButton, CancelButton } from './Button.js';
import { Cell, EditCell } from './Cell.js';


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


const getRowId = row => row._id;

export default class DataTable extends React.PureComponent {
    render() {
        const {
            rows,
            columns,
            sorting,
            editingRowIds,
            addedRows,
            rowChanges,
            currencyColumns,
            totalSummaryItems,
            changeSorting,
            changeEditingRowIds,
            changeRowChanges,
            changeAddedRows,
            commitChanges,
        } = this.props;
        return <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
            <SortingState
              sorting={sorting}
              onSortingChange={changeSorting}
            />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={changeRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
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
}

