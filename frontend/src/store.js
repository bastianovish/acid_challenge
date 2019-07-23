import React from 'react';

export const initialState = {
  connection: {
    status: 'disconnected',
    cable: null
  },
  containers: [
    {
      name: '/acid_challenge_backend_1',
      cpu_usage: 0.010439294710327457,
      memory_usage: 67.84375,
      memory_limit: 1.9519309997558594,
      network_i: 7.2158203125,
      network_o: 105.177734375,
      block_read: 0,
      block_write: 0,
      pids: 16
    },
    {
      name: '/acid_challenge_redis_1',
      cpu_usage: 0.34495788944723615,
      memory_usage: 1.63671875,
      memory_limit: 1.9519309997558594,
      network_i: 1.7578125,
      network_o: 0,
      block_read: 0,
      block_write: 0,
      pids: 4
    }
  ]
};

export const Context = React.createContext();
