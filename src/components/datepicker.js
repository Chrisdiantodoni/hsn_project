import { Box, TextField } from '@mui/material';
import { DateRangePicker } from '@mui/lab';
import { useState } from 'react';

const DatePicker = () => {
  const [value, setValue] = useState([null, null]);
  console.log(value);
  return (
    <Box width="100%">
      <DateRangePicker
        startText="Check-in"
        endText="Check-out"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        renderInput={(startProps, endProps) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to</Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </Box>
  );
};

export default DatePicker;
