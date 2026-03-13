import { useState, useCallback } from 'react';

const BASE_CHAIN_ID = '0x2105'; // 8453 in hex

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  // Lazy check — only touch window.ethereum when user triggers an action,
  // never on render. This prevents browser "wants to access other apps" prompts.
  const getEthereum = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  }, []);

  const connect = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const chainId = await eth.request({ method: 'eth_chainId' });
        setWrongNetwork(chainId !== BASE_CHAIN_ID);
      }
    } catch (e) {
      console.error('Wallet connection failed', e);
    }
  }, [getEthereum]);

  const switchToBase = useCallback(async () => {
    const eth = getEthereum();
    if (!eth) return;
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }],
      });
      setWrongNetwork(false);
    } catch (e: any) {
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
  }, [getEthereum]);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return { address, shortAddress, wrongNetwork, connect, switchToBase };
}
