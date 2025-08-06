

# Pet Registry dApp

A decentralized application for registering and tracking pet ownership on the blockchain. This project allows pet owners to create secure, permanent records of their pets with on-chain proof of ownership.

---

## 🚀 Features

* 🐾 **Pet Registration**: Add pet details including name, breed, birth date, image, and description
* 🔒 **Ownership Tracking**: Verify on-chain proof of pet ownership
* 🔎 **Pet Search**: Search any registered pet by ID
* 👤 **Owner Dashboard**: View all pets owned by your connected wallet
* 🔁 **Transfer Ownership**: Send ownership of a pet to another address
* ✏️ **Update Info**: Edit your pet’s information (if you're the owner)

---

## 🧱 Architecture

### 📁 Component-Based Frontend

The React frontend is split into reusable components:

```
src/
├── components/
│   ├── Header.jsx              // Top bar with connect button
│   ├── RegisterPetModal.jsx   // Modal form to register a pet
│   ├── PetCard.jsx            // Display pet details
│   ├── SearchSection.jsx      // Search UI for pets by ID
├── hooks/
│   └── usePetContract.js      // Custom hook for contract interaction
├── utils/
│   └── constants.js           // ABI and contract address
└── App.jsx                    // Main component with state and logic
```

### 📦 React Technologies Used

* **React 18**: Hooks, component architecture
* **Tailwind CSS**: Fast and clean UI styling
* **ethers.js**: Ethereum interactions
* **Lucide React**: Clean icon set

---

## ⚙️ Smart Contract

### Language & Frameworks

* **Solidity (v0.8.19)** for smart contract logic
* **Hardhat** for development, testing, deployment
* **OpenZeppelin** libraries for security best practices

### Structure

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

* `registerPet()`: Create a new pet on-chain
* `getPet()`: View pet details by ID
* `getOwnerPets()`: List of pet IDs owned by a wallet
* `transferOwnership()`: Transfer a pet to another address
* `updatePetInfo()`: Edit a pet’s metadata (owner only)
* `getTotalPets()`: Get total number of pets registered

---

## 🌐 Blockchain Network

* **Network**: Base Sepolia (Layer 2)
* **Chain ID**: 84532
* **RPC URL**: `https://sepolia.base.org`
* **Explorer**: [https://sepolia.basescan.org](https://sepolia.basescan.org)

---

## 🛠 Installation & Setup

### 1. Clone & Install

```bash
git clone <repository-url>
cd pet-registry
npm install
```

### 2. Configure Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📦 Contract Deployment

### 1. Install Hardhat & Dependencies

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
```

### 2. Create Contract

Create `contracts/PetRegistry.sol` (see source code above).

### 3. Configure Network

```js
// hardhat.config.js
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY], // store safely in .env
      chainId: 84532,
    },
  },
};
```

### 4. Deploy to Base Sepolia

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

---

## 🔧 Frontend Development

### 1. Install Frontend Dependencies

```bash
npm install react ethers lucide-react
```

### 2. Run the App

```bash
npm start
```

---

## 👨‍💻 Usage Guide

### Connecting

* Click **Connect Wallet**
* Make sure you’re on the **Base Sepolia** network

### Registering a Pet

* Click **Register Pet**
* Fill in:

  * Name (required)
  * Breed (required)
  * Birth Date (required)
  * Image URL (optional)
  * Description (optional)
* Submit & confirm transaction

### Managing Pets

* **View My Pets**: Shows pets linked to your wallet
* **Search Pets**: Input pet ID to retrieve details
* **Transfer Ownership**: Enter new address (owner only)
* **Update Info**: Modify details like name, breed, image (owner only)

---

## 🤝 Contributing

Pull requests are welcome! Make sure to break logic into components, follow Tailwind class conventions, and keep code readable and modular.

---

## 📜 License

MIT – feel free to use, modify, and contribute.

---
