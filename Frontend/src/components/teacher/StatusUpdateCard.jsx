import React from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  StickyNote, 
  Save, 
  RefreshCw 
} from 'lucide-react';

const StatusUpdateCard = ({
  status,
  setStatus,
  statusNote,
  setStatusNote,
  statusUntilDate,
  setStatusUntilDate,
  statusUntilTime,
  setStatusUntilTime,
  statusLoading,
  handleStatusUpdate,
  getStatusColor
}) => {
  return (
    <div className="bg-gradient-to-br from-red-900/20 to-red-800/30 backdrop-blur-lg rounded-2xl border border-red-700/30 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="p-2 bg-red-800/50 rounded-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-lg font-semibold text-white">Status Update</h2>
            <p className="text-sm text-gray-400">Update your availability status</p>
          </div>
        </div>
        
        {/* Current Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <form onSubmit={handleStatusUpdate} className="space-y-4 sm:space-y-6">
        {/* Status Selection Pills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Status</label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setStatus('available')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === 'available' 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-800/40'
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setStatus('not_available')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === 'not_available' 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-red-900/30 text-red-400 border border-red-700/50 hover:bg-red-800/40'
              }`}
            >
              Not Available
            </button>
            <button
              type="button"
              onClick={() => setStatus('on_leave')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === 'on_leave' 
                  ? 'bg-orange-600 text-white border-orange-500' 
                  : 'bg-orange-900/30 text-orange-400 border border-orange-700/50 hover:bg-orange-800/40'
              }`}
            >
              On Leave
            </button>
            <button
              type="button"
              onClick={() => setStatus('lunch')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === 'lunch' 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-blue-900/30 text-blue-400 border border-blue-700/50 hover:bg-blue-800/40'
              }`}
            >
              Lunch
            </button>
            <button
              type="button"
              onClick={() => setStatus('in_meeting')}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                status === 'in_meeting' 
                  ? 'bg-purple-600 text-white border-purple-500' 
                  : 'bg-purple-900/30 text-purple-400 border border-purple-700/50 hover:bg-purple-800/40'
              }`}
            >
              In Meeting
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-white" />
              Note (optional)
            </label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white placeholder-gray-400 text-sm"
                type="text"
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="Add a note"
                maxLength={100}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white" />
              Expected Return Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white text-sm"
                type="date"
                value={statusUntilDate}
                onChange={e => setStatusUntilDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-white" />
              Expected Return Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white text-sm"
                type="time"
                value={statusUntilTime}
                onChange={e => setStatusUntilTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
            disabled={statusLoading}
          >
            {statusLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {statusLoading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>

      {/* Current Status Display */}
      {(statusNote || statusUntilDate || statusUntilTime) && (
        <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Current Status Details:</p>
          <div className="flex flex-col gap-1">
            {statusNote && <span className="text-xs text-gray-300">Note: {statusNote}</span>}
            {(statusUntilDate || statusUntilTime) && (
              <span className="text-xs text-gray-300">
                Until: {statusUntilDate && new Date(statusUntilDate).toLocaleDateString()}
                {statusUntilDate && statusUntilTime && ' at '}
                {statusUntilTime && new Date(`2000-01-01T${statusUntilTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusUpdateCard;
