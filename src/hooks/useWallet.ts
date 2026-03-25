import { useState, useCallback } from 'react';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const getPhantom = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
      return (window as any).solana;
    }
    return null;
  }, []);

  const connect = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    try {
      const resp = await phantom.connect();
      const pubKey = resp.publicKey.toString();
      setAddress(pubKey);
    } catch (e) {
      console.error('Wallet connection failed', e);
    }
  }, [getPhantom]);

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : null;

  return { address, shortAddress, connect };
}