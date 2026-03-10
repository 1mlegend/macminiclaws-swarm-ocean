export const networkConfig = {
  chainId: Number(process.env.CHAIN_ID) || 84532,
  rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
  nodeRegistryAddress: process.env.NODE_REGISTRY_ADDRESS || '', // to be filled after deploy
};

export const socialLinks = {
  x: 'https://x.com/macminiclaws',
  moltbook: 'https://www.moltbook.com/u/macminiclaw',
};
