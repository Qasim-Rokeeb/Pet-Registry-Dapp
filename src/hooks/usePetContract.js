import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, PET_REGISTRY_ABI } from '../utils/constants';

export default function usePetContract(account) {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connect = async () => {
      if (!window.ethereum || !account) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const instance = new ethers.Contract(CONTRACT_ADDRESS, PET_REGISTRY_ABI, signer);
      setContract(instance);
    };

    connect();
  }, [account]);

  return contract;
}
