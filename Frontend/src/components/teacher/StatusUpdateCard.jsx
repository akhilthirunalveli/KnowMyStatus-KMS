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
    <div className="premium-card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="p-3 bg-[#ff3333]/10 rounded-2xl">
            <Activity className="h-6 w-6 text-[#ff3333]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-cabinet-grotesk text-white">Status Update</h2>
            <p className="text-sm text-gray-400">Set your live availability</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleStatusUpdate} className="space-y-8">
        {/* Status Selection Chips */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Select Status</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'available', label: 'Available' },
              { id: 'not_available', label: 'Do Not Disturb' },
              { id: 'in_meeting', label: 'In Meeting' },
              { id: 'on_leave', label: 'On Leave' },
              { id: 'lunch', label: 'Lunch' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatus(item.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${status === item.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-gray-400 border-white/10'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Duration Buttons */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Duration
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: '+1 Hour', mins: 60 },
              { label: '+2 Hours', mins: 120 },
              { label: '+4 Hours', mins: 240 }
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  const now = new Date();
                  const future = new Date(now.getTime() + opt.mins * 60000);
                  setStatusUntilDate(future.toISOString().split('T')[0]);
                  setStatusUntilTime(future.toTimeString().slice(0, 5));
                  if (status === 'available') setStatus('not_available');
                }}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/5 transition-colors"
              >
                {opt.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const future = new Date(now.setHours(17, 0, 0, 0));
                if (future < new Date()) future.setDate(future.getDate() + 1);
                setStatusUntilDate(future.toISOString().split('T')[0]);
                setStatusUntilTime(future.toTimeString().slice(0, 5));
                if (status === 'available') setStatus('not_available');
              }}
              className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 border border-white/5 transition-colors"
            >
              Until 5 PM
            </button>

            <button
              type="button"
              onClick={() => {
                setStatusUntilDate('');
                setStatusUntilTime('');
              }}
              className="px-4 py-2 rounded-lg bg-transparent text-red-400 border border-red-500/20 transition-colors ml-auto"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Note</label>
            <div className="group relative">
              <StickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] focus:outline-none text-white placeholder-gray-600 transition-all"
                type="text"
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="Details (e.g. 'In Lab 3')"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Return Date</label>
            <div className="group relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] focus:outline-none text-white transition-all [color-scheme:dark]"
                type="date"
                value={statusUntilDate}
                onChange={e => setStatusUntilDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Return Time</label>
            <div className="group relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
              <input
                className="w-full pl-10 pr-3 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#ff3333] focus:ring-1 focus:ring-[#ff3333] focus:outline-none text-white transition-all [color-scheme:dark]"
                type="time"
                value={statusUntilTime}
                onChange={e => setStatusUntilTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            className="bg-[#ff3333] text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
            disabled={statusLoading}
          >
            {statusLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {statusLoading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusUpdateCard;
