import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const Container = ({ container }) => {
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
      <CardHeader title={name} titleTypographyProps={{ align: 'center' }} />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Uso de CPU</TableCell>
              <TableCell align='center'>Procesos</TableCell>
              <TableCell align='center'>Memoria usada/ Memoria max</TableCell>
              <TableCell align='center'>I/O Red</TableCell>
              <TableCell align='center'>I/O Disco</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align='center'>{cpu_usage}</TableCell>
              <TableCell align='center'>{pids}</TableCell>
              <TableCell align='center'>
                {memory_usage} / {memory_limit}
              </TableCell>
              <TableCell align='center'>
                {network_i} / {network_o}
              </TableCell>
              <TableCell align='center'>
                {block_read} / {block_write}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Container;
