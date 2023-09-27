import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox'; // Import the Radio component
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

export default function CardComponent({ data, add, onClick, selected }) {
  const [hovered, setHovered] = React.useState(false);

  const handleHover = () => {
    setHovered(true);
  };

  const handleUnhover = () => {
    setHovered(false);
  };
  return (
    <Card
      sx={{
        position: 'relative',
        width: '270px',
        height: '370px',
        borderRadius: '20px',
        backgroundColor: '#F6F5F5',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        transform: hovered ? 'translateY(-10px)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      variant="elevation"
    >
      {add ? (
        <Checkbox
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1,
            '& .MuiSvgIcon-root': {
              color: selected ? (theme) => theme.palette.success.dark : (theme) => theme.palette.grey[900],
              fontSize: '30px',
            },
          }}
          icon={<RadioButtonUnchecked />}
          checkedIcon={<CheckCircle />}
          checked={selected}
          onChange={onClick}
        />
      ) : null}

      <CardMedia
        component="img"
        alt="profile-img"
        height="229"
        width="229"
        image={data.image}
        sx={{
          objectFit: 'cover',
          width: '229px',
          height: '229px',
          borderRadius: '20px',
          margin: '20px auto 0', // Add margin-top of 20px
          display: 'block',
        }}
      />

      <CardContent>
        <Typography variant="h5" component="div" textAlign={'center'}>
          {data.id}
        </Typography>
        <Typography variant="h5" component="div" textAlign={'center'}>
          {data.name}
        </Typography>
        <Typography variant="h5" component="div" textAlign={'center'}>
          {data.Position}
        </Typography>
      </CardContent>
    </Card>
  );
}
