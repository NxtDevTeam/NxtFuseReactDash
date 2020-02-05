import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function StateTextFields() {
  const classes = useStyles();
  const [name, setName] = React.useState('Cat in the Hat');
  const handleChange = event => {
    setName(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField id="standard-name" label="Name" value={name} onChange={handleChange} />
        <TextField id="standard-uncontrolled" label="Uncontrolled" defaultValue="foo" />
      </div>
      <div>
        <TextField
          id="filled-name"
          label="Name"
          value={name}
          onChange={handleChange}
          variant="filled"
        />
        <TextField
          id="filled-uncontrolled"
          label="Uncontrolled"
          defaultValue="foo"
          variant="filled"
        />
      </div>
      <div>
        <TextField
          id="outlined-name"
          label="Name"
          value={name}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          id="outlined-uncontrolled"
          label="Uncontrolled"
          defaultValue="foo"
          variant="outlined"
        />
      </div>
    </form>
  );
}