import { Search } from 'lucide-react';
import PetCard from './PetCard';

export default function SearchSection({ searchId, setSearchId, searchPet, searchResult, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Search Pet by ID</h2>
      <div className="flex gap-4">
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Pet ID"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={searchPet}
          disabled={loading || !searchId}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>

      {searchResult && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Search Result:</h3>
          <div className="max-w-md">
            <PetCard pet={searchResult} />
          </div>
        </div>
      )}
    </div>
  );
}
