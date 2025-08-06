export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export const PET_REGISTRY_ABI = [
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
