import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import LoadingOverlay from 'react-loading-overlay';
import DataTableDialog from './DataTableDialog';
import DataTable from './DataTable';
import { columns } from '../constants.js';
import axios from 'axios';
import querystring from "querystring";


const countries = ['USA', 'Mexico', 'Canada'];

export default class DataTableContainer extends React.PureComponent {
    async componentDidMount() {
        this.setState({loading : true})
        const response = await axios.get('/api/players');
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
                country: countries[0],
            })),
        });
        this.changeRowChanges = rowChanges => this.setState({ rowChanges });
        this.commitChanges = async ({ added, changed, deleted }) => {
            let { rows } = this.state;
            this.setState({loading : true});
            if (added) {
                const newRow = added[0];
                const { amount, country, playerName } = newRow;
                const response = await axios.post('/api/players/add', querystring.stringify({ amount, country, playerName }), {
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
                await axios.post('/api/players/update', querystring.stringify({ id: _id, amount, country, playerName }), {
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
                await axios.delete('/api/players/remove', { headers: {
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



    render() {
        const {
            rows,
            columns,
            sorting,
            deletingRows,
            rowChanges,
            currencyColumns,
            totalSummaryItems,
            addedRows,
            loading,
        } = this.state;
        const {
            cancelDelete,
            deleteRows,
            changeSorting,
            changeEditingRowIds,
            changeRowChanges,
            changeAddedRows,
            commitChanges,
        } = this;
        return (
          <LoadingOverlay
            active={ loading }
            spinner
            text='Loading players...'
          >
              <Paper>
                  <DataTable
                    rows={ rows }
                    columns={ columns }
                    sorting={ sorting }
                    deletingRows={ deletingRows }
                    addedRows={ addedRows }
                    rowChanges={ rowChanges }
                    currencyColumns={ currencyColumns }
                    totalSummaryItems={ totalSummaryItems }
                    changeSorting={ changeSorting }
                    changeEditingRowIds={ changeEditingRowIds }
                    changeRowChanges={ changeRowChanges }
                    changeAddedRows={ changeAddedRows }
                    commitChanges={ commitChanges }
                  />
                <DataTableDialog
                  rows={ rows }
                  columns={ columns }
                  deletingRows={ deletingRows }
                  currencyColumns={ currencyColumns }
                  cancelDelete={ cancelDelete }
                  deleteRows={ deleteRows }
                />
            </Paper>
          </LoadingOverlay>
        );
    }
}

