import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import QRScanner from '@/components/QRScanner';
import StatusDisplay from '@/components/StatusDisplay';
import { apiService, TeacherStatus } from '@/services/api';

export default function HomeScreen() {
  const [currentState, setCurrentState] = useState<'home' | 'scanning' | 'status'>('home');
  const [teacherData, setTeacherData] = useState<TeacherStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartScan = () => setCurrentState('scanning');

  const handleQRScanned = async (qrData: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.verifyQRCode(qrData);
      if (response.success) {
        setTeacherData(response.teacher);
        setCurrentState('status');
      } else {
        Alert.alert('Error', response.message || 'Invalid QR code');
        setCurrentState('home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify QR code.');
      setCurrentState('home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!teacherData) return;
    setIsLoading(true);
    try {
      const updatedTeacher = await apiService.getTeacherStatus(teacherData.id);
      setTeacherData(updatedTeacher);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to refresh status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentState('home');
    setTeacherData(null);
  };

  if (currentState === 'scanning') {
    return <QRScanner onScan={handleQRScanned} onClose={() => setCurrentState('home')} />;
  }

  if (currentState === 'status' && teacherData) {
    return (
      <StatusDisplay
        teacher={teacherData}
        onClose={handleClose}
        onRefresh={handleRefreshStatus}
        isLoading={isLoading}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#fff', fontSize: 24, marginBottom: 24 }}>KnowMyStatus</Text>
      <Button title="Scan QR Code" onPress={handleStartScan} color="#ef4444" />
    </View>
  );
}
