import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Modal } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const contentStyle = {
  margin: 0,
  padding: 0,
};

export default function ModalComponent({ title, children, open, close }) {
  return (
    <div>
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography id="modal-modal-title" variant="h3" component="h2" sx={{ color: '#000000' }}>
              {title}
            </Typography>
            <Button onClick={close} title="Close" variant="text" color="color">
              <CloseRounded />
            </Button>
          </Grid>

          <Box container sx={{ mt: 5 }}>
            {children}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
