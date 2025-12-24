import React from 'react';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';

const ErrorView = ({ error, onRetry }) => {
    return (
        <div className="w-full max-w-sm mx-auto p-6 text-center">
            <div className="bg-[#0a0a0a] border border-red-500/20 rounded-2xl p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 cabinet-grotesk">Camera Error</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-[200px]">
                    {error || "We couldn't access your camera. Please check your permissions."}
                </p>

                <button
                    onClick={onRetry}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#ff3333] hover:bg-red-600 text-white rounded-xl font-bold transition-colors cabinet-grotesk"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default ErrorView;
