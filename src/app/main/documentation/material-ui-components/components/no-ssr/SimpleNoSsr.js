import Box from '@material-ui/core/Box';
import NoSsr from '@material-ui/core/NoSsr';
import React from 'react';

export default function SimpleNoSsr() {
  return (
    <div>
      <Box p={2} bgcolor="primary.main" color="primary.contrastText">
        Server and Client
      </Box>
      <NoSsr>
        <Box p={2} bgcolor="secondary.main" color="primary.contrastText">
          Client only
        </Box>
      </NoSsr>
    </div>
  );
}