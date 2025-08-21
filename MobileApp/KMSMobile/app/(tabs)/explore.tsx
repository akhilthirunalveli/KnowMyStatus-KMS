import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/services/api';

export default function SettingsScreen() {
  const [backendUrl, setBackendUrl] = useState('');
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('backendUrl');
      const savedDevMode = await AsyncStorage.getItem('isDevelopment');
      
      if (savedUrl) {
        setBackendUrl(savedUrl);
      }
      if (savedDevMode) {
        setIsDevelopment(JSON.parse(savedDevMode));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('backendUrl', backendUrl);
      await AsyncStorage.setItem('isDevelopment', JSON.stringify(isDevelopment));
      
      // Update API base URL
      if (backendUrl.trim()) {
        apiService.updateBaseUrl(backendUrl.trim());
      }
      
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const testConnection = async () => {
    if (!backendUrl.trim()) {
      Alert.alert('Error', 'Please enter a backend URL first');
      return;
    }

    setIsLoading(true);
    setConnectionStatus('unknown');

    try {
      // Update the API URL temporarily for testing
      apiService.updateBaseUrl(backendUrl.trim());
      
      // Try to fetch teachers to test connection
      await apiService.getAllTeachers();
      setConnectionStatus('connected');
      Alert.alert('Success', 'Successfully connected to backend!');
    } catch (error: any) {
      setConnectionStatus('failed');
      Alert.alert(
        'Connection Failed',
        error.message || 'Could not connect to the backend server'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setBackendUrl('');
            setIsDevelopment(false);
            setConnectionStatus('unknown');
            AsyncStorage.removeItem('backendUrl');
            AsyncStorage.removeItem('isDevelopment');
          },
        },
      ]
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'failed': return 'Connection Failed';
      default: return 'Not Tested';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="settings" size={28} color="#00ff88" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Configure your KMS Mobile app</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend Configuration</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Backend URL</Text>
            <TextInput
              style={styles.input}
              value={backendUrl}
              onChangeText={setBackendUrl}
              placeholder="https://your-backend.onrender.com"
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Development Mode</Text>
                <Text style={styles.switchDescription}>
                  Use localhost for development
                </Text>
              </View>
              <Switch
                value={isDevelopment}
                onValueChange={setIsDevelopment}
                trackColor={{ false: '#333', true: '#00ff88' }}
                thumbColor={isDevelopment ? '#000' : '#666'}
              />
            </View>
          </View>
          <View style={styles.connectionStatus}>
            <View style={styles.statusRow}>
              <Ionicons 
                name={connectionStatus === 'connected' ? 'checkmark-circle' : 
                      connectionStatus === 'failed' ? 'close-circle' : 'help-circle'} 
                size={24} 
                color={getConnectionStatusColor()} 
              />
              <Text style={[styles.statusText, { color: getConnectionStatusColor() }]}> 
                {getConnectionStatusText()}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={testConnection}
              disabled={isLoading}
            >
              <Ionicons name="wifi" size={20} color="black" />
              <Text style={styles.testButtonText}>
                {isLoading ? 'Testing...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveSettings}
            >
              <Ionicons name="save" size={20} color="black" />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>1</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>Expo React Native</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetToDefaults}
          >
            <Ionicons name="refresh" size={20} color="#ff4444" />
            <Text style={styles.resetButtonText}>
              Reset to Defaults
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  // brandContainer, brandText removed
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: 'CabinetGrotesk-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'CabinetGrotesk-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    fontFamily: 'CabinetGrotesk-Bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontFamily: 'CabinetGrotesk-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    fontFamily: 'CabinetGrotesk-Regular',
  },
  switchContainer: {
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'CabinetGrotesk-Regular',
  },
  switchDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontFamily: 'CabinetGrotesk-Regular',
  },
  connectionStatus: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: 'CabinetGrotesk-Bold',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  testButton: {
    backgroundColor: '#00ff88',
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    fontFamily: 'CabinetGrotesk-Bold',
  },
  saveButton: {
    backgroundColor: '#00ff88',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    fontFamily: 'CabinetGrotesk-Bold',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    fontFamily: 'CabinetGrotesk-Bold',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'CabinetGrotesk-Regular',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'CabinetGrotesk-Bold',
  },
});
