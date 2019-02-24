import * as React from 'react';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import {
  Table, TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import { countries } from '../constants.js';

const getColor = (amount) => {
  if (amount < 3000) {
    return '#F44336';
  }
  if (amount < 5000) {
    return '#FFC107';
  }
  if (amount < 8000) {
    return '#FF5722';
  }
  return '#009688';
};

export const HighlightedCell = ({
                                  tableColumn, value, classes, children, style,
                                }) => (
  <TableCell
    style={{
      color: getColor(value),
      textAlign: tableColumn.align,
      ...style,
    }}
  >
    {children}
  </TableCell>
);

export const LookupEditCell = ({
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

export const Cell = (props) => {
  const { column } = props;
  if (column.name === 'amount') {
    return <HighlightedCell {...props} />;
  }
  return <Table.Cell {...props} />;
};

export const EditCell = (props) => {
  const { column } = props;
  if (column.name === 'country') {
    return <LookupEditCell {...props} availableColumnValues={countries} />;
  }
  return <TableEditRow.Cell {...props} />;
};
