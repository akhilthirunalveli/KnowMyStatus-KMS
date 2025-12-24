export const getStatusColor = (status) => {
  switch(status) {
    case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'not_available': return 'bg-red-100 text-red-800 border-red-200';
    case 'on_leave': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'lunch': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusBadgeClasses = (status) => {
  const statusColors = {
    available: 'bg-green-500/20 text-green-400 border-green-500/30',
    not_available: 'bg-red-500/20 text-red-400 border-red-500/30',
    on_leave: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    lunch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    in_meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };
  
  return `px-2 py-1 rounded-full text-xs border ${statusColors[status] || statusColors.available}`;
};

export const getStatusText = (status) => {
  return status ? status.replace('_', ' ').toUpperCase() : 'AVAILABLE';
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
    hour: '2-digit', 
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
