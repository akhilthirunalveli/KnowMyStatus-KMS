# KMS Mobile - QR Scanner App

A React Native mobile application for scanning QR codes and checking teacher availability status in real-time.

## Features

- **QR Code Scanning**: Scan teacher QR codes using device camera
- **Real-time Status**: View teacher availability, location, and last updated time
- **Beautiful UI**: Modern gradient design with smooth animations
- **Settings Configuration**: Configure backend URL and connection settings
- **Cross-platform**: Works on iOS and Android devices

## Screenshots

### Main Scanner Screen
- Clean, gradient-based interface
- Quick scan button with camera icon
- Feature highlights (Real-time Status, Instant Verification, Secure Access)

### QR Scanner
- Full-screen camera view with overlay
- Scanning frame with corner indicators
- Flash toggle and rescan functionality
- Permission handling for camera access

### Status Display
- Teacher profile with avatar
- Color-coded status indicators (Available, Busy, Meeting, Offline)
- Room and department information
- Refresh functionality for real-time updates

### Settings Screen
- Backend URL configuration
- Development mode toggle
- Connection testing
- App information and version details

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup Instructions

1. **Navigate to the mobile app directory:**
   ```bash
   cd MobileApp/KMSMobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the backend URL:**
   - Open the app and go to Settings tab
   - Enter your backend URL (e.g., `https://your-backend.onrender.com`)
   - Test the connection to ensure it's working
   - Save the settings

4. **Run the app:**
   
   For development:
   ```bash
   npm start
   ```

   For Android:
   ```bash
   npm run android
   ```

   For iOS:
   ```bash
   npm run ios
   ```

   For Web:
   ```bash
   npm run web
   ```

## Configuration

### Backend Integration

The app connects to your KMS backend through configurable API endpoints:

- **QR Verification**: `POST /api/qr/verify`
- **Teacher Status**: `GET /api/teachers/status/:id`
- **All Teachers**: `GET /api/teachers`

### Environment Settings

1. **Development Mode**: Uses localhost for testing
2. **Production Mode**: Uses configured backend URL
3. **Connection Testing**: Built-in functionality to verify backend connectivity

## App Structure

```
KMSMobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main scanner screen
│   │   ├── explore.tsx        # Settings screen
│   │   └── _layout.tsx        # Tab navigation
├── components/
│   ├── QRScanner.tsx          # QR scanning component
│   └── StatusDisplay.tsx      # Teacher status display
├── services/
│   └── api.ts                 # API service layer
├── config/
│   └── api.ts                 # API configuration
└── assets/                    # Images and icons
```

## Key Components

### QRScanner Component
- Camera integration with expo-camera
- Barcode scanning with expo-barcode-scanner
- Overlay with scanning frame
- Flash control and permission handling

### StatusDisplay Component
- Teacher information display
- Status color coding and icons
- Refresh functionality
- Last updated time formatting

### API Service
- Axios-based HTTP client
- Token management with AsyncStorage
- Error handling and response interceptors
- Configurable base URL

## Permissions

The app requires the following permissions:

### Android
- `CAMERA`: For QR code scanning
- `INTERNET`: For API communication

### iOS
- `NSCameraUsageDescription`: Camera access for QR scanning

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### App Store Deployment
```bash
expo submit:ios
```

### Google Play Store
```bash
expo submit:android
```

## Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Go to device settings and enable camera permission for the app
   - Restart the app after granting permissions

2. **Connection Failed**
   - Check your backend URL in settings
   - Ensure your backend server is running and accessible
   - Test the connection using the built-in test feature

3. **QR Code Not Scanning**
   - Ensure good lighting conditions
   - Hold the device steady
   - Make sure the QR code is within the scanning frame

4. **App Crashes on Startup**
   - Clear app data and cache
   - Reinstall the app
   - Check device compatibility

### Backend Configuration

Make sure your backend includes the mobile app's domain in CORS settings:

```javascript
// In your backend server.js
app.use(cors({
  origin: [
    'http://localhost:8081',  // Expo dev server
    'exp://192.168.1.100:8081',  // Expo tunnel
    // Add your production mobile app URLs
  ],
  credentials: true
}));
```

## Version History

- **v1.0.0**: Initial release with QR scanning and status display
  - QR code scanning functionality
  - Teacher status display
  - Settings configuration
  - Cross-platform support

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **Expo Camera**: Camera functionality
- **Expo Barcode Scanner**: QR code scanning
- **Expo Linear Gradient**: UI gradients
- **AsyncStorage**: Local data persistence
- **Axios**: HTTP client for API calls

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Ensure your backend is properly configured
3. Test API endpoints using the settings screen
4. Check device compatibility and permissions

## License

This project is part of the KnowMyStatus (KMS) system and follows the same licensing terms as the main project.