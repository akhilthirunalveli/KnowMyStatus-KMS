import React from 'react';
import { getStatusBadgeClasses, getStatusText } from '../../utils/uiUtils';

const StatusBadge = ({ status }) => {
  return (
    <span className={getStatusBadgeClasses(status)}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
