
import { Calendar, MapPin, User, Heart } from 'lucide-react';

export default function PetCard({ pet, isOwned = false }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        ) : <Heart className="w-16 h-16 text-purple-400" />}
      </div>

      <div className="p-6">
        <div className="flex justify-between mb-3">
          <h3 className="text-xl font-bold">{pet.name}</h3>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">#{pet.id}</span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Born: {pet.birthDate.toLocaleDateString()}</p>
          <p className="flex items-center gap-2"><User className="w-4 h-4" /> Owner: {pet.owner.slice(0, 6)}...{pet.owner.slice(-4)}</p>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Registered: {pet.registrationDate.toLocaleDateString()}</p>
        </div>

        {pet.description && <p className="text-sm text-gray-700">{pet.description}</p>}

        {isOwned && (
          <div className="mt-4 flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Edit Info</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">Transfer</button>
          </div>
        )}
      </div>
    </div>
  );
}
