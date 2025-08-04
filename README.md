# Pet Registry dApp

A decentralized application for registering and tracking pet ownership on the blockchain. This project allows pet owners to create permanent, secure records of their pets with proof of ownership.

## Features

- **Pet Registration**: Register pets with details including name, breed, birth date, image, and description
- **Ownership Tracking**: Secure on-chain proof of pet ownership
- **Pet Search**: Search for any registered pet by ID
- **Owner Dashboard**: View all pets owned by your wallet
- **Transfer Ownership**: Transfer pet ownership to another address
- **Update Pet Info**: Modify pet details (owner only)

## Technology Stack

### Smart Contract
- **Solidity**: Smart contract development
- **Hardhat/Foundry**: Development framework
- **OpenZeppelin**: Security standards and utilities

### Frontend
- **React 18**: Frontend framework with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **ethers.js**: Ethereum blockchain interaction
- **Lucide React**: Modern icon library

### Network
- **Base Sepolia Testnet**: Layer 2 testing environment
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org

## Smart Contract Structure

```solidity
struct Pet {
    string name;
    string breed;
    uint256 birthDate;
    string imageUrl;
    string description;
    address owner;
    uint256 registrationDate;
    bool isActive;
}
```

### Key Functions
- `registerPet()`: Register a new pet
- `getPet()`: Retrieve pet information by ID
- `getOwnerPets()`: Get all pets owned by an address
- `transferOwnership()`: Transfer pet to new owner
- `updatePetInfo()`: Update pet details

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MetaMask or compatible Web3 wallet
- Git

### Smart Contract Deployment

1. **Clone and setup the project**:
```bash
git clone <repository-url>
cd pet-registry
npm install
```

2. **Install Hardhat dependencies**:
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
```

3. **Create the smart contract**:
```solidity
// contracts/PetRegistry.sol
pragma solidity ^0.8.19;

contract PetRegistry {
    struct Pet {
        string name;
        string breed;
        uint256 birthDate;
        string imageUrl;
        string description;
        address owner;
        uint256 registrationDate;
        bool isActive;
    }
    
    mapping(uint256 => Pet) public pets;
    mapping(address => uint256[]) public ownerPets;
    uint256 public totalPets;
    
    event PetRegistered(uint256 indexed petId, string name, address indexed owner);
    event OwnershipTransferred(uint256 indexed petId, address indexed previousOwner, address indexed newOwner);
    
    function registerPet(
        string memory _name,
        string memory _breed,
        uint256 _birthDate,
        string memory _imageUrl,
        string memory _description
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_breed).length > 0, "Breed required");
        require(_birthDate <= block.timestamp, "Birth date cannot be in future");
        
        uint256 petId = totalPets++;
        
        pets[petId] = Pet({
            name: _name,
            breed: _breed,
            birthDate: _birthDate,
            imageUrl: _imageUrl,
            description: _description,
            owner: msg.sender,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        ownerPets[msg.sender].push(petId);
        
        emit PetRegistered(petId, _name, msg.sender);
        return petId;
    }
    
    function getPet(uint256 _petId) external view returns (Pet memory) {
        require(_petId < totalPets, "Pet does not exist");
        return pets[_petId];
    }
    
    function getOwnerPets(address _owner) external view returns (uint256[] memory) {
        return ownerPets[_owner];
    }
    
    function transferOwnership(uint256 _petId, address _newOwner) external {
        require(_petId < totalPets, "Pet does not exist");
        require(pets[_petId].owner == msg.sender, "Not pet owner");
        require(_newOwner != address(0), "Invalid new owner");
        require(_newOwner != msg.sender, "Already owner");
        
        address previousOwner = pets[_petId].owner;
        pets[_petId].owner = _newOwner;
        
        // Remove from previous owner's list
        uint256[] storage prevOwnerPets = ownerPets[previousOwner];
        for (uint256 i = 0; i < prevOwnerPets.length; i++) {
            if (prevOwnerPets[i] == _petId) {
                prevOwnerPets[i] = prevOwnerPets[prevOwnerPets.length - 1];
                prevOwnerPets.pop();
                break;
            }
        }
        
        // Add to new owner's list
        ownerPets[_newOwner].push(_petId);
        
        emit OwnershipTransferred(_petId, previousOwner, _newOwner);
    }
    
    function updatePetInfo(
        uint256 _petId,
        string memory _name,
        string memory _breed,
        string memory _imageUrl,
        string memory _description
    ) external {
        require(_petId < totalPets, "Pet does not exist");
        require(pets[_petId].owner == msg.sender, "Not pet owner");
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_breed).length > 0, "Breed required");
        
        pets[_petId].name = _name;
        pets[_petId].breed = _breed;
        pets[_petId].imageUrl = _imageUrl;
        pets[_petId].description = _description;
    }
    
    function getTotalPets() external view returns (uint256) {
        return totalPets;
    }
}
```

4. **Configure Hardhat for Base Sepolia**:
```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY], // Add your private key to .env
      chainId: 84532,
    },
  },
};
```

5. **Deploy the contract**:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

6. **Update the contract address** in the React component.

### Frontend Setup

1. **Install frontend dependencies**:
```bash
npm install react ethers lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. **Configure Tailwind CSS**:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. **Add Tailwind directives to CSS**:
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Start the development server**:
```bash
npm start
```

## Usage Guide

### Getting Started

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Network Setup**: The app will automatically switch to Base Sepolia testnet
3. **Get Test ETH**: Use the Base Sepolia faucet to get test tokens

### Registering a Pet

1. Click "Register Pet" button
2. Fill in the registration form:
   - **Pet Name**: Your pet's name (required)
   - **Breed**: Pet breed or type (required)
   - **Birth Date**: When your pet was born (required)
   - **Image URL**: Link to a photo of your pet (optional)
   - **Description**: Additional details about your pet (optional)
3. Click "Register Pet" and confirm the transaction
4. Wait for transaction confirmation

### Managing Your Pets

- **View My Pets**: See all pets registered to your wallet
- **Search Pets**: Look up any pet by entering its ID number
- **Transfer Ownership**: Transfer a pet to another wallet address
- **Update Info**: Modify pet details (name, breed, image, description)
