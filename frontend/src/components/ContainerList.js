import React, { useState, useContext } from 'react';
import DockerContainer from './DockerContainer';
import Grid from '@material-ui/core/Grid';
import { Context } from '../store';

const ContainerList = () => {
  const { store, dispatch } = useContext(Context);

  const c = store.containers.map((container, index) => {
    console.log('container', container);
    return (
      <Grid item key={index} xs={12} md={8}>
        <DockerContainer container={container} />
      </Grid>
    );
  });
  return (
    <Grid container spacing={5} alignItems='flex-end'>
      {c}
    </Grid>
  );
};

export default ContainerList;
