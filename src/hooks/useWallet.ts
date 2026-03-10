import { useState, useCallback } from 'react';

const BASE_CHAIN_ID = '0x2105'; // 8453 in hex

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const hasEthereum = typeof window !== 'undefined' && !!(window as any).ethereum;

  const connect = useCallback(async () => {
    if (!hasEthereum) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    const eth = (window as any).ethereum;
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        // Check chain
        const chainId = await eth.request({ method: 'eth_chainId' });
        setWrongNetwork(chainId !== BASE_CHAIN_ID);
      }
    } catch (e) {
      console.error('Wallet connection failed', e);
    }
  }, [hasEthereum]);

  const switchToBase = useCallback(async () => {
    if (!hasEthereum) return;
    const eth = (window as any).ethereum;
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }],
      });
      setWrongNetwork(false);
    } catch (e: any) {
      // Chain not added — add it
      if (e.code === 4902) {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_CHAIN_ID,
            chainName: 'Base',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
        setWrongNetwork(false);
      }
    }
  }, [hasEthereum]);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return { address, shortAddress, wrongNetwork, hasEthereum, connect, switchToBase };
}
