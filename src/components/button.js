import React from 'react';
import Button from '@mui/material/Button';

const MaterialUIButton = ({ color, variant, label, onClick, size, align }) => {
  return (
    <Button
      color={color}
      variant={variant}
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        alignItems: align,
      }}
      size={size}
    >
      {label}
    </Button>
  );
};

export default MaterialUIButton;
