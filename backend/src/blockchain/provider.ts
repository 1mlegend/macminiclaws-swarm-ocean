import { ethers } from 'ethers';
import { networkConfig } from './config';

const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

export function getProvider(): ethers.JsonRpcProvider {
  return provider;
}

export function getSigner(): ethers.Wallet {
  const privateKey = process.env.BACKEND_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('BACKEND_PRIVATE_KEY environment variable is not set');
  }
  return new ethers.Wallet(privateKey, provider);
}

export { provider };
