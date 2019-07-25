import React from 'react';
import ContainerList from '../components/ContainerList';
import Container from '@material-ui/core/Container';
import 'typeface-roboto';
import useCable from '../hooks/useCable.js';

const Dashboard = () => {
  useCable();
  return (
    <Container>
      <ContainerList />
    </Container>
  );
};

export default Dashboard;
