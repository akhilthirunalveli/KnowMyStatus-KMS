import React from 'react';
import { Lock, Unlock, Home } from 'lucide-react';

const PasswordModal = ({
  showPasswordModal,
  password,
  currentPasswordIndex,
  handlePasswordInput,
  closePasswordModal,
  checkPassword
}) => {
  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center">
      <div className="bg-black rounded-xl p-8 max-w-md w-full mx-4 relative">
        <div className="text-center mb-6">
          <Unlock className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white cabinet-grotesk">Enter Admin Password</h3>
          <p className="text-gray-400 text-sm mt-2">Enter the 3-character password</p>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              data-index={index}
              type="text"
              maxLength="1"
              value={password[index]}
              onChange={(e) => handlePasswordInput(index, e.target.value)}
              onKeyDown={(e) => {
                // Handle backspace to go to previous input
                if (e.key === 'Backspace' && !password[index] && index > 0) {
                  const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
                  if (prevInput) {
                    prevInput.focus();
                    prevInput.select();
                  }
                }
                // Handle Enter key to submit
                if (e.key === 'Enter' && password.every(char => char !== '')) {
                  checkPassword(password);
                }
              }}
              className="w-16 h-16 text-center text-2xl font-bold bg-black border border-gray-900 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase transition-all duration-200"
              autoFocus={index === currentPasswordIndex}
            />
          ))}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={closePasswordModal}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (password.every(char => char !== '')) {
                checkPassword(password);
              }
            }}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
};

const LockOverlay = ({ isLocked, handleUnlock }) => {
  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center px-4">
      <div className="text-center">
        <Lock className="h-16 w-16 sm:h-20 sm:w-20 text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 cabinet-grotesk">Admin Dashboard Locked</h2>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/"
            className="flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Go to Home"
          >
            <Home className="h-5 w-5" />
          </a>
          <button
            onClick={handleUnlock}
            className="px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Enter Password
          </button>
        </div>
      </div>
    </div>
  );
};

export { PasswordModal, LockOverlay };
