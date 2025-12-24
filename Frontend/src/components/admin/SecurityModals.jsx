import React from 'react';
import { Lock, Unlock, Home, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
      <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0 w-full max-w-md">
        <div className="bg-[#050505] rounded-[1.4rem] p-8 relative overflow-hidden">

          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff3333]/5 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#ff3333]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ff3333]/20">
              <Unlock className="h-8 w-8 text-[#ff3333]" />
            </div>
            <h3 className="text-2xl font-bold text-white cabinet-grotesk mb-2">Admin Access</h3>
            <p className="text-gray-400 text-sm">Please enter the security PIN to unlock the dashboard.</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
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
                className="w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#ff3333] focus:bg-white/10 uppercase transition-all duration-200"
                autoFocus={index === currentPasswordIndex}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={closePasswordModal}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (password.every(char => char !== '')) {
                  checkPassword(password);
                }
              }}
              className="flex-1 px-4 py-3 bg-[#ff3333] text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LockOverlay = ({ isLocked, handleUnlock }) => {
  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-[#ff3333] blur-[40px] opacity-20 rounded-full"></div>
          <Lock className="relative h-24 w-24 text-[#ff3333] mx-auto z-10" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 cabinet-grotesk tracking-tight">Dashboard <span className="text-[#ff3333]">Locked</span></h2>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Security mode is active. You must authenticate to view or edit sensitive data.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors font-medium"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </a>
          <button
            onClick={handleUnlock}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ff3333] text-white rounded-xl transition-all font-bold text-lg shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            <Unlock className="h-5 w-5" />
            <span>Unlock Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { PasswordModal, LockOverlay };
