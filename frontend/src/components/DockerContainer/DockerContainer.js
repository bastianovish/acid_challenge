import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import DockerContainerName from './DockerContainerName';
import DockerContainerCPU from './DockerContainerCPU';
import DockerContainerMemory from './DockerContainerMemory';
import DockerContainerNetwork from './DockerContainerNetwork';
import DockerContainerDisk from './DockerContainerDisk';

const DockerContainer = ({ container }) => {
  const {
    name,
    cpu_usage,
    memory_usage,
    memory_limit,
    network_i,
    network_o,
    block_read,
    block_write,
    pids
  } = container;
  return (
    <Card>
      <CardContent>
        <Grid container alignItems='center' justify='center'>
          <Grid item xs={12} md={12}>
            <DockerContainerName name={name} pids={pids} />
          </Grid>
          <Grid item xs={12} md={12}>
            <div style={{ marginTop: 10, marginBottom: 15 }}>
              <Divider />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={5} alignItems='center' justify='center'>
          <Grid item xs={6} md={6}>
            <DockerContainerCPU cpu_usage={cpu_usage} />
          </Grid>
          <Grid item xs={6} md={6}>
            <DockerContainerMemory
              memory_usage={memory_usage}
              memory_limit={memory_limit}
            />
          </Grid>
        </Grid>
        <Grid container spacing={5} alignItems='center' justify='center'>
          <Grid item xs={6} md={6}>
            <DockerContainerNetwork
              network_i={network_i}
              network_o={network_o}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <DockerContainerDisk
              block_read={block_read}
              block_write={block_write}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DockerContainer;
