import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import RegisterPetModal from './components/RegisterPetModal';
import PetCard from './components/PetCard';
import SearchSection from './components/SearchSection';
import { PET_REGISTRY_ABI, CONTRACT_ADDRESS } from './utils/constants';

export default function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', breed: '', birthDate: '', imageUrl: '', description: ''
  });

  // Connect wallet and load contract
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const petContract = new ethers.Contract(CONTRACT_ADDRESS, PET_REGISTRY_ABI, signer);
        setContract(petContract);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  // Load pets owned by connected user
  const loadMyPets = async () => {
    if (!contract || !account) return;
    try {
      setLoading(true);
      const petIds = await contract.getOwnerPets(account);
      const pets = await Promise.all(
        petIds.map(async (id) => {
          const pet = await contract.getPet(id);
          return {
            id: id.toString(),
            name: pet.name,
            breed: pet.breed,
            birthDate: new Date(pet.birthDate.toNumber() * 1000),
            imageUrl: pet.imageUrl,
            description: pet.description,
            owner: pet.owner,
            registrationDate: new Date(pet.registrationDate.toNumber() * 1000),
            isActive: pet.isActive
          };
        })
      );
      setMyPets(pets);
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerPet = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const birthDate = Math.floor(new Date(formData.birthDate).getTime() / 1000);
      const tx = await contract.registerPet(
        formData.name,
        formData.breed,
        birthDate,
        formData.imageUrl,
        formData.description
      );
      await tx.wait();
      setFormData({ name: '', breed: '', birthDate: '', imageUrl: '', description: '' });
      setShowRegisterForm(false);
      await loadMyPets();
      alert('Pet registered successfully!');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchPet = async () => {
    if (!contract || !searchId) return;
    try {
      setLoading(true);
      const pet = await contract.getPet(searchId);
      setSearchResult({
        id: searchId,
        name: pet.name,
        breed: pet.breed,
        birthDate: new Date(pet.birthDate.toNumber() * 1000),
        imageUrl: pet.imageUrl,
        description: pet.description,
        owner: pet.owner,
        registrationDate: new Date(pet.registrationDate.toNumber() * 1000),
        isActive: pet.isActive
      });
    } catch (err) {
      setSearchResult(null);
      alert('Pet not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) loadMyPets();
  }, [contract, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header
        account={account}
        connectWallet={connectWallet}
        openRegisterForm={() => setShowRegisterForm(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to Pet Registry</h2>
            <p className="text-lg text-gray-600">Connect your wallet to get started.</p>
          </div>
        ) : (
          <>
            <SearchSection
              searchId={searchId}
              setSearchId={setSearchId}
              searchPet={searchPet}
              searchResult={searchResult}
              loading={loading}
            />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Pets ({myPets.length})</h2>
            {loading ? (
              <p className="text-center">Loading pets...</p>
            ) : myPets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} isOwned={true} />
                ))}
              </div>
            ) : (
              <div className="text-center bg-white rounded-xl py-12 shadow">
                <p>No pets registered yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {showRegisterForm && (
        <RegisterPetModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowRegisterForm(false)}
          onSubmit={registerPet}
          loading={loading}
        />
      )}
    </div>
  );
}
