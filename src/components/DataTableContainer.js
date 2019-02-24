import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import LoadingOverlay from 'react-loading-overlay';
import DataTableDialog from './DataTableDialog';
import DataTable from './DataTable';
import axios from 'axios';
import querystring from "querystring";
import { COUNTRIES, COLUMNS, ENDPOINTS, COLUMN_ORDER, REQUEST_HEADERS} from '../constants.js';


export default class DataTableContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: COLUMNS,
            rows: [],
            sorting: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
            deletingRows: [],
            columnOrder: COLUMN_ORDER,
            currencyColumns: ['amount'],
            totalSummaryItems: [
                { columnName: 'amount', type: 'sum' },
            ],
        };
    }

    async componentDidMount() {
        this.setState({loading : true});
        const response = await axios.get(ENDPOINTS.GET_PLAYERS);
        this.setState({rows : response.data, loading: false });
    }

    getStateDeletingRows = () => {
        const { deletingRows } = this.state;
        return deletingRows;
    };

    getStateRows = () => {
        const { rows } = this.state;
        return rows;
    };

    changeSorting = sorting => this.setState({ sorting });

    changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });

    changeAddedRows = addedRows => this.setState({
        addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
            amount: 0,
            playerName: '',
            country: COUNTRIES[0],
        })),
    });

    changeRowChanges = rowChanges => this.setState({ rowChanges });

    commitChanges = async ({ added, changed, deleted }) => {
        let { rows } = this.state;
        this.setState({loading : true});
        if (added) {
            const newRow = added[0];
            const { amount, country, playerName } = newRow;
            const response = await axios.post(ENDPOINTS.ADD_PLAYER,
              querystring.stringify({ amount, country, playerName }),
              { headers: REQUEST_HEADERS });
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
            await axios.post(ENDPOINTS.UPDATE_PLAYER, querystring.stringify({ id: _id, amount, country, playerName }), {headers: REQUEST_HEADERS});
            rows = rows.map(row => (changed[row._id] ? newRow : row));
        }
        this.setState({ rows, deletingRows: deleted || this.getStateDeletingRows() });
        this.setState({loading : false});
    }

    cancelDelete = () => this.setState({ deletingRows: [] });

    deleteRows = async () => {
        const rows = this.getStateRows().slice();
        await this.getStateDeletingRows().forEach(async (rowId) => {
            this.setState({loading : true});
            await axios.delete(ENDPOINTS.REMOVE_PLAYER, { headers: REQUEST_HEADERS, data: querystring.stringify({ id: rowId }) });
            this.setState({ loading: false });
            const index = rows.findIndex(row => row._id === rowId);
            if (index > -1) {
                rows.splice(index, 1);
            }
            this.setState({ rows, deletingRows: [] })
        });
    };

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

