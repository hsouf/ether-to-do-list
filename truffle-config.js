module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      from: "0x7570C31e902b9339C8D114F19736255aFF91f1aB",
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  live: {
    from: "0x7570C31e902b9339C8D114F19736255aFF91f1aB",
  },
};
