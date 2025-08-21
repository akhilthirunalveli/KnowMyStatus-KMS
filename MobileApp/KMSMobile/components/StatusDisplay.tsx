import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TeacherStatus } from '../services/api';

interface StatusDisplayProps {
  teacher: TeacherStatus;
  onClose: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return '#4CAF50';
    case 'busy':
      return '#FF9800';
    case 'meeting':
      return '#F44336';
    case 'offline':
      return '#9E9E9E';
    default:
      return '#9E9E9E';
  }
};

const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
  switch (status) {
    case 'available':
      return 'checkmark-circle';
    case 'busy':
      return 'time';
    case 'meeting':
      return 'people';
    case 'offline':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default function StatusDisplay({ 
  teacher, 
  onClose, 
  onRefresh, 
  isLoading = false 
}: StatusDisplayProps) {
  const statusColor = getStatusColor(teacher.status);
  const statusIcon = getStatusIcon(teacher.status);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onRefresh} 
            style={styles.refreshButton}
            disabled={isLoading}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color="white" 
              style={isLoading ? styles.rotating : undefined}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Teacher Status</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: statusColor }]}> 
            <Text style={styles.avatarText}>
              {teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherEmail}>{teacher.email}</Text>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusCard, { borderLeftColor: statusColor }]}> 
            <View style={styles.statusHeader}>
              <Ionicons name={statusIcon} size={32} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}> 
                {teacher.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.statusDetails}>
              {teacher.room && (
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#00ff88" />
                  <Text style={styles.detailText}>Room: {teacher.room}</Text>
                </View>
              )}
              {teacher.department && (
                <View style={styles.detailRow}>
                  <Ionicons name="business" size={20} color="#00ff88" />
                  <Text style={styles.detailText}>Dept: {teacher.department}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Ionicons name="time" size={20} color="#00ff88" />
                <Text style={styles.detailText}>
                  Updated: {formatLastUpdated(teacher.lastUpdated)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={onClose}>
            <Ionicons name="qr-code" size={24} color="#00ff88" />
            <Text style={styles.scanAgainText}>Scan Another QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  // brandContainer, brandText removed
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'CabinetGrotesk-Bold',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  rotating: {
    // Add rotation animation if needed
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'CabinetGrotesk-Bold',
  },
  teacherName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    fontFamily: 'CabinetGrotesk-Bold',
  },
  teacherEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'CabinetGrotesk-Regular',
  },
  statusSection: {
    marginBottom: 30,
  },
  statusCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    fontFamily: 'CabinetGrotesk-Bold',
  },
  statusDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 10,
    fontFamily: 'CabinetGrotesk-Regular',
  },
  actionSection: {
    alignItems: 'center',
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'CabinetGrotesk-Bold',
  },
});
