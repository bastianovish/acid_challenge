import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';

export default ({
  containersLength,
  filter,
  filterHandler,
  lastUpdate,
  fetched
}) => {
  const date = new Date(parseInt(lastUpdate) * 1000);
  return (
    <Grid container style={{ marginTop: 40, marginBottom: 30 }}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <Typography variant='button'>
          Contenedores corriendo: {containersLength}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <Typography variant='button'>Orden: </Typography>
        <ButtonGroup color='primary' aria-label='Outlined primary button group'>
          <Button
            disabled={filter === 'name'}
            onClick={() => filterHandler('name')}
          >
            Nombre
          </Button>
          <Button
            disabled={filter === 'cpu_usage'}
            onClick={() => filterHandler('cpu_usage')}
          >
            CPU
          </Button>
          <Button
            disabled={filter === 'memory_usage'}
            onClick={() => filterHandler('memory_usage')}
          >
            Memoria
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        {(lastUpdate && lastUpdate > 0 && (
          <Typography variant='button'>
            Ultima Actualización:
            {`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
          </Typography>
        )) ||
          (fetched && (
            <Typography variant='button'>Esperando actualización</Typography>
          ))}
      </Grid>
    </Grid>
  );
};
