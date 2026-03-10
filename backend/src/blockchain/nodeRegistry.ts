import { ethers } from 'ethers';
import { provider, getSigner } from './provider';
import { networkConfig } from './config';

const NODE_REGISTRY_ABI = [
  'function registerNode(string nodeId, string hardwareSpec)',
  'function getNode(address node) view returns (string nodeId, string hardwareSpec, bool active, uint256 registeredAt)',
  'function getNodeCount() view returns (uint256)',
  'function isNodeRegistered(address node) view returns (bool)',
];

export function getNodeRegistryContract(
  signerOrProvider?: ethers.Signer | ethers.Provider,
): ethers.Contract {
  return new ethers.Contract(
    networkConfig.nodeRegistryAddress,
    NODE_REGISTRY_ABI,
    signerOrProvider || provider,
  );
}

export async function registerNodeOnChain(
  nodeId: string,
  hardwareSpec: string,
): Promise<ethers.TransactionResponse> {
  const contract = getNodeRegistryContract(getSigner());
  return contract.registerNode(nodeId, hardwareSpec);
}

export async function getNodeFromChain(address: string) {
  const contract = getNodeRegistryContract();
  const [nodeId, hardwareSpec, active, registeredAt] =
    await contract.getNode(address);
  return {
    nodeId: nodeId as string,
    hardwareSpec: hardwareSpec as string,
    active: active as boolean,
    registeredAt: BigInt(registeredAt),
  };
}

export async function isNodeRegisteredOnChain(
  address: string,
): Promise<boolean> {
  const contract = getNodeRegistryContract();
  return contract.isNodeRegistered(address);
}
