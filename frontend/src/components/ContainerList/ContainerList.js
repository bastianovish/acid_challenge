import React, { useEffect, useContext } from 'react';
import DockerContainer from '../DockerContainer';
import Grid from '@material-ui/core/Grid';
import { StoreContext } from '../../store';
import ApiService from '../../services/ApiService';
import { addContainers, setFilter } from '../../reducers/containerReducer';
import ContainerListHeader from './ContainerListHeader';

const ContainerList = () => {
  const [store, dispatch] = useContext(StoreContext);

  useEffect(() => {
    const fetchContainers = async () => {
      const data = await ApiService.fetchContainers();
      if (data.status === 'success') {
        dispatch(addContainers(data.containers));
      }
    };
    if (
      store.container.items.length === 0 &&
      store.cable.connection === 'disconnected'
    ) {
      fetchContainers();
    }
  }, [store, dispatch]);

  const sortContainersBy = filter => {
    const c = store.container.items.sort((a, b) =>
      a[filter] > b[filter] ? -1 : 1
    );
    return filter === 'name' ? c.reverse() : c;
  };
  const c = sortContainersBy(store.container.currentFilter).map(
    (container, index) => {
      return (
        <Grid item key={index} xs={12} md={6} lg={6}>
          <DockerContainer container={container} />
        </Grid>
      );
    }
  );
  return (
    <>
      <ContainerListHeader
        containersLength={c.length}
        filter={store.container.currentFilter}
        filterHandler={f => dispatch(setFilter(f))}
        lastUpdate={store.container.lastUpdate}
        fetched={store.container.fetched}
      />
      <Grid container spacing={5} alignItems='flex-end'>
        {c}
      </Grid>
    </>
  );
};

export default ContainerList;
