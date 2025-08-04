import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Heart, PlusCircle, Search, Calendar, MapPin, User, Wallet } from 'lucide-react';

const PET_REGISTRY_ABI = [
  "struct Pet { string name; string breed; uint256 birthDate; string imageUrl; string description; address owner; uint256 registrationDate; bool isActive; }",
  "function registerPet(string memory _name, string memory _breed, uint256 _birthDate, string memory _imageUrl, string memory _description) external returns (uint256)",
  "function getPet(uint256 _petId) external view returns (tuple(string name, string breed, uint256 birthDate, string imageUrl, string description, address owner, uint256 registrationDate, bool isActive))",
  "function getOwnerPets(address _owner) external view returns (uint256[] memory)",
  "function transferOwnership(uint256 _petId, address _newOwner) external",
  "function updatePetInfo(uint256 _petId, string memory _name, string memory _breed, string memory _imageUrl, string memory _description) external",
  "function getTotalPets() external view returns (uint256)",
  "event PetRegistered(uint256 indexed petId, string name, address indexed owner)",
  "event OwnershipTransferred(uint256 indexed petId, address indexed previousOwner, address indexed newOwner)"
];

const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with actual deployed contract

export default function PetRegistry() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [pets, setPets] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    birthDate: '',
    imageUrl: '',
    description: ''
  });

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const petContract = new ethers.Contract(CONTRACT_ADDRESS, PET_REGISTRY_ABI, signer);
        setContract(petContract);
        
        // Switch to Base Sepolia if needed
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x14a34' }], // Base Sepolia chain ID
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x14a34',
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org']
              }]
            });
          }
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Load my pets
  const loadMyPets = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      const petIds = await contract.getOwnerPets(account);
      const petsData = [];
      
      for (let id of petIds) {
        const pet = await contract.getPet(id);
        petsData.push({
          id: id.toString(),
          name: pet.name,
          breed: pet.breed,
          birthDate: new Date(pet.birthDate.toNumber() * 1000),
          imageUrl: pet.imageUrl,
          description: pet.description,
          owner: pet.owner,
          registrationDate: new Date(pet.registrationDate.toNumber() * 1000),
          isActive: pet.isActive
        });
      }
      
      setMyPets(petsData);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register new pet
  const registerPet = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const birthTimestamp = Math.floor(new Date(formData.birthDate).getTime() / 1000);
      
      const tx = await contract.registerPet(
        formData.name,
        formData.breed,
        birthTimestamp,
        formData.imageUrl,
        formData.description
      );
      
      await tx.wait();
      
      // Reset form and refresh pets
      setFormData({ name: '', breed: '', birthDate: '', imageUrl: '', description: '' });
      setShowRegisterForm(false);
      await loadMyPets();
      
      alert('Pet registered successfully!');
    } catch (error) {
      console.error('Error registering pet:', error);
      alert('Error registering pet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Search for pet by ID
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
    } catch (error) {
      console.error('Error searching pet:', error);
      setSearchResult(null);
      alert('Pet not found or invalid ID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      loadMyPets();
    }
  }, [contract, account]);

  const PetCard = ({ pet, isOwned = false }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        ) : (
          <Heart className="w-16 h-16 text-purple-400" />
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            #{pet.id}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Breed:</span> {pet.breed}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Born: {pet.birthDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Owner: {pet.owner.slice(0, 6)}...{pet.owner.slice(-4)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Registered: {pet.registrationDate.toLocaleDateString()}</span>
          </div>
        </div>
        
        {pet.description && (
          <p className="text-gray-700 text-sm leading-relaxed">{pet.description}</p>
        )}
        
        {isOwned && (
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Edit Info
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pet Registry</h1>
            </div>
            
            {!account ? (
              <button
                onClick={connectWallet}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Register Pet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!account ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Pet Registry</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Register your beloved pets on the blockchain and create a permanent, secure record of ownership.
              Connect your wallet to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Search Pet by ID</h2>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Pet ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={searchPet}
                  disabled={loading || !searchId}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
              
              {searchResult && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Result:</h3>
                  <div className="max-w-md">
                    <PetCard pet={searchResult} />
                  </div>
                </div>
              )}
            </div>

            {/* My Pets Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Pets ({myPets.length})</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-gray-600">Loading pets...</p>
                </div>
              ) : myPets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} isOwned={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets registered yet</h3>
                  <p className="text-gray-600 mb-6">Register your first pet to get started!</p>
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Register Your First Pet
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Register Pet Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Register New Pet</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Buddy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Golden Retriever"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/pet-photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about your pet..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegisterForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={registerPet}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Registering...' : 'Register Pet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}