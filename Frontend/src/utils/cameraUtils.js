export const initializeCamera = async (constraints) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw error;
  }
};

export const stopCamera = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const switchCamera = async (currentDeviceId, videoDevices) => {
  if (videoDevices.length <= 1) return currentDeviceId;
  
  const currentIndex = videoDevices.findIndex(device => device.deviceId === currentDeviceId);
  const nextIndex = (currentIndex + 1) % videoDevices.length;
  return videoDevices[nextIndex].deviceId;
};

export const requestCameraPermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return 'prompt';
  }
};

export const getVideoDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting video devices:', error);
    return [];
  }
};
