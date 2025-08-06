import { Heart, Wallet, PlusCircle } from 'lucide-react';

export default function Header({ account, connectWallet, openRegisterForm }) {
  return (
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
                onClick={openRegisterForm}
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
  );
}
