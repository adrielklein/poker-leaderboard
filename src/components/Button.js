import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

export const AddButton = ({ onExecute }) => (
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

export const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit player">
    <EditIcon />
  </IconButton>
);

export const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Remove player">
    <DeleteIcon />
  </IconButton>
);

export const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

export const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);
