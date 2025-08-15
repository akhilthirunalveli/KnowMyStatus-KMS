export const parseQRData = (data) => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(data);
    return {
      isValid: true,
      type: 'json',
      data: parsed
    };
  } catch (e) {
    // If not JSON, check if it's a URL
    try {
      const url = new URL(data);
      return {
        isValid: true,
        type: 'url',
        data: { url: data }
      };
    } catch (urlError) {
      // If not a URL, treat as plain text
      return {
        isValid: true,
        type: 'text',
        data: { text: data }
      };
    }
  }
};

export const validateTeacherQR = (qrData) => {
  if (!qrData || typeof qrData !== 'object') {
    return { isValid: false, error: 'Invalid QR data format' };
  }

  const requiredFields = ['teacherId', 'teacherName'];
  const missingFields = requiredFields.filter(field => !qrData[field]);
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }

  return { isValid: true };
};

export const formatTeacherInfo = (teacherData) => {
  if (!teacherData) return null;

  return {
    id: teacherData.id,
    name: teacherData.name,
    email: teacherData.email,
    subject: teacherData.subject,
    department: teacherData.department,
    office: teacherData.office,
    status: teacherData.status || 'available',
    status_note: teacherData.status_note,
    status_until: teacherData.status_until,
    phone: teacherData.phone
  };
};
